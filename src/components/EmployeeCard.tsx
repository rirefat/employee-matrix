import React from "react";
import { Employee, PerformanceRecord, MonthlyTarget } from "../types";
import { Calendar, Users, Briefcase, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

import { get3DAvatarUrl } from "../utils";

interface EmployeeCardProps {
  employee: Employee;
  isActive: boolean;
  performanceRecord?: PerformanceRecord;
  hasReport: boolean;
  onClick: () => void;
  index?: number;
  target?: MonthlyTarget;
  targetProjectValueMin?: number;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isActive,
  performanceRecord,
  hasReport,
  onClick,
  index = 0,
  target,
  targetProjectValueMin = 25000,
}) => {
  const attendance = performanceRecord ? performanceRecord.attendance : null;
  const meetings = performanceRecord ? performanceRecord.conductedMeetings : null;
  const projects = performanceRecord ? performanceRecord.deliveredProjectsAmount : null;
  const value = performanceRecord ? performanceRecord.deliveredProjectsValue : null;

  const targetAttendanceMin = target?.attendanceMin || 95;

  const attScore = attendance !== null ? Math.min(100, (attendance / targetAttendanceMin) * 100) : 0;
  const valScore = value !== null ? Math.min(100, (value / targetProjectValueMin) * 100) : 0;
  const combinedScore = attendance !== null && value !== null ? Math.round(attScore * 0.5 + valScore * 0.5) : 0;

  // Memoize underperforming metrics check
  const underperformingMetrics = React.useMemo(() => {
    if (!performanceRecord) return [];
    const flags: string[] = [];
    if (attendance !== null && attendance < targetAttendanceMin) {
      flags.push("Attendance");
    }
    if (value !== null && value < targetProjectValueMin) {
      flags.push("Project Value");
    }
    return flags;
  }, [performanceRecord, targetAttendanceMin, targetProjectValueMin, attendance, value]);

  // Modern Lottie-like organic spring settings
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 24, 
      scale: 0.94,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 280, 
        damping: 22,
        delay: Math.min(0.25, index * 0.045), // cap maximum stagger delay to keep interface snappy
      }
    }
  };

  return (
    <motion.div
      layout="position"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      className={`group relative p-3 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive
          ? "bg-white border-blue-300/80 shadow-sm ring-1 ring-blue-500/5 scale-[1.01]"
          : "bg-white/40 border-slate-100/60 hover:bg-white hover:border-slate-300/40 hover:shadow-2xs"
      }`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Subtle ambient blur accents for active cards */}
      {isActive && (
        <>
          <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-20 h-20 rounded-full bg-indigo-400/10 blur-xl pointer-events-none" />
        </>
      )}

      {/* Main Row Content */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Compact Profile Avatar */}
          <div
            className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 overflow-hidden ${
              isActive
                ? "bg-slate-50 shadow-2xs border border-slate-200"
                : "bg-slate-100/80 border border-slate-200/40 group-hover:bg-slate-200/50"
            }`}
          >
            <img src={get3DAvatarUrl(employee.name)} alt={employee.name} className="w-full h-full object-cover" />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {employee.name}
            </h4>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
              {employee.role}
            </p>
          </div>
        </div>

        {/* Right Aligned Target Score Pill */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {performanceRecord ? (
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
              combinedScore >= 95
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/30"
                : combinedScore >= 70
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200/30"
                : "bg-rose-50 text-rose-700 border border-rose-200/30"
            }`}>
              {combinedScore}%
            </span>
          ) : (
            <span className="text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded-md bg-slate-100/80 text-slate-400 border border-slate-200/10">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Ultra-sleek single-line micro-metrics */}
      {performanceRecord && (
        <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-100/80 flex flex-col gap-1 text-[9px] font-mono text-slate-400">
          <div className="flex items-center justify-between">
            <span>Attd: <strong className={attendance !== null && attendance < targetAttendanceMin ? "text-rose-600 font-extrabold" : "text-slate-600 font-semibold"}>{attendance}%</strong> <span className="text-slate-300 font-normal">/ {targetAttendanceMin}%</span></span>
            
            <div className="flex items-center gap-1">
              {underperformingMetrics.length > 0 ? (
                <span className="flex items-center gap-0.5 text-rose-500 font-bold text-[8px] uppercase tracking-wider animate-pulse">
                  <AlertCircle className="h-2 w-2" />
                  Under Target
                </span>
              ) : hasReport ? (
                <span className="text-emerald-600 font-bold text-[8px] uppercase tracking-wider">
                  AI Verified
                </span>
              ) : (
                <span className="text-slate-400 font-semibold text-[8px] uppercase tracking-wider">
                  Logged
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <span>Target: <strong className="text-slate-600 font-semibold">${targetProjectValueMin.toLocaleString()}</strong></span>
            <span className="text-slate-200">•</span>
            <span>Achieved: <strong className={value !== null && value < targetProjectValueMin ? "text-rose-600 font-extrabold" : "text-emerald-600 font-extrabold"}>{value !== null ? `$${value.toLocaleString()}` : "—"}</strong></span>
          </div>
        </div>
      )}

      {/* Decorative dynamic edge-aligned progress bar */}
      {performanceRecord && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-100/50 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              combinedScore >= 95
                ? "bg-emerald-500"
                : combinedScore >= 70
                ? "bg-indigo-500"
                : "bg-rose-500 animate-pulse"
            }`}
            style={{ width: `${combinedScore}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};
