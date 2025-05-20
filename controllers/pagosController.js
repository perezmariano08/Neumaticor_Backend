const pagosService = require('../services/pagosService');

const getPagosController = async (req, res) => {
    try {
        const pagos = await pagosService.getPagos();
        return res.status(200).json(pagos);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los pagos', error });
    }
};

const getPagoDetalleController = async (req, res) => {
    const {id_pago} = req.params // desde el token decodificado
    try {
        const pago_detalle = await pagosService.getPagoDetalle(id_pago);
        return res.status(200).json(pago_detalle);
    } catch (error) {
        console.error('Error al obtener detalles del pago:', error);
        return res.status(500).json({ message: 'Error al obtener los detalles del pago' });
    }
};

const registrarPagoController = async (req, res) => {
    const { id_usuario, metodo_pago, monto_pago } = req.body;

    try {
        const comprobante = await pagosService.registrarPago(id_usuario, metodo_pago, monto_pago);
        return res.status(200).json({
            success: true,
            message: 'Pago aplicado correctamente',
            comprobante
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Error al registrar el pago'
        });
    }
};

module.exports = {
    getPagosController,
    getPagoDetalleController,
    registrarPagoController
};
