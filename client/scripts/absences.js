const absenceList = document.querySelector("#absenceList");
const absenceForm = document.querySelector("#absenceForm");
const employeeSelect = document.querySelector("#employeeSelect");
const dateInput = document.querySelector("#dateInput");
const reasonInput = document.querySelector("#reasonInput");

function formatDateToLocal(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Fonction pour récupérer les absences
async function getAllAbsences() {
    try {
        const response = await fetch("http://localhost:3000/api/absences");
        const absences = await response.json();

        absenceList.innerHTML = ""; // Réinitialiser la liste des absences

        absences.forEach((absence) => {
            const div = document.createElement("div");
            div.classList.add("absence-item");

            const p = document.createElement("p");
            p.innerHTML = `${absence.employee_name} : ${formatDateToLocal(
                absence.date
            )} - ${absence.reason}`;

            // Bouton pour mettre à jour l'absence
            const updateBtn = document.createElement("button");
            updateBtn.innerHTML = "Modifier";
            updateBtn.classList.add("update-btn");
            updateBtn.addEventListener("click", () => openUpdateModal(absence));

            // Bouton pour supprimer l'absence
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Supprimer";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () =>
                deleteAbsence(absence.id)
            );

            div.appendChild(p);
            div.appendChild(updateBtn);
            div.appendChild(deleteBtn);

            absenceList.appendChild(div);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des absences :", error);
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
            option.value = employee.id;
            option.textContent = employee.name;
            employeeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
    }
}

// Fonction pour ajouter une absence
async function addAbsence(employeeId, date, reason) {
    try {
        const response = await fetch("http://localhost:3000/api/absences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employee_id: employeeId,
                date: date,
                reason: reason,
            }),
        });

        if (response.ok) {
            Toast.success("Absence ajoutée avec succès !");
            getAllAbsences(); // Rafraîchir la liste des absences
        } else {
            console.error("Erreur lors de l'ajout de l'absence");
        }
    } catch (error) {
        console.error("Erreur pour ajouter l'absence :", error);
    }
}

// Fonction pour mettre à jour une absence
async function updateAbsence(absenceId, date, reason) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/absences/${absenceId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: date,
                    reason: reason,
                }),
            }
        );

        if (response.ok) {
            Toast.success("Absence mise à jour avec succès !");
            getAllAbsences(); // Rafraîchir la liste des absences
        } else {
            console.error("Erreur lors de la mise à jour de l'absence");
        }
    } catch (error) {
        console.error("Erreur pour mettre à jour l'absence :", error);
    }
}

// Fonction pour supprimer une absence
async function deleteAbsence(absenceId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/absences/${absenceId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            Toast.success("Absence supprimée avec succès !");
            getAllAbsences(); // Rafraîchir la liste des absences
        } else {
            console.error("Erreur lors de la suppression de l'absence");
        }
    } catch (error) {
        console.error("Erreur pour supprimer l'absence :", error);
    }
}

// Fonction pour ouvrir le formulaire de mise à jour
function openUpdateModal(absence) {
    // Convertir la date au format "yyyy-MM-dd"
    const formattedDate = formatDateToLocal(absence.date);

    // Pré-remplir les champs avec les données actuelles de l'absence
    employeeSelect.value = absence.employee_id;
    dateInput.value = formattedDate;
    reasonInput.value = absence.reason;

    // Modifier le comportement du formulaire pour mettre à jour l'absence
    absenceForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedDate = dateInput.value;
        const updatedReason = reasonInput.value;

        if (!updatedDate || !updatedReason) {
            Toast.error("Veuillez remplir tous les champs.");
            return;
        }

        await updateAbsence(absence.id, updatedDate, updatedReason);

        absenceForm.onsubmit = addAbsenceHandler; // Réinitialiser le formulaire
    };
}

// Gérer la soumission du formulaire pour ajouter une absence
function addAbsenceHandler(e) {
    e.preventDefault();

    const employeeId = employeeSelect.value;
    const date = dateInput.value;
    const reason = reasonInput.value;

    if (!employeeId || !date || !reason) {
        Toast.error("Veuillez remplir tous les champs.");
        return;
    }

    addAbsence(employeeId, date, reason);
}

// Réinitialiser le comportement du formulaire pour l'ajout
absenceForm.onsubmit = addAbsenceHandler;

// Charger les absences et les employés au chargement de la page
getAllAbsences();
getAllEmployees();
