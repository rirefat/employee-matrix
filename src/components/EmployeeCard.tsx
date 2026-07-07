import React from "react";
import { Employee, PerformanceRecord } from "../types";
import { Calendar, Users, Briefcase, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface EmployeeCardProps {
  employee: Employee;
  isActive: boolean;
  performanceRecord?: PerformanceRecord;
  hasReport: boolean;
  onClick: () => void;
  index?: number;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isActive,
  performanceRecord,
  hasReport,
  onClick,
  index = 0,
}) => {
  // Extract initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const attendance = performanceRecord ? performanceRecord.attendance : null;
  const meetings = performanceRecord ? performanceRecord.conductedMeetings : null;
  const projects = performanceRecord ? performanceRecord.deliveredProjectsAmount : null;
  const value = performanceRecord ? performanceRecord.deliveredProjectsValue : null;

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
      className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive
          ? "bg-white/60 border-blue-300/80 shadow-lg ring-1 ring-blue-500/10 scale-[1.01]"
          : "bg-white/30 border-slate-100/60 hover:bg-white/50 hover:border-slate-300/40 hover:shadow-md"
      }`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Decorative ambient glassmorphism glow backdrops */}
      <div
        className={`absolute -right-12 -top-12 w-28 h-28 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
          isActive
            ? "bg-gradient-to-br from-blue-400/20 to-indigo-500/20 scale-125"
            : "bg-blue-400/5 group-hover:bg-blue-400/10"
        }`}
      />
      <div
        className={`absolute -left-12 -bottom-12 w-28 h-28 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
          isActive
            ? "bg-gradient-to-br from-emerald-400/20 to-teal-500/20 scale-125"
            : "bg-emerald-400/0 group-hover:bg-emerald-400/5"
        }`}
      />

      {/* Card Header Info */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Creative Profile Initials with Glass reflection and glowing borders */}
          <div
            className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-xs ${
              isActive
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border border-white/20 ring-4 ring-blue-500/10"
                : "bg-slate-100/80 text-slate-600 border border-slate-200/50 group-hover:bg-slate-200/50"
            }`}
          >
            <span className="tracking-wider">{getInitials(employee.name)}</span>
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate tracking-tight group-hover:text-blue-600 transition-colors">
              {employee.name}
            </h4>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium flex items-center gap-1">
              <Briefcase className="h-2.5 w-2.5 opacity-60" />
              {employee.role}
            </p>
          </div>
        </div>

        {/* State Tags */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] font-mono font-extrabold text-slate-700 bg-slate-100/80 px-1.5 py-0.5 rounded-md border border-slate-200/30">
            {employee.department.split(" ")[0]}
          </span>
          <div className="flex gap-1">
            {hasReport ? (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[8px] font-bold border border-emerald-500/20">
                <Sparkles className="h-2 w-2" />
                AI Verified
              </span>
            ) : performanceRecord ? (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 text-[8px] font-bold border border-blue-500/20">
                Logged
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[8px] font-bold border border-amber-500/20">
                Pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Creative Matrix Performance Representation */}
      {performanceRecord ? (
        <div className="relative z-10 mt-3.5 pt-3 border-t border-slate-100/80">
          {/* Micro Grid Metrics */}
          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            {/* Metric 1: Attendance */}
            <div className="bg-slate-50/40 group-hover:bg-slate-50/60 transition-colors p-1.5 rounded-lg border border-slate-100/50">
              <div className="flex items-center gap-0.5 text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                <Calendar className="h-2 w-2 text-emerald-500" />
                <span>Attd</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                {attendance}%
              </span>
            </div>

            {/* Metric 2: Meetings */}
            <div className="bg-slate-50/40 group-hover:bg-slate-50/60 transition-colors p-1.5 rounded-lg border border-slate-100/50">
              <div className="flex items-center gap-0.5 text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                <Users className="h-2 w-2 text-blue-500" />
                <span>Meet</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                {meetings}
              </span>
            </div>

            {/* Metric 3: Projects */}
            <div className="bg-slate-50/40 group-hover:bg-slate-50/60 transition-colors p-1.5 rounded-lg border border-slate-100/50">
              <div className="flex items-center gap-0.5 text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                <TrendingUp className="h-2 w-2 text-indigo-500" />
                <span>Value</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                {value ? `$${(value / 1000).toFixed(0)}k` : "—"}
              </span>
            </div>
          </div>

          {/* Minimalist Micro Progress Bar linking all metrics together */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[8px] text-slate-400 font-semibold font-mono">
              <span>Overall Score Matrix</span>
              <span className="text-blue-600 font-bold">
                {Math.round(((attendance || 0) + Math.min(100, ((meetings || 0) / 15) * 100) + Math.min(100, ((projects || 0) / 3) * 100)) / 3)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100/80 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${(attendance || 0) / 3}%` }}
                title={`Attendance: ${attendance}%`}
              />
              <div
                className="h-full bg-blue-400 transition-all duration-500"
                style={{ width: `${Math.min(100, ((meetings || 0) / 15) * 100) / 3}%` }}
                title={`Meetings: ${meetings}`}
              />
              <div
                className="h-full bg-indigo-400 transition-all duration-500"
                style={{ width: `${Math.min(100, ((projects || 0) / 3) * 100) / 3}%` }}
                title={`Projects: ${projects}`}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 mt-3.5 pt-3.5 border-t border-slate-100/80 text-[10px] text-slate-400 italic text-center py-2 bg-slate-50/20 rounded-lg border border-dashed border-slate-200/40">
          No performance logged for this month
        </div>
      )}
    </motion.div>
  );
};
