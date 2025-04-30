const preciosService = require('../services/preciosService');

const getListasPrecios = async (req, res) => {
    try {
        const listas_precios = await preciosService.getListasPrecios();
        return res.status(200).json(listas_precios);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las listas de precios', error });
    }
};

const aplicarPorcentaje = async (req, res) => {
    try {
        const { id_lista_precio, porcentaje, marca } = req.body;

        if (!id_lista_precio || porcentaje === undefined) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const cantidadAfectados = await preciosService.aplicarPorcentaje(id_lista_precio, porcentaje, marca);

        res.json({ 
            success: true, 
            message: `Porcentaje aplicado correctamente a ${cantidadAfectados} productos.`,
            productos_actualizados: cantidadAfectados
        });
    } catch (error) {
        console.error("Error al aplicar porcentaje:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    getListasPrecios,
    aplicarPorcentaje
};
