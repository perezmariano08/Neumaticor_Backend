const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verificarToken, revisarAdmin } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.post('/productos/crear', productosController.crearProductoController);
router.put('/productos/editar', productosController.actualizarProductoController);
router.get('/productos/marcas', productosController.getMarcas);
router.get('/productos/:id?', productosController.getProductos);
router.get('/productos-destacados', productosController.getProductosDestacados);

module.exports = router;
