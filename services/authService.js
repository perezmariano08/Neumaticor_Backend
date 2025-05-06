const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const loginUser = async (email, password) => {
   try {
      const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

      if (results.length === 0) {
         return { success: false, message: 'Credenciales incorrectas' };
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         return { success: false, message: 'Credenciales incorrectas' };
      }

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

      // ✅ Retornar token junto con los datos del usuario
      return {
         success: true, 
         message: 'Inicio sesión EXITOSO',
         token, // <- este token se usará para las futuras peticiones
         id_usuario: user.id_usuario,
         email: user.email,
         nombre: user.nombre,
         rol: user.id_rol,
         isAdmin: user.id_rol === 1,
         estado: user.estado,
         lista_precio: user.id_lista_precio,
         apellido: user.apellido,
         nombre_visible: user.nombre_visible
      };
   } catch (error) {
      return { success: false, message: 'Hubo un error con el servidor' };
   }
};

const registerUser = async (datos) => {
   try {
      const { email, password, ...restoDatos } = datos;

      if (!email || !password) {
         throw { status: 400, message: 'Email y contraseña son obligatorios' };
      }

      // Verificar si ya existe el email
      const [existing] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
      if (existing.length > 0) {
         throw { status: 400, message: 'El correo ya está registrado' };
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Preparar datos para el INSERT
      const campos = ['email', 'password', ...Object.keys(restoDatos)];
      const valores = [email, hashedPassword, ...Object.values(restoDatos)];

      const placeholders = campos.map(() => '?').join(', ');
      const query = `INSERT INTO usuarios (${campos.join(', ')}) VALUES (${placeholders})`;

      const [result] = await db.query(query, valores);

      console.log('Usuario insertado con ID:', result.insertId);

      return { userId: result.insertId, message: 'Usuario registrado exitosamente' };
   } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw {
         status: error.status || 500,
         message: error.message || 'Error al registrar el usuario',
      };
   }
};

const registrarSolicitud = async (datos) => {
   try {
      const { email, nombre, telefono, ...restoDatos } = datos;

      if (!email || !nombre || !telefono) {
         throw { status: 400, message: 'Email, nombre y telefono son obligatorios' };
      }

      // Verificar si ya existe el email
      const [existing] = await db.query('SELECT email FROM solicitudes_clientes WHERE email = ?', [email]);
      if (existing.length > 0) {
         const error = new Error('El correo ya está registrado');
         error.status = 400;  // 400 Bad Request
         throw error;
      }

      // Preparar datos para el INSERT
      const campos = ['email', 'nombre', "telefono", ...Object.keys(restoDatos)];
      const valores = [email, nombre, telefono, ...Object.values(restoDatos)];

      const placeholders = campos.map(() => '?').join(', ');
      const query = `INSERT INTO solicitudes_clientes (${campos.join(', ')}) VALUES (${placeholders})`;

      const [result] = await db.query(query, valores);

      console.log('solicitud insertada:', result.insertId);

      return { message: 'solicitud registrado exitosamente' };
   } catch (error) {
      console.error('Error al registrar solicitud:', error);
      throw {
         status: error.status || 500,
         message: error.message || 'Error al registrar la solicitud',
      };
   }
};






module.exports = { loginUser, registerUser, registrarSolicitud };
