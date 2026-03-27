import {
  Plane,
  Building,
  Bus,
  Headphones,
  Check,
  Utensils,
  MapPin,
  Calendar,
} from "lucide-react";
import type { ReactNode } from "react";

export interface InclusionItem {
  icon: ReactNode;
  label: string;
}

export interface OfferInclusionEntry {
  label: string;
  icon?: string;
}

export interface OfferInclusionsProps {
  items?: InclusionItem[];
  entries?: OfferInclusionEntry[];
  exclusions?: string[];
}

const iconMap = {
  check: <Check className="h-5 w-5 text-gold-100" />,
  plane: <Plane className="h-5 w-5 text-gold-100" />,
  hotel: <Building className="h-5 w-5 text-gold-100" />,
  transfer: <Bus className="h-5 w-5 text-gold-100" />,
  assistance: <Headphones className="h-5 w-5 text-gold-100" />,
  meal: <Utensils className="h-5 w-5 text-gold-100" />,
  map: <MapPin className="h-5 w-5 text-gold-100" />,
  calendar: <Calendar className="h-5 w-5 text-gold-100" />,
} as const;

const buildEntryItems = (entries: OfferInclusionEntry[]): InclusionItem[] => {
  return entries.map((entry) => ({
    label: entry.label,
    icon: iconMap[(entry.icon || "check") as keyof typeof iconMap] || iconMap.check,
  }));
};

const OfferInclusions = ({
  items,
  entries,
  exclusions,
}: OfferInclusionsProps) => {
  const displayItems = items?.length
    ? items
    : entries?.length
      ? buildEntryItems(entries)
      : [];

  if (displayItems.length === 0 && (!exclusions || exclusions.length === 0)) {
    return null;
  }

  return (
    <div>
      {displayItems.length > 0 && (
        <div>
          <h2 className="mb-6 font-jakarta text-[24px] font-bold tracking-[-1.2px] text-black-100 sm:text-[28px]">
            <span className="italic text-gold-100">Ce qui est </span>
            <span className="text-black-100">inclus</span>
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {displayItems.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="flex items-center gap-4 rounded-xl border border-separator-90 px-5 py-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7E8]">
                  {item.icon}
                </span>
                <span className="text-[15px] tracking-tight text-black-80">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {exclusions && exclusions.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 font-jakarta text-lg font-semibold tracking-[-0.5px] text-black-80">
            Non inclus
          </h3>
          <div className="space-y-2">
            {exclusions.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-4 rounded-xl border border-separator-90 px-5 py-3"
              >
                <span className="text-sm font-bold text-red-400">✕</span>
                <span className="text-[15px] tracking-tight text-black-60">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferInclusions;
