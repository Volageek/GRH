document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Fonction pour afficher des notifications
    function showNotification(type, message) {
        if (type === 'success') {
            toastr.success(message);
        } else if (type === 'error') {
            toastr.error(message);
        }
    }

    // Simule une connexion réussie
    if (username === 'admin' && password === 'admin') {
        showNotification('success', 'Connexion réussie');
        window.location.href = 'home.html'; // Redirige vers la page d'accueil
    } else {
        showNotification('error', 'Nom d\'utilisateur ou mot de passe incorrect.');
    }
});
