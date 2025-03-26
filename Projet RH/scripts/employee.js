const employeeList = document.querySelector("#employeeList");
const addBtn = document.querySelector("#add-btn");
const employeeName = document.querySelector("#name");

const departments = document.querySelector("#departments");

function getAllDepartments() {
    try {
        fetch("http://localhost:3000/api/departements")
            .then((response) => response.json())
            .then((result) => console.log(result));
    } catch (error) {
        console.error(
            `Erreur lors de la récupération des départements: ${error}`
        );
    }
}

function getAllEmployees() {
    try {
        fetch("http://localhost:3000/api/employes")
            .then((response) => response.json())
            .then((result) => {
                result.forEach((employee) => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    p.innerHTML = employee.name;
                    div.appendChild(p);

                    employeeList.appendChild(div);
                });
            });
    } catch (error) {
        console.error(`Erreur pour récupérer les employés: ${error}`);
    }
}

function addNewEmployee({ name, departement_id }) {
    try {
        fetch("http://localhost:3000/api/employes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, departement_id }),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log({ result });
                getAllEmployees();
            });
    } catch (error) {
        console.error(`Erreur pour ajouter un employé: ${error}`);
    }
}

addBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const employee = employeeName.value.trim();

    if (!employee) {
        alert("Vous devez entrer un employé");
        return;
    }

    await addNewEmployee({ name: employee, departement_id: 3 });
});

document.addEventListener("DOMContentLoaded", function () {
    getAllEmployees();
});
