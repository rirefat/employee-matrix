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
  LogOut,
  Building,
  ArrowLeftRight,
  ChevronDown,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { Employee, PerformanceRecord, MonthlyReport, MonthlyTarget, LeaveRequest } from "./types";
import { ReportViewer } from "./components/ReportViewer";
import { DashboardTab } from "./components/DashboardTab";
import { EmployeeCard } from "./components/EmployeeCard";
import { LoginPage, Manager } from "./components/LoginPage";
import { MonthPicker } from "./components/MonthPicker";
import { motion, AnimatePresence } from "motion/react";

const DEPARTMENTS = ["Sales", "Operations"];
const TEAMS = ["Custom", "Shopify", "WordPress", "UI/UX"];

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

import { get3DAvatarUrl } from "./utils";

export default function App() {
  const [activePortal, setActivePortal] = useState<"performance" | "leaves" | "employees">("performance");
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster" | "compare">("profile");
  const [compareEmp1, setCompareEmp1] = useState<string>("");
  const [compareEmp2, setCompareEmp2] = useState<string>("");
  const [loggedInManager, setLoggedInManager] = useState<Manager | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06");
  const myEmployees = useMemo(() => employees.filter(emp => loggedInManager?.teams.includes(emp.team)), [employees, loggedInManager]);
  const [rosterSearchQuery, setRosterSearchQuery] = useState<string>("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateDept, setBulkUpdateDept] = useState<string>(DEPARTMENTS[0]);
  const [bulkUpdateTeam, setBulkUpdateTeam] = useState<string>(TEAMS[0]);
  const [rosterDeptFilter, setRosterDeptFilter] = useState<string>("All");
  const [rosterTeamFilter, setRosterTeamFilter] = useState<string>("All");
  const [rosterSortBy, setRosterSortBy] = useState<"Alphabetical Name" | "Highest Performance" | "Lowest Performance">("Alphabetical Name");
  const [attendanceWarningThreshold, setAttendanceWarningThreshold] = useState<number>(85);
  const [universalProjectValueTarget, setUniversalProjectValueTarget] = useState<number>(() => {
    const saved = localStorage.getItem("universalProjectValueTarget");
    return saved ? Number(saved) : 25000;
  });

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
    email: "",
    leaveBalance: {
      sickLeaveUsed: 0,
      casualLeaveUsed: 0,
      govFestHolidaysUsed: 0
    }
  });

  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedPerfEmployee, setSelectedPerfEmployee] = useState<Employee | null>(null);
  const [entryMode, setEntryMode] = useState<"overwrite" | "add">("overwrite");
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

  const [kudos, setKudos] = useState<Record<string, { velocity: number; innovation: number; team: number; precision: number; growth: number; empathy: number }>>({});

  const [activeCompareMetric, setActiveCompareMetric] = useState<string>("Attendance Rate");

  const getInitialKudos = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return {
      velocity: Math.abs((hash) % 15) + 3,
      innovation: Math.abs((hash >> 2) % 12) + 2,
      team: Math.abs((hash >> 4) % 18) + 5,
      precision: Math.abs((hash >> 6) % 10) + 4,
      growth: Math.abs((hash >> 8) % 14) + 3,
      empathy: Math.abs((hash >> 10) % 16) + 4,
    };
  };

  const getEmployeeKudos = (empId: string, empName: string) => {
    if (!kudos[empId]) {
      return getInitialKudos(empName);
    }
    return kudos[empId];
  };

  const handleAddKudos = (empId: string, empName: string, type: 'velocity' | 'innovation' | 'team' | 'precision' | 'growth' | 'empathy') => {
    const current = getEmployeeKudos(empId, empName);
    setKudos(prev => ({
      ...prev,
      [empId]: {
        ...current,
        [type]: current[type] + 1
      }
    }));
    showToast(`Awarded +1 Kudos to ${empName}!`, "success");
  };

  const existingRecordForSelected = useMemo(() => {
    if (!selectedPerfEmployee) return null;
    return performance.find(p => p.employeeId === selectedPerfEmployee.id && p.month === selectedMonth) || null;
  }, [performance, selectedPerfEmployee, selectedMonth]);

  useEffect(() => {
    if (!selectedPerfEmployee) return;

    if (entryMode === "add") {
      setPerfFormData(prev => ({
        ...prev,
        conductedMeetings: 0,
        deliveredProjectsAmount: 0,
        deliveredProjectsValue: 0,
        managerRemarks: ""
      }));
    } else {
      if (existingRecordForSelected) {
        const working = existingRecordForSelected.totalWorkingDays || 22;
        const present = existingRecordForSelected.presentDays !== undefined ? existingRecordForSelected.presentDays : Math.round(working * (existingRecordForSelected.attendance / 100));
        const absent = existingRecordForSelected.absentDays !== undefined ? existingRecordForSelected.absentDays : (working - present);
        const leave = existingRecordForSelected.leaveDays || 0;

        setPerfFormData({
          attendance: existingRecordForSelected.attendance,
          conductedMeetings: existingRecordForSelected.conductedMeetings,
          deliveredProjectsAmount: existingRecordForSelected.deliveredProjectsAmount,
          deliveredProjectsValue: existingRecordForSelected.deliveredProjectsValue,
          totalWorkingDays: working,
          presentDays: present,
          absentDays: absent,
          leaveDays: leave,
          managerRemarks: existingRecordForSelected.managerRemarks || ""
        });
      } else {
        setPerfFormData({
          attendance: 100,
          conductedMeetings: 0,
          deliveredProjectsAmount: 0,
          deliveredProjectsValue: 0,
          totalWorkingDays: 22,
          presentDays: 22,
          absentDays: 0,
          leaveDays: 0,
          managerRemarks: ""
        });
      }
    }
  }, [entryMode, selectedPerfEmployee, selectedMonth]);

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
    console.log("Edit", emp);
    setEmployeeFormData({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      team: emp.team || TEAMS[0],
      email: emp.email,
      leaveBalance: emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 }
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

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedEmployeeIds.size} employees?`)) return;
    
    setIsSubmitting(true);
    try {
      const ids = Array.from(selectedEmployeeIds);
      await Promise.all(ids.map(id => fetch(`/api/employees/${id}`, { method: 'DELETE' })));
      
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
      
      showToast(`Successfully deleted ${ids.length} employees`, "success");
      setSelectedEmployeeIds(new Set());
    } catch (err: any) {
      showToast(err.message || "Failed to delete employees", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpdate = async () => {
    setIsSubmitting(true);
    try {
      const ids = Array.from(selectedEmployeeIds);
      const updateData = {
        department: bulkUpdateDept,
        team: bulkUpdateTeam,
      };
      
      await Promise.all(ids.map(id => 
        fetch(`/api/employees/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
      ));
      
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
      
      showToast(`Successfully updated ${ids.length} employees`, "success");
      setIsBulkUpdateModalOpen(false);
      setSelectedEmployeeIds(new Set());
    } catch (err: any) {
      showToast(err.message || "Failed to update employees", "error");
    } finally {
      setIsSubmitting(false);
    }
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
    setEntryMode("overwrite");
    
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
        attendance: 100,
        conductedMeetings: 0,
        deliveredProjectsAmount: 0,
        deliveredProjectsValue: 0,
        totalWorkingDays: 22,
        presentDays: 22,
        absentDays: 0,
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
        attendance: 100,
        conductedMeetings: 0,
        deliveredProjectsAmount: 0,
        deliveredProjectsValue: 0,
        totalWorkingDays: 22,
        presentDays: 22,
        absentDays: 0,
        leaveDays: 0,
        managerRemarks: ""
      });
    }
  };

  const handleSavePerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerfEmployee) return;

    try {
      let finalData = { ...perfFormData };

      if (entryMode === "add" && existingRecordForSelected) {
        finalData.conductedMeetings = (existingRecordForSelected.conductedMeetings || 0) + perfFormData.conductedMeetings;
        finalData.deliveredProjectsAmount = (existingRecordForSelected.deliveredProjectsAmount || 0) + perfFormData.deliveredProjectsAmount;
        finalData.deliveredProjectsValue = (existingRecordForSelected.deliveredProjectsValue || 0) + perfFormData.deliveredProjectsValue;
        
        if (perfFormData.managerRemarks) {
          finalData.managerRemarks = existingRecordForSelected.managerRemarks
            ? `${existingRecordForSelected.managerRemarks} | ${perfFormData.managerRemarks}`
            : perfFormData.managerRemarks;
        } else {
          finalData.managerRemarks = existingRecordForSelected.managerRemarks || "";
        }
      }

      const payload = {
        employeeId: selectedPerfEmployee.id,
        month: selectedMonth,
        ...finalData
      };

      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(
          entryMode === "add"
            ? `Successfully added new metrics to ${selectedPerfEmployee.name}'s profile!`
            : `Performance card logged for ${selectedPerfEmployee.name} for ${selectedMonth}`,
          "success"
        );
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
  const filteredEmployees = myEmployees.filter(emp => {
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

  const selectedReportEmployeeObj = myEmployees.find(e => e.id === reportEmployeeId);

  const activeEmployeesCount = useMemo(() => {
    return myEmployees.filter(e => e.active !== false).length || 1;
  }, [myEmployees]);

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
    const filtered = myEmployees.filter(emp => {
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
    myEmployees,
    rosterSearchQuery,
    rosterDeptFilter,
    rosterTeamFilter,
    rosterSortBy,
    performance,
    selectedMonth,
    currentTarget,
    effectiveProjectValueMin
  ]);

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

  if (!loggedInManager) {
    return <LoginPage onLogin={setLoggedInManager} />;
  }
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* GLOBAL SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-50">
        <div className="h-20 flex items-center px-6 border-b border-slate-100/50 bg-white/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10 shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Employee<span className="text-blue-600 font-light">Matrix</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Workspace
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Main Navigation</div>
              
            <button
              onClick={() => setActivePortal("performance")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative ${
                activePortal === "performance" ? "bg-slate-900 text-white font-medium shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activePortal === "performance" ? "bg-white/10" : "bg-slate-200 group-hover:bg-white"} transition-colors`}>
                <TrendingUp className="h-4 w-4" />
              </div>
              Performance
            </button>

            <button
              onClick={() => setActivePortal("leaves")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative ${
                activePortal === "leaves" ? "bg-slate-900 text-white font-medium shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activePortal === "leaves" ? "bg-white/10" : "bg-slate-200 group-hover:bg-white"} transition-colors`}>
                <Calendar className="h-4 w-4" />
              </div>
              Leave Mgmt
            </button>
            
            <button
              onClick={() => setActivePortal("employees")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative ${
                activePortal === "employees" ? "bg-slate-900 text-white font-medium shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activePortal === "employees" ? "bg-white/10" : "bg-slate-200 group-hover:bg-white"} transition-colors`}>
                <Users className="h-4 w-4" />
              </div>
              Employees
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100/50 mt-auto bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">All Systems Operational</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-slate-500 px-2">
            <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
            <a href="#" className="hover:text-slate-900 transition-colors">API</a>
          </div>
          
          <div className="flex items-center gap-2 px-2 pt-2 border-t border-slate-200/60">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-700 leading-tight">Employee Matrix</span>
              <span className="text-[9px] text-slate-400 font-medium">v1.0.0 &copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

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
        
        <div className="w-full h-16 px-6 lg:px-10 xl:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-lg font-medium text-slate-800 tracking-tight">
                {activePortal === "performance" && "Performance Overview"}
                {activePortal === "leaves" && "Leave Management"}
                {activePortal === "employees" && "Employee Directory"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Live View
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
            <button
              onClick={() => setIsTargetsModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-medium transition-all shadow-sm shadow-slate-900/10 cursor-pointer group"
            >
              <TrendingUp className="h-3.5 w-3.5 text-slate-300 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">Set Targets</span>
            </button>

            {/* Profile area */}
            <div className="flex items-center gap-4 relative group ml-2">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{loggedInManager.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{loggedInManager.role}</span>
                </div>
                <div className="relative">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 group-hover:border-slate-300 transition-colors">
                    <img src={get3DAvatarUrl(loggedInManager.name)} alt={loggedInManager.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white z-10" />
                </div>
              </div>
              
              {/* Sign Out Button - Revealed on hover */}
              <div className="absolute right-0 top-full mt-2 w-full flex justify-end opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 z-50">
                <button
                  onClick={() => setLoggedInManager(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="h-3.5 w-3.5 text-slate-400" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {activePortal === "performance" && (
        <>
      <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 flex flex-col gap-8 overflow-y-auto overflow-x-hidden">
          {/* Content tabs selector */}
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1 w-fit border border-slate-200/50">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
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
              Roster
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "compare" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
                <ArrowLeftRight className="h-3.5 w-3.5" />
              Compare
            </button>

          </div>

          {/* TAB CONTENT: PROFILE (Individual analytics + AI Report) */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Clean Minimal Team Member Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1 font-display">Employee Profile</h2>
                  <p className="text-xs text-slate-500 font-medium">Review AI-driven insights and performance roadmap.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative group min-w-[220px]">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                        {selectedReportEmployeeObj ? (
                          <img src={get3DAvatarUrl(selectedReportEmployeeObj.name)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <select 
                      className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-full pl-10 pr-10 py-2 outline-none transition-all cursor-pointer shadow-xs focus:border-slate-300 focus:ring-4 focus:ring-slate-50"
                      value={reportEmployeeId || ""}
                      onChange={(e) => setReportEmployeeId(e.target.value)}
                    >
                      <option value="" disabled>Select Team Member</option>
                      {myEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                  
                  <button 
                    onClick={handleOpenAddEmployee}
                    className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full transition-all shadow-sm flex items-center justify-center group"
                    title="Add Team Profile"
                  >
                    <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

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
                    {/* Grid Layout: Main info card (70%) + Interesting Kudos & DNA panel (30%) */}
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                      
                      {/* Left Block: Main Profile Card (70%) */}
                      <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-xl p-6 bg-white/70 backdrop-blur-md flex flex-col justify-between">
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
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shadow-md border border-slate-200 overflow-hidden shrink-0">
                              <img src={get3DAvatarUrl(selectedReportEmployeeObj.name)} alt={selectedReportEmployeeObj.name} className="w-full h-full object-cover" />
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
                              onClick={() => {
                                if (selectedReportEmployeeObj) {
                                  handleOpenEditEmployee(selectedReportEmployeeObj);
                                }
                              }}
                              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all shadow-xs cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit Profile
                            </button>

                            <button
                              onClick={() => {
                                if (selectedReportEmployeeObj) {
                                  handleOpenPerformanceLog(selectedReportEmployeeObj);
                                }
                              }}
                              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all shadow-xs cursor-pointer"
                            >
                              <TrendingUp className="h-3.5 w-3.5" />
                              Log Activity
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

                  {/* Right Block: DNA & Peer Kudos Indicator (30%) */}
                  <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-xl p-5 bg-white/70 backdrop-blur-md flex flex-col justify-between">
                    {/* Ambient decorative lighting */}
                    <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
                    
                    {/* Grid decorative background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

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
                          <p className="text-[10px] text-slate-400 font-medium">Click tags to award peer recognition.</p>
                        </div>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-500/10 px-1.5 py-0.5 rounded-md font-mono animate-pulse">
                          Live
                        </span>
                      </div>

                      {/* Kudos Upvote Items */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: "velocity" as const, label: "Velocity", icon: "🚀", color: "hover:border-amber-200 hover:bg-amber-500/5 hover:text-amber-700 text-amber-600 border-amber-100" },
                          { key: "innovation" as const, label: "Innovation", icon: "💡", color: "hover:border-purple-200 hover:bg-purple-500/5 hover:text-purple-700 text-purple-600 border-purple-100" },
                          { key: "team" as const, label: "Collaboration", icon: "🤝", color: "hover:border-emerald-200 hover:bg-emerald-500/5 hover:text-emerald-700 text-emerald-600 border-emerald-100" },
                          { key: "precision" as const, label: "Precision", icon: "🎯", color: "hover:border-indigo-200 hover:bg-indigo-500/5 hover:text-indigo-700 text-indigo-600 border-indigo-100" },
                          { key: "growth" as const, label: "Growth", icon: "🌱", color: "hover:border-teal-200 hover:bg-teal-500/5 hover:text-teal-700 text-teal-600 border-teal-100" },
                          { key: "empathy" as const, label: "Empathy", icon: "💖", color: "hover:border-rose-200 hover:bg-rose-500/5 hover:text-rose-700 text-rose-600 border-rose-100" }
                        ].map((item) => {
                          const points = getEmployeeKudos(selectedReportEmployeeObj.id, selectedReportEmployeeObj.name)[item.key];
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => handleAddKudos(selectedReportEmployeeObj.id, selectedReportEmployeeObj.name, item.key)}
                              className={`flex flex-col items-center justify-center p-2 rounded-xl border bg-white/50 text-center transition-all hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer ${item.color}`}
                            >
                              <span className="text-base group-hover:animate-bounce">{item.icon}</span>
                              <span className="text-[10px] font-bold text-slate-700 mt-1">{item.label}</span>
                              <span className="text-[10px] font-extrabold font-mono text-slate-500 mt-0.5 bg-slate-100 px-1.5 py-0.2 rounded">
                                {points}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Creative Operational DNA Pulse wave */}
                    <div className="relative z-10 pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Synergy Wave</span>
                        <span className="text-[10px] font-bold text-slate-800 font-mono">
                          {(Object.values(getEmployeeKudos(selectedReportEmployeeObj.id, selectedReportEmployeeObj.name)) as number[]).reduce((a, b) => a + b, 0)} pts total
                        </span>
                      </div>
                      
                      {/* Animated micro sine-wave */}
                      <div className="h-8 w-24 overflow-hidden relative opacity-80">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path
                            d="M0 15 Q25 5, 50 15 T100 15"
                            fill="none"
                            stroke="rgb(99, 102, 241)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                          <path
                            d="M0 15 Q25 25, 50 15 T100 15"
                            fill="none"
                            stroke="rgb(16, 185, 129)"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                            className="animate-pulse opacity-60"
                          />
                        </svg>
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
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] uppercase font-bold rounded-lg transition-all"
                    >
                      View Path
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
              <DashboardTab employees={myEmployees} records={performance} />
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
                    <span className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{myEmployees.length} Active Profiles</span>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 hover:bg-slate-300 rounded-md text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
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
                          ? myEmployees.length 
                          : myEmployees.filter(e => e.department === dept).length;

                        return (
                          <button
                            key={dept}
                            onClick={() => setRosterDeptFilter(dept)}
                            className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive ? "text-indigo-950" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="rosterDeptTab"
                                className="absolute inset-0 bg-white border border-indigo-200/60 rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                              />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                              {getDeptIcon(dept)}
                              {dept}
                            </span>
                            <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                              isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {count}
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
                          ? myEmployees.length
                          : myEmployees.filter(e => e.team === t).length;

                        return (
                          <button
                            key={t}
                            onClick={() => setRosterTeamFilter(t)}
                            className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive ? "text-blue-950" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="rosterTeamTab"
                                className="absolute inset-0 bg-white border border-blue-200/60 rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                              />
                            )}
                            <span className="relative z-10">{t}</span>
                            <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                              isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {count}
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
                        <th className="px-6 py-4 w-12 text-center">
                          <button
                            onClick={() => {
                              if (rosterFilteredEmployees.length > 0 && selectedEmployeeIds.size === rosterFilteredEmployees.length) {
                                setSelectedEmployeeIds(new Set());
                              } else {
                                setSelectedEmployeeIds(new Set(rosterFilteredEmployees.map(emp => emp.id)));
                              }
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                              rosterFilteredEmployees.length > 0 && selectedEmployeeIds.size === rosterFilteredEmployees.length
                                ? "bg-indigo-500 shadow-indigo-500/30 border-transparent"
                                : "bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"
                            }`}
                          >
                            {rosterFilteredEmployees.length > 0 && selectedEmployeeIds.size === rosterFilteredEmployees.length && (
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            )}
                          </button>
                        </th>
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
                              className={`transition-all group border-l-2 cursor-pointer ${
                                selectedEmployeeIds.has(emp.id)
                                  ? "bg-indigo-50 hover:bg-indigo-100/80 border-l-indigo-500 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)]"
                                  : hasLowAttendance 
                                    ? "bg-rose-50/40 hover:bg-rose-100/40 border-l-rose-500" 
                                    : "hover:bg-slate-50/40 border-l-transparent"
                              }`}
                              onClick={() => {
                                const newSet = new Set(selectedEmployeeIds);
                                if (newSet.has(emp.id)) {
                                  newSet.delete(emp.id);
                                } else {
                                  newSet.add(emp.id);
                                }
                                setSelectedEmployeeIds(newSet);
                              }}
                            >
                              <td className="px-6 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newSet = new Set(selectedEmployeeIds);
                                    if (newSet.has(emp.id)) {
                                      newSet.delete(emp.id);
                                    } else {
                                      newSet.add(emp.id);
                                    }
                                    setSelectedEmployeeIds(newSet);
                                  }}
                                  className={`w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                                    selectedEmployeeIds.has(emp.id)
                                      ? "bg-indigo-500 shadow-indigo-500/30 border-transparent scale-110"
                                      : "bg-white border border-slate-300 group-hover:border-indigo-400 group-hover:bg-indigo-50"
                                  }`}
                                >
                                  {selectedEmployeeIds.has(emp.id) && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                    </motion.div>
                                  )}
                                </button>
                              </td>
                              {/* Employee Profile Cell */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {/* Custom Avatar */}
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 relative overflow-hidden bg-slate-100 ${style.avatar}`}>
                                    <img src={get3DAvatarUrl(emp.name)} alt={emp.name} className="w-full h-full object-cover relative z-10" />
                                    {hasLowAttendance && (
                                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-20">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="block font-bold text-slate-800 text-xs tracking-tight">
                                      <span className="truncate">{emp.name}</span>
                                    </span>
                                    <span className="block text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                                      {emp.role} {rec ? (
                                        <span className="text-slate-400 font-normal ml-1">
                                          &middot; Attendance: <strong className={hasLowAttendance ? "text-rose-600 font-bold font-mono text-[10px]" : "text-slate-600 font-semibold font-mono text-[10px]"}>{rec.attendance}%</strong>
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-normal italic ml-1">
                                          &middot; Attendance: not set
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Division Cell */}
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-bold text-slate-800">{emp.department}</span>
                                  {emp.team && (
                                    <span className="text-[10px] font-medium text-slate-500">{emp.team}</span>
                                  )}
                                </div>
                              </td>

                              {/* Registry Credentials Cell (Combined Email & ID) */}
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5 group/email">
                                    <span className="text-[11px] text-slate-600">{emp.email}</span>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(emp.email)}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover/email:opacity-100 cursor-pointer"
                                      title="Copy Email"
                                    >
                                      {isEmailCopied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 group/id">
                                    <span className="font-mono text-[10px] text-slate-400">ID: {emp.id}</span>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(emp.id)}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover/id:opacity-100 cursor-pointer"
                                      title="Copy ID"
                                    >
                                      {isIdCopied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Action Items */}
                              <td className="px-6 py-4 text-right pr-6 space-x-1 shrink-0">
                                <button
                                  onClick={() => {
                                    handleOpenEditEmployee(emp);
                                  }}
                                  className="p-2 text-slate-400 hover:bg-white hover:text-slate-700 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Edit Employee"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEmployeeToDelete(emp)}
                                  className="p-2 text-slate-400 hover:bg-white hover:text-rose-600 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-rose-100 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Delete Employee"
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
                                  setRosterTeamFilter("All");
                                }}
                                className="mt-3 text-[10px] font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Clear Filters
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

          {/* TAB CONTENT: COMPARE */}
          {activeTab === "compare" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
                      <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
                    Team Member Comparison
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select two employees to compare their performance metrics for <span className="font-semibold text-slate-700">{selectedMonth}</span>.
                  </p>
                </div>
              </div>

              {/* Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">1</span>
                    First Employee
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={compareEmp1}
                    onChange={(e) => setCompareEmp1(e.target.value)}
                  >
                    <option value="">-- Select Employee --</option>
                    {myEmployees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">2</span>
                    Second Employee
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={compareEmp2}
                    onChange={(e) => setCompareEmp2(e.target.value)}
                  >
                    <option value="">-- Select Employee --</option>
                    {myEmployees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compare Data Display */}
              {(() => {
                if (!compareEmp1 || !compareEmp2) return (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-400">
                      <ArrowLeftRight className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Please select two employees to compare their metrics side-by-side.</p>
                  </div>
                );

                const emp1 = myEmployees.find(e => e.id === compareEmp1);
                const emp2 = myEmployees.find(e => e.id === compareEmp2);
                if (!emp1 || !emp2) return null;

                const perf1 = performance.find(p => p.employeeId === emp1.id && p.month === selectedMonth);
                const perf2 = performance.find(p => p.employeeId === emp2.id && p.month === selectedMonth);

                const maxAttendance = Math.max(perf1?.attendance || 0, perf2?.attendance || 0, 1);
                const maxValue = Math.max(perf1?.deliveredProjectsValue || 0, perf2?.deliveredProjectsValue || 0, 1);
                const maxProjects = Math.max(perf1?.deliveredProjectsAmount || 0, perf2?.deliveredProjectsAmount || 0, 1);
                const maxMeetings = Math.max(perf1?.conductedMeetings || 0, perf2?.conductedMeetings || 0, 1);

                const kudos1 = getEmployeeKudos(emp1.id, emp1.name);
                const kudos2 = getEmployeeKudos(emp2.id, emp2.name);
                const totalKudos1 = (Object.values(kudos1) as number[]).reduce((a, b) => a + b, 0);
                const totalKudos2 = (Object.values(kudos2) as number[]).reduce((a, b) => a + b, 0);
                const maxKudos = Math.max(totalKudos1, totalKudos2, 1);

                const radarData = [
                  {
                    subject: "Attendance",
                    [emp1.name]: Math.round(((perf1?.attendance || 0) / maxAttendance) * 100),
                    [emp2.name]: Math.round(((perf2?.attendance || 0) / maxAttendance) * 100),
                  },
                  {
                    subject: "Delivered Value",
                    [emp1.name]: Math.round(((perf1?.deliveredProjectsValue || 0) / maxValue) * 100),
                    [emp2.name]: Math.round(((perf2?.deliveredProjectsValue || 0) / maxValue) * 100),
                  },
                  {
                    subject: "Projects Delivered",
                    [emp1.name]: Math.round(((perf1?.deliveredProjectsAmount || 0) / maxProjects) * 100),
                    [emp2.name]: Math.round(((perf2?.deliveredProjectsAmount || 0) / maxProjects) * 100),
                  },
                  {
                    subject: "Meetings",
                    [emp1.name]: Math.round(((perf1?.conductedMeetings || 0) / maxMeetings) * 100),
                    [emp2.name]: Math.round(((perf2?.conductedMeetings || 0) / maxMeetings) * 100),
                  },
                  {
                    subject: "Kudos",
                    [emp1.name]: Math.round((totalKudos1 / maxKudos) * 100),
                    [emp2.name]: Math.round((totalKudos2 / maxKudos) * 100),
                  },
                ];

                const activeMetricData = [
                  { label: "Attendance Rate", val1: perf1?.attendance || 0, val2: perf2?.attendance || 0, max: 100, unit: "%", icon: Calendar },
                  { label: "Delivered Value", val1: perf1?.deliveredProjectsValue || 0, val2: perf2?.deliveredProjectsValue || 0, max: maxValue, unit: "", isCurrency: true, icon: DollarSign },
                  { label: "Projects Delivered", val1: perf1?.deliveredProjectsAmount || 0, val2: perf2?.deliveredProjectsAmount || 0, max: maxProjects, unit: " items", icon: Briefcase },
                  { label: "Meetings Conducted", val1: perf1?.conductedMeetings || 0, val2: perf2?.conductedMeetings || 0, max: maxMeetings, unit: " sessions", icon: Users },
                  { label: "Culture Recognition", val1: totalKudos1, val2: totalKudos2, max: maxKudos, unit: " pts", icon: Sparkles }
                ].find(m => m.label === activeCompareMetric) || { label: "Attendance Rate", val1: perf1?.attendance || 0, val2: perf2?.attendance || 0, max: 100, unit: "%", icon: Calendar };

                const activeSum = activeMetricData.val1 + activeMetricData.val2;
                const activeRatio = activeSum > 0 ? (activeMetricData.val1 / activeSum) * 100 : 50;
                // Tilt angle from -60 (fully right) to +60 (fully left)
                const tiltAngle = (activeRatio - 50) * 1.2;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* Left Column: Interactive Gyroscopic Balance Instrument & Metric Selectors (Light Theme) */}
                    <div className="lg:col-span-7 bg-white text-slate-800 border border-slate-200 rounded-3xl p-7 shadow-xs relative overflow-hidden flex flex-col justify-between">
                      {/* Decorative ambient subtle light-mode spotlights */}
                      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                      
                      <div className="relative z-10">
                        {/* Title block */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                          <div>
                            <h4 className="text-xs font-black text-slate-700 flex items-center gap-2 uppercase tracking-widest font-mono">
                              <ArrowLeftRight className="h-4 w-4 text-indigo-500" />
                              Horizon Balance Map
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium font-sans mt-0.5">Dynamic performance parity telemetry</p>
                          </div>
                          
                          <div className="flex items-center gap-3 text-[10px] font-mono">
                            <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              {emp1.name.split(' ')[0]}
                            </span>
                            <span className="text-slate-400">vs</span>
                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {emp2.name.split(' ')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Gyro Instrument Panel */}
                        <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50/60 border border-slate-100 rounded-2xl p-5 mb-6">
                          {/* Left: Gyro Instrument */}
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="relative">
                              <svg viewBox="0 0 200 110" className="w-40 h-20 overflow-visible">
                                <path 
                                  d="M 20 90 A 80 80 0 0 1 180 90" 
                                  fill="none" 
                                  stroke="#e2e8f0" 
                                  strokeWidth="6" 
                                  strokeLinecap="round" 
                                />
                                <path 
                                  d="M 20 90 A 80 80 0 0 1 180 90" 
                                  fill="none" 
                                  stroke="url(#arcGradient)" 
                                  strokeWidth="2" 
                                  strokeDasharray="3 3"
                                />
                                <line x1="100" y1="10" x2="100" y2="20" stroke="#94a3b8" strokeWidth="2" />
                                <g transform={`rotate(${tiltAngle} 100 90)`} className="transition-transform duration-500 ease-out">
                                  <line 
                                    x1="100" 
                                    y1="90" 
                                    x2="100" 
                                    y2="15" 
                                    stroke="url(#needleGlow)" 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round" 
                                  />
                                  <circle cx="100" cy="15" r="5" fill={activeRatio > 52 ? "#2563eb" : activeRatio < 48 ? "#059669" : "#4f46e5"} className="animate-pulse" />
                                </g>
                                <circle cx="100" cy="90" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                                <circle cx="100" cy="90" r="3" fill="#4f46e5" />
                                <defs>
                                  <linearGradient id="needleGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="1" />
                                  </linearGradient>
                                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#cbd5e1" />
                                    <stop offset="100%" stopColor="#10b981" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest mt-1.5 uppercase">Telemetry Dial</span>
                          </div>

                          {/* Right: Detailed active comparison readouts */}
                          <div className="flex-1 w-full space-y-2.5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider font-mono">{activeMetricData.label} focus</span>
                              </div>
                              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-mono">
                                {activeRatio > 50 ? `${activeRatio.toFixed(0)}% Left Bias` : activeRatio < 50 ? `${(100 - activeRatio).toFixed(0)}% Right Bias` : "Equilibrium"}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                              {activeRatio > 52 ? (
                                <> <span className="text-blue-600 font-bold">{emp1.name.split(' ')[0]}</span> leads by <span className="font-extrabold text-blue-600">{(activeRatio - 50).toFixed(0)}%</span> relative margin over <span className="text-slate-500">{emp2.name.split(' ')[0]}</span> in this specific discipline.</>
                              ) : activeRatio < 48 ? (
                                <> <span className="text-emerald-600 font-bold">{emp2.name.split(' ')[0]}</span> leads by <span className="font-extrabold text-emerald-600">{(50 - activeRatio).toFixed(0)}%</span> relative margin over <span className="text-slate-500">{emp1.name.split(' ')[0]}</span> in this specific discipline.</>
                              ) : (
                                <> Both employees operate in pristine, near-perfect symmetric equilibrium (50:50 parity) in this category.</>
                              )}
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">{emp1.name.split(' ')[0]}</span>
                                <span className="text-xs font-black text-blue-600 font-mono">
                                  {activeMetricData.isCurrency ? `$${(activeMetricData.val1).toLocaleString()}` : `${activeMetricData.val1}${activeMetricData.unit}`}
                                </span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">{emp2.name.split(' ')[0]}</span>
                                <span className="text-xs font-black text-emerald-600 font-mono">
                                  {activeMetricData.isCurrency ? `$${(activeMetricData.val2).toLocaleString()}` : `${activeMetricData.val2}${activeMetricData.unit}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Selector Track Pill-Buttons */}
                        <div className="space-y-3">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Select Metric to Deep-Dive Dial:</span>
                          {[
                            { label: "Attendance Rate", val1: perf1?.attendance || 0, val2: perf2?.attendance || 0, max: 100, unit: "%", icon: Calendar },
                            { label: "Delivered Value", val1: perf1?.deliveredProjectsValue || 0, val2: perf2?.deliveredProjectsValue || 0, max: maxValue, unit: "", isCurrency: true, icon: DollarSign },
                            { label: "Projects Delivered", val1: perf1?.deliveredProjectsAmount || 0, val2: perf2?.deliveredProjectsAmount || 0, max: maxProjects, unit: " items", icon: Briefcase },
                            { label: "Meetings Conducted", val1: perf1?.conductedMeetings || 0, val2: perf2?.conductedMeetings || 0, max: maxMeetings, unit: " sessions", icon: Users },
                            { label: "Culture Recognition", val1: totalKudos1, val2: totalKudos2, max: maxKudos, unit: " pts", icon: Sparkles }
                          ].map((metric) => {
                            const sum = metric.val1 + metric.val2;
                            const balanceRatio = sum > 0 ? (metric.val1 / sum) * 100 : 50;
                            const isSelected = activeCompareMetric === metric.label;

                            return (
                              <button
                                key={metric.label}
                                onClick={() => setActiveCompareMetric(metric.label)}
                                className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-indigo-50/50 border-indigo-200/60 shadow-xs text-slate-800"
                                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50/50 hover:border-slate-200"
                                }`}
                              >
                                {/* Active subtle border glow */}
                                {isSelected && (
                                  <div className="absolute top-0 bottom-0 left-0 w-[2.5px] bg-gradient-to-b from-blue-500 to-indigo-500" />
                                )}

                                <div className="flex justify-between items-center w-full mb-1.5 relative z-10">
                                  <span className="text-[11px] font-bold flex items-center gap-2 tracking-wide font-sans">
                                    <metric.icon className={`h-3.5 w-3.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                                    {metric.label}
                                  </span>

                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                    isSelected 
                                      ? "bg-indigo-100/40 border-indigo-200/50 text-indigo-700" 
                                      : "bg-slate-50 border-slate-100 text-slate-600"
                                  }`}>
                                    {metric.label === "Attendance Rate" ? (
                                      `${metric.val1}% vs ${metric.val2}%`
                                    ) : (
                                      `Δ: ${metric.isCurrency ? `$${Math.abs(metric.val1 - metric.val2).toLocaleString()}` : `${Math.abs(metric.val1 - metric.val2)}${metric.unit}`}`
                                    )}
                                  </span>
                                </div>

                                {/* Slider track indicator */}
                                <div className="relative h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 bg-blue-500" 
                                    style={{ width: `${balanceRatio}%` }}
                                  />
                                  <div 
                                    className="absolute right-0 top-0 bottom-0 bg-emerald-500" 
                                    style={{ width: `${100 - balanceRatio}%` }}
                                  />
                                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="relative z-10 pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[9px] text-slate-400 font-mono">
                          * Click on any metric card to dynamically balance-tune the Gyroscopic Telemetry Dial.
                        </p>
                        <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                          Bilateral Dial v3.0
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Visual Radar & Partnership Typology - Takes 5 Cols */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Mini Footprint Radar Chart */}
                      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                Overlap Signature
                              </h4>
                              <p className="text-[10px] text-slate-400 font-medium">Overlapping performance signature (normalized %)</p>
                            </div>
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
                              Radar Matrix
                            </span>
                          </div>

                          {/* Recharts Radar Chart */}
                          <div className="h-48 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                <PolarAngleAxis 
                                  dataKey="subject" 
                                  tick={{ fill: '#475569', fontSize: 9, fontWeight: 600, fontFamily: 'Inter' }} 
                                />
                                <PolarRadiusAxis 
                                  angle={30} 
                                  domain={[0, 100]} 
                                  tick={{ fill: '#94a3b8', fontSize: 7 }} 
                                />
                                <Radar 
                                  name={emp1.name} 
                                  dataKey={emp1.name} 
                                  stroke="#3b82f6" 
                                  fill="#3b82f6" 
                                  fillOpacity={0.12} 
                                  strokeWidth={1.5}
                                />
                                <Radar 
                                  name={emp2.name} 
                                  dataKey={emp2.name} 
                                  stroke="#10b981" 
                                  fill="#10b981" 
                                  fillOpacity={0.12} 
                                  strokeWidth={1.5}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                    fontSize: '10px',
                                    fontFamily: 'Inter',
                                    fontWeight: '500'
                                  }} 
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Glassmorphic Synergy Profile Archetype */}
                      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 shadow-md p-6 bg-white/80 backdrop-blur-md">
                        {/* Glowing backdrop spotlight */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-5">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                              <Activity className="h-3.5 w-3.5 text-indigo-500" />
                              Partnership Synergy
                            </h4>
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                              Match Archetype
                            </span>
                          </div>

                          {/* Synergy Profile Decider & Card Header */}
                          {(() => {
                            const val1 = perf1?.deliveredProjectsValue || 0;
                            const val2 = perf2?.deliveredProjectsValue || 0;
                            const m1 = perf1?.conductedMeetings || 0;
                            const m2 = perf2?.conductedMeetings || 0;
                            
                            let archetypeTitle = "Agile Alliance";
                            let archetypeIcon = "⚡";
                            let archetypeDesc = "Combining disparate core workflows into a versatile, high-tempo tandem.";
                            let tagColor = "text-indigo-600 bg-indigo-50 border-indigo-100";

                            if (val1 > 50000 && val2 > 50000) {
                              archetypeTitle = "Twin Engine Powerhouse";
                              archetypeIcon = "🚀";
                              archetypeDesc = "An elite, double-engine tandem delivering heavy commercial value and high strategic revenue outcomes.";
                              tagColor = "text-amber-700 bg-amber-50 border-amber-100";
                            } else if ((val1 > 50000 && m2 > 8) || (val2 > 50000 && m1 > 8)) {
                              archetypeTitle = "Value & Connection Bridge";
                              archetypeIcon = "🤝";
                              archetypeDesc = "A perfectly balanced pairing of deep financial delivery power coupled with high interpersonal and meeting orchestration.";
                              tagColor = "text-blue-700 bg-blue-50 border-blue-100";
                            } else if (Math.abs(val1 - val2) < 15000 && Math.abs(m1 - m2) <= 3) {
                              archetypeTitle = "Symmetric Peer Tandem";
                              archetypeIcon = "✨";
                              archetypeDesc = "A highly aligned, synchronized duo sharing almost identical operational output velocities and baselines.";
                              tagColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
                            }

                            return (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow-sm">
                                    {archetypeIcon}
                                  </div>
                                  <div>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${tagColor}`}>
                                      {archetypeTitle}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans font-medium">{archetypeDesc}</p>
                                  </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                  {/* Synergy Insight Bullet 1 */}
                                  <div className="flex items-start gap-2.5 text-[11px] text-slate-600">
                                    <span className="text-slate-400 mt-0.5">•</span>
                                    <div>
                                      <span className="font-bold text-slate-800">Commercial Balance: </span>
                                      {val1 > val2 ? (
                                        <><span className="font-semibold text-blue-600">{emp1.name.split(' ')[0]}</span> leads delivered financial impact by <span className="font-bold text-slate-900">${(val1 - val2).toLocaleString()}</span>.</>
                                      ) : val2 > val1 ? (
                                        <><span className="font-semibold text-emerald-600">{emp2.name.split(' ')[0]}</span> leads delivered financial impact by <span className="font-bold text-slate-900">${(val2 - val1).toLocaleString()}</span>.</>
                                      ) : (
                                        <>They display a perfectly balanced, equal commercial return baseline.</>
                                      )}
                                    </div>
                                  </div>

                                  {/* Synergy Insight Bullet 2 */}
                                  <div className="flex items-start gap-2.5 text-[11px] text-slate-600">
                                    <span className="text-slate-400 mt-0.5">•</span>
                                    <div>
                                      <span className="font-bold text-slate-800">Culture Impact: </span>
                                      {totalKudos1 > totalKudos2 ? (
                                        <><span className="font-semibold text-blue-600">{emp1.name.split(' ')[0]}</span> commands {totalKudos1} team accolades, demonstrating high cultural integration.</>
                                      ) : totalKudos2 > totalKudos1 ? (
                                        <><span className="font-semibold text-emerald-600">{emp2.name.split(' ')[0]}</span> commands {totalKudos2} team accolades, demonstrating high cultural integration.</>
                                      ) : (
                                        <>They share identical baseline social recognition weight on the team.</>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Overlap Matching Index Bar */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Co-velocity index</span>
                              <span className="text-[11px] font-extrabold text-indigo-600 font-mono">
                                {(() => {
                                  const match = Math.round(
                                    100 - (
                                      Math.abs((perf1?.attendance || 0) - (perf2?.attendance || 0)) +
                                      (maxProjects > 0 ? Math.abs((perf1?.deliveredProjectsAmount || 0) - (perf2?.deliveredProjectsAmount || 0)) / maxProjects * 100 : 0) +
                                      (maxValue > 0 ? Math.abs((perf1?.deliveredProjectsValue || 0) - (perf2?.deliveredProjectsValue || 0)) / maxValue * 100 : 0) +
                                      (maxMeetings > 0 ? Math.abs((perf1?.conductedMeetings || 0) - (perf2?.conductedMeetings || 0)) / maxMeetings * 100 : 0)
                                    ) / 4
                                  );
                                  return `${Math.max(25, match)}% Overlap Match`;
                                })()}
                              </span>
                            </div>
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                <img src={get3DAvatarUrl(emp1.name)} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                <img src={get3DAvatarUrl(emp2.name)} alt="" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}
      </main>
      </>
      )}

      {activePortal === "leaves" && (
        <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 overflow-y-auto">
          {/* TAB CONTENT: LEAVE MANAGEMENT */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">Leave Balance Engine</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage and track employee leave capacities.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Sick Leave</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">7 <span className="text-sm font-medium text-slate-500">days/yr</span></p>
                  <p className="text-xs text-slate-500 mt-1">For medical emergencies</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Casual Leave</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">7 <span className="text-sm font-medium text-slate-500">days/yr</span></p>
                  <p className="text-xs text-slate-500 mt-1">For personal matters</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Gov & Fest</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">14 <span className="text-sm font-medium text-slate-500">days/yr</span></p>
                  <p className="text-xs text-slate-500 mt-1">Public & cultural holidays</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800">Employee Leave Balances</h3>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                      <span>Total Leave Balance:</span>
                      <span className="text-blue-600">28 days</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="bg-slate-50/70 uppercase text-slate-400 font-mono text-[9px] tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4 text-center">Sick (7)</th>
                        <th className="px-6 py-4 text-center">Casual (7)</th>
                        <th className="px-6 py-4 text-center">Gov/Fest (14)</th>
                        <th className="px-6 py-4 text-center">Total Remaining</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {employees.map(emp => {
                        const leave = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
                        const sickRemain = 7 - leave.sickLeaveUsed;
                        const casRemain = 7 - leave.casualLeaveUsed;
                        const govRemain = 14 - leave.govFestHolidaysUsed;
                        const totalRemain = sickRemain + casRemain + govRemain;
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                  <img src={get3DAvatarUrl(emp.name)} alt={emp.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">{emp.name}</div>
                                  <div className="text-[10px] text-slate-400">{emp.role}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-slate-700">{emp.department}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-mono font-bold ${sickRemain <= 2 ? 'text-rose-600' : 'text-slate-600'}`}>{sickRemain}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-mono font-bold ${casRemain <= 2 ? 'text-amber-600' : 'text-slate-600'}`}>{casRemain}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-mono font-bold ${govRemain <= 4 ? 'text-blue-600' : 'text-slate-600'}`}>{govRemain}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                  <div 
                                    className={`h-full rounded-full ${totalRemain < 10 ? 'bg-rose-500' : totalRemain < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${(totalRemain / 28) * 100}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold text-slate-700 w-6">{totalRemain}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  console.log("Edit", emp);
                                  alert("Manage leaves coming soon!");
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                Manage Leaves
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </main>
      )}

      {activePortal === "employees" && (
        <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">Employee Directory</h2>
            <p className="text-slate-500 mt-2 max-w-md">
              This module is not yet implemented. It will provide a comprehensive list of all employees, their roles, contact information, and hierarchy.
            </p>
          </div>
        </main>
      )}




      {/* MODALS */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingEmployee ? "Edit Employee Profile" : "Add New Employee"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Define corporate record and division mapping.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSaveEmployee} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm transition-all outline-none" 
                    value={employeeFormData.name || ''} 
                    onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})} 
                    placeholder="e.g. Jane Doe" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Corporate Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm transition-all outline-none" 
                    value={employeeFormData.email || ''} 
                    onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})} 
                    placeholder="e.g. jane.doe@company.com" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Corporate Role</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm transition-all outline-none" 
                    value={employeeFormData.role || ''} 
                    onChange={(e) => setEmployeeFormData({...employeeFormData, role: e.target.value})} 
                    placeholder="e.g. Senior Software Engineer" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm transition-all outline-none cursor-pointer" 
                      value={employeeFormData.department || DEPARTMENTS[0]} 
                      onChange={(e) => setEmployeeFormData({...employeeFormData, department: e.target.value})}
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Team Hub</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm transition-all outline-none cursor-pointer" 
                      value={employeeFormData.team || TEAMS[0]} 
                      onChange={(e) => setEmployeeFormData({...employeeFormData, team: e.target.value})}
                    >
                      {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors mt-2 shadow-sm cursor-pointer"
                >
                  {editingEmployee ? "Save Profile Changes" : "Create Profile"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isPerformanceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/40">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-600 animate-pulse" />
                    Log Activity: {selectedPerfEmployee?.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Logging metrics for period: <span className="font-semibold text-indigo-600 font-mono">{selectedMonth}</span></p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsPerformanceModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSavePerformance} className="p-5 space-y-4">
                
                {/* Logging Mode selector: Add to existing vs Overwrite */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Logging Mode</span>
                    <div className="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setEntryMode("overwrite")}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                          entryMode === "overwrite"
                            ? "bg-white text-slate-800 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Overwrite / Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntryMode("add")}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                          entryMode === "add"
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-500 hover:text-indigo-600"
                        }`}
                      >
                        Add to Existing
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {entryMode === "overwrite"
                      ? "Directly replace the logged values. Fetched active data is shown in fields."
                      : "Input new numbers to add them on top of the currently recorded values."}
                  </p>
                </div>

                {/* Display Current Recorded metrics in Add Mode */}
                {entryMode === "add" && existingRecordForSelected && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-xs text-slate-700">
                    <span className="font-semibold text-indigo-700">Currently Recorded for {selectedMonth}:</span>
                    <div className="grid grid-cols-3 gap-2 mt-1.5 font-mono text-[10px] text-slate-600">
                      <div>• Meetings: <span className="font-bold text-slate-800">{existingRecordForSelected.conductedMeetings}</span></div>
                      <div>• Projects: <span className="font-bold text-slate-800">{existingRecordForSelected.deliveredProjectsAmount}</span></div>
                      <div>• Value: <span className="font-bold text-slate-800">${existingRecordForSelected.deliveredProjectsValue.toLocaleString()}</span></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      {entryMode === "add" ? "Attendance Rate (%)" : "Attendance Rate (%)"}
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm font-mono outline-none" 
                      value={perfFormData.attendance} 
                      onChange={(e) => setPerfFormData({...perfFormData, attendance: parseFloat(e.target.value) || 0})} 
                      required
                    />
                    {entryMode === "add" && (
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">Absolute percentage rate</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      {entryMode === "add" ? "Meetings to Add" : "Meetings Conducted"}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm font-mono outline-none" 
                      value={perfFormData.conductedMeetings} 
                      onChange={(e) => setPerfFormData({...perfFormData, conductedMeetings: parseInt(e.target.value) || 0})} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      {entryMode === "add" ? "Projects to Add" : "Projects Shipped"}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm font-mono outline-none" 
                      value={perfFormData.deliveredProjectsAmount} 
                      onChange={(e) => setPerfFormData({...perfFormData, deliveredProjectsAmount: parseInt(e.target.value) || 0})} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      {entryMode === "add" ? "Value to Add ($)" : "Total Shipped Value ($)"}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm font-mono outline-none" 
                      value={perfFormData.deliveredProjectsValue} 
                      onChange={(e) => setPerfFormData({...perfFormData, deliveredProjectsValue: parseInt(e.target.value) || 0})} 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    {entryMode === "add" ? "Additional Remarks (Optional)" : "Manager Remarks (Optional)"}
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm outline-none resize-none h-16 transition-all"
                    value={perfFormData.managerRemarks || ""}
                    onChange={(e) => setPerfFormData({...perfFormData, managerRemarks: e.target.value})}
                    placeholder={
                      entryMode === "add"
                        ? "e.g. Added details for the new product launch..."
                        : "e.g. Exhibited exceptional project leadership and consistency..."
                    }
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors mt-2 shadow-sm cursor-pointer"
                >
                  {entryMode === "add" ? "Add to Monthly Record" : "Save All Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isTargetsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-700" />
                    Set Monthly Targets
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Apply expectations for <span className="font-semibold text-slate-700 font-mono">{selectedMonth}</span></p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsTargetsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSaveTarget} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Min Attendance Expected (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm font-mono outline-none" 
                    value={targetFormData.attendanceMin} 
                    onChange={(e) => setTargetFormData({...targetFormData, attendanceMin: parseFloat(e.target.value) || 0})} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Min Project Value Target ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg text-sm font-mono outline-none" 
                    value={targetFormData.projectValueMin} 
                    onChange={(e) => setTargetFormData({...targetFormData, projectValueMin: parseInt(e.target.value) || 0})} 
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors mt-2 shadow-sm cursor-pointer"
                >
                  Update Period Targets
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
