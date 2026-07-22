import React, { useState, useMemo } from 'react';
import { Employee, PerformanceRecord } from '../types';
import { Target, Activity, CheckCircle, BarChart3, Clock, AlertTriangle, Briefcase, Sparkles, FolderKanban, TrendingUp, Hexagon, CalendarClock, Users, ArrowUpRight, Edit3, Rocket, Lightbulb, Handshake, Crosshair, TrendingUp as GrowthIcon, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { get3DAvatarUrl } from '../utils';

interface GeneralUserDashboardProps {
  employee: Employee | null;
  userName?: string;
  performanceRecord?: PerformanceRecord | null;
  onUpdateEmployee?: (emp: Employee) => void;
}

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

export function GeneralUserDashboard({ employee, userName, performanceRecord, onUpdateEmployee }: GeneralUserDashboardProps) {
  const [kudos, setKudos] = useState<Record<string, number>>(employee?.kudos || {
    velocity: 8,
    innovation: 9,
    collaboration: 6,
    precision: 5,
    growth: 16,
    empathy: 7
  });

  const [dailyFocus, setDailyFocus] = useState(() => {
    return localStorage.getItem("nexus_daily_focus") || "";
  });
  
  const [isFocusCompleted, setIsFocusCompleted] = useState(() => {
    return localStorage.getItem("nexus_focus_completed") === "true";
  });

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nexus_daily_focus") {
        setDailyFocus(e.newValue || "");
      } else if (e.key === "nexus_focus_completed") {
        setIsFocusCompleted(e.newValue === "true");
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const MAX_FOCUS_LENGTH = 45;

  const handleFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_FOCUS_LENGTH) {
      setDailyFocus(val);
      localStorage.setItem("nexus_daily_focus", val);
      if (isFocusCompleted) {
        setIsFocusCompleted(false);
        localStorage.setItem("nexus_focus_completed", "false");
      }
    }
  };

  const toggleFocusCompleted = () => {
    if (!dailyFocus) return;
    const newVal = !isFocusCompleted;
    setIsFocusCompleted(newVal);
    localStorage.setItem("nexus_focus_completed", String(newVal));
  };

  const displayUser = userName || employee?.name || "General User";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const motivationalQuote = useMemo(() => {
    const quotes = [
      "Every step forward is a step toward your potential.",
      "Great things never come from comfort zones.",
      "Small disciplines repeated with consistency lead to great achievements.",
      "Your energy introduces you before you even speak.",
      "Make today a masterpiece."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  if (!employee) {
    return (
      <div className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 pt-24 overflow-y-auto flex items-center justify-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 font-medium">No profile data available.</motion.p>
      </div>
    );
  }

  const attendance = performanceRecord?.attendance ?? 0;
  const projectsDelivered = performanceRecord?.deliveredProjectsAmount ?? 0;
  const projectsValue = performanceRecord?.deliveredProjectsValue ?? 0;
  const conductedMeetings = performanceRecord?.conductedMeetings ?? 0;
  
  const tickets = employee.tickets || [];

  const targetAtt = 95;
  const targetVal = 2727;

  const attScore = Math.min(100, (attendance / targetAtt) * 100);
  const valScore = Math.min(100, (projectsValue / targetVal) * 100);
  const overallPerformance = performanceRecord ? Math.round(attScore * 0.5 + valScore * 0.5) : null;

  const totalKudos = Object.values(kudos).reduce((a: number, b: number) => a + b, 0);

  const handleAddKudos = async (key: keyof typeof kudos) => {
    const newValue = kudos[key as keyof typeof kudos] + 1;
    const newKudos = { ...kudos, [key]: newValue };
    setKudos(newKudos);
    
    if (employee) {
      try {
        await fetch(`/api/employees/${employee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...employee,
            kudos: newKudos
          })
        });
        if (onUpdateEmployee) {
          onUpdateEmployee({ ...employee, kudos: newKudos });
        }
      } catch (e) {
        console.error("Failed to update kudos", e);
      }
    }
  };

  return (
    <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-6 pt-8 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
      
      {/* Fancy Minimal Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="relative pb-2"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl text-slate-800 tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="font-light text-slate-600">{greeting},</span>{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-500">{displayUser.split(' ')[0]}</span><span className="text-indigo-600 font-bold animate-pulse">_</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "3rem" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-px bg-indigo-200 my-2"
            />
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-sm md:text-base text-slate-500 max-w-lg font-medium leading-relaxed"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {motivationalQuote}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="pt-3"
            >
              <div className="group relative max-w-md w-full transition-transform duration-300 focus-within:scale-[1.02]">
                <div className={`absolute -inset-0.5 rounded-xl blur transition duration-500 ${isFocusCompleted ? 'bg-emerald-400 opacity-30' : 'bg-gradient-to-r from-indigo-400 to-violet-400 opacity-20 group-hover:opacity-40 group-focus-within:opacity-100 group-focus-within:duration-200'}`}></div>
                <div className={`relative flex items-center gap-3 px-4 py-2.5 bg-white border rounded-xl w-full shadow-sm transition-all duration-300 overflow-hidden ${isFocusCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 focus-within:border-indigo-400 focus-within:shadow-[inset_0_0_15px_rgba(99,102,241,0.15)] focus-within:ring-2 focus-within:ring-indigo-100'}`}>
                  
                  {isFocusCompleted && (
                    <motion.div 
                      layoutId="focus-bg"
                      className="absolute inset-0 bg-emerald-50/50 backdrop-blur-[2px]"
                    />
                  )}

                  <div className="font-mono text-sm shrink-0 flex items-center gap-2 relative z-10">
                    <span className={isFocusCompleted ? "text-emerald-400" : "text-slate-400"}>~</span>
                    <span className={isFocusCompleted ? "text-emerald-500 font-bold" : "text-indigo-500 font-bold"}>
                      <motion.span
                        key={isFocusCompleted ? "done" : "focus"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                      >
                        {isFocusCompleted ? "/mission_accomplished" : "/focus"}
                      </motion.span>
                    </span>
                    <span className={`transition-colors ${isFocusCompleted ? "text-emerald-400 animate-pulse" : "text-slate-400 group-focus-within:text-indigo-400"}`}>❯</span>
                  </div>
                  <div className="relative w-full flex items-center min-w-0">
                    <input 
                      type="text" 
                      value={dailyFocus}
                      onChange={handleFocusChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') toggleFocusCompleted();
                      }}
                      placeholder="initialize objective..." 
                      className={`bg-transparent border-none outline-none text-sm font-mono w-full min-w-0 relative z-10 transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis pr-2 ${
                        isFocusCompleted 
                          ? 'text-emerald-800 font-medium tracking-wide drop-shadow-sm' 
                          : 'text-slate-800 placeholder:text-slate-400'
                      }`}
                      spellCheck={false}
                    />
                    <div className={`absolute -bottom-6 right-0 text-[10px] font-mono transition-opacity ${dailyFocus.length > MAX_FOCUS_LENGTH - 10 ? (dailyFocus.length === MAX_FOCUS_LENGTH ? 'text-red-500 font-bold opacity-100' : 'text-amber-500 opacity-100') : 'text-slate-400 opacity-0 group-focus-within:opacity-100'}`}>
                      {MAX_FOCUS_LENGTH - dailyFocus.length}
                    </div>
                    {isFocusCompleted && (
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute left-0 right-0 h-[1px] bg-emerald-400/50 bottom-1 pointer-events-none origin-left"
                      />
                    )}
                  </div>
                  <motion.div 
                    initial={false}
                    animate={{ opacity: dailyFocus ? 1 : 0, scale: dailyFocus ? 1 : 0.8 }} 
                    className="flex items-center justify-center shrink-0 ml-2 relative z-10"
                  >
                     <button 
                       onClick={toggleFocusCompleted}
                       className={`relative flex h-5 w-5 items-center justify-center rounded-md transition-all ${
                         isFocusCompleted ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600'
                       }`}
                     >
                       {isFocusCompleted ? (
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       ) : (
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                       )}
                     </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="hidden md:flex flex-col items-end pt-2">
             <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
               <Sparkles className="w-5 h-5 text-indigo-400" />
             </div>
             <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Period Status</p>
             <p className="text-sm font-bold text-slate-900">{overallPerformance && overallPerformance >= 90 ? "Optimal Performance" : "Active"}</p>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout: Main info card (70%) + Interesting Kudos & DNA panel (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Left Block: Main Profile Card (70%) */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-xl p-6 bg-white flex flex-col justify-between">
          {/* Background dot grid pattern with fade-out mask */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none" style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />
          {/* Atmospheric color nodes under glass to enhance depth */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          
          {/* Technical decorative crosshairs and corner lines for a premium aesthetic */}
          <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-slate-300 pointer-events-none" />
          <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-slate-300 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-slate-300 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-slate-300 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex gap-4 flex-1 min-w-0">
              {/* Avatar block with active state glowing borders */}
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shadow-md border border-slate-200 overflow-hidden shrink-0">
                <img src={get3DAvatarUrl(displayUser)} alt={displayUser} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">{displayUser}</h1>
                <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="font-medium">Matrix Tier:</span>
                  {performanceRecord ? (
                    attendance >= targetAtt && projectsValue >= targetVal ? (
                      <span className="text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px]">Exceeds Expectations</span>
                    ) : (overallPerformance || 0) >= 80 ? (
                      <span className="text-blue-700 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full text-[11px]">Meets Expectations</span>
                    ) : (
                      <span className="text-amber-600 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-[11px]">Development Required</span>
                    )
                  ) : (
                    <span className="text-slate-500 italic font-medium">No metrics registered yet</span>
                  )}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200/40 space-y-3">
                  {/* Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                        Overall Performance Rating
                      </span>
                      {performanceRecord && overallPerformance !== null ? (
                        <span className={`whitespace-nowrap inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border transition-colors ${
                          overallPerformance >= 90
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : overallPerformance >= 70
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            overallPerformance >= 90
                               ? "bg-emerald-500 animate-pulse"
                               : overallPerformance >= 70
                               ? "bg-amber-500"
                               : "bg-rose-500 animate-ping"
                          }`} />
                          {overallPerformance >= 90 ? "On Track" : overallPerformance >= 70 ? "Needs Attention" : "At Risk"}
                        </span>
                      ) : null}
                    </div>
                    
                    {performanceRecord && overallPerformance !== null ? (
                      <span className="text-xs font-bold font-mono text-slate-800">
                        {overallPerformance}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No metrics registered yet</span>
                    )}
                  </div>
                  {/* Creative Horizontal Segmented Rating Line */}
                  {performanceRecord && overallPerformance !== null && (
                    <div className="space-y-2">
                      <div className="relative w-full h-1.5 bg-slate-100/80 rounded-full overflow-hidden flex">
                        {/* Background segment colors under layer */}
                        <div className="w-[70%] h-full bg-rose-500/10 border-r border-white/40" />
                        <div className="w-[20%] h-full bg-amber-500/10 border-r border-white/40" />
                        <div className="w-[10%] h-full bg-emerald-500/10" />
                        
                        {/* Animated Progress Overlay */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${overallPerformance}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            overallPerformance >= 90
                               ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                               : overallPerformance >= 70
                               ? "bg-gradient-to-r from-amber-400 to-amber-500"
                               : "bg-gradient-to-r from-rose-400 to-rose-500"
                          }`}
                        />
                      </div>
                      {/* Minimal Status Key Legend */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[10px] font-semibold text-slate-500 font-mono">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> At Risk (&lt;70%)
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Needs Attention (70%-89%)
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> On Track (90%+)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Four metrics boxes redesigned as frosted glass panels with target comparisons */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Box 1: Attendance */}
            <div className={`p-4 border rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:shadow-xs ${
              performanceRecord && attendance >= targetAtt
                ? "bg-emerald-50/20 border-emerald-200/50 hover:bg-emerald-50/30"
                : performanceRecord
                ? "bg-rose-50/20 border-rose-200/50 hover:bg-rose-50/30"
                : "bg-white/40 border-white/50 hover:bg-white/50"
            }`}>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
                  {performanceRecord && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      attendance >= targetAtt
                        ? "text-emerald-700 bg-emerald-100/60"
                        : "text-rose-700 bg-rose-100/60"
                    }`}>
                      {attendance >= targetAtt ? "Met ✓" : "Missed ⚠"}
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold font-mono text-slate-800">
                  {performanceRecord ? `${attendance}%` : "—"}
                </div>
                <div className="text-[10px] text-slate-500 font-medium font-sans mt-0.5">
                  Target: <span className="font-mono font-bold">{targetAtt}%</span>
                </div>
                {performanceRecord && (
                  <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5 text-[9px] font-semibold text-slate-500 font-mono">
                    <span className="text-emerald-700 bg-emerald-500/10 px-1 rounded">Pres: {performanceRecord.presentDays !== undefined ? performanceRecord.presentDays : Math.round(22 * (attendance / 100))}d</span>
                    <span className="text-rose-700 bg-rose-500/10 px-1 rounded">Abs: {performanceRecord.absentDays !== undefined ? performanceRecord.absentDays : (22 - Math.round(22 * (attendance / 100)))}d</span>
                  </div>
                )}
              </div>
              <div className="h-1 w-full bg-slate-200/50 rounded-full mt-2 overflow-hidden border border-white/20">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    performanceRecord && attendance >= targetAtt
                      ? "bg-emerald-400"
                      : "bg-rose-400 animate-pulse"
                  }`}
                  style={{ width: `${performanceRecord ? attendance : 0}%` }}
                />
              </div>
            </div>

            {/* Box 2: Delivered Project Value */}
            <div className={`p-4 border rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:shadow-xs ${
              performanceRecord && projectsValue >= targetVal
                ? "bg-indigo-50/20 border-indigo-200/50 hover:bg-indigo-50/30"
                : performanceRecord
                ? "bg-rose-50/20 border-rose-200/50 hover:bg-rose-50/30"
                : "bg-white/40 border-white/50 hover:bg-white/50"
            }`}>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delivered Value</span>
                  {performanceRecord && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      projectsValue >= targetVal
                        ? "text-indigo-700 bg-indigo-100/60"
                        : "text-rose-700 bg-rose-100/60"
                    }`}>
                      {projectsValue >= targetVal ? "Met ✓" : "Missed ⚠"}
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold font-mono text-slate-800">
                  {performanceRecord ? `$${(projectsValue).toLocaleString()}` : "—"}
                </div>
                <div className="text-[10px] text-slate-500 font-medium font-sans mt-0.5">
                  Target: <span className="font-mono font-bold">${targetVal.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-200/50 rounded-full mt-2 overflow-hidden border border-white/20">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    performanceRecord && projectsValue >= targetVal
                      ? "bg-indigo-400"
                      : "bg-rose-400 animate-pulse"
                  }`}
                  style={{ width: `${performanceRecord ? Math.min(100, (projectsValue / targetVal) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Box 3: Project Count */}
            <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:bg-white/50 hover:shadow-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Projects Shipped</div>
                <div className="text-xl font-bold font-mono text-slate-800">
                  {performanceRecord ? projectsDelivered : "—"}
                </div>
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-2 truncate bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md inline-block w-max font-mono">
                {performanceRecord ? `+${projectsDelivered} Deliverables` : "No activity"}
              </div>
            </div>

            {/* Box 4: Meetings Conducted */}
            <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:bg-white/50 hover:shadow-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Meetings Conducted</div>
                <div className="text-xl font-bold font-mono text-slate-800">
                  {performanceRecord ? conductedMeetings : "—"}
                </div>
              </div>
              <div className="text-[10px] text-indigo-700 font-bold mt-2 truncate bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md inline-block w-max font-mono">
                {performanceRecord ? `${conductedMeetings} sessions run` : "No activity"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Block: DNA & Peer Kudos Indicator (30%) */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-xl p-5 bg-white flex flex-col justify-between">
          {/* Background dot grid pattern with fade-out mask */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none" style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />
          
          {/* Ambient decorative lighting */}
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          
          {/* Top-3/Right-3 indicators */}
          <div className="absolute top-3 left-3 w-1 h-1 border-t border-l border-slate-300 pointer-events-none" />
          <div className="absolute top-3 right-3 w-1 h-1 border-t border-r border-slate-300 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-1 h-1 border-b border-l border-slate-300 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-1 h-1 border-b border-r border-slate-300 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                  DNA Kudos Hub
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Click tags to award peer recognition.</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-500/10 px-1.5 py-0.5 rounded-md font-mono animate-pulse">
                Live
              </span>
            </div>

            {/* Kudos Upvote Items */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "velocity" as const, label: "Velocity", icon: "🚀", color: "hover:border-amber-200 hover:bg-amber-500/5 hover:text-amber-700 text-amber-600 border-amber-100" },
                { key: "innovation" as const, label: "Innovation", icon: "💡", color: "hover:border-purple-200 hover:bg-purple-500/5 hover:text-purple-700 text-purple-600 border-purple-100" },
                { key: "collaboration" as const, label: "Collaboration", icon: "🤝", color: "hover:border-emerald-200 hover:bg-emerald-500/5 hover:text-emerald-700 text-emerald-600 border-emerald-100" },
                { key: "precision" as const, label: "Precision", icon: "🎯", color: "hover:border-indigo-200 hover:bg-indigo-500/5 hover:text-indigo-700 text-indigo-600 border-indigo-100" },
                { key: "growth" as const, label: "Growth", icon: "🌱", color: "hover:border-teal-200 hover:bg-teal-500/5 hover:text-teal-700 text-teal-600 border-teal-100" },
                { key: "empathy" as const, label: "Empathy", icon: "💖", color: "hover:border-rose-200 hover:bg-rose-500/5 hover:text-rose-700 text-rose-600 border-rose-100" }
              ].map((item) => {
                const points = kudos[item.key as keyof typeof kudos];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleAddKudos(item.key as keyof typeof kudos)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border bg-white/50 text-center transition-all hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer ${item.color}`}
                  >
                    <span className="text-base group-hover:animate-bounce">{item.icon}</span>
                    <span className="text-[11px] font-bold text-slate-700 mt-1">{item.label}</span>
                    <span className="text-[11px] font-extrabold font-mono text-slate-500 mt-0.5 bg-slate-100 px-1.5 py-0.2 rounded">
                      {points}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Synergy Wave</p>
                 <p className="text-xs font-bold text-slate-700 font-mono mt-0.5">{totalKudos} pts total</p>               </div>
               <div className="flex gap-0.5 h-4 items-center opacity-60">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className={`w-1 bg-gradient-to-t ${i % 2 === 0 ? 'from-indigo-300 to-purple-300' : 'from-emerald-300 to-teal-300'} rounded-full animate-pulse`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}
