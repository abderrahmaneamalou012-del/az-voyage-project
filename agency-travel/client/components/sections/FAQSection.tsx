import { useState, useRef, useCallback } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useFAQs } from "@/hooks/useFAQs";


const CLEAN_PASSPORT_SRC = "/assets/figma/with%20no%20visa.png";
const VISA_PASSPORT_SRC = "/assets/figma/passport%20with%20visa.png";

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const { data: cmsFaqs } = useFAQs();

  
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealPercent, setRevealPercent] = useState(0); 
  const isDragging = useRef(false);

  const getPercent = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = clientX - rect.left;
    return Math.min(100, Math.max(0, (x / rect.width) * 100));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      setRevealPercent(getPercent(e.clientX));
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getPercent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      setRevealPercent(getPercent(e.clientX));
    },
    [getPercent]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const faqs = cmsFaqs ?? [];
  const hasFaqs = faqs.length > 0;
  const rowLayoutClass = hasFaqs
    ? "flex flex-col lg:flex-row gap-12 items-stretch"
    : "flex flex-col items-center";
  const passportCardClass = hasFaqs
    ? "w-full min-h-[520px] lg:min-h-0 bg-[#F9F9F9] rounded-2xl relative overflow-hidden select-none touch-none lg:w-[520px]"
    : "w-full max-w-[520px] min-h-[520px] bg-[#F9F9F9] rounded-2xl relative overflow-hidden select-none touch-none mx-auto";

  return (
    <section id="faq" className="px-6 sm:px-10 lg:px-29 py-20 bg-white">
      
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-12">
        <h2 className="font-jakarta font-bold text-[36px] sm:text-[40px] tracking-[-2px] max-w-[680px]">
          <span className="text-black-100">Tout ce qu'il </span>
          <span className="text-gold-100">faut savoir</span>
          <span className="text-black-100"> avant le départ</span>
        </h2>
        <p className="text-black-50 text-lg sm:text-xl leading-[30px] tracking-tight max-w-[420px] lg:text-right">
          Des réponses claires pour réserver sereinement. Si vous avez une question, notre équipe est joignable sur WhatsApp
        </p>
      </div>

      
      <div className={rowLayoutClass}>
        {hasFaqs && (
          <div className="flex-1">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className={`rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                    expandedIndex === index
                      ? "bg-navy-10"
                      : "bg-[#F9F9F9] border border-separator-90 hover:bg-white/70"
                  }`}
                  onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                >
                  <div className="flex justify-between items-center gap-6">
                    <h3
                      className={`${
                        expandedIndex === index ? "font-semibold" : "font-normal"
                      } text-lg text-black-100 tracking-tight transition-all duration-300`}
                    >
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 text-black-100 transition-transform duration-300 ${
                        expandedIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {expandedIndex === index && (
                    <p className="text-black-70 text-base leading-relaxed tracking-tight mt-3 animate-fade-up">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        
        <div
          ref={containerRef}
          className={passportCardClass}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          
          <img
            src={CLEAN_PASSPORT_SRC}
            alt="Passport without visa"
            className="absolute left-1/2 top-1/2 w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            draggable={false}
          />

          
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - revealPercent}% 0 0)` }}
          >
            <img
              src={VISA_PASSPORT_SRC}
              alt="Passport with visa"
              className="absolute left-1/2 top-1/2 w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              draggable={false}
            />
          </div>

          
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 bg-white rounded-full shadow-lg px-2 py-1.5 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-xl"
            style={{ left: `${revealPercent}%` }}
          >
            <ChevronLeft className="w-4 h-4 text-black-70" />
            <ChevronRight className="w-4 h-4 text-black-70" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
