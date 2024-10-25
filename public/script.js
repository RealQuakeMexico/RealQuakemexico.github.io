// Mostrar el popup de inicio de sesión
document.getElementById('loginButton').addEventListener('click', function() {
    document.getElementById('popup').classList.remove('hidden');
});

// Cerrar el popup
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden');
});

// Cambiar al formulario de registro
document.getElementById('goToRegister').addEventListener('click', function() {
    document.getElementById('loginFormContainer').classList.add('hidden');
    document.getElementById('registerFormContainer').classList.remove('hidden');
});

// Cambiar al formulario de inicio de sesión
document.getElementById('goToLogin').addEventListener('click', function() {
    document.getElementById('registerFormContainer').classList.add('hidden');
    document.getElementById('loginFormContainer').classList.remove('hidden');
});

// Manejar el formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const loginMessage = document.getElementById('loginMessage');

    fetch('/login', {
        method: 'POST',
        body: new URLSearchParams(new FormData(this)),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'mapaenvivo.html'; // Redirigir a mapaenvivo.html
        } else {
            throw new Error('Correo o contraseña incorrectos.');
        }
    })
    .catch(error => {
        loginMessage.innerText = error.message; // Mostrar mensaje de error
    });
});

// Manejar el formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const registerMessage = document.getElementById('registerMessage');

    fetch('/register', {
        method: 'POST',
        body: new URLSearchParams(new FormData(this)),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Registro exitoso!'); // Mensaje de éxito
            document.getElementById('registerForm').reset();
            window.location.href = '/'; // Redirigir a index.html
        } else {
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .catch(error => {
        registerMessage.innerText = error.message; // Mostrar mensaje de error
    });
});

// Obtener el último sismo registrado por la USGS
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_significant_month.geojson')
    .then(response => response.json())
    .then(data => {
        const latestQuake = data.features[0];
        const sismoInfo = document.getElementById('sismoInfo');

        if (latestQuake) {
            const { properties } = latestQuake;
            sismoInfo.innerHTML = `
                <strong>Magnitud:</strong> ${properties.mag}<br>
                <strong>Ubicación:</strong> ${properties.place}<br>
                <strong>Fecha:</strong> ${new Date(properties.time).toLocaleString()}<br>
                <strong><a href="${properties.url}" target="_blank">Más detalles</a></strong>
            `;
        } else {
            sismoInfo.innerHTML = '<p>No se encontraron datos de sismos.</p>';
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos del sismo:', error);
        document.getElementById('sismoInfo').innerHTML = '<p>Error al cargar datos del sismo.</p>';
    });
