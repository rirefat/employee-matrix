sed -i 's/const filteredEmployees = employees.filter/const filteredEmployees = myEmployees.filter/g' src/App.tsx
sed -i 's/const selectedReportEmployeeObj = employees.find/const selectedReportEmployeeObj = myEmployees.find/g' src/App.tsx
sed -i 's/return employees.filter(e => e.active/return myEmployees.filter(e => e.active/g' src/App.tsx
sed -i 's/}, \[employees\]);/}, \[myEmployees\]);/g' src/App.tsx
sed -i 's/const filtered = employees.filter(emp => {/const filtered = myEmployees.filter(emp => {/g' src/App.tsx
sed -i 's/    employees,/    myEmployees,/g' src/App.tsx
sed -i 's/{employees.length} Total/{myEmployees.length} Total/g' src/App.tsx
sed -i 's/<DashboardTab employees={employees}/<DashboardTab employees={myEmployees}/g' src/App.tsx
sed -i 's/{employees.length} Active Profiles/{myEmployees.length} Active Profiles/g' src/App.tsx
sed -i 's/? employees.length/? myEmployees.length/g' src/App.tsx
sed -i 's/: employees.filter/: myEmployees.filter/g' src/App.tsx
sed -i 's/{employees.map(e => (/{myEmployees.map(e => (/g' src/App.tsx
sed -i 's/const emp1 = employees.find/const emp1 = myEmployees.find/g' src/App.tsx
sed -i 's/const emp2 = employees.find/const emp2 = myEmployees.find/g' src/App.tsx
