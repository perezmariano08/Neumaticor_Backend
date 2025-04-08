const usuariosService = require('../services/usuariosService');
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const jwt = require('jsonwebtoken');

const getUsuarios = async (req, res) => {
    const { email, password } = req.body;

    // Verificar si se han proporcionado los campos necesarios
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    }

    // Consultar el usuario en la base de datos
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
        return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }

        // Si no se encuentra el usuario
        if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }

        const user = results[0];

        // Comparar la contraseña encriptada con la proporcionada
        bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al comparar contraseñas' });
        }

        if (isMatch) {
            // Si las contraseñas coinciden, generar un token JWT
            const token = jwt.sign({ userId: user.id, email: user.email }, 'tu_clave_secreta', { expiresIn: '1h' });

            return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token, // Devolver el token JWT al cliente
            });
        } else {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
        });
    });
};

const InsertarUsuario = async (req, res) => {
    const { email, password, nombre } = req.body;
    
    // Verificar si los campos necesarios están presentes
    if (!email || !password || !nombre) {
        return res.status(400).json({ success: false, message: 'Email, contraseña y nombre son requeridos' });
    }

    // Encriptar la contraseña usando bcryptjs
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
        return res.status(500).json({ success: false, message: 'Error al encriptar la contraseña' });
        }

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)';
        db.query(query, [email, hashedPassword, nombre], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            userId: result.insertId,
        });
        });
    });
};

module.exports = {
    getUsuarios,
    InsertarUsuario
};
