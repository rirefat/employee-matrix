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
  ArrowUpRight,
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
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
  Brain,
  Bot,
  Menu,
  LayoutDashboard,
  BookOpen,
  ExternalLink,
  ShieldAlert,
  User,
  Paperclip,
  Upload,
  Link as LinkIcon,
  Terminal,
  Database,
  Briefcase,
  CheckSquare,
  Settings,
  Settings2,
  ShieldCheck
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
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Employee, PerformanceRecord, MonthlyReport, MonthlyTarget, LeaveRequest, Manager, DBStatus } from "./types";
import { ReportViewer } from "./components/ReportViewer";
import { DashboardTab } from "./components/DashboardTab";
import { EmployeeCard } from "./components/EmployeeCard";
import { LoginPage } from "./components/LoginPage";
import { MonthPicker } from "./components/MonthPicker";
import { EmployeeDossier } from "./components/EmployeeDossier";
import { ManagerProfile } from "./components/ManagerProfile";
import { GeneralUserDashboard } from "./components/GeneralUserDashboard";
import { GeneralUserLeaves } from "./components/GeneralUserLeaves";
import { RecruitmentPipeline } from "./components/RecruitmentPipeline";
import { AdminDashboard } from "./components/AdminDashboard";
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
  const [activePortal, setActivePortal] = useState<string>("performance");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<"overview" | "performance" | "progression" | "leaves" | "copilot">("overview");
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster" | "compare" | "projects">("profile");

  const [copilotMessages, setCopilotMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [copilotInput, setCopilotInput] = useState("");
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [compareEmp1, setCompareEmp1] = useState<string>("");
  const [compareEmp2, setCompareEmp2] = useState<string>("");
  const [projectEmpId, setProjectEmpId] = useState<string>("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>("All");
  const [selectedDirectoryEmpId, setSelectedDirectoryEmpId] = useState<string>("");
  const [employeeDirectorySearch, setEmployeeDirectorySearch] = useState<string>("");
  const [selectedDirectoryDept, setSelectedDirectoryDept] = useState<string>("All");
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [headerDropdownSearch, setHeaderDropdownSearch] = useState("");
  const [isIncrementModalOpen, setIsIncrementModalOpen] = useState(false);
  const [incrementFormData, setIncrementFormData] = useState({
    newSalary: 60000,
    remarks: "Annual Performance Review",
    date: new Date().toISOString().split("T")[0]
  });
  const [loggedInManager, setLoggedInManager] = useState<Manager | null>(() => {
    try {
      const saved = localStorage.getItem("loggedInManager");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (loggedInManager) {
      localStorage.setItem("loggedInManager", JSON.stringify(loggedInManager));
    } else {
      localStorage.removeItem("loggedInManager");
    }
  }, [loggedInManager]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>((() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })());
  const [behalfEmpId, setBehalfEmpId] = useState("");
  const [behalfType, setBehalfType] = useState<"Sick" | "Casual" | "Gov/Fest">("Casual");
  const [behalfStart, setBehalfStart] = useState("");
  const [behalfEnd, setBehalfEnd] = useState("");
  const [behalfNotes, setBehalfNotes] = useState("");
  const [behalfStatus, setBehalfStatus] = useState<"Approved" | "Pending">("Approved");
  const [isSuggestingNotes, setIsSuggestingNotes] = useState(false);
  const [leaveLedgerSearch, setLeaveLedgerSearch] = useState("");
  const [calendarViewMode, setCalendarViewMode] = useState<"timeline" | "grid">("timeline");
  const [calendarMonth, setCalendarMonth] = useState<string>((() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null);

  const [dbStatus, setDbStatus] = useState<DBStatus | null>(null);

  useEffect(() => {
    const fetchDbStatus = async (retries = 3) => {
      try {
        const res = await fetch("/api/db-status");
        const data = await res.json();
        setDbStatus(data);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchDbStatus(retries - 1), 1000);
        } else {
          console.error("Failed to fetch DB status", err);
        }
      }
    };
    fetchDbStatus();
  }, []);

  const isGeneralUser = loggedInManager?.roleType === 'user';
  const isAdmin = loggedInManager?.roleType === 'admin';
  const isHR = loggedInManager?.role === 'HR Manager' || loggedInManager?.department === 'Human Resources' || isAdmin;

  const currentUserEmployee = useMemo(() => {
    return employees.find(e => e.email === loggedInManager?.email) || null;
  }, [employees, loggedInManager]);

  const myEmployees = useMemo(() => {
    if (loggedInManager?.roleType === 'admin' || loggedInManager?.teams.includes('All Teams')) return employees;
    return employees.filter(emp => loggedInManager?.teams.includes(emp.team));
  }, [employees, loggedInManager]);

  const allPendingRequests = useMemo(() => {
    const list: { employee: Employee; request: LeaveRequest }[] = [];
    myEmployees.forEach(emp => {
      if (emp.leaveRequests) {
        emp.leaveRequests.forEach(lr => {
          if (lr.status === "Pending") {
            list.push({ employee: emp, request: lr });
          }
        });
      }
    });
    return list;
  }, [myEmployees]);

  const allApprovedLeaves = useMemo(() => {
    const list: { employee: Employee; request: LeaveRequest }[] = [];
    myEmployees.forEach(emp => {
      if (emp.leaveRequests) {
        emp.leaveRequests.forEach(lr => {
          if (lr.status === "Approved") {
            list.push({ employee: emp, request: lr });
          }
        });
      }
    });
    return list;
  }, [myEmployees]);
  const filteredDirectoryEmployees = useMemo(() => {
    return myEmployees.filter(emp => {
      const deptMatches = selectedDirectoryDept === "All" || emp.department === selectedDirectoryDept;
      const searchLower = employeeDirectorySearch.toLowerCase();
      const searchMatches = !employeeDirectorySearch ||
        emp.name.toLowerCase().includes(searchLower) ||
        emp.role.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.team.toLowerCase().includes(searchLower) ||
        (emp.phone && emp.phone.toLowerCase().includes(searchLower));
      return deptMatches && searchMatches;
    });
  }, [myEmployees, selectedDirectoryDept, employeeDirectorySearch]);

  const activeDirectoryEmployee = useMemo(() => {
    if (!selectedDirectoryEmpId) {
      return filteredDirectoryEmployees[0] || null;
    }
    return myEmployees.find(e => e.id === selectedDirectoryEmpId) || filteredDirectoryEmployees[0] || null;
  }, [myEmployees, selectedDirectoryEmpId, filteredDirectoryEmployees]);

  useEffect(() => {
    if (activeDirectoryEmployee) {
      setCopilotMessages([
        {
          sender: "ai",
          text: `Hello! I am your **Gemini Talent Success Co-Pilot**. Ask me any question, brainstorm customized training modules, or request specific 1-on-1 tactics or growth opportunities for **${activeDirectoryEmployee.name}**!`
        }
      ]);
    }
  }, [activeDirectoryEmployee]);
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

  // Leave Hover Tooltip State & Handlers
  const [hoveredLeave, setHoveredLeave] = useState<{
    x: number;
    y: number;
    employeeName: string;
    employeeRole: string;
    employeeTeam: string;
    leaveType: string;
    start: string;
    end: string;
    days: number;
    notes: string;
    status: string;
  } | null>(null);

  const handleLeaveHover = (
    e: React.MouseEvent,
    emp: Employee,
    leave: { type: string; start: string; end: string; days: number; notes: string; status: string }
  ) => {
    setHoveredLeave({
      x: e.clientX,
      y: e.clientY,
      employeeName: emp.name,
      employeeRole: emp.role,
      employeeTeam: emp.team,
      leaveType: leave.type,
      start: leave.start,
      end: leave.end,
      days: leave.days,
      notes: leave.notes || "No notes provided.",
      status: leave.status,
    });
  };

  const handleLeaveMove = (e: React.MouseEvent) => {
    if (hoveredLeave) {
      setHoveredLeave(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    }
  };

  const handleLeaveLeave = () => {
    setHoveredLeave(null);
  };

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"corporate" | "personal" | "professional" | "banking">("corporate");
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
    joiningDate: "",
    salary: 55000,
    phone: "",
    emergencyContact: "",
    notes: "",
    leaveBalance: {
      sickLeaveUsed: 0,
      casualLeaveUsed: 0,
      govFestHolidaysUsed: 0
    },
    bloodGroup: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    personalEmail: "",
    currentAddress: "",
    permanentAddress: "",
    highestQualification: "",
    experienceYears: 0,
    nationalId: "",
    taxId: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    probationPeriod: "None",
    workLocation: "Office",
    employmentType: "Full-time",
    resumeName: "",
    resumeUrl: ""
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
    const isAnyModalOpen = isEmployeeModalOpen || isTargetsModalOpen || isPerformanceModalOpen || isDeleteConfirmOpen || isIncrementModalOpen;
    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isEmployeeModalOpen, isTargetsModalOpen, isPerformanceModalOpen, isDeleteConfirmOpen, isIncrementModalOpen]);

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

  const fetchData = async (retries = 3) => {
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

      // Parse query parameters for direct profile/teammate sharing
      const params = new URLSearchParams(window.location.search);
      const qEmpId = params.get("employeeId") || params.get("empId");
      const qPortal = params.get("portal");
      const qTab = params.get("tab");

      if (qPortal === "performance" || qPortal === "leaves" || qPortal === "employees" || qPortal === "profile") {
        setActivePortal(qPortal as any);
      } else if (qEmpId) {
        // Default to performance portal when deep linking an employee
        setActivePortal("performance");
      }

      if (qTab === "profile" || qTab === "team" || qTab === "roster" || qTab === "compare") {
        setActiveTab(qTab as any);
      } else if (qEmpId) {
        // Default to profile tab
        setActiveTab("profile");
      }

      if (emps.length > 0) {
        if (qEmpId && emps.some(e => e.id === qEmpId)) {
          setReportEmployeeId(qEmpId);
          setSelectedDirectoryEmpId(qEmpId);
        } else {
          setReportEmployeeId(emps[0].id);
          setSelectedDirectoryEmpId(emps[0].id);
        }
      }
    } catch (err) {
      if (retries > 0) {
        console.warn("Retrying fetch due to error:", err);
        setTimeout(() => fetchData(retries - 1), 1000);
      } else {
        console.error("Error fetching data:", err);
        showToast("Could not load backend data. Refresh page to try again.", "error");
      }
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveManagerProfile = async (updated: Manager) => {
    try {
      const res = await fetch(`/api/managers/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
      });
      if (!res.ok) {
        throw new Error("Failed to persist updated profile to database");
      }
      const data = await res.json();
      setLoggedInManager(data);
    } catch (err) {
      console.error("Error saving manager profile:", err);
      // Fallback update in state anyway
      setLoggedInManager(updated);
      showToast("Profile updated in memory, but could not be persisted to the database.", "error");
    }
  };

  // --- EMPLOYEE LOGIC ---
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setModalTab("corporate");
    setEmployeeFormData({
      id: "",
      name: "",
      role: "",
      department: DEPARTMENTS[0],
      team: TEAMS[0],
      email: "",
      joiningDate: new Date().toISOString().split("T")[0],
      salary: 55000,
      phone: "",
      emergencyContact: "",
      notes: "",
      leaveBalance: {
        sickLeaveUsed: 0,
        casualLeaveUsed: 0,
        govFestHolidaysUsed: 0
      },
      bloodGroup: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      nationality: "",
      personalEmail: "",
      currentAddress: "",
      permanentAddress: "",
      highestQualification: "",
      experienceYears: 0,
      nationalId: "",
      taxId: "",
      bankName: "",
      bankAccountNumber: "",
      bankIfscCode: "",
      probationPeriod: "None",
      workLocation: "Office",
      employmentType: "Full-time",
      resumeName: "",
      resumeUrl: ""
    });
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    console.log("Edit", emp);
    setEditingEmployee(emp);
    setModalTab("corporate");
    setEmployeeFormData({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      team: emp.team || TEAMS[0],
      email: emp.email,
      joiningDate: emp.joiningDate || new Date().toISOString().split("T")[0],
      salary: emp.salary || 55000,
      phone: emp.phone || "",
      emergencyContact: emp.emergencyContact || "",
      notes: emp.notes || "",
      leaveBalance: emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 },
      bloodGroup: emp.bloodGroup || "",
      dob: emp.dob || "",
      gender: emp.gender || "",
      maritalStatus: emp.maritalStatus || "",
      nationality: emp.nationality || "",
      personalEmail: emp.personalEmail || "",
      currentAddress: emp.currentAddress || "",
      permanentAddress: emp.permanentAddress || "",
      highestQualification: emp.highestQualification || "",
      experienceYears: emp.experienceYears || 0,
      nationalId: emp.nationalId || "",
      taxId: emp.taxId || "",
      bankName: emp.bankName || "",
      bankAccountNumber: emp.bankAccountNumber || "",
      bankIfscCode: emp.bankIfscCode || "",
      probationPeriod: emp.probationPeriod || "None",
      workLocation: emp.workLocation || "Office",
      employmentType: emp.employmentType || "Full-time",
      resumeName: emp.resumeName || "",
      resumeUrl: emp.resumeUrl || ""
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
          if (selectedDirectoryEmpId === editingEmployee.id && employeeFormData.id !== editingEmployee.id) {
            setSelectedDirectoryEmpId(employeeFormData.id);
          }
          if (selectedPerfEmployee && selectedPerfEmployee.id === editingEmployee.id && employeeFormData.id !== editingEmployee.id) {
            setSelectedPerfEmployee({ ...selectedPerfEmployee, id: employeeFormData.id });
          }
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

  const handleSaveIncrement = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(empItem => empItem.id === selectedDirectoryEmpId);
    if (!emp) {
      showToast("No employee selected.", "error");
      return;
    }

    const previousSalary = emp.salary || 55000;
    const newSalary = Number(incrementFormData.newSalary);
    if (!newSalary || newSalary <= 0) {
      showToast("Please enter a valid salary amount.", "error");
      return;
    }

    const newRecord = {
      date: incrementFormData.date,
      previousSalary,
      newSalary,
      remarks: incrementFormData.remarks || "Salary adjustment"
    };

    const updatedHistory = [...(emp.incrementHistory || []), newRecord];

    try {
      const res = await fetch(`/api/employees/${emp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salary: newSalary,
          incrementHistory: updatedHistory
        })
      });
      if (res.ok) {
        showToast(`Logged salary increment for ${emp.name} successfully!`, "success");
        setIsIncrementModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to save salary increment.", "error");
      }
    } catch (err) {
      console.error("Error saving increment:", err);
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

  // --- TEAM LEAVE PORTAL HELPERS ---
  const handleUpdateTeammateLeaveStatus = async (employeeId: string, requestId: string, newStatus: "Approved" | "Rejected") => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const reqs = emp.leaveRequests || [];
    const updatedReqs = reqs.map(lr => {
      if (lr.id === requestId) {
        return { ...lr, status: newStatus };
      }
      return lr;
    });

    // Recalculate leaveBalance if approved
    let updatedBalance = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
    
    if (newStatus === "Approved") {
      const theReq = reqs.find(lr => lr.id === requestId);
      if (theReq) {
        const days = Number(theReq.days) || 1;
        if (theReq.type === "Sick") {
          updatedBalance = { ...updatedBalance, sickLeaveUsed: (updatedBalance.sickLeaveUsed || 0) + days };
        } else if (theReq.type === "Casual") {
          updatedBalance = { ...updatedBalance, casualLeaveUsed: (updatedBalance.casualLeaveUsed || 0) + days };
        } else if (theReq.type === "Gov/Fest") {
          updatedBalance = { ...updatedBalance, govFestHolidaysUsed: (updatedBalance.govFestHolidaysUsed || 0) + days };
        }
      }
    }

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...emp,
          leaveRequests: updatedReqs,
          leaveBalance: updatedBalance
        })
      });
      if (res.ok) {
        showToast(`Leave request marked as ${newStatus}`, "success");
        fetchData();
      } else {
        showToast("Failed to update leave request status.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating leave request.", "error");
    }
  };

  const handleDeleteTeammateLeaveRequest = async (employeeId: string, requestId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    const reqs = emp.leaveRequests || [];
    const theReq = reqs.find(lr => lr.id === requestId);
    const updatedReqs = reqs.filter(lr => lr.id !== requestId);

    // If deleting an already approved request, deduct the days
    let updatedBalance = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
    if (theReq && theReq.status === "Approved") {
      const days = Number(theReq.days) || 1;
      if (theReq.type === "Sick") {
        updatedBalance = { ...updatedBalance, sickLeaveUsed: Math.max(0, (updatedBalance.sickLeaveUsed || 0) - days) };
      } else if (theReq.type === "Casual") {
        updatedBalance = { ...updatedBalance, casualLeaveUsed: Math.max(0, (updatedBalance.casualLeaveUsed || 0) - days) };
      } else if (theReq.type === "Gov/Fest") {
        updatedBalance = { ...updatedBalance, govFestHolidaysUsed: Math.max(0, (updatedBalance.govFestHolidaysUsed || 0) - days) };
      }
    }

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...emp,
          leaveRequests: updatedReqs,
          leaveBalance: updatedBalance
        })
      });
      if (res.ok) {
        showToast("Leave request removed successfully.", "success");
        fetchData();
      } else {
        showToast("Failed to delete leave request.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting leave request.", "error");
    }
  };

  const handleAddTeammateLeaveOnBehalf = async (
    employeeId: string,
    type: "Sick" | "Casual" | "Gov/Fest" | "Unpaid",
    start: string,
    end: string,
    notes: string,
    status: "Approved" | "Pending"
  ) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return false;
    const days = Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)) + 1);

    // Validate 28 days total allowance (skip for Unpaid)
    const currentBalance = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
    const sickRemain = 7 - (currentBalance.sickLeaveUsed || 0);
    const casRemain = 7 - (currentBalance.casualLeaveUsed || 0);
    const govRemain = 14 - (currentBalance.govFestHolidaysUsed || 0);
    const currentRemaining = sickRemain + casRemain + govRemain;

    if (type !== "Unpaid") {
      if (days > currentRemaining) {
        showToast(`Cannot log leave: Employee only has ${currentRemaining} days of leave remaining out of their 28-day annual allowance.`, "error");
        return false;
      }
      
      // Check category limit
      if (type === "Sick" && days > sickRemain) {
        showToast(`Cannot log Sick Leave: Exceeds remaining Sick Leave allowance of ${sickRemain} days.`, "error");
        return false;
      }
      if (type === "Casual" && days > casRemain) {
        showToast(`Cannot log Casual Leave: Exceeds remaining Casual Leave allowance of ${casRemain} days.`, "error");
        return false;
      }
      if (type === "Gov/Fest" && days > govRemain) {
        showToast(`Cannot log Gov/Fest Leave: Exceeds remaining Gov/Fest allowance of ${govRemain} days.`, "error");
        return false;
      }
    }

    const newRequest = {
      id: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      start,
      end,
      days,
      status,
      notes: notes || "Logged by manager"
    };

    const updatedReqs = [newRequest, ...(emp.leaveRequests || [])];
    let updatedBalance = { ...currentBalance };

    if (status === "Approved") {
      if (type === "Sick") {
        updatedBalance.sickLeaveUsed = (updatedBalance.sickLeaveUsed || 0) + days;
      } else if (type === "Casual") {
        updatedBalance.casualLeaveUsed = (updatedBalance.casualLeaveUsed || 0) + days;
      } else if (type === "Gov/Fest") {
        updatedBalance.govFestHolidaysUsed = (updatedBalance.govFestHolidaysUsed || 0) + days;
      }
    }

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...emp,
          leaveRequests: updatedReqs,
          leaveBalance: updatedBalance
        })
      });
      if (res.ok) {
        showToast(`Logged ${days}-day ${type} leave successfully`, "success");
        fetchData();
        return true;
      } else {
        showToast("Failed to log leave record.", "error");
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast("Error adding leave record.", "error");
      return false;
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

  // --- SUGGEST LEAVE REMARKS ---
  const handleSuggestLeaveNotes = async () => {
    if (!behalfEmpId) {
      showToast("Please select a target teammate first", "error");
      return;
    }
    
    setIsSuggestingNotes(true);
    const selectedEmployee = myEmployees.find(emp => emp.id === behalfEmpId);
    const employeeName = selectedEmployee ? selectedEmployee.name : "The employee";

    let days = 1;
    if (behalfStart && behalfEnd) {
      const start = new Date(behalfStart);
      const end = new Date(behalfEnd);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (!isNaN(diffDays)) {
        days = diffDays;
      }
    }

    try {
      const res = await fetch("/api/leave/suggest-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          leaveType: behalfType,
          days
        })
      });

      const data = await res.json();
      if (res.ok && data.suggestion) {
        setBehalfNotes(data.suggestion);
        showToast("Remarks populated successfully!", "success");
      } else {
        showToast(data.error || "Failed to suggest leave remarks.", "error");
      }
    } catch (err) {
      console.error("Error suggesting leave notes:", err);
      showToast("Connection issue. Could not reach AI service.", "error");
    } finally {
      setIsSuggestingNotes(false);
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

  const handleSendCopilotMessage = async (textToSend?: string) => {
    const text = textToSend || copilotInput;
    if (!text.trim() || !activeDirectoryEmployee) return;

    // Append user message
    setCopilotMessages((prev) => [...prev, { sender: "user", text }]);
    setCopilotInput("");
    setIsCopilotLoading(true);

    try {
      const response = await fetch("/api/copilot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: activeDirectoryEmployee.id,
          month: selectedMonth,
          message: text
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCopilotMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
      } else {
        setCopilotMessages((prev) => [
          ...prev,
          { sender: "ai", text: `Sorry, I encountered an error: ${data.error || "Please check your server logs or try again."}` }
        ]);
      }
    } catch (err) {
      console.error("Error communicating with Co-Pilot:", err);
      setCopilotMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I am unable to contact the Gemini server. Please check your internet connection and make sure the server is online." }
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const activeRecord = performance.find(
    p => p.employeeId === reportEmployeeId && p.month === selectedMonth
  );

  const selectedReportEmployeeObj = myEmployees.find(e => e.id === reportEmployeeId);

  const leaveAlerts = useMemo(() => {
    return myEmployees.map(emp => {
      const balance = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
      const used = (balance.sickLeaveUsed || 0) + (balance.casualLeaveUsed || 0) + (balance.govFestHolidaysUsed || 0);
      const totalAllocation = 28;
      const exceedsThreshold = used > (totalAllocation * 0.75); // 21 days (75% of 28)
      return {
        employee: emp,
        used,
        pct: Math.round((used / totalAllocation) * 100),
        exceedsThreshold
      };
    }).filter(item => item.exceedsThreshold);
  }, [myEmployees]);

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
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {/* GLOBAL SIDEBAR BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-45 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* GLOBAL SIDEBAR */}
      <aside className={`w-64 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col z-50 fixed inset-y-0 left-0 lg:relative transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } transition-transform duration-300 ease-in-out`}>
        {/* SIDEBAR HEADER */}
        <div className="h-20 flex items-center px-5 border-b border-slate-100 bg-white relative overflow-hidden shrink-0">
          {/* Ambient subtle light source */}
          <div className="absolute top-0 left-10 w-24 h-24 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 w-full relative z-10">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-50 to-slate-100 flex items-center justify-center border border-slate-200/80 shadow-3xs shrink-0 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Layers className="h-5 w-5 text-indigo-600 group-hover:scale-105 transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900 tracking-widest uppercase font-mono leading-none">
                Matrix<span className="text-indigo-600 font-extrabold">.</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 font-mono">
                Workspace
              </span>
            </div>
          </div>
        </div>
        
        {/* SIDEBAR BODY LINKS */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 relative">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-1 px-2 font-mono">
              Portals
            </div>
              
            {/* LINK 1 */}
            <button
              onClick={() => {
                setActivePortal("performance");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left rounded-[10px] transition-all group relative border py-1 px-2 flex items-center gap-2.5 cursor-pointer ${
                activePortal === "performance" 
                  ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 border-slate-800 overflow-hidden" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:translate-x-1"
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activePortal === "performance" ? "bg-white/10 text-white shadow-inner shadow-white/10 backdrop-blur-sm z-10 border border-white/5" : "bg-slate-50 text-slate-450 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-700"} transition-colors`}>
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold tracking-tight">{isGeneralUser ? "My Performance" : "Dashboard"}</div>
                
              </div>
              {activePortal === "performance" && (
                <>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/30 rounded-full blur-[16px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-violet-500/30 rounded-full blur-[12px] pointer-events-none" />
                  <div className="w-1 h-5 rounded-full bg-indigo-400 absolute left-0 top-1/2 -translate-y-1/2 shadow-md shadow-indigo-500/50 z-10" />
                </>
              )}
            </button>

            {/* LINK 2 */}
            <button
              onClick={() => {
                setActivePortal("leaves");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left rounded-[10px] transition-all group relative border py-1 px-2 flex items-center gap-2.5 cursor-pointer ${
                activePortal === "leaves" 
                  ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 border-slate-800 overflow-hidden" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:translate-x-1"
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activePortal === "leaves" ? "bg-white/10 text-white shadow-inner shadow-white/10 backdrop-blur-sm z-10 border border-white/5" : "bg-slate-50 text-slate-450 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-700"} transition-colors`}>
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold tracking-tight">Leave Planner</div>
                
              </div>
              {activePortal === "leaves" && (
                <>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/30 rounded-full blur-[16px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-violet-500/30 rounded-full blur-[12px] pointer-events-none" />
                  <div className="w-1 h-5 rounded-full bg-indigo-400 absolute left-0 top-1/2 -translate-y-1/2 shadow-md shadow-indigo-500/50 z-10" />
                </>
              )}
            </button>
            
            {/* LINK 3 */}
            {!isGeneralUser && (
              <>
              <button
                onClick={() => {
                  setActivePortal("employees");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left rounded-[10px] transition-all group relative border py-1 px-2 flex items-center gap-2.5 cursor-pointer ${
                  activePortal === "employees" 
                    ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 border-slate-800 overflow-hidden" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:translate-x-1"
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${activePortal === "employees" ? "bg-white/10 text-white shadow-inner shadow-white/10 backdrop-blur-sm z-10 border border-white/5" : "bg-slate-50 text-slate-450 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-700"} transition-colors`}>
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-tight">{loggedInManager?.roleType === 'admin' ? 'Employee Directory' : 'Teammate Directory'}</div>
                  
                </div>
                {activePortal === "employees" && (
                  <>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/30 rounded-full blur-[16px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-violet-500/30 rounded-full blur-[12px] pointer-events-none" />
                  <div className="w-1 h-5 rounded-full bg-indigo-400 absolute left-0 top-1/2 -translate-y-1/2 shadow-md shadow-indigo-500/50 z-10" />
                </>
                )}
              </button>

              {/* LINK: RECRUITMENT */}
              {isHR && (
                <button
                  onClick={() => {
                    setActivePortal("recruitment");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-[10px] transition-all group relative border py-1 px-2 flex items-center gap-2.5 cursor-pointer ${
                    activePortal === "recruitment" 
                      ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 border-slate-800 overflow-hidden" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:translate-x-1"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${activePortal === "recruitment" ? "bg-white/10 text-white shadow-inner shadow-white/10 backdrop-blur-sm z-10 border border-white/5" : "bg-slate-50 text-slate-450 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-700"} transition-colors`}>
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold tracking-tight">Recruitment ATS</div>
                  </div>
                  {activePortal === "recruitment" && (
                    <>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/30 rounded-full blur-[16px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-violet-500/30 rounded-full blur-[12px] pointer-events-none" />
                    <div className="w-1 h-5 rounded-full bg-indigo-400 absolute left-0 top-1/2 -translate-y-1/2 shadow-md shadow-indigo-500/50 z-10" />
                  </>
                  )}
                </button>
              )}
              </>
            )}

            {/* LINK: ADMIN CONTROL */}
            {isAdmin && (
              <button
                onClick={() => {
                  setActivePortal("admin");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left rounded-[10px] transition-all group relative border py-1 px-2 flex items-center gap-2.5 cursor-pointer ${
                  activePortal === "admin" 
                    ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 border-slate-800 overflow-hidden" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:translate-x-1"
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${activePortal === "admin" ? "bg-white/10 text-white shadow-inner shadow-white/10 backdrop-blur-sm z-10 border border-white/5" : "bg-slate-50 text-slate-450 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-700"} transition-colors`}>
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-tight">Admin Control</div>
                </div>
                {activePortal === "admin" && (
                  <>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/30 rounded-full blur-[16px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-500/30 rounded-full blur-[12px] pointer-events-none" />
                  <div className="w-1 h-5 rounded-full bg-blue-400 absolute left-0 top-1/2 -translate-y-1/2 shadow-md shadow-blue-500/50 z-10" />
                </>
                )}
              </button>
            )}

            {/* LINK 4: MY PROFILE */}
            <button
              onClick={() => {
                setActivePortal("profile");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left rounded-[10px] transition-all group relative border py-1 px-2 flex items-center gap-2.5 cursor-pointer ${
                activePortal === "profile" 
                  ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 border-slate-800 overflow-hidden" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:translate-x-1"
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activePortal === "profile" ? "bg-white/10 text-white shadow-inner shadow-white/10 backdrop-blur-sm z-10 border border-white/5" : "bg-slate-50 text-slate-450 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-700"} transition-colors`}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold tracking-tight">My Profile Info</div>
                
              </div>
              {activePortal === "profile" && (
                <>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/30 rounded-full blur-[16px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-violet-500/30 rounded-full blur-[12px] pointer-events-none" />
                  <div className="w-1 h-5 rounded-full bg-indigo-400 absolute left-0 top-1/2 -translate-y-1/2 shadow-md shadow-indigo-500/50 z-10" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-4 shrink-0">
          {/* DOCUMENTATION & LINKS */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono">RESOURCES</span>
              {dbStatus ? (
                <span className={`flex items-center gap-1 text-[8.5px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded-md border ${
                  dbStatus.connectionType === 'mongodb' 
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                    : "text-amber-700 bg-amber-50 border-amber-100"
                }`}>
                  <span className={`h-1 w-1 rounded-full shrink-0 ${dbStatus.connectionType === 'mongodb' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                  {dbStatus.connectionType === 'mongodb' ? 'CLOUD SYNC' : 'LOCAL CACHE'}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[8.5px] font-bold text-slate-500 font-mono tracking-wider bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                  <span className="h-1 w-1 rounded-full bg-slate-400 shrink-0" />
                  CONNECTING...
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              <a 
                href="#docs" 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300 text-[11px] text-slate-600 hover:text-slate-900 transition-all font-medium group shadow-3xs"
              >
                <BookOpen className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span>Docs</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a 
                href="#support" 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300 text-[11px] text-slate-600 hover:text-slate-900 transition-all font-medium group shadow-3xs"
              >
                <HelpCircle className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span>Support</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="pt-2 px-1 text-center border-t border-slate-100">
            <p className="text-[10px] font-mono text-slate-450 font-bold tracking-wider uppercase">
              Matrix Portal &copy; 2026
            </p>
            <p className="text-[9px] font-mono text-slate-500 mt-0.5 tracking-tight">
              Enterprise HR Suite v1.2
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            id="toast-notif" 
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-slate-200/60 bg-white/95 backdrop-blur-xl"
          >
            <div className={`flex items-center justify-center rounded-full ${toast.type === "success" ? "text-emerald-500" : "text-rose-500"}`}>
              {toast.type === "success" ? <CheckCircle className="h-4 w-4 stroke-[2.5]" /> : <AlertCircle className="h-4 w-4 stroke-[2.5]" />}
            </div>
            <span className="text-[13px] font-semibold tracking-wide text-slate-800 pr-2">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Futuristic Header Navigation - Glassmorphic, Modern, Minimal */}
      <div className="relative z-50 w-full px-4 lg:px-8 xl:px-10 pt-4 shrink-0 transition-all duration-300 pointer-events-none">
        <header className="relative w-full h-16 bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.08)] rounded-2xl flex items-center justify-between px-4 lg:px-6 pointer-events-auto">
          {/* Subtle Inner Glow / Light reflection */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-white/20" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative flex items-center gap-4 z-10">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-850 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle Navigation Sidebar"
              title="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                {activePortal === "performance" && (isGeneralUser ? "My Dashboard" : "Performance & KPIs")}
                {activePortal === "leaves" && "Time Off & Leave Calendar"}
                {activePortal === "employees" && (isHR ? "All Employees & Roles" : "Teammates & Roles")}
                {activePortal === "profile" && "Profile & Employment Details"}
                {activePortal === "recruitment" && "Recruitment & ATS"}
                {activePortal === "admin" && "Platform Administration"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Live View
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-3 sm:gap-6 z-10">
            {/* Month selector directly in header */}
            <MonthPicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              align="right"
            />

            {/* Set Monthly Targets Button */}
            {!isGeneralUser && (
              <>
              <button
                onClick={() => setIsTargetsModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-medium transition-all shadow-sm shadow-slate-900/10 cursor-pointer group"
              >
                <TrendingUp className="h-3.5 w-3.5 text-slate-300 group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">Set Targets</span>
              </button>
              </>
            )}

            {/* Profile area */}
            <div className="flex items-center gap-4 relative group ml-2">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePortal("profile")}>
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{loggedInManager.name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{loggedInManager.role}</span>
                </div>
                <div className="relative">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 group-hover:border-slate-300 transition-colors">
                    <img src={loggedInManager.avatarUrl || get3DAvatarUrl(loggedInManager.name)} alt={loggedInManager.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white z-10" />
                </div>
              </div>
              
              {/* Profile Dropdown Menu - Revealed on hover */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 z-50 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActivePortal("profile");
                  }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activePortal === "profile" 
                      ? "bg-slate-900 text-white font-bold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <User className="h-4 w-4 text-slate-500 group-hover:text-slate-600" />
                  My Profile
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => setLoggedInManager(null)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-400" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {activePortal === "performance" && (
        <>
          {isGeneralUser ? (
            <GeneralUserDashboard 
              employee={currentUserEmployee}
              userName={loggedInManager?.name}
              performanceRecord={performance.find(r => r.employeeId === currentUserEmployee?.id && r.month === selectedMonth)}
            />
          ) : (
            <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 flex flex-col gap-8 overflow-y-auto overflow-x-hidden">
              {/* Automated System Alerts for High Leave Consumption */}
          {leaveAlerts.length > 0 && (
            <div className="bg-amber-50/75 border border-amber-200/80 rounded-3xl p-6 relative overflow-hidden shadow-3xs flex flex-col gap-4 animate-fade-in">
              <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-amber-600/5 blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl shrink-0 shadow-4xs">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-950 tracking-tight font-display flex items-center gap-2">
                    System Alert: High Annual Leave Consumption ({leaveAlerts.length})
                  </h3>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed font-medium">
                    The following team members have consumed more than <strong className="font-extrabold text-amber-800">75%</strong> of their annual leave allowance (<strong className="font-extrabold text-amber-800">28 days</strong>). Please monitor their remaining balances.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {leaveAlerts.map(({ employee, used, pct }) => (
                  <div key={employee.id} className="bg-white/90 backdrop-blur-xs border border-amber-200/60 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-4xs hover:border-amber-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img src={get3DAvatarUrl(employee.name)} alt={employee.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate font-display">{employee.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">{employee.role} • {employee.team}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 font-mono">
                        <span>Consumed: {used} / 28 Days</span>
                        <span className="text-amber-700">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-150">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActivePortal("performance");
                          setActiveTab("profile");
                          setReportEmployeeId(employee.id);
                          setSelectedDirectoryEmpId(employee.id);
                          // Scroll smoothly if element exists
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 100);
                        }}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        Profile <ArrowUpRight className="w-3 h-3 text-slate-500" />
                      </button>
                      <button
                        onClick={() => {
                          setActivePortal("leaves");
                          // Filter list using directory or ledger search
                          setLeaveLedgerSearch(employee.name);
                        }}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 rounded-lg text-[11px] font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        Check Calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content tabs selector */}
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1 w-fit border border-slate-200/50">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile" ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Employee Profile & AI Roadmap
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "team" ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Team Trend Dashboard
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "roster" ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Roster
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "compare" ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
                <ArrowLeftRight className="h-3.5 w-3.5" />
              Compare
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "projects" ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
                <Briefcase className="h-3.5 w-3.5" />
              Projects
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
                          <Users className="h-3 w-3 text-slate-500" />
                        )}
                      </div>
                    </div>
                    <select 
                      className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-full pl-10 pr-10 py-2 outline-none transition-all cursor-pointer shadow-xs focus:border-slate-300 focus:ring-4 focus:ring-slate-50"
                      value={reportEmployeeId || ""}
                      onChange={(e) => setReportEmployeeId(e.target.value)}
                    >
                      <option value="" disabled>Select Team Member</option>
                      {myEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none group-hover:text-slate-600 transition-colors" />
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
                              <img src={get3DAvatarUrl(selectedReportEmployeeObj.name)} alt={selectedReportEmployeeObj.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">{selectedReportEmployeeObj.name}</h1>
                              <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="font-medium">Matrix Tier:</span>
                                {activeRecord ? (
                                  activeRecord.attendance >= (currentTarget?.attendanceMin || 95) && activeRecord.deliveredProjectsValue >= effectiveProjectValueMin ? (
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
                                    {activeRecord && overallPerformance !== null ? (
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
                                  
                                  {activeRecord && overallPerformance !== null ? (
                                    <span className="text-xs font-bold font-mono text-slate-800">
                                      {overallPerformance}%
                                    </span>
                                  ) : (
                                    <span className="text-xs text-slate-500 italic">No metrics registered yet</span>
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

                          {/* Action buttons inside Profile Card */}
                          <div className="flex gap-2 w-full md:w-auto shrink-0 relative z-20">
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
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
                            {activeRecord && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
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
                          <div className="text-[10px] text-slate-500 font-medium font-sans mt-0.5">
                            Target: <span className="font-mono font-bold">{(currentTarget?.attendanceMin || 95)}%</span>
                          </div>
                          {activeRecord && (
                            <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5 text-[9px] font-semibold text-slate-500 font-mono">
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
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delivered Value</span>
                            {activeRecord && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
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
                          <div className="text-[10px] text-slate-500 font-medium font-sans mt-0.5">
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
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Projects Shipped</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? activeRecord.deliveredProjectsAmount : "—"}
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-2 truncate bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md inline-block w-max font-mono">
                          {activeRecord ? `+${activeRecord.deliveredProjectsAmount} Deliverables` : "No activity"}
                        </div>
                      </div>

                      {/* Box 4: Meetings Conducted */}
                      <div className="p-4 bg-white/40 border border-white/50 rounded-xl flex flex-col justify-between min-h-[120px] transition-all hover:bg-white/50 hover:shadow-xs">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Meetings Conducted</div>
                          <div className="text-xl font-bold font-mono text-slate-800">
                            {activeRecord ? activeRecord.conductedMeetings : "—"}
                          </div>
                        </div>
                        <div className="text-[10px] text-indigo-700 font-bold mt-2 truncate bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md inline-block w-max font-mono">
                          {activeRecord ? `${activeRecord.conductedMeetings} sessions run` : "No activity"}
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
                              <span className="text-[11px] font-bold text-slate-700 mt-1">{item.label}</span>
                              <span className="text-[11px] font-extrabold font-mono text-slate-500 mt-0.5 bg-slate-100 px-1.5 py-0.2 rounded">
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
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Synergy Wave</span>
                        <span className="text-[11px] font-bold text-slate-800 font-mono">
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
                      <span className="text-[11px] text-slate-500">Month-over-month performance overview</span>
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
                          <div className="h-44 flex items-center justify-center text-xs text-slate-500 italic">
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
                        <span className="text-slate-800 font-bold uppercase text-[11px] tracking-wider ml-1 bg-slate-100 px-2 py-0.5 rounded">
                          {activeRecord && activeRecord.deliveredProjectsAmount >= 2
                            ? `Promotion track for Senior / Lead ${selectedReportEmployeeObj.role}`
                            : `Skill development and technical enrichment`}
                        </span>
                      </span>
                    </div>
                    <button
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] uppercase font-bold rounded-lg transition-all"
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
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registry Engine</span>
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
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Roster Size</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{myEmployees.length} Active Profiles</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3.5">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Query Matches</span>
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
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
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
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">Order By</span>
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
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
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
                            <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
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
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
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
                            <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
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
                    <thead className="bg-slate-50/70 uppercase text-slate-500 font-mono text-[10px] tracking-wider border-b border-slate-100">
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
                                        <span className="text-slate-500 font-normal ml-1">
                                          &middot; Attendance: <strong className={hasLowAttendance ? "text-rose-600 font-bold font-mono text-[11px]" : "text-slate-600 font-semibold font-mono text-[11px]"}>{rec.attendance}%</strong>
                                        </span>
                                      ) : (
                                        <span className="text-slate-500 font-normal italic ml-1">
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
                                    <span className="text-[11px] font-medium text-slate-500">{emp.team}</span>
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
                                      className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 transition-colors opacity-0 group-hover/email:opacity-100 cursor-pointer"
                                      title="Copy Email"
                                    >
                                      {isEmailCopied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 group/id">
                                    <span className="font-mono text-[11px] text-slate-500">ID: {emp.id}</span>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(emp.id)}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 transition-colors opacity-0 group-hover/id:opacity-100 cursor-pointer"
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = `${window.location.origin}${window.location.pathname}?portal=performance&tab=profile&employeeId=${emp.id}`;
                                    navigator.clipboard.writeText(link);
                                    showToast(`Copied ${emp.name}'s performance profile link!`, "success");
                                  }}
                                  className="p-2 text-slate-500 hover:bg-white hover:text-indigo-600 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-indigo-100 transition-all cursor-pointer inline-flex items-center justify-center animate-pulse"
                                  title="Copy Performance Profile Link"
                                >
                                  <LinkIcon className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    handleOpenEditEmployee(emp);
                                  }}
                                  className="p-2 text-slate-500 hover:bg-white hover:text-slate-700 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Edit Employee"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEmployeeToDelete(emp)}
                                  className="p-2 text-slate-500 hover:bg-white hover:text-rose-600 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-rose-100 transition-all cursor-pointer inline-flex items-center justify-center"
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
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 mb-3">
                                <Search className="h-5 w-5" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800">No Database Records Found</h4>
                              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                                No employees matched "{rosterSearchQuery}" or the "{rosterDeptFilter}" division filter. Try adjusting your query.
                              </p>
                              <button
                                onClick={() => {
                                  setRosterSearchQuery("");
                                  setRosterDeptFilter("All");
                                  setRosterTeamFilter("All");
                                }}
                                className="mt-3 text-[11px] font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500">
                      <ArrowLeftRight className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p className="text-xs font-medium">Please select two employees to compare their metrics side-by-side.</p>
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

                // Calculate the Global Synergy Index
                const metricsList = [
                  { val1: perf1?.attendance || 0, val2: perf2?.attendance || 0 },
                  { val1: perf1?.deliveredProjectsValue || 0, val2: perf2?.deliveredProjectsValue || 0 },
                  { val1: perf1?.deliveredProjectsAmount || 0, val2: perf2?.deliveredProjectsAmount || 0 },
                  { val1: perf1?.conductedMeetings || 0, val2: perf2?.conductedMeetings || 0 },
                  { val1: totalKudos1, val2: totalKudos2 }
                ];
                const totalDeviation = metricsList.reduce((acc, curr) => {
                  const sum = curr.val1 + curr.val2;
                  const ratio = sum > 0 ? (curr.val1 / sum) * 100 : 50;
                  return acc + Math.abs(ratio - 50);
                }, 0);
                const avgDeviation = totalDeviation / metricsList.length;
                const synergyScore = Math.max(0, Math.min(100, Math.round(100 - (avgDeviation * 2))));

                // Calculate harmonic resonance wave
                const waveDiff = Math.abs(activeRatio - 50);
                const wavePath = Array.from({ length: 60 }, (_, i) => {
                  const x = (i / 59) * 140;
                  // Amplitude decreases as imbalance increases, creating a flatter or flatter-looking wave
                  const amplitude = Math.max(2, 14 - waveDiff * 0.25);
                  // Frequency increases slightly under imbalance to represent high frequency tension
                  const frequency = 0.12 + (waveDiff * 0.004);
                  // Offset wave slightly
                  const y = 16 + Math.sin(x * frequency) * amplitude;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* Left Column: Interactive Gyroscopic Balance Instrument & Metric Selectors (Light Theme) */}
                    <div className="lg:col-span-7 bg-white text-slate-800 border border-slate-200 rounded-3xl p-7 shadow-xs relative overflow-hidden flex flex-col justify-between">
                      {/* Decorative ambient subtle light-mode spotlights */}
                      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />
                      <div className="relative z-10">
                        {/* Title block */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                          <div>
                            <h4 className="text-xs font-black text-slate-700 flex items-center gap-2 uppercase tracking-widest font-mono">
                              <ArrowLeftRight className="h-4 w-4 text-indigo-500" />
                              Horizon Balance Map
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium font-sans mt-0.5 font-bold uppercase tracking-wider">
                              Dynamic performance parity telemetry
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Synergy Index Badge */}
                            <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-2xl">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Synergy Index</span>
                                <span className="text-xs font-black text-indigo-700 font-mono">{synergyScore}%</span>
                              </div>
                              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                            </div>
                            
                            <div className="flex items-center gap-2.5 text-[11px] font-mono bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-2xl">
                              <span className="flex items-center gap-1 text-blue-600 font-extrabold">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {emp1.name.split(' ')[0]}
                              </span>
                              <span className="text-slate-500 font-light">vs</span>
                              <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {emp2.name.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Gyro Instrument Panel */}
                        <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50/60 border border-slate-100 rounded-2xl p-5 mb-6">
                          {/* Left: Gyro Instrument with dial ticks */}
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
                                
                                {/* Precision Watch Ticks along the arc */}
                                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pct) => {
                                  const angleRad = (180 - (pct * 1.8)) * Math.PI / 180;
                                  const rOuter = 84;
                                  const rInner = 76;
                                  const x1 = 100 + rOuter * Math.cos(angleRad);
                                  const y1 = 90 - rOuter * Math.sin(angleRad);
                                  const x2 = 100 + rInner * Math.cos(angleRad);
                                  const y2 = 90 - rInner * Math.sin(angleRad);
                                  const isMajor = pct % 25 === 0;
                                  return (
                                    <line
                                      key={pct}
                                      x1={x1}
                                      y1={y1}
                                      x2={x2}
                                      y2={y2}
                                      stroke={isMajor ? "#6366f1" : "#cbd5e1"}
                                      strokeWidth={isMajor ? "1.5" : "0.75"}
                                      opacity={isMajor ? "0.8" : "0.5"}
                                    />
                                  );
                                })}

                                <text x="14" y="102" textAnchor="middle" className="text-[7px] font-mono font-bold fill-slate-400">100% L</text>
                                <text x="100" y="5" textAnchor="middle" className="text-[7px] font-mono font-bold fill-indigo-500">PARITY</text>
                                <text x="186" y="102" textAnchor="middle" className="text-[7px] font-mono font-bold fill-slate-400">100% R</text>

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
                            
                            {/* Harmonic Oscilloscope Wave */}
                            <div className="mt-4 bg-slate-950/5 border border-slate-200/50 rounded-lg px-2.5 py-1.5 w-full flex items-center justify-between gap-3 shadow-2xs">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Operational Resonance</span>
                                <span className="text-[10px] font-mono font-extrabold text-slate-700">
                                  {waveDiff < 5 ? "Harmonic Equilibrium" : waveDiff < 15 ? "Resonant Parity" : "Dispersive Skew"}
                                </span>
                              </div>
                              <svg className="w-20 h-6 overflow-visible" viewBox="0 0 140 32">
                                <path
                                  d={wavePath}
                                  fill="none"
                                  stroke="url(#waveGradient)"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <defs>
                                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#10b981" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </div>

                          {/* Right: Detailed active comparison readouts */}
                          <div className="flex-1 w-full space-y-2.5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider font-mono">{activeMetricData.label} focus</span>
                              </div>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-mono">
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
                                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">{emp1.name.split(' ')[0]}</span>
                                <span className="text-xs font-black text-blue-600 font-mono">
                                  {activeMetricData.isCurrency ? `$${(activeMetricData.val1).toLocaleString()}` : `${activeMetricData.val1}${activeMetricData.unit}`}
                                </span>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">{emp2.name.split(' ')[0]}</span>
                                <span className="text-xs font-black text-emerald-600 font-mono">
                                  {activeMetricData.isCurrency ? `$${(activeMetricData.val2).toLocaleString()}` : `${activeMetricData.val2}${activeMetricData.unit}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Selector Track Pill-Buttons */}
                        <div className="space-y-3">
                          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Select Metric to Deep-Dive Dial:</span>
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
                                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-350 relative overflow-visible flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-gradient-to-b from-indigo-50/20 to-indigo-50/50 border-indigo-200/80 shadow-xs text-slate-800"
                                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50/50 hover:border-slate-200"
                                }`}
                              >
                                {/* Active subtle border glow */}
                                {isSelected && (
                                  <div className="absolute top-1 bottom-1 left-0 w-[3px] bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                                )}

                                <div className="flex justify-between items-center w-full mb-2 relative z-10">
                                  <span className="text-[11px] font-bold flex items-center gap-2 tracking-wide font-sans">
                                    <metric.icon className={`h-3.5 w-3.5 ${isSelected ? "text-indigo-600" : "text-slate-500"}`} />
                                    {metric.label}
                                  </span>

                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
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

                                {/* Bilateral Console Fader Track */}
                                <div className="relative h-2 w-full bg-slate-100/80 rounded-full border border-slate-200/40 overflow-visible mt-2">
                                  {/* Parity Center Line Notch */}
                                  <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-slate-300 z-10" />
                                  
                                  {/* Left side bar fill */}
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500/10 to-blue-500 rounded-l-full transition-all duration-300" 
                                    style={{ width: `${balanceRatio}%` }}
                                  />
                                  {/* Right side bar fill */}
                                  <div 
                                    className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-emerald-500/10 to-emerald-500 rounded-r-full transition-all duration-300" 
                                    style={{ width: `${100 - balanceRatio}%` }}
                                  />

                                  {/* Dynamic floating slider handle */}
                                  <div 
                                    className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border shadow-md flex items-center justify-center transition-all duration-300 ${
                                      isSelected 
                                        ? "bg-white border-indigo-500 scale-110" 
                                        : "bg-white border-slate-300 hover:border-slate-400"
                                    }`}
                                    style={{ left: `calc(${balanceRatio}% - 7px)` }}
                                  >
                                    <div className={`h-1.5 w-1.5 rounded-full ${
                                      balanceRatio > 51 ? "bg-blue-500" : balanceRatio < 49 ? "bg-emerald-500" : "bg-indigo-500"
                                    }`} />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="relative z-10 pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-mono">
                          * Click on any metric card to dynamically balance-tune the Gyroscopic Telemetry Dial.
                        </p>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                          Bilateral Dial v3.0
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Visual Radar & Partnership Typology - Takes 5 Cols */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Mini Footprint Radar Chart */}
                      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                Overlap Signature
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">Overlapping performance signature (normalized %)</p>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
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
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                              <Activity className="h-3.5 w-3.5 text-indigo-500" />
                              Partnership Synergy
                            </h4>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
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
                                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${tagColor}`}>
                                      {archetypeTitle}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans font-medium">{archetypeDesc}</p>
                                  </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                  {/* Synergy Insight Bullet 1 */}
                                  <div className="flex items-start gap-2.5 text-[11px] text-slate-600">
                                    <span className="text-slate-500 mt-0.5">•</span>
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
                                    <span className="text-slate-500 mt-0.5">•</span>
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
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Co-velocity index</span>
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

          {/* TAB CONTENT: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Project Portfolio</h3>
                  <p className="text-sm text-slate-500 mt-1">Track deliverables and economic value output.</p>
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Status Filter */}
                  <div className="relative flex-1 sm:flex-none">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Layers className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all appearance-none shadow-sm cursor-pointer"
                      value={projectStatusFilter}
                      onChange={(e) => setProjectStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Planning">Planning</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Clean Selector */}
                  <div className="relative flex-1 sm:flex-none">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all appearance-none shadow-sm cursor-pointer"
                      value={projectEmpId}
                      onChange={(e) => setProjectEmpId(e.target.value)}
                    >
                      <option value="">Select Employee...</option>
                      {myEmployees.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Visualization */}
              {(() => {
                if (!projectEmpId) return (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200/60 border-dashed text-slate-500 mt-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                      <Briefcase className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium">Select an employee to reveal their project portfolio.</p>
                  </div>
                );

                const emp = myEmployees.find(e => e.id === projectEmpId);
                const perf = performance.find(p => p.employeeId === projectEmpId && p.month === selectedMonth);

                if (!emp || !perf) return null;

                const amount = perf.deliveredProjectsAmount || 0;
                const value = perf.deliveredProjectsValue || 0;
                
                // Generate mock projects based on amount
                const mockProjects = Array.from({ length: amount || 3 }).map((_, i) => {
                  const seed = emp.name.charCodeAt(0) + i;
                  const types = ["Platform Engineering", "API Integration", "UI/UX Redesign", "Data Pipeline", "Security Audit", "Infrastructure Setup"];
                  const statuses = ["Completed", "In Progress", "In Review", "Planning"];
                  return {
                    id: i,
                    name: `Project Alpha-${seed}-${i + 1}`,
                    type: types[seed % types.length],
                    status: statuses[i % statuses.length],
                    valueShare: Math.round(value / (amount || 3)) + (i * 1500),
                    progress: Math.min(100, 40 + (seed * 5) + (i * 15))
                  };
                });

                const filteredProjects = mockProjects.filter(p => projectStatusFilter === "All" || p.status === projectStatusFilter);

                const statusCounts = mockProjects.reduce((acc, p) => {
                  acc[p.status] = (acc[p.status] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
                const COLORS: Record<string, string> = {
                  "Completed": "#10b981",
                  "In Progress": "#f59e0b",
                  "In Review": "#3b82f6",
                  "Planning": "#8b5cf6"
                };

                return (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Minimalist Metrics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Metric 1: Volume */}
                      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group">
                        {/* Background dot grid pattern with fade-out mask */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" style={{ maskImage: "radial-gradient(ellipse at top left, black 30%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at top left, black 30%, transparent 70%)" }} />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">Delivery Volume</span>
                            <div className="flex items-baseline gap-3">
                              <span className="text-6xl font-extrabold text-slate-900 tracking-tighter">{amount}</span>
                              <span className="text-slate-500 text-sm font-medium">projects</span>
                            </div>
                          </div>
                          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-600">Active portfolio for {new Date(selectedMonth + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Metric 2: Value */}
                      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                        {/* Abstract Background pattern */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" style={{ maskImage: "radial-gradient(ellipse at bottom right, black 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at bottom right, black 40%, transparent 80%)" }} />
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">Economic Output</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter">${value.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="mt-8 pt-4 border-t border-slate-700/50 flex items-center gap-3">
                            <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">High Yield</span>
                            <span className="text-xs font-medium text-slate-400">Total generated value</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metric 3: Distribution */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Project Statuses</span>
                        <div className="flex-1 min-h-[160px] flex items-center justify-center -ml-4 -mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#slate-300"} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#334155' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-2">
                          {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] || "#slate-300" }} />
                              <span className="text-[10px] font-semibold text-slate-600 truncate" title={entry.name}>{entry.name} ({entry.value})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Minimalist Project List */}
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                          <Layers className="h-4 w-4 text-slate-400" />
                          Detailed Breakdown
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {filteredProjects.length === 0 ? (
                          <div className="text-center py-10 bg-slate-50 border border-slate-200/60 border-dashed rounded-2xl">
                            <p className="text-sm font-medium text-slate-500">No projects match the selected filter.</p>
                          </div>
                        ) : (
                          filteredProjects.map((proj, idx) => {
                            const isHighImpact = proj.valueShare > universalProjectValueTarget;
                            return (
                          <div key={proj.id} className={`group bg-white border ${isHighImpact ? 'border-amber-300 ring-1 ring-amber-100 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'} rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden`}>
                            
                            {isHighImpact && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100/80 to-transparent rounded-bl-full pointer-events-none" />}

                            <div className="flex items-center gap-4 relative z-10">
                              <div className={`w-10 h-10 rounded-full ${isHighImpact ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                                <span className={`text-xs font-bold ${isHighImpact ? 'text-amber-600' : 'text-slate-500'} font-mono`}>0{idx + 1}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{proj.name}</h5>
                                  {isHighImpact && (
                                    <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                                      <Sparkles className="h-2.5 w-2.5" /> High Impact
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{proj.type}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 sm:w-1/2 justify-between sm:justify-end">
                              <div className="flex-1 max-w-[140px] hidden sm:block">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                  <span className="text-xs font-bold text-slate-700">{proj.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      proj.progress === 100 ? "bg-slate-900" : "bg-blue-500"
                                    }`}
                                    style={{ width: `${proj.progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                                <div className="text-right">
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned</span>
                                  <span className="text-sm font-bold text-slate-900 font-mono">${proj.valueShare.toLocaleString()}</span>
                                </div>
                                
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  proj.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" :
                                  proj.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-200/60" :
                                  proj.status === "Planning" ? "bg-slate-50 text-slate-600 border border-slate-200/60" :
                                  "bg-purple-50 text-purple-700 border border-purple-200/60"
                                }`}>
                                  {proj.status}
                                </span>
                              </div>
                            </div>

                          </div>
                        );
                        }))}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}
      </main>
          )}
      </>
      )}

      {activePortal === "leaves" && (() => {
        if (isGeneralUser) {
          return (
            <GeneralUserLeaves 
              employee={currentUserEmployee}
              onAddLeave={handleAddTeammateLeaveOnBehalf}
            />
          );
        }
        
        // Compute statistics
        const totalApprovedDays = myEmployees.reduce((acc, emp) => {
          const balance = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
          return acc + (balance.sickLeaveUsed || 0) + (balance.casualLeaveUsed || 0) + (balance.govFestHolidaysUsed || 0);
        }, 0);

        const averageRemainingBalance = myEmployees.length > 0 
          ? Math.round(myEmployees.reduce((acc, emp) => {
              const balance = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
              const used = (balance.sickLeaveUsed || 0) + (balance.casualLeaveUsed || 0) + (balance.govFestHolidaysUsed || 0);
              return acc + Math.max(0, 28 - used);
            }, 0) / myEmployees.length)
          : 28;

        const filteredLedgerEmployees = myEmployees.filter(emp => {
          const s = leaveLedgerSearch.toLowerCase();
          return !s || emp.name.toLowerCase().includes(s) || emp.role.toLowerCase().includes(s) || emp.team.toLowerCase().includes(s);
        });

        const [yearStr, monthStr] = calendarMonth.split("-");
        const year = parseInt(yearStr);
        const monthIndex = parseInt(monthStr) - 1;
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDayIndex = new Date(year, monthIndex, 1).getDay();

        const getMonthName = (monthValue: string) => {
          const [y, m] = monthValue.split("-");
          const dateObj = new Date(parseInt(y), parseInt(m) - 1, 1);
          return dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        };

        const handlePrevMonth = () => {
          const [yStr, mStr] = calendarMonth.split("-");
          let y = parseInt(yStr);
          let m = parseInt(mStr) - 1;
          if (m === 0) {
            m = 12;
            y -= 1;
          }
          setCalendarMonth(`${y}-${String(m).padStart(2, "0")}`);
          setSelectedCalendarDay(null);
        };

        const handleNextMonth = () => {
          const [yStr, mStr] = calendarMonth.split("-");
          let y = parseInt(yStr);
          let m = parseInt(mStr) + 1;
          if (m === 13) {
            m = 1;
            y += 1;
          }
          setCalendarMonth(`${y}-${String(m).padStart(2, "0")}`);
          setSelectedCalendarDay(null);
        };

        const todayObj = new Date();
        const todayYYYYMM = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}`;
        const isTodayMonth = calendarMonth === todayYYYYMM;
        const todayDay = todayObj.getDate();

        const handleJumpToToday = () => {
          setCalendarMonth(todayYYYYMM);
          setSelectedCalendarDay(`${todayYYYYMM}-${String(todayDay).padStart(2, "0")}`);
          setTimeout(() => {
            const timelineEl = document.getElementById(`timeline-day-col-${todayDay}`);
            if (timelineEl) {
              timelineEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
            const gridEl = document.getElementById(`grid-day-cell-${todayDay}`);
            if (gridEl) {
              gridEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
          }, 120);
        };

        const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const getWeekdayName = (dayNum: number) => {
          const d = new Date(year, monthIndex, dayNum);
          return weekdays[d.getDay()];
        };

        const isWithinRange = (dateKey: string, startStr: string, endStr: string) => {
          const dateNum = parseInt(dateKey.replace(/-/g, ""));
          const startNum = parseInt(startStr.replace(/-/g, ""));
          const endNum = parseInt(endStr.replace(/-/g, ""));
          return dateNum >= startNum && dateNum <= endNum;
        };

        const getLeaveOnDay = (empId: string, dateKey: string) => {
          const emp = employees.find(e => e.id === empId);
          if (!emp || !emp.leaveRequests) return null;
          const approved = emp.leaveRequests.filter(lr => lr.status === "Approved");
          return approved.find(lr => isWithinRange(dateKey, lr.start, lr.end)) || null;
        };

        const overlapDays = (() => {
          const overlaps: Record<number, boolean> = {};
          for (let d = 1; d <= daysInMonth; d++) {
            const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const count = allApprovedLeaves.filter(({ request }) => {
              return isWithinRange(dateKey, request.start, request.end);
            }).length;
            overlaps[d] = count > 1;
          }
          return overlaps;
        })();

        return (
          <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 overflow-y-auto">
            {/* TAB CONTENT: LEAVE MANAGEMENT */}
            <div className="space-y-6">
              
              {/* Header block with glowing gradient */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 relative overflow-hidden shadow-3xs">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest font-mono bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-full">
                    Operations Portal
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight font-display pt-1">
                    Team Leaves & Roster Operations
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    Centrally log, review, and audit leave parameters for your R&D squad. Every teammate starts with an annual allocation of <strong className="text-indigo-600 font-bold">28 days</strong>, grouped by standard compliance classes.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-center shadow-3xs">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Company Cap</span>
                    <span className="block text-lg font-black text-slate-800 font-mono">28 Days</span>
                  </div>
                </div>
              </div>

              {/* Automated System Alerts for High Leave Consumption */}
              {leaveAlerts.length > 0 && (
                <div className="bg-amber-50/75 border border-amber-200/80 rounded-3xl p-6 relative overflow-hidden shadow-3xs flex flex-col gap-4 animate-fade-in">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-amber-600/5 blur-2xl pointer-events-none" />
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl shrink-0 shadow-4xs">
                      <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-950 tracking-tight font-display flex items-center gap-2">
                        System Alert: High Annual Leave Consumption ({leaveAlerts.length})
                      </h3>
                      <p className="text-xs text-amber-700 mt-0.5 leading-relaxed font-medium">
                        The following team members have consumed more than <strong className="font-extrabold text-amber-800">75%</strong> of their annual leave allowance (<strong className="font-extrabold text-amber-800">28 days</strong>). Please monitor their remaining balances.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {leaveAlerts.map(({ employee, used, pct }) => (
                      <div key={employee.id} className="bg-white/90 backdrop-blur-xs border border-amber-200/60 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-4xs hover:border-amber-300 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img src={get3DAvatarUrl(employee.name)} alt={employee.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate font-display">{employee.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono truncate">{employee.role} • {employee.team}</div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 font-mono">
                            <span>Consumed: {used} / 28 Days</span>
                            <span className="text-amber-700">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-150">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-1.5 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setActivePortal("performance");
                              setActiveTab("profile");
                              setReportEmployeeId(employee.id);
                              setSelectedDirectoryEmpId(employee.id);
                              // Scroll smoothly if element exists
                              setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }, 100);
                            }}
                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            Profile <ArrowUpRight className="w-3 h-3 text-slate-500" />
                          </button>
                          <button
                            onClick={() => {
                              // Filter list using directory or ledger search
                              setLeaveLedgerSearch(employee.name);
                            }}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 rounded-lg text-[11px] font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            Filter Calendar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. Analytics Deck */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1 */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4.5 shadow-3xs hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Active Squad</span>
                    <span className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800 font-mono">{myEmployees.length}</span>
                    <span className="text-[11px] text-slate-500 font-bold font-mono">Staff</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4.5 shadow-3xs hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Leaves Approved</span>
                    <span className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-600 font-mono">{totalApprovedDays}</span>
                    <span className="text-[11px] text-slate-500 font-bold font-mono">Days</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4.5 shadow-3xs hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Pending Audits</span>
                    <span className={`p-1.5 rounded-lg border text-xs ${allPendingRequests.length > 0 ? "bg-amber-50 border-amber-200 text-amber-600 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                      <Activity className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-baseline gap-1">
                    <span className={`text-2xl font-black font-mono ${allPendingRequests.length > 0 ? "text-amber-600" : "text-slate-800"}`}>{allPendingRequests.length}</span>
                    <span className="text-[11px] text-slate-500 font-bold font-mono">Pending</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4.5 shadow-3xs hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Avg Balance</span>
                    <span className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                      <Calendar className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-indigo-600 font-mono">{averageRemainingBalance}</span>
                    <span className="text-[11px] text-slate-500 font-bold font-mono">Days Left</span>
                  </div>
                </div>

              </div>

              {/* Leave Policy Classes Rules strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50/50 border border-slate-200/50 p-4 rounded-2xl flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold">CL</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 font-mono">Casual Leave (CL)</span>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Allowance: <strong className="text-slate-600">7 Days / Year</strong>. Ideal for quick personal errands and non-medical affairs.</p>
                  </div>
                </div>
                <div className="bg-slate-50/50 border border-slate-200/50 p-4 rounded-2xl flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold">SL</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 font-mono">Sick Leave (SL)</span>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Allowance: <strong className="text-slate-600">7 Days / Year</strong>. Validated against registered medical audits and emergencies.</p>
                  </div>
                </div>
                <div className="bg-slate-50/50 border border-slate-200/50 p-4 rounded-2xl flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold">GF</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 font-mono">Gov & Festival (GF)</span>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Allowance: <strong className="text-slate-600">14 Days / Year</strong>. Allocated for scheduled cultural breaks and statutory breaks.</p>
                  </div>
                </div>
              </div>

              {/* 2. Operations Split Area */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {loggedInManager?.roleType !== 'admin' && (
                  <div className="lg:col-span-2 bg-white border border-slate-200/60 p-5 rounded-3xl shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-750">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono">Log Teammate Leave</h3>
                      <p className="text-[11px] text-slate-500">Add or register timesheet breaks directly</p>
                    </div>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!behalfEmpId) {
                      showToast("Please select an employee first", "error");
                      return;
                    }
                    if (!behalfStart || !behalfEnd) {
                      showToast("Please enter both starting and ending dates", "error");
                      return;
                    }
                    const success = await handleAddTeammateLeaveOnBehalf(
                      behalfEmpId,
                      behalfType,
                      behalfStart,
                      behalfEnd,
                      behalfNotes,
                      behalfStatus
                    );
                    if (success) {
                      setBehalfStart("");
                      setBehalfEnd("");
                      setBehalfNotes("");
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">1. Target Teammate</label>
                      <select
                        value={behalfEmpId}
                        onChange={(e) => setBehalfEmpId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none font-semibold text-slate-700 cursor-pointer"
                      >
                        <option value="">-- Choose Teammate --</option>
                        {myEmployees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">2. Start Date</label>
                        <input
                          type="date"
                          value={behalfStart}
                          onChange={(e) => setBehalfStart(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none font-semibold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">3. End Date</label>
                        <input
                          type="date"
                          value={behalfEnd}
                          onChange={(e) => setBehalfEnd(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none font-semibold text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">4. Category</label>
                        <select
                          value={behalfType}
                          onChange={(e) => setBehalfType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 focus:border-slate-850 rounded-xl text-xs outline-none font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Casual">Casual (CL)</option>
                          <option value="Sick">Sick (SL)</option>
                          <option value="Gov/Fest">Gov/Festival (GF)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">5. Audit Status</label>
                        <select
                          value={behalfStatus}
                          onChange={(e) => setBehalfStatus(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 focus:border-slate-850 rounded-xl text-xs outline-none font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Approved">Approved (Immediate)</option>
                          <option value="Pending">Pending Audit</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">6. Coverage Remarks / Purpose</label>
                        <button
                          type="button"
                          onClick={handleSuggestLeaveNotes}
                          disabled={isSuggestingNotes}
                          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-bold font-mono transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className={`w-3 h-3 text-blue-500 ${isSuggestingNotes ? "animate-spin text-indigo-500" : ""}`} />
                          {isSuggestingNotes ? "Suggesting..." : "AI Suggest Notes"}
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Purpose or medical verification notes..."
                        value={behalfNotes}
                        onChange={(e) => setBehalfNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none resize-none text-slate-700 text-[11px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Leave Record
                    </button>
                  </form>
                </div>
                )}

                {/* Column Right: Pending Approvals Hub (3 Cols) */}
                <div className={`${loggedInManager?.roleType === 'admin' ? 'lg:col-span-5' : 'lg:col-span-3'} bg-white border border-slate-200/60 p-5 rounded-3xl shadow-3xs space-y-4`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono">Pending Approvals Queue</h3>
                        <p className="text-[11px] text-slate-500">Incoming teammate requests waiting for review</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-amber-105 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                      {allPendingRequests.length} Active
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {allPendingRequests.map(({ employee, request }) => (
                      <div key={request.id} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 space-y-3 shadow-3xs hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shrink-0">
                              <img src={get3DAvatarUrl(employee.name)} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-800 text-[11px]">{employee.name}</div>
                              <div className="text-[10px] text-slate-500 font-medium font-mono">{employee.role}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider font-mono text-indigo-650 bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded">
                            {request.type} ({request.days} Days)
                          </span>
                        </div>

                        <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-[11px] text-slate-600 leading-relaxed italic">
                          "{request.notes || "No special description provided."}"
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
                          <span className="text-slate-500 font-bold font-mono">
                            Span: {request.start} to {request.end}
                          </span>
                          <div className="flex items-center gap-2">
                            {loggedInManager?.roleType !== 'admin' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateTeammateLeaveStatus(employee.id, request.id, "Approved")}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200/50 hover:border-emerald-500 font-bold rounded-lg cursor-pointer transition-all shadow-sm text-[11px] active:scale-95"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateTeammateLeaveStatus(employee.id, request.id, "Rejected")}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white border border-rose-200/50 hover:border-rose-500 font-bold rounded-lg cursor-pointer transition-all shadow-sm text-[11px] active:scale-95"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                                <button
                                  onClick={() => handleDeleteTeammateLeaveRequest(employee.id, request.id)}
                                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer transition-colors shadow-sm ml-1"
                                  title="Delete request record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-500 font-medium italic text-[11px]">
                                Pending {employee.reportingTo || "Manager"} approval
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {allPendingRequests.length === 0 && (
                      <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-2">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">Queue Cleared</span>
                        <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-tight">All teammate leave requests are fully audited. Excellent team scheduling management.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* --- TEAM LEAVE CALENDAR & OVERLAPS VIEW --- */}
              <div id="team-leave-calendar-panel" className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-visible relative transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)]">
                {/* Header */}
                <div className="relative z-30 p-6 border-b border-slate-100/80 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 rounded-t-[32px]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50/60 rounded-2xl text-indigo-600 border border-indigo-100/40 shadow-4xs">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                          Team Leave & Overlap Calendar
                        </h3>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/[0.04] border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] relative overflow-hidden group/live cursor-default hover:bg-indigo-500/[0.08] transition-all duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent -translate-x-full animate-shimmer" />
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] font-mono text-indigo-600 relative z-10">
                            Live Tracker
                          </span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Coordinate absence streams, track coverage overlaps, and avoid capacity bottlenecks</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-start sm:justify-end shrink-0">
                    {/* View Switcher Pill Container */}
                    <div className="flex items-center bg-slate-100/60 p-0.5 rounded-full border border-slate-200/30 h-8 shrink-0">
                      <button
                        type="button"
                        onClick={() => setCalendarViewMode("timeline")}
                        className={`h-full px-3.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                          calendarViewMode === "timeline"
                            ? "bg-white text-slate-900 shadow-4xs border border-slate-200/10 font-black"
                            : "text-slate-500 hover:text-slate-800 font-bold"
                        }`}
                      >
                        <Layers className={`w-3 h-3 transition-transform ${calendarViewMode === "timeline" ? "text-indigo-600 rotate-180" : "text-slate-500"}`} />
                        Timeline
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarViewMode("grid")}
                        className={`h-full px-3.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                          calendarViewMode === "grid"
                            ? "bg-white text-slate-900 shadow-4xs border border-slate-200/10 font-black"
                            : "text-slate-500 hover:text-slate-800 font-bold"
                        }`}
                      >
                        <Calendar className={`w-3 h-3 ${calendarViewMode === "grid" ? "text-indigo-600" : "text-slate-500"}`} />
                        Grid
                      </button>
                    </div>

                    {/* Integrated Date Navigation Group */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleJumpToToday}
                        className="group flex items-center gap-1.5 h-8 px-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-black font-mono text-[11px] uppercase tracking-wider rounded-full border border-slate-200/60 hover:border-indigo-250 transition-all shadow-4xs hover:shadow-3xs cursor-pointer active:scale-95 shrink-0"
                        title="Jump to Today"
                      >
                        <Compass className="w-3.5 h-3.5 stroke-[2.5] text-slate-500 group-hover:text-indigo-500 group-hover:rotate-45 transition-all duration-300" />
                        Today
                      </button>

                      <MonthPicker
                        value={calendarMonth}
                        onChange={(newMonth) => {
                          setCalendarMonth(newMonth);
                          setSelectedCalendarDay(null);
                        }}
                        align="right"
                      />
                    </div>
                  </div>
                </div>

                {/* Body depending on calendarViewMode */}
                {calendarViewMode === "timeline" ? (
                  /* Timeline Row Layout */
                  <div className="p-6 space-y-4">
                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.01)]">
                      <div className="overflow-x-auto overflow-y-auto h-[540px] sleek-scrollbar">
                        <div className="min-w-[850px]">
                          {/* Timeline Header Row */}
                          <div className="flex border-b border-slate-100 bg-slate-50/30 font-mono text-[10px] font-bold tracking-wider text-slate-500 sticky top-0 z-20">
                            {/* Sticky Teammate header */}
                            <div className="w-48 sticky left-0 bg-slate-50/90 backdrop-blur-md border-r border-slate-100 shrink-0 px-4 py-3.5 z-10 flex items-center justify-between text-[11px] font-black text-slate-600">
                              <span>TEAM MEMBER</span>
                            </div>
                            
                            {/* Days header list */}
                            <div className="flex flex-1">
                              {Array.from({ length: daysInMonth }).map((_, i) => {
                                const d = i + 1;
                                const isOverlap = overlapDays[d];
                                const isWeekend = [0, 6].includes(new Date(year, monthIndex, d).getDay());
                                const isTodayCell = isTodayMonth && d === todayDay;
                                return (
                                  <div
                                    key={d}
                                    id={`timeline-day-col-${d}`}
                                    className={`w-9 py-2.5 border-r border-slate-100/60 flex flex-col items-center justify-center shrink-0 relative transition-all ${
                                      isTodayCell ? "bg-indigo-50 border-x border-indigo-200/50 text-indigo-700 font-extrabold shadow-4xs" : ""
                                    } ${
                                      isOverlap ? "bg-rose-500/[0.04] border-r border-rose-200/50" : ""
                                    } ${isWeekend && !isOverlap ? "bg-slate-50/20 text-slate-500" : "text-slate-500"}`}
                                    title={isOverlap ? `Overlap on day ${d}: Multiple approved leaves` : ""}
                                  >
                                    <span className={`text-[7px] uppercase tracking-wider opacity-60 font-black ${isTodayCell ? "text-indigo-650" : ""}`}>{getWeekdayName(d)}</span>
                                    <span className={`text-[11px] font-mono leading-tight mt-0.5 font-bold ${isOverlap ? "text-rose-500 font-black" : isTodayCell ? "text-indigo-700 font-black scale-110" : "text-slate-700"}`}>
                                      {d}
                                    </span>
                                    {isOverlap && (
                                      <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-rose-400 rounded-full animate-ping" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Timeline Data Rows */}
                          <div className="divide-y divide-slate-100">
                            {myEmployees.map(emp => (
                              <div key={emp.id} className="flex hover:bg-slate-50/30 transition-all duration-200">
                                {/* Sticky Profile column */}
                                <div className="w-48 sticky left-0 bg-white/95 backdrop-blur-md border-r border-slate-100 shrink-0 px-4 py-3 z-10 flex items-center gap-2.5 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
                                  <div className="w-8 h-8 rounded-full border border-slate-150 overflow-hidden shrink-0 shadow-3xs ring-2 ring-slate-100">
                                    <img src={get3DAvatarUrl(emp.name)} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="overflow-hidden space-y-0.5">
                                    <div className="font-extrabold text-[11px] text-slate-800 tracking-tight truncate" title={emp.name}>{emp.name}</div>
                                    <div className="text-[10px] text-slate-500 font-medium tracking-tight truncate" title={emp.role}>{emp.role}</div>
                                  </div>
                                </div>

                                {/* Days cells */}
                                <div className="flex flex-1">
                                  {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const d = i + 1;
                                    const isOverlap = overlapDays[d];
                                    const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                                    const isWeekend = [0, 6].includes(new Date(year, monthIndex, d).getDay());
                                    const leave = getLeaveOnDay(emp.id, dateKey);

                                    let cellContent = null;
                                    if (leave) {
                                      const isStart = dateKey === leave.start;
                                      const isEnd = dateKey === leave.end;
                                      const isSingle = isStart && isEnd;

                                      let baseClasses = "h-6 flex items-center justify-center text-[10px] font-black font-mono transition-all cursor-pointer select-none";
                                      let pillStyle = "";
                                      
                                      if (leave.type === "Sick") {
                                        pillStyle = "bg-rose-50/95 text-rose-600 border-y border-rose-200/80 hover:bg-rose-100/85";
                                        if (isSingle) {
                                          pillStyle += " rounded-full mx-1 border shadow-4xs border-rose-300/80";
                                        } else if (isStart) {
                                          pillStyle += " rounded-l-full ml-1.5 border-l border-y border-rose-300/80";
                                        } else if (isEnd) {
                                          pillStyle += " rounded-r-full mr-1.5 border-r border-y border-rose-300/80";
                                        }
                                      } else if (leave.type === "Casual") {
                                        pillStyle = "bg-emerald-50/95 text-emerald-600 border-y border-emerald-200/80 hover:bg-emerald-100/85";
                                        if (isSingle) {
                                          pillStyle += " rounded-full mx-1 border shadow-4xs border-emerald-300/80";
                                        } else if (isStart) {
                                          pillStyle += " rounded-l-full ml-1.5 border-l border-y border-emerald-300/80";
                                        } else if (isEnd) {
                                          pillStyle += " rounded-r-full mr-1.5 border-r border-y border-emerald-300/80";
                                        }
                                      } else {
                                        pillStyle = "bg-violet-50/95 text-violet-650 border-y border-violet-200/80 hover:bg-violet-100/85";
                                        if (isSingle) {
                                          pillStyle += " rounded-full mx-1 border shadow-4xs border-violet-300/80";
                                        } else if (isStart) {
                                          pillStyle += " rounded-l-full ml-1.5 border-l border-y border-violet-300/80";
                                        } else if (isEnd) {
                                          pillStyle += " rounded-r-full mr-1.5 border-r border-y border-violet-300/80";
                                        }
                                      }

                                      const displayChar = (isSingle || isStart) ? leave.type[0] : "";

                                      cellContent = (
                                        <div
                                          onClick={() => {
                                            setSelectedCalendarDay(dateKey);
                                            showToast(`Inspecting day ${d}: ${emp.name}'s ${leave.type} Leave`, "success");
                                          }}
                                          onMouseEnter={(e) => handleLeaveHover(e, emp, leave)}
                                          onMouseMove={handleLeaveMove}
                                          onMouseLeave={handleLeaveLeave}
                                          className={`${baseClasses} ${pillStyle} w-full`}
                                        >
                                          {displayChar}
                                        </div>
                                      );
                                    }

                                    return (
                                      <div
                                        key={d}
                                        className={`w-9 h-11 border-r border-slate-100/70 flex items-center justify-center shrink-0 relative ${
                                          isOverlap ? "bg-rose-500/[0.015]" : ""
                                        } ${isWeekend && !leave ? "bg-slate-50/20" : ""}`}
                                      >
                                        {cellContent}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-semibold">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500/10 shadow-3xs" />
                          <span className="font-mono text-slate-600 text-[11px]">Casual Leave (CL)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-rose-500/10 shadow-3xs" />
                          <span className="font-mono text-slate-600 text-[11px]">Sick Leave (SL)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 border border-violet-500/10 shadow-3xs" />
                          <span className="font-mono text-slate-600 text-[11px]">Gov & Festival (GF)</span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-450 animate-pulse" /> Vertical bands and indicators alert managers about overlap days.
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Standard Month Calendar Grid View with day selection details */
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: The standard Calendar Grid */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Grid Header days of week */}
                      <div className="grid grid-cols-7 text-center font-mono text-[10px] font-black tracking-widest text-slate-500 border-b border-slate-100 pb-3">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>

                      {/* Grid cells */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* 1. Offset empty cells for the first day of month */}
                        {Array.from({ length: firstDayIndex }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="h-20 bg-slate-50/20 rounded-2xl border border-dashed border-slate-200/40" />
                        ))}

                        {/* 2. Days of month */}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                          const d = idx + 1;
                          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                          const isSelected = selectedCalendarDay === dateKey;

                          // Approved leaves on this day
                          const leaves = allApprovedLeaves.filter(({ request }) => {
                            return isWithinRange(dateKey, request.start, request.end);
                          });

                          const isOverlap = leaves.length > 1;
                          const isTodayCell = isTodayMonth && d === todayDay;

                          return (
                            <div
                              key={d}
                              id={`grid-day-cell-${d}`}
                              onClick={() => setSelectedCalendarDay(dateKey)}
                              className={`h-22 p-2.5 border rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                                isSelected
                                  ? "border-slate-800 ring-4 ring-slate-800/5 bg-slate-50/20 shadow-3xs"
                                  : isTodayCell
                                    ? "border-indigo-300 bg-indigo-50/10 hover:border-indigo-400 hover:bg-indigo-50/20 shadow-4xs"
                                    : isOverlap
                                      ? "border-rose-150 bg-rose-50/20 hover:border-rose-300 hover:bg-rose-50/30"
                                      : "border-slate-100 hover:border-slate-300 hover:shadow-3xs bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-mono text-[11px] font-bold ${
                                  isSelected 
                                    ? "text-slate-900" 
                                    : isTodayCell
                                      ? "text-indigo-650 font-black scale-110"
                                      : isOverlap 
                                        ? "text-rose-600 font-extrabold" 
                                        : "text-slate-500"
                                }`}>
                                  {d}
                                </span>

                                {isTodayCell && (
                                  <span className="text-[7px] font-black uppercase tracking-widest bg-indigo-50 border border-indigo-150 text-indigo-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                                    Today
                                  </span>
                                )}

                                {isOverlap && !isTodayCell && (
                                  <span className="text-[7px] font-extrabold uppercase tracking-widest bg-rose-50 border border-rose-100/80 text-rose-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    <AlertTriangle className="w-2.5 h-2.5 stroke-[2.5]" /> Overlap
                                  </span>
                                )}
                              </div>

                              {/* Tiny visual tags inside grid cells */}
                              <div className="space-y-1 overflow-hidden mt-1.5 flex-1 max-h-12 flex flex-col justify-end">
                                {leaves.slice(0, 2).map(({ employee, request }) => {
                                  let typeColor = "bg-violet-400";
                                  let typeBg = "bg-violet-50/80 border-violet-100";
                                  let typeText = "text-violet-650";
                                  if (request.type === "Sick") {
                                    typeColor = "bg-rose-400";
                                    typeBg = "bg-rose-50/80 border-rose-100";
                                    typeText = "text-rose-650";
                                  } else if (request.type === "Casual") {
                                    typeColor = "bg-emerald-400";
                                    typeBg = "bg-emerald-50/80 border-emerald-100";
                                    typeText = "text-emerald-650";
                                  }

                                  return (
                                    <div
                                      key={`${employee.id}-${request.id}`}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        handleLeaveHover(e, employee, request);
                                      }}
                                      onMouseMove={handleLeaveMove}
                                      onMouseLeave={handleLeaveLeave}
                                      className={`flex items-center gap-1 border rounded-lg px-1.5 py-0.5 text-[9px] font-bold ${typeBg} ${typeText} truncate shadow-4xs hover:scale-[1.03] transition-transform`}
                                    >
                                      <div className={`w-1 h-1 rounded-full shrink-0 ${typeColor}`} />
                                      <span className="truncate">{employee.name.split(" ")[0]}</span>
                                    </div>
                                  );
                                })}

                                {leaves.length > 2 && (
                                  <div className="text-[7px] font-mono font-bold text-slate-500 text-right pr-0.5">
                                    +{leaves.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right 1 Col: Day Inspector Panel */}
                    <div className="bg-slate-50/40 border border-slate-100 p-5 rounded-3xl flex flex-col justify-between space-y-4">
                      {selectedCalendarDay ? (() => {
                        const [y, m, d] = selectedCalendarDay.split("-");
                        const dNum = parseInt(d);
                        const weekdayStr = new Date(parseInt(y), parseInt(m) - 1, dNum).toLocaleDateString("en-US", { weekday: "long" });
                        const fullDateFormatted = `${weekdayStr}, ${getMonthName(selectedCalendarDay).split(" ")[0]} ${dNum}, ${y}`;
                        
                        const leavesOnThisDay = allApprovedLeaves.filter(({ request }) => {
                          return isWithinRange(selectedCalendarDay, request.start, request.end);
                        });

                        const isOverlap = leavesOnThisDay.length > 1;

                        return (
                          <div className="space-y-4 h-full flex flex-col">
                            <div>
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Selected Calendar Audit</span>
                              <h4 className="font-black text-slate-800 text-[13px] tracking-tight pt-0.5">{fullDateFormatted}</h4>
                            </div>

                            {isOverlap && (
                              <div className="bg-rose-50/80 border border-rose-150 rounded-2xl p-3.5 flex gap-2.5 items-start">
                                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5 shadow-4xs">
                                  <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="block text-[11px] font-black text-rose-800 uppercase tracking-wider font-mono leading-none">Roster Conflict Alert</span>
                                  <p className="text-[11px] text-rose-700 leading-normal font-medium">
                                    There are <strong className="font-extrabold">{leavesOnThisDay.length} team members</strong> away simultaneously. Ensure proper backup coverage.
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[350px] pr-1">
                              {leavesOnThisDay.map(({ employee, request }) => {
                                let badgeColor = "bg-violet-50/80 border-violet-100 text-violet-750";
                                let dotColor = "bg-violet-400";
                                if (request.type === "Sick") {
                                  badgeColor = "bg-rose-50/80 border-rose-100 text-rose-750";
                                  dotColor = "bg-rose-400";
                                } else if (request.type === "Casual") {
                                  badgeColor = "bg-emerald-50/80 border-emerald-100 text-emerald-750";
                                  dotColor = "bg-emerald-400";
                                }

                                return (
                                  <div key={request.id} className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-3 hover:border-slate-200 transition-colors duration-300">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full border border-slate-150 overflow-hidden shrink-0 ring-2 ring-slate-50">
                                          <img src={get3DAvatarUrl(employee.name)} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <div className="font-bold text-[11px] text-slate-800 leading-none">{employee.name}</div>
                                          <div className="text-[9px] text-slate-500 font-semibold font-mono mt-0.5 uppercase tracking-wide">{employee.role}</div>
                                        </div>
                                      </div>
                                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest font-mono flex items-center gap-1 ${badgeColor}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                        {request.type}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl italic">
                                      "{request.notes || "Standard annual leave breakout."}"
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-medium pt-0.5">
                                      <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        {request.start} to {request.end}
                                      </span>
                                      <span className="font-black text-slate-600 bg-slate-100/80 px-1.5 py-0.5 rounded-md">{request.days} {request.days === 1 ? "day" : "days"} used</span>
                                    </div>
                                  </div>
                                );
                              })}

                              {leavesOnThisDay.length === 0 && (
                                <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white border border-slate-100 rounded-2xl shadow-4xs">
                                  <div className="w-9 h-9 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mb-2.5">
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                  </div>
                                  <span className="block text-[11px] font-black text-slate-600 uppercase tracking-widest font-mono">Full Teammate Presence</span>
                                  <p className="text-[10px] text-slate-450 max-w-[180px] mt-1 leading-normal">Every squad member is on deck today. No scheduled timesheet absences.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
                          <div className="w-11 h-11 bg-indigo-50/60 border border-indigo-100/60 rounded-2xl flex items-center justify-center text-indigo-500 mb-3 shadow-4xs">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <span className="block text-[11px] font-black text-slate-600 uppercase tracking-widest font-mono">Select Active Calendar Day</span>
                          <p className="text-[11px] text-slate-500 max-w-xs mt-1.5 leading-relaxed font-medium">
                            Pick any colored day inside the calendar grid to audit individual teammate leave reasons, coverages, and active overlap statistics.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Master Ledger Table */}
              <div className="bg-white border border-slate-200/60 rounded-3xl shadow-3xs overflow-hidden">
                <div className="p-6 border-b border-slate-100/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100">
                        <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      </span>
                      <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest font-mono">
                        Team Leave Balances Ledger
                      </h3>
                    </div>
                    
                    {/* Visual Category Legend */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono mt-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-100/50 inline-block" />
                        Sick Leave Focus
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-100/50 inline-block" />
                        Casual Leave Focus
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-indigo-100/50 inline-block" />
                        Gov / Fest Focus
                      </span>
                      <span className="hidden sm:inline text-slate-200">|</span>
                      <span className="text-slate-500 font-semibold normal-case">
                        Annual Limit Cap: <span className="text-slate-800 font-black font-mono">28 Days</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                    <div className="relative w-full md:w-60 group">
                      <Search className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search teammate..."
                        value={leaveLedgerSearch}
                        onChange={(e) => setLeaveLedgerSearch(e.target.value)}
                        className="pl-9 pr-4 h-8.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100/40 rounded-full text-xs outline-none w-full font-bold text-slate-750 transition-all placeholder-slate-400/80 shadow-4xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto sleek-scrollbar">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="bg-slate-50/25 uppercase text-slate-450 font-bold font-mono text-[8.5px] tracking-widest border-b border-slate-100/80">
                      <tr>
                        <th className="px-6 py-4">Teammate Profile</th>
                        <th className="px-6 py-4 text-center">Sick Used <span className="opacity-60">(7)</span></th>
                        <th className="px-6 py-4 text-center">Casual Used <span className="opacity-60">(7)</span></th>
                        <th className="px-6 py-4 text-center">Gov/Fest <span className="opacity-60">(14)</span></th>
                        <th className="px-6 py-4 text-center">Total Used</th>
                        <th className="px-6 py-4 text-center">Remaining Balance</th>
                        <th className="px-6 py-4 text-right">Wellness Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {filteredLedgerEmployees.map(emp => {
                        const leave = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
                        const sickUsed = leave.sickLeaveUsed || 0;
                        const casUsed = leave.casualLeaveUsed || 0;
                        const govUsed = leave.govFestHolidaysUsed || 0;
                        
                        const totalUsed = sickUsed + casUsed + govUsed;
                        const totalRemain = Math.max(0, 28 - totalUsed);

                        const isLowBalance = totalRemain <= 5;

                        // Calculate primary leave category used
                        let primaryCategory: "Sick" | "Casual" | "Gov/Fest" | "None" = "None";
                        if (sickUsed > 0 || casUsed > 0 || govUsed > 0) {
                          const maxVal = Math.max(sickUsed, casUsed, govUsed);
                          if (maxVal === sickUsed) {
                            primaryCategory = "Sick";
                          } else if (maxVal === casUsed) {
                            primaryCategory = "Casual";
                          } else {
                            primaryCategory = "Gov/Fest";
                          }
                        }

                        let rowBgClass = "hover:bg-slate-50/40";
                        if (primaryCategory === "Sick") {
                          rowBgClass = "bg-rose-50/[0.02] hover:bg-rose-50/[0.05]";
                        } else if (primaryCategory === "Casual") {
                          rowBgClass = "bg-amber-50/[0.02] hover:bg-amber-50/[0.05]";
                        } else if (primaryCategory === "Gov/Fest") {
                          rowBgClass = "bg-indigo-50/[0.02] hover:bg-indigo-50/[0.05]";
                        }

                        return (
                          <tr key={emp.id} className={`${rowBgClass} transition-all duration-200`}>
                            <td className="px-6 py-4 relative">
                              {/* Premium Left Floating Indicator */}
                              {primaryCategory === "Sick" && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-rose-500" />
                              )}
                              {primaryCategory === "Casual" && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-amber-500" />
                              )}
                              {primaryCategory === "Gov/Fest" && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-500" />
                              )}

                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-150 overflow-hidden shrink-0 shadow-4xs transition-transform hover:scale-105 duration-350">
                                  <img src={get3DAvatarUrl(emp.name)} alt={emp.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 text-[12.5px] tracking-tight">{emp.name}</div>
                                  <div className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    Hub: {emp.team || "Nexus"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex items-center justify-center">
                                <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-full ${
                                  sickUsed >= 5 
                                    ? "bg-rose-50 text-rose-600 border border-rose-100 shadow-4xs" 
                                    : sickUsed > 0
                                      ? "bg-slate-50 text-slate-700 border border-slate-200/50"
                                      : "bg-slate-50/40 text-slate-500 border border-slate-200/20 font-semibold"
                                }`}>
                                  {sickUsed} <span className="text-[10px] opacity-50 font-bold font-sans">/ 7</span>
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex items-center justify-center">
                                <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-full ${
                                  casUsed >= 5 
                                    ? "bg-amber-50 text-amber-600 border border-amber-100 shadow-4xs" 
                                    : casUsed > 0
                                      ? "bg-slate-50 text-slate-700 border border-slate-200/50"
                                      : "bg-slate-50/40 text-slate-500 border border-slate-200/20 font-semibold"
                                }`}>
                                  {casUsed} <span className="text-[10px] opacity-50 font-bold font-sans">/ 7</span>
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex items-center justify-center">
                                <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-full ${
                                  govUsed >= 10 
                                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-4xs" 
                                    : govUsed > 0
                                      ? "bg-slate-50 text-slate-700 border border-slate-200/50"
                                      : "bg-slate-50/40 text-slate-500 border border-slate-200/20 font-semibold"
                                }`}>
                                  {govUsed} <span className="text-[10px] opacity-50 font-bold font-sans">/ 14</span>
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex items-center justify-center">
                                <span className="font-mono text-xs font-black text-slate-800 bg-slate-100/50 border border-slate-200/30 px-3 py-1 rounded-full shadow-4xs">
                                  {totalUsed} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-0.5 font-sans">days</span>
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <div className="hidden sm:block w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
                                  <div 
                                    className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ease-out ${
                                      totalRemain <= 5
                                        ? "bg-gradient-to-r from-rose-500 to-rose-600 shadow-4xs"
                                        : totalRemain <= 12
                                          ? "bg-gradient-to-r from-amber-400 to-amber-500 shadow-4xs"
                                          : "bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-4xs"
                                    }`}
                                    style={{ width: `${(totalRemain / 28) * 100}%` }}
                                  />
                                </div>
                                <span className={`font-mono text-[11px] font-black tracking-tight w-16 text-left shrink-0 ${
                                  isLowBalance ? "text-rose-600 animate-pulse font-black" : "text-slate-700"
                                }`}>
                                  {totalRemain} d left
                                </span>
                              </div>
                            </td>

                             <td className="px-6 py-4 text-right">
                               <div className="flex flex-col items-end gap-1 select-none">
                                 {(() => {
                                   let statusLabel = "Optimal Pace";
                                   let statusSub = "Healthy Balance";
                                   let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                                   let dotColor = "bg-emerald-500";
                                   let pingColor = "bg-emerald-400";
                                   let IconComponent = Activity;

                                   if (totalUsed <= 3) {
                                     statusLabel = "Needs Recharge";
                                     statusSub = "High Burnout Risk";
                                     badgeColor = "bg-rose-50 text-rose-700 border-rose-200/50";
                                     dotColor = "bg-rose-500";
                                     pingColor = "bg-rose-400";
                                     IconComponent = Brain;
                                   } else if (totalUsed > 12 && totalUsed <= 22) {
                                     statusLabel = "Fully Recharged";
                                     statusSub = "Regular Time-off";
                                     badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200/50";
                                     dotColor = "bg-indigo-500";
                                     pingColor = "bg-indigo-400";
                                     IconComponent = Sparkles;
                                   } else if (totalUsed > 22) {
                                     statusLabel = "Max Leisure";
                                     statusSub = "Approaching Cap";
                                     badgeColor = "bg-violet-50 text-violet-700 border-violet-200/50";
                                     dotColor = "bg-violet-500";
                                     pingColor = "bg-violet-400";
                                     IconComponent = Award;
                                   }

                                   return (
                                     <>
                                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9.5px] font-black font-mono tracking-wider uppercase shadow-4xs ${badgeColor}`}>
                                         <IconComponent className="w-3.5 h-3.5" />
                                         <span className="relative flex h-1.5 w-1.5">
                                           <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingColor}`}></span>
                                           <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`}></span>
                                         </span>
                                         {statusLabel}
                                       </span>
                                       <div className="text-[8.5px] text-slate-500 font-bold font-mono tracking-wider uppercase mt-0.5">
                                         {statusSub}
                                       </div>
                                     </>
                                   );
                                 })()}
                               </div>
                             </td>
                          </tr>
                        );
                      })}

                      {filteredLedgerEmployees.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500 italic text-xs bg-slate-50/20">
                            No matching teammates found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </main>
        );
      })()}

      {activePortal === "recruitment" && <RecruitmentPipeline />}
      
      {activePortal === "admin" && loggedInManager && (
        <AdminDashboard loggedInManager={loggedInManager} employees={employees} setEmployees={setEmployees} />
      )}
      
      {activePortal === "employees" && (
        <EmployeeDossier
          activeDirectoryEmployee={activeDirectoryEmployee}
          myEmployees={myEmployees}
          setSelectedDirectoryEmpId={setSelectedDirectoryEmpId}
          handleOpenAddEmployee={handleOpenAddEmployee}
          handleOpenEditEmployee={handleOpenEditEmployee}
          handleDeleteEmployeeClick={handleDeleteEmployeeClick}
          setIsIncrementModalOpen={setIsIncrementModalOpen}
          setIncrementFormData={setIncrementFormData}
          performance={performance}
          selectedMonth={selectedMonth}
          copilotInput={copilotInput}
          setCopilotInput={setCopilotInput}
          isCopilotLoading={isCopilotLoading}
          copilotMessages={copilotMessages}
          setCopilotMessages={setCopilotMessages}
          handleSendCopilotMessage={handleSendCopilotMessage}
          showToast={showToast}
          onRefreshEmployees={fetchData}
        />
      )}

      {activePortal === "profile" && loggedInManager && (
        <ManagerProfile
          manager={loggedInManager}
          onSave={handleSaveManagerProfile}
          showToast={showToast}
        />
      )}


      {/* MODALS */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingEmployee ? "Edit Employee Profile" : "Add New Employee"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage comprehensive corporate records, personal background, and HR compliance parameters.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)} 
                  className="text-slate-500 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/30 px-5 pt-2 gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setModalTab("corporate")}
                  className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    modalTab === "corporate"
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  1. Corporate Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("personal")}
                  className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    modalTab === "personal"
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  2. Personal & Health
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("professional")}
                  className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    modalTab === "professional"
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  3. Background & ID
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("banking")}
                  className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    modalTab === "banking"
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  4. Banking & Addresses
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="flex flex-col overflow-hidden max-h-[85vh]">
                <div className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[55vh]">
                  
                  {/* TAB 1: CORPORATE */}
                  {modalTab === "corporate" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Employee UID / ID *</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono font-medium" 
                            value={employeeFormData.id || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, id: e.target.value})} 
                            placeholder="e.g. emp-100" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.name || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})} 
                            placeholder="e.g. Jane Doe" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Corporate Email *</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.email || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})} 
                            placeholder="e.g. jane.doe@company.com" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Corporate Role *</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.role || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, role: e.target.value})} 
                            placeholder="e.g. Senior Developer" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Joining Date *</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.joiningDate || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, joiningDate: e.target.value})} 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Department</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.department || DEPARTMENTS[0]} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, department: e.target.value})}
                          >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Team Hub</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.team || TEAMS[0]} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, team: e.target.value})}
                          >
                            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Base Salary ($ / year) *</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.salary || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, salary: parseFloat(e.target.value) || 0})} 
                            placeholder="e.g. 75000" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Employment Type</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.employmentType || "Full-time"} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, employmentType: e.target.value})}
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Intern">Intern</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Work Location</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.workLocation || "Office"} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, workLocation: e.target.value})}
                          >
                            <option value="Office">Office / HQ</option>
                            <option value="Remote">Fully Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Probation Period</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.probationPeriod || "None"} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, probationPeriod: e.target.value})}
                          >
                            <option value="None">None (Confirmed)</option>
                            <option value="3 Months">3 Months</option>
                            <option value="6 Months">6 Months</option>
                            <option value="1 Year">1 Year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PERSONAL & HEALTH */}
                  {modalTab === "personal" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Mobile Phone</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.phone || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, phone: e.target.value})} 
                            placeholder="e.g. +1 (555) 019-2834" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Personal Email</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.personalEmail || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, personalEmail: e.target.value})} 
                            placeholder="e.g. jane.personal@gmail.com" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Date of Birth</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.dob || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, dob: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Blood Group</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer font-mono" 
                            value={employeeFormData.bloodGroup || ""} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, bloodGroup: e.target.value})}
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Gender</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.gender || ""} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, gender: e.target.value})}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Marital Status</label>
                          <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none cursor-pointer" 
                            value={employeeFormData.maritalStatus || ""} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, maritalStatus: e.target.value})}
                          >
                            <option value="">Select Marital Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Nationality</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.nationality || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, nationality: e.target.value})} 
                            placeholder="e.g. Bangladeshi" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Emergency Contact (Name, Phone & Relation)</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.emergencyContact || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, emergencyContact: e.target.value})} 
                            placeholder="e.g. Mary Doe (Spouse) - +1 (555) 019-9999" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: BACKGROUND & ID */}
                  {modalTab === "professional" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Highest Academic Qualification</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.highestQualification || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, highestQualification: e.target.value})} 
                            placeholder="e.g. B.Sc. in Computer Science" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Total Experience (Years)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.experienceYears || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, experienceYears: parseInt(e.target.value) || 0})} 
                            placeholder="e.g. 5" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700">National ID / Passport Number</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.nationalId || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, nationalId: e.target.value})} 
                            placeholder="e.g. NID-483920194 or Passport No." 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700">Tax / PAN Identification ID</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.taxId || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, taxId: e.target.value})} 
                            placeholder="e.g. TAX-3829103" 
                          />
                        </div>
                      </div>

                      {/* Resume / CV Section */}
                      <div className="border-t border-slate-100 pt-4 mt-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                          Employee Resume / CV Attachment
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Drag and Drop Upload Zone */}
                          <div 
                            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                              employeeFormData.resumeName 
                                ? "border-emerald-300 bg-emerald-50/20" 
                                : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 bg-slate-50/20"
                            }`}
                            onClick={() => {
                              const fileInput = document.getElementById("resume-file-picker");
                              if (fileInput) (fileInput as HTMLInputElement).click();
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add("border-indigo-400", "bg-indigo-50/10");
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove("border-indigo-400", "bg-indigo-50/10");
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove("border-indigo-400", "bg-indigo-50/10");
                              const files = e.dataTransfer.files;
                              if (files && files.length > 0) {
                                const file = files[0];
                                setEmployeeFormData({
                                  ...employeeFormData,
                                  resumeName: file.name,
                                  resumeUrl: employeeFormData.resumeUrl || `https://nexus-storage.local/resumes/${encodeURIComponent(file.name)}`
                                });
                              }
                            }}
                          >
                            <input 
                              type="file"
                              id="resume-file-picker"
                              accept=".pdf,.doc,.docx,.rtf,.txt"
                              className="hidden"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  const file = files[0];
                                  setEmployeeFormData({
                                    ...employeeFormData,
                                    resumeName: file.name,
                                    resumeUrl: employeeFormData.resumeUrl || `https://nexus-storage.local/resumes/${encodeURIComponent(file.name)}`
                                  });
                                }
                              }}
                            />
                            
                            {employeeFormData.resumeName ? (
                              <div className="space-y-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                  <FileText className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[220px] mx-auto">
                                    {employeeFormData.resumeName}
                                  </p>
                                  <p className="text-[11px] text-emerald-600 font-medium">Ready for sync</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEmployeeFormData({
                                      ...employeeFormData,
                                      resumeName: "",
                                      resumeUrl: ""
                                    });
                                  }}
                                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded transition-colors"
                                >
                                  Remove File
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1.5 py-1">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <div className="text-[11px] font-medium text-slate-500">
                                  <span className="font-bold text-indigo-600">Click to upload</span> or drag & drop
                                </div>
                                <p className="text-[10px] text-slate-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                              </div>
                            )}
                          </div>

                          {/* Online Resume Link alternative */}
                          <div className="flex flex-col justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/20">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Direct URL to Resume (Alternative)</label>
                                <input 
                                  type="url"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-xs transition-all outline-none"
                                  value={employeeFormData.resumeUrl || ""}
                                  onChange={(e) => setEmployeeFormData({
                                    ...employeeFormData, 
                                    resumeUrl: e.target.value,
                                    resumeName: employeeFormData.resumeName || (e.target.value ? "Attached Web Resume" : "")
                                  })}
                                  placeholder="e.g. https://drive.google.com/file/d/..."
                                />
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Share a link to a Google Drive document, Dropbox PDF, LinkedIn profile, or personal CV portal.
                              </p>
                            </div>
                            
                            {employeeFormData.resumeUrl && (
                              <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100/50 mt-2">
                                <span className="truncate max-w-[140px] font-mono text-[10px]">{employeeFormData.resumeUrl}</span>
                                <a 
                                  href={employeeFormData.resumeUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                                >
                                  Test Link <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: BANKING, ADDRESSES & NOTES */}
                  {modalTab === "banking" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-slate-700">Bank Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none" 
                            value={employeeFormData.bankName || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, bankName: e.target.value})} 
                            placeholder="e.g. Standard Chartered" 
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-slate-700">Account Number</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.bankAccountNumber || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, bankAccountNumber: e.target.value})} 
                            placeholder="e.g. 10293810293" 
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-slate-700">IFSC / SWIFT Code</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                            value={employeeFormData.bankIfscCode || ''} 
                            onChange={(e) => setEmployeeFormData({...employeeFormData, bankIfscCode: e.target.value})} 
                            placeholder="e.g. SCBLBDDX" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700">Current Residential Address</label>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none resize-none" 
                          value={employeeFormData.currentAddress || ''} 
                          onChange={(e) => setEmployeeFormData({...employeeFormData, currentAddress: e.target.value})} 
                          placeholder="Provide the current home address details." 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700">Permanent Residential Address</label>
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setEmployeeFormData({...employeeFormData, permanentAddress: employeeFormData.currentAddress})}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded"
                          >
                            Copy Current Address
                          </button>
                        </div>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none resize-none" 
                          value={employeeFormData.permanentAddress || ''} 
                          onChange={(e) => setEmployeeFormData({...employeeFormData, permanentAddress: e.target.value})} 
                          placeholder="Provide the permanent legal address details." 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700">Internal HR & Executive Notes</label>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none resize-none" 
                          value={employeeFormData.notes || ''} 
                          onChange={(e) => setEmployeeFormData({...employeeFormData, notes: e.target.value})} 
                          placeholder="Provide additional internal notes, administrative guidelines, etc." 
                        />
                      </div>
                    </div>
                  )}

                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer text-xs"
                  >
                    {editingEmployee ? "Save Profile" : "Create Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isIncrementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
                <div>
                  <h3 className="text-base font-bold text-indigo-950">
                    Log Salary Increment
                  </h3>
                  <p className="text-xs text-indigo-700/70 mt-0.5">
                    Adjust annual base compensation and log reason.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsIncrementModalOpen(false)} 
                  className="text-slate-500 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSaveIncrement} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Target Employee</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs transition-all outline-none text-slate-600 font-bold" 
                    value={activeDirectoryEmployee ? activeDirectoryEmployee.name : "N/A"}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Current Base ($)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs transition-all outline-none font-mono text-slate-600 font-bold" 
                      value={activeDirectoryEmployee ? `$${(activeDirectoryEmployee.salary || 55000).toLocaleString()}` : "$0"}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">New Base Annual ($)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono font-bold" 
                      value={incrementFormData.newSalary || ""} 
                      onChange={(e) => setIncrementFormData({...incrementFormData, newSalary: parseInt(e.target.value) || 0})}
                      placeholder="e.g. 65000"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Adjustment Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none font-mono" 
                    value={incrementFormData.date} 
                    onChange={(e) => setIncrementFormData({...incrementFormData, date: e.target.value})}
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Adjustment Reason / Remarks</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white transition-all outline-none resize-none" 
                    value={incrementFormData.remarks} 
                    onChange={(e) => setIncrementFormData({...incrementFormData, remarks: e.target.value})} 
                    placeholder="e.g. Annual merit review, promotion to senior engineer..." 
                    required
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsIncrementModalOpen(false)}
                    className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer text-xs"
                  >
                    Log Raise
                  </button>
                </div>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col border border-slate-100 relative overflow-visible"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/40 rounded-t-2xl">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-600 animate-pulse" />
                    Log Activity: {selectedPerfEmployee?.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-medium">Log metrics for:</span>
                    <MonthPicker
                      value={selectedMonth}
                      onChange={handleMonthChangeInPerfLog}
                      align="left"
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsPerformanceModalOpen(false)} 
                  className="text-slate-500 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSavePerformance} className="p-5 space-y-4">
                
                {/* Logging Mode selector: Add to existing vs Overwrite */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Logging Mode</span>
                    <div className="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded-lg text-[11px] font-bold">
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
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-500 hover:text-indigo-600"
                        }`}
                      >
                        Add to Existing
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {entryMode === "overwrite"
                      ? "Directly replace the logged values. Fetched active data is shown in fields."
                      : "Input new numbers to add them on top of the currently recorded values."}
                  </p>
                </div>

                {/* Display Current Recorded metrics in Add Mode */}
                {entryMode === "add" && existingRecordForSelected && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-xs text-slate-700">
                    <span className="font-semibold text-indigo-700">Currently Recorded for {selectedMonth}:</span>
                    <div className="grid grid-cols-3 gap-2 mt-1.5 font-mono text-[11px] text-slate-600">
                      <div>• Meetings: <span className="font-bold text-slate-800">{existingRecordForSelected.conductedMeetings}</span></div>
                      <div>• Projects: <span className="font-bold text-slate-800">{existingRecordForSelected.deliveredProjectsAmount}</span></div>
                      <div>• Value: <span className="font-bold text-slate-800">${existingRecordForSelected.deliveredProjectsValue.toLocaleString()}</span></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      {entryMode === "add" ? "Attendance Rate (%)" : "Attendance Rate (%)"}
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white font-mono outline-none" 
                      value={perfFormData.attendance} 
                      onChange={(e) => setPerfFormData({...perfFormData, attendance: parseFloat(e.target.value) || 0})} 
                      required
                    />
                    {entryMode === "add" && (
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">Absolute percentage rate</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-ellipsis overflow-hidden whitespace-nowrap">
                      {entryMode === "add" ? "Meetings to Add" : "Meetings Conducted"}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white font-mono outline-none" 
                      value={perfFormData.conductedMeetings} 
                      onChange={(e) => setPerfFormData({...perfFormData, conductedMeetings: parseInt(e.target.value) || 0})} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-ellipsis overflow-hidden whitespace-nowrap">
                      {entryMode === "add" ? "Projects to Add" : "Projects Shipped"}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white font-mono outline-none" 
                      value={perfFormData.deliveredProjectsAmount} 
                      onChange={(e) => setPerfFormData({...perfFormData, deliveredProjectsAmount: parseInt(e.target.value) || 0})} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-ellipsis overflow-hidden whitespace-nowrap">
                      {entryMode === "add" ? "Value to Add ($)" : "Total Shipped Value ($)"}
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white font-mono outline-none" 
                      value={perfFormData.deliveredProjectsValue} 
                      onChange={(e) => setPerfFormData({...perfFormData, deliveredProjectsValue: parseInt(e.target.value) || 0})} 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    {entryMode === "add" ? "Additional Remarks (Optional)" : "Manager Remarks (Optional)"}
                  </label>
                  <textarea 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white outline-none resize-none h-16 transition-all"
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col border border-slate-100 relative overflow-visible"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-700" />
                    Set Monthly Targets
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-medium">Expectations for:</span>
                    <MonthPicker
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      align="left"
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsTargetsModalOpen(false)} 
                  className="text-slate-500 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSaveTarget} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Min Attendance Expected (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white font-mono outline-none" 
                    value={targetFormData.attendanceMin} 
                    onChange={(e) => setTargetFormData({...targetFormData, attendanceMin: parseFloat(e.target.value) || 0})} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Min Project Value Target ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 focus:bg-white font-mono outline-none" 
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

      {/* Leave Hover Tooltip */}
      {hoveredLeave && (
        <div
          style={{
            position: "fixed",
            left: `${Math.min(hoveredLeave.x + 15, window.innerWidth - 300)}px`,
            top: `${Math.min(hoveredLeave.y + 15, window.innerHeight - 240)}px`,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="w-72 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_12px_36px_rgba(15,23,42,0.15)] p-4 flex flex-col gap-3 transition-all duration-150 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shrink-0 shadow-sm">
              <img src={get3DAvatarUrl(hoveredLeave.employeeName)} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <div className="font-extrabold text-[11px] text-slate-800 tracking-tight leading-none mb-1">
                {hoveredLeave.employeeName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-tight leading-none truncate">
                {hoveredLeave.employeeRole} • <span className="font-bold text-slate-500">{hoveredLeave.employeeTeam}</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${
              hoveredLeave.leaveType === "Sick" ? "bg-rose-50 text-rose-600 border-rose-100" :
              hoveredLeave.leaveType === "Casual" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              "bg-violet-50 text-violet-650 border-violet-100"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                hoveredLeave.leaveType === "Sick" ? "bg-rose-500" :
                hoveredLeave.leaveType === "Casual" ? "bg-emerald-500" :
                "bg-violet-500"
              }`} />
              {hoveredLeave.leaveType} Leave
            </span>
            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
              hoveredLeave.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
              {hoveredLeave.status}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="font-bold text-slate-700">Roster Period:</span>
            </div>
            <div className="font-mono text-[10px] pl-4 text-slate-600">
              {hoveredLeave.start} to {hoveredLeave.end}
            </div>
            <div className="pl-4 text-[10px] font-bold text-slate-800">
              Duration: <span className="text-indigo-600 font-black">{hoveredLeave.days} {hoveredLeave.days === 1 ? "day" : "days"}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 bg-indigo-50/20 p-2 rounded-xl border border-indigo-100/30 relative">
            <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Notes</div>
            <p className="italic font-medium text-slate-700">"{hoveredLeave.notes}"</p>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
