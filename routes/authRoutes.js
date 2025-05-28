const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { revisarAdmin, verificarToken } = require('../middlewares/auth');
const passport = require('passport');

// LOGIN / REGISTRO NORMAL
router.post('/login', authController.loginController);
router.post('/register', verificarToken, revisarAdmin, authController.registerController);
router.post('/registrar-solicitud', authController.registrarSolicitud);
router.get('/refresh', authController.refreshToken);
router.post('/logout', authController.logoutUser);

// LOGIN CON GOOGLE (REDIRECCIÓN TRADICIONAL)
// router.get(
//     '/google',
//     passport.authenticate('google', { scope: ['profile', 'email'], session: true })
// );

// // CALLBACK DE GOOGLE
// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
//     authController.googleCallback // Este controlador hará el redirect final
// );

router.post('/google', authController.googleLogin);


module.exports = router;
