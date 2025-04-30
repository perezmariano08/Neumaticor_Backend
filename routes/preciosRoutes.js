const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const preciosController = require('../controllers/preciosContoller');
const { revisarAdmin, verificarToken } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.get('/productos/:id?', productosController.getProductosConPrecio);
router.get('/listas', preciosController.getListasPrecios);
router.post('/aplicar-porcentaje', preciosController.aplicarPorcentaje);

module.exports = router;
