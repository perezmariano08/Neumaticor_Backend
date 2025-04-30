const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Esta es la ruta correcta según tu código
router.get('/productos/marcas', productosController.getMarcas);
router.get('/productos/:id?', productosController.getProductos);
router.get('/productos-destacados', productosController.getProductosDestacados);

module.exports = router;
