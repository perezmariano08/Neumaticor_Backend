const db = require('../utils/db');

const getProductos = async () => {
    const [productos] = await db.query(
        `SELECT * FROM productos;`
    )    
    return productos
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

const getProductosDestacados = async () => {
    const [productos] = await db.query(
        `SELECT * FROM productos WHERE destacado = 'S'`
    )    
    return productos
};


module.exports = {
    getProductos,
    getProductosDestacados,
    getProducto,
};
