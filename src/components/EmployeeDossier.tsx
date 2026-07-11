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
  showToast
}: EmployeeDossierProps) {
  // Navigation tabs - curated for an elite Software R&D Workspace
  const [activeTab, setActiveTab] = useState<
    "profile" | "skills" | "projects" | "dev_env" | "git_pulse" | "leaves" | "career" | "copilot"
  >("profile");

  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [headerDropdownSearch, setHeaderDropdownSearch] = useState("");

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
  const [tickets, setTickets] = useState([
    { id: "DEV-1084", title: "Migrate core auth routes to HttpOnly secure stateful cookies", status: "In Progress", priority: "High", loggedHours: 12 },
    { id: "DEV-1085", title: "Refactor database query indexes in billing pipeline", status: "In Review", priority: "Critical", loggedHours: 24 },
    { id: "DEV-1077", title: "Implement real-time notification triggers via WebSockets", status: "Done", priority: "Medium", loggedHours: 18 },
    { id: "DEV-1092", title: "Write end-to-end integration tests for leave submission portal", status: "To Do", priority: "Medium", loggedHours: 0 }
  ]);

  const [timeToLog, setTimeToLog] = useState<{ [key: string]: string }>({});

  // Local Dev Docker Containers
  const [containers, setContainers] = useState([
    { id: "c1", name: "postgres-primary-db", image: "postgres:16-alpine", port: "5432:5432", status: "running" },
    { id: "c2", name: "redis-distributed-cache", image: "redis:7.2-alpine", port: "6379:6379", status: "running" },
    { id: "c3", name: "rabbitmq-broker", image: "rabbitmq:3-management", port: "5672:5672", status: "stopped" },
    { id: "c4", name: "microservice-auth-node", image: "node:20-alpine", port: "8080:8080", status: "running" }
  ]);

  // SSH & Cryptographic credentials
  const [sshKeys, setSshKeys] = useState([
    { id: "key-1", name: "main-company-macbook-pro", type: "ssh-ed25519", fingerprint: "SHA256:7uKdfH910Klap2Mnd7893KaOpQ11", date: "12-Jan-2026" },
    { id: "key-2", name: "backup-linux-tower", type: "ssh-rsa", fingerprint: "SHA256:92MdKaPq930Kdn71PqO928sJdKw911Kj", date: "28-May-2026" }
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("ssh-ed25519");
  const [newKeyContent, setNewKeyContent] = useState("");

  // IT Farm Leaves & Attendance
  const [leaveRequests, setLeaveRequests] = useState([
    { id: "LR-51", type: "Casual", start: "2026-07-20", end: "2026-07-22", days: 3, status: "Pending", notes: "Attending technical conference" },
    { id: "LR-44", type: "Sick", start: "2026-06-02", end: "2026-06-03", days: 2, status: "Approved", notes: "Emergency medical root canal" }
  ]);

  const [leaveType, setLeaveType] = useState<"Sick" | "Casual" | "Gov/Fest">("Casual");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveNotes, setLeaveNotes] = useState("");

  // Webhook trigger state
  const [isBuildTriggering, setIsBuildTriggering] = useState(false);

  // Sync state whenever the active employee changes
  useEffect(() => {
    if (activeDirectoryEmployee) {
      // Keep standard tags but enrich if needed
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

  // Tech stack mutations
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const cleanText = newSkillText.trim();
    if (skillsGrouped[newSkillCat].includes(cleanText)) {
      showToast(`${cleanText} already registered in this stack division`, "error");
      return;
    }
    setSkillsGrouped(prev => ({
      ...prev,
      [newSkillCat]: [...prev[newSkillCat], cleanText]
    }));
    setNewSkillText("");
    showToast(`Added ${cleanText} to corporate core tech stacks`, "success");
  };

  const handleRemoveSkill = (category: keyof typeof skillsGrouped, skill: string) => {
    setSkillsGrouped(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s !== skill)
    }));
    showToast(`Removed skill tag: ${skill}`, "success");
  };

  // Ticket status mutations
  const handleToggleTicketStatus = (ticketId: string, currentStatus: string) => {
    const sequence = ["To Do", "In Progress", "In Review", "Done"];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];

    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
    showToast(`Ticket ${ticketId} transitioned to ${nextStatus}`, "success");
  };

  const handleLogHours = (ticketId: string) => {
    const hours = parseFloat(timeToLog[ticketId] || "0");
    if (isNaN(hours) || hours <= 0) {
      showToast("Please specify a valid floating point hour count", "error");
      return;
    }
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, loggedHours: t.loggedHours + hours } : t))
    );
    setTimeToLog(prev => ({ ...prev, [ticketId]: "" }));
    showToast(`Pushed logs: +${hours} dev-hours onto ${ticketId}`, "success");
  };

  // Docker command simulations
  const handleToggleDocker = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === "running" ? "stopped" : "running";
    setContainers(prev =>
      prev.map(c => (c.id === id ? { ...c, status: nextStatus } : c))
    );
    showToast(`Docker container [${name}] set to: ${nextStatus}`, "success");
  };

  const handleRestartDocker = (name: string) => {
    showToast(`Docker daemon restarting container [${name}]...`, "success");
    setTimeout(() => {
      showToast(`Docker container [${name}] boot successful`, "success");
    }, 800);
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

    setSshKeys(prev => [...prev, newKey]);
    setNewKeyName("");
    setNewKeyContent("");
    showToast("Cryptographic SSH public key configured successfully", "success");
  };

  const handleRemoveSSHKey = (id: string, name: string) => {
    setSshKeys(prev => prev.filter(k => k.id !== id));
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

    setLeaveRequests(prev => [newReq, ...prev]);
    setLeaveStart("");
    setLeaveEnd("");
    setLeaveNotes("");
    showToast(`Submitted leave application: ${daysCalc} days of ${leaveType} leave pending audit`, "success");
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
      <div className="flex-1 w-full p-8 lg:p-12 overflow-y-auto bg-slate-50/60 text-slate-800 flex flex-col items-center justify-center min-h-[80vh] font-sans">
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm animate-pulse">
          <Bot className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-display">No Active Talent Record</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-xs text-center leading-relaxed">
          Select or enroll an employee profile from the central directory to view their Software IT Farm talent dossiers.
        </p>
        <button
          onClick={handleOpenAddEmployee}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
        >
          <UserPlus className="w-3.5 h-3.5" /> Enroll Team Member
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto bg-slate-50/40 text-slate-800 relative min-h-screen font-sans">
      
      {/* Premium subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* LEFT COLUMN: Sidebar Navigation Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Curated Dropdown Selector for Employee Profiles */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
                className="w-full px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 rounded-2xl flex items-center justify-between cursor-pointer text-xs font-semibold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:outline-none"
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
                  <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl z-40 py-2 flex flex-col max-h-[250px] overflow-hidden">
                    <div className="px-3 pb-2 pt-1 border-b border-slate-100 relative">
                      <Search className="absolute left-6 top-3.5 h-3 w-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={headerDropdownSearch}
                        onChange={(e) => setHeaderDropdownSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
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
                              activeDirectoryEmployee.id === emp.id ? "bg-blue-50/70 text-blue-600 font-bold border-l-4 border-blue-500" : "text-slate-600"
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
              className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-[0_2px_8px_rgba(37,99,235,0.2)] shrink-0 border border-blue-500/10"
              title="Enroll New Developer"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          </div>

          {/* Left Main Profile Card - Reimagined with Premium Vercel/Linear elegance */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center text-center relative overflow-hidden group">
            
            {/* Elegant glass active status pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 border border-emerald-150 text-emerald-700 font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Active R&D Sync
            </div>

            <button 
              onClick={() => showToast(`Dossier assessment completeness at ${profileCompletion}%`, "success")}
              className="absolute top-4 right-4 text-slate-350 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Premium Avatar Visualizer with Double Halo Gradient */}
            <div className="relative mt-8 mb-5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-10 blur-md scale-110" />
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  className="text-slate-100"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  className="text-blue-600 transition-all duration-1000 ease-out"
                  strokeWidth="2.5"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 - (276.46 * profileCompletion) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-2 rounded-full overflow-hidden bg-slate-50 border border-slate-200/40 p-1">
                <img
                  src={get3DAvatarUrl(activeDirectoryEmployee.name)}
                  alt={activeDirectoryEmployee.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Profile Identifiers & Meta */}
            <div className="space-y-1 w-full">
              <h3 className="text-base font-bold text-slate-800 tracking-tight font-display">{activeDirectoryEmployee.name}</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100/80 px-2 py-0.5 rounded-md inline-block">
                ID: {activeDirectoryEmployee.id}
              </p>
              <p className="text-xs font-semibold text-blue-600 font-mono mt-1">{activeDirectoryEmployee.role}</p>
              <p className="text-[11px] text-slate-500 font-medium">{activeDirectoryEmployee.email}</p>
              <p className="text-[10px] text-slate-400 font-mono">Hub: {activeDirectoryEmployee.team || "Core Engineering"}</p>
            </div>

            <div className="w-full border-t border-dashed border-slate-150 my-5" />

            {/* Clean Progress Tracker */}
            <div className="w-full space-y-1.5 text-left">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <span>Dossier Quality</span>
                <span className="text-blue-600">{profileCompletion}%</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            {/* Compact Action Panel with Elegant Labelings */}
            <div className="flex items-center justify-center gap-2.5 w-full border-t border-dashed border-slate-150 pt-4 mt-5">
              <button
                onClick={() => handleOpenEditEmployee(activeDirectoryEmployee)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all cursor-pointer border border-slate-200/60 text-[10px] font-bold"
                title="Edit Developer Information"
              >
                <Edit3 className="w-3 h-3" /> Edit Profile
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
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-600 hover:text-blue-700 transition-all cursor-pointer border border-blue-200/40 text-[10px] font-bold"
                title="Log Annual Hike"
              >
                <TrendingUp className="w-3 h-3" /> Salary Hike
              </button>
              <button
                onClick={() => handleDeleteEmployeeClick(activeDirectoryEmployee)}
                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-all cursor-pointer border border-rose-200/40"
                title="De-register Developer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Left Vertical Navigation tabs (Sleeker, Border-anchored list design with check indicators) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-1.5">
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
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border ${
                    isSelected
                      ? "bg-slate-900 border-slate-950 text-white font-semibold shadow-sm"
                      : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span className={isSelected ? "text-white" : tab.highlight ? "text-blue-600 font-bold" : "text-slate-400"}>
                      {tab.icon}
                    </span>
                    <span className={tab.highlight && !isSelected ? "text-blue-600 font-bold" : ""}>
                      {tab.label}
                    </span>
                  </span>
                  
                  {tab.isCompleted ? (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-emerald-50 border border-emerald-200 text-emerald-600"
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Tab Panel Display Panel - High End Visual Polish */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[700px] relative overflow-hidden">
          
          <div className="w-full">
            
            {/* Header Title with quick edit triggers */}
            <div className="flex items-center justify-between border-b border-dashed border-slate-150 pb-4 mb-6">
              <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase font-mono flex items-center gap-2">
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
                className="p-2 rounded-xl bg-slate-55 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-all cursor-pointer"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-gradient-to-bl from-blue-500/10 to-transparent w-24 h-24 rounded-bl-full pointer-events-none" />
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Engineering Name</span>
                        <span className="block text-xs font-bold text-slate-800 mt-1 font-display">{activeDirectoryEmployee.name}</span>
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
                        <span className="block text-xs font-semibold text-blue-600 mt-1 font-mono">U05{activeDirectoryEmployee.id.toUpperCase()}L9K</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Company Join Date</span>
                        <span className="block text-xs font-bold text-slate-800 mt-1 font-mono">{activeDirectoryEmployee.joiningDate || "12-Jan-2025"}</span>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-slate-200/40">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">R&D Core Focus Summary</span>
                        <p className="text-xs text-slate-600 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                          "{activeDirectoryEmployee.notes || "Core software development contributor active in microservices architecture cycles."}"
                        </p>
                      </div>
                    </div>

                    {/* Integrated Sub-sections: Location Hub & Academics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Office Hub Location */}
                      <div className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-5 space-y-3.5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" /> Physical Office Location
                        </h4>
                        <div className="text-xs text-slate-600 space-y-2 bg-white p-3 rounded-xl border border-slate-150/50">
                          <p className="flex justify-between"><strong>Physical Hub:</strong> <span className="text-slate-800">Dhaka HQ, Tower B</span></p>
                          <p className="flex justify-between"><strong>Present Unit:</strong> <span className="text-slate-800">Banani, Road 12, Dhaka</span></p>
                          <p className="flex justify-between"><strong>Home Town:</strong> <span className="text-slate-800 font-mono">Sylhet Sadar, Sylhet</span></p>
                        </div>
                      </div>

                      {/* Educational Credentials */}
                      <div className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-5 space-y-3.5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Academic Credentials
                        </h4>
                        <div className="text-xs text-slate-600 space-y-2.5 bg-white p-3 rounded-xl border border-slate-150/50 font-sans">
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">B.Sc. in Computer Science & Engineering</p>
                            <p className="text-[10px] text-slate-400 font-mono">Dhaka University of Engineering & Tech</p>
                          </div>
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <Award className="w-2.5 h-2.5" /> Duet Verified Talent
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Premium Integration: Interactive Git & R&D Linkages */}
                    <div className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-5 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Connected Developer Registries</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: "Git Registry", url: "https://github.com", icon: <GitBranch className="w-3.5 h-3.5 text-slate-700" /> },
                          { name: "LinkedIn", url: "https://linkedin.com", icon: <Briefcase className="w-3.5 h-3.5 text-blue-700" /> },
                          { name: "Jira Scrum", url: "https://atlassian.com", icon: <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> },
                          { name: "Container Hub", url: "https://hub.docker.com", icon: <Database className="w-3.5 h-3.5 text-cyan-600" /> }
                        ].map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-semibold text-slate-650 hover:text-slate-900 transition-all shadow-xs"
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
                    <div className="space-y-4 pt-4 border-t border-dashed border-slate-150">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Developer KPI Intelligence
                        </h4>
                        <p className="text-[10px] text-slate-400">Continuous assessments calculated based on Git triggers, commits velocity, and QA coverage.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-2">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Committed Stacks</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-slate-800 font-mono">18</span>
                            <span className="text-[10px] text-slate-500 font-semibold">Technologies</span>
                          </div>
                          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">Top Skill: TypeScript</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-2">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Sprint Velocity</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-indigo-600 font-mono">38</span>
                            <span className="text-[10px] text-slate-500 font-semibold">Story Points</span>
                          </div>
                          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: "87%" }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">87.5% completion rate</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-2">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Attendance Ratio</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-emerald-600 font-mono">{activeRecord?.attendance || 98}%</span>
                            <span className="text-[10px] text-slate-500 font-semibold">This Cycle</span>
                          </div>
                          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activeRecord?.attendance || 98}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">Dhaka Hub Standard Shift</span>
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
                          { key: "languages", label: "Programming Languages", color: "from-blue-500 to-cyan-500", icon: <Code2 className="w-3.5 h-3.5 text-blue-500" /> },
                          { key: "frontend", label: "Frontend Architecture", color: "from-indigo-500 to-purple-500", icon: <Layers className="w-3.5 h-3.5 text-indigo-500" /> },
                          { key: "backend", label: "Backend & Microservices", color: "from-amber-500 to-orange-500", icon: <Server className="w-3.5 h-3.5 text-amber-500" /> },
                          { key: "cloudDevops", label: "Cloud Infra & CI/CD", color: "from-emerald-500 to-teal-500", icon: <Cloud className="w-3.5 h-3.5 text-emerald-500" /> },
                          { key: "databases", label: "Databases & Brokers", color: "from-rose-500 to-red-500", icon: <Database className="w-3.5 h-3.5 text-rose-500" /> }
                        ].map((stack) => (
                          <div key={stack.key} className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-4.5 space-y-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              {stack.icon} {stack.label}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {skillsGrouped[stack.key as keyof typeof skillsGrouped].map((skill) => (
                                <span
                                  key={skill}
                                  onClick={() => handleRemoveSkill(stack.key as any, skill)}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-250 rounded-xl transition-all flex items-center gap-1 group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                  title="De-register Technology"
                                >
                                  {skill}
                                  <span className="text-slate-400 group-hover:text-rose-600 transition-colors font-bold">×</span>
                                </span>
                              ))}
                              {skillsGrouped[stack.key as keyof typeof skillsGrouped].length === 0 && (
                                <span className="text-[10px] text-slate-450 italic">No verified skills registered.</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Premium Add Skill Form & Visual Aura Gauge */}
                      <div className="space-y-6">
                        
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Enlist Corporate Technology</h4>
                          <form onSubmit={handleAddSkill} className="space-y-3.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Technology Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Golang, GraphQL, Terraform"
                                value={newSkillText}
                                onChange={(e) => setNewSkillText(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none focus:bg-white transition-all placeholder:text-slate-400 font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Division Segment</label>
                              <select
                                value={newSkillCat}
                                onChange={(e) => setNewSkillCat(e.target.value as any)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none cursor-pointer focus:bg-white transition-all font-semibold text-slate-700"
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
                              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.2)]"
                            >
                              Authorize Technology Tag
                            </button>
                          </form>
                        </div>

                        {/* Premium Visual Rating Card */}
                        <div className="bg-slate-900 text-white p-5 rounded-3xl relative overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Flame className="w-32 h-32 stroke-[1px]" />
                          </div>
                          <div className="space-y-2 relative z-10">
                            <span className="text-[9px] font-mono tracking-widest uppercase text-blue-400 font-bold">IT Talent Architecture</span>
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
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <span className="inline-block text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                          Active Sprint: Cycle 14
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 font-display">Antigravity Distributed API Router Pipeline</h3>
                        <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-medium">
                          Refactoring monolithic session controls into HttpOnly secure cookies. Integrated to containerized environments on Cloud Run.
                        </p>
                      </div>
                      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/50 text-center shrink-0 min-w-[120px] shadow-xs">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Velocity Target</span>
                        <span className="block text-lg font-mono font-extrabold text-blue-600 mt-0.5">38 SP</span>
                        <span className="text-[9px] text-slate-400 font-bold">Q3 Goal Aligned</span>
                      </div>
                    </div>

                    {/* Jira Ticket Board */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider font-mono">Active Jira Board Issues</h4>
                        <p className="text-[10px] text-slate-400">Manage development states and log timesheets directly against sprint issues.</p>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/60">
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 font-mono">ID</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Summary</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28">Sprint State</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Log Time</th>
                              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-36 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {tickets.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-50/20 transition-colors">
                                <td className="px-4 py-3 text-xs font-bold font-mono text-blue-600">{t.id}</td>
                                <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                                  <div className="space-y-0.5">
                                    <p className="font-display font-bold">{t.title}</p>
                                    <span className={`inline-block text-[9px] font-bold ${
                                      t.priority === "Critical" ? "text-red-600 bg-red-50 border border-red-100" : t.priority === "High" ? "text-orange-600 bg-orange-50 border border-orange-100" : "text-slate-500 bg-slate-50"
                                    } px-2 py-0.2 rounded-md font-mono`}>
                                      {t.priority} Priority
                                    </span>
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
                                <td className="px-4 py-3 text-xs font-mono font-bold text-slate-500 text-center">
                                  {t.loggedHours} hrs
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <input
                                      type="number"
                                      placeholder="Hrs"
                                      value={timeToLog[t.id] || ""}
                                      onChange={(e) => setTimeToLog({ ...timeToLog, [t.id]: e.target.value })}
                                      className="w-12 px-1.5 py-1 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded text-[11px] font-mono outline-none text-center font-bold"
                                    />
                                    <button
                                      onClick={() => handleLogHours(t.id)}
                                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] transition-colors cursor-pointer"
                                    >
                                      Log
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. DOCKER SETUP & CRYPTOGRAPHIC KEYS */}
                {activeTab === "dev_env" && (
                  <div className="space-y-6">
                    
                    {/* Machine Specifications */}
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 shrink-0">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Enterprise Asset ID: HN-M3-8820</span>
                          <h4 className="text-xs font-bold text-slate-800 font-display">Apple MacBook Pro 16" (M3 Max)</h4>
                          <p className="text-[10px] text-slate-500 font-mono">16-Core CPU / 36GB Unified RAM / 1TB SSD / macOS Sequoia</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 border border-blue-100 text-blue-600 font-mono">
                        Hardware Insured
                      </span>
                    </div>

                    {/* Local Docker Containers */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <TerminalSquare className="w-3.5 h-3.5 text-blue-500" /> Local Docker Sandboxes
                        </h4>
                        <p className="text-[10px] text-slate-400">Simulated environments running on localhost developers loop.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {containers.map((c) => (
                          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 font-mono">{c.name}</span>
                                <span className={`inline-block w-2 h-2 rounded-full ${c.status === "running" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                              </div>
                              <p className="text-[9px] text-slate-450 font-mono">{c.image} | Port: {c.port}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleToggleDocker(c.id, c.name, c.status)}
                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                  c.status === "running" ? "bg-rose-50 border-rose-150 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 border-emerald-150 text-emerald-600 hover:bg-emerald-100"
                                }`}
                              >
                                {c.status === "running" ? "Stop" : "Start"}
                              </button>
                              <button
                                onClick={() => handleRestartDocker(c.name)}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/80 transition-colors cursor-pointer"
                                title="Restart container daemon"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SSH Public Keys */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-slate-150">
                      
                      {/* Active keys */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">SSH Public Registries</h4>
                        <div className="space-y-3">
                          {sshKeys.map((k) => (
                            <div key={k.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs relative">
                              <button
                                onClick={() => handleRemoveSSHKey(k.id, k.name)}
                                className="absolute top-3.5 right-3.5 text-slate-350 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Revoke access GPG"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-slate-800 font-display">{k.name}</h5>
                                <p className="text-[10px] text-slate-400 font-mono">{k.type} | Added: {k.date}</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-150/40">
                                <span className="font-mono text-[9px] text-slate-500 truncate flex-1 leading-none select-all">
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
                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Enlist GPG/SSH public key</h4>
                        <form onSubmit={handleAddSSHKey} className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Identifier</label>
                            <input
                              type="text"
                              placeholder="e.g. mbp-workstation"
                              value={newKeyName}
                              onChange={(e) => setNewKeyName(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none focus:bg-white transition-all font-semibold text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Cipher Type</label>
                            <select
                              value={newKeyType}
                              onChange={(e) => setNewKeyType(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none cursor-pointer focus:bg-white transition-all font-semibold text-slate-700"
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
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none focus:bg-white transition-all font-mono text-slate-700 text-[11px] resize-none leading-relaxed"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
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
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-mono uppercase">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Commits Pushed", value: "148 commits", desc: "This Month Cycle", color: "text-blue-600" },
                        { label: "Pull Requests Merged", value: "22 PRs", desc: "100% Approval Rate", color: "text-emerald-600" },
                        { label: "Peer Reviews Completed", value: "18 logs", desc: "R&D Collaborations", color: "text-indigo-600" },
                        { label: "Lines of Code (LoC)", value: "+14,200", desc: "-4,800 Clean deletions", color: "text-orange-600" },
                        { label: "Test Coverage Average", value: "87.4%", desc: "Strict Jest Validations", color: "text-purple-600" },
                        { label: "CI Pipeline Runtime", value: "3m 42s", desc: "Standard Actions runtime", color: "text-rose-600" }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs space-y-1">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{stat.label}</span>
                          <span className={`block text-sm font-extrabold font-mono ${stat.color}`}>{stat.value}</span>
                          <span className="block text-[10px] text-slate-400 font-semibold">{stat.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress bars */}
                    <div className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider font-mono">Continuous Quality Inspections</h4>
                      <div className="space-y-4">
                        {[
                          { label: "Production Build Stability Health", val: 98, color: "bg-emerald-500" },
                          { label: "Unit & Core Integration Coverage Ratio", val: 87.4, color: "bg-indigo-500" },
                          { label: "Linting & Code Smells Quality index", val: 94, color: "bg-blue-500" }
                        ].map((bar, idx) => (
                          <div key={idx} className="space-y-1.5 text-left text-xs">
                            <div className="flex justify-between text-slate-500 font-semibold text-[11px]">
                              <span>{bar.label}</span>
                              <span className="font-mono font-bold text-slate-800">{bar.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
                        { label: "Casual Leaves (Paid)", balance: "7 / 10 days", used: "3 used", color: "border-blue-100 text-blue-600 bg-blue-50/30" },
                        { label: "Sick Leaves (Medical)", balance: "12 / 14 days", used: "2 used", color: "border-rose-100 text-rose-600 bg-rose-50/30" },
                        { label: "Festival / Holiday Break", balance: "4 / 8 days", used: "4 used", color: "border-emerald-100 text-emerald-600 bg-emerald-50/30" }
                      ].map((bal, i) => (
                        <div key={i} className={`border p-4 rounded-xl text-center space-y-1 ${bal.color.split(" ")[0]} ${bal.color.split(" ")[2]}`}>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{bal.label}</span>
                          <span className={`block text-xs font-extrabold font-mono ${bal.color.split(" ")[1]}`}>{bal.balance}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{bal.used}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clock-In Compliance info */}
                    <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Timesheet compliance roster</span>
                        <h4 className="text-xs font-bold text-slate-800 font-display">Shift: 09:00 AM - 06:00 PM BST (Standard Hub)</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Average Clock-In timing over 30 days: <strong className="font-mono text-slate-800">09:12 AM</strong> (Excellent compliance ratio).</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 border border-emerald-150 text-emerald-700 font-mono">
                        Roster Aligned
                      </span>
                    </div>

                    {/* PTO Apply form & application logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* PTO Apply form */}
                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Apply for Time Off</h4>
                        <form onSubmit={handleApplyLeave} className="space-y-3.5">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Start Date</label>
                              <input
                                type="date"
                                value={leaveStart}
                                onChange={(e) => setLeaveStart(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs outline-none font-semibold text-slate-700"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">End Date</label>
                              <input
                                type="date"
                                value={leaveEnd}
                                onChange={(e) => setLeaveEnd(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-xs outline-none font-semibold text-slate-700"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">Leave Classification</label>
                            <select
                              value={leaveType}
                              onChange={(e) => setLeaveType(e.target.value as any)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none cursor-pointer font-semibold text-slate-700"
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
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none resize-none text-slate-700 text-[11px]"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
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
                            <div key={lr.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800 font-mono">{lr.type} Leave ({lr.days} days)</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                  lr.status === "Approved" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
                                }`}>
                                  {lr.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono">{lr.start} to {lr.end}</p>
                              <p className="text-slate-600 leading-relaxed italic text-[11px]">"{lr.notes}"</p>
                            </div>
                          ))}
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
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">Compensation Package</span>
                          <div className="space-y-2.5">
                            <div className="flex justify-between border-b border-slate-100 pb-1.5 text-xs">
                              <span className="text-slate-500 font-semibold">Annual Gross</span>
                              <span className="text-emerald-600 font-extrabold font-mono">${(activeDirectoryEmployee.salary || 55000).toLocaleString()}/yr</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-1.5 text-xs">
                              <span className="text-slate-500 font-semibold">Monthly Salary</span>
                              <span className="text-slate-700 font-bold font-mono">${Math.round((activeDirectoryEmployee.salary || 55000) / 12).toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500 font-semibold">Hike Adjustments</span>
                              <span className="text-slate-700 font-bold font-mono">{(activeDirectoryEmployee.incrementHistory || []).length} recorded</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 italic mt-4">
                          Compensation package synced with global payroll cycles.
                        </div>
                      </div>

                      {/* Hike progression histories */}
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between">
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
                              className="text-[9px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
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
                                  <div key={index} className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs">
                                    <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold mb-1">
                                      <span>{inc.date}</span>
                                      <span className="text-emerald-600">+{increasePct}% Hike</span>
                                    </div>
                                    <div className="font-bold font-mono text-slate-700">
                                      ${inc.previousSalary.toLocaleString()} → <span className="text-blue-600">${inc.newSalary.toLocaleString()}</span>
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
                    <div className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Objective Key Results (OKRs) - Q3 2026</h4>
                      <div className="space-y-4">
                        {[
                          { title: "Reduce React client bundle weights via code-splitting", pct: 85, metric: "Goal: Under 250KB total bundle size" },
                          { title: "Achieve unit test suite coverage across core microservices", pct: 90, metric: "Goal: >90% code coverage index" },
                          { title: "Active mentorship & pairing with 2 junior software engineers", pct: 100, metric: "Goal: 2 direct reports successfully trained" }
                        ].map((okr, index) => (
                          <div key={index} className="space-y-1.5 text-left text-xs">
                            <div className="flex justify-between text-slate-600 font-semibold text-[11px]">
                              <span>{okr.title}</span>
                              <span className="font-mono font-bold text-slate-800">{okr.pct}% completed</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${okr.pct}%` }}
                              />
                            </div>
                            <p className="text-[9px] font-mono font-semibold text-slate-400">{okr.metric}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KPI Cycle List */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Assessments Cycle History</h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white shadow-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/60">
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
                                <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                                  <td className="px-4 py-3 text-xs text-slate-400 font-bold font-mono">{idx + 1}</td>
                                  <td className="px-4 py-3 text-xs font-bold text-slate-700 font-mono">{p.month}</td>
                                  <td className="px-4 py-3 text-xs text-slate-600 font-mono">{p.attendance}% attendance</td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      onClick={() => handleQuickAnalyze(p.month)}
                                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-750 border border-blue-200/40 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
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
                      <div className="flex gap-3 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl shadow-xs">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-blue-600 font-bold">Gemini Talent Co-pilot</span>
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
                              ? "bg-slate-900 text-white ml-8 shadow-sm border border-slate-950"
                              : "bg-slate-50 border border-slate-200/60 mr-8 shadow-xs"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.sender === "user"
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 border border-blue-200 text-blue-600"
                          }`}>
                            {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className="space-y-1 w-full min-w-0">
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${msg.sender === "user" ? "text-slate-300" : "text-blue-600"}`}>
                              {msg.sender === "user" ? "Corporate Admin" : "Gemini Talent Advisor"}
                            </span>
                            <p className="text-xs leading-relaxed whitespace-pre-line font-sans font-medium break-words">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isCopilotLoading && (
                        <div className="flex gap-3 bg-slate-50 border border-slate-150 p-4 rounded-2xl mr-8">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 animate-bounce">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-widest">Compiling engineering logs...</span>
                            <div className="flex gap-1.5 py-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommendation Quick Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-3 pt-2 border-t border-dashed border-slate-150 no-scrollbar">
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
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-[10px] font-bold cursor-pointer shrink-0 transition-colors disabled:opacity-50 font-display"
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
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 text-slate-800 text-xs rounded-xl focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 font-medium font-sans"
                      />
                      <button
                        type="submit"
                        disabled={isCopilotLoading || !copilotInput.trim()}
                        className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all disabled:opacity-40"
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
          <div className="border-t border-dashed border-slate-150 pt-5 mt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider gap-3 font-mono">
            <span>R&D TALENT CONSOLE SYNCED</span>
            <span className="text-blue-500/80">Continuous Staging Sync</span>
          </div>

        </div>

      </div>

    </div>
  );
}
