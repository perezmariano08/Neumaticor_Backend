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

const registerController = async (req, res) => {
    const { email, password, nombre } = req.body;
    console.log('Cuerpo de la solicitud:', req.body);  // Esto debería mostrar el cuerpo de la solicitud

    try {
        // Llamamos al servicio para registrar el usuario
        const user = await authService.registerUser(email, password, nombre);
        
        // Verifica que `user` contenga la propiedad `message` y `userId`
        if (!user || !user.message || !user.userId) {
            return res.status(500).json({ message: 'Error al procesar la respuesta del servicio' });
        }

        // Si el registro es exitoso, devolvemos el mensaje de éxito
        res.status(200).json({
            message: user.message,
            success: true,
            user: { id_usuario: user.userId, email, nombre }, // Información básica del usuario
        });
    } catch (error) {
        // Si hay un error, lo manejamos aquí
        console.error(error);  // Esto te ayudará a depurar el error en la consola
        res.status(error.status || 500).json({ message: error.message || 'Error desconocido' });
    }
};


module.exports = { loginController, registerController };
