with open('src/App.tsx', 'r') as f:
    lines = f.read().splitlines()

replacements = {
    651: "",
    710: "",
    790: """          <button
            onClick={handleOpenAddEmployee}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Team Profile
          </button>""",
    798: """            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Employee Profile & AI Roadmap
            </button>""",
    800: """            <button
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "team" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Team Trend Dashboard
            </button>""",
    802: """            <button
              onClick={() => setActiveTab("roster")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "roster" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Roster
            </button>""",
    804: """            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "compare" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Compare
            </button>""",
    939: """                        <button
                          onClick={() => {
                            setEditingEmployee(selectedReportEmployeeObj);
                            setIsEmployeeModalOpen(true);
                          }}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all shadow-xs"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit Profile
                        </button>""",
    942: """                        <button
                          onClick={() => {
                            setSelectedPerfEmployee(selectedReportEmployeeObj);
                            setPerfFormData({
                              attendance: 100,
                              conductedMeetings: 0,
                              deliveredProjectsAmount: 0,
                              deliveredProjectsValue: 0
                            });
                            setIsPerformanceModalOpen(true);
                          }}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all shadow-xs"
                        >
                          <Activity className="h-3.5 w-3.5" />
                          Log Activity
                        </button>""",
    1144: "",
    1159: """                    <button
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] uppercase font-bold rounded-lg transition-all"
                    >
                      View Path
                    </button>""",
    1267: """                      <button
                        onClick={() => setRosterSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 hover:bg-slate-300 rounded-md text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>""",
    1309: """                          <button
                            key={dept}
                            onClick={() => setRosterDeptFilter(dept)}
                            className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive ? "text-indigo-950" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="rosterDeptTab"
                                className="absolute inset-0 bg-white border border-indigo-200/60 rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                              />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                              {getDeptIcon(dept)}
                              {dept}
                            </span>
                            <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                              isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {count}
                            </span>
                          </button>""",
    1336: """                          <button
                            key={t}
                            onClick={() => setRosterTeamFilter(t)}
                            className={`relative px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive ? "text-blue-950" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="rosterTeamTab"
                                className="absolute inset-0 bg-white border border-blue-200/60 rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                              />
                            )}
                            <span className="relative z-10">{t}</span>
                            <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                              isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {count}
                            </span>
                          </button>""",
    1420: "",
    1466: """                                    <button
                                      onClick={() => copyToClipboard(emp.email)}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover/email:opacity-100 cursor-pointer"
                                      title="Copy Email"
                                    >
                                      {isEmailCopied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    </button>""",
    1472: """                                    <button
                                      onClick={() => copyToClipboard(emp.id)}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover/id:opacity-100 cursor-pointer"
                                      title="Copy ID"
                                    >
                                      {isIdCopied ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    </button>""",
    1480: """                                <button
                                  onClick={() => {
                                    setEditingEmployee(emp);
                                    setIsEmployeeModalOpen(true);
                                  }}
                                  className="p-2 text-slate-400 hover:bg-white hover:text-slate-700 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Edit Employee"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>""",
    1482: """                                <button
                                  onClick={() => setEmployeeToDelete(emp)}
                                  className="p-2 text-slate-400 hover:bg-white hover:text-rose-600 rounded-lg shadow-none hover:shadow-xs border border-transparent hover:border-rose-100 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Delete Employee"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>""",
    1506: """                              <button
                                onClick={() => {
                                  setRosterSearchQuery("");
                                  setRosterDeptFilter("All");
                                  setRosterTeamFilter("All");
                                }}
                                className="mt-3 text-[10px] font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Clear Filters
                              </button>""",
    1747: """              <button
                type="button"
                onClick={() => setIsEmployeeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>""",
    1842: """                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>""",
    1844: """                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  {editingEmployee ? "Save Changes" : "Create Profile"}
                </button>""",
    1863: """              <button
                type="button"
                onClick={() => setIsPerformanceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>""",
    2038: """                <button
                  type="button"
                  onClick={() => setIsPerformanceModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>""",
    2040: """                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save Metrics
                </button>""",
    2070: """              <button
                type="button"
                onClick={() => setIsTargetsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>""",
    2140: """                <button
                  type="button"
                  onClick={() => setIsTargetsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>""",
    2142: """                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save Targets
                </button>""",
    2169: """              <button
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>""",
    2171: """              <button
                onClick={confirmDeleteEmployee}
                disabled={isSubmitting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Confirm Deletion
              </button>"""
}

# Apply from bottom to top so line numbers don't shift!
for line_num in sorted(replacements.keys(), reverse=True):
    idx = line_num - 1
    # check that it's actually `<button` and `</button>`
    if lines[idx].strip() == "<button" and lines[idx+1].strip() == "</button>":
        del lines[idx:idx+2]
        if replacements[line_num]:
            lines.insert(idx, replacements[line_num])
    else:
        print(f"Warning: Line {line_num} does not match expected button structure!")

with open('src/App.tsx', 'w') as f:
    f.write('\n'.join(lines))
