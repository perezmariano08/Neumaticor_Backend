const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { revisarAdmin } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.get('/roles', usuariosController.getRoles);
router.get('/solicitudes', usuariosController.getSolicitudes);
router.get('/:id?', usuariosController.getUsuarios);

module.exports = router;
