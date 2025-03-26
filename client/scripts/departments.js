const departmentList = document.querySelector("#departmentList");
const addBtn = document.querySelector("#add-btn");
const departmentName = document.querySelector("#departmentName");

function getAllDepartments() {
    try {
        fetch("http://localhost:3000/api/departements")
            .then((response) => response.json())
            .then((result) => {
                departmentList.innerHTML = ""; // Réinitialiser la liste des départements
                result.forEach((department) => {
                    const div = document.createElement("div");
                    div.classList.add("department-item");

                    const p = document.createElement("p");
                    p.innerHTML = department.name;

                    // Bouton Éditer
                    const editBtn = document.createElement("button");
                    editBtn.innerHTML = "Éditer";
                    editBtn.classList.add("edit-btn");
                    editBtn.addEventListener("click", () =>
                        openEditModal(department)
                    );

                    // Bouton Supprimer
                    const deleteBtn = document.createElement("button");
                    deleteBtn.innerHTML = "Supprimer";
                    deleteBtn.classList.add("delete-btn");
                    deleteBtn.addEventListener("click", () =>
                        deleteDepartment(department.id)
                    );

                    div.appendChild(p);
                    div.appendChild(editBtn);
                    div.appendChild(deleteBtn);

                    departmentList.appendChild(div);
                });
            });
    } catch (error) {
        console.error(
            `Erreur lors de la récupération des départements: ${error}`
        );
    }
}

async function deleteDepartment(departmentId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/departements/${departmentId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            alert("Département supprimé avec succès !");
            getAllDepartments(); // Rafraîchir la liste des départements
        } else {
            const error = await response.json();
            alert(
                error.error || "Erreur lors de la suppression du département"
            );
        }
    } catch (error) {
        console.error(`Erreur pour supprimer le département: ${error}`);
    }
}

function addNewDepartment({ name }) {
    try {
        fetch("http://localhost:3000/api/departements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log({ result });
                getAllDepartments();
            });
    } catch (error) {
        console.error(`Erreur lors de l'ajout d département: ${error}`);
    }
}

function openEditModal(department) {
    const newName = prompt(
        "Entrez le nouveau nom du département :",
        department.name
    );

    if (!newName || newName.trim() === "") {
        alert("Le nom ne peut pas être vide !");
        return;
    }

    editDepartment(department.id, newName);
}

async function editDepartment(departmentId, newName) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/departements/${departmentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newName }),
            }
        );

        if (response.ok) {
            alert("Département modifié avec succès !");
            getAllDepartments(); // Rafraîchir la liste des départements
        } else {
            console.error("Erreur lors de la modification du département");
        }
    } catch (error) {
        console.error(`Erreur pour modifier le département: ${error}`);
    }
}

addBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const department = departmentName.value.trim();

    if (!department) {
        alert("Vous devez entrer un département");
        return;
    }

    await addNewDepartment({ name: department });
});

document.addEventListener("DOMContentLoaded", function () {
    getAllDepartments();
});
