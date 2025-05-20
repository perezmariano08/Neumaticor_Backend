const db = require('../utils/db');

const getPedidos = async () => {
    const [pedidos] = await db.query(
        `SELECT 
            p.id_pedido,
            p.id_usuario,
            CONCAT(u.nombre, ' ',u.apellido) as usuario,
            p.total,
            p.metodo_pago,
            p.estado,
            CONVERT_TZ(p.fecha, '+00:00', '-03:00') AS fecha,
            p.codigo_postal,
            p.direccion
        FROM pedidos p
        INNER JOIN usuarios u ON u.id_usuario = p.id_usuario
        ORDER BY p.fecha DESC`
    )    
    return pedidos
};

const getPedido = async (id) => {
    try {
        const [pedido] = await db.query(
            `SELECT
                p.id_pedido,
                p.id_usuario,
                CONCAT(u.nombre, ' ',u.apellido) as usuario,
                CONVERT_TZ(p.fecha, '+00:00', '-03:00') AS fecha,
                p.fecha_vencimiento,
                p.estado,
                p.total,
                p.metodo_pago,
                p.direccion,
                p.codigo_postal
            FROM pedidos p
            INNER JOIN usuarios u ON u.id_usuario = p.id_usuario
            WHERE id_pedido = ?`, [id]
        );
        // Solo devolvés directamente el array
        return pedido.length > 0 ? pedido[0] : null;
    } catch (error) {
        console.error('Error en la consulta', error);
        throw error;
    }
};

const getPedidosPorUsuario = async (id_usuario) => {
    try {
        const [pedidos] = await db.query(
            `SELECT 
                p.id_pedido,
                p.total,
                p.metodo_pago,
                p.estado,
                CONVERT_TZ(p.fecha, '+00:00', '-03:00') AS fecha
            FROM pedidos p
            WHERE p.id_usuario = ?
            ORDER BY p.fecha DESC`,
            [id_usuario]
        );
        return pedidos;
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        throw error;
    }
};

const getPedidoDetalle = async (id_pedido_detalle) => {
    try {
        const [pedido] = await db.query(
            `SELECT
                pd.id_pedido_detalle,
                pd.id_pedido,
                pd.id_producto,
                p.descripcion,
                pd.cantidad,
                pd.precio_unitario
            FROM pedido_detalle pd
            INNER JOIN productos p ON p.id_producto = pd.id_producto
            WHERE pd.id_pedido = ?;`,
            [id_pedido_detalle]
        );
        return pedido
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        throw error;
    }
};

const getPedidoDetallePorUsuario = async (id_usuario) => {
    try {
        const [pedidos] = await db.query(
            `SELECT
                pd.id_pedido,
                pd.id_producto,
                pr.descripcion,
                pd.cantidad,
                pd.precio_unitario,
                m.marca,
                pr.vehiculo,
                pr.img
            FROM pedido_detalle pd
            INNER JOIN pedidos p ON p.id_pedido = pd.id_pedido
            INNER JOIN productos pr ON pr.id_producto = pd.id_producto
            INNER JOIN marcas m ON m.id_marca = pr.id_marca
            WHERE p.id_usuario = ?`,
            [id_usuario]
        );
        return pedidos;
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        throw error;
    }
};

const finalizarPedido = async (datos) => {
    try {
        const { id_usuario, total, productos, metodo_pago, codigo_postal, direccion } = datos;

        if (!id_usuario || !total || !Array.isArray(productos) || productos.length === 0) {
            throw { status: 400, message: 'Faltan datos del usuario o productos' };
        }

        // 🗓️ Calcular fecha de vencimiento (7 días después)
        const now = new Date();
        now.setDate(now.getDate() + 7);
        const fecha_vencimiento = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // 1. Insertar en la tabla pedidos
        const [pedidoResult] = await db.query(
            `INSERT INTO pedidos (id_usuario, total, metodo_pago, codigo_postal, direccion, fecha_vencimiento) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_usuario, total, metodo_pago, codigo_postal, direccion, fecha_vencimiento]
        );

        const id_pedido = pedidoResult.insertId;
        console.log('Pedido insertado con ID:', id_pedido);

        // 2. Insertar productos en pedido_detalle
        const insertDetalleQuery = `
            INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)`;

        for (const producto of productos) {
            const { id_producto, quantity, precio, precio_oferta, oferta } = producto;

            if (!id_producto || !quantity || !(precio || precio_oferta)) {
                console.warn('Producto incompleto, se omite:', producto);
                continue;
            }

            const precioFinal = oferta === 'S' ? precio_oferta : precio;

            await db.query(insertDetalleQuery, [id_pedido, id_producto, quantity, precioFinal]);
        }

        return { message: 'Pedido y detalles registrados correctamente', id_pedido };
    } catch (error) {
        console.error('Error al registrar pedido:', error);
        throw {
            status: error.status || 500,
            message: error.message || 'Error al registrar el pedido',
        };
    }
};

const actualizarPedido = async (id_pedido, estado) => {
    try {
        if (!id_pedido || !estado) {
            throw { status: 400, message: 'Faltan datos para actualizar el pedido' };
        }

        const [result] = await db.query(
            'UPDATE pedidos SET estado = ? WHERE id_pedido = ?',
            [estado, id_pedido]
        );
        
        if (result.affectedRows === 0) {
            throw { status: 404, message: 'Pedido no encontrado' };
        }

        return { message: 'Pedido actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        throw {
            status: error.status || 500,
            message: error.message || 'Error al actualizar el pedido',
        };
    }
};


module.exports = {
    getPedidos,
    getPedido,
    getPedidosPorUsuario,
    getPedidoDetalle,
    getPedidoDetallePorUsuario,
    finalizarPedido,
    actualizarPedido,
};
