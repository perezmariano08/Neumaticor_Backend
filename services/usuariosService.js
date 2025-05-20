const db = require('../utils/db');

const getUsuarios = async () => {
    const [usuarios] = await db.query(
        `SELECT 
            u.id_usuario,
            u.email,
            u.nombre,
            u.nombre_visible,
            u.apellido,
            u.id_rol,
            u.estado,
            u.fecha_creacion,
            r.rol,
            lp.nombre as nombre_lista
        FROM 
            usuarios u
        LEFT JOIN roles r ON r.id_rol = u.id_rol
        LEFT JOIN listas_precios lp ON lp.id_lista_precio = u.id_lista_precio;`
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

const getRoles = async () => {
    const [roles] = await db.query(
        `SELECT 
            *
        FROM 
            roles`
    )    
    return roles
};

const getSolicitudes = async () => {
    const [solicitudes] = await db.query(
        `SELECT 
            *
        FROM 
            solicitudes_clientes`
    )    
    return solicitudes
};

module.exports = {
    getUsuarios,
    getUsuario,
    getRoles,
    getSolicitudes

};
