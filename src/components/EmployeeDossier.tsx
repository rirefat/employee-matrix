import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  Activity,
  TrendingUp,
  Trash2,
  Edit3,
  Mail,
  Phone,
  Shield,
  Bot,
  Plus,
  ChevronDown,
  Search,
  UserPlus,
  Award,
  DollarSign,
  ChevronRight,
  Eye,
  Calendar,
  MessageSquare,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Lock,
  Check,
  Laptop,
  Smartphone,
  Info,
  Send,
  User,
  Users,
  X,
  GitBranch,
  GitPullRequest,
  Cpu,
  Terminal,
  Code2,
  Clock,
  Settings,
  AlertCircle,
  Database,
  Cloud,
  FileText,
  Server,
  Layers,
  Flame,
  CheckSquare,
  Play,
  RotateCw,
  Copy,
  ArrowUpRight,
  TrendingDown,
  TerminalSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Employee, PerformanceRecord } from "../types";
import { get3DAvatarUrl } from "../utils";

interface EmployeeDossierProps {
  activeDirectoryEmployee: Employee | null;
  myEmployees: Employee[];
  setSelectedDirectoryEmpId: (id: string) => void;
  handleOpenAddEmployee: () => void;
  handleOpenEditEmployee: (emp: Employee) => void;
  handleDeleteEmployeeClick: (emp: Employee) => void;
  setIsIncrementModalOpen: (open: boolean) => void;
  setIncrementFormData: (data: any) => void;
  performance: PerformanceRecord[];
  selectedMonth: string;
  copilotInput: string;
  setCopilotInput: (text: string) => void;
  isCopilotLoading: boolean;
  copilotMessages: { sender: "user" | "ai"; text: string }[];
  setCopilotMessages: React.Dispatch<React.SetStateAction<{ sender: "user" | "ai"; text: string }[]>>;
  handleSendCopilotMessage: (text?: string) => Promise<void>;
  showToast: (message: string, type: "success" | "error") => void;
  onRefreshEmployees?: () => Promise<void> | void;
}

