const pedidosService = require('../services/pedidosService');

const getPedidos = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        if (id) {
            const pedido = await pedidosService.getPedido(id);            
            if (pedido) {
                return res.status(200).json(pedido);
            } else {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } else {
            const pedidos = await pedidosService.getPedidos();
            return res.status(200).json(pedidos);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};

const getPedidosPorUsuario = async (req, res) => {
    const {id_usuario} = req.params // desde el token decodificado

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    try {
        const pedidos = await pedidosService.getPedidosPorUsuario(id_usuario);
        return res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
};

const getPedidoDetalleController = async (req, res) => {
    const {id_pedido} = req.params // desde el token decodificado

    try {
        const pedido = await pedidosService.getPedidoDetalle(id_pedido);
        return res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
};

const getPedidosDetallePorUsuario = async (req, res) => {
    const {id_usuario} = req.params // desde el token decodificado

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    try {
        const pedidos = await pedidosService.getPedidoDetallePorUsuario(id_usuario);
        return res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
};

const finalizarPedido = async (req, res) => {
    const datos = req.body;
    console.log('Cuerpo de la solicitud:', datos);

    try {
        const pedido = await pedidosService.finalizarPedido(datos);
        console.log('Resultado del pedido:', pedido);

        if (!pedido || !pedido.message) {
            return res.status(500).json({ message: 'Error al procesar la respuesta del servicio' });
        }

        res.status(200).json({
            message: pedido.message,
            success: true,
            pedido: { ...datos }, // devolvés lo que envió el frontend
        });

    } catch (error) {
        console.error('Error en el controller:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error desconocido' });
    }
};

const actualizarPedido = async (req, res) => {
    const { id_pedido, estado } = req.body;

    try {
        const resultado = await pedidosService.actualizarPedido(id_pedido, estado);
        return res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getPedidos,
    getPedidosPorUsuario,
    getPedidosDetallePorUsuario,
    getPedidoDetalleController,
    finalizarPedido,
    actualizarPedido
};
