const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verificarToken, revisarAdmin } = require('../middlewares/auth');

// POST
router.post('/finalizar-pedido', pedidosController.finalizarPedido);
// PUT
router.put('/actualizar-pedido', verificarToken, revisarAdmin, pedidosController.actualizarPedido);
// GET
router.get('/usuarios/:id_usuario', pedidosController.getPedidosPorUsuario);
router.get('/usuarios/detalle/:id_usuario', pedidosController.getPedidosDetallePorUsuario);
router.get('/:id?', pedidosController.getPedidos);

module.exports = router;
