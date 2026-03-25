import { Minus, Plus } from "lucide-react";

interface PersonCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PersonCounter = ({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
}: PersonCounterProps) => {
  return (
    <div>
      <span className="text-black-80 text-sm font-medium tracking-tight">
        {label}
      </span>
      <div className="flex items-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-separator-90 flex items-center justify-center text-black-50 hover:border-black-30 transition-colors disabled:opacity-30"
          disabled={value <= min}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-jakarta font-semibold text-base text-black-100 w-6 text-center tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full border border-separator-90 flex items-center justify-center text-black-50 hover:border-black-30 transition-colors disabled:opacity-30"
          disabled={value >= max}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PersonCounter;
