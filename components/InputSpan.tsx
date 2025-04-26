import { Input } from "@/components/ui/input";
import clsx from "clsx";

const InputSpan = ({
  isInput,
  value,
  onChange,
  inputType,
  className,
}: {
  isInput?: boolean;
  value?: string | number;
  onChange?: (value: string | number) => void;
  inputType?: string;
  className?: string;
}) => {
  if (isInput) {
    return (
      <Input
        type={inputType}
        value={value}
        className={clsx(className, "w-[50px]")}
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  }

  return <span className={className}>{value}</span>;
};

export default InputSpan;
