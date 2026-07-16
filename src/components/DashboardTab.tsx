import React, { useMemo } from "react";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  Video,
  Award,
  DollarSign,
  Briefcase,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Line,
  Cell
} from "recharts";
import { Employee, PerformanceRecord } from "../types";
import { motion } from "motion/react";

interface DashboardTabProps {
  employees: Employee[];
  records: PerformanceRecord[];
}

export function DashboardTab({ employees, records }: DashboardTabProps) {
  // 1. Core Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalEmployees = employees.length;
    if (records.length === 0) {
      return {
        totalEmployees,
        avgAttendance: 0,
        totalMeetings: 0,
        totalProjectsAmount: 0,
        totalProjectsValue: 0,
      };
    }

    let sumAttendance = 0;
    let totalMeetings = 0;
    let totalProjectsAmount = 0;
    let totalProjectsValue = 0;

    records.forEach((rec) => {
      sumAttendance += rec.attendance;
      totalMeetings += rec.conductedMeetings;
      totalProjectsAmount += rec.deliveredProjectsAmount;
      totalProjectsValue += rec.deliveredProjectsValue;
    });

    return {
      totalEmployees,
      avgAttendance: Math.round((sumAttendance / records.length) * 10) / 10,
      totalMeetings,
      totalProjectsAmount,
      totalProjectsValue,
    };
  }, [employees, records]);

  // 2. Departmental Groupings
  const departmentData = useMemo(() => {
    const map: Record<string, {
      dept: string;
      value: number;
      amount: number;
      meetings: number;
      attendanceSum: number;
      count: number;
    }> = {};

    records.forEach((rec) => {
      const emp = employees.find((e) => e.id === rec.employeeId);
      if (!emp) return;
      const dept = emp.department;

      if (!map[dept]) {
        map[dept] = {
          dept,
          value: 0,
          amount: 0,
          meetings: 0,
          attendanceSum: 0,
          count: 0
        };
      }

      map[dept].value += rec.deliveredProjectsValue;
      map[dept].amount += rec.deliveredProjectsAmount;
      map[dept].meetings += rec.conductedMeetings;
      map[dept].attendanceSum += rec.attendance;
      map[dept].count += 1;
    });

    return Object.values(map).map((d) => ({
      name: d.dept,
      "Total Value ($)": d.value,
      "Value ($k)": Math.round(d.value / 1000),
      "Projects Delivered": d.amount,
      "Meetings Conducted": d.meetings,
      "Avg Attendance (%)": Math.round((d.attendanceSum / d.count) * 10) / 10,
    }));
  }, [employees, records]);

  // 3. Month over Month Progression & Forecast
  const timelineData = useMemo(() => {
    const map: Record<string, {
      month: string;
      value: number;
      amount: number;
      meetings: number;
      attendanceSum: number;
      count: number;
    }> = {};

    records.forEach((rec) => {
      const month = rec.month;
      if (!map[month]) {
        map[month] = {
          month,
          value: 0,
          amount: 0,
          meetings: 0,
          attendanceSum: 0,
          count: 0
        };
      }

      map[month].value += rec.deliveredProjectsValue;
      map[month].amount += rec.deliveredProjectsAmount;
      map[month].meetings += rec.conductedMeetings;
      map[month].attendanceSum += rec.attendance;
      map[month].count += 1;
    });

    const baseData = Object.keys(map)
      .sort()
      .map((m) => {
        const d = map[m];
        const [year, monthNum] = m.split("-");
        const formattedMonth = new Date(Number(year), Number(monthNum) - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        return {
          monthCode: m,
          name: formattedMonth,
          "Value ($k)": Math.round(d.value / 1000),
          "Projects Delivered": d.amount,
          "Meetings": d.meetings,
          "Avg Attendance (%)": Math.round((d.attendanceSum / d.count) * 10) / 10,
          Forecast: null as number | null,
          isForecast: false,
        };
      });

    if (baseData.length >= 2) {
      const n = baseData.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      baseData.forEach((d, i) => {
        sumX += i;
        sumY += d["Projects Delivered"];
        sumXY += i * d["Projects Delivered"];
        sumXX += i * i;
      });
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      const nextX = n;
      const forecastedProjects = Math.max(0, Math.round(slope * nextX + intercept));
      
      const lastMonthCode = baseData[n - 1].monthCode;
      const [lastYear, lastMonth] = lastMonthCode.split("-").map(Number);
      let nextYear = lastYear;
      let nextMonth = lastMonth + 1;
      if (nextMonth > 12) {
        nextYear++;
        nextMonth = 1;
      }
      const nextMonthName = new Date(nextYear, nextMonth - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      
      baseData[n - 1].Forecast = baseData[n - 1]["Projects Delivered"];
      
      baseData.push({
        monthCode: `${nextYear}-${nextMonth.toString().padStart(2, '0')}`,
        name: `${nextMonthName} (Est)`,
        "Value ($k)": null as any,
        "Projects Delivered": null as any,
        "Meetings": null as any,
        "Avg Attendance (%)": null as any,
        Forecast: forecastedProjects,
        isForecast: true,
      });
    }

    return baseData;
  }, [records]);

  // 4. Employee Top Performers
  const topPerformers = useMemo(() => {
    const map: Record<string, {
      employeeId: string;
      name: string;
      department: string;
      totalValue: number;
      totalProjects: number;
    }> = {};

    records.forEach((rec) => {
      const emp = employees.find((e) => e.id === rec.employeeId);
      if (!emp) return;

      if (!map[emp.id]) {
        map[emp.id] = {
          employeeId: emp.id,
          name: emp.name,
          department: emp.department,
          totalValue: 0,
          totalProjects: 0,
        };
      }

      map[emp.id].totalValue += rec.deliveredProjectsValue;
      map[emp.id].totalProjects += rec.deliveredProjectsAmount;
    });

    return Object.values(map)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 4);
  }, [employees, records]);

  // Design Colors & Palettes
  const COLORS = {
    blue: "#3b82f6",
    emerald: "#10b981",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    cyan: "#06b6d4",
    slate: "#64748b"
  };

  const barColors = [COLORS.indigo, COLORS.cyan, COLORS.violet, COLORS.blue, COLORS.emerald];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Custom high-fidelity modern tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-slate-800/80 backdrop-blur-md text-white rounded-xl p-3 shadow-xl text-left font-sans">
          <p className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">{label}</p>
          <div className="space-y-1">
            {payload.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 justify-between min-w-[120px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color || item.fill }} />
                  <span className="text-[11px] font-medium text-slate-300">{item.name}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-white">
                  {typeof item.value === 'number' && item.name.includes('Value') ? `$${item.value}k` : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 25 } }
  };

  return (
    <motion.div
      id="dashboard-tab"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Sleek, Minimal Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="relative bg-white/70 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">Team Size</span>
            <span className="p-1.5 bg-slate-50 border border-slate-100/80 text-blue-500 rounded-xl transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="text-xl font-bold font-display text-slate-900 mt-2 tracking-tight">
            {summaryMetrics.totalEmployees}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-medium font-sans">Active profiles in matrix</span>
        </motion.div>

        {/* Metric 2 */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="relative bg-white/70 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">Attendance</span>
            <span className="p-1.5 bg-slate-50 border border-slate-100/80 text-emerald-500 rounded-xl transition-all duration-300 group-hover:bg-emerald-50 group-hover:text-emerald-600">
              <CalendarCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="text-xl font-bold font-display text-slate-900 mt-2 tracking-tight">
            {summaryMetrics.avgAttendance}%
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-medium font-sans">Workplace presence rate</span>
        </motion.div>

        {/* Metric 3 */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="relative bg-white/70 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">Meetings Run</span>
            <span className="p-1.5 bg-slate-50 border border-slate-100/80 text-indigo-500 rounded-xl transition-all duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <Video className="h-4 w-4" />
            </span>
          </div>
          <p className="text-xl font-bold font-display text-slate-900 mt-2 tracking-tight">
            {summaryMetrics.totalMeetings}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-medium font-sans">Syncs & reviews conducted</span>
        </motion.div>

        {/* Metric 4 */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="relative bg-white/70 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">Shipped Items</span>
            <span className="p-1.5 bg-slate-50 border border-slate-100/80 text-violet-500 rounded-xl transition-all duration-300 group-hover:bg-violet-50 group-hover:text-violet-600">
              <Briefcase className="h-4 w-4" />
            </span>
          </div>
          <p className="text-xl font-bold font-display text-slate-900 mt-2 tracking-tight">
            {summaryMetrics.totalProjectsAmount}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-medium font-sans">Standalone accomplishments</span>
        </motion.div>

        {/* Metric 5 */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="relative bg-white/70 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group overflow-hidden col-span-2 lg:col-span-1"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">Pipeline Impact</span>
            <span className="p-1.5 bg-slate-50 border border-slate-100/80 text-emerald-600 rounded-xl transition-all duration-300 group-hover:bg-emerald-50 group-hover:text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold font-display text-emerald-600 mt-2 tracking-tight">
            ${(summaryMetrics.totalProjectsValue / 1000).toFixed(0)}k
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-medium font-sans">Sized portfolio valuation</span>
        </motion.div>
      </motion.div>

      {records.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl p-12 text-center text-slate-500 italic font-medium shadow-xs"
        >
          Please record monthly metrics first to populate the interactive trend grids.
        </motion.div>
      ) : (
        <>
          {/* Charts Row - Completely Redesigned to be Sleek and Non-Cluttered */}
          <div className="grid grid-cols-1 gap-6">
            {/* Chart 1: Project value by Department */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold font-display text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    Department Distribution
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">Project Sizing Volume ($k)</p>
                </div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                  Division View
                </span>
              </div>
              <div className="h-[220px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={9} 
                      stroke="#94a3b8" 
                      tickLine={false} 
                      axisLine={false} 
                      dy={8}
                    />
                    <YAxis 
                      fontSize={9} 
                      stroke="#94a3b8" 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(v) => `$${v}k`} 
                      dx={-4}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
                    <Bar dataKey="Value ($k)" radius={[6, 6, 0, 0]} maxBarSize={28}>
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Chart 2: Project Delivery vs Meetings Over Time */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold font-display text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    Timeline Dynamics
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">Projects Delivered vs Meetings Run</p>
                </div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                  MoM View
                </span>
              </div>
              <div className="h-[220px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={9} 
                      stroke="#94a3b8" 
                      tickLine={false} 
                      axisLine={false} 
                      dy={8}
                    />
                    <YAxis 
                      fontSize={9} 
                      stroke="#94a3b8" 
                      tickLine={false} 
                      axisLine={false} 
                      dx={-4}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Projects Delivered"
                      stroke={COLORS.blue}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                    <Line
                      type="monotone"
                      dataKey="Forecast"
                      stroke={COLORS.emerald}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: COLORS.emerald, stroke: '#fff', strokeWidth: 1.5 }}
                      activeDot={{ r: 5 }}
                      connectNulls={true}
                    />
                    <Area
                      type="monotone"
                      dataKey="Meetings"
                      stroke={COLORS.indigo}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorMeetings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Lower Grid Row: High-Polished Lists & Progress bars */}
          <div className="grid grid-cols-1 gap-6">
            {/* Top Contributors Bento - Minimal, modern ranking structure */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-2xs flex flex-col"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="text-xs font-bold font-display text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500 shrink-0" />
                    Key Team Contributors
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">Cumulative production efficiency leaderboards</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {topPerformers.map((perf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      {/* Futurist Rank badge */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-extrabold text-[11px] border ${
                        index === 0 
                          ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm shadow-amber-500/5' 
                          : index === 1 
                          ? 'bg-slate-50 border-slate-200 text-slate-600' 
                          : 'bg-transparent border-slate-100 text-slate-500'
                      }`}>
                        #{index + 1}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300/40 flex items-center justify-center text-[11px] font-extrabold text-slate-600">
                          {getInitials(perf.name)}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 font-display leading-tight">{perf.name}</h5>
                          <p className="text-[10px] text-slate-500 font-mono font-semibold mt-0.5">{perf.department}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-extrabold block">Shipped</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{perf.totalProjects} items</span>
                      </div>
                      <div className="text-right min-w-[70px]">
                        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-extrabold block">Value Weight</span>
                        <span className="text-xs font-mono font-extrabold text-emerald-600">
                          ${(perf.totalValue / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Attendance Bento Block - Minimal gauge tracks */}
            <motion.div
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-2xs"
            >
              <div className="mb-5">
                <h4 className="text-xs font-bold font-display text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
                  Presence Matrix
                </h4>
                <p className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">Average attendance by division unit</p>
              </div>
              
              <div className="space-y-4">
                {departmentData.map((d, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold font-display text-slate-800 text-[11px]">{d.name}</span>
                      <span className="font-mono text-[11px] font-extrabold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                        {d["Avg Attendance (%)"]}%
                      </span>
                    </div>
                    {/* Futuristic progress indicator bar */}
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-200/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                        style={{ width: `${d["Avg Attendance (%)"]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
