import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Replace the layout start
start_old = """      {activePortal === "performance" && (
        <>
      {/* Main Grid Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 items-start overflow-y-auto overflow-x-hidden">"""

# Replace all the way to:
#         <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

pattern = re.compile(re.escape(start_old) + r'.*?\<div className="col\-span\-12 lg:col\-span\-8 flex flex\-col gap\-6"\>', re.DOTALL)

start_new = """      {activePortal === "performance" && (
        <>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-8 overflow-y-auto overflow-x-hidden">"""

code = pattern.sub(start_new, code)

# Remove the closing </div>
end_old = """            </div>
          )}
        </div>
      </main>
      </>
      )}"""

end_new = """            </div>
          )}
      </main>
      </>
      )}"""

code = code.replace(end_old, end_new)

# Add horizontal selector inside the profile tab
profile_tab_old = """          {/* TAB CONTENT: PROFILE (Individual analytics + AI Report) */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <AnimatePresence mode="wait">"""

profile_tab_new = """          {/* TAB CONTENT: PROFILE (Individual analytics + AI Report) */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Horizontal Team Member Selector */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Select Team Member
                  </h3>
                  <button 
                    onClick={handleOpenAddEmployee}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Add Profile
                  </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x scroll-px-4">
                  {myEmployees.map(emp => {
                    const isSelected = emp.id === reportEmployeeId;
                    return (
                      <button
                        key={emp.id}
                        onClick={() => setReportEmployeeId(emp.id)}
                        className={`shrink-0 flex items-center gap-3 p-3 rounded-2xl border transition-all snap-start w-64 text-left ${
                          isSelected 
                            ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500" 
                            : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm opacity-70 hover:opacity-100"
                        }`}
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          <img src={get3DAvatarUrl(emp.name)} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className={`text-sm font-bold truncate ${isSelected ? "text-slate-900" : "text-slate-700"}`}>{emp.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{emp.department}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">"""

code = code.replace(profile_tab_old, profile_tab_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)
