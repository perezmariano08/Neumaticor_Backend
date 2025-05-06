const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verificarToken, revisarAdmin } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.get('/productos/marcas', verificarToken, revisarAdmin, productosController.getMarcas);
router.get('/productos/:id?', verificarToken, productosController.getProductos);
router.get('/productos-destacados', productosController.getProductosDestacados);

module.exports = router;
