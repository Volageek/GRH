const employeeList = document.querySelector("#employeeList");
const salaryForm = document.querySelector("#salaryForm");
const salaryInput = document.querySelector("#salaryInput");
const employeeSelect = document.querySelector("#employeeSelect");

// Fonction pour récupérer la liste des employés avec leur salaire
async function getAllEmployeesWithSalaries() {
    try {
        const response = await fetch("http://localhost:3000/api/employes");
        const employees = await response.json();

        employeeList.innerHTML = ""; // Réinitialiser la liste des employés
        employeeSelect.innerHTML = ""; // Réinitialiser le menu déroulant

        employees.forEach((employee) => {
            // Ajouter l'employé à la liste affichée
            const div = document.createElement("div");
            div.classList.add("employee-item");

            const p = document.createElement("p");
            p.innerHTML = `${employee.name} - Salaire : ${
                employee.salary ? employee.salary + " €" : "Non défini"
            }`;

            // Bouton pour supprimer le salaire
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Supprimer le salaire";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () =>
                deleteEmployeeSalary(employee.id)
            );

            div.appendChild(p);
            if (employee.salary) {
                div.appendChild(deleteBtn);
                div.style.display = "grid";
                div.style.gridTemplateColumns = "1fr 1fr";
            }
            employeeList.appendChild(div);

            // Ajouter l'employé au menu déroulant
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent = employee.name;
            employeeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
    }
}

// Fonction pour ajouter ou modifier le salaire d'un employé
async function updateEmployeeSalary(employeeId, salary) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/salaires/${employeeId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: salary }),
            }
        );

        if (response.ok) {
            Toast.success("Salaire mis à jour avec succès !");
            getAllEmployeesWithSalaries(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de la mise à jour du salaire");
        }
    } catch (error) {
        console.error("Erreur pour mettre à jour le salaire :", error);
    }
}

// Fonction pour supprimer le salaire d'un employé
async function deleteEmployeeSalary(employeeId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/salaires/${employeeId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            Toast.success("Salaire supprimé avec succès !");
            getAllEmployeesWithSalaries(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de la suppression du salaire");
        }
    } catch (error) {
        console.error("Erreur pour supprimer le salaire :", error);
    }
}

// Gérer la soumission du formulaire pour ajouter/modifier un salaire
salaryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const employeeId = employeeSelect.value;
    const salary = parseFloat(salaryInput.value);

    if (!employeeId || isNaN(salary) || salary <= 0) {
        Toast.error(
            "Veuillez sélectionner un employé et entrer un salaire valide."
        );
        return;
    }

    updateEmployeeSalary(employeeId, salary);
});

// Charger la liste des employés au chargement de la page
getAllEmployeesWithSalaries();
