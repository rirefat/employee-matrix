import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MonthPickerProps {
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
  className?: string;
  align?: "left" | "right";
  fullWidth?: boolean;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
  className = "",
  align = "left",
  fullWidth = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial year and month
  const [yearStr, monthStr] = value.split("-");
  const initialYear = parseInt(yearStr, 10) || new Date().getFullYear();
  const initialMonthIdx = (parseInt(monthStr, 10) || 1) - 1;

  // Track the navigated year in the picker view
  const [viewYear, setViewYear] = useState(initialYear);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep viewYear synced with prop value updates
  useEffect(() => {
    const [y] = value.split("-");
    const currentYear = parseInt(y, 10);
    if (!isNaN(currentYear)) {
      setViewYear(currentYear);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleMonthSelect = (monthIndex: number) => {
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    const formattedYear = String(viewYear);
    onChange(`${formattedYear}-${formattedMonth}`);
    setIsOpen(false);
  };

  const incrementYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear(prev => prev + 1);
  };

  const decrementYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear(prev => prev - 1);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const [y, m] = value.split("-").map(Number);
    let newY = y;
    let newM = m - 1;
    if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    onChange(`${newY}-${String(newM).padStart(2, "0")}`);
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const [y, m] = value.split("-").map(Number);
    let newY = y;
    let newM = m + 1;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    }
    onChange(`${newY}-${String(newM).padStart(2, "0")}`);
  };

  const selectedMonthName = MONTHS_LONG[initialMonthIdx] || "Select Month";

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? "w-full" : "inline-block"} ${className}`}>
      {/* Sleek, Premium Multi-action Month Navigator Container */}
      <div className="flex items-center gap-1 bg-slate-50/70 border border-slate-200/50 rounded-full p-1 shadow-4xs hover:border-slate-300 hover:shadow-3xs transition-all duration-300">
        {/* Previous Month Arrow */}
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 rounded-full cursor-pointer transition-all duration-200 active:scale-90"
          title="Previous Month"
        >
          <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>

        {/* Center Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-slate-700 hover:text-slate-900 rounded-full text-[11px] font-black uppercase tracking-wider font-mono cursor-pointer transition-all duration-300 flex items-center gap-1.5 select-none"
        >
          <Calendar className="h-3 w-3 text-slate-500" />
          <span>{selectedMonthName} {initialYear}</span>
        </button>

        {/* Next Month Arrow */}
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 rounded-full cursor-pointer transition-all duration-200 active:scale-90"
          title="Next Month"
        >
          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${
              align === "right" ? "right-0" : "left-0"
            } mt-2 w-64 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] z-50 p-4 overflow-hidden`}
          >
            {/* Popover Header with Year Navigation */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={decrementYear}
                className="p-1.5 hover:bg-slate-100 active:bg-slate-200/60 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2]" />
              </button>
              
              <span className="text-xs font-black font-mono tracking-widest text-slate-800 select-none">
                {viewYear}
              </span>

              <button
                type="button"
                onClick={incrementYear}
                className="p-1.5 hover:bg-slate-100 active:bg-slate-200/60 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 stroke-[2]" />
              </button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {MONTHS_SHORT.map((monthName, idx) => {
                const isSelected = viewYear === initialYear && idx === initialMonthIdx;
                return (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => handleMonthSelect(idx)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer select-none font-mono ${
                      isSelected
                        ? "bg-slate-900 text-white font-extrabold shadow-md shadow-slate-900/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100/60"
                    }`}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>

            {/* Current Month Shortcut */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const y = now.getFullYear();
                  const m = String(now.getMonth() + 1).padStart(2, "0");
                  onChange(`${y}-${m}`);
                  setIsOpen(false);
                }}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Current Month
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
