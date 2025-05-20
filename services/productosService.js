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
        `SELECT * FROM marcas ORDER BY marca ASC`
    )    
    return productos
};

const crearProducto = async (datos) => {
    try {
        const { descripcion, modelo, vehiculo, id_marca, estado, stock, oferta } = datos;

        // 1. Insertar en la tabla productos
        const [resultado] = await db.query(
            `
            INSERT INTO productos (descripcion, modelo, vehiculo, id_marca, estado, stock, oferta) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [descripcion, modelo, vehiculo, id_marca, estado, stock, oferta]
        );
        return {
            message: 'Producto registrado correctamente',
            id_producto: resultado.insertId,
        }
    } catch (error) {
        console.error('Error al registrar pedido:', error);
        throw {
            status: error.status || 500,
            message: error.message || 'Error al registrar el pedido',
        };
    }
};

const actualizarProducto = async (datos) => {
    try {
        const { id_producto, descripcion, modelo, vehiculo, id_marca, estado, stock, oferta, precio_oferta, destacado } = datos;

        const [resultado] = await db.query(
            `
            UPDATE productos
            SET descripcion = ?, modelo = ?, vehiculo = ?, id_marca = ?, estado = ?, stock = ?, oferta = ?, precio_oferta = ?, destacado = ?
            WHERE id_producto = ?
            `,
            [descripcion, modelo, vehiculo, id_marca, estado, stock, oferta, precio_oferta || null, destacado || 'N', id_producto]
        );

        if (resultado.affectedRows === 0) {
            throw { status: 404, message: 'Producto no encontrado' };
        }

        return { message: 'Producto actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw {
            status: error.status || 500,
            message: error.message || 'Error al actualizar el producto',
        };
    }
};

module.exports = {
    getProductos,
    getProductosDestacados,
    getProducto,
    getMarcas,
    crearProducto,
    actualizarProducto
};
