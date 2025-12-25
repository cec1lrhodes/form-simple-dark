import { type FormData } from "../App";
import {
  type UseFormRegister,
  type FieldErrors,
  type Path,
} from "react-hook-form";

interface InputComponentProps<T extends FormData> {
  label: string;
  name: Path<T>; // Path<T> - це тип з react-hook-form, який гарантує, що name є ключем FormData
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  type?: "text" | "email" | "number";
  placeholder?: string;
}

export function InputComponent<T extends FormData>({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder,
}: InputComponentProps<T>) {
  // Отримуємо помилку для конкретного поля
  const error = errors[name]?.message as string | undefined;

  return (
    <label>
      {label}:
      <input type={type} placeholder={placeholder} {...register(name)} />
      {error && <p className="error">{error}</p>}
    </label>
  );
}
