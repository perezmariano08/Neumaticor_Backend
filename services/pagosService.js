const db = require('../utils/db');

const getPagos = async () => {
    const [pagos] = await db.query(
        `SELECT 
            p.id_pago,
            p.metodo_pago,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            p.monto_total,
            CONVERT_TZ(p.fecha, '+00:00', '-03:00') AS fecha
        FROM pagos p
        INNER JOIN usuarios u ON u.id_usuario = p.id_usuario
        ORDER BY p.fecha DESC;`
    )    
    return pagos
};

const getPagoDetalle = async (id) => {
    try {
        const [pago_detalle] = await db.query(
            `SELECT
                pd.id_detalle_pago,
                pd.id_pago,
                pd.id_pedido,
                pd.monto_pago,
                pd.deuda_pedido,
                p.saldo AS saldo_pedido,
                p.total as total_pedido
            FROM pagos_detalle pd
            INNER JOIN pedidos p ON p.id_pedido = pd.id_pedido
            WHERE id_pago = ?`, [id]
        );
        return pago_detalle
    } catch (error) {
        console.error('Error en la consulta', error);
        throw error;
    }
};

const registrarPago = async (id_usuario, metodo_pago, monto_pago) => {
    if (!id_usuario || !monto_pago || !metodo_pago) {
        throw { status: 400, message: 'Faltan datos obligatorios' };
    }

    try {
        // 1. Registrar el comprobante general
        const [pagoResult] = await db.query(
            `INSERT INTO pagos (id_usuario, metodo_pago, monto_total, fecha) VALUES (?, ?, ?, NOW())`,
            [id_usuario, metodo_pago, monto_pago]
        );
        const id_pago = pagoResult.insertId;

        // 2. Obtener pedidos del usuario con saldo pendiente
        const [pedidos] = await db.query(
            `SELECT id_pedido, total, IFNULL(monto_pagado, 0) AS monto_pagado
             FROM pedidos
             WHERE id_usuario = ? AND metodo_pago = 'cuenta corriente' AND (IFNULL(monto_pagado, 0) < total)
             ORDER BY fecha ASC`,
            [id_usuario]
        );

        if (pedidos.length === 0) {
            throw { status: 404, message: 'No hay pedidos pendientes con cuenta corriente' };
        }

        let saldo = monto_pago;
        const movimientos = [];

        for (const pedido of pedidos) {
            if (saldo <= 0) break;

            const pendiente = pedido.total - pedido.monto_pagado;
            const abono = Math.min(pendiente, saldo);

            // 3. Actualizar el monto pagado del pedido
            await db.query(
                `UPDATE pedidos SET monto_pagado = monto_pagado + ? WHERE id_pedido = ?`,
                [abono, pedido.id_pedido]
            );

            // 4. Registrar movimiento en cuenta_corriente
            await db.query(
                `INSERT INTO cuenta_corriente (id_usuario, id_pedido, monto, fecha)
                 VALUES (?, ?, ?, NOW())`,
                [id_usuario, pedido.id_pedido, abono]
            );

            // 5. Registrar detalle del pago
            await db.query(
                `INSERT INTO pagos_detalle (id_pago, id_pedido, monto_pago, deuda_pedido)
                 VALUES (?, ?, ?, ?)`,
                [id_pago, pedido.id_pedido, abono, pendiente]
            );

            movimientos.push({ id_pedido: pedido.id_pedido, abonado: abono });

            saldo -= abono;
        }

        return {
            id_pago,
            id_usuario,
            monto_pagado: monto_pago - saldo,
            pedidos_afectados: movimientos
        };

    } catch (error) {
        console.error('Error al registrar pago:', error);
        throw {
            status: error.status || 500,
            message: error.message || 'Error interno al registrar el pago',
        };
    }
};


module.exports = {
    getPagos,
    getPagoDetalle,
    registrarPago
};
