const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Esta es la ruta correcta según tu código
router.get('/productos/:id?', productosController.getProductosConPrecio);

module.exports = router;
