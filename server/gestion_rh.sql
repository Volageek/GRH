-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table des départements
CREATE TABLE departements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table des employés
CREATE TABLE employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departements(id)
);

ALTER TABLE employes
DROP FOREIGN KEY employes_ibfk_1;

ALTER TABLE employes
ADD CONSTRAINT employes_ibfk_1
FOREIGN KEY (departement_id) REFERENCES departements(id)
ON DELETE CASCADE;

-- Table des salaires
CREATE TABLE salaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employes(id)
);

-- Table des congés
CREATE TABLE conges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employes(id)
);

-- Table des absences
CREATE TABLE absences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employes(id)
);