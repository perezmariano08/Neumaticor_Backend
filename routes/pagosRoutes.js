const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { revisarAdmin, verificarToken } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.post('/registrar', verificarToken, revisarAdmin, pagosController.registrarPagoController);
router.get('/', verificarToken, revisarAdmin, pagosController.getPagosController);
router.get('/detalle/:id_pago', verificarToken, revisarAdmin, pagosController.getPagoDetalleController);

module.exports = router;
