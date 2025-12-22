import { useState } from "react";
import "./App.css";

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

interface FormData extends AbilityScores {
  // formaDAta успадковує AbilityScores від Ability, вони опціональні
  name: string;
  email: string;
  age: number | null;
  message: string;
  race: Race;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: null,
    message: "",
    race: "Human",
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

  const raceSpecificsInputs = RACE_MAP[formData.race]; // замість if / else

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? null : Number(value)) : value, // name = 'name' : 'Oleg', name = 'email' : 'sad@gmail'...
    }));
  };
  console.log(formData);

  const totalPower =
    raceSpecificsInputs?.reduce((acc, ability) => {
      const value = Number(formData[ability]) || 0;
      return acc + value;
    }, 0) || 0;

  const handleSubmit = (event: React.FormEvent) => {
    // 1. Зупиняємо перезавантаження сторінки (стандартна поведінка браузера)
    event.preventDefault();

    // 2. Валідація: якщо сума занадто велика, не відправляємо
    if (totalPower > 20) {
      alert("Персонаж занадто потужний! Максимум 20 очок.");
      return;
    }

    setFormData({
      name: "",
      email: "",
      age: null,
      message: "",
      race: "Human",
    });

    // 3. Логіка відправки (наприклад, вивід у консоль або запит на сервер)
    console.log("Дані форми відправлено:", formData);
    alert(`Персонаж ${formData.name} створений!`);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          name:
          <input name="name" value={formData.name} onChange={handleChange} />
        </label>

        <label>
          email :
          <input name="email" value={formData.email} onChange={handleChange} />
        </label>

        <label>
          age :
          <input
            type="number"
            value={formData.age ?? ""}
            name="age"
            onChange={handleChange}
          />
          {formData.age !== null && formData.age < 18 && (
            <span className="error">Тільки для повнолітніх</span>
          )}
        </label>

        <label>
          race:
          <select name="race" onChange={handleChange} value={formData.race}>
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
              {ability}: <strong>{formData[ability] || 0}</strong>
              <input
                type="range"
                min="0"
                max="10"
                value={formData[ability] || 0}
                onChange={handleChange}
                name={ability}
              />
            </label>
          ))}
        </label>

        <div className="power-counter">
          Total Power: {totalPower} / 20
          {totalPower > 20 && (
            <span className="error" style={{ marginLeft: "10px" }}>
              ⚠️ Занадто потужно!
            </span>
          )}
        </div>

        <label>
          message :
          <textarea
            name="message"
            onChange={handleChange}
            value={formData.message}
          />
        </label>

        <div className="actions">
          <button
            type="submit"
            disabled={
              totalPower > 20 ||
              !formData.name ||
              !formData.age ||
              !formData.email
            }
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
