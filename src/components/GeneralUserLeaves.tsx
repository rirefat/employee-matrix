import React, { useState } from 'react';
import { Employee, LeaveRequest } from '../types';
import { Calendar, Plus, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface GeneralUserLeavesProps {
  employee: Employee | null;
  onAddLeave: (empId: string, type: any, start: string, end: string, notes: string, status: any) => void;
}

export function GeneralUserLeaves({ employee, onAddLeave }: GeneralUserLeavesProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState('1');
  const [notes, setNotes] = useState('');

  if (!employee) {
    return (
      <div className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 pt-24 overflow-y-auto flex items-center justify-center">
        <p className="text-slate-500 font-medium">No profile data available.</p>
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

  return (
    <main className="flex-1 w-full px-6 lg:px-10 xl:px-12 py-8 pt-24 flex flex-col gap-8 overflow-y-auto overflow-x-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 relative overflow-hidden shadow-3xs">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest font-mono bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-full">
            Time Off
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight font-display pt-1">
            My Leave Calendar
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Manage your time off requests and view your remaining balance.
          </p>
        </div>
        <div className="relative z-10 flex gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-center shadow-3xs">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono mb-1">Remaining Balance</span>
            <span className="block text-2xl font-black text-slate-800 font-mono">{remaining} <span className="text-xs text-slate-500 font-medium">days</span></span>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Request Leave
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Submit Leave Request
            </h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-medium"
                >
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Gov/Fest">Gov/Fest Holiday</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Reason / Notes</label>
              <textarea
                required
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-medium resize-none"
                placeholder="Please provide a brief reason for your leave request..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Leave History & Requests
        </h3>
        
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500 font-medium">No leave requests found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 border border-slate-200/60 rounded-2xl gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-mono">{req.type}</span>
                    <span className="text-sm font-bold text-slate-800">{req.days} Day{req.days > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {new Date(req.start).toLocaleDateString()} - {new Date(req.end).toLocaleDateString()}
                  </p>
                  {req.notes && (
                    <p className="text-xs text-slate-400 mt-1 italic leading-relaxed">"{req.notes}"</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/60' :
                    req.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200/60' :
                    'bg-amber-100 text-amber-700 border border-amber-200/60'
                  }`}>
                    {req.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                    {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                    {req.status === 'Pending' && <Clock className="w-3 h-3 animate-pulse" />}
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
