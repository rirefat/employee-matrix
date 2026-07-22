import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee } from '../types';
import { get3DAvatarUrl } from '../utils';
import { ShieldAlert, Shield, Star, Users, Code, Activity, Search } from 'lucide-react';

interface OrgChartProps {
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

const getRoleIcon = (role: string) => {
  switch(role) {
    case "Super Admin": return ShieldAlert;
    case "Manager": return Shield;
    case "Leader": return Star;
    case "Co-Leader": return Users;
    case "Web Developer": return Code;
    default: return Activity;
  }
};

const getBadgeStyles = (role: string) => {
  switch(role) {
    case "Super Admin": return { text: "text-rose-600", bg: "bg-rose-50/80", border: "border-rose-200/60" };
    case "Manager": return { text: "text-indigo-600", bg: "bg-indigo-50/80", border: "border-indigo-200/60" };
    case "Leader": return { text: "text-amber-600", bg: "bg-amber-50/80", border: "border-amber-200/60" };
    case "Co-Leader": return { text: "text-emerald-600", bg: "bg-emerald-50/80", border: "border-emerald-200/60" };
    case "Web Developer": return { text: "text-blue-600", bg: "bg-blue-50/80", border: "border-blue-200/60" };
    default: return { text: "text-slate-600", bg: "bg-slate-50/80", border: "border-slate-200/60" };
  }
};

export function OrgChart({ employees, setEmployees }: OrgChartProps) {
  const [draggedUser, setDraggedUser] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const lowerSearch = searchTerm.toLowerCase();
    return employees.filter(e => 
      e.name.toLowerCase().includes(lowerSearch) || 
      e.role.toLowerCase().includes(lowerSearch) || 
      (e.department && e.department.toLowerCase().includes(lowerSearch)) ||
      (e.team && e.team.toLowerCase().includes(lowerSearch))
    );
  }, [employees, searchTerm]);

  const handleDragStart = (e: React.DragEvent, emp: Employee) => {
    setDraggedUser(emp);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', emp.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetRole: string) => {
    e.preventDefault();
    if (!draggedUser) return;
    if (draggedUser.role === targetRole) {
      setDraggedUser(null);
      return;
    }

    let targetRoleType: 'admin' | 'manager' | 'user' = 'user';
    if (targetRole === 'Super Admin') targetRoleType = 'admin';
    else if (targetRole === 'Manager') targetRoleType = 'manager';

    const updatedEmployees = employees.map(emp => {
      if (emp.id === draggedUser.id) {
        return { ...emp, role: targetRole, roleType: targetRoleType };
      }
      return emp;
    });
    setEmployees(updatedEmployees);

    try {
      await fetch(`/api/employees/${draggedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole, roleType: targetRoleType })
      });
    } catch (err) {
      console.error("Failed to update role in DB", err);
    }
    
    setDraggedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Visual Organization Chart</h2>
          <p className="text-xs text-slate-500">Drag and drop cards to reassign roles in the hierarchy</p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Find employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-12 overflow-hidden min-h-[800px]"
      >
        {/* Glassmorphism Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* Central connecting line removed for cleaner individual hierarchical connections */}

        <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto">
          {ROLES_HIERARCHY.map((role, idx) => {
            const roleEmployees = filteredEmployees.filter(emp => emp.role === role);
            
            const RoleIcon = getRoleIcon(role);
            const badge = getBadgeStyles(role);
            
            return (
              <React.Fragment key={role}>
                <div 
                  className={`w-full relative flex flex-col items-center rounded-3xl transition-all duration-300 ${
                    draggedUser && draggedUser.role !== role 
                      ? 'bg-indigo-50/40 border-2 border-dashed border-indigo-300/50 shadow-inner p-4 my-4' 
                      : 'border-2 border-transparent'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, role)}
                >
                  {/* Level Title Badge */}
                  <div className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl border backdrop-blur-md shadow-sm z-20 ${badge.bg} ${badge.border} ${badge.text}`}>
                    <RoleIcon className="w-5 h-5" />
                    <h3 className="font-bold text-base tracking-tight">{role}</h3>
                    <span className="text-[11px] font-black bg-white/60 px-2.5 py-0.5 rounded-full ml-2 shadow-xs">
                      {roleEmployees.length}
                    </span>
                  </div>

                  {/* Vertical Line from Badge to Cards */}
                  <div className={`w-px ${roleEmployees.length > 0 ? 'h-10' : 'h-6'} bg-slate-300/80 relative z-0`} />

                  {/* Cards Grid */}
                  <div className="flex flex-wrap justify-center gap-6 relative z-10 w-full max-w-5xl">
                    <AnimatePresence>
                      {roleEmployees.map((emp, i) => (
                        <motion.div 
                          key={emp.id}
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, emp)}
                          onDragEnd={() => setDraggedUser(null)}
                          className={`bg-white/70 backdrop-blur-xl border ${draggedUser?.id === emp.id ? 'opacity-40 border-indigo-400 ring-4 ring-indigo-500/20' : 'border-white'} shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-5 flex flex-col items-center w-64 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden`}
                        >
                          {/* Top Border Connector Indicator */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50" />
                          
                          {/* Hover Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="relative z-10 flex flex-col items-center gap-4 w-full">
                            <div className="relative mt-2">
                              <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-[3px] border-white shadow-md">
                                <img src={get3DAvatarUrl(emp.name)} alt={emp.name} className="w-full h-full object-cover" draggable={false} />
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${badge.bg} ${badge.text}`}>
                                 <RoleIcon className="w-3.5 h-3.5 text-current" />
                              </div>
                            </div>
                            
                            <div className="text-center w-full">
                              <p className="font-black text-slate-800 text-base truncate px-2">{emp.name}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 truncate ${badge.text}`}>{role}</p>
                              
                              <div className="mt-3 pt-3 border-t border-slate-200/50 flex flex-col gap-1 w-full text-center">
                                {emp.department ? (
                                  <p className="text-xs text-slate-600 font-medium truncate">{emp.department}</p>
                                ) : (
                                  <p className="text-xs text-slate-400 font-medium truncate italic">No Department</p>
                                )}
                                {emp.team && (
                                  <p className="text-[10px] text-slate-500 truncate">{emp.team} Team</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {roleEmployees.length === 0 && (
                      <div className="w-64 h-32 rounded-2xl border-2 border-dashed border-slate-300/50 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center border border-slate-200 shadow-sm">
                          <Users className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500">Drag here to assign</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector between Levels */}
                {idx < ROLES_HIERARCHY.length - 1 && (
                  <div className="flex flex-col items-center my-2 relative z-0">
                    <div className="w-px h-16 bg-gradient-to-b from-slate-300/80 to-indigo-300/80" />
                    <div className="absolute top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-indigo-400">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                         <polyline points="6 9 12 15 18 9" />
                       </svg>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </motion.div>
    </div>
  );
}
