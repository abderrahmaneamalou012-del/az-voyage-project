import { ChevronDown } from "lucide-react";

export interface SortDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SortDropdown = ({ value, options, onChange }: SortDropdownProps) => {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-sm text-black-50 tracking-tight whitespace-nowrap">
        Trier par :
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent text-sm font-medium text-black-80 tracking-tight pr-6 cursor-pointer focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black-30 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortDropdown;