export function EmployeeDossier({
  activeDirectoryEmployee,
  myEmployees,
  setSelectedDirectoryEmpId,
  handleOpenAddEmployee,
  handleOpenEditEmployee,
  handleDeleteEmployeeClick,
  setIsIncrementModalOpen,
  setIncrementFormData,
  performance,
  selectedMonth,
  copilotInput,
  setCopilotInput,
  isCopilotLoading,
  copilotMessages,
  setCopilotMessages,
  handleSendCopilotMessage,
  showToast,
  onRefreshEmployees
}: EmployeeDossierProps) {
  // Navigation tabs - curated for an elite Software R&D Workspace
  const [activeTab, setActiveTab] = useState<
    "profile" | "skills" | "projects" | "dev_env" | "git_pulse" | "leaves" | "career" | "copilot"
  >("profile");

  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [headerDropdownSearch, setHeaderDropdownSearch] = useState("");

  // States for manager notes chronological timeline
  const [managerNoteAuthor, setManagerNoteAuthor] = useState("");
  const [managerNoteText, setManagerNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const handleAddManagerNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDirectoryEmployee) return;
    if (!managerNoteText.trim()) {
      showToast("Please write a note description.", "error");
      return;
    }

    const authorName = managerNoteAuthor.trim() || "Lead Manager";
    const newNote = {
      id: "note-" + Math.random().toString(36).substring(2, 11),
      author: authorName,
      text: managerNoteText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [...(activeDirectoryEmployee.managerNotes || []), newNote];

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/employees/${activeDirectoryEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerNotes: updatedNotes
        })
      });

      if (res.ok) {
        showToast("Manager confidential note logged successfully", "success");
        setManagerNoteText("");
        if (onRefreshEmployees) {
          await onRefreshEmployees();
        }
      } else {
        showToast("Failed to save confidential note.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating employee notes chronicle", "error");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteManagerNote = async (noteId: string) => {
    if (!activeDirectoryEmployee) return;
    const updatedNotes = (activeDirectoryEmployee.managerNotes || []).filter(n => n.id !== noteId);

    try {
      const res = await fetch(`/api/employees/${activeDirectoryEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerNotes: updatedNotes
        })
      });

      if (res.ok) {
        showToast("Confidential note deleted from timeline", "success");
        if (onRefreshEmployees) {
          await onRefreshEmployees();
        }
      } else {
        showToast("Failed to delete confidential note.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting note.", "error");
    }
  };

  // Grouped Tech Stack for Software IT Farm
  const [skillsGrouped, setSkillsGrouped] = useState<{
    languages: string[];
    frontend: string[];
    backend: string[];
    cloudDevops: string[];
    databases: string[];
  }>({
    languages: ["TypeScript", "JavaScript", "Golang", "Python"],
    frontend: ["React.js", "Next.js", "Tailwind CSS", "Redux Toolkit", "Vite"],
    backend: ["Node.js", "Express", "NestJS", "Fastify", "gRPC"],
    cloudDevops: ["Docker", "Kubernetes", "AWS S3/EC2/RDS", "GitHub Actions", "Terraform"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"]
  });

  const [newSkillText, setNewSkillText] = useState("");
  const [newSkillCat, setNewSkillCat] = useState<"languages" | "frontend" | "backend" | "cloudDevops" | "databases">("languages");

  // Scrum / Jira Sprint Tickets
  const [tickets, setTickets] = useState<{
    id: string;
    title: string;
    status: string;
    priority: string;
    loggedHours: number;
    sp: number;
  }[]>([]);

  const [timeToLog, setTimeToLog] = useState<{ [key: string]: string }>({});

  // States for Jira ticket management (by manager)
  const [newTicketId, setNewTicketId] = useState("");
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [newTicketStatus, setNewTicketStatus] = useState<"To Do" | "In Progress" | "In Review" | "Done">("To Do");
  const [newTicketSP, setNewTicketSP] = useState(3);
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editTicketTitle, setEditTicketTitle] = useState("");
  const [editTicketPriority, setEditTicketPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [editTicketSP, setEditTicketSP] = useState(3);

  // Local Dev Docker Containers
  const [containers, setContainers] = useState<{
    id: string;
    name: string;
    image: string;
    port: string;
    status: string;
  }[]>([]);

  // States for Docker container management (by manager)
  const [newContainerName, setNewContainerName] = useState("");
  const [newContainerImage, setNewContainerImage] = useState("");
  const [newContainerPort, setNewContainerPort] = useState("");
  const [isAddingContainer, setIsAddingContainer] = useState(false);

  // SSH & Cryptographic credentials
  const [sshKeys, setSshKeys] = useState<{
    id: string;
    name: string;
    type: string;
    fingerprint: string;
    date: string;
  }[]>([]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("ssh-ed25519");
  const [newKeyContent, setNewKeyContent] = useState("");

  // IT Farm Leaves & Attendance
  const [leaveRequests, setLeaveRequests] = useState<{
    id: string;
    type: string;
    start: string;
    end: string;
    days: number;
    status: string;
    notes: string;
  }[]>([]);

  const [leaveType, setLeaveType] = useState<"Sick" | "Casual" | "Gov/Fest">("Casual");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveNotes, setLeaveNotes] = useState("");

  // Webhook trigger state
  const [isBuildTriggering, setIsBuildTriggering] = useState(false);

  // OKRs progress states
  const [okrs, setOkrs] = useState<{ title: string; pct: number; metric: string; }[]>([]);
  const [newOkrTitle, setNewOkrTitle] = useState("");
  const [newOkrPct, setNewOkrPct] = useState(0);
  const [newOkrMetric, setNewOkrMetric] = useState("");
  const [isAddingOkr, setIsAddingOkr] = useState(false);

  // Persistence callback helper
  const saveEmployeeChanges = async (updates: Partial<Employee>) => {
    if (!activeDirectoryEmployee) return;
    try {
      const res = await fetch(`/api/employees/${activeDirectoryEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activeDirectoryEmployee,
          ...updates
        })
      });
      if (res.ok) {
        onRefreshEmployees?.();
      } else {
        console.error("Failed to save changes to employee");
      }
    } catch (err) {
      console.error("Error saving employee updates:", err);
    }
  };

  // Sync state whenever the active employee changes
  useEffect(() => {
    if (activeDirectoryEmployee) {
      if (activeDirectoryEmployee.skillsGrouped) {
        setSkillsGrouped(activeDirectoryEmployee.skillsGrouped);
      } else {
        setSkillsGrouped({
          languages: ["TypeScript", "JavaScript", "Golang", "Python"],
          frontend: ["React.js", "Next.js", "Tailwind CSS", "Redux Toolkit", "Vite"],
          backend: ["Node.js", "Express", "NestJS", "Fastify", "gRPC"],
          cloudDevops: ["Docker", "Kubernetes", "AWS S3/EC2/RDS", "GitHub Actions", "Terraform"],
          databases: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"]
        });
      }

      if (activeDirectoryEmployee.tickets) {
        setTickets(activeDirectoryEmployee.tickets);
      } else {
        setTickets([
          { id: "DEV-1084", title: "Migrate core auth routes to HttpOnly secure stateful cookies", status: "In Progress", priority: "High", loggedHours: 12, sp: 5 },
          { id: "DEV-1085", title: "Refactor database query indexes in billing pipeline", status: "In Review", priority: "Critical", loggedHours: 24, sp: 8 },
          { id: "DEV-1077", title: "Implement real-time notification triggers via WebSockets", status: "Done", priority: "Medium", loggedHours: 18, sp: 3 },
          { id: "DEV-1092", title: "Write end-to-end integration tests for leave submission portal", status: "To Do", priority: "Medium", loggedHours: 0, sp: 2 }
        ]);
      }

      if (activeDirectoryEmployee.containers) {
        setContainers(activeDirectoryEmployee.containers);
      } else {
        setContainers([
          { id: "c1", name: "postgres-primary-db", image: "postgres:16-alpine", port: "5432:5432", status: "running" },
          { id: "c2", name: "redis-distributed-cache", image: "redis:7.2-alpine", port: "6379:6379", status: "running" },
          { id: "c3", name: "rabbitmq-broker", image: "rabbitmq:3-management", port: "5672:5672", status: "stopped" },
          { id: "c4", name: "microservice-auth-node", image: "node:20-alpine", port: "8080:8080", status: "running" }
        ]);
      }

      if (activeDirectoryEmployee.sshKeys) {
        setSshKeys(activeDirectoryEmployee.sshKeys);
      } else {
        setSshKeys([
          { id: "key-1", name: "main-company-macbook-pro", type: "ssh-ed25519", fingerprint: "SHA256:7uKdfH910Klap2Mnd7893KaOpQ11", date: "12-Jan-2026" },
          { id: "key-2", name: "backup-linux-tower", type: "ssh-rsa", fingerprint: "SHA256:92MdKaPq930Kdn71PqO928sJdKw911Kj", date: "28-May-2026" }
        ]);
      }

      if (activeDirectoryEmployee.leaveRequests) {
        setLeaveRequests(activeDirectoryEmployee.leaveRequests);
      } else {
        setLeaveRequests([
          { id: "LR-51", type: "Casual", start: "2026-07-20", end: "2026-07-22", days: 3, status: "Pending", notes: "Attending technical conference" },
          { id: "LR-44", type: "Sick", start: "2026-06-02", end: "2026-06-03", days: 2, status: "Approved", notes: "Emergency medical root canal" }
        ]);
      }

      if (activeDirectoryEmployee.okrs) {
        setOkrs(activeDirectoryEmployee.okrs);
      } else {
        setOkrs([
          { title: "Reduce React client bundle weights via code-splitting", pct: 85, metric: "Goal: Under 250KB total bundle size" },
          { title: "Achieve unit test suite coverage across core microservices", pct: 90, metric: "Goal: >90% code coverage index" },
          { title: "Active mentorship & pairing with 2 junior software engineers", pct: 100, metric: "Goal: 2 direct reports successfully trained" }
        ]);
      }
    }
  }, [activeDirectoryEmployee]);

  // Calculate dynamic profile completion percentage
  const profileCompletion = useMemo(() => {
    if (!activeDirectoryEmployee) return 0;
    let points = 0;
    let total = 8;
    if (activeDirectoryEmployee.name) points++;
    if (activeDirectoryEmployee.email) points++;
    if (activeDirectoryEmployee.id) points++;
    if (activeDirectoryEmployee.phone) points++;
    if (activeDirectoryEmployee.joiningDate) points++;
    if (activeDirectoryEmployee.salary) points++;
    if (activeDirectoryEmployee.notes) points++;
    if (sshKeys.length > 0) points++;
    return Math.round((points / total) * 100);
  }, [activeDirectoryEmployee, sshKeys]);

  // Completions flags for Left Vertical Navigation Tab Sidebar checkmarks
  const isProfileComplete = useMemo(() => profileCompletion >= 80, [profileCompletion]);
  const isSkillsComplete = useMemo(() => Object.values(skillsGrouped).flat().length >= 8, [skillsGrouped]);
  const isProjectsComplete = useMemo(() => tickets.length > 0, [tickets]);
  const isDevEnvComplete = useMemo(() => sshKeys.length > 0 && containers.some(c => c.status === "running"), [sshKeys, containers]);
  const isGitPulseComplete = true;
  const isLeavesComplete = useMemo(() => leaveRequests.length > 0, [leaveRequests]);
  const isCareerComplete = useMemo(() => (activeDirectoryEmployee?.salary || 0) > 0, [activeDirectoryEmployee]);

  const activeRecord = useMemo(() => {
    if (!activeDirectoryEmployee) return null;
    return performance.find(
      p => p.employeeId === activeDirectoryEmployee.id && p.month === selectedMonth
    );
  }, [performance, activeDirectoryEmployee, selectedMonth]);

  const parsedMonth = useMemo(() => {
    if (!selectedMonth) return { year: 2026, month: 6, label: "June 2026" };
    const [yStr, mStr] = selectedMonth.split("-");
    const year = parseInt(yStr) || 2026;
    const month = parseInt(mStr) || 6;
    const dateObj = new Date(year, month - 1, 1);
    const monthLabel = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return { year, month, label: monthLabel };
  }, [selectedMonth]);

  const daysArray = useMemo(() => {
    const { year, month } = parsedMonth;
    const totalDays = new Date(year, month, 0).getDate();
    const startDayOfWeek = new Date(year, month - 1, 1).getDay();

    let workingDaysList: number[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const dayOfWeek = new Date(year, month - 1, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (!isWeekend) {
        workingDaysList.push(d);
      }
    }

    const workingDaysCount = workingDaysList.length;
    let pCount = Math.round(workingDaysCount * 0.95);
    let aCount = 0;
    let lCount = workingDaysCount - pCount;

    if (activeRecord) {
      if (activeRecord.presentDays !== undefined) pCount = activeRecord.presentDays;
      if (activeRecord.absentDays !== undefined) aCount = activeRecord.absentDays;
      if (activeRecord.leaveDays !== undefined) lCount = activeRecord.leaveDays;

      const totalAssigned = pCount + aCount + lCount;
      if (totalAssigned !== workingDaysCount) {
        if (pCount + aCount + lCount === 0) {
          pCount = workingDaysCount;
        } else {
          const factor = workingDaysCount / totalAssigned;
          pCount = Math.round(pCount * factor);
          lCount = Math.round(lCount * factor);
          aCount = workingDaysCount - pCount - lCount;
        }
      }
    }

    const seedString = `${activeDirectoryEmployee?.id || "EMP"}-${year}-${month}`;
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed += seedString.charCodeAt(i);
    }
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const shuffledWorkingDays = [...workingDaysList];
    for (let i = shuffledWorkingDays.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      const temp = shuffledWorkingDays[i];
      shuffledWorkingDays[i] = shuffledWorkingDays[j];
      shuffledWorkingDays[j] = temp;
    }

    const statusMap: Record<number, "Present" | "Absent" | "Leave"> = {};
    const leaveDaysSet = new Set(shuffledWorkingDays.slice(0, lCount));
    const absentDaysSet = new Set(shuffledWorkingDays.slice(lCount, lCount + aCount));

    workingDaysList.forEach(d => {
      if (leaveDaysSet.has(d)) {
        statusMap[d] = "Leave";
      } else if (absentDaysSet.has(d)) {
        statusMap[d] = "Absent";
      } else {
        statusMap[d] = "Present";
      }
    });

    const cells = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({
        dayNumber: null,
        isWeekend: false,
        status: null,
        dateString: null,
        isFuture: false
      });
    }

    const currentYear = 2026;
    const currentMonth = 7;
    const currentDay = 11;

    for (let d = 1; d <= totalDays; d++) {
      const dayOfWeek = new Date(year, month - 1, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      let isFuture = false;
      if (year > currentYear) {
        isFuture = true;
      } else if (year === currentYear) {
        if (month > currentMonth) {
          isFuture = true;
        } else if (month === currentMonth) {
          if (d > currentDay) {
            isFuture = true;
          }
        }
      }

      let finalStatus: "Present" | "Absent" | "Leave" | "Weekend" | "Future" = "Present";
      if (isFuture) {
        finalStatus = "Future";
      } else if (isWeekend) {
        finalStatus = "Weekend";
      } else {
        // Integrate with leaveRequests from local state if there's any matching date
        const dateObj = new Date(year, month - 1, d);
        const localLeave = leaveRequests.find(lr => {
          const s = new Date(lr.start);
          const e = new Date(lr.end);
          return dateObj >= s && dateObj <= e;
        });

        if (localLeave) {
          if (localLeave.status === "Approved") {
            finalStatus = "Leave";
          } else {
            // Keep status but maybe we can keep it as Present/Leave depending on seed
            finalStatus = statusMap[d] || "Present";
          }
        } else {
          finalStatus = statusMap[d] || "Present";
        }
      }

      cells.push({
        dayNumber: d,
        isWeekend,
        status: finalStatus,
        dateString: dateStr,
        isFuture
      });
    }

    return { cells, pCount, aCount, lCount, workingDaysCount };
  }, [parsedMonth, activeRecord, activeDirectoryEmployee, leaveRequests]);

  // Tech stack mutations
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const cleanText = newSkillText.trim();
    if (skillsGrouped[newSkillCat].includes(cleanText)) {
      showToast(`${cleanText} already registered in this stack division`, "error");
      return;
    }
    const updatedSkills = {
      ...skillsGrouped,
      [newSkillCat]: [...skillsGrouped[newSkillCat], cleanText]
    };
    setSkillsGrouped(updatedSkills);
    setNewSkillText("");
    saveEmployeeChanges({ skillsGrouped: updatedSkills });
    showToast(`Added ${cleanText} to corporate core tech stacks`, "success");
  };

  const handleRemoveSkill = (category: keyof typeof skillsGrouped, skill: string) => {
    const updatedSkills = {
      ...skillsGrouped,
      [category]: skillsGrouped[category].filter(s => s !== skill)
    };
    setSkillsGrouped(updatedSkills);
    saveEmployeeChanges({ skillsGrouped: updatedSkills });
    showToast(`Removed skill tag: ${skill}`, "success");
  };

  // Ticket status mutations
  const handleToggleTicketStatus = (ticketId: string, currentStatus: string) => {
    const sequence = ["To Do", "In Progress", "In Review", "Done"];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];

    const updatedTickets = tickets.map(t => (t.id === ticketId ? { ...t, status: nextStatus } : t));
    setTickets(updatedTickets);
    saveEmployeeChanges({ tickets: updatedTickets });
    showToast(`Ticket ${ticketId} transitioned to ${nextStatus}`, "success");
  };

  const handleLogHours = (ticketId: string) => {
    const hours = parseFloat(timeToLog[ticketId] || "0");
    if (isNaN(hours) || hours <= 0) {
      showToast("Please specify a valid floating point hour count", "error");
      return;
    }
    const updatedTickets = tickets.map(t => (t.id === ticketId ? { ...t, loggedHours: t.loggedHours + hours } : t));
    setTickets(updatedTickets);
    setTimeToLog(prev => ({ ...prev, [ticketId]: "" }));
    saveEmployeeChanges({ tickets: updatedTickets });
    showToast(`Pushed logs: +${hours} dev-hours onto ${ticketId}`, "success");
  };

  // Manager Jira ticket management functions
  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) {
      showToast("Please specify ticket summary", "error");
      return;
    }
    const cleanId = newTicketId.trim().toUpperCase() || `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: cleanId,
      title: newTicketTitle.trim(),
      priority: newTicketPriority,
      status: newTicketStatus,
      loggedHours: 0,
      sp: Number(newTicketSP) || 1
    };

    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    saveEmployeeChanges({ tickets: updatedTickets });

    setNewTicketId("");
    setNewTicketTitle("");
    setNewTicketPriority("Medium");
    setNewTicketStatus("To Do");
    setNewTicketSP(3);
    setIsAddingTicket(false);

    showToast(`Sprint Ticket ${cleanId} added successfully`, "success");
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm(`Are you sure you want to delete ticket ${ticketId}?`)) {
      const updatedTickets = tickets.filter(t => t.id !== ticketId);
      setTickets(updatedTickets);
      saveEmployeeChanges({ tickets: updatedTickets });
      showToast(`Sprint Ticket ${ticketId} removed`, "success");
    }
  };

  const startEditingTicket = (t: any) => {
    setEditingTicketId(t.id);
    setEditTicketTitle(t.title);
    setEditTicketPriority(t.priority);
    setEditTicketSP(t.sp);
  };

  const handleSaveTicketEdit = (ticketId: string) => {
    if (!editTicketTitle.trim()) {
      showToast("Summary cannot be empty", "error");
      return;
    }
    const updatedTickets = tickets.map(t =>
      t.id === ticketId
        ? { ...t, title: editTicketTitle.trim(), priority: editTicketPriority, sp: Number(editTicketSP) || 1 }
        : t
    );
    setTickets(updatedTickets);
    saveEmployeeChanges({ tickets: updatedTickets });
    setEditingTicketId(null);
    showToast(`Ticket ${ticketId} updated successfully`, "success");
  };

  // Docker command simulations
  const handleToggleDocker = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === "running" ? "stopped" : "running";
    const updatedContainers = containers.map(c => (c.id === id ? { ...c, status: nextStatus } : c));
    setContainers(updatedContainers);
    saveEmployeeChanges({ containers: updatedContainers });
    showToast(`Docker container [${name}] set to: ${nextStatus}`, "success");
  };

  const handleRestartDocker = (name: string) => {
    showToast(`Docker daemon restarting container [${name}]...`, "success");
    setTimeout(() => {
      showToast(`Docker container [${name}] boot successful`, "success");
    }, 800);
  };

  // Manager Docker container management
  const handleCreateDocker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContainerName.trim() || !newContainerImage.trim()) {
      showToast("Docker Container Name and Image are mandatory", "error");
      return;
    }
    const cleanName = newContainerName.trim().replace(/\s+/g, "-").toLowerCase();
    const cleanImage = newContainerImage.trim();
    const cleanPort = newContainerPort.trim() || "80:80";
    const newCont = {
      id: "cont-" + Date.now(),
      name: cleanName,
      image: cleanImage,
      port: cleanPort,
      status: "stopped"
    };

    const updatedContainers = [...containers, newCont];
    setContainers(updatedContainers);
    saveEmployeeChanges({ containers: updatedContainers });

    setNewContainerName("");
    setNewContainerImage("");
    setNewContainerPort("");
    setIsAddingContainer(false);

    showToast(`Docker Sandbox container [${cleanName}] registered`, "success");
  };

  const handleDeleteDocker = (id: string, name: string) => {
    if (confirm(`Are you sure you want to prune and delete container [${name}]?`)) {
      const updatedContainers = containers.filter(c => c.id !== id);
      setContainers(updatedContainers);
      saveEmployeeChanges({ containers: updatedContainers });
      showToast(`Pruned and deleted container [${name}]`, "success");
    }
  };

  // SSH Key configuration
  const handleAddSSHKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim() || !newKeyContent.trim()) {
      showToast("All fields for cryptographic enlisting must be defined", "error");
      return;
    }
    const mockHash = "SHA256:" + Array.from({ length: 32 }, () =>
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 62))
    ).join("");

    const newKey = {
      id: "key-" + Date.now(),
      name: newKeyName.trim(),
      type: newKeyType,
      fingerprint: mockHash,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };

    const updatedKeys = [...sshKeys, newKey];
    setSshKeys(updatedKeys);
    setNewKeyName("");
    setNewKeyContent("");
    saveEmployeeChanges({ sshKeys: updatedKeys });
    showToast("Cryptographic SSH public key configured successfully", "success");
  };

  const handleRemoveSSHKey = (id: string, name: string) => {
    const updatedKeys = sshKeys.filter(k => k.id !== id);
    setSshKeys(updatedKeys);
    saveEmployeeChanges({ sshKeys: updatedKeys });
    showToast(`Cryptographic credential [${name}] revoked from Git registries`, "success");
  };

  // Leave system integration
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd) {
      showToast("Please provide both starting and ending cycles for leave request", "error");
      return;
    }
    const daysCalc = Math.max(1, Math.ceil((new Date(leaveEnd).getTime() - new Date(leaveStart).getTime()) / (1000 * 3600 * 24)) + 1);

    const newReq = {
      id: "LR-" + (Math.floor(Math.random() * 100) + 100),
      type: leaveType,
      start: leaveStart,
      end: leaveEnd,
      days: daysCalc,
      status: "Pending",
      notes: leaveNotes || "No specific comments recorded."
    };

    const updatedLeaves = [newReq, ...leaveRequests];
    setLeaveRequests(updatedLeaves);
    saveEmployeeChanges({ leaveRequests: updatedLeaves });
    setLeaveStart("");
    setLeaveEnd("");
    setLeaveNotes("");
    showToast(`Submitted leave application: ${daysCalc} days of ${leaveType} leave pending audit`, "success");
  };

  const handleUpdateLeaveStatus = (id: string, status: "Approved" | "Pending" | "Rejected") => {
    const updatedLeaves = leaveRequests.map(lr => lr.id === id ? { ...lr, status } : lr);
    setLeaveRequests(updatedLeaves);
    saveEmployeeChanges({ leaveRequests: updatedLeaves });
    showToast(`Leave request ${id} set to ${status}`, "success");
  };

  const handleDeleteLeaveRequest = (id: string) => {
    if (confirm("Are you sure you want to cancel and delete this leave request?")) {
      const updatedLeaves = leaveRequests.filter(lr => lr.id !== id);
      setLeaveRequests(updatedLeaves);
      saveEmployeeChanges({ leaveRequests: updatedLeaves });
      showToast(`Leave request ${id} deleted`, "success");
    }
  };

  // Manager OKR Management
  const handleAddOkr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOkrTitle.trim()) {
      showToast("Please provide an OKR title", "error");
      return;
    }
    const newOkrObj = {
      title: newOkrTitle.trim(),
      pct: Math.min(100, Math.max(0, Number(newOkrPct) || 0)),
      metric: newOkrMetric.trim() || "Goal: Custom Milestone"
    };
    const updatedOkrs = [...okrs, newOkrObj];
    setOkrs(updatedOkrs);
    saveEmployeeChanges({ okrs: updatedOkrs });
    setNewOkrTitle("");
    setNewOkrPct(0);
    setNewOkrMetric("");
    setIsAddingOkr(false);
    showToast("OKR objective added successfully", "success");
  };

  const handleUpdateOkrPct = (index: number, newPct: number) => {
    const updatedOkrs = okrs.map((o, idx) => idx === index ? { ...o, pct: Math.min(100, Math.max(0, newPct)) } : o);
    setOkrs(updatedOkrs);
    saveEmployeeChanges({ okrs: updatedOkrs });
  };

  const handleDeleteOkr = (index: number) => {
    if (confirm("Are you sure you want to remove this OKR?")) {
      const updatedOkrs = okrs.filter((_, idx) => idx !== index);
      setOkrs(updatedOkrs);
      saveEmployeeChanges({ okrs: updatedOkrs });
      showToast("OKR removed", "success");
    }
  };

  // CI Build simulation
  const handleTriggerBuild = () => {
    setIsBuildTriggering(true);
    showToast("Acquiring webhook lock... Dispatching GitHub Actions workflow", "success");
    setTimeout(() => {
      showToast("Pipeline running: compiling bundles, executing 42 unit test cases", "success");
      setTimeout(() => {
        setIsBuildTriggering(false);
        showToast("CI Pipeline: PASSING. Production Docker container rebuilt & synchronized", "success");
      }, 1500);
    }, 1200);
  };

  const handleQuickAnalyze = (month: string) => {
    setActiveTab("copilot");
    const promptText = `Analyze technical performance and IT metrics for ${activeDirectoryEmployee?.name || "the active employee"} for cycle ${month}. Highlight their software engineering outputs, commits, sprint velocity, and recommend concrete Level-2 skill tracks.`;
    handleSendCopilotMessage(promptText);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard`, "success");
  };

  if (!activeDirectoryEmployee) {
    return (
      <div className="flex-1 w-full p-8 lg:p-12 overflow-y-auto bg-slate-50 text-slate-800 flex flex-col items-center justify-center min-h-[80vh] font-sans">
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 mb-6 shadow-sm animate-pulse">
          <Bot className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-display">No Active Talent Record</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-xs text-center leading-relaxed">
          Select or enroll an employee profile from the central directory to view their Software IT Farm talent dossiers.
        </p>
        <button
          onClick={handleOpenAddEmployee}
          className="mt-6 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
        >
          <UserPlus className="w-3.5 h-3.5" /> Enroll Team Member
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 overflow-y-auto overflow-x-hidden bg-transparent text-slate-800 relative h-[calc(100vh-4rem)] font-sans">
      
      {/* Premium subtle grid overlay with smooth and elegant gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.075)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Decorative gradient glowing spots matching the performance portal's signature aesthetic */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500/8 to-indigo-500/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-indigo-500/8 to-purple-500/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/4 to-teal-500/8 blur-3xl pointer-events-none" />

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full relative z-10">
        
        {/* LEFT COLUMN: Sidebar Navigation Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8 h-fit">
          
          {/* Curated Dropdown Selector for Employee Profiles */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-slate-200/60 text-slate-800 rounded-2xl flex items-center justify-between cursor-pointer text-xs font-semibold transition-all shadow-2xs hover:shadow-md hover:border-slate-300 duration-300 focus:outline-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={get3DAvatarUrl(activeDirectoryEmployee.name)}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover bg-slate-100 border border-slate-200"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 border border-white rounded-full animate-ping" />
                  </div>
                  <span className="truncate text-slate-800 font-bold font-display">{activeDirectoryEmployee.name}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isHeaderDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isHeaderDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsHeaderDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-2 flex flex-col max-h-[250px] overflow-hidden">
                    <div className="px-3 pb-2 pt-1 border-b border-slate-100 relative">
                      <Search className="absolute left-6 top-3.5 h-3 w-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={headerDropdownSearch}
                        onChange={(e) => setHeaderDropdownSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 rounded-xl transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 py-1 no-scrollbar">
                      {myEmployees
                        .filter(emp => !headerDropdownSearch || emp.name.toLowerCase().includes(headerDropdownSearch.toLowerCase()))
                        .map(emp => (
                          <button
                            type="button"
                            key={emp.id}
                            onClick={() => {
                              setSelectedDirectoryEmpId(emp.id);
                              setIsHeaderDropdownOpen(false);
                              setHeaderDropdownSearch("");
                            }}
                            className={`w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors ${
                              activeDirectoryEmployee.id === emp.id ? "bg-slate-50 text-blue-600 font-bold border-l-4 border-blue-500" : "text-slate-600"
                            }`}
                          >
                            <img
                              src={get3DAvatarUrl(emp.name)}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover bg-slate-100 border border-slate-200"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate text-slate-800 font-display">{emp.name}</div>
                              <div className="text-[10px] text-slate-400 truncate font-mono">{emp.role}</div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenAddEmployee}
              className="w-11 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-[0_8px_24px_rgba(15,23,42,0.1)] shrink-0 border border-slate-250"
              title="Enroll New Developer"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          </div>

          {/* Left Main Profile Card - Reimagined with Premium Vercel/Linear elegance */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
            
            {/* Atmospheric color nodes under glass to enhance depth */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/8 to-indigo-600/8 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/4 to-purple-500/8 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-emerald-500/4 blur-3xl pointer-events-none" />

            {/* Creative technical background gridlines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Technical decorative crosshairs and corner lines for a premium aesthetic */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-slate-300 pointer-events-none" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-slate-300 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-slate-300 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-slate-300 pointer-events-none" />

            {/* Elegant glass active status pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-slate-50/90 border border-slate-200 text-emerald-700 font-mono uppercase tracking-wider shadow-2xs relative z-10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Active R&D Sync
            </div>

            <button 
              onClick={() => showToast(`Dossier assessment completeness at ${profileCompletion}%`, "success")}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 transition-colors cursor-pointer relative z-10"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Premium Avatar Visualizer with Double Halo Gradient */}
            <div className="relative mt-8 mb-5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-12 blur-md scale-110" />
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  className="text-slate-200/40"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                  strokeWidth="2.5"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 - (276.46 * profileCompletion) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-2 rounded-full overflow-hidden bg-slate-50 border border-slate-200/80 p-1 shadow-inner">
                <img
                  src={get3DAvatarUrl(activeDirectoryEmployee.name)}
                  alt={activeDirectoryEmployee.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Profile Identifiers & Meta */}
            <div className="space-y-2 w-full flex flex-col items-center">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight font-display">{activeDirectoryEmployee.name}</h3>
              
              <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-medium text-slate-500 select-none shadow-2xs">
                <span className="text-slate-400 font-bold">UID //</span> {activeDirectoryEmployee.id}
              </div>

              <div className="pt-1.5 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full font-mono">
                  {activeDirectoryEmployee.role}
                </span>
                <span className="text-[11px] text-slate-500 font-medium select-all mt-0.5">{activeDirectoryEmployee.email}</span>
                
                <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono font-semibold text-slate-400 bg-slate-50 border border-slate-200/30 rounded-full px-2.5 py-0.5">
                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                  <span>Hub: {activeDirectoryEmployee.team || "Core Engineering"}</span>
                </div>
              </div>
            </div>

            {/* Modern gradient accent separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-6" />

            {/* Clean Progress Tracker */}
            <div className="w-full space-y-2 text-left relative">
              <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                <span>Dossier Quality</span>
                <span className="text-slate-900 font-black">{profileCompletion}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/30">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              {/* Collapsible Dossier Tips Checklist */}
              {profileCompletion < 100 ? (
                <div className="mt-4 bg-slate-50/50 backdrop-blur-xs border border-slate-200/60 p-3.5 rounded-2xl text-left space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-150 pb-1.5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" /> Improve Quality
                    </span>
                    <span className="text-[8px] font-bold text-amber-700 bg-amber-50 border border-amber-100/60 px-1.5 py-0.5 rounded uppercase font-mono">
                      Missing Fields
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto no-scrollbar">
                    {!activeDirectoryEmployee.phone && (
                      <button
                        onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                        className="w-full text-[10px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-2xs p-1.5 rounded-lg border border-transparent hover:border-slate-200/80 transition-all flex items-center justify-between text-left cursor-pointer group/item"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-indigo-500 shrink-0" />
                          Add Phone
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 group-hover/item:text-indigo-500 font-bold">+12.5%</span>
                      </button>
                    )}
                    {!activeDirectoryEmployee.notes && (
                      <button
                        onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                        className="w-full text-[10px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-2xs p-1.5 rounded-lg border border-transparent hover:border-slate-200/80 transition-all flex items-center justify-between text-left cursor-pointer group/item"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-indigo-500 shrink-0" />
                          Add R&D notes
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 group-hover/item:text-indigo-500 font-bold">+12.5%</span>
                      </button>
                    )}
                    {sshKeys.length === 0 && (
                      <button
                        onClick={() => setActiveTab("dev_env")}
                        className="w-full text-[10px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-2xs p-1.5 rounded-lg border border-transparent hover:border-slate-200/80 transition-all flex items-center justify-between text-left cursor-pointer group/item"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-indigo-500 shrink-0" />
                          Add SSH Key
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 group-hover/item:text-indigo-500 font-bold">+12.5%</span>
                      </button>
                    )}
                    {!activeDirectoryEmployee.salary && (
                      <button
                        onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                        className="w-full text-[10px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-2xs p-1.5 rounded-lg border border-transparent hover:border-slate-200/80 transition-all flex items-center justify-between text-left cursor-pointer group/item"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-indigo-500 shrink-0" />
                          Set Salary
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 group-hover/item:text-indigo-500 font-bold">+12.5%</span>
                      </button>
                    )}
                    {!activeDirectoryEmployee.bloodGroup && (
                      <button
                        onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                        className="w-full text-[10px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-2xs p-1.5 rounded-lg border border-transparent hover:border-slate-200/80 transition-all flex items-center justify-between text-left cursor-pointer group/item"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3 h-3 text-indigo-500 shrink-0" />
                          Set Blood Group
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 group-hover/item:text-indigo-500 font-bold">Audit</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3 bg-emerald-50/60 border border-emerald-200/50 p-3 rounded-2xl text-left flex items-center gap-2.5">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 text-white stroke-[3px]" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-emerald-800 uppercase tracking-widest font-mono">Dossier Complete</span>
                    <p className="text-[10px] text-emerald-600/90 leading-tight">Passed HR administrative audit.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Action Panel with Elegant Labelings - Redesigned as a Premium utility dock */}
            <div className="flex items-center justify-center gap-2.5 w-full border-t border-slate-100 pt-4 mt-6">
              <button
                onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-700 transition-all cursor-pointer border border-slate-200 hover:border-slate-300 text-[10px] font-bold shadow-2xs active:scale-98"
                title="Edit Developer Information"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => {
                  setIncrementFormData({
                    newSalary: (activeDirectoryEmployee.salary || 55000) + 5000,
                    remarks: "Awarded based on Outstanding Sprint OKR Milestones",
                    date: new Date().toISOString().split("T")[0]
                  });
                  setIsIncrementModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 transition-all cursor-pointer border border-indigo-150 text-[10px] font-bold shadow-2xs active:scale-98"
                title="Log Annual Hike"
              >
                <TrendingUp className="w-3 h-3" /> Hike
              </button>
              <button
                onClick={() => handleDeleteEmployeeClick(activeDirectoryEmployee)}
                className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-all cursor-pointer border border-rose-200/40 active:scale-95"
                title="De-register Developer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Left Vertical Navigation tabs (Sleeker, Border-anchored list design with check indicators) */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col gap-1.5">
            {[
              { id: "profile", label: "Developer Profile", isCompleted: isProfileComplete, icon: <User className="w-3.5 h-3.5" /> },
              { id: "skills", label: "Tech Stack & Skills", isCompleted: isSkillsComplete, icon: <Code2 className="w-3.5 h-3.5" /> },
              { id: "projects", label: "Active Sprint Tickets", isCompleted: isProjectsComplete, icon: <CheckSquare className="w-3.5 h-3.5" /> },
              { id: "dev_env", label: "Docker Setup & SSH", isCompleted: isDevEnvComplete, icon: <Terminal className="w-3.5 h-3.5" /> },
              { id: "git_pulse", label: "Git Metrics (CI/CD)", isCompleted: isGitPulseComplete, icon: <GitBranch className="w-3.5 h-3.5" /> },
              { id: "leaves", label: "Leaves & Schedule", isCompleted: isLeavesComplete, icon: <Calendar className="w-3.5 h-3.5" /> },
              { id: "career", label: "Compensation & OKRs", isCompleted: isCareerComplete, icon: <Award className="w-3.5 h-3.5" /> },
              { id: "copilot", label: "Gemini Dev Co-pilot", isCompleted: true, highlight: true, icon: <Bot className="w-3.5 h-3.5" /> }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border ${
                    isSelected
                      ? "bg-slate-900 border-slate-950 text-white font-semibold shadow-xs translate-x-1"
                      : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className={isSelected ? "text-white" : tab.highlight ? "text-indigo-600 font-bold" : "text-slate-400"}>
                      {tab.icon}
                    </span>
                    <span className={tab.highlight && !isSelected ? "text-indigo-600 font-extrabold" : ""}>
                      {tab.label}
                    </span>
                  </span>
                  
                  {tab.isCompleted ? (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-white/10 text-white" : "bg-emerald-50/80 border border-emerald-100 text-emerald-600 shadow-2xs"
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3.5px]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-200/80 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Tab Panel Display Panel - High End Visual Polish */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[700px] relative overflow-hidden group">
          
          {/* Subtle tech gridlines inside panel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          {/* Decorative radial gradients under glass */}
          <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/4 to-teal-500/4 blur-3xl pointer-events-none" />

          {/* Technical decorative corners */}
          <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-slate-300/60 pointer-events-none z-10" />
          <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-slate-300/60 pointer-events-none z-10" />
          <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-slate-300/60 pointer-events-none z-10" />
          <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-slate-300/60 pointer-events-none z-10" />
          
          <div className="w-full relative z-10">
            
            {/* Header Title with quick edit triggers */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 relative z-10">
              <h2 className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase font-mono flex items-center gap-2">
                {activeTab === "profile" && <User className="w-4 h-4 text-slate-500" />}
                {activeTab === "skills" && <Code2 className="w-4 h-4 text-slate-500" />}
                {activeTab === "projects" && <CheckSquare className="w-4 h-4 text-slate-500" />}
                {activeTab === "dev_env" && <Terminal className="w-4 h-4 text-slate-500" />}
                {activeTab === "git_pulse" && <GitBranch className="w-4 h-4 text-slate-500" />}
                {activeTab === "leaves" && <Calendar className="w-4 h-4 text-slate-500" />}
                {activeTab === "career" && <Award className="w-4 h-4 text-slate-500" />}
                {activeTab === "copilot" && <Bot className="w-4 h-4 text-blue-500" />}
                
                {activeTab === "profile" && "Developer Profile & Core Details"}
                {activeTab === "skills" && "Interactive Technology Stack Matrices"}
                {activeTab === "projects" && "Sprint Velocity Board & Assigned Issues"}
                {activeTab === "dev_env" && "Local Containers & Cloud Keys"}
                {activeTab === "git_pulse" && "Git Contributions & Quality pipelines"}
                {activeTab === "leaves" && "Leaves Roster & Timesheets Compliance"}
                {activeTab === "career" && "Career Progression Timeline & OKRs"}
                {activeTab === "copilot" && "Gemini Technical Advisor Hub"}
              </h2>
              <button
                onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-all cursor-pointer"
                title="Edit This Record"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                
                {/* 1. DEVELOPER PROFILE TAB */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    
                    {/* Modern Bento Block for General Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 bg-white/90 border border-slate-200/60 rounded-2xl p-6 relative overflow-hidden shadow-2xs">
                      <div className="absolute top-0 right-0 p-1 bg-gradient-to-bl from-blue-500/10 to-transparent w-24 h-24 rounded-bl-full pointer-events-none" />
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Engineering Name</span>
                        <span className="block text-xs font-bold text-slate-900 mt-1 font-display">{activeDirectoryEmployee.name}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Corporate Email</span>
                        <span className="block text-xs font-bold text-slate-800 mt-1 font-mono">{activeDirectoryEmployee.email}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Employee UID</span>
                        <span className="block text-xs font-bold text-slate-700 mt-1 font-mono">{activeDirectoryEmployee.id}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Contact Phone</span>
                        <span className="block text-xs font-bold text-slate-800 mt-1 font-mono">{activeDirectoryEmployee.phone || "+880178320274"}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Slack Direct Address</span>
                        <span className="block text-xs font-semibold text-slate-900 mt-1 font-mono">U05{activeDirectoryEmployee.id.toUpperCase()}L9K</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Company Join Date</span>
                        <span className="block text-xs font-bold text-slate-800 mt-1 font-mono">{activeDirectoryEmployee.joiningDate || "12-Jan-2025"}</span>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">R&D Core Focus Summary</span>
                        <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                          "{activeDirectoryEmployee.notes || "Core software development contributor active in microservices architecture cycles."}"
                        </p>
                      </div>
                    </div>

                    {/* Modern Interactive Quick Actions Hub */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                        <Activity className="w-24 h-24 stroke-[1px]" />
                      </div>
                      <div className="relative z-10">
                        <span className="text-[9px] font-mono tracking-widest uppercase text-slate-300 font-bold">Managerial Workspace</span>
                        <h3 className="text-sm font-extrabold tracking-tight font-display mt-0.5">Quick Actions & Integration Triggers</h3>
                        <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                          Seamlessly trigger workspace links, compile reports, or coordinate with the active developer through integrated actions.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-2">
                        <button
                          onClick={() => {
                            window.location.href = `mailto:${activeDirectoryEmployee.email}`;
                            showToast(`Opening default mail client to: ${activeDirectoryEmployee.email}`, "success");
                          }}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group cursor-pointer"
                        >
                          <Mail className="w-4.5 h-4.5 text-indigo-300 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-white tracking-tight">Direct Email</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("copilot");
                            handleSendCopilotMessage(`Please generate a comprehensive professional assessment and SWOT analysis for developer ${activeDirectoryEmployee.name}, currently holding the role of ${activeDirectoryEmployee.role}. List key growth recommendations.`);
                            showToast("Initiating Gemini Performance Assessment...", "success");
                          }}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group cursor-pointer"
                        >
                          <Bot className="w-4.5 h-4.5 text-blue-300 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-white tracking-tight">AI Assessment</span>
                        </button>

                        <button
                          onClick={() => {
                            showToast(`Compiling and building PDF Dossier for ${activeDirectoryEmployee.name}...`, "success");
                            setTimeout(() => {
                              const printWindow = window.open("", "_blank");
                              if (printWindow) {
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Employee Dossier - ${activeDirectoryEmployee.name}</title>
                                      <style>
                                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                                        h1 { font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
                                        h2 { font-size: 16px; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
                                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                                        .field { margin-bottom: 12px; }
                                        .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold; }
                                        .value { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px; }
                                        .badge { display: inline-block; padding: 4px 8px; background: #f1f5f9; border-radius: 4px; font-size: 11px; font-weight: bold; }
                                      </style>
                                    </head>
                                    <body>
                                      <h1>EMPLOYEE DOSSIER REPORT</h1>
                                      <div class="grid">
                                        <div class="field"><div class="label">Name</div><div class="value">${activeDirectoryEmployee.name}</div></div>
                                        <div class="field"><div class="label">Role / Title</div><div class="value">${activeDirectoryEmployee.role}</div></div>
                                        <div class="field"><div class="label">Corporate Email</div><div class="value">${activeDirectoryEmployee.email}</div></div>
                                        <div class="field"><div class="label">Employee ID</div><div class="value">${activeDirectoryEmployee.id}</div></div>
                                        <div class="field"><div class="label">Department</div><div class="value">${activeDirectoryEmployee.department}</div></div>
                                        <div class="field"><div class="label">Join Date</div><div class="value">${activeDirectoryEmployee.joiningDate || '12-Jan-2025'}</div></div>
                                      </div>
                                      <h2>PERSONAL & HEALTH COMPLIANCE</h2>
                                      <div class="grid">
                                        <div class="field"><div class="label">Blood Group</div><div class="value"><span class="badge">${activeDirectoryEmployee.bloodGroup || 'Not set'}</span></div></div>
                                        <div class="field"><div class="label">Date of Birth</div><div class="value">${activeDirectoryEmployee.dob || 'Not set'}</div></div>
                                        <div class="field"><div class="label">Gender</div><div class="value">${activeDirectoryEmployee.gender || 'Not set'}</div></div>
                                        <div class="field"><div class="label">Emergency Contact</div><div class="value">${activeDirectoryEmployee.emergencyContact || 'Not set'}</div></div>
                                        <div class="field"><div class="label">Highest Qualification</div><div class="value">${activeDirectoryEmployee.highestQualification || 'Not set'}</div></div>
                                        <div class="field"><div class="label">Bank Name</div><div class="value">${activeDirectoryEmployee.bankName || 'Not set'}</div></div>
                                      </div>
                                      <h2>R&D DEVELOPMENT FOCUS</h2>
                                      <p>${activeDirectoryEmployee.notes || 'Core software developer active in microservices architecture cycles.'}</p>
                                      <script>window.print();</script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }, 1200);
                          }}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group cursor-pointer"
                        >
                          <FileText className="w-4.5 h-4.5 text-rose-300 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-white tracking-tight">Print Dossier</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("leaves");
                            showToast("Navigated to leaves & scheduling planner.", "success");
                          }}
                          className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group cursor-pointer"
                        >
                          <Calendar className="w-4.5 h-4.5 text-emerald-300 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-white tracking-tight">Leave Balance</span>
                        </button>
                      </div>
                    </div>

                    {/* HR Ledger & Compliance Registry (Confidential) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-blue-600" /> HR Executive Ledger & Compliance
                          </h4>
                          <p className="text-[10px] text-slate-500">Confidential employee details for HR, administrative, and payroll records.</p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full font-mono">
                          Verified Profile
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Section 1: Personal & Demographics */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
                          <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <User className="w-3.5 h-3.5 text-slate-600" /> Personal & Demographics
                          </h5>
                          <div className="text-xs text-slate-600 space-y-2.5 font-sans">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Date of Birth:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.dob || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Gender:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.gender || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Blood Group:</span>
                              {activeDirectoryEmployee.bloodGroup ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/40">
                                  {activeDirectoryEmployee.bloodGroup}
                                </span>
                              ) : (
                                <span className="text-slate-850 font-semibold">—</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Marital Status:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.maritalStatus || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Nationality:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.nationality || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Personal Email:</span>
                              {activeDirectoryEmployee.personalEmail ? (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.personalEmail || "", "Personal Email")}
                                  className="text-slate-850 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer group text-right"
                                >
                                  <span className="font-mono text-xs truncate max-w-[150px]">{activeDirectoryEmployee.personalEmail}</span>
                                  <Copy className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ) : (
                                <span className="text-slate-800 font-semibold">—</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Emergency Contact:</span>
                              <span className="text-slate-805 font-semibold font-mono">{activeDirectoryEmployee.emergencyContact || "—"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Professional & Experience */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
                          <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <Briefcase className="w-3.5 h-3.5 text-slate-600" /> Professional & Experience
                          </h5>
                          <div className="text-xs text-slate-600 space-y-2.5 font-sans">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Employment Type:</span>
                              {activeDirectoryEmployee.employmentType ? (
                                <span className="inline-flex items-center text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/40">
                                  {activeDirectoryEmployee.employmentType}
                                </span>
                              ) : (
                                <span className="text-slate-800 font-semibold">—</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Probation Period:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.probationPeriod || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Highest Qualification:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.highestQualification || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Experience Years:</span>
                              <span className="text-slate-800 font-semibold">
                                {activeDirectoryEmployee.experienceYears !== undefined ? `${activeDirectoryEmployee.experienceYears} Years` : "—"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Work Location Hub:</span>
                              <span className="text-slate-800 font-semibold">{activeDirectoryEmployee.workLocation || "—"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Residential Addresses */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs md:col-span-2">
                          <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-600" /> Residential Addresses
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Current Address</span>
                                <p className="text-slate-700 mt-1.5 leading-relaxed font-medium">
                                  {activeDirectoryEmployee.currentAddress || "Not Provided"}
                                </p>
                              </div>
                              {activeDirectoryEmployee.currentAddress && (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.currentAddress || "", "Current Address")}
                                  className="mt-3 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer self-start"
                                >
                                  <Copy className="w-3 h-3" /> Copy Address
                                </button>
                              )}
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Permanent Address</span>
                                <p className="text-slate-700 mt-1.5 leading-relaxed font-medium">
                                  {activeDirectoryEmployee.permanentAddress || "Not Provided"}
                                </p>
                              </div>
                              {activeDirectoryEmployee.permanentAddress && (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.permanentAddress || "", "Permanent Address")}
                                  className="mt-3 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer self-start"
                                >
                                  <Copy className="w-3 h-3" /> Copy Address
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Section 4: National Identifiers & Financial Compliance */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
                          <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <Shield className="w-3.5 h-3.5 text-slate-600" /> National ID & Tax Registries
                          </h5>
                          <div className="text-xs text-slate-600 space-y-2.5 font-sans">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">National ID / NID:</span>
                              {activeDirectoryEmployee.nationalId ? (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.nationalId || "", "National ID")}
                                  className="text-slate-800 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer group"
                                >
                                  <span className="font-mono font-bold">{activeDirectoryEmployee.nationalId}</span>
                                  <Copy className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ) : (
                                <span className="text-slate-800 font-semibold">—</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Tax ID / TIN / SSN:</span>
                              {activeDirectoryEmployee.taxId ? (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.taxId || "", "Tax ID")}
                                  className="text-slate-800 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer group"
                                >
                                  <span className="font-mono font-bold">{activeDirectoryEmployee.taxId}</span>
                                  <Copy className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ) : (
                                <span className="text-slate-800 font-semibold">—</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Section 5: Banking & Payroll Settlement */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
                          <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <DollarSign className="w-3.5 h-3.5 text-slate-600" /> Banking & Payroll settlement
                          </h5>
                          <div className="text-xs text-slate-600 space-y-2.5 font-sans">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Bank Name:</span>
                              <span className="text-slate-850 font-bold">{activeDirectoryEmployee.bankName || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">Account Number:</span>
                              {activeDirectoryEmployee.bankAccountNumber ? (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.bankAccountNumber || "", "Bank Account Number")}
                                  className="text-slate-850 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer group"
                                >
                                  <span className="font-mono font-bold">{activeDirectoryEmployee.bankAccountNumber}</span>
                                  <Copy className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ) : (
                                <span className="text-slate-800 font-semibold">—</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-medium">IFSC / Routing Code:</span>
                              {activeDirectoryEmployee.bankIfscCode ? (
                                <button
                                  onClick={() => copyToClipboard(activeDirectoryEmployee.bankIfscCode || "", "Routing Code")}
                                  className="text-slate-850 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer group"
                                >
                                  <span className="font-mono font-bold">{activeDirectoryEmployee.bankIfscCode}</span>
                                  <Copy className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ) : (
                                <span className="text-slate-800 font-semibold">—</span>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Premium Integration: Interactive Git & R&D Linkages */}
                    <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 space-y-3 shadow-2xs">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Connected Developer Registries</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: "Git Registry", url: "https://github.com", icon: <GitBranch className="w-3.5 h-3.5 text-slate-700" /> },
                          { name: "LinkedIn", url: "https://linkedin.com", icon: <Briefcase className="w-3.5 h-3.5 text-slate-800" /> },
                          { name: "Jira Scrum", url: "https://atlassian.com", icon: <CheckSquare className="w-3.5 h-3.5 text-slate-800" /> },
                          { name: "Container Hub", url: "https://hub.docker.com", icon: <Database className="w-3.5 h-3.5 text-slate-800" /> }
                        ].map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:text-slate-900 transition-all shadow-2xs"
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              {link.icon}
                              <span className="truncate">{link.name}</span>
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* PREMIUM UI/UX IMPROVEMENT: "Developer Core Performance Index & KPI Grid" */}
                    <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-slate-900 animate-pulse" /> Developer KPI Intelligence
                        </h4>
                        <p className="text-[10px] text-slate-400">Continuous assessments calculated based on Git triggers, commits velocity, and QA coverage.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/90 border border-slate-200/60 p-4 rounded-2xl space-y-2 shadow-2xs relative">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Committed Stacks</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-slate-800 font-mono">18</span>
                            <span className="text-[10px] text-slate-500 font-semibold">Technologies</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 rounded-full" style={{ width: "78%" }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">Top Skill: TypeScript</span>
                        </div>

                        <div className="bg-white/90 border border-slate-200/60 p-4 rounded-2xl space-y-2 shadow-2xs relative">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Sprint Velocity</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-slate-800 font-mono">38</span>
                            <span className="text-[10px] text-slate-500 font-semibold">Story Points</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 rounded-full" style={{ width: "87%" }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">87.5% completion rate</span>
                        </div>

                        <div className="bg-white/90 border border-slate-200/60 p-4 rounded-2xl space-y-2 shadow-2xs relative">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Attendance Ratio</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-slate-800 font-mono">{activeRecord?.attendance || 98}%</span>
                            <span className="text-[10px] text-slate-500 font-semibold">This Cycle</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 rounded-full" style={{ width: `${activeRecord?.attendance || 98}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">Dhaka Hub Standard Shift</span>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Attendance Heatmap Calendar Component */}
                    <div id="attendance-heatmap-card" className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-900" /> Attendance Heatmap Calendar
                          </h4>
                          <p className="text-[10px] text-slate-400">Daily roster visualization for the selected workspace cycle.</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span id="selected-heatmap-month-badge" className="text-xs font-bold font-mono text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-xs">
                            {parsedMonth.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left Part: Calendar Heatmap Grid */}
                        <div className="md:col-span-8 space-y-3">
                          {/* Weekdays Header */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <span key={day} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                {day}
                              </span>
                            ))}
                          </div>

                          {/* Calendar Days */}
                          <div className="grid grid-cols-7 gap-1.5">
                            {daysArray.cells.map((cell, index) => {
                              if (cell.dayNumber === null) {
                                  return <div key={`empty-${index}`} className="aspect-square" />;
                              }

                              let cellClass = "aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all relative group cursor-pointer ";
                              let statusText = "Working Day";
                              
                              if (cell.status === "Future") {
                                cellClass += "bg-slate-50/40 border border-dashed border-slate-200 text-slate-400 cursor-not-allowed";
                                statusText = "Future Roster";
                              } else if (cell.status === "Weekend") {
                                cellClass += "bg-slate-100 border border-slate-200 text-slate-400";
                                statusText = "Weekend (Non-Working)";
                              } else if (cell.status === "Present") {
                                cellClass += "bg-emerald-50 border border-emerald-200/60 text-emerald-800 hover:bg-emerald-100";
                                statusText = "Present (Standard Shift)";
                              } else if (cell.status === "Leave") {
                                cellClass += "bg-amber-50 border border-amber-200/60 text-amber-800 hover:bg-amber-100";
                                statusText = "Approved Paid Leave";
                              } else if (cell.status === "Absent") {
                                cellClass += "bg-rose-50 border border-rose-200/60 text-rose-800 hover:bg-rose-100";
                                statusText = "Unexcused Absence";
                              }

                              return (
                                <div
                                  key={`day-${cell.dayNumber}`}
                                  id={`heatmap-cell-day-${cell.dayNumber}`}
                                  className={cellClass}
                                  title={`${parsedMonth.label.split(" ")[0]} ${cell.dayNumber}, ${parsedMonth.year}: ${statusText}`}
                                >
                                  <span>{cell.dayNumber}</span>
                                  
                                  {/* Micro indicator dot */}
                                  {cell.status !== "Weekend" && cell.status !== "Future" && (
                                    <span className={`w-1 h-1 rounded-full mt-0.5 ${
                                      cell.status === "Present" ? "bg-emerald-500" :
                                      cell.status === "Leave" ? "bg-amber-500" : "bg-rose-500"
                                    }`} />
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Part: Legend & Statistics */}
                        <div id="attendance-heatmap-legend" className="md:col-span-4 flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                          <div className="space-y-3">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Attendance Index</span>
                            
                            <div className="space-y-2.5">
                              {/* Present */}
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600/30" />
                                  <span className="text-slate-600 font-semibold">Present Days</span>
                                </div>
                                <span className="font-mono font-extrabold text-slate-800">{daysArray.pCount} days</span>
                              </div>

                              {/* Leave */}
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600/30" />
                                  <span className="text-slate-600 font-semibold">Approved Leaves</span>
                                </div>
                                <span className="font-mono font-extrabold text-slate-800">{daysArray.lCount} days</span>
                              </div>

                              {/* Absent */}
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-600/30" />
                                  <span className="text-slate-600 font-semibold">Absences</span>
                                </div>
                                <span className="font-mono font-extrabold text-slate-800">{daysArray.aCount} days</span>
                              </div>

                              {/* Weekend */}
                              <div className="flex items-center justify-between text-xs border-t border-dashed border-slate-200 pt-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-md bg-slate-200 border border-slate-300" />
                                  <span className="text-slate-500 font-medium">Weekends</span>
                                </div>
                                <span className="font-mono text-slate-500 font-semibold">{daysArray.cells.filter(c => c.status === "Weekend").length} days</span>
                              </div>
                            </div>
                          </div>

                           <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1 relative">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Roster Compliance</span>
                            <span className="text-base font-black font-mono text-slate-900">
                              {daysArray.workingDaysCount > 0 
                                ? `${Math.round((daysArray.pCount / daysArray.workingDaysCount) * 100)}%`
                                : "100%"}
                            </span>
                            <p className="text-[9px] text-slate-400">Calculated as Present Days / Working Days in cycle.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONFIDENTIAL MANAGER NOTES TIMELINE */}
                    <div id="manager-notes-section" className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-900" /> Manager Confidential Chronicle & Timeline
                          </h4>
                          <p className="text-[10px] text-slate-400">Chronological journal of 1-on-1 reviews, coaching feedback, and manager private notes.</p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono w-fit">
                          Confidential Access
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chronological Timeline column */}
                        <div className="lg:col-span-2 space-y-4">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Timeline History</h5>
                          
                          {(!activeDirectoryEmployee?.managerNotes || activeDirectoryEmployee.managerNotes.length === 0) ? (
                            <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2">
                              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                              <p className="text-xs text-slate-500 font-medium">No confidential notes recorded yet.</p>
                              <p className="text-[10px] text-slate-400 max-w-sm mx-auto">Use the quick-log panel on the right to post feedback, performance warnings, or milestone celebrations to this employee's timeline.</p>
                            </div>
                          ) : (
                            <div className="relative pl-4 border-l-2 border-slate-200/80 ml-2 space-y-6 py-2">
                              {[...(activeDirectoryEmployee.managerNotes || [])]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((note) => {
                                  const dateFormatted = new Date(note.createdAt).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  });
                                  return (
                                    <div key={note.id} className="relative group">
                                      {/* Timeline Bullet Node */}
                                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-white ring-4 ring-slate-100 group-hover:scale-125 transition-all" />
                                      
                                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-2 transition-all hover:border-slate-300 hover:shadow-2xs">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-750 bg-slate-200/80 px-2 py-0.5 rounded">
                                              {note.author}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                              {dateFormatted}
                                            </span>
                                          </div>

                                          <button
                                            onClick={() => {
                                              if (window.confirm("Are you sure you want to delete this confidential note?")) {
                                                handleDeleteManagerNote(note.id);
                                              }
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                                            title="Delete Note"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>

                                        <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                                          {note.text}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>

                        {/* Quick-Log Form column */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 h-fit">
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-slate-800" /> Log Confidential Observation
                            </h5>
                            <p className="text-[10px] text-slate-400">Post performance remarks or general milestones to the active dossier timeline.</p>
                          </div>

                          <form onSubmit={handleAddManagerNote} className="space-y-3">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Manager / Author Name</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                  <User className="w-3 h-3 text-slate-400" />
                                </span>
                                <input
                                  type="text"
                                  value={managerNoteAuthor}
                                  onChange={(e) => setManagerNoteAuthor(e.target.value)}
                                  placeholder="e.g. Marcus Aurelius"
                                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 font-sans"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Observation Note Content</label>
                              <textarea
                                value={managerNoteText}
                                onChange={(e) => setManagerNoteText(e.target.value)}
                                placeholder="Type confidential milestone, feedback summary, performance remarks..."
                                rows={4}
                                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 font-sans resize-none"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmittingNote}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-sm transition-all disabled:opacity-50"
                            >
                              {isSubmittingNote ? "Logging Note..." : "Log to Timeline"}
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. INTERACTIVE TECH STACK & RATINGS */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Assessed corporate engineering stacks synchronized from internal sandbox nodes, pull requests, and automated Jest coverage assessments:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Beautifully grouped stack grids */}
                      <div className="space-y-4">
                        {[
                          { key: "languages", label: "Programming Languages", color: "from-blue-500 to-cyan-500", icon: <Code2 className="w-3.5 h-3.5 text-slate-700" /> },
                          { key: "frontend", label: "Frontend Architecture", color: "from-indigo-500 to-purple-500", icon: <Layers className="w-3.5 h-3.5 text-slate-700" /> },
                          { key: "backend", label: "Backend & Microservices", color: "from-amber-500 to-orange-500", icon: <Server className="w-3.5 h-3.5 text-slate-700" /> },
                          { key: "cloudDevops", label: "Cloud Infra & CI/CD", color: "from-emerald-500 to-teal-500", icon: <Cloud className="w-3.5 h-3.5 text-slate-700" /> },
                          { key: "databases", label: "Databases & Brokers", color: "from-rose-500 to-red-500", icon: <Database className="w-3.5 h-3.5 text-slate-700" /> }
                        ].map((stack) => (
                          <div key={stack.key} className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-2xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              {stack.icon} {stack.label}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {skillsGrouped[stack.key as keyof typeof skillsGrouped].map((skill) => (
                                <span
                                  key={skill}
                                  onClick={() => handleRemoveSkill(stack.key as any, skill)}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-800 bg-slate-50 hover:bg-rose-50/50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-all flex items-center gap-1 group cursor-pointer shadow-2xs"
                                  title="De-register Technology"
                                >
                                  {skill}
                                  <span className="text-slate-400 group-hover:text-rose-600 transition-colors font-bold">×</span>
                                </span>
                              ))}
                              {skillsGrouped[stack.key as keyof typeof skillsGrouped].length === 0 && (
                                <span className="text-[10px] text-slate-400 italic">No verified skills registered.</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Premium Add Skill Form & Visual Aura Gauge */}
                      <div className="space-y-6">
                        
                        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Enlist Corporate Technology</h4>
                          <form onSubmit={handleAddSkill} className="space-y-3.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Technology Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Golang, GraphQL, Terraform"
                                value={newSkillText}
                                onChange={(e) => setNewSkillText(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 rounded-xl text-xs outline-none focus:bg-white transition-all placeholder:text-slate-400 font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Division Segment</label>
                              <select
                                value={newSkillCat}
                                onChange={(e) => setNewSkillCat(e.target.value as any)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 rounded-xl text-xs outline-none cursor-pointer focus:bg-white transition-all font-semibold text-slate-700"
                              >
                                <option value="languages">Programming Languages</option>
                                <option value="frontend">Frontend Architecture</option>
                                <option value="backend">Backend & Microservices</option>
                                <option value="cloudDevops">Cloud Infra & CI/CD</option>
                                <option value="databases">Databases & Brokers</option>
                              </select>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Authorize Technology Tag
                            </button>
                          </form>
                        </div>

                        {/* Premium Visual Rating Card */}
                        <div className="bg-slate-900 text-white p-5 rounded-3xl relative overflow-hidden shadow-sm border border-slate-800">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Flame className="w-32 h-32 stroke-[1px]" />
                          </div>
                          <div className="space-y-2 relative z-10">
                            <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 font-bold">IT Talent Architecture</span>
                            <h3 className="text-sm font-extrabold tracking-tight font-display">Grade A - Principal Engineer</h3>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Verified across {Object.values(skillsGrouped).flat().length} corporate technologies. Excellent microservices synergy.
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}
                {/* 3. ASSIGNED PROJECTS & SPRINT TICKETS */}
                {activeTab === "projects" && (
                  <div className="space-y-6">
                    
                    {/* Active Project Overview */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                      <div className="space-y-1.5">
                        <span className="inline-block text-[9px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                          Active Sprint: Cycle 14
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 font-display">Antigravity Distributed API Router Pipeline</h3>
                        <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-medium">
                          Refactoring monolithic session controls into HttpOnly secure cookies. Integrated to containerized environments on Cloud Run.
                        </p>
                      </div>
                      <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-center shrink-0 min-w-[120px] shadow-2xs relative">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Velocity Target</span>
                        <span className="block text-lg font-mono font-extrabold text-slate-900 mt-0.5">38 SP</span>
                        <span className="text-[9px] text-slate-400 font-bold">Q3 Goal Aligned</span>
                      </div>
                    </div>

                    {/* Jira Ticket Board */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Active Jira Board Issues</h4>
                        <p className="text-[10px] text-slate-400">Manage development states and log timesheets directly against sprint issues.</p>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 font-mono">ID</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Summary</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28">Sprint State</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Log Time</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-36 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {tickets.map((t) => (
                              editingTicketId === t.id ? (
                                <tr key={t.id} className="bg-slate-50/80">
                                  <td className="px-4 py-3 text-xs font-bold font-mono text-slate-900">{t.id}</td>
                                  <td className="px-4 py-3 text-xs font-semibold text-slate-700" colSpan={2}>
                                    <div className="space-y-2 py-1">
                                      <input
                                        type="text"
                                        value={editTicketTitle}
                                        onChange={(e) => setEditTicketTitle(e.target.value)}
                                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800 shadow-2xs"
                                        placeholder="Ticket summary..."
                                      />
                                      <div className="flex items-center gap-3">
                                        <select
                                          value={editTicketPriority}
                                          onChange={(e: any) => setEditTicketPriority(e.target.value)}
                                          className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
                                        >
                                          <option value="Low">Low</option>
                                          <option value="Medium">Medium</option>
                                          <option value="High">High</option>
                                          <option value="Critical">Critical</option>
                                        </select>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] text-slate-400 font-mono font-bold">SP:</span>
                                          <input
                                            type="number"
                                            value={editTicketSP}
                                            onChange={(e) => setEditTicketSP(Number(e.target.value) || 1)}
                                            className="w-12 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono outline-none text-center font-bold"
                                            min={1}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-xs font-mono font-bold text-slate-500 text-center">
                                    {t.loggedHours} hrs
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleSaveTicketEdit(t.id)}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] transition-colors cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingTicketId(null)}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition-colors cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3 text-xs font-bold font-mono text-slate-900">{t.id}</td>
                                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                                    <div className="space-y-0.5">
                                      <p className="font-display font-bold text-slate-800">{t.title}</p>
                                      <div className="flex items-center gap-1.5">
                                        <span className={`inline-block text-[9px] font-bold ${
                                          t.priority === "Critical" ? "text-red-700 bg-red-50 border border-red-100" : t.priority === "High" ? "text-orange-700 bg-orange-50 border border-orange-100" : "text-slate-600 bg-slate-50 border border-slate-200"
                                        } px-2 py-0.2 rounded-md font-mono shadow-2xs`}>
                                          {t.priority} Priority
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-mono font-bold">
                                          ({t.sp || 3} Story Points)
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => handleToggleTicketStatus(t.id, t.status)}
                                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                        t.status === "Done"
                                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                          : t.status === "In Review"
                                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                          : t.status === "In Progress"
                                          ? "bg-blue-50 border-blue-200 text-blue-700"
                                          : "bg-slate-50 border-slate-200 text-slate-600"
                                      }`}
                                    >
                                      {t.status}
                                    </button>
                                  </td>
                                  <td className="px-4 py-3 text-xs font-mono font-bold text-slate-500 text-center relative">
                                    {t.loggedHours} hrs
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <input
                                        type="number"
                                        placeholder="Hrs"
                                        value={timeToLog[t.id] || ""}
                                        onChange={(e) => setTimeToLog({ ...timeToLog, [t.id]: e.target.value })}
                                        className="w-12 px-1.5 py-1 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded text-[11px] font-mono outline-none text-center font-bold"
                                      />
                                      <button
                                        onClick={() => handleLogHours(t.id)}
                                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-[10px] transition-colors cursor-pointer"
                                      >
                                        Log
                                      </button>
                                      <button
                                        onClick={() => startEditingTicket(t)}
                                        className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
                                        title="Edit Ticket"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTicket(t.id)}
                                        className="p-1 rounded bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200 cursor-pointer"
                                        title="Delete Ticket"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Enlist Sprint Ticket Manager Form */}
                      <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 space-y-3.5 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Enlist Sprint Ticket</h4>
                            <p className="text-[10px] text-slate-400">Add an active ticket onto this employee's active development sprint.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAddingTicket(!isAddingTicket)}
                            className="text-[10px] font-bold text-slate-800 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                          >
                            {isAddingTicket ? "Hide Form" : "Create Ticket"}
                          </button>
                        </div>

                        {isAddingTicket && (
                          <form onSubmit={handleAddTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ticket Key (Optional)</label>
                              <input
                                type="text"
                                placeholder="e.g. DEV-1095 (Autogenerated if empty)"
                                value={newTicketId}
                                onChange={(e) => setNewTicketId(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ticket Summary</label>
                              <input
                                type="text"
                                placeholder="Describe the sprint scope..."
                                value={newTicketTitle}
                                onChange={(e) => setNewTicketTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-400"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3 md:col-span-2">
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Initial Status</label>
                                <select
                                  value={newTicketStatus}
                                  onChange={(e: any) => setNewTicketStatus(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none cursor-pointer font-semibold text-slate-700"
                                >
                                  <option value="To Do">To Do</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="In Review">In Review</option>
                                  <option value="Done">Done</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Priority</label>
                                <select
                                  value={newTicketPriority}
                                  onChange={(e: any) => setNewTicketPriority(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none cursor-pointer font-semibold text-slate-700"
                                >
                                  <option value="Low">Low Priority</option>
                                  <option value="Medium">Medium Priority</option>
                                  <option value="High">High Priority</option>
                                  <option value="Critical">Critical Priority</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Story Points</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={21}
                                  value={newTicketSP}
                                  onChange={(e) => setNewTicketSP(Number(e.target.value) || 3)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs outline-none font-semibold text-slate-800 font-mono"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2 pt-2">
                              <button
                                type="submit"
                                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                              >
                                Commit Sprint Ticket to Board
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DOCKER SETUP & CRYPTOGRAPHIC KEYS */}
                {activeTab === "dev_env" && (
                  <div className="space-y-6">
                    
                    {/* Machine Specifications */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-2xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs shrink-0">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Enterprise Asset ID: HN-M3-8820</span>
                          <h4 className="text-xs font-bold text-slate-800 font-display">Apple MacBook Pro 16" (M3 Max)</h4>
                          <p className="text-[10px] text-slate-500 font-mono">16-Core CPU / 36GB Unified RAM / 1TB SSD / macOS Sequoia</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-700 font-mono">
                        Hardware Insured
                      </span>
                    </div>

                    {/* Local Docker Containers */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <TerminalSquare className="w-3.5 h-3.5 text-slate-700" /> Local Docker Sandboxes
                        </h4>
                        <p className="text-[10px] text-slate-400">Simulated environments running on localhost developers loop.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {containers.map((c) => (
                          <div key={c.id} className="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center justify-between shadow-2xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 font-mono">{c.name}</span>
                                <span className={`inline-block w-2 h-2 rounded-full ${c.status === "running" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                              </div>
                              <p className="text-[9px] text-slate-400 font-mono">{c.image} | Port: {c.port}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleToggleDocker(c.id, c.name, c.status)}
                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                  c.status === "running" ? "bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100/50" : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {c.status === "running" ? "Stop" : "Start"}
                              </button>
                              <button
                                onClick={() => handleRestartDocker(c.name)}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                                title="Restart container daemon"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocker(c.id, c.name)}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200 transition-colors cursor-pointer"
                                title="Prune and Delete Container"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Register Container Sandbox Manager Form */}
                      <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 space-y-3.5 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Register Container Sandbox</h4>
                            <p className="text-[10px] text-slate-400">Launch a new backend mock container service in localhost sandbox environment.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAddingContainer(!isAddingContainer)}
                            className="text-[10px] font-bold text-slate-800 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                          >
                            {isAddingContainer ? "Hide Form" : "Add Service"}
                          </button>
                        </div>

                        {isAddingContainer && (
                          <form onSubmit={handleCreateDocker} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Container Name</label>
                              <input
                                type="text"
                                placeholder="e.g. postgres-replica"
                                value={newContainerName}
                                onChange={(e) => setNewContainerName(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800 placeholder:text-slate-400"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Docker Image</label>
                              <input
                                type="text"
                                placeholder="e.g. postgres:16-alpine"
                                value={newContainerImage}
                                onChange={(e) => setNewContainerImage(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800 placeholder:text-slate-400"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Host Ports mapping</label>
                              <input
                                type="text"
                                placeholder="e.g. 5433:5432"
                                value={newContainerPort}
                                onChange={(e) => setNewContainerPort(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800 placeholder:text-slate-400"
                              />
                            </div>
                            <div className="sm:col-span-3 pt-1">
                              <button
                                type="submit"
                                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                              >
                                Deploy Service to Sandbox
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>

                    {/* SSH Public Keys */}                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-slate-200">
                      
                      {/* Active keys */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">SSH Public Registries</h4>
                        <div className="space-y-3">
                          {sshKeys.map((k) => (
                            <div key={k.id} className="bg-white border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs relative shadow-2xs">
                              <button
                                onClick={() => handleRemoveSSHKey(k.id, k.name)}
                                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Revoke access GPG"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-slate-900 font-display">{k.name}</h5>
                                <p className="text-[10px] text-slate-400 font-mono">{k.type} | Added: {k.date}</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <span className="font-mono text-[9px] text-slate-600 truncate flex-1 leading-none select-all">
                                  {k.fingerprint}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(k.fingerprint, "SSH Fingerprint")}
                                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                                  title="Copy Fingerprint"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {sshKeys.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-xs italic">
                              No public credentials registered.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add SSH credentials */}
                      <div className="bg-white/90 border border-slate-200/60 p-5 rounded-2xl shadow-2xs space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Enlist GPG/SSH public key</h4>
                        <form onSubmit={handleAddSSHKey} className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Identifier</label>
                            <input
                              type="text"
                              placeholder="e.g. mbp-workstation"
                              value={newKeyName}
                              onChange={(e) => setNewKeyName(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 focus:bg-white rounded-xl text-xs outline-none transition-all font-semibold text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Cipher Type</label>
                            <select
                              value={newKeyType}
                              onChange={(e) => setNewKeyType(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 focus:bg-white rounded-xl text-xs outline-none cursor-pointer transition-all font-semibold text-slate-700"
                            >
                              <option value="ssh-ed25519">ssh-ed25519 (Secure)</option>
                              <option value="ssh-rsa">ssh-rsa (Legacy)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Public Content</label>
                            <textarea
                              rows={3}
                              placeholder="ssh-ed25519 AAAA..."
                              value={newKeyContent}
                              onChange={(e) => setNewKeyContent(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 focus:bg-white rounded-xl text-xs outline-none transition-all font-mono text-slate-700 text-[11px] resize-none leading-relaxed"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                          >
                            Deploy Key Token
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>
                )}

                {/* 5. GIT PULSE & CI/CD PIPELINE */}
                {activeTab === "git_pulse" && (
                  <div className="space-y-6">
                    
                    {/* Manual action trigger */}
                    <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono uppercase">
                          GitHub Deployment: Passing
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 font-display">Production Webhook Sync Lock</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Continuous deployments triggers commits directly onto live staging containers.</p>
                      </div>
                      <button
                        onClick={handleTriggerBuild}
                        disabled={isBuildTriggering}
                        className={`px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm ${isBuildTriggering ? "animate-pulse" : ""}`}
                      >
                        <Play className="w-3.5 h-3.5" /> {isBuildTriggering ? "Building Sandbox..." : "Trigger Deployment"}
                      </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">                      {[
                        { label: "Commits Pushed", value: "148 commits", desc: "This Month Cycle" },
                        { label: "Pull Requests Merged", value: "22 PRs", desc: "100% Approval Rate" },
                        { label: "Peer Reviews Completed", value: "18 logs", desc: "R&D Collaborations" },
                        { label: "Lines of Code (LoC)", value: "+14,200", desc: "-4,800 Clean deletions" },
                        { label: "Test Coverage Average", value: "87.4%", desc: "Strict Jest Validations" },
                        { label: "CI Pipeline Runtime", value: "3m 42s", desc: "Standard Actions runtime" }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/90 border border-slate-200/60 p-4 rounded-xl shadow-2xs space-y-1 relative">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{stat.label}</span>
                          <span className="block text-sm font-extrabold font-mono text-slate-900">{stat.value}</span>
                          <span className="block text-[10px] text-slate-400 font-semibold">{stat.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress bars */}
                    <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-2xs">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Continuous Quality Inspections</h4>
                      <div className="space-y-4">
                        {[
                          { label: "Production Build Stability Health", val: 98, color: "bg-slate-900" },
                          { label: "Unit & Core Integration Coverage Ratio", val: 87.4, color: "bg-slate-700" },
                          { label: "Linting & Code Smells Quality index", val: 94, color: "bg-slate-800" }
                        ].map((bar, idx) => (
                          <div key={idx} className="space-y-1.5 text-left text-xs">
                            <div className="flex justify-between text-slate-500 font-semibold text-[11px]">
                              <span>{bar.label}</span>
                              <span className="font-mono font-bold text-slate-800">{bar.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${bar.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 6. LEAVES & TIMESHEET SCHEDULES */}
                {activeTab === "leaves" && (
                  <div className="space-y-6">
                    
                    {/* Time Off Balance Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Casual Leaves (Paid)", balance: "7 / 10 days", used: "3 used", color: "border-slate-200 text-slate-800 bg-slate-50 shadow-2xs" },
                        { label: "Sick Leaves (Medical)", balance: "12 / 14 days", used: "2 used", color: "border-slate-200 text-slate-800 bg-slate-50 shadow-2xs" },
                        { label: "Festival / Holiday Break", balance: "4 / 8 days", used: "4 used", color: "border-slate-200 text-slate-800 bg-slate-50 shadow-2xs" }
                      ].map((bal, i) => (
                        <div key={i} className={`border p-4 rounded-xl text-center space-y-1 relative ${bal.color}`}>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{bal.label}</span>
                          <span className="block text-xs font-extrabold font-mono text-slate-800">{bal.balance}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{bal.used}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clock-In Compliance info */}
                    <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Timesheet compliance roster</span>
                        <h4 className="text-xs font-bold text-slate-800 font-display">Shift: 09:00 AM - 06:00 PM BST (Standard Hub)</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Average Clock-In timing over 30 days: <strong className="font-mono text-slate-800">09:12 AM</strong> (Excellent compliance ratio).</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800 font-mono">
                        Roster Aligned
                      </span>
                    </div>

                    {/* PTO Apply form & application logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* PTO Apply form */}
                      <div className="bg-white/90 border border-slate-200/60 p-5 rounded-2xl shadow-2xs space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Apply for Time Off</h4>
                        <form onSubmit={handleApplyLeave} className="space-y-3.5">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Start Date</label>
                              <input
                                type="date"
                                value={leaveStart}
                                onChange={(e) => setLeaveStart(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">End Date</label>
                              <input
                                type="date"
                                value={leaveEnd}
                                onChange={(e) => setLeaveEnd(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Leave Classification</label>
                            <select
                              value={leaveType}
                              onChange={(e) => setLeaveType(e.target.value as any)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 rounded-xl text-xs outline-none cursor-pointer font-semibold text-slate-700"
                            >
                              <option value="Casual">Casual Leave (Paid)</option>
                              <option value="Sick">Sick Leave (Medical)</option>
                              <option value="Gov/Fest">Festival / Religious Break</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Cover Notes / Remarks</label>
                            <textarea
                              rows={2}
                              placeholder="Describe purpose of paid time off..."
                              value={leaveNotes}
                              onChange={(e) => setLeaveNotes(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 rounded-xl text-xs outline-none resize-none text-slate-700 text-[11px]"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                          >
                            Submit Leave Application
                          </button>
                        </form>
                      </div>

                      {/* Request audits list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">My PTO Logs</h4>
                        <div className="space-y-3">
                          {leaveRequests.map((lr) => (
                            <div key={lr.id} className="bg-white/90 border border-slate-200/60 rounded-xl p-3.5 space-y-2.5 text-xs shadow-2xs relative">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-slate-900 font-mono">{lr.type} Leave ({lr.days} days)</span>
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{lr.start} to {lr.end}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                    lr.status === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : lr.status === "Rejected" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-amber-50 border-amber-200 text-amber-800"
                                  }`}>
                                    {lr.status}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-600 leading-relaxed italic text-[11px]">"{lr.notes}"</p>

                              {/* Manager quick audits */}
                              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                                <span className="text-slate-400 font-mono font-bold">Audit Controls:</span>
                                <div className="flex items-center gap-1.5">
                                  {lr.status === "Pending" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateLeaveStatus(lr.id, "Approved")}
                                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleUpdateLeaveStatus(lr.id, "Rejected")}
                                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleDeleteLeaveRequest(lr.id)}
                                    className="p-1 rounded bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200 cursor-pointer"
                                    title="Cancel Request"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {leaveRequests.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-xs italic">
                              No leave logs or pending applications.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 7. COMPENSATION & OKRs PROGRESS */}
                {activeTab === "career" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Compensation structure */}
                      <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">Compensation Package</span>
                          <div className="space-y-2.5">
                            <div className="flex justify-between border-b border-slate-200 pb-1.5 text-xs relative group/comp cursor-help">
                              <span className="text-slate-500 font-semibold">Annual Gross</span>
                              <span className="text-slate-900 font-extrabold font-mono">${(activeDirectoryEmployee.salary || 55000).toLocaleString()}/yr</span>

                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full mb-2 hidden group-hover/comp:flex flex-col items-center z-50 pointer-events-none w-56 left-1/2 -translate-x-1/2">
                                <div className="bg-slate-950 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-md border border-slate-800 font-sans leading-normal font-medium text-center">
                                  <strong>Annual Gross:</strong> Contractual base salary package prior to standard tax withholdings or benefit deductibles.
                                </div>
                                <div className="w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-1 border-r border-b border-slate-800" />
                              </div>
                            </div>

                            <div className="flex justify-between border-b border-slate-200 pb-1.5 text-xs relative group/comp cursor-help">
                              <span className="text-slate-500 font-semibold">Monthly Salary</span>
                              <span className="text-slate-800 font-bold font-mono">${Math.round((activeDirectoryEmployee.salary || 55000) / 12).toLocaleString()}/mo</span>

                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full mb-2 hidden group-hover/comp:flex flex-col items-center z-50 pointer-events-none w-56 left-1/2 -translate-x-1/2">
                                <div className="bg-slate-950 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-md border border-slate-800 font-sans leading-normal font-medium text-center">
                                  <strong>Monthly Salary:</strong> Calculated directly as Annual Gross / 12, processed on the final weekday of each month.
                                </div>
                                <div className="w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-1 border-r border-b border-slate-800" />
                              </div>
                            </div>

                            <div className="flex justify-between text-xs relative group/comp cursor-help">
                              <span className="text-slate-500 font-semibold">Hike Adjustments</span>
                              <span className="text-slate-800 font-bold font-mono">{(activeDirectoryEmployee.incrementHistory || []).length} recorded</span>

                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full mb-2 hidden group-hover/comp:flex flex-col items-center z-50 pointer-events-none w-56 left-1/2 -translate-x-1/2">
                                <div className="bg-slate-950 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-md border border-slate-800 font-sans leading-normal font-medium text-center">
                                  <strong>Hike Adjustments:</strong> Historical count of salary adjustments and performance merit raises logged for this profile.
                                </div>
                                <div className="w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-1 border-r border-b border-slate-800" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 italic mt-4">
                          Compensation package synced with global payroll cycles.
                        </div>
                      </div>

                      {/* Hike progression histories */}
                      <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Raise Progression</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIncrementFormData({
                                  newSalary: (activeDirectoryEmployee.salary || 55000) + 5000,
                                  remarks: "Based on outstanding sprint and OKR milestones",
                                  date: new Date().toISOString().split("T")[0]
                                });
                                setIsIncrementModalOpen(true);
                              }}
                              className="text-[9px] font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                            >
                              Log Raise
                            </button>
                          </div>

                          <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                            {(!activeDirectoryEmployee.incrementHistory || activeDirectoryEmployee.incrementHistory.length === 0) ? (
                              <div className="text-center py-8 text-slate-400 text-xs italic">
                                No registered raises logged yet.
                              </div>
                            ) : (
                              activeDirectoryEmployee.incrementHistory.map((inc, index) => {
                                const increasePct = Math.round(((inc.newSalary - inc.previousSalary) / inc.previousSalary) * 100);
                                return (
                                  <div key={index} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs shadow-2xs">
                                    <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold mb-1">
                                      <span>{inc.date}</span>
                                      <span className="text-slate-800">+{increasePct}% Hike</span>
                                    </div>
                                    <div className="font-bold font-mono text-slate-800">
                                      ${inc.previousSalary.toLocaleString()} → <span className="text-slate-900">${inc.newSalary.toLocaleString()}</span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* OKRs & Performance */}
                    <div className="bg-white/90 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Objective Key Results (OKRs) - Q3 2026</h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingOkr(!isAddingOkr)}
                          className="text-[10px] font-bold text-slate-800 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                        >
                          {isAddingOkr ? "Cancel" : "Add OKR Target"}
                        </button>
                      </div>

                      {/* OKR Creation Form */}
                      {isAddingOkr && (
                        <form onSubmit={handleAddOkr} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Objective Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Optimize search database indexing"
                                value={newOkrTitle}
                                onChange={(e) => setNewOkrTitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Target Metric / Metric Indicator</label>
                              <input
                                type="text"
                                placeholder="e.g. Goal: Under 150ms response latency"
                                value={newOkrMetric}
                                onChange={(e) => setNewOkrMetric(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-800 rounded-lg text-xs outline-none font-semibold text-slate-800"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 font-mono font-bold">Initial Progress:</span>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={newOkrPct}
                                onChange={(e) => setNewOkrPct(Number(e.target.value) || 0)}
                                className="w-16 px-1.5 py-1 bg-white border border-slate-200 rounded text-center font-bold font-mono"
                              />
                              <span className="font-mono font-bold text-slate-500">%</span>
                            </div>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer transition-all shadow-2xs"
                            >
                              Add OKR Target
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-4">
                        {okrs.map((okr, index) => (
                          <div key={index} className="space-y-1.5 text-left text-xs bg-slate-50/40 border border-slate-100 p-3.5 rounded-xl">
                            <div className="flex justify-between items-start text-slate-600 font-semibold text-[11px] gap-4">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-800">{okr.title}</span>
                                <p className="text-[9px] font-mono font-semibold text-slate-400">{okr.metric}</p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-1 bg-white border border-slate-200/60 px-1.5 py-0.5 rounded-md font-bold text-slate-800">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={okr.pct}
                                    onChange={(e) => handleUpdateOkrPct(index, Number(e.target.value) || 0)}
                                    className="w-10 bg-transparent text-center font-bold text-slate-800 font-mono text-[11px] outline-none"
                                  />
                                  <span className="font-mono text-slate-400 text-[10px] font-bold">%</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOkr(index)}
                                  className="text-slate-400 hover:text-rose-600 p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                  title="Remove Objective"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-slate-950 rounded-full transition-all duration-300"
                                style={{ width: `${okr.pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                        {okrs.length === 0 && (
                          <div className="text-center py-6 text-slate-400 italic text-xs">
                            No active Objective Key Results mapped to this cycle.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KPI Cycle List */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Assessments Cycle History</h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/90 shadow-2xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">Seq</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assessment Cycle</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Ratio</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">AI Assistant Sync</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {performance
                              .filter(p => p.employeeId === activeDirectoryEmployee.id)
                              .sort((a, b) => b.month.localeCompare(a.month))
                              .map((p, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3 text-xs text-slate-400 font-bold font-mono">{idx + 1}</td>
                                  <td className="px-4 py-3 text-xs font-bold text-slate-800 font-mono">{p.month}</td>
                                  <td className="px-4 py-3 text-xs text-slate-600 font-mono">{p.attendance}% attendance</td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      onClick={() => handleQuickAnalyze(p.month)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-2xs"
                                    >
                                      Run AI Audit
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

                {/* 8. GEMINI CO-PILOT CHAT WORKSPACE */}
                {activeTab === "copilot" && (
                  <div className="flex flex-col h-[520px] justify-between">
                    
                    {/* Message list */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 no-scrollbar">
                      <div className="flex gap-3 bg-white/90 border border-slate-200/60 p-4 rounded-2xl shadow-2xs">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-800 font-bold">Gemini Talent Co-pilot</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            Hello! I am your Gemini Technical Success advisor. I can analyze {activeDirectoryEmployee.name}'s technology stacks, active sprint issues, GPG credentials compliance, or draft custom promotion recommendations. Let's begin!
                          </p>
                        </div>
                      </div>

                      {copilotMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 p-4 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-slate-900 text-white ml-8 shadow-sm border border-slate-800"
                              : "bg-white/90 border border-slate-200/60 mr-8 shadow-2xs"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.sender === "user"
                              ? "bg-slate-800 text-slate-100"
                              : "bg-slate-100 border border-slate-200 text-slate-800"
                          }`}>
                            {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className="space-y-1 w-full min-w-0">
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${msg.sender === "user" ? "text-slate-300" : "text-slate-700"}`}>
                              {msg.sender === "user" ? "Corporate Admin" : "Gemini Talent Advisor"}
                            </span>
                            <p className="text-xs leading-relaxed whitespace-pre-line font-sans font-medium break-words">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isCopilotLoading && (
                        <div className="flex gap-3 bg-white/90 border border-slate-200/60 p-4 rounded-2xl mr-8">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 animate-bounce">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Compiling engineering logs...</span>
                            <div className="flex gap-1.5 py-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommendation Quick Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-3 pt-2 border-t border-dashed border-slate-200 no-scrollbar">
                      {[
                        { text: "Draft Promotion Letter", prompt: "Write a detailed technical promotion recommendation for this developer advocating to transition them to Level-3 Senior Staff Engineer." },
                        { text: "Suggest Technologies", prompt: "Analyze the current skill set and active sprint metrics to suggest 3 next-gen technologies this developer can learn to align with Q4 R&D goals." },
                        { text: "Synthesize Sprint Feedback", prompt: "Produce a detailed sprint analysis based on their active tickets and time logged for developer performance check-ins." }
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendCopilotMessage(preset.prompt)}
                          disabled={isCopilotLoading}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-[10px] font-bold cursor-pointer shrink-0 transition-colors disabled:opacity-50 font-display shadow-2xs"
                        >
                          {preset.text}
                        </button>
                      ))}
                    </div>

                    {/* Input message form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (copilotInput.trim()) handleSendCopilotMessage();
                      }}
                      className="flex gap-2.5 pt-2"
                    >
                      <input
                        type="text"
                        placeholder="Inquire about career paths, credentials, OKR metrics, or sprint tickets..."
                        value={copilotInput}
                        onChange={(e) => setCopilotInput(e.target.value)}
                        disabled={isCopilotLoading}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800/10 focus:bg-white text-slate-800 text-xs rounded-xl focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 font-medium font-sans"
                      />
                      <button
                        type="submit"
                        disabled={isCopilotLoading || !copilotInput.trim()}
                        className="w-11 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Footer synchronized brand details */}
          <div className="border-t border-dashed border-slate-200 pt-5 mt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider gap-3 font-mono">
            <span>R&D TALENT CONSOLE SYNCED</span>
            <span className="text-slate-500">Continuous Staging Sync</span>
          </div>

        </div>

      </div>

    </div>
  );
}
