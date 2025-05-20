const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // Usa tu Client ID de Google
const db = require('../utils/db');

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
    const datosUsuario = req.body;
    console.log('Cuerpo de la solicitud:', datosUsuario);

    try {
        const user = await authService.registerUser(datosUsuario);
        console.log('Resultado de registerUser:', user);

        if (!user || !user.message || !user.userId) {
            return res.status(500).json({ message: 'Error al procesar la respuesta del servicio' });
        }

        res.status(200).json({
            message: user.message,
            success: true,
            user: { id_usuario: user.userId, ...datosUsuario }, // devolvés lo que envió el frontend
        });

    } catch (error) {
        console.error('Error en el controller:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error desconocido' });
    }
};

// Controlador para iniciar sesión con Google
const googleLogin = async (req, res) => {
    const { token } = req.body;  // El token recibido desde el frontend
    console.log(token);  // Verifica que el token llegue correctamente

    try {
        // Verifica el token de Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  // Debe coincidir con tu Client ID
        });
    
        const payload = ticket.getPayload();  // Obtén la información del usuario
        const email = payload.email;
        console.log('Payload obtenido:', payload);  // Asegúrate de que el payload contiene la información del usuario

        // Aquí puedes buscar al usuario en la base de datos
        const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        console.log('Resultado de la consulta:', user);  // Verifica que la consulta esté funcionando correctamente

        

        if (user.length === 0) {
            // Si no existe, crear el usuario sin contraseña
            // ✅ Generar el token
            const token = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    email: user.email,
                    rol: user.id_rol,
                    isAdmin: user.id_rol === 1,
                },
                process.env.JWT_SECRET, // mejor usar variables de entorno
                { expiresIn: '1d' } // el token dura 1 día
            );

            const datosUsuario = {
                email,
                nombre: payload.given_name,
                apellido: payload.family_name,
                metodo: 'google', // Método de autenticación
                password: null, // No se necesita contraseña
            };
            
            const newUser = await authService.registerUser(datosUsuario);  // Registra el usuario
            const userFinal = {
                id_usuario: newUser.userId,
                email: datosUsuario.email,
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                nombre_visible: datosUsuario.nombre_visible,
                id_rol: 2, // Asumimos que es cliente, por ejemplo
                estado: 1, // Activo por defecto
                id_lista_precio: null, // o algún valor por defecto
            };

            console.log(token);

            return res.status(200).json({
                success: true,
                message: 'Inicio sesión EXITOSO',
                token: token,
                user: {
                    id_usuario: userFinal.id_usuario,
                    email: userFinal.email,
                    nombre: userFinal.nombre,
                    apellido: userFinal.apellido,
                    nombre_visible: userFinal.nombre_visible,
                    rol: userFinal.id_rol,
                    isAdmin: userFinal.id_rol === 1,
                    estado: userFinal.estado,
                    lista_precio: userFinal.id_lista_precio,
                }
                
            });
        }

        // ✅ Generar el token
        const tokenjwt = jwt.sign(
            {
            id_usuario: user.id_usuario,
            email: user.email,
            rol: user.id_rol,
            isAdmin: user.id_rol === 1,
            },
            process.env.JWT_SECRET, // mejor usar variables de entorno
            { expiresIn: '1d' } // el token dura 1 día
        );
        // Si el usuario ya existe, devuelve la información del usuario
        console.log('Usuario encontrado:', user[0]);
        return res.status(200).json({
            success: true,
            user: {
                id_usuario: user[0].id_usuario,
                email: user[0].email,
                nombre: user[0].nombre,
                apellido: user[0].apellido,
                nombre_visible: user[0].nombre_visible,
                rol: user[0].id_rol,
                isAdmin: user[0].id_rol === 1,
                estado: user[0].estado,
                lista_precio: user[0].id_lista_precio,
                token: tokenjwt, // Inyectamos el token dentro del objeto del usuario
            },
        });

    } catch (error) {
        console.error('Error al autenticar con Google:', error);  // Asegúrate de ver cualquier error en la consola
        res.status(500).json({ success: false, message: "Error al autenticar con Google", error });
    }
};


const registrarSolicitud = async (req, res) => {
    const datosUsuario = req.body;
    console.log('Cuerpo de la solicitud:', datosUsuario);

    try {
        const user = await authService.registrarSolicitud(datosUsuario);
        console.log('Resultado de registerUser:', user);

        if (!user || !user.message) {
            return res.status(500).json({ message: 'Error al procesar la respuesta del servicio' });
        }

        res.status(200).json({
            message: user.message,
            success: true,
            user: { ...datosUsuario }, // devolvés lo que envió el frontend
        });

    } catch (error) {
        console.error('Error en el controller:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error desconocido' });
    }
};

module.exports = { 
    loginController, 
    registerController, 
    registrarSolicitud,
    googleLogin,
    googleCallback: (req, res) => {        
        const user = req.user;

   const token = jwt.sign({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      isAdmin: user.isAdmin
   }, process.env.JWT_SECRET, { expiresIn: '1d' });

   // Redirigir al frontend con el token en la URL
   res.redirect(`http://localhost:5173/google-success?token=${token}`);
    } 
};
