sed -i 's/<span className="text-xs font-bold text-slate-800 font-display">Rafiul Refat<\/span>/<span className="text-xs font-bold text-slate-800 font-display">{loggedInManager.name}<\/span>/g' src/App.tsx
sed -i 's/<span className="text-\[10px\] text-slate-400 font-mono font-medium">Lead \/ System Node<\/span>/<span className="text-\[10px\] text-slate-400 font-mono font-medium">{loggedInManager.role}<\/span>/g' src/App.tsx
sed -i 's/<img src={get3DAvatarUrl("Rafiul")} alt="Rafiul Refat"/<img src={get3DAvatarUrl(loggedInManager.name)} alt={loggedInManager.name}/g' src/App.tsx
