with open('src/App.tsx', 'r') as f:
    code = f.read()

old_tab_state = '  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster" | "compare">("profile");'
new_tab_state = '  const [activeTab, setActiveTab] = useState<"profile" | "team" | "roster" | "compare" | "leaves">("profile");'
code = code.replace(old_tab_state, new_tab_state)

old_nav = """            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "compare" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Compare
            </button>
          </nav>"""
new_nav = """            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "compare" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Compare
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "leaves" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Leave Mgmt
            </button>
          </nav>"""
code = code.replace(old_nav, new_nav)

with open('src/App.tsx', 'w') as f:
    f.write(code)
