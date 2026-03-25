import { CheckCircle, User } from "lucide-react";
import type { PricingBreakdown } from "./ReservationForm";
import { formatPrice } from "@/lib/reservation-pricing";

export interface PriceSidebarProps {
  summary?: string;
  pricing: PricingBreakdown | null;
  fallbackAdults: number;
  fallbackPriceAmount: number;
  fallbackPriceLabel: string;
  currency?: string;
  travellersLabel?: string;
  travellersText?: string;
  detailsTitle?: string;
  totalLabel?: string;
  reserveButtonLabel?: string;
  confirmationText?: string;
  onReserve?: () => void;
}

const PriceSidebar = ({
  summary,
  pricing,
  fallbackAdults,
  fallbackPriceAmount,
  fallbackPriceLabel,
  currency = "DZD",
  detailsTitle = "Récapitulatif tarifaire",
  totalLabel = "Total estimé",
  reserveButtonLabel = "Réserver cette offre",
  confirmationText = "Disponibilité confirmée avant validation",
  onReserve,
}: PriceSidebarProps) => {

  
  const adults = pricing?.adults ?? fallbackAdults;
  const adultPriceAmount = pricing?.adultPriceAmount ?? fallbackPriceAmount;
  const adultPriceLabel = pricing?.adultPriceLabel ?? fallbackPriceLabel;
  const adultTotal = pricing?.adultTotal ?? (fallbackAdults * fallbackPriceAmount);
  
  const childLines = pricing?.childLines ?? [];
  const grandTotal = pricing?.total ?? adultTotal;

  const childCount = childLines.length;

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-7 border border-separator-90">
      
      
      {summary && (
        <div className="mb-6">
          <p className="text-black-60 text-sm leading-relaxed tracking-tight whitespace-pre-line">
            {summary}
          </p>
          <div className="w-full h-px bg-separator-90 mt-5" />
        </div>
      )}

      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-[18px] h-[18px] text-black-80" />
          <h3 className="font-jakarta font-semibold text-[15px] sm:text-[16px] text-black-100 tracking-tight">
            Voyageurs
          </h3>
        </div>
        <div className="text-black-60 text-sm tracking-tight pl-6 flex flex-col gap-1">
          <span>{adults} adulte{adults > 1 ? "s" : ""}</span>
          {childCount > 0 && <span>{childCount} enfant{childCount > 1 ? "s" : ""}</span>}
        </div>
      </div>

      
      <div className="bg-[#f9fafb] border border-separator-90 rounded-2xl p-5 mb-6">
        <h3 className="font-jakarta font-semibold text-[15px] sm:text-[16px] text-black-100 tracking-tight mb-4">
          Détails du prix
        </h3>

        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 text-[13px] sm:text-sm">
            <span className="text-black-60 tracking-tight leading-6">
              Adultes ({adults} × {adultPriceAmount > 0 ? formatPrice(adultPriceAmount) : adultPriceLabel.replace(/\/ pers.*/, '').trim()} {currency})
            </span>
            <span className="text-black-100 font-bold tracking-tight text-right leading-6">
              {formatPrice(adultTotal)} {currency}
            </span>
          </div>

          {childLines.map((line, idx) => (
             <div key={idx} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 text-[13px] sm:text-sm">
               <span className="text-black-60 tracking-tight leading-6">
                 Enfant (1 × {line.label.split('—')[0]?.trim() || "Age"} : {formatPrice(line.price)} {currency})
               </span>
               <span className="text-black-100 font-bold tracking-tight text-right leading-6">
                 {formatPrice(line.price)} {currency}
               </span>
             </div>
          ))}
        </div>

        <div className="w-full h-px bg-separator-90 mb-4" />

        <div className="flex items-center justify-between">
          <span className="font-jakarta text-[15px] font-semibold text-black-100 tracking-tight">
            {totalLabel}
          </span>
          <span className="font-jakarta text-[18px] sm:text-[20px] font-bold tracking-tight text-black-100 leading-none">
            {formatPrice(grandTotal)} {currency}
          </span>
        </div>
      </div>

      
      <button
        type="button"
        onClick={onReserve}
        className="w-full bg-[#10343a] text-white hover:bg-[#10343a]/90 transition-colors duration-300 rounded-full py-3.5 px-6 font-semibold mb-4 text-[14px] sm:text-[15px] tracking-tight text-center shadow-sm"
      >
        {reserveButtonLabel}
      </button>

      <div className="flex justify-center items-center gap-2">
        <CheckCircle className="w-4 h-4 text-[#0e8a44]" />
        <span className="text-[#0e8a44] text-[13px] tracking-tight font-medium">
          {confirmationText}
        </span>
      </div>
    </div>
  );
};

export default PriceSidebar;
