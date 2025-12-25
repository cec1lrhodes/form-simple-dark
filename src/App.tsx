import "./App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";
import { InputComponent } from "./components/InputComponent";
import TextAreaComponent from "./components/TextAreaComponent";

const RACES = {
  HUMAN: "Human",
  ELF: "Elf",
  DWARF: "Dwarf",
  GOBLIN: "Goblin",
  ORC: "Orc",
  VAMPIRE: "Vampire",
} as const; // без as const HUMAN: string / as const HUMAN: "Human" - ELF: "Elf"

type Race = (typeof RACES)[keyof typeof RACES];
// "Human" | "Elf" | "Dwarf" ... автоматично додасться нова раса, не треба писати вручну

type Ability =
  | "intelligence"
  | "speed"
  | "stealth"
  | "strength"
  | "shields"
  | "movement";

type AbilityScores = {
  [K in Ability]?: number; // // [K in Ability] - це MAPPED TYPE (проходимося по кожному значенню) intelligence, speed....
};

export interface FormData extends AbilityScores {
  // formaDAta успадковує AbilityScores від Ability, вони опціональні
  name: string;
  email: string;
  age: number;
  message?: string;
  race: Race;
}

const abilities: Ability[] = [
  "intelligence",
  "speed",
  "stealth",
  "strength",
  "shields",
  "movement",
] as const;

const schema: yup.ObjectSchema<FormData> = yup
  .object({
    name: yup.string().required("Ім'я обов'язкове").min(2, "Занадто коротке"),
    email: yup
      .string()
      .email("Невірний формат email")
      .required("Email обов'язковий"),
    age: yup
      .number()
      .typeError("Введіть число")
      .required()
      .min(18, "Тільки для повнолітніх"),
    race: yup.string<Race>().required("Оберіть расу"),
    message: yup.string().max(200, "Максимум 200 символів").optional(),
    intelligence: yup.number().min(0).max(10).optional(),
    speed: yup.number().min(0).max(10).optional(),
    stealth: yup.number().min(0).max(10).optional(),
    strength: yup.number().min(0).max(10).optional(),
    shields: yup.number().min(0).max(10).optional(),
    movement: yup.number().min(0).max(10).optional(),
    // Динамічні поля AbilityScores (Yup дозволяє перевіряти суму)
  })
  .test("total-power", "Занадто потужно!", (values) => {
    // Тут ми можемо вирахувати суму прямо в схемі

    const sum = abilities.reduce(
      (acc, key) => acc + (Number(values[key as keyof typeof values]) || 0),
      0
    );
    return sum <= 20;
  });

const RACE_MAP: Record<Race, Ability[] | null> = {
  //// Record<ТипКлючів, ТипЗначень>
  //  Elf: ["magic"], //  ERROR: "magic" не є Ability
  Human: null,
  Elf: ["intelligence", "speed", "stealth"],
  Dwarf: ["strength", "shields", "movement"],
  Goblin: null,
  Orc: null,
  Vampire: ["shields"],
};

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      age: undefined,
      message: "",
      race: "Human",
      intelligence: 0,
      speed: 0,
      stealth: 0,
      strength: 0,
      shields: 0,
      movement: 0,
    },
    mode: "onChange", // валідація при кожній зміні
  });

  const currentRace = watch("race");
  // currentRace = "Human" | "Elf" | "Dwarf" ...
  // Оновлюється тільки коли "race" змінюється
  const allFields = watch();

  const previousRaceRef = React.useRef<Race>(currentRace); // не відбувається лишній ререндер, як при звичайному useState

  React.useEffect(() => {
    if (previousRaceRef.current !== currentRace) {
      abilities.forEach((ability) => {
        setValue(ability, 0);
      });

      previousRaceRef.current = currentRace;
    }
  }, [currentRace, setValue]);

  const totalPower = abilities.reduce(
    (acc, key) => acc + (Number(allFields[key]) || 0),
    0
  );

  const onSubmit = (data: FormData) => {
    console.log("Відправлено через RHF:", data);
    alert(`Персонаж ${data.name} створений!`);
    reset(); // очищення форми
  };

  const raceSpecificsInputs = RACE_MAP[currentRace]; // замість if / else ->[ELF] raceSpecificsInputs = ["intelligence", "speed", "stealth"] | [DWARF] raceSpecificsInputs = ["strength", "shields", "movement"]
  // if (currentRace === "Elf") {
  //   raceSpecificsInputs = ["intelligence", "speed", "stealth"];
  // } else if (currentRace === "Dwarf") {
  //   raceSpecificsInputs = ["strength", "shields", "movement"];
  // } else if (currentRace === "Vampire") {
  //   raceSpecificsInputs = ["shields"];
  // } else {
  //   raceSpecificsInputs = null;
  // }

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputComponent
          label="name"
          name="name"
          register={register}
          errors={errors}
          type="text"
        />

        <InputComponent
          label="email"
          name="email"
          register={register}
          errors={errors}
          type="text"
        />

        <InputComponent
          label="age"
          name="age"
          register={register}
          errors={errors}
          type="number"
        />

        <label>
          race:
          <select {...register("race")}>
            {Object.values(RACES).map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </label>

        <label>
          {!raceSpecificsInputs && (
            <p className="no-abilities">Для цієї раси немає здібностей</p>
          )}
          {raceSpecificsInputs?.map((ability) => (
            <label key={ability}>
              {ability}: <strong>{allFields[ability] || 0}</strong>
              <input
                type="range"
                min="0"
                max="10"
                {...register(ability, { valueAsNumber: true })}
              />
            </label>
          ))}
        </label>

        <div className="power-counter">
          Total Power: {totalPower} / 20
          {totalPower > 20 && (
            <span className="error">⚠️ Занадто потужно!</span>
          )}
        </div>

        <TextAreaComponent
          label="message"
          name="message"
          register={register}
          errors={errors}
          placeholder="Type some message..."
        />

        <div className="actions">
          <button type="submit" disabled={!isValid}>
            submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
