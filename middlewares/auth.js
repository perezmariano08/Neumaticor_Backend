const jwt = require('jsonwebtoken');

function revisarAdmin(req, res, next) {
    console.log('req.user:', req.user); // 👈 Esto te va a decir si hay usuario

    console.log(req.user.isAdmin);
    
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ mensaje: 'Acceso denegado' });
    }
}

function verificarToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Token requerido" });    
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // Guardamos la info del usuario en el request
        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido" });
    }
}


module.exports = {
    revisarAdmin,
    verificarToken
};