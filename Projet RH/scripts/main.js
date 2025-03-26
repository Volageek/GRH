// Données globales
let employees = [];       // Liste des employés
let departments = [];     // Liste des départements
let salaries = [];        // Liste des salaires
let leaves = [];          // Liste des congés
let absences = [];        // Liste des absences

// Fonction pour charger les employés dans les listes déroulantes
function loadEmployees() {
  const employeeDropdowns = document.querySelectorAll('select#employee');
  employeeDropdowns.forEach(dropdown => {
    dropdown.innerHTML = '';
    employees.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee.id;
      option.textContent = employee.name;
      dropdown.appendChild(option);
    });
  });
}

// Gestion des employés
if (document.getElementById('employeeForm')) {
  document.getElementById('employeeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    if (name) {
      employees.push({ id: employees.length + 1, name });
      updateEmployeeList();
      loadEmployees(); // Met à jour les listes déroulantes
      document.getElementById('name').value = '';
    }
  });

  function updateEmployeeList() {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';
    employees.forEach(employee => {
      const li = document.createElement('li');
      li.textContent = employee.name;

      const editButton = document.createElement('button');
      editButton.textContent = 'Éditer';
      editButton.addEventListener('click', () => editEmployee(employee.id));
      li.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => deleteEmployee(employee.id));
      li.appendChild(deleteButton);

      employeeList.appendChild(li);
    });
  }

  function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    const newName = prompt('Entrez le nouveau nom :', employee.name);
    if (newName) {
      employee.name = newName;
      updateEmployeeList();
    }
  }

  function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    updateEmployeeList();
  }

  window.onload = updateEmployeeList;
}

// Gestion des départements
if (document.getElementById('departmentForm')) {
  document.getElementById('departmentForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const departmentName = document.getElementById('departmentName').value;
    if (departmentName) {
      departments.push({ id: departments.length + 1, name: departmentName });
      updateDepartmentList();
      document.getElementById('departmentName').value = '';
    }
  });

  function updateDepartmentList() {
    const departmentList = document.getElementById('departmentList');
    departmentList.innerHTML = '';
    departments.forEach(department => {
      const li = document.createElement('li');
      li.textContent = department.name;

      const editButton = document.createElement('button');
      editButton.textContent = 'Éditer';
      editButton.addEventListener('click', () => editDepartment(department.id));
      li.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => deleteDepartment(department.id));
      li.appendChild(deleteButton);

      departmentList.appendChild(li);
    });
  }

  function editDepartment(id) {
    const department = departments.find(dept => dept.id === id);
    const newName = prompt('Entrez le nouveau nom :', department.name);
    if (newName) {
      department.name = newName;
      updateDepartmentList();
    }
  }

  function deleteDepartment(id) {
    departments = departments.filter(dept => dept.id !== id);
    updateDepartmentList();
  }

  window.onload = updateDepartmentList;
}

// Gestion des salaires
if (document.getElementById('salaryForm')) {
  document.getElementById('salaryForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const employeeId = document.getElementById('employee').value;
    const amount = document.getElementById('amount').value;
    if (employeeId && amount) {
      salaries.push({ employeeId, amount });
      updateSalaryList();
      document.getElementById('amount').value = '';
    }
  });

  function updateSalaryList() {
    const salaryList = document.getElementById('salaryList');
    salaryList.innerHTML = '';
    salaries.forEach(salary => {
      const employee = employees.find(emp => emp.id === salary.employeeId);
      const li = document.createElement('li');
      li.textContent = `${employee.name} : ${salary.amount} €`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => deleteSalary(salary));
      li.appendChild(deleteButton);

      salaryList.appendChild(li);
    });
  }

  function deleteSalary(salary) {
    salaries = salaries.filter(s => s !== salary);
    updateSalaryList();
  }

  window.onload = loadEmployees;
}

// Gestion des congés
if (document.getElementById('leaveForm')) {
  document.getElementById('leaveForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const employeeId = document.getElementById('employee').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (employeeId && startDate && endDate) {
      leaves.push({ employeeId, startDate, endDate });
      updateLeaveList();
      document.getElementById('startDate').value = '';
      document.getElementById('endDate').value = '';
    }
  });

  function updateLeaveList() {
    const leaveList = document.getElementById('leaveList');
    leaveList.innerHTML = '';
    leaves.forEach(leave => {
      const employee = employees.find(emp => emp.id === leave.employeeId);
      const li = document.createElement('li');
      li.textContent = `${employee.name} : Du ${leave.startDate} au ${leave.endDate}`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => deleteLeave(leave));
      li.appendChild(deleteButton);

      leaveList.appendChild(li);
    });
  }

  function deleteLeave(leave) {
    leaves = leaves.filter(l => l !== leave);
    updateLeaveList();
  }

  window.onload = loadEmployees;
}

// Gestion des absences
if (document.getElementById('absenceForm')) {
  document.getElementById('absenceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const employeeId = document.getElementById('employee').value;
    const date = document.getElementById('date').value;
    const reason = document.getElementById('reason').value;
    if (employeeId && date && reason) {
      absences.push({ employeeId, date, reason });
      updateAbsenceList();
      document.getElementById('date').value = '';
      document.getElementById('reason').value = '';
    }
  });

  function updateAbsenceList() {
    const absenceList = document.getElementById('absenceList');
    absenceList.innerHTML = '';
    absences.forEach(absence => {
      const employee = employees.find(emp => emp.id === absence.employeeId);
      const li = document.createElement('li');
      li.textContent = `${employee.name} : ${absence.date} (${absence.reason})`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => deleteAbsence(absence));
      li.appendChild(deleteButton);

      absenceList.appendChild(li);
    });
  }

  function deleteAbsence(absence) {
    absences = absences.filter(a => a !== absence);
    updateAbsenceList();
  }

  window.onload = loadEmployees;
}

// Tableau de bord
if (document.getElementById('stats')) {
  function updateDashboard() {
    document.getElementById('employeeCount').textContent = employees.length;
    document.getElementById('departmentCount').textContent = departments.length;
    document.getElementById('leaveCount').textContent = leaves.length;
    document.getElementById('absenceCount').textContent = absences.length;
  }

  window.onload = updateDashboard;
}