const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verificarToken, revisarAdmin } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.post('/finalizar-pedido', pedidosController.finalizarPedido);
router.put('/actualizar-pedido', pedidosController.actualizarPedido);
router.get('/usuarios/:id_usuario', pedidosController.getPedidosPorUsuario);
router.get('/usuarios/detalle/:id_usuario', pedidosController.getPedidosDetallePorUsuario);
router.get('/:id?', pedidosController.getPedidos);

module.exports = router;
