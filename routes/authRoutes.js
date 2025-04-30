const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { revisarAdmin, verificarToken } = require('../middlewares/auth');

router.post('/login', authController.loginController);
router.post('/register', authController.registerController);
router.post('/registrar-solicitud', authController.registrarSolicitud);

module.exports = router;
