const leaveList = document.querySelector("#leaveList");
const leaveForm = document.querySelector("#leaveForm");
const employeeSelect = document.querySelector("#employeeSelect");
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");

// Fonction pour récupérer les congés
async function getAllLeaves() {
    try {
        const response = await fetch("http://localhost:3000/api/conges");
        const leaves = await response.json();

        leaveList.innerHTML = ""; // Réinitialiser la liste des congés

        leaves.forEach((leave) => {
            const div = document.createElement("div");
            div.classList.add("leave-item");

            const p = document.createElement("p");
            p.innerHTML = `${leave.employee_name} : Du ${formatDateToLocal(
                leave.start_date
            )} au ${formatDateToLocal(leave.end_date)}`;

            // Bouton pour mettre à jour le congé
            const updateBtn = document.createElement("button");
            updateBtn.innerHTML = "Modifier";
            updateBtn.classList.add("update-btn");
            updateBtn.addEventListener("click", () => openUpdateModal(leave));

            // Bouton pour supprimer le congé
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Supprimer";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => deleteLeave(leave.id));

            div.appendChild(p);
            div.appendChild(updateBtn);
            div.appendChild(deleteBtn);

            leaveList.appendChild(div);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des congés :", error);
    }
}

// Fonction pour récupérer la liste des employés
async function getAllEmployees() {
    try {
        const response = await fetch("http://localhost:3000/api/employes");
        const employees = await response.json();

        employeeSelect.innerHTML = ""; // Réinitialiser le menu déroulant

        employees.forEach((employee) => {
            const option = document.createElement("option");
            option.value = employee.id; // L'ID de l'employé
            option.textContent = employee.name; // Le nom de l'employé
            employeeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
    }
}

// Fonction pour ajouter un congé
async function addLeave(employeeId, startDate, endDate) {
    try {
        const response = await fetch("http://localhost:3000/api/conges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employee_id: employeeId,
                start_date: startDate,
                end_date: endDate,
            }),
        });

        if (response.ok) {
            Toast.success("Congé ajouté avec succès !");
            getAllLeaves(); // Rafraîchir la liste des congés
            getAllEmployees(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de l'ajout du congé");
        }
    } catch (error) {
        console.error("Erreur pour ajouter le congé :", error);
    }
}

// Fonction pour mettre à jour un congé
async function updateLeave(leaveId, startDate, endDate) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/conges/${leaveId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                }),
            }
        );

        if (response.ok) {
            Toast.success("Congé mis à jour avec succès !");
            getAllLeaves(); // Rafraîchir la liste des congés
            getAllEmployees(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de la mise à jour du congé");
        }
    } catch (error) {
        console.error("Erreur pour mettre à jour le congé :", error);
    }
}

// Fonction pour supprimer un congé
async function deleteLeave(leaveId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/conges/${leaveId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            Toast.success("Congé supprimé avec succès !");
            getAllLeaves(); // Rafraîchir la liste des congés
            getAllEmployees(); // Rafraîchir la liste des employés
        } else {
            console.error("Erreur lors de la suppression du congé");
        }
    } catch (error) {
        console.error("Erreur pour supprimer le congé :", error);
    }
}

function formatDateToLocal(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function openUpdateModal(leave) {
    // Recharger la liste des employés pour s'assurer qu'elle est à jour
    await getAllEmployees();

    // Convertir les dates au format "yyyy-MM-dd" en utilisant la méthode locale
    const startDate = formatDateToLocal(leave.start_date);
    const endDate = formatDateToLocal(leave.end_date);

    // Pré-remplir les champs avec les données actuelles du congé
    employeeSelect.value = leave.employee_id;
    startDateInput.value = startDate;
    endDateInput.value = endDate;

    // Modifier le comportement du formulaire pour mettre à jour le congé
    leaveForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedStartDate = startDateInput.value;
        const updatedEndDate = endDateInput.value;

        if (!updatedStartDate || !updatedEndDate) {
            Toast.error("Veuillez remplir tous les champs.");
            return;
        }

        await updateLeave(leave.id, updatedStartDate, updatedEndDate);

        // Réinitialiser le formulaire pour l'ajout après la mise à jour
        leaveForm.onsubmit = addLeaveHandler;
    };
}

// Gérer la soumission du formulaire pour ajouter un congé
function addLeaveHandler(e) {
    e.preventDefault();

    const employeeId = employeeSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!employeeId || !startDate || !endDate) {
        Toast.error("Veuillez remplir tous les champs.");
        return;
    }

    addLeave(employeeId, startDate, endDate);
}

// Réinitialiser le comportement du formulaire pour l'ajout
leaveForm.onsubmit = addLeaveHandler;

// Charger les congés et les employés au chargement de la page
getAllLeaves();
getAllEmployees();
