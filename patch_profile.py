with open('src/App.tsx', 'r') as f:
    code = f.read()

old_code = """            {/* Profile area */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-slate-800 font-display">{loggedInManager.name}</span>
                <span className="text-[10px] text-slate-400 font-mono font-medium">{loggedInManager.role}</span>
              </div>
              <motion.div 
                className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-extrabold text-xs text-blue-600 border border-white overflow-hidden shrink-0">
                  <img src={get3DAvatarUrl(loggedInManager.name)} alt={loggedInManager.name} className="w-full h-full object-cover" />
                </div>
                {/* Active Indicator Pulse */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse z-10" />
              </motion.div>
            </div>"""

new_code = """            {/* Profile area */}
            <div className="flex items-center gap-4 relative group">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-slate-800 font-display group-hover:text-blue-600 transition-colors">{loggedInManager.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{loggedInManager.role}</span>
                </div>
                <motion.div 
                  className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-extrabold text-xs text-blue-600 border border-white overflow-hidden shrink-0">
                    <img src={get3DAvatarUrl(loggedInManager.name)} alt={loggedInManager.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Active Indicator Pulse */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse z-10" />
                </motion.div>
              </div>
              
              {/* Creative Sign Out Button - Revealed on hover */}
              <div className="absolute right-0 top-full mt-2 w-full flex justify-end opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 z-50">
                <button
                  onClick={() => setLoggedInManager(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-lg shadow-rose-500/10 text-xs font-bold text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer w-auto whitespace-nowrap"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>"""

if old_code in code:
    code = code.replace(old_code, new_code)
    print("Replaced profile area.")
else:
    print("Could not find old code.")

with open('src/App.tsx', 'w') as f:
    f.write(code)
