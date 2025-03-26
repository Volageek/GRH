const employeeList = document.querySelector("#employeeList");
const addBtn = document.querySelector("#add-btn");
const employeeName = document.querySelector("#name");

const departmentList = document.querySelector("#departments");
let departmentId = 1;

function addDepartmentOption(department) {
    const option = document.createElement("option");
    option.value = department.name;
    option.innerHTML = department.name;
    option.addEventListener("click", function () {
        departmentId = option.id;
    });

    departmentList.appendChild(option);
}

async function getAllDepartments() {
    try {
        const response = await fetch("http://localhost:3000/api/departements");
        const result = await response.json();

        return result;

        /*  fetch("http://localhost:3000/api/departements")
            .then((response) => response.json())
            .then((result) => {
                result.forEach((department) => {
                    const option = document.createElement("option");
                    option.value = department.name;
                    option.innerHTML = department.name;
                    option.addEventListener("click", function () {
                        departmentId = option.id;
                    });

                    departments.appendChild(option);
                });
            }); */
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
                const div = document.createElement("div");
                const p = document.createElement("p");
                p.innerHTML = result.result.name;
                div.appendChild(p);

                employeeList.appendChild(div);
            });
    } catch (error) {
        console.error(`Erreur pour ajouter un employé: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    getAllEmployees();

    let departments = await getAllDepartments();
    console.log({ departments });
    let departmentId = 1;

    departments.forEach((dep) => {
        const option = document.createElement("option");
        option.value = dep.name;
        option.innerHTML = dep.name;
        option.addEventListener("click", function () {
            departmentId = dep.id;
        });

        departmentList.appendChild(option);
    });

    addBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        const employee = employeeName.value.trim();

        if (!employee) {
            alert("Vous devez entrer un employé");
            return;
        }

        await addNewEmployee({ name: employee, departement_id: departmentId });
    });
});
