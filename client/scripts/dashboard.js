// Sélecteurs pour les éléments HTML
const employeeCountElement = document.getElementById("employeeCount");
const departmentCountElement = document.getElementById("departmentCount");
const leaveCountElement = document.getElementById("leaveCount");
const absenceCountElement = document.getElementById("absenceCount");

// Fonction pour récupérer les statistiques
async function fetchStats() {
    try {
        // Récupérer le nombre d'employés
        const employeeResponse = await fetch(
            "http://localhost:3000/api/stats/employees"
        );
        const employeeData = await employeeResponse.json();
        employeeCountElement.textContent = employeeData.count;

        // Récupérer le nombre de départements
        const departmentResponse = await fetch(
            "http://localhost:3000/api/stats/departments"
        );
        const departmentData = await departmentResponse.json();
        departmentCountElement.textContent = departmentData.count;

        // Récupérer le nombre de congés en cours
        const leaveResponse = await fetch(
            "http://localhost:3000/api/stats/leaves"
        );
        const leaveData = await leaveResponse.json();
        leaveCountElement.textContent = leaveData.count;

        // Récupérer le nombre d'absences
        const absenceResponse = await fetch(
            "http://localhost:3000/api/stats/absences"
        );
        const absenceData = await absenceResponse.json();
        absenceCountElement.textContent = absenceData.count;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des statistiques :",
            error
        );
    }
}

// Charger les statistiques au chargement de la page
fetchStats();
