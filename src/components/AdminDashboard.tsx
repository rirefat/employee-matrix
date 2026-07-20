import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Settings2, Shield, Building, Mail, MoreVertical, 
  Activity, Database, Terminal, AlertTriangle, Search, 
  Filter, Plus, Edit3, Trash2, Ban, CheckCircle, Lock,
  ChevronRight, Unlock, Award, ChevronDown, Key, ShieldAlert, Zap, X
} from 'lucide-react';
import { Employee, Manager } from '../types';
import { get3DAvatarUrl } from '../utils';
import { AddUserModal } from './AddUserModal';

interface AdminDashboardProps {
  loggedInManager: Manager;
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

export function AdminDashboard({ loggedInManager, employees, setEmployees }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const stats = useMemo(() => {
    return [
      { label: "Total Platform Users", value: employees.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
      { label: "Super Admins", value: employees.filter(e => e.role === 'Super Admin').length || 1, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
      { label: "System Health", value: "Optimal", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
      { label: "Active Roles", value: new Set(employees.map(e => e.role)).size, icon: Award, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" }
    ];
  }, [employees]);

  const filteredUsers = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, roleFilter]);

  const handleEdit = (user: Employee) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleToggleBan = (id: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, active: !e.active };
      }
      return e;
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'Super Admin') return "bg-rose-100 text-rose-700 border-rose-200";
    if (role === 'Manager') return "bg-violet-100 text-violet-700 border-violet-200";
    if (role === 'Leader') return "bg-blue-100 text-blue-700 border-blue-200";
    if (role === 'Co-Leader') return "bg-cyan-100 text-cyan-700 border-cyan-200";
    if (role === 'Web Developer') return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200"; // Probation
  };

  return (
    <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-md border border-slate-700">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Super Admin Control</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium pl-12">
            Highest authority portal. Complete control over system hierarchy, security, and users.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-slate-900/20 transition-all active:scale-95 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Provision New User
        </button>
      </div>

      {/* Premium Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center justify-between relative z-10">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.border} border shadow-inner`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="relative z-10 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main User Directory Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight">Organization Directory</h3>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">Manage Roles & Permissions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium text-slate-700"
              />
            </div>
            <div className="relative">
              <select 
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="All">All Roles</option>
                {ROLES_HIERARCHY.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[500px] sleek-scrollbar relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm shadow-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">User Profile</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Authority Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredUsers.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 bg-slate-100">
                        <img src={get3DAvatarUrl(emp.name)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">{emp.name}</div>
                        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" /> {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getRoleBadgeColor(emp.role || 'Web Developer')}`}>
                      {emp.role || 'Web Developer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                    {emp.department || 'Engineering'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {emp.active !== false ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(emp)} className="p-2 text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all shadow-sm" title="Edit Profile & Role">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleBan(emp.id)} className={`p-2 rounded-xl border shadow-sm transition-all ${emp.active !== false ? 'text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border-slate-200 hover:border-rose-200' : 'text-rose-600 hover:text-emerald-600 bg-rose-50 hover:bg-emerald-50 border-rose-200 hover:border-emerald-200'}`} title={emp.active !== false ? "Suspend User" : "Restore User"}>
                        {emp.active !== false ? <Ban className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm" title="Delete Account">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                      <Search className="w-8 h-8 opacity-20" />
                      <p className="text-sm font-semibold">No users found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Advanced Global Settings & Danger Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Global Security Policies */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/30">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/50">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">Global Security Policies</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors bg-white">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><Key className="w-4 h-4 text-slate-400" /></div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Enforce Two-Factor Auth (2FA)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Require all personnel to use authenticator apps.</div>
                </div>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors bg-white">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><Lock className="w-4 h-4 text-slate-400" /></div>
                <div>
                  <div className="text-sm font-bold text-slate-900">System Maintenance Lock</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Lock out all users except Super Admins.</div>
                </div>
              </div>
              <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl border border-red-200 shadow-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
          <div className="px-6 py-5 border-b border-red-100 flex items-center justify-between bg-red-50/50 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-red-100 text-red-600 rounded-lg border border-red-200/50 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-red-800 tracking-tight">Super Admin Danger Zone</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-100 border border-red-200 text-red-700 uppercase tracking-widest">Restricted</span>
          </div>
          <div className="p-6 space-y-4 relative z-10">
            <div className="p-4 bg-white rounded-2xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><Database className="w-4 h-4 text-red-500" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Factory Reset Database</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm">Wipe all application data, users, and logs. Restores initial seed state. Irreversible.</p>
                </div>
              </div>
              <button 
                onClick={async () => {
                  if (window.confirm("CRITICAL WARNING: Are you absolutely sure you want to factory reset the database? This action is irreversible.")) {
                    try {
                      const res = await fetch("/api/db-reset", { method: "POST" });
                      if (res.ok) {
                        alert("Database reset successfully.");
                        window.location.reload();
                      } else {
                        alert("Failed to reset database.");
                      }
                    } catch (e) {
                      alert("Error resetting database.");
                    }
                  }
                }}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap"
              >
                Initiate Wipe
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5"><Terminal className="w-4 h-4 text-slate-700" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Audit & Telemetry Logs</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm">Access raw infrastructure logs, security events, and API request traces.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap">
                Open Console
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-lg font-display tracking-tight">Edit Personnel Record</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white">
                    <img src={get3DAvatarUrl(selectedUser.name)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{selectedUser.name}</div>
                    <div className="text-xs text-slate-500">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Assign Department</label>
                    <div className="relative">
                      <select 
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                        defaultValue={selectedUser.department || 'Engineering'}
                        onChange={(e) => {
                          const newDept = e.target.value;
                          setEmployees(prev => prev.map(emp => emp.id === selectedUser.id ? { ...emp, department: newDept } : emp));
                        }}
                      >
                        {['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Assign Authority Role</label>
                    <div className="relative">
                      <select 
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
                        defaultValue={selectedUser.role || 'Web Developer'}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setEmployees(prev => prev.map(emp => emp.id === selectedUser.id ? { ...emp, role: newRole } : emp));
                        }}
                      >
                        {ROLES_HIERARCHY.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                     <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-xl transition-colors">
                       Reset Password
                     </button>
                     <button 
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-600/20"
                     >
                       Save Changes
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
        employees={employees} 
        setEmployees={setEmployees} 
      />
      
      </div>
    </main>
  );
}
