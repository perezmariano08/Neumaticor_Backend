const authService = require('../services/authService');

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Llamamos al servicio para validar las credenciales
        const user = await authService.loginUser(email, password)
        // Desestructuramos message y success del objeto user
        const { message, success, ...userData } = user;
        // Si el inicio de sesión es exitoso, devolvemos la información del usuario
        res.status(200).json({
            message,
            success,
            user: userData,  // Devuelve el resto de la información del usuario
        });
    } catch (error) {
        // Si hay un error (por ejemplo, credenciales incorrectas), lo manejamos aquí
        res.status(error.status || 500).json({ message: error.message || 'Error desconocido' });
    }
};

module.exports = { loginController };
