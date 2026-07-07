import React, { useMemo } from "react";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  Video,
  Award,
  DollarSign,
  Briefcase
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
  PieChart,
  Pie
} from "recharts";
import { Employee, PerformanceRecord } from "../types";

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
          "Total Value ($)": d.value,
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

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#3b82f6", "#06b6d4"];

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Team Size</span>
            <span className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-800 mt-2">
            {summaryMetrics.totalEmployees}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Active team profiles</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Attendance</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CalendarCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-800 mt-2">
            {summaryMetrics.avgAttendance}%
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Workplace presence avg</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Meetings</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Video className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-800 mt-2">
            {summaryMetrics.totalMeetings}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Conducted collaboration sessions</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Projects Shipped</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-800 mt-2">
            {summaryMetrics.totalProjectsAmount}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Total standalone deliverables</span>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl col-span-2 lg:col-span-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Delivered Value</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-emerald-600 mt-2">
            ${summaryMetrics.totalProjectsValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Financial project sizing value</span>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <p>Please record monthly metrics first to view interactive dashboard trend charts.</p>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chart 1: Project value by Department */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Delivered Project Value by Department
              </h4>
              <p className="text-xs text-slate-400 mb-4">Financial volume distribution of closed deliverables</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" tickFormatter={(v) => `$${v >= 1000 ? v / 1000 + "k" : v}`} />
                    <Tooltip
                      formatter={(value: any) => [`$${value.toLocaleString()}`, "Total Value"]}
                      contentStyle={{ background: "#0f172a", borderRadius: "10px", color: "#fff", border: "none" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Total Value ($)" radius={[6, 6, 0, 0]}>
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Project Delivery vs Meetings Over Time */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Team Delivery Progression Timeline
              </h4>
              <p className="text-xs text-slate-400 mb-4">Tracking shipped deliverables alongside team meetings</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", borderRadius: "10px", color: "#fff", border: "none" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="Projects Delivered"
                      stroke="#2563eb"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="Meetings" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Breakdown Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Top Performers List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs md:col-span-2">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                Key Team Contributors (Historical Cumulative)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500">
                  <thead className="bg-slate-50 uppercase text-slate-400 font-mono text-[10px]">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Employee</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3 text-right">Projects Delivered</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">Project Value Sizing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topPerformers.map((perf, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-800">{perf.name}</td>
                        <td className="px-4 py-3">{perf.department}</td>
                        <td className="px-4 py-3 text-right font-mono">{perf.totalProjects}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                          ${perf.totalValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance & Engagement Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-blue-500" />
                Workplace Attendance Avg
              </h4>
              <p className="text-xs text-slate-400 mb-4">Average attendance breakdown by department</p>
              <div className="space-y-4 mt-2">
                {departmentData.map((d, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{d.name}</span>
                      <span className="font-mono">{d["Avg Attendance (%)"]}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${d["Avg Attendance (%)"]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
