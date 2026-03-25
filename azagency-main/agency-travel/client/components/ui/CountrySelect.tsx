import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, X, Globe } from "lucide-react";
import { countries, type Country } from "@/lib/countries";

interface CountrySelectProps {
  selected: Country[];
  onChange: (countries: Country[]) => void;
  placeholder?: string;
}

const CountrySelect = ({
  selected,
  onChange,
  placeholder = "Ex : Turquie, Malaisie, Qatar...",
}: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (country: Country) => {
    const exists = selected.find((s) => s.code === country.code);
    if (exists) {
      onChange(selected.filter((s) => s.code !== country.code));
    } else {
      onChange([...selected, country]);
    }
  };

  const remove = (code: string) => {
    onChange(selected.filter((s) => s.code !== code));
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
        Destination(s) souhaitée(s) <span className="text-red-500">*</span>
      </label>

      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-separator-90 rounded-xl px-4 py-3 text-sm text-left tracking-tight bg-white focus:outline-none focus:border-navy-40 transition-colors min-h-[48px]"
      >
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-black-30">{placeholder}</span>
          ) : (
            selected.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-1.5 bg-navy-10/50 text-black-80 text-sm px-2.5 py-1 rounded-lg"
              >
                {c.flag} {c.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(c.code);
                  }}
                  className="text-black-40 hover:text-black-80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-black-30 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-black-30 flex-shrink-0 ml-2" />
        )}
      </button>

      
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-separator-90 rounded-xl shadow-lg overflow-hidden">
          
          <div className="flex items-center gap-2 px-4 py-3 border-b border-separator-90">
            <Search className="w-4 h-4 text-black-30 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pays"
              className="w-full text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none bg-transparent"
              autoFocus
            />
          </div>

          
          <div className="max-h-[240px] overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((country) => {
                const isSelected = selected.some((s) => s.code === country.code);
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => toggle(country)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm tracking-tight hover:bg-navy-10/30 transition-colors ${
                      isSelected ? "bg-navy-10/40 font-medium" : ""
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-navy-100 border-navy-100"
                          : "border-black-20 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span className="text-black-80">{country.name}</span>
                  </button>
                );
              })
            ) : (
              
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Globe className="w-12 h-12 text-black-20 mb-3" />
                <p className="font-jakarta font-semibold text-sm text-black-80 mb-1">
                  Aucun résultat pour cette recherche
                </p>
                <p className="text-xs text-black-40 text-center mb-3">
                  "{search}" ne correspond à aucune destination disponible actuellement.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs text-black-60 underline underline-offset-2 hover:text-black-80 transition-colors inline-flex items-center gap-1"
                >
                  Effacer la recherche
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
