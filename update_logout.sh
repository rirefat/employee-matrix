sed -i '/<div className="flex items-center gap-3">/a\
              <button\
                onClick={() => setLoggedInManager(null)}\
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors mr-2 cursor-pointer"\
              >\
                Sign Out\
              </button>' src/App.tsx
