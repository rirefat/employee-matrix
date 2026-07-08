import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace('<User className=', '<Briefcase className=')
code = code.replace('<Activity className=', '<TrendingUp className=')
code = code.replace('<Save className=', '<Check className=')
code = code.replace('disabled={isSubmitting}', '')

code = code.replace('onClick={confirmDeleteEmployee}', 'onClick={handleDeleteEmployee}')
code = code.replace('onClick={() => copyToClipboard(emp.email)}', 'onClick={() => navigator.clipboard.writeText(emp.email)}')
code = code.replace('onClick={() => copyToClipboard(emp.id)}', 'onClick={() => navigator.clipboard.writeText(emp.id)}')

code = re.sub(r'\{isSubmitting \? \(\s*<span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>\s*\) : \(\s*<(Check|Trash2) className="h-3.5 w-3.5" />\s*\)\}', r'<\g<1> className="h-3.5 w-3.5" />', code)

with open('src/App.tsx', 'w') as f:
    f.write(code)
