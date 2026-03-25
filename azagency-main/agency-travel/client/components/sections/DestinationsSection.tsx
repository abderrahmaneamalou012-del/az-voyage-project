import { useMemo, useState } from "react";
import DestinationCard from "../ui/DestinationCard";
import { useDestinations, getDestinationImageSrc } from "@/hooks/useDestinations";
import { useDestinationFilters } from "@/hooks/useDestinationFilters";
import { BlurFade } from "@/components/magicui/blur-fade";

const DestinationsSection = () => {
  const { data: cmsDestinations } = useDestinations();
  const { data: cmsDestinationFilters } = useDestinationFilters();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  
  const fallbackDestinations = [
    {
      id: "1",
      title: "Istanbul, Turquie",
      imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg",
      description:
        "Entre mosquées majestueuses, ruelles animées et vues sur le Bosphore, un séjour parfait pour city break, shopping et découvertes",
      slug: "istanbul-turquie",
    },
    {
      id: "2",
      title: "Rome, Italie",
      imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg",
      description:
        "Un patrimoine unique, des places mythiques et une ambiance méditerranéenne idéale pour une escapade culturelle.",
      slug: "rome-italie",
    },
    {
      id: "3",
      title: "Le Caire, Egypte",
      imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg",
      description:
        "Des pyramides aux souks vibrants, vivez un voyage entre histoire antique et énergie orientale.",
      slug: "le-caire-egypte",
    },
    {
      id: "4",
      title: "Agra, Inde",
      imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
      description:
        "Le Taj Mahal et des sites emblématiques pour un séjour riche en émotions et en découvertes.",
      slug: "agra-inde",
    },
  ];

  const sourceDestinations = cmsDestinations?.length ? cmsDestinations : fallbackDestinations;

  
  const filterOptions = useMemo(() => {
    if (!cmsDestinationFilters?.length) return [];
    return cmsDestinationFilters.map((filter) => ({
      id: filter.id,
      name: filter.name,
      slug: filter.slug,
    }));
  }, [cmsDestinationFilters]);

  
  const filteredSourceDestinations = useMemo(() => {
    if (!selectedFilter) return sourceDestinations;
    return sourceDestinations.filter((dest: any) => {
      const destFilterId = typeof dest.destinationFilter === "string" ? dest.destinationFilter : dest.destinationFilter?.id;
      const selectedFilterId = selectedFilter;
      return destFilterId === selectedFilterId;
    });
  }, [sourceDestinations, selectedFilter]);

  const destinations = useMemo(() => filteredSourceDestinations.map((dest: any) => {
    const title = dest.title || dest.cardTitle || dest.name || "Destination";
    const description = dest.description || dest.cardDescription || "";
    
    
    const destFilterId = typeof dest.destinationFilter === "string" ? dest.destinationFilter : dest.destinationFilter?.id;
    const destFilterSlug = cmsDestinationFilters?.find(f => f.id === destFilterId)?.slug;
    
    const destinationHref = destFilterSlug
      ? `/listing?destinationFilter=${encodeURIComponent(String(destFilterSlug))}`
      : undefined;

    return {
      src: getDestinationImageSrc(dest),
      alt: title,
      title,
      description,
      href: destinationHref || dest.href,
    };
  }), [filteredSourceDestinations, cmsDestinationFilters]);

  return (
    <section id="destinations" className="bg-[#F3F3F3] px-6 sm:px-10 lg:px-16 pt-20">
      <div className="text-center mb-10">
        <h2 className="font-jakarta font-bold text-[36px] sm:text-[40px] tracking-[-2px] mb-5">
          <span className="text-black-100">Explorez </span>
          <span className="text-gold-100">nos destinations</span>
        </h2>
        <p className="text-black-50 text-lg sm:text-xl leading-[29px] tracking-tight max-w-[640px] mx-auto">
          Découvrez nos destinations les plus demandées et les offres disponibles selon la saison.
        </p>
      </div>

      
      {filterOptions.length > 0 && (
        <div className="flex gap-3 justify-center mb-8 overflow-x-auto pb-3 no-scrollbar">
          <button
            onClick={() => setSelectedFilter(null)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedFilter === null
                ? "bg-[#0e3e43] text-white"
                : "bg-white text-black-100 border border-black-50 hover:bg-gray-50"
            }`}
          >
            Tous
          </button>
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedFilter === filter.id
                  ? "bg-[#0e3e43] text-white"
                  : "bg-white text-black-100 border border-black-50 hover:bg-gray-50"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      )}

      
      <div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar mb-12 mt-10">
        {destinations.map((dest, index) => (
          <BlurFade
            key={`${dest.alt}-${index}`}
            className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] snap-start"
            delay={0.12 + index * 0.08}
            duration={0.95}
            inView
          >
            <DestinationCard
              src={dest.src}
              alt={dest.alt}
              title={dest.title}
              description={dest.description}
              href={dest.href}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
