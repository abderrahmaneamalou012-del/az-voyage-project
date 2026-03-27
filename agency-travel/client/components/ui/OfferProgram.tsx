import { useEffect, useRef, useState, useCallback } from "react";
import { Info, MapPin, Utensils } from "lucide-react";
import styles from "./OfferProgram.module.css";

export interface ProgramDay {
  day: string;
  title: string;
  description: string;
  locations?: string[];
  meals?: string[];
  images?: string[];
  isLast?: boolean;
}

export interface OfferProgramProps {
  days: ProgramDay[];
}

const OfferProgram = ({ days }: OfferProgramProps) => {
  const [visibleDays, setVisibleDays] = useState<Set<number>>(new Set());
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setDayRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      dayRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    dayRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleDays((prev) => {
              const next = new Set(prev);
              next.add(index);
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [days]);

  return (
    <div>
      <h2 className="font-jakarta font-bold text-[24px] sm:text-[28px] tracking-[-1.2px] mb-8">
        <span className="text-gold-100 italic">Programme </span>
        <span className="text-black-100">du séjour</span>
      </h2>

      <div className="relative">
        {days.map((item, i) => {
          const isLast = item.isLast || i === days.length - 1;
          const isDayVisible = visibleDays.has(i);

          
          const maxVisible = visibleDays.size
            ? Math.max(...visibleDays)
            : -1;
          const isActive = isDayVisible && i === maxVisible;
          const isCompleted = isDayVisible && i < maxVisible;

          const dotStateClass = isActive
            ? styles.timelineDotActive
            : isCompleted
              ? styles.timelineDotCompleted
              : "";

          return (
            <div
              key={i}
              ref={setDayRef(i)}
              className="flex gap-5 pb-8 last:pb-0"
            >
              
              <div className="flex flex-col items-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1 ${
                    isLast && !isDayVisible
                      ? "bg-navy-100"
                      : "border-2 border-black-20 bg-white"
                  } ${styles.timelineDot} ${dotStateClass}`}
                />
                {i < days.length - 1 && (
                  <div className="w-px flex-1 mt-2 relative">
                    
                    <div className="absolute inset-0 bg-black-20/20 rounded-full" />
                    
                    <div
                      className={`absolute inset-0 rounded-full ${styles.timelineLine} ${isDayVisible ? styles.timelineLineVisible : ""}`}
                      style={{ transitionDelay: `${i * 0.15}s` }}
                    />
                  </div>
                )}
              </div>

              
              <div className="pb-2 flex-1 min-w-0">
                <span className="text-gold-100 font-semibold text-xs uppercase tracking-wider">
                  {item.day}
                </span>
                <h3 className="font-jakarta font-bold text-base tracking-tight text-black-100 mt-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-black-50 text-sm leading-relaxed tracking-tight">
                  {item.description}
                </p>

                
                {item.locations && item.locations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-100 flex-shrink-0" />
                    {item.locations.map((loc, li) => (
                      <span key={li} className="text-xs text-black-60 bg-navy-10/40 px-2 py-0.5 rounded-full">
                        {loc}
                      </span>
                    ))}
                  </div>
                )}

                
                {item.meals && item.meals.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Utensils className="w-3.5 h-3.5 text-gold-100 flex-shrink-0" />
                    {item.meals.map((meal, mi) => (
                      <span key={mi} className="text-xs text-black-60 bg-gold-100/10 px-2 py-0.5 rounded-full">
                        {meal}
                      </span>
                    ))}
                  </div>
                )}

                
                {item.images && item.images.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {item.images.map((src, ii) => (
                      <img
                        key={ii}
                        src={src}
                        alt={`${item.day} - ${ii + 1}`}
                        className="w-24 h-16 rounded-lg object-cover flex-shrink-0 border border-separator-90"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      
      <div className="flex items-start gap-3 mt-6 bg-gold-100/8 border border-gold-100/20 rounded-xl px-5 py-4">
        <Info className="w-5 h-5 text-gold-100 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-black-60 leading-relaxed tracking-tight">
          Le programme peut être ajusté selon les disponibilités et les conditions locales
        </p>
      </div>
    </div>
  );
};

export default OfferProgram;
