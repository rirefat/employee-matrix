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

  const selectedMonthName = MONTHS_LONG[initialMonthIdx] || "Select Month";

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? "w-full" : "inline-block"} ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-slate-700 transition-all duration-150 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-200 ${
          fullWidth ? "w-full justify-between" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 font-sans text-xs font-medium leading-none select-none">
            {selectedMonthName} {initialYear}
          </span>
        </div>
      </button>

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
            } mt-2 w-64 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl z-50 p-4 overflow-hidden`}
          >
            {/* Popover Header with Year Navigation */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={decrementYear}
                className="p-1 hover:bg-slate-100 active:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-xs font-bold font-mono text-slate-800 select-none">
                {viewYear}
              </span>

              <button
                type="button"
                onClick={incrementYear}
                className="p-1 hover:bg-slate-100 active:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS_SHORT.map((monthName, idx) => {
                const isSelected = viewYear === initialYear && idx === initialMonthIdx;
                return (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => handleMonthSelect(idx)}
                    className={`py-2 px-1 text-xs font-medium rounded-xl transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? "bg-indigo-600 text-white font-bold shadow-xs hover:bg-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
                    }`}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
