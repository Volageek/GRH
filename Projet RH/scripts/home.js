// Exemple d'appel AJAX pour obtenir tous les employés
fetch('/api/employes')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Traitez les données des employés ici
  })
  .catch(error => console.error('Erreur:', error));

// Exemple d'appel AJAX pour ajouter un nouvel employé
const newEmployee = { name: 'John Doe', department_id: 1 };
fetch('/api/employes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newEmployee)
})
  .then(response => response.json())
  .then(data => {
    console.log('Employé ajouté:', data);
    // Mettez à jour l'interface utilisateur ici
  })
  .catch(error => console.error('Erreur:', error));
