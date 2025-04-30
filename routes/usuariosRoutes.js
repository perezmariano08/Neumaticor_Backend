const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { revisarAdmin, verificarToken } = require('../middlewares/auth');

// Esta es la ruta correcta según tu código
router.get('/roles',  revisarAdmin, usuariosController.getRoles);
router.get('/solicitudes',  revisarAdmin, usuariosController.getSolicitudes);
router.get('/:id?', revisarAdmin, usuariosController.getUsuarios);

module.exports = router;
