import {
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { type FormData } from "../App";

type TextAreaComponentProps<T extends FormData> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
  rows?: number;
};

const TextAreaComponent = <T extends FormData>({
  label,
  name,
  register,
  errors,
  placeholder,
  rows = 4,
}: TextAreaComponentProps<T>) => {
  const error = errors[name]?.message as string | undefined;

  return (
    <label>
      {label}:
      <textarea rows={rows} placeholder={placeholder} {...register(name)} />
      {error && <p className="error">{error}</p>}
    </label>
  );
};

export default TextAreaComponent;
