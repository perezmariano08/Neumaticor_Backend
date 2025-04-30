const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function revisarAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ mensaje: 'Acceso denegado' });
    }
}

function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
}

const fakeUser = (req, res, next) => {
    req.user = {
        id_cliente: 5,
        id_lista_precio: 3
    };
    next();
};


module.exports = {
    revisarAdmin,
    verificarToken,
    fakeUser
};