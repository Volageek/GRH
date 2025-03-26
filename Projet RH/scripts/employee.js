const employeeList = document.querySelector("#employeeList");
const addBtn = document.querySelector("#add-btn");
const employeeName = document.querySelector("#name");

async function addNewEmployee(employee) {
    try {
        const response = await fetch("http://localhost:3000/api/employes", {
            mode: "no-cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout d'un employé");
        }

        const result = await response.json();
        return result;
    } catch(error) {
        console.error(`Erreur pour ajouter un employé: ${error}`);
    }
};

addBtn.addEventListener("click", async function(e) {
   e.preventDefault();

   const employee = employeeName.value.trim();
  
   if (!employee)  {
    alert("Vous devez entrer un employé");
    return;
   }

   const newEmployee = await addNewEmployee({ name: employee, departement_id: 1 });
   
   const div = document.createElement("div");
   const p = document.createElement("p");
   p.innerHTML = newEmployee.name;
   div.appendChild(p);

   employeeList.appendChild(div);
});