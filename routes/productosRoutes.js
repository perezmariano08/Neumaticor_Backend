const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

// Esta es la ruta correcta según tu código
router.get('/productos/:id?', productosController.getProductos);
router.get('/productos-destacados', productosController.getProductosDestacados);
router.post('/usuarios', usuariosController.getUsuarios);
router.post('/register', usuariosController.InsertarUsuario);

module.exports = router;
