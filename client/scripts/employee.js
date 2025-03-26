const employeeList = document.querySelector("#employeeList");
const addBtn = document.querySelector("#add-btn");
const employeeName = document.querySelector("#name");

const departmentList = document.querySelector("#departments");

const state = {
    departmentId: null,
    employeeName: "",
};

async function getAllDepartments() {
    try {
        fetch("http://localhost:3000/api/departements")
            .then((response) => response.json())
            .then((result) => {
                result.forEach((department) => {
                    const option = document.createElement("option");
                    option.value = department.id; // Utiliser l'id comme valeur
                    option.innerHTML = department.name;

                    departmentList.appendChild(option);
                });

                departmentList.addEventListener("change", function () {
                    const selectedOption =
                        departmentList.options[departmentList.selectedIndex];
                    state.departmentId = selectedOption.value; // Mettre à jour l'état
                    console.log(state.departmentId); // Afficher l'état mis à jour
                });
            })
            .catch((error) => {
                console.error(
                    `Erreur lors de la récupération des départements: ${error}`
                );
            });
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

addBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const employee = employeeName.value.trim();

    if (!employee) {
        alert("Vous devez entrer un employé");
        return;
    }

    await addNewEmployee({
        name: employee,
        departement_id: state.departmentId,
    });

    // Réinitialiser le champ de saisie
    employeeName.value = "";

    // Réinitialiser le select à la première option
    departmentList.selectedIndex = 0;

    // Mettre à jour l'état local avec la valeur de la première option
    state.departmentId = departmentList.options[0].value;

    // Afficher l'état mis à jour dans la console (facultatif)
    console.log("État réinitialisé :", state.departmentId);
});

document.addEventListener("DOMContentLoaded", async function () {
    await getAllEmployees();
    await getAllDepartments();
});
