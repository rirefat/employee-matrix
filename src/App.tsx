import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  TrendingUp,
  FileText,
  Plus,
  Sparkles,
  Search,
  Calendar,
  Layers,
  UserPlus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  X,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Video,
  Award,
  DollarSign,
  Briefcase,
  UserCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { Employee, PerformanceRecord, MonthlyReport } from "./types";
import { DBStatusBanner } from "./components/DBStatusBanner";
import { ReportViewer } from "./components/ReportViewer";
import { DashboardTab } from "./components/DashboardTab";

const DEPARTMENTS = ["Engineering", "Sales", "Customer Success", "Product", "Operations"];

export default function App() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster">("profile");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06");
  const [searchQuery, setSearchQuery] = useState<string>(" "); // Space triggers full list but keeps standard structure

  // App Alerts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    role: "",
    department: DEPARTMENTS[0],
    email: ""
  });

  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedPerfEmployee, setSelectedPerfEmployee] = useState<Employee | null>(null);
  const [perfFormData, setPerfFormData] = useState({
    attendance: 100,
    conductedMeetings: 10,
    deliveredProjectsAmount: 1,
    deliveredProjectsValue: 10000,
    totalWorkingDays: 22,
    presentDays: 22,
    absentDays: 0,
    leaveDays: 0
  });

  // Report specific selection
  const [reportEmployeeId, setReportEmployeeId] = useState<string>("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, perfRes, repRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/performance"),
        fetch("/api/reports")
      ]);

      const emps = await empRes.json();
      const perfs = await perfRes.json();
      const reps = await repRes.json();

      setEmployees(emps);
      setPerformance(perfs);
      setReports(reps);

      if (emps.length > 0) {
        setReportEmployeeId(emps[0].id);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("Could not load backend data. Refresh page to try again.", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- EMPLOYEE LOGIC ---
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeFormData({ name: "", role: "", department: DEPARTMENTS[0], email: "" });
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmployeeFormData({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      email: emp.email
    });
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormData.name || !employeeFormData.role || !employeeFormData.email) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      if (editingEmployee) {
        // Update
        const res = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeFormData)
        });
        if (res.ok) {
          showToast("Employee profile updated successfully.", "success");
          fetchData();
          setIsEmployeeModalOpen(false);
        } else {
          showToast("Failed to update employee.", "error");
        }
      } else {
        // Create
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeFormData)
        });
        if (res.ok) {
          const newEmp = await res.json();
          showToast(`Successfully created performance card for ${newEmp.name}!`, "success");
          fetchData();
          setIsEmployeeModalOpen(false);
        } else {
          showToast("Failed to add employee profile.", "error");
        }
      }
    } catch (err) {
      console.error("Error saving employee:", err);
      showToast("Error communicating with the server.", "error");
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate ${name}'s performance profile? Historical data will be preserved, but they will not appear in current metrics.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Employee profile deactivated.", "success");
        fetchData();
      } else {
        showToast("Failed to delete employee profile.", "error");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      showToast("Error deleting employee.", "error");
    }
  };

  // --- PERFORMANCE ENTRY LOGIC ---
  const handleOpenPerformanceLog = (emp: Employee) => {
    setSelectedPerfEmployee(emp);
    
    // Check if performance metrics already exist for selected month
    const existing = performance.find(p => p.employeeId === emp.id && p.month === selectedMonth);
    if (existing) {
      const working = existing.totalWorkingDays || 22;
      const present = existing.presentDays !== undefined ? existing.presentDays : Math.round(working * (existing.attendance / 100));
      const absent = existing.absentDays !== undefined ? existing.absentDays : (working - present);
      const leave = existing.leaveDays || 0;

      setPerfFormData({
        attendance: existing.attendance,
        conductedMeetings: existing.conductedMeetings,
        deliveredProjectsAmount: existing.deliveredProjectsAmount,
        deliveredProjectsValue: existing.deliveredProjectsValue,
        totalWorkingDays: working,
        presentDays: present,
        absentDays: absent,
        leaveDays: leave
      });
    } else {
      setPerfFormData({
        attendance: 95,
        conductedMeetings: 12,
        deliveredProjectsAmount: 2,
        deliveredProjectsValue: 15000,
        totalWorkingDays: 22,
        presentDays: 21,
        absentDays: 1,
        leaveDays: 0
      });
    }
    setIsPerformanceModalOpen(true);
  };

  const handleSavePerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerfEmployee) return;

    try {
      const payload = {
        employeeId: selectedPerfEmployee.id,
        month: selectedMonth,
        ...perfFormData
      };

      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Performance card logged for ${selectedPerfEmployee.name} for ${selectedMonth}`, "success");
        fetchData();
        setIsPerformanceModalOpen(false);
      } else {
        showToast("Failed to save performance metrics.", "error");
      }
    } catch (err) {
      console.error("Error saving performance:", err);
      showToast("Error logging metrics.", "error");
    }
  };

  // --- REPORT GENERATION ---
  const handleGenerateReport = async () => {
    if (!reportEmployeeId) return;
    setIsGeneratingReport(true);

    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: reportEmployeeId, month: selectedMonth })
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Monthly progress and talent development roadmap generated!", "success");
        fetchData(); // Reload reports list
      } else {
        showToast(data.error || "Failed to generate report.", "error");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      showToast("Connection issue. Could not reach AI service.", "error");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  });

  // Selected report for the active reporter
  const activeReport = reports.find(
    r => r.employeeId === reportEmployeeId && r.month === selectedMonth
  ) || null;

  const activeRecord = performance.find(
    p => p.employeeId === reportEmployeeId && p.month === selectedMonth
  );

  const selectedReportEmployeeObj = employees.find(e => e.id === reportEmployeeId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const employeeHistoryData = useMemo(() => {
    if (!reportEmployeeId) return [];
    return performance
      .filter((p) => p.employeeId === reportEmployeeId)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((rec) => {
        const [year, monthNum] = rec.month.split("-");
        const shortMonth = new Date(Number(year), Number(monthNum) - 1, 1)
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase();
        return {
          month: shortMonth,
          "Attendance (%)": rec.attendance,
          "Meetings": rec.conductedMeetings,
          "Projects": rec.deliveredProjectsAmount,
          "Value ($k)": Math.round(rec.deliveredProjectsValue / 1000),
        };
      });
  }, [performance, reportEmployeeId]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div id="toast-notif" className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border transition-all animate-bounce ${
          toast.type === "success" ? "bg-emerald-600 text-white border-emerald-500" : "bg-rose-600 text-white border-rose-500"
        }`}>
          {toast.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Top Header Navigation matching Mockup precisely */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            Employee Matrix <span className="font-normal text-slate-400 text-xs sm:text-sm">Manager Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Month selector directly in header */}
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 transition-colors">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-800 font-mono text-xs font-bold focus:outline-none cursor-pointer"
            />
          </div>

          <div className="hidden md:flex items-center gap-3 text-right">
            <div>
              <div className="text-xs font-semibold text-slate-700">Rafiul Refat</div>
              <div className="text-[10px] text-slate-400">Engineering Lead</div>
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
              RR
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 items-start">
        {/* DB Status Banner (spanning full width) */}
        <div className="col-span-12">
          <DBStatusBanner />
        </div>

        {/* LEFT COLUMN: Direct Reports Sidebar */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Direct Reports
            </h2>
            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-semibold text-slate-600">
              {employees.length} Total
            </span>
          </div>

          {/* Search bar matching mockup precisely */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search employees by name or role..."
              value={searchQuery === " " ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Direct Reports List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredEmployees.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs italic">
                No matching team members found.
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isSelected = emp.id === reportEmployeeId;
                const rec = performance.find(p => p.employeeId === emp.id && p.month === selectedMonth);
                const hasReport = reports.some(r => r.employeeId === emp.id && r.month === selectedMonth);

                return (
                  <div
                    key={emp.id}
                    onClick={() => setReportEmployeeId(emp.id)}
                    className={`p-3.5 flex items-center gap-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-slate-100 hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Initials block exactly like Mockup */}
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? "bg-blue-200 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {getInitials(emp.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{emp.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{emp.role}</div>
                    </div>

                    {/* Right attendance indicator */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-700">
                        {rec ? `${rec.attendance}%` : "—"}
                      </div>
                      <div className="mt-1 flex justify-end">
                        {hasReport ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-bold">
                            AI Report
                          </span>
                        ) : rec ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-medium">
                            Logged
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[8px] font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick interactive sidebar footer */}
          <button
            onClick={handleOpenAddEmployee}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Team Profile
          </button>
        </aside>

        {/* RIGHT COLUMN: Interactive Tabs & Detail View */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Content tabs selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-fit border border-slate-200/50">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Employee Profile & AI Roadmap
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "team" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Team Trend Dashboard
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "roster" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Database Records
            </button>
          </div>

          {/* TAB CONTENT: PROFILE (Individual analytics + AI Report) */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {selectedReportEmployeeObj ? (
                <>
                  {/* Selected employee info card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl shadow-xs">
                          {getInitials(selectedReportEmployeeObj.name)}
                        </div>
                        <div>
                          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{selectedReportEmployeeObj.name}</h1>
                          <p className="text-xs text-slate-500 mt-1">
                            Performance Tier:{" "}
                            {activeRecord ? (
                              activeRecord.attendance >= 95 && activeRecord.deliveredProjectsAmount >= 2 ? (
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Exceeds Expectations</span>
                              ) : activeRecord.attendance >= 90 ? (
                                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">Meets Expectations</span>
                              ) : (
                                <span className="text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Development Required</span>
                              )
                            ) : (
                              <span className="text-slate-400 italic font-medium">No metrics registered yet</span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              Q3 Focus: {selectedReportEmployeeObj.department}
                            </span>
                            <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              Remote-First
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons inside Profile Card */}
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleOpenPerformanceLog(selectedReportEmployeeObj)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all shadow-xs"
                        >
                          <Plus className="h-3.5 w-3.5 text-blue-500" />
                          Log Metrics
                        </button>

                        <button
                          onClick={handleGenerateReport}
                          disabled={isGeneratingReport || !activeRecord}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate Report
                        </button>
                      </div>
                    </div>

                    {/* Four metrics boxes matching mockup precisely */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Box 1: Attendance */}
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col justify-between min-h-[96px]">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? `${activeRecord.attendance}%` : "—"}
                          </div>
                          {activeRecord && (
                            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] font-semibold text-slate-500 font-mono">
                              <span className="text-emerald-600 bg-emerald-50 px-1 rounded">Pres: {activeRecord.presentDays !== undefined ? activeRecord.presentDays : Math.round((activeRecord.totalWorkingDays || 22) * (activeRecord.attendance / 100))}d</span>
                              <span className="text-rose-600 bg-rose-50 px-1 rounded">Abs: {activeRecord.absentDays !== undefined ? activeRecord.absentDays : ((activeRecord.totalWorkingDays || 22) - (activeRecord.presentDays !== undefined ? activeRecord.presentDays : Math.round((activeRecord.totalWorkingDays || 22) * (activeRecord.attendance / 100))))}d</span>
                              {activeRecord.leaveDays !== undefined && activeRecord.leaveDays > 0 && (
                                <span className="text-amber-600 bg-amber-50 px-1 rounded">Lv: {activeRecord.leaveDays}d</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${activeRecord ? activeRecord.attendance : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Box 2: Meetings */}
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Meetings</div>
                        <div className="text-xl font-bold font-mono text-slate-800">
                          {activeRecord ? activeRecord.conductedMeetings : "—"}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-2 truncate">Conducted this month</div>
                      </div>

                      {/* Box 3: Proj Count */}
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proj Count</div>
                        <div className="text-xl font-bold font-mono text-slate-800">
                          {activeRecord ? activeRecord.deliveredProjectsAmount : "—"}
                        </div>
                        <div className="text-[9px] text-emerald-600 font-bold mt-2 truncate">
                          {activeRecord ? `+${activeRecord.deliveredProjectsAmount} Shipped` : "No deliverables"}
                        </div>
                      </div>

                      {/* Box 4: Proj Value */}
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proj Value</div>
                        <div className="text-xl font-bold font-mono text-slate-800">
                          {activeRecord ? `$${(activeRecord.deliveredProjectsValue / 1000).toFixed(0)}k` : "—"}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-2 truncate">High impact delivery</div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Monthly Progress Trend Chart */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Monthly Progress Trends
                      </h3>
                      <span className="text-[10px] text-slate-400">Month-over-month performance overview</span>
                    </div>

                    {employeeHistoryData.length === 0 ? (
                      <div className="h-44 flex items-center justify-center text-xs text-slate-400 italic">
                        Not enough historical data points to generate progress graphs. Record metrics for multiple months.
                      </div>
                    ) : (
                      <div className="h-48 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={employeeHistoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey="month"
                              stroke="#94a3b8"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#94a3b8"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              domain={[0, 'auto']}
                            />
                            <Tooltip
                              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Attendance (%)"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Value ($k)"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Report viewer inside Profile */}
                  <ReportViewer
                    employee={selectedReportEmployeeObj}
                    record={activeRecord}
                    report={activeReport}
                    month={selectedMonth}
                    onGenerate={handleGenerateReport}
                    isGenerating={isGeneratingReport}
                  />

                  {/* Development Recommendation Banner matching Mockup precisely */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                      </span>
                      <span className="text-xs font-medium text-slate-600 text-center sm:text-left">
                        Development Recommendation:{" "}
                        <span className="text-slate-800 font-bold uppercase text-[10px] tracking-wider ml-1 bg-slate-100 px-2 py-0.5 rounded">
                          {activeRecord && activeRecord.deliveredProjectsAmount >= 2
                            ? `Promotion track for Senior / Lead ${selectedReportEmployeeObj.role}`
                            : `Skill development and technical enrichment`}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline animate-pulse"
                    >
                      Export PDF / Save →
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                  <p>Please select an employee from the Direct Reports roster to view their profile.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: TEAM TRENDS */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Team-Wide Trends & Aggregate Metrics</h3>
                <p className="text-xs text-slate-500">A comprehensive analytics view of corporate sync count, attendance rates, and team deliverables.</p>
              </div>
              <DashboardTab employees={employees} records={performance} />
            </div>
          )}

          {/* TAB CONTENT: ROSTER DATABASE */}
          {activeTab === "roster" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Corporate Employee Records</h3>
                  <p className="text-xs text-slate-500">Review, modify, or delete profiles from the secure MongoDB store.</p>
                </div>

                <button
                  onClick={handleOpenAddEmployee}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Profile
                </button>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="bg-slate-50 uppercase text-slate-400 font-mono text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Corporate Email</th>
                        <th className="px-6 py-4">Security ID</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-800">{emp.name}</td>
                          <td className="px-6 py-4">{emp.role}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                              {emp.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px]">{emp.email}</td>
                          <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{emp.id}</td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditEmployee(emp)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all inline-block"
                              title="Edit Profile"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all inline-block"
                              title="Deactivate Profile"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-6 text-xs font-mono text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; 2026 Employee Performance Cards. Built for Managers.</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Secure MongoDB Client
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
              Gemini 3.5 Flash Active
            </span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: ADD / EDIT EMPLOYEE */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-md font-bold text-slate-800">
                {editingEmployee ? "Edit Performance Profile" : "Create Team Profile"}
              </h3>
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={employeeFormData.name}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Professional Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Architect"
                  value={employeeFormData.role}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Department *</label>
                <select
                  value={employeeFormData.department}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@company.com"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG PERFORMANCE METRICS */}
      {isPerformanceModalOpen && selectedPerfEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-md font-bold text-slate-800">Record Performance Card</h3>
                <p className="text-xs text-slate-500 mt-1">
                  For {selectedPerfEmployee.name} &bull; {selectedMonth}
                </p>
              </div>
              <button
                onClick={() => setIsPerformanceModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePerformance} className="space-y-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">Month Code:</span>
                <span className="text-xs font-mono font-bold text-blue-600">{selectedMonth}</span>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase">Workplace Attendance Tracker</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    Avg: {perfFormData.attendance}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Working Days</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={perfFormData.totalWorkingDays}
                      onChange={(e) => {
                        const working = Number(e.target.value);
                        const present = Math.min(working, perfFormData.presentDays);
                        const rate = working > 0 ? Math.round((present / working) * 100) : 100;
                        setPerfFormData({
                          ...perfFormData,
                          totalWorkingDays: working,
                          presentDays: present,
                          attendance: rate
                        });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Days Present</label>
                    <input
                      type="number"
                      min="0"
                      max={perfFormData.totalWorkingDays}
                      required
                      value={perfFormData.presentDays}
                      onChange={(e) => {
                        const present = Number(e.target.value);
                        const working = perfFormData.totalWorkingDays;
                        const rate = working > 0 ? Math.round((present / working) * 100) : 100;
                        setPerfFormData({
                          ...perfFormData,
                          presentDays: present,
                          attendance: rate
                        });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Days Absent</label>
                    <input
                      type="number"
                      min="0"
                      max={perfFormData.totalWorkingDays}
                      required
                      value={perfFormData.absentDays}
                      onChange={(e) => {
                        setPerfFormData({
                          ...perfFormData,
                          absentDays: Number(e.target.value)
                        });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Leaves / Other</label>
                    <input
                      type="number"
                      min="0"
                      max={perfFormData.totalWorkingDays}
                      required
                      value={perfFormData.leaveDays}
                      onChange={(e) => {
                        setPerfFormData({
                          ...perfFormData,
                          leaveDays: Number(e.target.value)
                        });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Balance validation alert */}
                {perfFormData.presentDays + perfFormData.absentDays + perfFormData.leaveDays !== perfFormData.totalWorkingDays && (
                  <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 p-2 rounded-lg">
                    <span>Note: Present + Absent + Leaves ({perfFormData.presentDays + perfFormData.absentDays + perfFormData.leaveDays} days) doesn't match Total Working Days ({perfFormData.totalWorkingDays} days).</span>
                  </div>
                )}
                {perfFormData.presentDays + perfFormData.absentDays + perfFormData.leaveDays === perfFormData.totalWorkingDays && (
                  <div className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                    <span>✓ Day counts sum up correctly to {perfFormData.totalWorkingDays} working days.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Conducted Meetings Count</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={perfFormData.conductedMeetings}
                  onChange={(e) => setPerfFormData({ ...perfFormData, conductedMeetings: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400">Total operational syncs or stakeholder calls.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Delivered Projects Count</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={perfFormData.deliveredProjectsAmount}
                  onChange={(e) => setPerfFormData({ ...perfFormData, deliveredProjectsAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400">Number of discrete projects or major features shipped.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Delivered Projects Financial Value ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={perfFormData.deliveredProjectsValue}
                    onChange={(e) => setPerfFormData({ ...perfFormData, deliveredProjectsValue: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Estimated value impact of deliverables (in USD).</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPerformanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Record Card Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
