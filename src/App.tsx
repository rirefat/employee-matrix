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
  UserCheck,
  Cpu,
  Compass,
  Copy,
  Check,
  Server,
  Key,
  SlidersHorizontal,
  Mail,
  Building
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
import { Employee, PerformanceRecord, MonthlyReport, MonthlyTarget } from "./types";
import { DBStatusBanner } from "./components/DBStatusBanner";
import { ReportViewer } from "./components/ReportViewer";
import { DashboardTab } from "./components/DashboardTab";
import { EmployeeCard } from "./components/EmployeeCard";
import { MonthPicker } from "./components/MonthPicker";
import { motion, AnimatePresence } from "motion/react";

const DEPARTMENTS = ["Engineering", "Sales", "Customer Success", "Product", "Operations"];

export default function App() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster">("profile");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06");
  const [rosterSearchQuery, setRosterSearchQuery] = useState<string>("");
  const [rosterDeptFilter, setRosterDeptFilter] = useState<string>("All");

  const currentTarget = useMemo(() => {
    return targets.find((t) => t.month === selectedMonth);
  }, [targets, selectedMonth]);

  const [searchQuery, setSearchQuery] = useState<string>(" "); // Space triggers full list but keeps standard structure

  // App Alerts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState(false);
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
    leaveDays: 0,
    managerRemarks: ""
  });

  // Report specific selection
  const [reportEmployeeId, setReportEmployeeId] = useState<string>("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [targetFormData, setTargetFormData] = useState({
    attendanceMin: 95,
    projectValueMin: 25000,
  });

  useEffect(() => {
    if (isTargetsModalOpen) {
      if (currentTarget) {
        setTargetFormData({
          attendanceMin: currentTarget.attendanceMin,
          projectValueMin: currentTarget.projectValueMin,
        });
      } else {
        setTargetFormData({
          attendanceMin: 95,
          projectValueMin: 25000,
        });
      }
    }
  }, [isTargetsModalOpen, currentTarget]);

  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          ...targetFormData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save targets");
      }

      const savedTarget = await response.json();
      
      setTargets((prev) => {
        const idx = prev.findIndex((t) => t.month === selectedMonth);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = savedTarget;
          return next;
        }
        return [...prev, savedTarget];
      });

      showToast(`Performance targets for ${selectedMonth} have been successfully set!`, "success");
      setIsTargetsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to save monthly targets", "error");
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEmployeeModalOpen(false);
        setIsPerformanceModalOpen(false);
        setIsTargetsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, perfRes, repRes, targetsRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/performance"),
        fetch("/api/reports"),
        fetch("/api/targets")
      ]);

      const emps = await empRes.json();
      const perfs = await perfRes.json();
      const reps = await repRes.json();
      const targs = await targetsRes.json();

      setEmployees(emps);
      setPerformance(perfs);
      setReports(reps);
      setTargets(targs);

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
        leaveDays: leave,
        managerRemarks: existing.managerRemarks || ""
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
        leaveDays: 0,
        managerRemarks: ""
      });
    }
    setIsPerformanceModalOpen(true);
  };

  const handleMonthChangeInPerfLog = (newMonth: string) => {
    setSelectedMonth(newMonth);
    if (!selectedPerfEmployee) return;

    const existing = performance.find(p => p.employeeId === selectedPerfEmployee.id && p.month === newMonth);
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
        leaveDays: leave,
        managerRemarks: existing.managerRemarks || ""
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
        leaveDays: 0,
        managerRemarks: ""
      });
    }
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

  // Filter roster database
  const rosterFilteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const q = rosterSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q);

      const matchesDept = rosterDeptFilter === "All" || emp.department === rosterDeptFilter;

      return matchesSearch && matchesDept;
    });
  }, [employees, rosterSearchQuery, rosterDeptFilter]);

  // Selected report for the active reporter
  const activeReport = reports.find(
    r => r.employeeId === reportEmployeeId && r.month === selectedMonth
  ) || null;

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

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

      {/* Top Futuristic Header Navigation - Glassmorphic, Modern, Minimal */}
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        {/* Glow-bar Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-90" />
        
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated Geometric Emblem */}
            <motion.div 
              className="relative w-9 h-9 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              {/* Pulsing Outer Aura */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-[6px] animate-pulse" />
              
              {/* Rotating Tech Ring */}
              <motion.div 
                className="absolute inset-0 border-2 border-dashed border-blue-500/40 rounded-xl"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              />
              
              {/* Core Symbol */}
              <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
                <Cpu className="h-3.5 w-3.5 animate-pulse" />
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
              <span className="text-lg font-bold font-display text-slate-950 tracking-tight leading-none">
                Employee Matrix
              </span>
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-block h-3 w-[1px] bg-slate-300" />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono tracking-widest font-extrabold uppercase bg-indigo-50 border border-indigo-100/60 text-indigo-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Manager Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Month selector directly in header */}
            <MonthPicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              align="right"
            />

            {/* Set Monthly Targets Button */}
            <motion.button
              onClick={() => setIsTargetsModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-50/90 hover:bg-indigo-100/90 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200 text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Set Targets</span>
              <span className="sm:hidden">Targets</span>
            </motion.button>

            {/* Profile area */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-slate-800 font-display">Rafiul Refat</span>
                <span className="text-[10px] text-slate-400 font-mono font-medium">Lead / System Node</span>
              </div>
              <motion.div 
                className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8.5 h-8.5 bg-slate-100 rounded-full flex items-center justify-center font-extrabold text-xs text-blue-600 border border-white">
                  RR
                </div>
                {/* Active Indicator Pulse */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Direct Reports Sidebar */}
        <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-20 z-30 flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
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
          <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar p-2 -m-2">
            {filteredEmployees.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs italic">
                No matching team members found.
              </div>
            ) : (
              filteredEmployees.map((emp, index) => {
                const isSelected = emp.id === reportEmployeeId;
                const rec = performance.find(p => p.employeeId === emp.id && p.month === selectedMonth);
                const hasReport = reports.some(r => r.employeeId === emp.id && r.month === selectedMonth);

                return (
                  <EmployeeCard
                    key={emp.id}
                    index={index}
                    employee={emp}
                    isActive={isSelected}
                    performanceRecord={rec}
                    hasReport={hasReport}
                    target={currentTarget}
                    onClick={() => setReportEmployeeId(emp.id)}
                  />
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
                  {/* Glassmorphic Selected employee info card with ambient blur backdrops */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/40 shadow-xl p-6 bg-white/60 backdrop-blur-md">
                    {/* Atmospheric color nodes under glass to enhance depth */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div className="flex gap-4">
                        {/* Avatar block with active state glowing borders */}
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md border border-white/20">
                          {getInitials(selectedReportEmployeeObj.name)}
                        </div>
                        <div>
                          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">{selectedReportEmployeeObj.name}</h1>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                            <span className="font-medium">Matrix Tier:</span>
                            {activeRecord ? (
                              activeRecord.attendance >= 95 && activeRecord.deliveredProjectsAmount >= 2 ? (
                                <span className="text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px]">Exceeds Expectations</span>
                              ) : activeRecord.attendance >= 90 ? (
                                <span className="text-blue-700 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px]">Meets Expectations</span>
                              ) : (
                                <span className="text-amber-600 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px]">Development Required</span>
                              )
                            ) : (
                              <span className="text-slate-400 italic font-medium">No metrics registered yet</span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2.5 py-0.5 bg-white/60 border border-white/50 backdrop-blur-xs rounded-md text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              Q3 Focus: {selectedReportEmployeeObj.department}
                            </span>
                            <span className="px-2.5 py-0.5 bg-white/60 border border-white/50 backdrop-blur-xs rounded-md text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              Remote-First
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons inside Profile Card */}
                      <div className="flex gap-2 w-full md:w-auto relative z-20">
                        <button
                          onClick={() => handleOpenPerformanceLog(selectedReportEmployeeObj)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white/60 border border-white/50 text-slate-700 hover:bg-white/80 rounded-xl text-xs font-semibold transition-all shadow-xs backdrop-blur-xs"
                        >
                          <Plus className="h-3.5 w-3.5 text-blue-500" />
                          Log Metrics
                        </button>

                        <button
                          onClick={handleGenerateReport}
                          disabled={isGeneratingReport || !activeRecord}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white rounded-xl text-xs font-bold transition-all shadow-md border border-white/10"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate Report
                        </button>
                      </div>
                    </div>

                    {/* Four metrics boxes redesigned as frosted glass panels with dynamic gauge style */}
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Box 1: Attendance */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[105px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance Rate</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? `${activeRecord.attendance}%` : "—"}
                          </div>
                          {activeRecord && (
                            <div className="mt-1 flex flex-wrap gap-x-1.5 gap-y-0.5 text-[8px] font-semibold text-slate-500 font-mono">
                              <span className="text-emerald-700 bg-emerald-500/10 px-1 rounded">Pres: {activeRecord.presentDays !== undefined ? activeRecord.presentDays : Math.round((activeRecord.totalWorkingDays || 22) * (activeRecord.attendance / 100))}d</span>
                              <span className="text-rose-700 bg-rose-500/10 px-1 rounded">Abs: {activeRecord.absentDays !== undefined ? activeRecord.absentDays : ((activeRecord.totalWorkingDays || 22) - (activeRecord.presentDays !== undefined ? activeRecord.presentDays : Math.round((activeRecord.totalWorkingDays || 22) * (activeRecord.attendance / 100))))}d</span>
                              {activeRecord.leaveDays !== undefined && activeRecord.leaveDays > 0 && (
                                <span className="text-amber-700 bg-amber-500/10 px-1 rounded">Lv: {activeRecord.leaveDays}d</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="h-1.5 w-full bg-slate-200/50 rounded-full mt-2 overflow-hidden border border-white/20">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 rounded-full"
                            style={{ width: `${activeRecord ? activeRecord.attendance : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Box 2: Meetings */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[105px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Meetings Conducted</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? activeRecord.conductedMeetings : "—"}
                          </div>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-2 truncate font-medium">
                          {activeRecord ? `Target: 10 (${activeRecord.conductedMeetings >= 10 ? 'Exceeded' : 'Under'})` : "No activity"}
                        </div>
                      </div>

                      {/* Box 3: Project Count */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[105px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Projects Shipped</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? activeRecord.deliveredProjectsAmount : "—"}
                          </div>
                        </div>
                        <div className="text-[9px] text-emerald-700 font-bold mt-2 truncate bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md inline-block w-max">
                          {activeRecord ? `+${activeRecord.deliveredProjectsAmount} Delivered` : "No deliverables"}
                        </div>
                      </div>

                      {/* Box 4: Project Value */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[105px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pipeline Impact</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? `$${(activeRecord.deliveredProjectsValue / 1000).toFixed(0)}k` : "—"}
                          </div>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-2 truncate font-medium">
                          {activeRecord ? "Strategic execution value" : "Pending evaluations"}
                        </div>
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

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedReportEmployeeObj?.id}
                        initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full"
                      >
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
                      </motion.div>
                    </AnimatePresence>
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
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Corporate Employee Records
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Review, filter, copy, and modify profiles registered inside the secure database registry.</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenAddEmployee}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Profile
                </motion.button>
              </div>

              {/* Database Registry Status Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3.5">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registry Engine</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      Active Cluster
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roster Size</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{employees.length} Active Profiles</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3.5">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Query Matches</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                      {rosterFilteredEmployees.length} profiles listed
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Search & Filter Controls */}
              <div className="bg-slate-50/50 p-4 border border-slate-200/60 rounded-2xl space-y-3.5">
                {/* Search input with inner styling */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={rosterSearchQuery}
                    onChange={(e) => setRosterSearchQuery(e.target.value)}
                    placeholder="Search by name, role, email, or Security ID..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                  {rosterSearchQuery && (
                    <button
                      onClick={() => setRosterSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-2">Divisions:</span>
                  {["All", ...DEPARTMENTS].map((dept) => {
                    const isActive = rosterDeptFilter === dept;
                    const count = dept === "All" 
                      ? employees.length 
                      : employees.filter(e => e.department === dept).length;

                    return (
                      <button
                        key={dept}
                        onClick={() => setRosterDeptFilter(dept)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-indigo-600 text-white font-bold shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {dept}
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modernized Roster Table Container */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="bg-slate-50/70 uppercase text-slate-400 font-mono text-[9px] tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Employee Profile</th>
                        <th className="px-6 py-4">Corporate Division</th>
                        <th className="px-6 py-4">Registry Credentials</th>
                        <th className="px-6 py-4 text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      <AnimatePresence mode="popLayout">
                        {rosterFilteredEmployees.map((emp) => {
                          // Department styling generator
                          const getDeptStyle = (dept: string) => {
                            switch (dept) {
                              case "Engineering":
                                return {
                                  badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
                                  avatar: "bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 text-indigo-700 border-indigo-200/30"
                                };
                              case "Sales":
                                return {
                                  badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
                                  avatar: "bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200/30"
                                };
                              case "Customer Success":
                                return {
                                  badge: "bg-purple-50 text-purple-700 border-purple-100",
                                  avatar: "bg-gradient-to-tr from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-200/30"
                                };
                              case "Product":
                                return {
                                  badge: "bg-amber-50 text-amber-800 border-amber-100",
                                  avatar: "bg-gradient-to-tr from-amber-500/10 to-orange-500/10 text-amber-800 border-amber-200/30"
                                };
                              case "Operations":
                                return {
                                  badge: "bg-slate-100 text-slate-700 border-slate-200",
                                  avatar: "bg-gradient-to-tr from-slate-500/10 to-slate-600/10 text-slate-700 border-slate-200/50"
                                };
                              default:
                                return {
                                  badge: "bg-slate-50 text-slate-600 border-slate-200/50",
                                  avatar: "bg-slate-50 text-slate-600 border-slate-200/50"
                                };
                            }
                          };

                          const style = getDeptStyle(emp.department);
                          const isEmailCopied = copiedText === emp.email;
                          const isIdCopied = copiedText === emp.id;

                          return (
                            <motion.tr
                              layout
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                              key={emp.id}
                              className="hover:bg-slate-50/40 group transition-all"
                            >
                              {/* Employee Profile Cell */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3.5">
                                  {/* Custom Initials Avatar */}
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border tracking-wide shrink-0 ${style.avatar}`}>
                                    {getInitials(emp.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="block font-bold text-slate-800 text-xs tracking-tight">{emp.name}</span>
                                    <span className="block text-[11px] text-slate-500 font-medium mt-0.5">{emp.role}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Division Cell */}
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${style.badge}`}>
                                  <Building className="h-3 w-3 opacity-70" />
                                  {emp.department}
                                </span>
                              </td>

                              {/* Registry Credentials Cell (Combined Email & ID) */}
                              <td className="px-6 py-4 space-y-1.5">
                                {/* Monospace Email */}
                                <div className="flex items-center gap-1.5">
                                  <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span className="font-mono text-[11px] text-slate-600 font-medium select-all">{emp.email}</span>
                                  
                                  <button
                                    onClick={() => handleCopyToClipboard(emp.email)}
                                    className={`p-1 rounded-md transition-all cursor-pointer ${
                                      isEmailCopied 
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/40" 
                                        : "opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                                    }`}
                                    title={isEmailCopied ? "Copied!" : "Copy Email"}
                                  >
                                    {isEmailCopied ? (
                                      <Check className="h-2.5 w-2.5" />
                                    ) : (
                                      <Copy className="h-2.5 w-2.5" />
                                    )}
                                  </button>
                                  {isEmailCopied && (
                                    <span className="text-[9px] font-bold text-emerald-600 animate-fade-in">Copied</span>
                                  )}
                                </div>

                                {/* Monospace Security ID */}
                                <div className="flex items-center gap-1.5">
                                  <Key className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span className="font-mono text-[10px] text-slate-400 tracking-tighter select-all">ID: {emp.id}</span>
                                  
                                  <button
                                    onClick={() => handleCopyToClipboard(emp.id)}
                                    className={`p-1 rounded-md transition-all cursor-pointer ${
                                      isIdCopied 
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/40" 
                                        : "opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                                    }`}
                                    title={isIdCopied ? "Copied!" : "Copy Security ID"}
                                  >
                                    {isIdCopied ? (
                                      <Check className="h-2.5 w-2.5" />
                                    ) : (
                                      <Copy className="h-2.5 w-2.5" />
                                    )}
                                  </button>
                                  {isIdCopied && (
                                    <span className="text-[9px] font-bold text-emerald-600 animate-fade-in">Copied</span>
                                  )}
                                </div>
                              </td>

                              {/* Action Items */}
                              <td className="px-6 py-4 text-right pr-6 space-x-1 shrink-0">
                                <button
                                  onClick={() => handleOpenEditEmployee(emp)}
                                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 border border-transparent transition-all inline-flex items-center justify-center cursor-pointer"
                                  title="Edit Profile"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                  className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 border border-transparent transition-all inline-flex items-center justify-center cursor-pointer"
                                  title="Deactivate Profile"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>

                      {/* No Results Empty State */}
                      {rosterFilteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 px-6 text-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="max-w-xs mx-auto flex flex-col items-center"
                            >
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 mb-3">
                                <Search className="h-5 w-5" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800">No Database Records Found</h4>
                              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                                No employees matched "{rosterSearchQuery}" or the "{rosterDeptFilter}" division filter. Try adjusting your query.
                              </p>
                              <button
                                onClick={() => {
                                  setRosterSearchQuery("");
                                  setRosterDeptFilter("All");
                                }}
                                className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Clear All Filters
                              </button>
                            </motion.div>
                          </td>
                        </tr>
                      )}
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
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0">
              <h3 className="text-md font-bold text-slate-800">
                {editingEmployee ? "Edit Performance Profile" : "Create Team Profile"}
              </h3>
              <button
                type="button"
                onClick={() => setIsEmployeeModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
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
              </div>

              <div className="p-6 pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs shrink-0 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
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
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-md font-bold text-slate-800">Record Performance Card</h3>
                <p className="text-xs text-slate-500 mt-1">
                  For {selectedPerfEmployee.name} &bull; {selectedMonth}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPerformanceModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePerformance} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold text-slate-600">Month Code:</span>
                  <MonthPicker
                    value={selectedMonth}
                    onChange={handleMonthChangeInPerfLog}
                    align="right"
                  />
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

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Manager Remarks (Qualitative Feedback)</label>
                  <textarea
                    rows={3}
                    value={perfFormData.managerRemarks}
                    onChange={(e) => setPerfFormData({ ...perfFormData, managerRemarks: e.target.value })}
                    placeholder="e.g., Led the Q3 planning session, resolved high-priority support ticket backlogs, showed outstanding leadership under pressure..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 font-sans"
                  />
                  <span className="text-[10px] text-slate-400">Attach descriptive, qualitative highlights to supplement the metrics.</span>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs shrink-0 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsPerformanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Record Card Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Monthly Targets Modal */}
      {isTargetsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphism Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsTargetsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Set Monthly Targets
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Define expectations for <span className="font-semibold text-slate-600 font-mono">{selectedMonth}</span> to flag under-performance
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsTargetsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTarget} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Selected Month */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Target Month
                  </label>
                  <div>
                    <MonthPicker
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      fullWidth={true}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">
                    Choose the performance tracking month
                  </span>
                </div>

                {/* Attendance Target */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Min Attendance Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={targetFormData.attendanceMin}
                      onChange={(e) => setTargetFormData({ ...targetFormData, attendanceMin: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none font-mono font-semibold"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px] font-bold">%</span>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">
                    Attendance percentage expectations. Standard baseline: 95%
                  </span>
                </div>

                {/* Project Value Target */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Min Delivered Value ($)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={targetFormData.projectValueMin}
                      onChange={(e) => setTargetFormData({ ...targetFormData, projectValueMin: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none font-mono font-semibold"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">
                    Delivered project financial worth in dollars. Standard: $25,000
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs shrink-0 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsTargetsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DBStatusBanner />
    </div>
  );
}
