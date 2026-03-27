import { ChevronDown, Info } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

const availabilityOptions: Option[] = [
  { value: "all", label: "Toutes les offres" },
  { value: "available", label: "Disponibles" },
  { value: "almost", label: "Bientôt complètes" },
];

const durationOptions: Option[] = [
  { value: "all", label: "Toutes les durées" },
  { value: "3-4", label: "3 à 4 jours" },
  { value: "5-6", label: "5 à 6 jours" },
  { value: "7+", label: "7 jours et plus" },
];

const inclusionOptions: Option[] = [
  { value: "flight", label: "Vol inclus" },
  { value: "hotel", label: "Hébergement" },
  { value: "transfer", label: "Transfert" },
  { value: "assistance", label: "Assistance" },
];

export interface FilterSidebarProps {
  destinations: string[];
  selectedDestination: string;
  onDestinationChange: (value: string) => void;
  countries: string[];
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  availability: string;
  onAvailabilityChange: (value: string) => void;
  budgetMin: string;
  budgetMax: string;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  inclusions: string[];
  onInclusionsChange: (values: string[]) => void;
  onReset: () => void;
}

const FilterSidebar = ({
  destinations,
  selectedDestination,
  onDestinationChange,
  countries,
  selectedCountry,
  onCountryChange,
  availability,
  onAvailabilityChange,
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
  duration,
  onDurationChange,
  inclusions,
  onInclusionsChange,
  onReset,
}: FilterSidebarProps) => {
  const toggleInclusion = (value: string) => {
    onInclusionsChange(
      inclusions.includes(value)
        ? inclusions.filter((entry) => entry !== value)
        : [...inclusions, value],
    );
  };

  return (
    <aside className="w-full shrink-0 lg:w-[320px] xl:w-[340px]">
      <div className="sticky top-24 rounded-2xl border border-separator-90 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-jakarta text-xl font-bold tracking-tight text-black-100">
            Filtres
          </h3>
          <button
            onClick={onReset}
            className="text-sm tracking-tight text-black-50 transition-colors hover:text-black-80"
          >
            Réinitialiser
          </button>
        </div>

        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-100">
            Destination
          </h4>
          <div className="relative">
            <select
              value={selectedDestination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-separator-90 bg-white px-4 py-3 text-sm tracking-tight text-black-80 focus:border-navy-40 focus:outline-none"
            >
              <option value="all">Toutes les destinations</option>
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black-30" />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-100">
            Pays
          </h4>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-separator-90 bg-white px-4 py-3 text-sm tracking-tight text-black-80 focus:border-navy-40 focus:outline-none"
            >
              <option value="all">Tous les pays</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black-30" />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-100">
            Disponibilité
          </h4>
          <div className="space-y-2.5">
            {availabilityOptions.map((option) => (
              <label
                key={option.value}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  checked={availability === option.value}
                  onChange={(e) => onAvailabilityChange(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                    availability === option.value
                      ? "border-navy-100"
                      : "border-black-20 group-hover:border-black-50"
                  }`}
                >
                  {availability === option.value && (
                    <div className="h-2 w-2 rounded-full bg-navy-100" />
                  )}
                </div>
                <span className="text-sm tracking-tight text-black-70">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-100">
            Budget max (DA/pers)
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={budgetMin}
              onChange={(e) => onBudgetMinChange(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-separator-90 px-3 py-2 text-sm tracking-tight text-black-80 focus:border-navy-40 focus:outline-none"
            />
            <span className="flex-shrink-0 text-xs text-black-30">DZD</span>
            <input
              type="text"
              value={budgetMax}
              onChange={(e) => onBudgetMaxChange(e.target.value)}
              placeholder="100 000"
              className="w-full rounded-lg border border-separator-90 px-3 py-2 text-sm tracking-tight text-black-80 focus:border-navy-40 focus:outline-none"
            />
            <span className="flex-shrink-0 text-xs text-black-30">DZD</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-100">
            Durée du séjour
          </h4>
          <div className="space-y-2.5">
            {durationOptions.map((option) => (
              <label
                key={option.value}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="duration"
                  value={option.value}
                  checked={duration === option.value}
                  onChange={(e) => onDurationChange(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                    duration === option.value
                      ? "border-navy-100"
                      : "border-black-20 group-hover:border-black-50"
                  }`}
                >
                  {duration === option.value && (
                    <div className="h-2 w-2 rounded-full bg-navy-100" />
                  )}
                </div>
                <span className="text-sm tracking-tight text-black-70">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-100">
            Inclusions
          </h4>
          <div className="space-y-2.5">
            {inclusionOptions.map((option) => (
              <label
                key={option.value}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={inclusions.includes(option.value)}
                  onChange={() => toggleInclusion(option.value)}
                  className="sr-only"
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                    inclusions.includes(option.value)
                      ? "border-navy-100 bg-navy-100"
                      : "border-black-20 group-hover:border-black-50"
                  }`}
                >
                  {inclusions.includes(option.value) && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm tracking-tight text-black-70">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 rounded-xl bg-[#F1F7FF] p-4">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0052B4]" />
          <p className="text-xs leading-relaxed text-[#0052B4]">
            Les tarifs et disponibilités peuvent évoluer. Disponibilité confirmée avant validation.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
