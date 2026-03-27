import { useEffect, useMemo, useRef, useState } from "react";
import FilterSidebar from "../ui/FilterSidebar";
import CategoryTabs from "../ui/CategoryTabs";
import SortDropdown from "../ui/SortDropdown";
import ListingCard from "../ui/ListingCard";
import { useOffers, getOfferImageSrc, getOfferFlagSrc } from "@/hooks/useOffers";
import { useDestinations } from "@/hooks/useDestinations";
import { useDestinationFilters } from "@/hooks/useDestinationFilters";

const sortOptions = [
  { value: "recommended", label: "Recommandées" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "date", label: "Date de départ" },
];
interface ListingContentProps {
  searchQuery?: string;
  initialCountry?: string;
  initialRegion?: string;
  initialDestination?: string;
  initialDestinationFilter?: string;
}

type DestinationFilterOption = {
  value: string;
  label: string;
  offerIds: string[];
};

const parsePriceValue = (value?: string) => {
  if (!value) return 0;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
};

const parseDateValue = (value?: string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

const normalizeText = (value?: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const findCanonicalMatch = (items: string[], rawValue?: string) => {
  const needle = normalizeText((rawValue || "").trim());
  if (!needle) return undefined;
  return items.find((item) => normalizeText(item) === needle);
};

const normalizeRelationIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry === "string" || typeof entry === "number") {
        return String(entry);
      }

      if (entry && typeof entry === "object" && "id" in entry) {
        const id = (entry as { id?: string | number | null }).id;
        return id == null ? null : String(id);
      }

      return null;
    })
    .filter((id): id is string => Boolean(id));
};

const inclusionKeywordMap: Record<string, string[]> = {
  flight: ["vol", "avion", "flight", "plane"],
  hotel: ["hotel", "hebergement", "hébergement"],
  transfer: ["transfert", "transfer", "aeroport", "aéroport"],
  assistance: ["assistance", "support", "accompagnement"],
};

const iconAliasMap: Record<string, string[]> = {
  flight: ["plane"],
  hotel: ["hotel"],
  transfer: ["transfer"],
  assistance: ["assistance"],
};

const offerHasInclusion = (
  offerInclusions: Array<{ item: string; icon?: string }>,
  selectedFilter: string,
) => {
  const keywords = inclusionKeywordMap[selectedFilter] ?? [selectedFilter];
  const iconAliases = iconAliasMap[selectedFilter] ?? [selectedFilter];

  return offerInclusions.some((entry) => {
    const icon = normalizeText(entry.icon || "");
    const label = normalizeText(entry.item || "");

    const matchesIcon = iconAliases.some((alias) => icon === normalizeText(alias));
    const matchesLabel = keywords.some((keyword) => label.includes(normalizeText(keyword)));

    return matchesIcon || matchesLabel;
  });
};

const offerHasLinkedHotels = (
  hotels?: Array<string | { id?: string; name?: string }>,
) => Array.isArray(hotels) && hotels.length > 0;

