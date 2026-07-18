const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /<div className="flex items-center gap-1.5">\s*<button\s*onClick=\{\(\) => handleUpdateTeammateLeaveStatus\(employee\.id, request\.id, "Approved"\)\}\s*className="px-2.5 py-1 bg-emerald-650 hover:bg-emerald-600 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-3xs text-\[11px\]"\s*>\s*Approve\s*<\/button>\s*<button\s*onClick=\{\(\) => handleUpdateTeammateLeaveStatus\(employee\.id, request\.id, "Rejected"\)\}\s*className="px-2.5 py-1 bg-rose-650 hover:bg-rose-600 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-3xs text-\[11px\]"\s*>\s*Reject\s*<\/button>\s*<button\s*onClick=\{\(\) => handleDeleteTeammateLeaveRequest\(employee\.id, request\.id\)\}\s*className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-slate-450 hover:text-rose-600 cursor-pointer transition-colors shadow-3xs"\s*title="Delete request record"\s*>\s*<Trash2 className="w-3.5 h-3.5" \/>\s*<\/button>\s*<\/div>/g,
  `<div className="flex items-center gap-2">
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
                          </div>`
);
fs.writeFileSync('src/App.tsx', code);
