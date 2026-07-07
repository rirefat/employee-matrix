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
  AlertTriangle,
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

const DEPARTMENTS = ["Sales", "Operations"];
const TEAMS = ["Custom", "Shopify", "WordPress"];

const getDeptIcon = (dept: string) => {
  switch (dept) {
    case "All": return <Layers className="h-3.5 w-3.5" />;
    case "Sales": return <DollarSign className="h-3.5 w-3.5" />;
    case "Operations": return <Briefcase className="h-3.5 w-3.5" />;
    default: return <Building className="h-3.5 w-3.5" />;
  }
};

const getTeamIcon = (team: string) => {
  switch (team) {
    case "All": return <Users className="h-3.5 w-3.5" />;
    case "Custom": return <Cpu className="h-3.5 w-3.5" />;
    case "Shopify": return <Sparkles className="h-3.5 w-3.5" />;
    case "WordPress": return <Server className="h-3.5 w-3.5" />;
    default: return <Briefcase className="h-3.5 w-3.5" />;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster">("profile");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06");
  const [rosterSearchQuery, setRosterSearchQuery] = useState<string>("");
  const [rosterDeptFilter, setRosterDeptFilter] = useState<string>("All");
  const [rosterTeamFilter, setRosterTeamFilter] = useState<string>("All");
  const [rosterSortBy, setRosterSortBy] = useState<"Alphabetical Name" | "Highest Performance" | "Lowest Performance">("Alphabetical Name");
  const [attendanceWarningThreshold, setAttendanceWarningThreshold] = useState<number>(85);
  const [universalProjectValueTarget, setUniversalProjectValueTarget] = useState<number>(() => {
    const saved = localStorage.getItem("universalProjectValueTarget");
    return saved ? Number(saved) : 25000;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("universalProjectValueTarget", universalProjectValueTarget.toString());
  }, [universalProjectValueTarget]);

  const currentTarget = useMemo(() => {
    return targets.find((t) => t.month === selectedMonth);
  }, [targets, selectedMonth]);

  const [searchQuery, setSearchQuery] = useState<string>(" "); // Space triggers full list but keeps standard structure

  // App Alerts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    id: "",
    name: "",
    role: "",
    department: DEPARTMENTS[0],
    team: TEAMS[0],
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
    projectValueMin: universalProjectValueTarget,
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
          projectValueMin: universalProjectValueTarget,
        });
      }
    }
  }, [isTargetsModalOpen, currentTarget]);

  // Lock body scroll when any modal is open to prevent background scrolling
  useEffect(() => {
    const isAnyModalOpen = isEmployeeModalOpen || isTargetsModalOpen || isPerformanceModalOpen || isDeleteConfirmOpen;
    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isEmployeeModalOpen, isTargetsModalOpen, isPerformanceModalOpen, isDeleteConfirmOpen]);

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
    setEmployeeFormData({
      id: "",
      name: "",
      role: "",
      department: DEPARTMENTS[0],
      team: TEAMS[0],
      email: ""
    });
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmployeeFormData({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      team: emp.team || TEAMS[0],
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
          const errData = await res.json().catch(() => ({}));
          showToast(errData.error || "Failed to update employee.", "error");
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
          const errData = await res.json().catch(() => ({}));
          showToast(errData.error || "Failed to add employee profile.", "error");
        }
      }
    } catch (err) {
      console.error("Error saving employee:", err);
      showToast("Error communicating with the server.", "error");
    }
  };

  const handleDeleteEmployeeClick = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      const res = await fetch(`/api/employees/${employeeToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Employee profile deleted.", "success");
        setIsDeleteConfirmOpen(false);
        setEmployeeToDelete(null);
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
      (emp.team && emp.team.toLowerCase().includes(q)) ||
      emp.email.toLowerCase().includes(q)
    );
  });

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

  const activeEmployeesCount = useMemo(() => {
    return employees.filter(e => e.active !== false).length || 1;
  }, [employees]);

  const effectiveProjectValueMin = useMemo(() => {
    const totalTarget = currentTarget?.projectValueMin !== undefined ? currentTarget.projectValueMin : universalProjectValueTarget;
    return Math.round(totalTarget / activeEmployeesCount);
  }, [currentTarget, universalProjectValueTarget, activeEmployeesCount]);

  const overallPerformance = useMemo(() => {
    if (!activeRecord) return null;
    const targetAtt = currentTarget?.attendanceMin || 95;
    const targetVal = effectiveProjectValueMin;
    const attScore = Math.min(100, (activeRecord.attendance / targetAtt) * 100);
    const valScore = Math.min(100, (activeRecord.deliveredProjectsValue / targetVal) * 100);
    return Math.round(attScore * 0.5 + valScore * 0.5);
  }, [activeRecord, currentTarget, effectiveProjectValueMin]);

  // Filter & Sort roster database
  const rosterFilteredEmployees = useMemo(() => {
    const filtered = employees.filter(emp => {
      const q = rosterSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q);

      const matchesDept = rosterDeptFilter === "All" || emp.department === rosterDeptFilter;
      const matchesTeam = rosterTeamFilter === "All" || emp.team === rosterTeamFilter;

      return matchesSearch && matchesDept && matchesTeam;
    });

    return [...filtered].sort((a, b) => {
      if (rosterSortBy === "Alphabetical Name") {
        return a.name.localeCompare(b.name);
      }

      // Compute performance score for the selected month to rank them
      const getScore = (empId: string) => {
        const rec = performance.find(p => p.employeeId === empId && p.month === selectedMonth);
        if (!rec) return 0;
        const targetAtt = currentTarget?.attendanceMin || 95;
        const targetVal = effectiveProjectValueMin;
        const attScore = Math.min(100, (rec.attendance / targetAtt) * 100);
        const valScore = Math.min(100, (rec.deliveredProjectsValue / targetVal) * 100);
        return Math.round(attScore * 0.5 + valScore * 0.5);
      };

      const scoreA = getScore(a.id);
      const scoreB = getScore(b.id);

      if (rosterSortBy === "Highest Performance") {
        return scoreB - scoreA || a.name.localeCompare(b.name);
      } else {
        return scoreA - scoreB || a.name.localeCompare(b.name);
      }
    });
  }, [
    employees,
    rosterSearchQuery,
    rosterDeptFilter,
    rosterTeamFilter,
    rosterSortBy,
    performance,
    selectedMonth,
    currentTarget,
    effectiveProjectValueMin
  ]);

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
        
        <div className="w-[85%] max-w-[85%] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
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
              className="flex items-center gap-1.5 bg-indigo-50/90 hover:bg-indigo-100/90 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200 text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer animate-fade-in"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Set Targets</span>
              <span className="sm:hidden">Targets</span>
            </motion.button>

            {/* Portal Settings Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer ${
                  isSettingsOpen 
                    ? "bg-slate-950 border-slate-950 text-white" 
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className={`h-3.5 w-3.5 ${isSettingsOpen ? "text-white" : "text-slate-500"}`} />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Set</span>
              </motion.button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <>
                    {/* Backdrop to close settings */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsSettingsOpen(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3.5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Settings className="h-4 w-4 text-slate-500" />
                          <span className="text-xs font-extrabold uppercase tracking-wider font-display">System Config</span>
                        </div>
                        <button 
                          onClick={() => setIsSettingsOpen(false)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Attendance Warning Configuration Panel */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Attendance Warning</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg">
                            &lt; {attendanceWarningThreshold}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-bold text-slate-400 font-mono">70%</span>
                          <input
                            type="range"
                            min="70"
                            max="100"
                            value={attendanceWarningThreshold}
                            onChange={(e) => setAttendanceWarningThreshold(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-[9px] font-bold text-slate-400 font-mono">100%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Configures the threshold below which employee records are flagged for poor attendance. Rows with attendance below this value will highlight in red on the 'Database Records' table.
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-2" />

                      {/* Universal Delivered Value Target Panel */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Universal Value Target</span>
                          </div>
                        </div>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">$</span>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={universalProjectValueTarget}
                            onChange={(e) => setUniversalProjectValueTarget(Math.max(0, Number(e.target.value)))}
                            className="w-full pl-6 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Configures the default minimum delivered value target for all members. This is used when no month-specific target is defined.
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

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
      <main className="flex-1 w-[85%] max-w-[85%] mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 items-start">

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
                    targetProjectValueMin={effectiveProjectValueMin}
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
              <AnimatePresence mode="wait">
                {selectedReportEmployeeObj ? (
                  <motion.div
                    key={selectedReportEmployeeObj.id}
                    initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    {/* Glassmorphic Selected employee info card with ambient blur backdrops */}
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-xl p-6 bg-white/70 backdrop-blur-md">
                    {/* Atmospheric color nodes under glass to enhance depth */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/15 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

                    {/* Creative technical background gridlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    
                    {/* Technical decorative crosshairs and corner lines for a premium aesthetic */}
                    <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-slate-300 pointer-events-none" />
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-slate-300 pointer-events-none" />
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-slate-300 pointer-events-none" />
                    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-slate-300 pointer-events-none" />

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
                              activeRecord.attendance >= (currentTarget?.attendanceMin || 95) && activeRecord.deliveredProjectsValue >= effectiveProjectValueMin ? (
                                <span className="text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px]">Exceeds Expectations</span>
                              ) : (overallPerformance || 0) >= 80 ? (
                                <span className="text-blue-700 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px]">Meets Expectations</span>
                              ) : (
                                <span className="text-amber-600 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px]">Development Required</span>
                              )
                            ) : (
                              <span className="text-slate-400 italic font-medium">No metrics registered yet</span>
                            )}
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-200/40 space-y-3">
                            {/* Header Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                                  Overall Performance Rating
                                </span>
                                {activeRecord && overallPerformance !== null ? (
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
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
                              
                              {activeRecord && overallPerformance !== null ? (
                                <span className="text-sm font-bold font-mono text-slate-800">
                                  {overallPerformance}%
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No metrics registered yet</span>
                              )}
                            </div>

                            {/* Creative Horizontal Segmented Rating Line */}
                            {activeRecord && overallPerformance !== null && (
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
                                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-1 text-[9px] font-semibold text-slate-400 font-mono">
                                  <span className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> At Risk (&lt;70%)
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Needs Attention (70%-89%)
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> On Track (90%+)
                                  </span>
                                </div>
                              </div>
                            )}
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

                    {/* Four metrics boxes redesigned as frosted glass panels with target comparisons */}
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Box 1: Attendance */}
                      <div className={`p-4 border rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:shadow-xs ${
                        activeRecord && activeRecord.attendance >= (currentTarget?.attendanceMin || 95)
                          ? "bg-emerald-50/20 border-emerald-200/50 hover:bg-emerald-50/30"
                          : activeRecord
                          ? "bg-rose-50/20 border-rose-200/50 hover:bg-rose-50/30"
                          : "bg-white/40 border-white/50 hover:bg-white/50"
                      }`}>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
                            {activeRecord && (
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                activeRecord.attendance >= (currentTarget?.attendanceMin || 95)
                                  ? "text-emerald-700 bg-emerald-100/60"
                                  : "text-rose-700 bg-rose-100/60"
                              }`}>
                                {activeRecord.attendance >= (currentTarget?.attendanceMin || 95) ? "Met ✓" : "Missed ⚠"}
                              </span>
                            )}
                          </div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? `${activeRecord.attendance}%` : "—"}
                          </div>
                          <div className="text-[9px] text-slate-500 font-medium font-sans mt-0.5">
                            Target: <span className="font-mono font-bold">{(currentTarget?.attendanceMin || 95)}%</span>
                          </div>
                          {activeRecord && (
                            <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5 text-[8px] font-semibold text-slate-500 font-mono">
                              <span className="text-emerald-700 bg-emerald-500/10 px-1 rounded">Pres: {activeRecord.presentDays !== undefined ? activeRecord.presentDays : Math.round((activeRecord.totalWorkingDays || 22) * (activeRecord.attendance / 100))}d</span>
                              <span className="text-rose-700 bg-rose-500/10 px-1 rounded">Abs: {activeRecord.absentDays !== undefined ? activeRecord.absentDays : ((activeRecord.totalWorkingDays || 22) - (activeRecord.presentDays !== undefined ? activeRecord.presentDays : Math.round((activeRecord.totalWorkingDays || 22) * (activeRecord.attendance / 100))))}d</span>
                            </div>
                          )}
                        </div>
                        <div className="h-1 w-full bg-slate-200/50 rounded-full mt-2 overflow-hidden border border-white/20">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              activeRecord && activeRecord.attendance >= (currentTarget?.attendanceMin || 95)
                                ? "bg-emerald-400"
                                : "bg-rose-400 animate-pulse"
                            }`}
                            style={{ width: `${activeRecord ? activeRecord.attendance : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Box 2: Delivered Project Value */}
                      <div className={`p-4 border rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:shadow-xs ${
                        activeRecord && activeRecord.deliveredProjectsValue >= effectiveProjectValueMin
                          ? "bg-indigo-50/20 border-indigo-200/50 hover:bg-indigo-50/30"
                          : activeRecord
                          ? "bg-rose-50/20 border-rose-200/50 hover:bg-rose-50/30"
                          : "bg-white/40 border-white/50 hover:bg-white/50"
                      }`}>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Delivered Value</span>
                            {activeRecord && (
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                activeRecord.deliveredProjectsValue >= effectiveProjectValueMin
                                  ? "text-indigo-700 bg-indigo-100/60"
                                  : "text-rose-700 bg-rose-100/60"
                              }`}>
                                {activeRecord.deliveredProjectsValue >= effectiveProjectValueMin ? "Met ✓" : "Missed ⚠"}
                              </span>
                            )}
                          </div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? `$${(activeRecord.deliveredProjectsValue).toLocaleString()}` : "—"}
                          </div>
                          <div className="text-[9px] text-slate-500 font-medium font-sans mt-0.5">
                            Target: <span className="font-mono font-bold">${effectiveProjectValueMin.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="h-1 w-full bg-slate-200/50 rounded-full mt-2 overflow-hidden border border-white/20">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              activeRecord && activeRecord.deliveredProjectsValue >= effectiveProjectValueMin
                                ? "bg-indigo-400"
                                : "bg-rose-400 animate-pulse"
                            }`}
                            style={{ width: `${activeRecord ? Math.min(100, (activeRecord.deliveredProjectsValue / effectiveProjectValueMin) * 100) : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Box 3: Project Count */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Projects Shipped</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? activeRecord.deliveredProjectsAmount : "—"}
                          </div>
                        </div>
                        <div className="text-[9px] text-emerald-700 font-bold mt-2 truncate bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md inline-block w-max font-mono">
                          {activeRecord ? `+${activeRecord.deliveredProjectsAmount} Deliverables` : "No activity"}
                        </div>
                      </div>

                      {/* Box 4: Meetings Conducted */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Meetings Conducted</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? activeRecord.conductedMeetings : "—"}
                          </div>
                        </div>
                        <div className="text-[9px] text-indigo-700 font-bold mt-2 truncate bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md inline-block w-max font-mono">
                          {activeRecord ? `${activeRecord.conductedMeetings} sessions run` : "No activity"}
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
                </motion.div>
              ) : (
                <motion.div
                  key="no-employee"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500"
                >
                  <p>Please select an employee from the Direct Reports roster to view their profile.</p>
                </motion.div>
              )}
              </AnimatePresence>
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
              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
                {/* Search & Sort controls wrapper */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search input with inner styling */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={rosterSearchQuery}
                      onChange={(e) => setRosterSearchQuery(e.target.value)}
                      placeholder="Search by name, role, email, or Security ID..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-3xs"
                    />
                    {rosterSearchQuery && (
                      <button
                        onClick={() => setRosterSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 text-[10px] font-bold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Premium Sort Dropdown */}
                  <div className="flex items-center gap-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-3xs hover:border-slate-300 transition-all sm:w-60 shrink-0">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 font-mono">Order By</span>
                      <select
                        value={rosterSortBy}
                        onChange={(e) => setRosterSortBy(e.target.value as any)}
                        className="w-full bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none focus:ring-0 p-0 cursor-pointer block"
                      >
                        <option value="Alphabetical Name">Alphabetical Name</option>
                        <option value="Highest Performance">Highest Performance</option>
                        <option value="Lowest Performance">Lowest Performance</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ultra-Sleek Single-Line Unified Filter Bar */}
                <div className="w-full border-b border-slate-100 pb-3 mt-1 overflow-hidden">
                  <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap whitespace-nowrap py-1">
                    {/* Divisions Section Header */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
                        Divisions
                      </span>
                    </div>
                    
                    {/* Divisions Items */}
                    <div className="flex items-center gap-1 shrink-0">
                      {["All", ...DEPARTMENTS].map((dept) => {
                        const isActive = rosterDeptFilter === dept;
                        const count = dept === "All" 
                          ? employees.length 
                          : employees.filter(e => e.department === dept).length;

                        return (
                          <button
                            key={dept}
                            onClick={() => setRosterDeptFilter(dept)}
                            className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive ? "text-indigo-950" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {/* Sliding Active Indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="activeDept"
                                className="absolute inset-0 bg-indigo-50 border border-indigo-100/50 rounded-lg z-0"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                              <span className={`${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                                {getDeptIcon(dept)}
                              </span>
                              <span>{dept}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                isActive ? "bg-indigo-150 text-indigo-800" : "bg-slate-200/40 text-slate-500"
                              }`}>
                                {count}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Creative Thin Divider */}
                    <div className="h-5 w-[1px] bg-slate-200 shrink-0 mx-2 relative">
                      <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 w-1.5 h-1.5 -ml-[3px] rounded-full bg-slate-300" />
                    </div>

                    {/* Teams Section Header */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
                        Teams
                      </span>
                    </div>

                    {/* Teams Items */}
                    <div className="flex items-center gap-1 shrink-0">
                      {["All", ...TEAMS].map((t) => {
                        const isActive = rosterTeamFilter === t;
                        const count = t === "All"
                          ? employees.length
                          : employees.filter(e => e.team === t).length;

                        return (
                          <button
                            key={t}
                            onClick={() => setRosterTeamFilter(t)}
                            className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive ? "text-blue-950" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {/* Sliding Active Indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="activeTeam"
                                className="absolute inset-0 bg-blue-50 border border-blue-100/50 rounded-lg z-0"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                              <span className={`${isActive ? "text-blue-600" : "text-slate-400"}`}>
                                {getTeamIcon(t)}
                              </span>
                              <span>{t}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                isActive ? "bg-blue-150 text-blue-800" : "bg-slate-200/40 text-slate-500"
                              }`}>
                                {count}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
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

                          const rec = performance.find(p => p.employeeId === emp.id && p.month === selectedMonth);
                          const hasLowAttendance = rec && rec.attendance < attendanceWarningThreshold;

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
                              className={`transition-all group border-l-2 ${
                                hasLowAttendance 
                                  ? "bg-rose-50/40 hover:bg-rose-100/40 border-l-rose-500" 
                                  : "hover:bg-slate-50/40 border-l-transparent"
                              }`}
                            >
                              {/* Employee Profile Cell */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3.5">
                                  {/* Custom Initials Avatar */}
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border tracking-wide shrink-0 relative ${style.avatar}`}>
                                    {getInitials(emp.name)}
                                    {hasLowAttendance && (
                                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="block font-bold text-slate-800 text-xs tracking-tight flex items-center gap-1.5 flex-wrap">
                                      {emp.name}
                                      {hasLowAttendance && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200/50 animate-pulse">
                                          <AlertTriangle className="h-2.5 w-2.5 text-rose-600" />
                                          Low Attendance
                                        </span>
                                      )}
                                    </span>
                                    <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                                      {emp.role} {rec ? (
                                        <span className="text-slate-400 font-normal">
                                          &middot; Attendance: <strong className={hasLowAttendance ? "text-rose-600 font-bold font-mono text-[10px]" : "text-slate-600 font-semibold font-mono text-[10px]"}>{rec.attendance}%</strong>
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-normal italic">
                                          &middot; Attendance: not set
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Division Cell */}
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${style.badge}`}>
                                    <Building className="h-3 w-3 opacity-70" />
                                    {emp.department}
                                  </span>
                                  {emp.team && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-100">
                                      {emp.team}
                                    </span>
                                  )}
                                </div>
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
                                  onClick={() => handleDeleteEmployeeClick(emp)}
                                  className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 border border-transparent transition-all inline-flex items-center justify-center cursor-pointer"
                                  title="Delete Profile"
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
        <div className="w-[85%] max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
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
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Security ID {editingEmployee ? "" : "(Optional)"}
                  </label>
                  <input
                    type="text"
                    disabled={!!editingEmployee}
                    placeholder="e.g. emp-99 or leave blank to autogenerate"
                    value={employeeFormData.id}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, id: e.target.value.replace(/\s+/g, '') })}
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all font-mono ${
                      editingEmployee 
                        ? "bg-slate-100/80 border-slate-200/80 text-slate-400 cursor-not-allowed" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                  {!editingEmployee && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Set a custom unique identifier or leave blank to autogenerate a secure ID.
                    </p>
                  )}
                </div>

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
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Team *</label>
                  <select
                    value={employeeFormData.team}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, team: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>{t}</option>
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

      {/* MODAL 4: DELETE CONFIRMATION */}
      {isDeleteConfirmOpen && employeeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md flex flex-col shadow-xl animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-50 text-rose-600 mb-4 border border-rose-100">
                <AlertTriangle className="h-6 w-6 animate-bounce" />
              </div>
              <h3 className="text-md font-bold text-slate-800 mb-2">
                Delete Employee Profile?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-slate-800 font-semibold">{employeeToDelete.name}</strong>'s performance profile?
                This action cannot be undone, and all their historical performance records, targets, and reports will be removed from the database.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-2 border-t border-slate-100 flex gap-2 text-xs shrink-0 bg-slate-50/50 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setEmployeeToDelete(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEmployee}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <DBStatusBanner />
    </div>
  );
}
