const db = require('../utils/db');

const getUsuarios = async () => {
    const [usuarios] = await db.query(
        `SELECT 
            *
        FROM 
            usuarios u`
    )    
    return usuarios
};

const getUsuario = async (id) => {
    try {
        const [usuario] = await db.query(
            `SELECT * FROM usuarios WHERE id_usuario = ?`, [id]
        );
        return usuario.length > 0 ? usuario[0] : null;
    } catch (error) {
        console.error('Error en la consulta', error);
        throw error;  // Re-throw para que sea manejado en el controlador
    }
};

module.exports = {
    getUsuarios,
    getUsuario

};
