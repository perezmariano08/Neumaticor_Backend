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
         process.env.JWT_SECRET || 'mi_secreto_super_seguro', // mejor usar variables de entorno
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
         apellido: user.apellido
      };
   } catch (error) {
      return { success: false, message: 'Hubo un error con el servidor' };
   }
};

const registerUser = (email, password, nombre) => {
   return new Promise((resolve, reject) => {
      // Encriptar la contraseña antes de insertarla en la base de datos
      bcrypt.hash(password, 10, (err, hashedPassword) => {
         if (err) {
               return reject({ status: 500, message: 'Error al encriptar la contraseña' });
         }

         // Query para insertar el usuario en la base de datos
         const query = 'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)';
         db.query(query, [email, hashedPassword, nombre], (err, result) => {
               if (err) {
                  return reject({ status: 500, message: 'Error al registrar el usuario' });
               }

               // Devuelve el ID del nuevo usuario insertado y el mensaje de éxito
               resolve({ userId: result.insertId, message: 'Usuario registrado exitosamente' });
         });
      });
   });
};


module.exports = { loginUser, registerUser };
