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
            "INSERT INTO employes (name, departement_id) VALUES (?, ?)",
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
        const [rows] = await connection.query("SELECT * FROM employes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/employes/:id", async (req, res) => {
    const { id } = req.params;
    const { name, department_id } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE employes SET name = ?, department_id = ? WHERE id = ?",
            [name, department_id, id]
        );
        res.json({ id, name, department_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/employes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM employes WHERE id = ?", [id]);
        res.json({ message: "Employé supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        await connection.query("DELETE FROM departements WHERE id = ?", [id]);
        res.json({ message: "Département supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

app.put("/api/salaires/:id", async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE salaires SET amount = ? WHERE id = ?",
            [amount, id]
        );
        res.json({ id, amount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/salaires/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM salaires WHERE id = ?", [id]);
        res.json({ message: "Salaire supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes pour les congés
app.post("/api/conges", async (req, res) => {
    const { employee_id, start_date, end_date } = req.body;
    try {
        const [result] = await connection.execute(
            "INSERT INTO conges (employee_id, start_date, end_date) VALUES (?, ?, ?)",
            [employee_id, start_date, end_date]
        );
        res.json({ id: result.insertId, employee_id, start_date, end_date });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/conges", async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM conges");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/conges/:id", async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE conges SET start_date = ?, end_date = ? WHERE id = ?",
            [start_date, end_date, id]
        );
        res.json({ id, start_date, end_date });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/conges/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM conges WHERE id = ?", [id]);
        res.json({ message: "Congé supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes pour les absences
app.post("/api/absences", async (req, res) => {
    const { employee_id, date, reason } = req.body;
    try {
        const [result] = await connection.execute(
            "INSERT INTO absences (employee_id, date, reason) VALUES (?, ?, ?)",
            [employee_id, date, reason]
        );
        res.json({ id: result.insertId, employee_id, date, reason });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/absences", async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM absences");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/absences/:id", async (req, res) => {
    const { id } = req.params;
    const { date, reason } = req.body;
    try {
        const [result] = await connection.query(
            "UPDATE absences SET date = ?, reason = ? WHERE id = ?",
            [date, reason, id]
        );
        res.json({ id, date, reason });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/absences/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query("DELETE FROM absences WHERE id = ?", [id]);
        res.json({ message: "Absence supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
