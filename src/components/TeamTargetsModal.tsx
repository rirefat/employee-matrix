import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, Plus, Edit3, Trash2, Calendar, TrendingUp, Briefcase, Filter, ChevronDown, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { TeamTarget, Employee } from '../types';

interface TeamTargetsModalProps {
  onClose: () => void;
  employees: Employee[];
}

export function TeamTargetsModal({ onClose, employees }: TeamTargetsModalProps) {
  const [targets, setTargets] = useState<TeamTarget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TeamTarget | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterTeam, setFilterTeam] = useState<string>('All');

  // Hardcoded for now based on requirements, but could be dynamic
  const TEAMS = ['Full Stack', 'WordPress', 'Shopify', 'Design', 'Marketing', 'QA'];
  
  const getOperationsManager = (teamName: string) => {
    // In a real app, this would find the manager from the employees array who manages this team
    const managers = employees.filter(emp => emp.role === 'Manager' || emp.roleType === 'manager');
    const teamManager = managers.find(m => m.team === teamName || (m.department && m.department.includes(teamName)));
    
    if (teamManager) return teamManager.name;
    return `Operations Manager (${teamName})`;
  };

  const initialFormState = {
    team: 'Full Stack',
    title: '',
    description: '',
    targetType: 'Revenue',
    targetValue: '',
    targetPeriod: 'monthly',
    deadline: '',
    priority: 'Medium' as const,
    status: 'Draft' as const,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch targets on load (mock for now, or we could store in local storage)
  useEffect(() => {
    const saved = localStorage.getItem('nexus_team_targets');
    if (saved) {
      setTargets(JSON.parse(saved));
    }
  }, []);

  const saveTargets = (newTargets: TeamTarget[]) => {
    setTargets(newTargets);
    localStorage.setItem('nexus_team_targets', JSON.stringify(newTargets));
  };

  const handleTeamChange = (team: string) => {
    setFormData({ ...formData, team });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTarget) {
      const updated = targets.map(t => t.id === editingTarget.id ? {
        ...t,
        ...formData,
        operationsManager: getOperationsManager(formData.team),
        updatedAt: new Date().toISOString()
      } : t);
      saveTargets(updated);
    } else {
      const newTarget: TeamTarget = {
        id: 'tt_' + Math.random().toString(36).substr(2, 9),
        ...formData,
        operationsManager: getOperationsManager(formData.team),
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveTargets([newTarget, ...targets]);
    }
    
    setIsFormOpen(false);
    setEditingTarget(null);
    setFormData(initialFormState);
  };

  const handleEdit = (target: TeamTarget) => {
    setEditingTarget(target);
    setFormData({
      team: target.team,
      title: target.title,
      description: target.description,
      targetType: target.targetType,
      targetValue: target.targetValue,
      targetPeriod: target.targetPeriod,
      deadline: target.deadline,
      priority: target.priority as any,
      status: target.status as any,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team target?')) {
      saveTargets(targets.filter(t => t.id !== id));
    }
  };

  const handleDuplicate = (target: TeamTarget) => {
    const duplicated: TeamTarget = {
      ...target,
      id: 'tt_' + Math.random().toString(36).substr(2, 9),
      title: target.title + ' (Copy)',
      status: 'Draft',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveTargets([duplicated, ...targets]);
  };

  const filteredTargets = useMemo(() => {
    return targets.filter(t => {
      const matchStatus = filterStatus === 'All' || t.status === filterStatus;
      const matchTeam = filterTeam === 'All' || t.team === filterTeam;
      return matchStatus && matchTeam;
    });
  }, [targets, filterStatus, filterTeam]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Low': return 'text-slate-700 bg-slate-50 border-slate-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Active': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Overdue': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Draft': return 'text-slate-700 bg-slate-100 border-slate-200';
      case 'Archived': return 'text-slate-500 bg-slate-100 border-slate-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-100 relative overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200/50 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Team-Based Target Management</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Super Admin strategic goal assignment for organizational teams.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isFormOpen && (
              <button
                onClick={() => {
                  setEditingTarget(null);
                  setFormData(initialFormState);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Create Team Target
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50/30">
          {isFormOpen ? (
            <div className="p-6 max-w-4xl mx-auto w-full">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">{editingTarget ? 'Edit Team Target' : 'Configure New Team Target'}</h3>
                  <button onClick={() => setIsFormOpen(false)} className="text-sm font-medium text-slate-500 hover:text-slate-800">Cancel</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Team & Manager Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Team</label>
                      <div className="relative">
                        <select 
                          required
                          value={formData.team}
                          onChange={(e) => handleTeamChange(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm"
                        >
                          {TEAMS.map(team => (
                            <option key={team} value={team}>{team} Team</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Operations Manager (Auto-Assigned)</label>
                      <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 flex items-center gap-2 cursor-not-allowed">
                        <Briefcase className="w-4 h-4" />
                        {getOperationsManager(formData.team)}
                      </div>
                    </div>
                  </div>

                  {/* Core Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Title</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g., Q3 E-Commerce Platform Overhaul"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Description & Strategic Objectives</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Define the specific goals and expectations for this team..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Metrics & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Measurement Type</label>
                      <select 
                        value={formData.targetType}
                        onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Revenue">Revenue / Sales ($)</option>
                        <option value="Delivery">Project Delivery (Count)</option>
                        <option value="Quality">Code Quality / SLA (%)</option>
                        <option value="Timeline">Milestone Completion</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Value</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g., $150,000"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Period</label>
                      <select 
                        value={formData.targetPeriod}
                        onChange={(e) => setFormData({...formData, targetPeriod: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom Timeline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Deadline</label>
                      <input 
                        required
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority Level</label>
                      <select 
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Draft">Draft (Not visible to team)</option>
                        <option value="Active">Active (Assigned)</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsFormOpen(false)}
                      className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 rounded-xl transition-all"
                    >
                      {editingTarget ? 'Update Team Target' : 'Assign Target to Team'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-6 h-full flex flex-col">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  <div className="relative">
                    <select 
                      value={filterTeam}
                      onChange={e => setFilterTeam(e.target.value)}
                      className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="All">All Teams</option>
                      {TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
                    </select>
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select 
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Draft">Drafts</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Target List */}
              {filteredTargets.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 border-dashed rounded-2xl">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No team targets found</h3>
                  <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">Create structural, team-based targets to track organizational goals and align performance across departments.</p>
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-indigo-200/50"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Team Target
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max overflow-y-auto pb-4">
                  <AnimatePresence>
                    {filteredTargets.map((target) => (
                      <motion.div 
                        key={target.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm transition-all flex flex-col gap-4 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-400 transition-colors" />
                        
                        <div className="flex justify-between items-start pl-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3 text-indigo-500" />
                                {target.team} Team
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(target.status)}`}>
                                {target.status}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getPriorityColor(target.priority)}`}>
                                {target.priority}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-base leading-tight">{target.title}</h4>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                              <span className="text-slate-400">Mgr:</span> {target.operationsManager}
                            </div>
                          </div>
                          
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(target)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Target">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDuplicate(target)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors" title="Duplicate Target">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                            <button onClick={() => handleDelete(target.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Target">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="pl-2 flex-1">
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{target.description}</p>
                        </div>
                        
                        <div className="pl-2 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                           <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Measurement</div>
                             <div className="font-mono text-sm font-semibold text-slate-800">{target.targetValue} <span className="text-xs text-slate-400">({target.targetType})</span></div>
                           </div>
                           <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline</div>
                             <div className="font-mono text-sm font-semibold text-slate-800">{target.deadline || 'No Date Set'} <span className="text-xs text-slate-400 capitalize">({target.targetPeriod})</span></div>
                           </div>
                        </div>

                        <div className="pl-2 pt-3">
                           <div className="flex justify-between items-end mb-1.5">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Team Progress</span>
                             <span className="text-xs font-bold text-indigo-700">{target.progress}%</span>
                           </div>
                           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full transition-all duration-1000 ${target.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                               style={{ width: `${target.progress}%` }}
                             />
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
