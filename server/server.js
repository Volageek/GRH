const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Connexion à la base de données MySQL
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

let connection;
mysql
    .createConnection(dbConfig)
    .then((conn) => {
        connection = conn;
        console.log("Connecté à la base de données MySQL");
    })
    .catch((err) =>
        console.error("Erreur de connexion à la base de données", err)
    );

// Routes pour les pages HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "client/index.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "client/home.html"));
});

// Routes pour les employés
app.post("/api/employes", async (req, res) => {
    const { name, departement_id } = req.body;
    try {
        const [result] = await connection.execute(
            "INSERT INTO employes (name, department_id) VALUES (?, ?)",
            [name, departement_id]
        );

        const [rows] = await connection.query(
            "SELECT * FROM employes where id = ?",
            [result.insertId]
        );
        console.log(result);
        console.log(rows);
        res.json({
            result: rows[0],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/employes", async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT e.id, e.name, e.department_id, s.amount AS salary
            FROM employes e
            LEFT JOIN salaires s ON e.id = s.employee_id
        `);
        res.json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des employés :", err);
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/employes/:id", async (req, res) => {
    const { id } = req.params;
    const { name, departement_id } = req.body;

    if (!name || !departement_id) {
        return res
            .status(400)
            .send({ error: "Le nom et le département sont requis." });
    }

    try {
        // Exemple de requête SQL pour mettre à jour un employé
        const resultUpdate = await connection.query(
            "UPDATE employes SET name = ?, department_id = ? WHERE id = ?",
            [name, departement_id, id]
        );

        const result = await connection.query(
            "SELECT * FROM employes WHERE id = ?",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({ error: "Employé non trouvé." });
        }

        res.status(200).send({
            message: "Employé modifié avec succès",
            employee: result[0],
        });
    } catch (error) {
        console.error("Erreur lors de la modification de l'employé :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

app.delete("/api/employes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM salaires WHERE employee_id = ?", [
            id,
        ]);
        await connection.query("DELETE FROM conges WHERE employee_id = ?", [
            id,
        ]);
        await connection.query("DELETE FROM absences WHERE employee_id = ?", [
            id,
        ]);
        await connection.query("DELETE FROM employes WHERE id = ?", [id]);
        res.json({ message: "Employé supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/employes/:id/salaire
app.put("/api/employes/:id/salaire", async (req, res) => {
    const { id } = req.params;
    const { salary } = req.body;

    if (!salary || salary <= 0) {
        return res.status(400).send({ error: "Salaire invalide." });
    }

    try {
        await connection.query("UPDATE employees SET salary = ? WHERE id = ?", [
            salary,
            id,
        ]);
        res.status(200).send({ message: "Salaire mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du salaire :", error);
        res.status(500).send({ error: "Erreur interne du serveur" });
    }
});

// Routes pour les départements
app.post("/api/departements", async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await connection.execute(
            "INSERT INTO departements (name) VALUES (?)",
            [name]
        );
        res.json({ id: result.insertId, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/departements", async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM departements");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/departements/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await connection.query(
            "SELECT * FROM departements WHERE id = ?",
            [id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/departements/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE departements SET name = ? WHERE id = ?",
            [name, id]
        );
        res.json({ id, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/departements/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Supprimer les employés associés au département
        await connection.query("DELETE FROM employes WHERE department_id = ?", [
            id,
        ]);

        // Supprimer le département
        await connection.query("DELETE FROM departements WHERE id = ?", [id]);

        res.status(200).send({
            message: "Département et employés associés supprimés avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du département :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// Routes pour les salaires
app.post("/api/salaires", async (req, res) => {
    const { employee_id, amount } = req.body;
    try {
        const [result] = await connection.execute(
            "INSERT INTO salaires (employee_id, amount) VALUES (?, ?)",
            [employee_id, amount]
        );
        res.json({ id: result.insertId, employee_id, amount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/salaires", async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM salaires");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/salaires/:employee_id", async (req, res) => {
    const { employee_id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send({ error: "Salaire invalide." });
    }

    try {
        // Vérifier si un salaire existe déjà pour cet employé
        const [rows] = await connection.query(
            "SELECT * FROM salaires WHERE employee_id = ?",
            [employee_id]
        );

        if (rows.length > 0) {
            // Mettre à jour le salaire existant
            await connection.query(
                "UPDATE salaires SET amount = ? WHERE employee_id = ?",
                [amount, employee_id]
            );
        } else {
            // Ajouter un nouveau salaire
            await connection.query(
                "INSERT INTO salaires (employee_id, amount) VALUES (?, ?)",
                [employee_id, amount]
            );
        }

        res.status(200).send({ message: "Salaire mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du salaire :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// DELETE /api/salaires/:employee_id
app.delete("/api/salaires/:employee_id", async (req, res) => {
    const { employee_id } = req.params;

    try {
        await connection.query("DELETE FROM salaires WHERE employee_id = ?", [
            employee_id,
        ]);
        res.status(200).send({ message: "Salaire supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du salaire :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// Routes pour les congés
app.post("/api/conges", async (req, res) => {
    const { employee_id, start_date, end_date } = req.body;

    if (!employee_id || !start_date || !end_date) {
        return res.status(400).send({ error: "Tous les champs sont requis." });
    }

    try {
        await connection.query(
            "INSERT INTO conges (employee_id, start_date, end_date) VALUES (?, ?, ?)",
            [employee_id, start_date, end_date]
        );
        res.status(201).send({ message: "Congé ajouté avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'ajout du congé :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// GET /api/conges
app.get("/api/conges", async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT l.id, l.start_date, l.end_date, e.name AS employee_name
            FROM conges l
            JOIN employes e ON l.employee_id = e.id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des congés :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// PUT /api/conges/:id
app.put("/api/conges/:id", async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
        return res.status(400).send({ error: "Les dates sont requises." });
    }

    try {
        await connection.query(
            "UPDATE conges SET start_date = ?, end_date = ? WHERE id = ?",
            [start_date, end_date, id]
        );
        res.status(200).send({ message: "Congé mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du congé :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// DELETE /api/conges/:id
app.delete("/api/conges/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await connection.query("DELETE FROM conges WHERE id = ?", [id]);
        res.status(200).send({ message: "Congé supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du congé :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// Routes pour les absences
app.post("/api/absences", async (req, res) => {
    const { employee_id, date, reason } = req.body;

    if (!employee_id || !date || !reason) {
        return res.status(400).send({ error: "Tous les champs sont requis." });
    }

    try {
        await connection.query(
            "INSERT INTO absences (employee_id, date, reason) VALUES (?, ?, ?)",
            [employee_id, date, reason]
        );
        res.status(201).send({ message: "Absence ajoutée avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'absence :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// GET /api/absences
app.get("/api/absences", async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT a.id, a.date, a.reason, e.name AS employee_name, e.id AS employee_id
            FROM absences a
            JOIN employes e ON a.employee_id = e.id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des absences :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// PUT /api/absences/:id
app.put("/api/absences/:id", async (req, res) => {
    const { id } = req.params;
    const { date, reason } = req.body;

    if (!date || !reason) {
        return res
            .status(400)
            .send({ error: "Les champs date et raison sont requis." });
    }

    try {
        await connection.query(
            "UPDATE absences SET date = ?, reason = ? WHERE id = ?",
            [date, reason, id]
        );
        res.status(200).send({ message: "Absence mise à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'absence :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// DELETE /api/absences/:id
app.delete("/api/absences/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await connection.query("DELETE FROM absences WHERE id = ?", [id]);

        res.status(200).send({ message: "Absence supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'absence :", error);
        res.status(500).send({ error: "Erreur interne du serveur." });
    }
});

// GET /api/stats/employees
app.get("/api/stats/employees", async (req, res) => {
    try {
        const [rows] = await connection.query(
            "SELECT COUNT(*) AS count FROM employes"
        );
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre d'employés :",
            error
        );
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// GET /api/stats/departments
app.get("/api/stats/departments", async (req, res) => {
    try {
        const [rows] = await connection.query(
            "SELECT COUNT(*) AS count FROM departements"
        );
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre de départements :",
            error
        );
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// GET /api/stats/leaves
app.get("/api/stats/leaves", async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT COUNT(*) AS count 
            FROM conges 
            WHERE start_date <= CURDATE() AND end_date >= CURDATE()
        `);
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre de congés en cours :",
            error
        );
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// GET /api/stats/absences
app.get("/api/stats/absences", async (req, res) => {
    try {
        const [rows] = await connection.query(
            "SELECT COUNT(*) AS count FROM absences"
        );
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre d'absences :",
            error
        );
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
