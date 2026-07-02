const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // Para hashear contraseñas

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'registro'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/check-availability', (req, res) => {
    const { type, value } = req.body;
    let query = '';
    if (type === 'username') {
        query = 'SELECT * FROM usuarios WHERE nombre = ?';
    } else if (type === 'email') {
        query = 'SELECT * FROM usuarios WHERE correo = ?';
    }
    db.query(query, [value], (err, results) => {
        if (err) throw err;
        res.json({ available: results.length === 0 });
    });
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
    const query = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Usuario o correo electrónico ya existente' });
            }
            throw err;
        }
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
