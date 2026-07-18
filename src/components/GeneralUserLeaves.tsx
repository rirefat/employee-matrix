import React, { useState } from 'react';
import { Employee, LeaveRequest } from '../types';
import { Calendar, Plus, CheckCircle, Clock, XCircle, AlertTriangle, ChevronRight, CalendarDays, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneralUserLeavesProps {
  employee: Employee | null;
  onAddLeave: (empId: string, type: any, start: string, end: string, notes: string, status: any) => void;
}

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

export function GeneralUserLeaves({ employee, onAddLeave }: GeneralUserLeavesProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState('1');
  const [notes, setNotes] = useState('');

  if (!employee) {
    return (
      <div className="flex-1 w-full px-6 py-8 flex items-center justify-center">
        <p className="text-slate-500 font-mono text-sm">No profile data available.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLeave(employee.id, leaveType as any, startDate, endDate, notes, "Pending");
    setShowAddForm(false);
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  const requests = employee.leaveRequests || [];
  const balance = employee.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
  const used = (balance.sickLeaveUsed || 0) + (balance.casualLeaveUsed || 0) + (balance.govFestHolidaysUsed || 0);
  const totalAllowance = 28;
  const remaining = Math.max(0, totalAllowance - used);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: springTransition }
  };

  return (
    <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 pt-24 overflow-y-auto overflow-x-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-8"
      >
        
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white p-8 md:p-10 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-100 uppercase">Leave Portal</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display text-white">
                Time Off Planner
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-md">
                Manage your absences, track your remaining balance, and submit new requests seamlessly.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-1">Available</span>
                <span className="block text-4xl font-black text-white font-mono">{remaining}<span className="text-base text-slate-400 ml-1 font-medium">d</span></span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="group relative flex items-center justify-center w-14 h-14 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              >
                <motion.div animate={{ rotate: showAddForm ? 45 : 0 }} transition={springTransition}>
                  <Plus className="w-6 h-6" />
                </motion.div>
                <div className="absolute -inset-2 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 blur-md pointer-events-none" />
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={springTransition}
              className="overflow-hidden"
            >
              <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    New Leave Request
                  </h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Leave Type</label>
                        <select
                          value={leaveType}
                          onChange={(e) => setLeaveType(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 block px-4 py-3.5 outline-none font-medium transition-all hover:bg-slate-50 cursor-pointer"
                        >
                          <option value="Sick">Sick Leave (SL)</option>
                          <option value="Casual">Casual Leave (CL)</option>
                          <option value="Gov/Fest">Gov/Fest Holiday</option>
                          <option value="Unpaid">Unpaid Leave</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Number of Days</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 block px-4 py-3.5 outline-none font-mono transition-all hover:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Start Date</label>
                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 block px-4 py-3.5 outline-none font-mono transition-all hover:bg-slate-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">End Date</label>
                        <input
                          type="date"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 block px-4 py-3.5 outline-none font-mono transition-all hover:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Reason / Notes
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 block px-4 py-3.5 outline-none font-medium resize-none transition-all hover:bg-slate-50"
                      placeholder="Briefly describe the reason for your request..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
                    >
                      Submit Request <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[2rem] shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200/50">
                <Clock className="w-5 h-5" />
              </div>
              History & Status
            </h3>
          </div>
          
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50 border border-slate-100 border-dashed rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                <Calendar className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium text-sm text-center">Your leave history is empty.<br/>New requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req, i) => (
                <motion.div 
                  key={req.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ...springTransition }}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl gap-5 transition-all duration-300 hover:shadow-md hover:border-slate-300"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {req.status === 'Approved' ? <CheckCircle className="w-6 h-6" /> :
                       req.status === 'Rejected' ? <XCircle className="w-6 h-6" /> :
                       <Clock className="w-6 h-6" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono tracking-wide">{req.type}</span>
                        <span className="text-sm font-black text-slate-900">{req.days} Day{req.days > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(req.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} 
                        <span className="text-slate-300">→</span> 
                        {new Date(req.end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      {req.notes && (
                        <p className="text-sm text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic group-hover:bg-white transition-colors">
                          "{req.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center self-end md:self-center ml-16 md:ml-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.status === 'Approved' ? 'text-emerald-700 bg-emerald-50' :
                      req.status === 'Rejected' ? 'text-rose-700 bg-rose-50' :
                      'text-amber-700 bg-amber-50'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}

