const db = require('../utils/db');

const getUsuarios = async () => {
    const [usuarios] = await db.query(
        `SELECT * FROM usuarios;`
    )    
    return usuarios
};

const getProducto = async (id) => {
    try {
        const [producto] = await db.query(
            `SELECT * FROM productos WHERE id_producto = ?`, [id]
        );
        return producto.length > 0 ? producto[0] : null;
    } catch (error) {
        console.error('Error en la consulta', error);
        throw error;  // Re-throw para que sea manejado en el controlador
    }
};


module.exports = {
    getUsuarios
};
