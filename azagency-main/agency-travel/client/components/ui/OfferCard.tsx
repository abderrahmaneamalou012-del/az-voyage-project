import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plane, Building, Bus } from "lucide-react";
import { Lens } from "@/components/magicui/lens";

export interface OfferCardProps {
  src: string;
  name: string;
  flag?: string;
  flagSrc?: string;
  dates: string;
  duration: string;
  price: string;
  currency?: string;
  tag?: string;
  includesFlight?: boolean;
  includesHotel?: boolean;
  includesTransport?: boolean;
  ctaLabel?: string;
  href?: string;
}

const OfferCard = ({
  src,
  name,
  flag,
  flagSrc,
  dates,
  duration,
  price,
  currency = "DZD",
  tag,
  includesFlight = true,
  includesHotel = true,
  includesTransport = true,
  ctaLabel = "Voir l'offre",
  href,
}: OfferCardProps) => {
  const Wrapper = href
    ? ({
        children,
        className,
      }: {
        children: ReactNode;
        className?: string;
      }) => (
        <Link to={href} className={className} style={{ textDecoration: "none", color: "inherit" }}>
          {children}
        </Link>
      )
    : ({
        children,
        className,
      }: {
        children: ReactNode;
        className?: string;
      }) => <div className={className}>{children}</div>;

  return (
    <Wrapper className="group block overflow-hidden rounded-2xl border border-separator-90 bg-white transition-all duration-300 hover:border-gold-100 hover:shadow-xl">
      <div className="relative h-[320px] overflow-hidden">
        <Lens
          zoomFactor={1.5}
          lensSize={138}
          ariaLabel={`Zoom ${name}`}
        >
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Lens>
        {tag && (
          <span className="absolute left-4 top-4 rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold tracking-tight text-white shadow">
            {tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <h3 className="flex-1 font-jakarta text-xl font-semibold tracking-tight text-black-100">
            {name}
          </h3>
          {flagSrc ? (
            <img
              src={flagSrc}
              alt="Drapeau"
              className="mt-1 h-6 w-6 flex-shrink-0 rounded-full object-cover shadow-sm"
            />
          ) : flag ? (
            <span className="mt-0.5 flex-shrink-0 text-xl">{flag}</span>
          ) : null}
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-black-30" />
            <div className="flex items-center gap-2">
              <span className="text-base tracking-tight text-black-80">{dates}</span>
              <div className="h-3 w-px bg-separator-100" />
              <span className="text-base tracking-tight text-black-80">{duration}</span>
            </div>
          </div>

          {includesFlight && (
            <div className="flex items-center gap-3">
              <Plane className="h-4 w-4 text-black-30" />
              <span className="text-base tracking-tight text-black-80">Vol Aller/Retour</span>
            </div>
          )}

          {includesHotel && (
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-black-30" />
              <span className="text-base tracking-tight text-black-80">Hôtel</span>
            </div>
          )}

          {includesTransport && (
            <div className="flex items-center gap-3">
              <Bus className="h-4 w-4 text-black-30" />
              <span className="text-base tracking-tight text-black-80">Transport Aller/Retour</span>
            </div>
          )}
        </div>

        <div className="mb-4 h-px w-full bg-[#EFF2F7]" />

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-sm tracking-tight text-black-80">À partir de</span>
            <div className="font-jakarta text-2xl font-extrabold tracking-tight text-black-100">
              {price} {currency}
            </div>
          </div>
          <span className="rounded-full bg-navy-100 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-navy-90">
            {ctaLabel}
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default OfferCard;
