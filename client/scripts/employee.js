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
                employeeList.innerHTML = ""; // Réinitialiser la liste des employés
                result.forEach((employee) => {
                    const div = document.createElement("div");
                    div.classList.add("employee-item");

                    const p = document.createElement("p");
                    p.innerHTML = employee.name;

                    // Bouton Éditer
                    const editBtn = document.createElement("button");
                    editBtn.innerHTML = "Éditer";
                    editBtn.classList.add("edit-btn");
                    editBtn.addEventListener("click", () =>
                        openEditModal(employee)
                    );

                    // Bouton Supprimer
                    const deleteBtn = document.createElement("button");
                    deleteBtn.innerHTML = "Supprimer";
                    deleteBtn.classList.add("delete-btn");
                    deleteBtn.addEventListener("click", () =>
                        deleteEmployee(employee.id)
                    );

                    div.appendChild(p);
                    div.appendChild(editBtn);
                    div.appendChild(deleteBtn);

                    employeeList.appendChild(div);
                });
            });
    } catch (error) {
        console.error(`Erreur pour récupérer les employés: ${error}`);
    }
}

async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/employes/${employeeId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            alert("Employé supprimé avec succès !");
            await getAllEmployees(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de la suppression de l'employé");
        }
    } catch (error) {
        console.error(`Erreur pour supprimer l'employé: ${error}`);
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

                // Ajouter l'employé à la liste avec les boutons
                const div = document.createElement("div");
                div.classList.add("employee-item");

                const p = document.createElement("p");
                p.innerHTML = result.result.name;

                // Bouton Éditer
                const editBtn = document.createElement("button");
                editBtn.innerHTML = "Éditer";
                editBtn.classList.add("edit-btn");
                editBtn.addEventListener("click", () =>
                    openEditModal({
                        id: result.result.id,
                        name: result.result.name,
                        departement_id: result.result.departement_id,
                    })
                );

                // Bouton Supprimer
                const deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = "Supprimer";
                deleteBtn.classList.add("delete-btn");
                deleteBtn.addEventListener("click", () =>
                    deleteEmployee(result.result.id)
                );

                div.appendChild(p);
                div.appendChild(editBtn);
                div.appendChild(deleteBtn);

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

function openEditModal(employee) {
    const modal = document.getElementById("editModal");
    const editName = document.getElementById("editName");
    const editDepartment = document.getElementById("editDepartment");

    // Pré-remplir les champs avec les données actuelles de l'employé
    editName.value = employee.name;

    // Charger les départements dans le menu déroulant
    fetch("http://localhost:3000/api/departements")
        .then((response) => response.json())
        .then((departments) => {
            editDepartment.innerHTML = ""; // Réinitialiser les options
            departments.forEach((department) => {
                const option = document.createElement("option");
                option.value = department.id;
                option.textContent = department.name;
                if (department.id === employee.departement_id) {
                    option.selected = true; // Sélectionner le département actuel
                }
                editDepartment.appendChild(option);
            });
        });

    // Afficher la boîte de dialogue
    modal.style.display = "block";

    // Gérer la soumission du formulaire
    const editForm = document.getElementById("editForm");
    editForm.onsubmit = async function (e) {
        e.preventDefault();

        const newName = editName.value.trim();
        const newDepartmentId = editDepartment.value;

        if (!newName) {
            alert("Le nom ne peut pas être vide !");
            return;
        }

        await editEmployee({
            ...employee,
            name: newName,
            departement_id: newDepartmentId,
        });

        // Fermer la boîte de dialogue
        modal.style.display = "none";
    };

    // Fermer la boîte de dialogue en cliquant sur le bouton "close"
    const closeBtn = document.querySelector(".close");
    closeBtn.onclick = function () {
        modal.style.display = "none";
    };
}

async function editEmployee(employee) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/employes/${employee.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: employee.name,
                    departement_id: parseInt(employee.departement_id), // S'assurer que l'ID est un entier
                }),
            }
        );

        if (response.ok) {
            alert("Employé modifié avec succès !");
            await getAllEmployees(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de la modification de l'employé");
        }
    } catch (error) {
        console.error(`Erreur pour modifier l'employé: ${error}`);
    }
}
