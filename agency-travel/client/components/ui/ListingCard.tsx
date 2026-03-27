import { Calendar, Plane, Bus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Lens } from "@/components/magicui/lens";

export interface ListingCardProps {
  src: string;
  destination: string;
  country: string;
  flag?: string;
  flagSrc?: string;
  dates: string;
  duration: string;
  price: string;
  currency?: string;
  badge?: string;
  badgeVariant?: "warning" | "danger";
  href?: string;
  onCtaClick?: () => void;
}

const ListingCard = ({
  src,
  destination,
  country,
  flag,
  flagSrc,
  dates,
  duration,
  price,
  currency = "DZD",
  badge,
  badgeVariant = "warning",
  href,
  onCtaClick,
}: ListingCardProps) => {
  const badgeClasses =
    badgeVariant === "danger"
      ? "bg-red-600 text-white"
      : "bg-gold-100 text-black-100";

  const Wrapper = href
    ? ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <Link to={href} className={className} style={{ textDecoration: "none", color: "inherit" }}>
          {children}
        </Link>
      )
    : ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
      );

  return (
    <Wrapper className="bg-white rounded-2xl overflow-hidden border border-separator-90 hover:border-gold-100 hover:shadow-xl transition-all duration-300 group block">
      
      <div className="relative overflow-hidden h-[200px]">
        <Lens
          zoomFactor={1.45}
          lensSize={118}
          ariaLabel={`Zoom ${destination}, ${country}`}
        >
          <img
            src={src}
            alt={`${destination}, ${country}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Lens>
        {badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold tracking-tight px-3 py-1 rounded-full shadow ${badgeClasses}`}
          >
            {badge}
          </span>
        )}
      </div>

      
      <div className="p-4">
        
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-jakarta font-semibold text-lg tracking-tight text-black-100 flex-1 truncate">
            {destination}, {country}
          </h3>
          {flagSrc ? (
            <img src={flagSrc} alt={`Drapeau ${country}`} className="w-6 h-6 object-cover rounded-full shadow-sm flex-shrink-0" />
          ) : flag ? (
            <span className="text-xl flex-shrink-0">{flag}</span>
          ) : null}
        </div>

        
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-black-30 flex-shrink-0" />
          <span className="text-black-60 text-sm tracking-tight">{dates}</span>
          <span className="text-black-30 text-sm">|</span>
          <span className="text-black-60 text-sm tracking-tight">
            {duration}
          </span>
        </div>

        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-black-30" />
            <span className="text-black-60 text-sm tracking-tight">
              Vol A/R
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-black-30" />
            <span className="text-black-60 text-sm tracking-tight">
              Transfert A/R
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-[#EFF2F7] mb-3"></div>

        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-black-50 text-xs tracking-tight uppercase">
              À partir de
            </span>
            <div className="font-jakarta font-extrabold text-xl tracking-tight text-black-100">
              {price} {currency}
            </div>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-navy-100 text-white flex items-center justify-center hover:bg-navy-90 transition-colors duration-300 hover:scale-105"
            aria-label="Voir l'offre"
          >
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ListingCard;
