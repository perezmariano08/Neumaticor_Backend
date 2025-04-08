const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const loginUser = async (email, password) => {
   try {
      // Consultar al usuario por su email
      const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

      // Si no se encuentra el usuario
      if (results.length === 0) {
         return { success: false, message: 'Credenciales incorrectas' };
      }

      const user = results[0];  // Tomamos el primer usuario (en caso de que sea único)

      // Comparar la contraseña encriptada con la proporcionada
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         return { success: false, message: 'Credenciales incorrectas' };
      }

      // Si las contraseñas coinciden, devolvemos el objeto de respuesta correctamente
      return {
         success: true, 
         message: 'Inicio sesión EXITOSO',
         id_usuario: user.id_usuario,
         email: user.email,
         nombre: user.nombre,
         rol: user.rol,
         estado: user.estado
      };
   } catch (error) {
      // Si ocurre un error en la base de datos o cualquier otro, retornamos un error genérico
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

      const query = 'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)';
      db.query(query, [email, hashedPassword, nombre], (err, result) => {
         if (err) {
            return reject({ status: 500, message: 'Error al registrar el usuario' });
         }
         resolve({ userId: result.insertId, message: 'Usuario registrado exitosamente' });
      });
      });
   });
};

module.exports = { loginUser, registerUser };
