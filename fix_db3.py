with open('server/db.ts', 'r') as f:
    code = f.read()

bad = """    }
  }
}



  // --- LEAVE REQUESTS API ---"""
good = """    }
  }

  // --- LEAVE REQUESTS API ---"""

code = code.replace(bad, good)
code += "\\n}\\n" # wait, earlier I removed export const... and put it at the end. 
# actually, let's just rewrite the end of the file.

