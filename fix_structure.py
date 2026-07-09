with open('src/App.tsx', 'r') as f:
    code = f.read()

bad = """                </div>

              {/* Historical Log of Leave Requests */}"""
good = """                </div>
              </div>

              {/* Historical Log of Leave Requests */}"""

code = code.replace(bad, good)

# wait, we also need to close space-y-6.
bad2 = """              </div>
            </div>
          )}
        </div>
      </main>"""
good2 = """              </div>
            </div>
          )}
        </div>
      </main>"""
# Let's just count the divs and fix it.