const ListingContent = ({
  searchQuery = "",
  initialCountry = "all",
  initialRegion = "Tout",
  initialDestination = "all",
  initialDestinationFilter = "all",
}: ListingContentProps) => {
  const { data: cmsOffers, isLoading } = useOffers();
  const { data: cmsDestinations } = useDestinations();
  const { data: cmsDestinationFilters } = useDestinationFilters();

  
  const offers = (cmsOffers ?? []).map((o) => ({
    id: o.id,
    src: getOfferImageSrc(o),
    destination: o.destination,
    country: o.country,
    flag: o.flag ?? "",
    flagSrc: getOfferFlagSrc(o),
    dates: o.dates ?? "",
    duration: o.duration ?? "",
    price: o.price,
    badge: o.badge,
    badgeVariant: o.badgeVariant,
    region: o.region ?? "",
    status: o.status,
    durationDays: o.durationDays,
    startDate: o.startDate,
    inclusions: o.inclusions ?? [],
    hotels: o.hotels ?? [],
    slug: o.slug,
  }));

  const destinationOptions = useMemo<DestinationFilterOption[]>(
    () =>
      (cmsDestinations ?? [])
        .map((dest) => {
          const slugOrId = dest.slug || dest.id;
          return {
            value: String(slugOrId),
            label: dest.title || dest.cardTitle || dest.name || `Destination ${dest.id}`,
            offerIds: normalizeRelationIds(dest.offers),
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label, "fr", { sensitivity: "base" })),
    [cmsDestinations],
  );

  const destinationValueSet = useMemo(
    () => new Set(destinationOptions.map((option) => option.value)),
    [destinationOptions],
  );

  
  const regions = useMemo(
    () =>
      Array.from(new Set(offers.map((o) => o.region.trim()).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }),
      ),
    [offers],
  );

  const regionTabs = useMemo(() => ["Tout", ...regions], [regions]);

  const [selectedRegion, setSelectedRegion] = useState(initialRegion || "Tout");
  const [selectedDestination, setSelectedDestination] = useState(initialDestination || "all");
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState(initialDestinationFilter || "all");

  const selectedDestinationOfferIds = useMemo(() => {
    
    if (selectedDestinationFilter !== "all") {
      const filterObj = cmsDestinationFilters?.find(f => f.id === selectedDestinationFilter || f.slug === selectedDestinationFilter);
      if (filterObj) {
        const destinationsInFilter = cmsDestinations?.filter((dest: any) => {
          const destFilterId = typeof dest.destinationFilter === "string" ? dest.destinationFilter : dest.destinationFilter?.id;
          return destFilterId === filterObj.id;
        }) || [];
        
        const offerIds = new Set<string>();
        destinationsInFilter.forEach((dest: any) => {
          normalizeRelationIds(dest.offers).forEach(id => offerIds.add(id));
        });
        return offerIds;
      }
    }
    
    
    const selectedDestinationOption = destinationOptions.find(
      (option) => option.value === selectedDestination,
    );

    return new Set(selectedDestinationOption?.offerIds ?? []);
  }, [selectedDestination, selectedDestinationFilter, destinationOptions, cmsDestinationFilters, cmsDestinations]);

  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          offers
            .filter((o) => {
              if ((selectedDestination !== "all" || selectedDestinationFilter !== "all") && !selectedDestinationOfferIds.has(String(o.id))) {
                return false;
              }

              return selectedRegion === "Tout" || o.region === selectedRegion;
            })
            .map((o) => o.country.trim())
            .filter(Boolean),
        ),
      ).sort(
        (a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }),
      ),
    [offers, selectedDestination, selectedDestinationFilter, selectedDestinationOfferIds, selectedRegion],
  );
  
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedCountry, setSelectedCountry] = useState(initialCountry || "all");
  const [availability, setAvailability] = useState("all");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [duration, setDuration] = useState("all");
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [hasInvalidQueryFilter, setHasInvalidQueryFilter] = useState(false);
  const appliedInitialQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading || offers.length === 0) return;

    const queryKey = `${initialCountry}__${initialRegion}__${initialDestination}__${initialDestinationFilter}`;
    if (appliedInitialQueryRef.current === queryKey) return;

    const requestedCountry = initialCountry?.trim() || "all";
    const requestedRegion = initialRegion?.trim() || "Tout";
    const requestedDestination = initialDestination?.trim() || "all";
    const requestedDestinationFilter = initialDestinationFilter?.trim() || "all";

    const hasCountryParam = normalizeText(requestedCountry) !== "all";
    const hasRegionParam = normalizeText(requestedRegion) !== normalizeText("Tout");
    const hasDestinationParam = normalizeText(requestedDestination) !== "all";
    const hasDestinationFilterParam = normalizeText(requestedDestinationFilter) !== "all";

    let resolvedCountry = "all";
    let resolvedRegion = "Tout";
    let resolvedDestination = "all";
    let resolvedDestinationFilter = "all";
    let invalidQuery = false;

    
    if (hasDestinationFilterParam) {
      const byId = cmsDestinationFilters?.find(f => f.id === requestedDestinationFilter);
      const bySlug = cmsDestinationFilters?.find(f => normalizeText(f.slug) === normalizeText(requestedDestinationFilter));
      const matchedFilter = byId || bySlug;

      if (matchedFilter) {
        resolvedDestinationFilter = matchedFilter.id;
      } else {
        invalidQuery = true;
      }
    }

    if (hasDestinationParam) {
      const byValue = destinationOptions.find(
        (option) => normalizeText(option.value) === normalizeText(requestedDestination),
      );
      const byLabel = destinationOptions.find(
        (option) => normalizeText(option.label) === normalizeText(requestedDestination),
      );
      const matchedDestination = byValue || byLabel;

      if (matchedDestination) {
        resolvedDestination = matchedDestination.value;
      } else {
        invalidQuery = true;
      }
    }

    if (hasRegionParam) {
      const matchedRegion = findCanonicalMatch(regionTabs, requestedRegion);
      if (matchedRegion) {
        resolvedRegion = matchedRegion;
      } else {
        const matchedCountryFromRegion = findCanonicalMatch(countries, requestedRegion);
        if (matchedCountryFromRegion) {
          resolvedCountry = matchedCountryFromRegion;
        } else {
          invalidQuery = true;
        }
      }
    }

    if (hasCountryParam) {
      const matchedCountry = findCanonicalMatch(countries, requestedCountry);
      if (matchedCountry) {
        resolvedCountry = matchedCountry;
      } else {
        invalidQuery = true;
      }
    }

    if (resolvedDestination !== "all" && !destinationValueSet.has(resolvedDestination)) {
      invalidQuery = true;
    }

    setSelectedDestination(resolvedDestination);
    setSelectedRegion(resolvedRegion);
    setSelectedCountry(resolvedCountry);
    setSelectedDestinationFilter(resolvedDestinationFilter);
    setHasInvalidQueryFilter(invalidQuery);
    appliedInitialQueryRef.current = queryKey;
  }, [
    countries,
    cmsDestinationFilters,
    destinationOptions,
    destinationValueSet,
    initialCountry,
    initialDestination,
    initialDestinationFilter,
    initialRegion,
    isLoading,
    offers.length,
    regionTabs,
  ]);

  useEffect(() => {
    const hasCountry = countries.some(
      (country) => normalizeText(country) === normalizeText(selectedCountry),
    );

    if (selectedCountry !== "all" && !hasCountry) {
      setSelectedCountry("all");
    }
  }, [countries, selectedCountry]);

  const resetFilters = () => {
    setSelectedDestination("all");
    setSelectedDestinationFilter("all");
    setSelectedRegion("Tout");
    setSelectedCountry("all");
    setAvailability("all");
    setBudgetMin("");
    setBudgetMax("");
    setDuration("all");
    setInclusions([]);
    setSortBy("recommended");
  };

  const searchNeedle = normalizeText(searchQuery.trim());
  const normalizedSelectedCountry = normalizeText(selectedCountry.trim());

  const filteredOffers = useMemo(() => {
    if (hasInvalidQueryFilter) {
      return [];
    }

    const minBudget = parsePriceValue(budgetMin);
    const maxBudget = parsePriceValue(budgetMax);

    const byFilters = offers.filter((offer) => {
      if ((selectedDestination !== "all" || selectedDestinationFilter !== "all") && !selectedDestinationOfferIds.has(String(offer.id))) {
        return false;
      }

      if (selectedRegion !== "Tout" && offer.region !== selectedRegion) {
        return false;
      }

      if (
        normalizedSelectedCountry !== "all" &&
        normalizeText(offer.country) !== normalizedSelectedCountry
      ) {
        return false;
      }

      if (availability === "available") {
        const availableByStatus = offer.status === "available";
        const availableByBadge = offer.badgeVariant !== "warning" && offer.badgeVariant !== "danger";
        if (!availableByStatus && !availableByBadge) {
          return false;
        }
      }

      if (availability === "almost") {
        const almostByStatus = offer.status === "almost-full";
        const almostByBadge = offer.badgeVariant === "warning";
        if (!almostByStatus && !almostByBadge) {
          return false;
        }
      }

      const offerPrice = parsePriceValue(offer.price);
      if (budgetMin && offerPrice < minBudget) {
        return false;
      }
      if (budgetMax && offerPrice > maxBudget) {
        return false;
      }

      if (duration !== "all") {
        const days = offer.durationDays ?? 0;
        if (duration === "3-4" && !(days >= 3 && days <= 4)) {
          return false;
        }
        if (duration === "5-6" && !(days >= 5 && days <= 6)) {
          return false;
        }
        if (duration === "7+" && days < 7) {
          return false;
        }
      }

      if (inclusions.length > 0) {
        const allSelectedInclusionsMatch = inclusions.every((selectedInclusion) =>
          selectedInclusion === "hotel"
            ? offerHasInclusion(offer.inclusions, selectedInclusion) ||
              offerHasLinkedHotels(offer.hotels)
            : offerHasInclusion(offer.inclusions, selectedInclusion),
        );

        if (!allSelectedInclusionsMatch) {
          return false;
        }
      }

      if (searchNeedle) {
        const haystack = [offer.destination, offer.country, offer.region]
          .map((entry) => normalizeText(entry))
          .join(" ");
        if (!haystack.includes(searchNeedle)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...byFilters];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price));
    } else if (sortBy === "date") {
      sorted.sort((a, b) => parseDateValue(a.startDate) - parseDateValue(b.startDate));
    }

    return sorted;
  }, [
    availability,
    budgetMax,
    budgetMin,
    duration,
    selectedDestination,
    selectedDestinationFilter,
    selectedDestinationOfferIds,
    inclusions,
    offers,
    selectedRegion,
    hasInvalidQueryFilter,
    searchNeedle,
    selectedCountry,
    normalizedSelectedCountry,
    sortBy,
  ]);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
        
        <FilterSidebar
          destinations={destinationOptions.map((option) => option.label)}
          selectedDestination={
            selectedDestination === "all"
              ? "all"
              : destinationOptions.find((option) => option.value === selectedDestination)?.label || "all"
          }
          onDestinationChange={(nextDestinationLabel) => {
            if (nextDestinationLabel === "all") {
              setSelectedDestination("all");
              setSelectedCountry("all");
              return;
            }

            const matched = destinationOptions.find((option) => option.label === nextDestinationLabel);
            setSelectedDestination(matched?.value || "all");
            setSelectedCountry("all");
          }}
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          availability={availability}
          onAvailabilityChange={setAvailability}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onBudgetMinChange={setBudgetMin}
          onBudgetMaxChange={setBudgetMax}
          duration={duration}
          onDurationChange={setDuration}
          inclusions={inclusions}
          onInclusionsChange={setInclusions}
          onReset={resetFilters}
        />

        
        <div className="flex-1 min-w-0">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <CategoryTabs
              categories={regionTabs}
              activeCategory={selectedRegion}
              onCategoryChange={(region) => {
                setSelectedRegion(region);
                setSelectedCountry("all");
                if (selectedDestination !== "all") {
                  setSelectedDestination("all");
                }
              }
              }
            />
            <SortDropdown
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
            />
          </div>

          
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-separator-90 animate-pulse">
                  <div className="h-[200px] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                      <div className="h-9 w-9 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          
          {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => (
              <ListingCard
                key={`${offer.destination}-${offer.country}-${index}`}
                src={offer.src}
                destination={offer.destination}
                country={offer.country}
                flag={offer.flag}
                flagSrc={offer.flagSrc}
                dates={offer.dates}
                duration={offer.duration}
                price={offer.price}
                badge={offer.badge}
                badgeVariant={offer.badgeVariant as "warning" | "danger" | undefined}
                href={offer.slug ? `/offer/${offer.slug}` : undefined}
              />
            ))}
          </div>
          )}

          
          {filteredOffers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-black-50 text-lg mb-2">
                Aucune offre trouvée
              </p>
              <p className="text-black-30 text-sm">
                Essayez de modifier vos filtres pour voir plus de résultats.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-navy-100 font-medium text-sm hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListingContent;
