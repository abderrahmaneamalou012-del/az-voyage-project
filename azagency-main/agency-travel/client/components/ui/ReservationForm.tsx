import { useState, useEffect } from "react";
import { ChevronDown, User, Minus, Plus, CheckCircle } from "lucide-react";
import {
  calculateReservationTotal,
  formatPrice,
  type ChildPriceBracket,
} from "@/lib/reservation-pricing";

export type PricingBreakdown = ReturnType<typeof calculateReservationTotal> & { adults: number };

export interface HotelOption {
  id?: string;
  name: string;
  pricePerPerson?: string;
  priceAmount?: number;
  childPrice?: string;
  childPriceAmount?: number;
  childPriceBrackets?: ChildPriceBracket[];
}

export interface ReservationFormProps {
  hotels: HotelOption[];
  currency?: string;
  offerTitle?: string;
  offerId?: string;
  onSubmit?: (data: ReservationData) => void;
  onPricingChange?: (pricing: PricingBreakdown) => void;
}

export interface ReservationData {
  fullName: string;
  phone: string;
  selectedHotel: string;
  adults: number;
  children: number;
  childAges?: Record<number, number | null>;
}

// Submit directly to the CMS public API (no backend middleman needed)
const CMS_URL =
  (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/$/, "") || "";

const ReservationForm = ({
  hotels,
  currency = "DZD",
  offerTitle,
  offerId,
  onSubmit,
  onPricingChange,
}: ReservationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(
    hotels.length > 0 ? hotels[0].id ?? hotels[0].name : ""
  );
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<Record<number, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    setChildAges((prev) => {
      const next: Record<number, number | null> = {};
      for (let i = 0; i < children; i++) {
        next[i] = prev[i] ?? null;
      }
      return next;
    });
  }, [children]);

  const selectedHotelData = hotels.find(
    (hotel) => (hotel.id ?? hotel.name) === selectedHotel,
  );

  const brackets = selectedHotelData?.childPriceBrackets ?? [];
  const hasBrackets = brackets.length > 0;

  const {
    adultPriceAmount,
    adultPriceLabel,
    adultTotal,
    childrenTotal,
    childLines,
    total,
  } = calculateReservationTotal({
    adults,
    children,
    hotel: selectedHotelData,
    childAges,
  });

  useEffect(() => {
    onSubmit?.({} as any); 
  }, []); 

  useEffect(() => {
    if (onSubmit) {} 
  }, []);

  useEffect(() => {
    onPricingChange?.({
      adultPriceAmount,
      adultPriceLabel,
      adultTotal,
      childrenTotal,
      childLines,
      total,
      adults,
    });
  
  }, [adultPriceAmount, adultPriceLabel, adultTotal, childrenTotal, JSON.stringify(childLines), total, adults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data: ReservationData = {
      fullName,
      phone,
      selectedHotel: selectedHotelData?.name || selectedHotel,
      adults,
      children,
      childAges,
    };

    onSubmit?.(data);

    
    const childDetailsArr = [];
    for (let i = 0; i < children; i++) {
      const bracketIdx = childAges[i];
      if (bracketIdx != null && brackets[bracketIdx]) {
        const b = brackets[bracketIdx];
        childDetailsArr.push({
          childIndex: i + 1,
          bracket: b.label,
          price: b.priceAmount,
        });
      }
    }

    if (!CMS_URL) {
      setError("Le CMS n'est pas configuré. Veuillez réessayer plus tard.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${CMS_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          offerTitle: offerTitle || "",
          offerId: offerId || "",
          ...(selectedHotelData?.id ? { hotel: selectedHotelData.id } : {}),
          selectedHotel: selectedHotelData?.name || selectedHotel,
          adults,
          children,
          childDetails: childDetailsArr.length > 0 ? JSON.stringify(childDetailsArr) : undefined,
          totalEstimated: formatPrice(total),
          currency: currency || "DZD",
          status: "new",
        }),
      });

      if (!res.ok) {
        let errMsg = `Erreur du serveur (${res.status})`;
        try {
          const errBody = await res.json();
          console.error("CMS reservation error:", errBody);
          if (errBody?.errors?.[0]?.message) {
            errMsg = errBody.errors[0].message;
          } else if (errBody?.message) {
            errMsg = errBody.message;
          }
        } catch { }
        throw new Error(errMsg);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Reservation submit error:", err);
      // We explicitly show the real error message if we parsed it from the CMS
      setError(err?.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-jakarta font-bold text-[24px] sm:text-[28px] tracking-[-1.2px] mb-2">
        <span className="text-black-100">Demande de </span>
        <span className="text-gold-100 italic">réservation</span>
      </h2>

      <div className="w-16 h-px bg-separator-90 mb-5" />

      <p className="text-black-50 text-sm leading-relaxed tracking-tight mb-8 max-w-[600px]">
        Remplissez ce formulaire et notre équipe vous contacte dans les 24 heures ouvrées pour confirmer la
        disponibilité et finaliser votre dossier.
      </p>

      <form onSubmit={handleSubmit} className="max-w-[520px] space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
              Nom &amp; Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex : Fouad Amalou"
              className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
            />
          </div>
          <div>
            <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : +213 0 XX XX XX XX"
              className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
            />
          </div>
        </div>

        
        <div>
          <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
            Hôtel sélectionné <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="w-full appearance-none border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight focus:outline-none focus:border-navy-40 cursor-pointer bg-white"
            >
              {hotels.map((h) => (
                <option key={h.id ?? h.name} value={h.id ?? h.name}>
                  {h.name} — {h.pricePerPerson || formatPrice(h.priceAmount ?? 0)} {currency} / pers
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black-30 pointer-events-none" />
          </div>
        </div>

        
        <div>
          <label className="text-black-80 text-sm font-medium tracking-tight mb-2 block">
            Voyageurs <span className="text-red-500">*</span>
          </label>

          <div className="border border-separator-90 rounded-xl p-4 mb-3 bg-white">
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gold-100">
                  <User className="w-[18px] h-[18px]" />
                  <span className="text-sm font-medium tracking-tight">
                    Adultes
                  </span>
                </div>
                <div className="ml-6">
                  <span className="text-black-100 font-bold text-[15px] tracking-tight">{adultPriceAmount > 0 ? adultPriceAmount.toLocaleString("fr-FR").replace(/,/g, " ") : adultPriceLabel.replace(/\/ pers.*/, '').trim()}</span>
                  <span className="text-black-100 font-bold text-[15px] tracking-tight"> {currency}</span>
                  <span className="text-black-60 text-[13px] tracking-tight"> / pers</span>
                </div>
              </div>

              <div className="flex items-center border border-separator-90 rounded-full overflow-hidden flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-black-100">
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            
            {hasBrackets && (
              <>
                <div className="w-full h-px bg-separator-90 my-5" />

                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gold-100">
                      <User className="w-[18px] h-[18px]" />
                      <span className="text-sm font-medium tracking-tight">
                        Enfants
                      </span>
                    </div>
                    <div className="ml-6">
                      <span className="text-black-60 text-[13px] tracking-tight">
                        Jusqu'à 11 ans
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-separator-90 rounded-full overflow-hidden flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-black-100">
                      {children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                
                {children > 0 && (
                  <div className="space-y-4">
                    {Array.from({ length: children }, (_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-black-80">
                          Enfant {i + 1} — tranche d'âge{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={childAges[i] ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setChildAges((prev) => ({
                                ...prev,
                                [i]: val === "" ? null : Number(val),
                              }));
                            }}
                            className="w-full appearance-none border border-separator-90 rounded-lg py-2.5 px-4 text-sm text-black-80 tracking-tight bg-white focus:outline-none focus:border-gold-100 transition-colors cursor-pointer"
                          >
                            <option value="">Sélectionner l'âge</option>
                            {brackets.map((bracket, bIdx) => (
                              <option key={bIdx} value={bIdx}>
                                {bracket.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black-100 pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        
        <div className="border border-separator-90 rounded-xl p-4 mb-6 bg-white">
          <h4 className="font-jakarta font-medium text-sm text-black-100 mb-4">
            Récapitulatif tarifaire
          </h4>

          <div className="space-y-3 mb-4">
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-black-60 tracking-tight">
                Adultes ({adults} × {adultPriceAmount > 0 ? adultPriceAmount.toLocaleString("fr-FR").replace(/,/g, " ") : adultPriceLabel.replace(/\/ pers.*/, '').trim()} {currency})
              </span>
              <span className="text-black-100 font-medium tracking-tight">
                {formatPrice(adultTotal)} {currency}
              </span>
            </div>

            
            {childLines.map((line, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-black-60 tracking-tight">
                  Enfant (1 × {formatPrice(line.price)} {currency})
                </span>
                <span className="text-black-100 font-medium tracking-tight">
                  {formatPrice(line.price)} {currency}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-separator-90 mb-3" />

          
          <div className="flex items-center justify-between">
            <span className="font-jakarta font-semibold text-[15px] text-black-100">
              Total estimé
            </span>
            <span className="font-jakarta font-bold text-[17px] text-gold-100">
              {formatPrice(total)} {currency}
            </span>
          </div>
        </div>

        
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="font-jakarta font-semibold text-base text-black-100 tracking-tight text-center">
              Demande envoyée avec succès !
            </p>
            <p className="text-black-50 text-sm tracking-tight text-center">
              Notre équipe vous contactera dans les 24 heures ouvrées.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-red-500 text-sm text-center tracking-tight">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-navy-100 text-white py-3.5 rounded-full font-medium text-[15px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
            <p className="text-black-30 text-xs text-center tracking-tight">
              Aucun paiement n'est demandé à cette étape.
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default ReservationForm;
