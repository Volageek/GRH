const departmentList = document.querySelector("#departmentList");
const addBtn = document.querySelector("#add-btn");
const departmentName = document.querySelector("#departmentName");

function getAllDepartments() {
    try {
        fetch("http://localhost:3000/api/departements")
            .then((response) => response.json())
            .then((result) => {
                result.forEach((department) => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    p.innerHTML = department.name;
                    div.appendChild(p);

                    departmentList.appendChild(div);
                });
            });
    } catch (error) {
        console.error(
            `Erreur lors de la récupération des départements: ${error}`
        );
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
