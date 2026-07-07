import React, { useMemo } from "react";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  Video,
  Award,
  DollarSign,
  Briefcase,
  Sparkles
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
  LineChart,
  Line,
  Cell,
  AreaChart,
  Area
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

  // 3. Month over Month Progression
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

    return Object.keys(map)
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
        };
      });
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

  // Design Colors
  const COLORS = {
    blue: "#3b82f6",
    emerald: "#10b981",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    cyan: "#06b6d4"
  };

  const barColors = [COLORS.blue, COLORS.indigo, COLORS.cyan, COLORS.violet, COLORS.emerald];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Stagger Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  return (
    <motion.div
      id="dashboard-tab"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Sleek Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/80 rounded-r" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Size</span>
            <span className="p-1.5 bg-blue-50 text-blue-500 rounded-xl transition-transform group-hover:scale-105 duration-300">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-slate-800 mt-2 tracking-tight">
            {summaryMetrics.totalEmployees}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">Active personnel profiles</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/80 rounded-r" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Attendance</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-500 rounded-xl transition-transform group-hover:scale-105 duration-300">
              <CalendarCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-slate-800 mt-2 tracking-tight">
            {summaryMetrics.avgAttendance}%
          </p>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">Workplace presence rate</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/80 rounded-r" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meetings Run</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-500 rounded-xl transition-transform group-hover:scale-105 duration-300">
              <Video className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-slate-800 mt-2 tracking-tight">
            {summaryMetrics.totalMeetings}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">Syncs & reviews conducted</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500/80 rounded-r" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projects Shipped</span>
            <span className="p-1.5 bg-violet-50 text-violet-500 rounded-xl transition-transform group-hover:scale-105 duration-300">
              <Briefcase className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-slate-800 mt-2 tracking-tight">
            {summaryMetrics.totalProjectsAmount}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">Standalone accomplishments</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300 relative overflow-hidden group col-span-2 lg:col-span-1">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600 rounded-r" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivered Value</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-xl transition-transform group-hover:scale-105 duration-300">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-2 tracking-tight">
            ${(summaryMetrics.totalProjectsValue / 1000).toFixed(0)}k
          </p>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">Sized portfolio financial weight</span>
        </div>
      </motion.div>

      {records.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 italic shadow-xs"
        >
          Please record monthly metrics first to view interactive dashboard trend charts.
        </motion.div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chart 1: Project value by Department */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Project Sizing by Department
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Value distribution ($k) per division</p>
                </div>
              </div>
              <div className="h-[240px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} barGap={0} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}k`} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc', opacity: 0.6 }}
                      formatter={(value: any) => [`$${value}k`, "Total Value"]}
                      contentStyle={{ background: "#0f172a", borderRadius: "12px", color: "#fff", border: "none", fontSize: "11px" }}
                    />
                    <Bar dataKey="Value ($k)" radius={[6, 6, 0, 0]} maxBarSize={32}>
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
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Engagement & Delivery Timeline
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Comparing shipped items and run meetings over months</p>
                </div>
              </div>
              <div className="h-[240px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", borderRadius: "12px", color: "#fff", border: "none", fontSize: "11px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Projects Delivered"
                      stroke={COLORS.blue}
                      strokeWidth={2.5}
                      dot={{ r: 3, strokeWidth: 1.5, fill: "#fff" }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Meetings"
                      stroke={COLORS.indigo}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Lower Grid Row */}
          <div className="grid md:grid-cols-12 gap-6">
            {/* Sleek Contributors Bento */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs md:col-span-7 lg:col-span-8 flex flex-col"
            >
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Award className="h-4 w-4 text-amber-500 animate-pulse" />
                Key Team Contributors
              </h4>
              <p className="text-[10px] text-slate-400 mb-4">Historical cumulative productivity ranking</p>
              
              <div className="flex-1 space-y-2.5">
                {topPerformers.map((perf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 hover:border-slate-100 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      {/* Initials profile bubble */}
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/40 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {getInitials(perf.name)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{perf.name}</h5>
                        <p className="text-[9px] text-slate-400 mt-0.5">{perf.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Shipped</span>
                        <span className="text-xs font-mono font-bold text-slate-700">{perf.totalProjects} items</span>
                      </div>
                      <div className="text-right min-w-[70px]">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Weight</span>
                        <span className="text-xs font-mono font-extrabold text-emerald-600">
                          ${(perf.totalValue / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Attendance Bento Block */}
            <motion.div
              variants={itemVariants}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs md:col-span-5 lg:col-span-4"
            >
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <CalendarCheck className="h-4 w-4 text-emerald-500" />
                Attendance Breakdown
              </h4>
              <p className="text-[10px] text-slate-400 mb-5">Average attendance rate by organizational unit</p>
              
              <div className="space-y-4">
                {departmentData.map((d, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 text-[11px]">{d.name}</span>
                      <span className="font-mono text-[10px] font-bold text-slate-500">{d["Avg Attendance (%)"]}%</span>
                    </div>
                    {/* Sleek track and progress line */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/20">
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
