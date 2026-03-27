import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isBefore,
} from "date-fns";
import { fr } from "date-fns/locale";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  placeholder?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  placeholder = "Sélectionner une plage de date",
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const [baseMonth, setBaseMonth] = useState(startDate ?? new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const leftMonth = startOfMonth(baseMonth);
  const rightMonth = addMonths(leftMonth, 1);

  const handleDayClick = (day: Date) => {
    if (selecting === "start") {
      onChange(day, null);
      setSelecting("end");
    } else {
      if (startDate && isBefore(day, startDate)) {
        onChange(day, null);
        setSelecting("end");
      } else {
        onChange(startDate, day);
        setSelecting("start");
      }
    }
  };

  const confirm = () => {
    setOpen(false);
  };

  const cancel = () => {
    onChange(null, null);
    setSelecting("start");
    setOpen(false);
  };

  const displayValue =
    startDate && endDate
      ? `${format(startDate, "dd MMM yyyy", { locale: fr })} – ${format(endDate, "dd MMM yyyy", { locale: fr })}`
      : startDate
        ? `${format(startDate, "dd MMM yyyy", { locale: fr })} – …`
        : "";

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);

    const weeks: Date[][] = [];
    let current = calStart;
    while (current <= calEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = addDays(current, 1);
      }
      weeks.push(week);
    }

    return (
      <div className="flex-1 min-w-[230px]">
        
        <div className="flex items-center justify-between mb-3">
          {isSameMonth(month, leftMonth) ? (
            <button
              type="button"
              onClick={() => setBaseMonth(subMonths(baseMonth, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-navy-10/40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-black-60" />
            </button>
          ) : (
            <div className="w-7" />
          )}
          <span className="font-jakarta font-semibold text-sm text-black-100 tracking-tight capitalize">
            {format(month, "MMMM yyyy", { locale: fr })}
          </span>
          {isSameMonth(month, rightMonth) ? (
            <button
              type="button"
              onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-navy-10/40 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-black-60" />
            </button>
          ) : (
            <div className="w-7" />
          )}
        </div>

        
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <span key={d} className="text-center text-xs text-black-40 font-medium py-1">
              {d}
            </span>
          ))}
        </div>

        
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const inMonth = isSameMonth(day, month);
              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = endDate && isSameDay(day, endDate);
              const inRange =
                startDate &&
                endDate &&
                isWithinInterval(day, { start: startDate, end: endDate });
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => inMonth && handleDayClick(day)}
                  disabled={!inMonth}
                  className={`
                    h-9 w-full text-sm transition-colors relative
                    ${!inMonth ? "invisible" : ""}
                    ${isStart || isEnd ? "bg-navy-100 text-white rounded-full font-semibold z-10" : ""}
                    ${inRange && !isStart && !isEnd ? "bg-navy-100/10 text-black-80" : ""}
                    ${isToday && !isStart && !isEnd ? "font-bold text-navy-100" : ""}
                    ${inMonth && !isStart && !isEnd && !inRange ? "text-black-60 hover:bg-navy-10/40 rounded-full" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
        Date de séjour <span className="text-red-500">*</span>
      </label>

      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-separator-90 rounded-xl px-4 py-3 text-sm tracking-tight bg-white focus:outline-none focus:border-navy-40 transition-colors"
      >
        <span className={displayValue ? "text-black-80" : "text-black-30"}>
          {displayValue || placeholder}
        </span>
        <CalendarDays className="w-4 h-4 text-black-30 flex-shrink-0" />
      </button>

      
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-separator-90 rounded-xl shadow-lg p-5">
          <div className="flex gap-6">
            {renderMonth(leftMonth)}
            {renderMonth(rightMonth)}
          </div>

          
          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-separator-90">
            <button
              type="button"
              onClick={cancel}
              className="text-sm text-black-60 hover:text-black-80 transition-colors tracking-tight"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirm}
              className="bg-navy-100 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy-90 transition-colors tracking-tight"
            >
              Confirmer selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
