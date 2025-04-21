const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { revisarAdmin, verificarToken } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.get('/:id?', verificarToken, revisarAdmin, usuariosController.getUsuarios);

module.exports = router;
