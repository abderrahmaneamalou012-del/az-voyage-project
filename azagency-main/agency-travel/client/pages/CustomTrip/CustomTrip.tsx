import { useState } from "react";
import { Plane, ArrowRight } from "lucide-react";
import Footer from "@/components/sections/Footer";
import StepIndicator from "@/components/ui/StepIndicator";
import CountrySelect from "@/components/ui/CountrySelect";
import DateRangePicker from "@/components/ui/DateRangePicker";
import PersonCounter from "@/components/ui/PersonCounter";
import SuccessModal from "@/components/ui/SuccessModal";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { Country } from "@/lib/countries";
import type { CustomTripResponse } from "@shared/api";
import { format } from "date-fns";

const navLinks = [
  { label: "Nos offres", href: "/listing" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Témoignages", href: "/#temoignages" },
  { label: "FAQ", href: "/#faq" },
];


interface Step1Data {
  fullName: string;
  phone: string;
  email: string;
}

interface Step2Data {
  destinations: Country[];
  startDate: Date | null;
  endDate: Date | null;
  budget: string;
  adults: number;
  children: number;
  childAges: string[];
}

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
const MAX_CHILD_AGE = 100;
const MAX_CHILD_AGE_DIGITS = String(MAX_CHILD_AGE).length;

function resizeChildAges(childAges: string[], nextChildrenCount: number) {
  return Array.from({ length: nextChildrenCount }, (_, index) => childAges[index] ?? "");
}

export default function CustomTrip() {
  usePageMeta({
    title: "Voyage sur mesure",
    description: "Créez votre voyage sur mesure avec AZ Voyage. Choisissez vos destinations, dates et budget pour recevoir une proposition personnalisée.",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  
  const [step1, setStep1] = useState<Step1Data>({
    fullName: "",
    phone: "",
    email: "",
  });

  
  const [step2, setStep2] = useState<Step2Data>({
    destinations: [],
    startDate: null,
    endDate: null,
    budget: "",
    adults: 0,
    children: 0,
    childAges: [],
  });

  
  const step1Valid = step1.fullName.trim() && step1.phone.trim() && step1.email.trim();
  const childAgesValid =
    step2.childAges.length === step2.children &&
    step2.childAges.every((age) => {
      const parsedAge = Number(age);
      return age !== "" && Number.isInteger(parsedAge) && parsedAge >= 0 && parsedAge <= MAX_CHILD_AGE;
    });
  const step2Valid = step2.destinations.length > 0 && step2.startDate && childAgesValid;

  const handleChildrenChange = (children: number) => {
    setStep2((current) => ({
      ...current,
      children,
      childAges: resizeChildAges(current.childAges, children),
    }));
  };

  const handleChildAgeChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, "").slice(0, MAX_CHILD_AGE_DIGITS);
    const sanitizedValue =
      digitsOnly !== "" && Number(digitsOnly) > MAX_CHILD_AGE
        ? String(MAX_CHILD_AGE)
        : digitsOnly;

    setStep2((current) => ({
      ...current,
      childAges: current.childAges.map((age, ageIndex) =>
        ageIndex === index ? sanitizedValue : age,
      ),
    }));
  };

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (step1Valid) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Valid) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const body = {
        fullName: step1.fullName,
        phone: step1.phone,
        email: step1.email,
        destinations: step2.destinations.map((c) => c.name),
        startDate: step2.startDate ? format(step2.startDate, "yyyy-MM-dd") : null,
        endDate: step2.endDate ? format(step2.endDate, "yyyy-MM-dd") : null,
        budget: step2.budget,
        adults: step2.adults,
        children: step2.children,
        childAges: step2.childAges.map((age) => Number(age)),
      };

      const res = await fetch(`${API_URL}/api/custom-trip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json().catch(() => null)) as CustomTripResponse | null;

      if (!res.ok || !data?.success) {
        setSubmitError(
          data?.message || "Impossible d'envoyer votre demande pour le moment.",
        );
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("Impossible d'envoyer votre demande pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-white">
      
      <div className="bg-navy-100 text-white py-2 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Plane className="w-5 h-5" />
          <p className="text-sm font-medium tracking-tight">
            Travel to any wished destination
          </p>
        </div>
      </div>

      
      <nav className="bg-white border-b border-separator-90">
        <div className="max-w-[1200px] mx-auto relative flex items-center justify-center px-6 sm:px-10 py-5">
          <a href="/" className="absolute left-6 sm:left-10 flex-shrink-0">
            <img
              src="/assets/figma/logo.png"
              alt="AZ Voyage"
              className="h-10 object-contain"
            />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-black-80 font-medium text-sm tracking-tight transition-colors duration-300 hover:text-gold-100 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gold-100 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        <div className="text-center mb-8">
          <h1 className="font-jakarta font-bold text-[28px] sm:text-[36px] tracking-[-1.8px] text-black-100 mb-3">
            <span className="text-gold-100 italic">Créez </span>
            <span className="text-black-100">votre voyage sur mesure</span>
          </h1>
          <p className="text-black-50 text-[15px] leading-relaxed tracking-tight max-w-[480px] mx-auto">
            Remplissez les informations ci-dessous et recevez une proposition
            personnalisée.
          </p>
        </div>

        
        <StepIndicator currentStep={step} totalSteps={2} />

        
        {step === 1 && (
          <form onSubmit={goToStep2} className="space-y-5">
            
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Nom & Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={step1.fullName}
                onChange={(e) => setStep1({ ...step1, fullName: e.target.value })}
                placeholder="Ex : Amine Benali"
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
                value={step1.phone}
                onChange={(e) => setStep1({ ...step1, phone: e.target.value })}
                placeholder="Ex : +213 6 XX XX XX XX"
                className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
              />
            </div>

            
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={step1.email}
                onChange={(e) => setStep1({ ...step1, email: e.target.value })}
                placeholder="Ex : nom@gmail.com"
                className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
              />
            </div>

            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!step1Valid}
                className="inline-flex items-center gap-2 bg-navy-100 text-white px-7 py-3 rounded-full font-medium text-[15px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prochaine étape
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <CountrySelect
              selected={step2.destinations}
              onChange={(destinations) => setStep2({ ...step2, destinations })}
            />

            
            <DateRangePicker
              startDate={step2.startDate}
              endDate={step2.endDate}
              onChange={(startDate, endDate) =>
                setStep2({ ...step2, startDate, endDate })
              }
            />

            
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Budget <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={step2.budget}
                  onChange={(e) => setStep2({ ...step2, budget: e.target.value })}
                  placeholder="Budget estimé"
                  className="w-full border border-separator-90 rounded-xl px-4 py-3 pr-16 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-40 font-medium">
                  DZD
                </span>
              </div>
              <p className="text-black-40 text-xs tracking-tight mt-1.5">
                Cela nous aide à vous proposer l'option la plus adaptée.
              </p>
            </div>

            
            <div className="flex items-start gap-10 pt-1">
              <PersonCounter
                label="Nombre d'adultes"
                value={step2.adults}
                onChange={(adults) => setStep2({ ...step2, adults })}
              />
              <PersonCounter
                label="Nombre d'enfants"
                value={step2.children}
                onChange={handleChildrenChange}
              />
            </div>

            {step2.children > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                    Âge de chaque enfant <span className="text-red-500">*</span>
                  </label>
                  <p className="text-black-40 text-xs tracking-tight">
                    Renseignez un âge entre 0 et 100 ans pour chaque enfant.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {step2.childAges.map((age, index) => (
                    <div key={index}>
                      <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                        Enfant {index + 1} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={MAX_CHILD_AGE_DIGITS}
                          required
                          value={age}
                          onChange={(e) => handleChildAgeChange(index, e.target.value)}
                          placeholder="Âge"
                          className="w-full border border-separator-90 rounded-xl px-4 py-3 pr-16 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-40 font-medium">
                          ans
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            <div className="flex justify-end pt-4">
              <div className="flex flex-col items-end gap-3">
                {submitError && (
                  <p className="max-w-sm text-right text-red-500 text-sm tracking-tight">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!step2Valid || submitting}
                  className="inline-flex items-center gap-2 bg-navy-100 text-white px-7 py-3 rounded-full font-medium text-[15px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <Footer />

      
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
