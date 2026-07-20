import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Mail, Phone, Briefcase, Calendar, MapPin, Key, Hash, Link as LinkIcon, 
  ShieldAlert, Shield, ShieldCheck, Eye, EyeOff, Copy, RefreshCw, Upload, Paperclip, FileText, ExternalLink
} from 'lucide-react';
import { Employee, Manager } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const ROLES_HIERARCHY = [
  "Super Admin",
  "Manager",
  "Leader",
  "Co-Leader",
  "Web Developer",
  "Web Developer (Probation Period)"
];

const DEPARTMENTS = [
  'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance'
];

const TEAMS = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Omega"
];

type ModalTab = "corporate" | "personal" | "professional" | "banking" | "auth";

export function AddUserModal({ isOpen, onClose, employees, setEmployees }: AddUserModalProps) {
  const [modalTab, setModalTab] = useState<ModalTab>("corporate");
  
  const [employeeFormData, setEmployeeFormData] = useState<Partial<Employee>>({
    id: "",
    name: "",
    role: ROLES_HIERARCHY[4],
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
    resumeUrl: "",
    reportingManager: "",
    profilePhoto: ""
  });

  const [authData, setAuthData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  
  const calculatePasswordStrength = (password: string) => {
    if (!password) return { label: 'None', color: 'bg-slate-200', text: 'text-slate-400' };
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;

    if (strength < 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (strength < 4) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    if (strength < 5) return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
    return { label: 'Very Strong', color: 'bg-indigo-500', text: 'text-indigo-600' };
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAuthData(prev => ({ ...prev, password, confirmPassword: password }));
  };

  const copyPassword = () => {
    if (authData.password) {
      navigator.clipboard.writeText(authData.password);
      alert("Password copied to clipboard");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authData.password !== authData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!authData.username || !authData.password) {
      alert("Please provide authentication credentials (Username and Password).");
      setModalTab("auth");
      return;
    }

    // Auto-generate employee ID if empty
    const empId = employeeFormData.id?.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: Employee = {
      ...employeeFormData,
      id: empId,
      name: employeeFormData.name || "",
      email: employeeFormData.email || "",
      phone: employeeFormData.phone || "",
      department: employeeFormData.department || DEPARTMENTS[0],
      role: employeeFormData.role || ROLES_HIERARCHY[4],
      team: employeeFormData.team || TEAMS[0],
      active: true,
      createdAt: new Date().toISOString(),
      joiningDate: employeeFormData.joiningDate || new Date().toISOString(),
      workLocation: employeeFormData.workLocation || "Office",
      leaveBalance: { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 }
    } as Employee;

    if (window.confirm(`Are you sure you want to provision the account for ${newUser.name}?`)) {
      setEmployees(prev => [newUser, ...prev]);
      alert(`User ${newUser.name} provisioned successfully!`);
      onClose();
    }
  };

  const strengthInfo = calculatePasswordStrength(authData.password);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-slate-200 flex flex-col"
          >
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg font-display tracking-tight">Provision New User</h3>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">Comprehensive HR Onboarding</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/30 px-6 pt-2 gap-2 overflow-x-auto sleek-scrollbar">
              <button
                type="button"
                onClick={() => setModalTab("corporate")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  modalTab === "corporate"
                    ? "border-slate-900 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                1. Corporate Assignment
              </button>
              <button
                type="button"
                onClick={() => setModalTab("personal")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  modalTab === "personal"
                    ? "border-slate-900 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                2. Personal & Health
              </button>
              <button
                type="button"
                onClick={() => setModalTab("professional")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  modalTab === "professional"
                    ? "border-slate-900 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                3. Background & ID
              </button>
              <button
                type="button"
                onClick={() => setModalTab("banking")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  modalTab === "banking"
                    ? "border-slate-900 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                4. Banking & Notes
              </button>
              <button
                type="button"
                onClick={() => setModalTab("auth")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  modalTab === "auth"
                    ? "border-indigo-600 text-indigo-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  5. Auth & Security
                </div>
              </button>
            </div>

            <form id="add-user-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-white sleek-scrollbar">
              
              {/* TAB 1: CORPORATE */}
              {modalTab === "corporate" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name *</label>
                      <input required type="text" value={employeeFormData.name || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Work Email *</label>
                      <input required type="email" value={employeeFormData.email || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="e.g. john@company.com" />
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Employee ID</label>
                      <input type="text" value={employeeFormData.id || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, id: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" placeholder="Auto-generated" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Role / Position *</label>
                      <select required value={employeeFormData.role || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, role: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        {ROLES_HIERARCHY.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Department *</label>
                      <select required value={employeeFormData.department || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, department: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Assigned Team</label>
                      <select value={employeeFormData.team || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, team: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Reporting Manager *</label>
                      <select required value={(employeeFormData as any).reportingManager || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, reportingManager: e.target.value} as any)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        <option value="" disabled>Select a manager</option>
                        {employees.filter(e => e.role === 'Super Admin' || e.role === 'Manager' || e.role === 'Leader').map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Joining Date *</label>
                      <input required type="date" value={employeeFormData.joiningDate || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, joiningDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Base Salary (Annual)</label>
                      <input type="number" value={employeeFormData.salary || 0} onChange={(e) => setEmployeeFormData({...employeeFormData, salary: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Work Location</label>
                      <select value={employeeFormData.workLocation || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, workLocation: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        <option value="Office">Office</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Employment Type</label>
                      <select value={employeeFormData.employmentType || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, employmentType: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Probation Period</label>
                      <select value={employeeFormData.probationPeriod || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, probationPeriod: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
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
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Profile Photo URL (Optional)</label>
                    <input type="url" value={(employeeFormData as any).profilePhoto || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, profilePhoto: e.target.value} as any)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="https://example.com/photo.jpg" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
                      <input type="tel" value={employeeFormData.phone || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="+1 (555) 019-2834" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Personal Email</label>
                      <input type="email" value={employeeFormData.personalEmail || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, personalEmail: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="jane.personal@gmail.com" />
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                      <input type="date" value={employeeFormData.dob || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, dob: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Blood Group</label>
                      <select value={employeeFormData.bloodGroup || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, bloodGroup: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
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
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Gender</label>
                      <select value={employeeFormData.gender || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, gender: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Marital Status</label>
                      <select value={employeeFormData.maritalStatus || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, maritalStatus: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium cursor-pointer">
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nationality</label>
                      <input type="text" value={employeeFormData.nationality || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, nationality: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="e.g. Bangladeshi" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Emergency Contact</label>
                      <input type="text" value={employeeFormData.emergencyContact || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, emergencyContact: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="Name, Relation & Phone" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BACKGROUND & ID */}
              {modalTab === "professional" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Highest Qualification</label>
                      <input type="text" value={employeeFormData.highestQualification || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, highestQualification: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="e.g. B.Sc in Computer Science" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Years of Experience (Pre-Joining)</label>
                      <input type="number" value={employeeFormData.experienceYears || 0} onChange={(e) => setEmployeeFormData({...employeeFormData, experienceYears: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" />
                    </div>
                  
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">National ID / Passport Number</label>
                      <input type="text" value={employeeFormData.nationalId || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, nationalId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" placeholder="e.g. NID-483920194" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tax / PAN Identification ID</label>
                      <input type="text" value={employeeFormData.taxId || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, taxId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" placeholder="e.g. TAX-3829103" />
                    </div>
                  </div>

                  {/* Resume / CV Section */}
                  <div className="border-t border-slate-100 pt-6">
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                      Employee Resume / CV Attachment
                    </label>
                    <div className="flex flex-col justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Direct URL to Resume</label>
                          <input type="url" value={employeeFormData.resumeUrl || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, resumeUrl: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="https://..." />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BANKING, ADDRESSES & NOTES */}
              {modalTab === "banking" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Bank Name</label>
                      <input type="text" value={employeeFormData.bankName || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, bankName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium" placeholder="e.g. Standard Chartered" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Account Number</label>
                      <input type="text" value={employeeFormData.bankAccountNumber || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, bankAccountNumber: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" placeholder="e.g. 10293810293" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">IFSC / SWIFT Code</label>
                      <input type="text" value={employeeFormData.bankIfscCode || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, bankIfscCode: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium" placeholder="e.g. SCBLBDDX" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Current Residential Address</label>
                    <textarea rows={2} value={employeeFormData.currentAddress || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, currentAddress: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all resize-none font-medium" placeholder="Provide the current home address details." />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Permanent Residential Address</label>
                      <button type="button" onClick={() => setEmployeeFormData({...employeeFormData, permanentAddress: employeeFormData.currentAddress})} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors">
                        Copy Current Address
                      </button>
                    </div>
                    <textarea rows={2} value={employeeFormData.permanentAddress || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, permanentAddress: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all resize-none font-medium" placeholder="Provide the permanent legal address details." />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Internal HR & Executive Notes</label>
                    <textarea rows={3} value={employeeFormData.notes || ''} onChange={(e) => setEmployeeFormData({...employeeFormData, notes: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all resize-none font-medium" placeholder="Provide additional internal notes, administrative guidelines, etc." />
                  </div>
                </div>
              )}

              {/* TAB 5: AUTH & SECURITY */}
              {modalTab === "auth" && (
                <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto py-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 font-display">Authentication Credentials</h4>
                    <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">Set up secure access for this user. They will need these credentials to access the platform.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">System Username *</label>
                      <input required type="text" value={authData.username} onChange={(e) => setAuthData({...authData, username: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-bold text-slate-900" placeholder="e.g. john.doe" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Secure Password *</label>
                        <button type="button" onClick={generatePassword} className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" />
                          Auto-Generate
                        </button>
                      </div>

                      <div className="relative">
                        <input required type={showPassword ? "text" : "password"} value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium tracking-widest text-slate-900 pr-24" placeholder="••••••••••••" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title={showPassword ? "Hide Password" : "Show Password"}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button type="button" onClick={copyPassword} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy Password">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">Password Strength:</span>
                          <span className={`text-[11px] font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className={`h-full transition-all duration-300 ${strengthInfo.color}`} style={{ width: authData.password ? (strengthInfo.label === 'Weak' ? '25%' : strengthInfo.label === 'Medium' ? '50%' : strengthInfo.label === 'Strong' ? '75%' : '100%') : '0%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                      <input required type={showPassword ? "text" : "password"} value={authData.confirmPassword} onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-mono font-medium tracking-widest text-slate-900" placeholder="••••••••••••" />
                      {authData.password && authData.confirmPassword && authData.password !== authData.confirmPassword && (
                        <p className="text-[11px] font-bold text-rose-500 mt-1">Passwords do not match.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
            
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm">
                Cancel
              </button>
              
              <div className="flex items-center gap-3">
                {modalTab !== "auth" ? (
                  <button type="button" onClick={() => {
                    const tabs: ModalTab[] = ["corporate", "personal", "professional", "banking", "auth"];
                    const nextIndex = tabs.indexOf(modalTab) + 1;
                    if (nextIndex < tabs.length) setModalTab(tabs[nextIndex]);
                  }} className="px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-sm font-bold rounded-xl transition-all shadow-sm">
                    Next Step &rarr;
                  </button>
                ) : (
                  <button type="submit" form="add-user-form" className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-slate-900/20 active:scale-95 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Provision Account
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
