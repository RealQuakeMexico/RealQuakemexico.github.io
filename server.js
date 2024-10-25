const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // Importar sqlite3
const bcrypt = require('bcrypt'); // Importar bcrypt
const app = express();
const PORT = 3000;

// Crear o abrir una base de datos SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Crear la tabla de usuarios si no existe
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )`);
    }
});

// Middleware para procesar el body de las peticiones
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).send('Error en la base de datos.');
        }
        if (user && bcrypt.compareSync(password, user.password)) {
            res.send('Inicio de sesión exitoso!');
        } else {
            res.status(401).send('Correo o contraseña incorrectos.');
        }
    });
});

// Ruta de registro
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10); // Encriptamos la contraseña

    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).send('El usuario ya existe.');
            }
            return res.status(500).send('Error al registrar el usuario.');
        }
        res.send('Registro exitoso!');
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
