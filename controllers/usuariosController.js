const usuariosService = require('../services/usuariosService');

const getUsuarios = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL   

    try {
        if (id) {
            const usuario = await usuariosService.getUsuario(id);            
            if (usuario) {
                return res.status(200).json(usuario);
            } else {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } else {
            const usuarios = await usuariosService.getUsuarios();            
            return res.status(200).json(usuarios);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};


const getRoles = async (req, res) => {
    try {
        const roles = await usuariosService.getRoles();            
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los roles', error });
    }
};

const getSolicitudes = async (req, res) => {
    try {
        const solicitudes = await usuariosService.getSolicitudes();            
        return res.status(200).json(solicitudes);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las solicitudes', error });
    }
};

module.exports = {
    getUsuarios,
    getRoles,
    getSolicitudes
};
