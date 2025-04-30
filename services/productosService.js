const db = require('../utils/db');

const getProductos = async () => {
    const [productos] = await db.query(
        `SELECT * FROM productos p LEFT JOIN marcas m ON m.id_marca = p.id_marca`
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

const getMarcas = async () => {
    const [productos] = await db.query(
        `SELECT * FROM marcas`
    )    
    return productos
};

module.exports = {
    getProductos,
    getProductosDestacados,
    getProducto,
    getMarcas
};
