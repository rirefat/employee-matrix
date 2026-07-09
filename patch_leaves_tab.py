with open('src/App.tsx', 'r') as f:
    code = f.read()

leaves_tab_code = """
          {/* TAB CONTENT: LEAVE MANAGEMENT */}
          {activeTab === "leaves" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Leave Balance Engine</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage and track employee leave capacities.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Sick Leave</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">7 <span className="text-sm font-medium text-slate-500">days/yr</span></p>
                  <p className="text-xs text-slate-500 mt-1">For medical emergencies</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Casual Leave</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">7 <span className="text-sm font-medium text-slate-500">days/yr</span></p>
                  <p className="text-xs text-slate-500 mt-1">For personal matters</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Gov & Fest</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">14 <span className="text-sm font-medium text-slate-500">days/yr</span></p>
                  <p className="text-xs text-slate-500 mt-1">Public & cultural holidays</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800">Employee Leave Balances</h3>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                      <span>Total Leave Balance:</span>
                      <span className="text-blue-600">28 days</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="bg-slate-50/70 uppercase text-slate-400 font-mono text-[9px] tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4 text-center">Sick (7)</th>
                        <th className="px-6 py-4 text-center">Casual (7)</th>
                        <th className="px-6 py-4 text-center">Gov/Fest (14)</th>
                        <th className="px-6 py-4 text-center">Total Remaining</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {employees.map(emp => {
                        const leave = emp.leaveBalance || { sickLeaveUsed: 0, casualLeaveUsed: 0, govFestHolidaysUsed: 0 };
                        const sickRemain = 7 - leave.sickLeaveUsed;
                        const casRemain = 7 - leave.casualLeaveUsed;
                        const govRemain = 14 - leave.govFestHolidaysUsed;
                        const totalRemain = sickRemain + casRemain + govRemain;
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                  <img src={get3DAvatarUrl(emp.name)} alt={emp.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">{emp.name}</div>
                                  <div className="text-[10px] text-slate-400">{emp.role}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-slate-700">{emp.department}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-mono font-bold ${sickRemain <= 2 ? 'text-rose-600' : 'text-slate-600'}`}>{sickRemain}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-mono font-bold ${casRemain <= 2 ? 'text-amber-600' : 'text-slate-600'}`}>{casRemain}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-mono font-bold ${govRemain <= 4 ? 'text-blue-600' : 'text-slate-600'}`}>{govRemain}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                  <div 
                                    className={`h-full rounded-full ${totalRemain < 10 ? 'bg-rose-500' : totalRemain < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${(totalRemain / 28) * 100}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold text-slate-700 w-6">{totalRemain}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleOpenEditEmployee(emp)}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                Manage Leaves
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>"""

old_block = """            </div>
          )}
        </div>
      </main>"""

code = code.replace(old_block, leaves_tab_code)
with open('src/App.tsx', 'w') as f:
    f.write(code)
