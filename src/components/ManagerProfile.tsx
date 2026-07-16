import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Briefcase, 
  Phone, 
  MapPin, 
  Tag, 
  Plus, 
  X, 
  Save, 
  RotateCcw, 
  ShieldCheck,
  Calendar,
  Fingerprint,
  Building,
  Users,
  ShieldAlert,
  Award,
  Armchair,
  Sparkles,
  Laptop,
  GraduationCap,
  Globe,
  Clock,
  Compass,
  Link as LinkIcon,
  Heart,
  ChevronDown,
  Paperclip,
  Upload,
  FileText,
  ExternalLink
} from "lucide-react";
import { get3DAvatarUrl } from "../utils";
import { Manager } from "../types";

interface ManagerProfileProps {
  manager: Manager;
  onSave: (updatedManager: Manager) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

type TabType = "personal" | "work" | "safety";

export function ManagerProfile({ manager, onSave, showToast }: ManagerProfileProps) {
  // Tabs for sub-forms (Renamed and simplified)
  const [activeSubTab, setActiveSubTab] = useState<TabType>("personal");

  // State initialization - Personal Info
  const [name, setName] = useState(manager.name);
  const [email, setEmail] = useState(manager.email);
  const [phone, setPhone] = useState(manager.phone || "");
  const [location, setLocation] = useState(manager.location || "");
  const [bio, setBio] = useState(manager.bio || "");
  const [education, setEducation] = useState(manager.education || "");
  const [certifications, setCertifications] = useState(manager.certifications || "");
  const [linkedinLink, setLinkedinLink] = useState(manager.linkedinLink || "");
  const [githubLink, setGithubLink] = useState(manager.githubLink || "");
  const [preferredLanguage, setPreferredLanguage] = useState(manager.preferredLanguage || "English (US)");
  const [dob, setDob] = useState(manager.dob || "");
  const [bloodGroup, setBloodGroup] = useState(manager.bloodGroup || "");
  const [presentAddress, setPresentAddress] = useState(manager.presentAddress || "");
  const [permanentAddress, setPermanentAddress] = useState(manager.permanentAddress || "");
  const [resumeName, setResumeName] = useState(manager.resumeName || "");
  const [resumeUrl, setResumeUrl] = useState(manager.resumeUrl || "");

  // State initialization - Work Preferences & Status
  const [employeeId, setEmployeeId] = useState(manager.employeeId || "");
  const [department, setDepartment] = useState(manager.department || "");
  const [role, setRole] = useState(manager.role || "");
  const [employeeType, setEmployeeType] = useState(manager.employeeType || "Full-Time");
  const [joinDate, setJoinDate] = useState(manager.joinDate || "");
  const [jobConfirmed, setJobConfirmed] = useState(manager.jobConfirmed || "");
  const [reportingTo, setReportingTo] = useState(manager.reportingTo || "");
  const [workHours, setWorkHours] = useState("9:00 AM - 6:00 PM");
  const [workStyle, setWorkStyle] = useState(manager.workStyle || "Remote");
  const [costCenter, setCostCenter] = useState(manager.costCenter || "CC-401");
  const [allocatedEquipment, setAllocatedEquipment] = useState(manager.allocatedEquipment || "Standard Issue Laptop");
  const [timezone, setTimezone] = useState(manager.timezone || "UTC");

  // Emergency state
  const [emergencyContactName, setEmergencyContactName] = useState(manager.emergencyContactName || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(manager.emergencyContactPhone || "");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(manager.emergencyContactRelation || "");

  // Managed Teams/Hubs list
  const [teams, setTeams] = useState<string[]>(manager.teams || []);
  const [newTeamInput, setNewTeamInput] = useState("");

  // Skills list
  const [skills, setSkills] = useState<string[]>(manager.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTeam = newTeamInput.trim();
    if (!cleanTeam) return;
    if (teams.includes(cleanTeam)) {
      showToast("Team is already listed", "error");
      return;
    }
    setTeams([...teams, cleanTeam]);
    setNewTeamInput("");
    showToast(`Added team: ${cleanTeam}`, "success");
  };

  const handleRemoveTeam = (teamToRemove: string) => {
    setTeams(teams.filter(t => t !== teamToRemove));
    showToast(`Removed team: ${teamToRemove}`, "info");
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = newSkillInput.trim();
    if (!cleanSkill) return;
    if (skills.includes(cleanSkill)) {
      showToast("Skill is already added", "error");
      return;
    }
    setSkills([...skills, cleanSkill]);
    setNewSkillInput("");
    showToast(`Added skill: ${cleanSkill}`, "success");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    showToast(`Removed skill: ${skillToRemove}`, "info");
  };

  const handleReset = () => {
    setName(manager.name);
    setEmail(manager.email);
    setPhone(manager.phone || "");
    setLocation(manager.location || "");
    setBio(manager.bio || "");
    setEducation(manager.education || "");
    setCertifications(manager.certifications || "");
    setLinkedinLink(manager.linkedinLink || "");
    setGithubLink(manager.githubLink || "");
    setPreferredLanguage(manager.preferredLanguage || "English (US)");
    setDob(manager.dob || "");
    setBloodGroup(manager.bloodGroup || "");

    setEmployeeId(manager.employeeId || "");
    setDepartment(manager.department || "");
    setRole(manager.role || "");
    setEmployeeType(manager.employeeType || "Full-Time");
    setJoinDate(manager.joinDate || "");
    setJobConfirmed(manager.jobConfirmed || "");
    setReportingTo(manager.reportingTo || "");
    setWorkHours("9:00 AM - 6:00 PM");
    setWorkStyle(manager.workStyle || "Remote");
    setCostCenter(manager.costCenter || "CC-401");
    setAllocatedEquipment(manager.allocatedEquipment || "Standard Issue Laptop");
    setTimezone(manager.timezone || "UTC");

    setEmergencyContactName(manager.emergencyContactName || "");
    setEmergencyContactPhone(manager.emergencyContactPhone || "");
    setEmergencyContactRelation(manager.emergencyContactRelation || "");
    setTeams(manager.teams || []);
    setSkills(manager.skills || []);
    showToast("Profile changes reset to current records", "info");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    const updated: Manager = {
      ...manager,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      teams: teams,
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim(),
      education: education.trim(),
      certifications: certifications.trim(),
      linkedinLink: linkedinLink.trim(),
      githubLink: githubLink.trim(),
      preferredLanguage: preferredLanguage.trim(),
      dob: dob.trim(),
      bloodGroup: bloodGroup.trim(),
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      resumeName: resumeName.trim(),
      resumeUrl: resumeUrl.trim(),
      employeeId: employeeId.trim(),
      department: department.trim(),
      employeeType: employeeType.trim(),
      joinDate: joinDate.trim(),
      jobConfirmed: jobConfirmed.trim(),
      reportingTo: reportingTo.trim(),
      workHours: workHours.trim(),
      workStyle: workStyle.trim(),
      costCenter: costCenter.trim(),
      allocatedEquipment: allocatedEquipment.trim(),
      timezone: timezone.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation: emergencyContactRelation.trim(),
      skills: skills
    };

    onSave(updated);
    showToast("Your profile records have been updated successfully!", "success");
  };

  return (
    <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 overflow-y-auto bg-slate-50/20">
      <div className="w-full space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-3xs flex flex-col sm:flex-row items-center gap-6">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden shadow-sm">
              <img 
                src={get3DAvatarUrl(name || manager.name)} 
                alt="Manager Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-xl border-4 border-white shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                Workspace Administrator
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Session
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{name || "Administrator"}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-500" /> {role || "Nexus Manager"}</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-0.5 rounded-md text-xs border border-slate-100"><Fingerprint className="w-3.5 h-3.5 text-slate-500" /> ID: {employeeId}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 pt-1 text-xs text-slate-550 font-bold">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {email}</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {location}</span>
            </div>
          </div>
        </div>

        {/* Grid Area: Form and Side Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Edit Form and Sub-Tabs */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl shadow-3xs overflow-hidden flex flex-col">
            
            {/* Form Headers & Sub-Tabs */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest font-mono">
                    Profile & Professional Details
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">Configure your personal biography, workspace configurations, and emergency preferences.</p>
                </div>
              </div>

              {/* Sub-Tabs switcher */}
              <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl mt-5 border border-slate-200/40">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("personal")}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === "personal" 
                      ? "bg-white text-slate-950 shadow-3xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Personal & Socials
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("work")}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === "work" 
                      ? "bg-white text-slate-950 shadow-3xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Employment & Style
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("safety")}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSubTab === "safety" 
                      ? "bg-white text-slate-950 shadow-3xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Emergency Contact
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="p-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-5 min-h-[300px]">
                
                {/* SUB TAB 1: PERSONAL & SOCIALS */}
                {activeSubTab === "personal" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alice Smith"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Work Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. alice@nexus.com"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Direct Line (Phone)</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +1 (555) 019-2834"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Operational Base (Location)</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. New York, NY"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Blood Group</label>
                        <div className="relative">
                          <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <select 
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Highest Educational Degree</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          placeholder="e.g. M.S. in Computer Science - Stanford"
                          className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">LinkedIn Profile Link</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="url"
                            value={linkedinLink}
                            onChange={(e) => setLinkedinLink(e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">GitHub / Portfolio Link</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="url"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Present Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={presentAddress}
                            onChange={(e) => setPresentAddress(e.target.value)}
                            placeholder="e.g. 123 Main St, City, State"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Permanent Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={permanentAddress}
                            onChange={(e) => setPermanentAddress(e.target.value)}
                            placeholder="e.g. 456 Old Rd, Hometown, State"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Preferred Workspace Language</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={preferredLanguage}
                          onChange={(e) => setPreferredLanguage(e.target.value)}
                          placeholder="e.g. English (US)"
                          className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Personal Biography / Statement</label>
                      <textarea 
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell your team about yourself..."
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-2xl text-xs font-medium text-slate-600 transition-all outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Resume / CV Attachment Section */}
                    <div className="border-t border-slate-100/80 pt-5 mt-5">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                        My Resume / Professional CV
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Drag and Drop Upload Zone */}
                        <div 
                          className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                            resumeName 
                              ? "border-emerald-300 bg-emerald-50/10" 
                              : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 bg-slate-50/10"
                          }`}
                          onClick={() => {
                            const fileInput = document.getElementById("manager-resume-picker");
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
                              setResumeName(file.name);
                              if (!resumeUrl) {
                                setResumeUrl(`https://nexus-storage.local/resumes/${encodeURIComponent(file.name)}`);
                              }
                            }
                          }}
                        >
                          <input 
                            type="file"
                            id="manager-resume-picker"
                            accept=".pdf,.doc,.docx,.rtf,.txt"
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const file = files[0];
                                setResumeName(file.name);
                                if (!resumeUrl) {
                                  setResumeUrl(`https://nexus-storage.local/resumes/${encodeURIComponent(file.name)}`);
                                }
                              }
                            }}
                          />
                          
                          {resumeName ? (
                            <div className="space-y-2">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                <FileText className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[220px] mx-auto">
                                  {resumeName}
                                </p>
                                <p className="text-[11px] text-emerald-600 font-medium">Ready for sync</p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setResumeName("");
                                  setResumeUrl("");
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

                        {/* Direct Link alternative */}
                        <div className="flex flex-col justify-between p-4 border border-slate-200/80 rounded-2xl bg-slate-50/10">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">Direct URL to Resume (Alternative)</label>
                              <input 
                                type="url"
                                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-xs transition-all outline-none"
                                value={resumeUrl}
                                onChange={(e) => {
                                  setResumeUrl(e.target.value);
                                  if (!resumeName && e.target.value) {
                                    setResumeName("My Web Resume");
                                  } else if (resumeName === "My Web Resume" && !e.target.value) {
                                    setResumeName("");
                                  }
                                }}
                                placeholder="e.g. https://drive.google.com/file/d/..."
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Prefer using a cloud link? Share a direct link to a Google Drive document, Dropbox PDF, LinkedIn profile, or personal web portfolio.
                            </p>
                          </div>
                          
                          {resumeUrl && (
                            <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100/50 mt-2">
                              <span className="truncate max-w-[140px] font-mono text-[10px]">{resumeUrl}</span>
                              <a 
                                href={resumeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                              >
                                View CV <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUB TAB 2: EMPLOYMENT & STYLE */}
                {activeSubTab === "work" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Employee Identification Badge</label>
                        <div className="relative">
                          <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="e.g. NEX-2026-009"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Primary Department / Division</label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. Engineering"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Professional Role Title</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Shopify Dev Manager"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Employment Type Class</label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <select 
                            value={employeeType}
                            onChange={(e) => setEmployeeType(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="Full-Time">Full-Time (Salaried)</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contractor">Contractor (1099)</option>
                            <option value="Intern">Internship</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date of Hire</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input 
                            type="date"
                            value={joinDate}
                            readOnly
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all outline-none cursor-default"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Job Confirmed Status</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input 
                            type="text"
                            value={jobConfirmed}
                            onChange={(e) => setJobConfirmed(e.target.value)}
                            placeholder="e.g. Confirmed on 2026-03-20"
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Working Style Preference</label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <select 
                            value={workStyle}
                            onChange={(e) => setWorkStyle(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="Remote">100% Fully Remote</option>
                            <option value="Hybrid">Hybrid Work Schedule</option>
                            <option value="Onsite">100% On-Site Location</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                            ▼
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Standard Core Working Hours</label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input 
                            type="text"
                            value={workHours}
                            readOnly
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all outline-none cursor-default"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Direct Team Leader / Supervisor</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input 
                            type="text"
                            value={reportingTo}
                            readOnly
                            className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all outline-none cursor-default"
                          />
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* SUB TAB 3: EMERGENCY CONTACT */}
                {activeSubTab === "safety" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100/60 rounded-2xl flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Duty of Care Support</h4>
                        <p className="text-[11px] text-indigo-600 mt-0.5 leading-relaxed font-medium">
                          Please list a primary contact for security notifications or urgent support alerts. These details are kept strictly confidential within secure administrative directories.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Emergency Contact Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Emergency Contact Direct Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={emergencyContactPhone}
                          onChange={(e) => setEmergencyContactPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 012-3456"
                          className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Relationship to Contact</label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={emergencyContactRelation}
                          onChange={(e) => setEmergencyContactRelation(e.target.value)}
                          placeholder="e.g. Spouse, Parent, Sibling"
                          className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Save/Reset Footer bar */}
              <div className="flex flex-wrap gap-3 pt-8 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 min-w-[120px] h-10 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Records
                </button>
                <button
                  type="submit"
                  className="flex-1 min-w-[120px] h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>

            </form>
          </div>

          {/* Sidebar Area: Focus Hubs and Skills Competency */}
          <div className="space-y-6">
            
            {/* Managed Teams/Hubs Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-3xs space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" /> Managed Hubs
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Configure departments and focus teams currently linked to your workspace session.
                </p>
              </div>

              {/* Tag display */}
              <div className="flex flex-wrap gap-1.5 min-h-[48px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                {teams.map(team => (
                  <span 
                    key={team} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold font-sans text-[10.5px] shadow-4xs"
                  >
                    {team}
                    <button 
                      type="button"
                      onClick={() => handleRemoveTeam(team)}
                      className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded transition-colors cursor-pointer"
                      title={`Remove ${team}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {teams.length === 0 && (
                  <span className="text-[11px] text-slate-500 font-medium italic self-center">
                    No teams registered
                  </span>
                )}
              </div>

              {/* Add tag form */}
              <form onSubmit={handleAddTeam} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="New Hub (e.g. Node)"
                  value={newTeamInput}
                  onChange={(e) => setNewTeamInput(e.target.value)}
                  className="flex-1 px-3 h-9 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-all outline-none placeholder-slate-400"
                />
                <button 
                  type="submit"
                  className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                  title="Add Hub"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Skills & Competency Matrix Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-3xs space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Award className="w-4 h-4 text-violet-500" /> Core Competencies
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Define your specialized skills or professional capabilities for team routing.
                </p>
              </div>

              {/* Tag display */}
              <div className="flex flex-wrap gap-1.5 min-h-[48px] p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                {skills.map(skill => (
                  <span 
                    key={skill} 
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-100 text-violet-750 font-bold font-sans text-[10.5px] shadow-4xs"
                  >
                    {skill}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-violet-400 hover:text-violet-700 p-0.5 rounded transition-colors cursor-pointer"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-[11px] text-slate-500 font-medium italic self-center">
                    No skills registered
                  </span>
                )}
              </div>

              {/* Add skill tag form */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="New Skill (e.g. PHP)"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 h-9 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-xs font-bold text-slate-750 transition-all outline-none placeholder-slate-400"
                />
                <button 
                  type="submit"
                  className="w-9 h-9 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                  title="Add Skill"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Session Stats */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-5 space-y-4">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 block">
                Session Telemetry
              </span>
              
              <div className="divide-y divide-slate-100">
                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date of Hire
                  </span>
                  <span className="font-bold text-slate-700 font-mono">{joinDate}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> Class
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-mono text-[11px]">
                    {employeeType}
                  </span>
                </div>
                
                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Permission
                  </span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded-md font-mono text-[11px]">
                    Root Manager
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-500" /> Active Hubs
                  </span>
                  <span className="font-bold text-slate-750 font-mono">{teams.length} focus hubs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
