const productosService = require('../services/productosService');

const getProductos = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        if (id) {
            const producto = await productosService.getProducto(id);            
            if (producto) {
                return res.status(200).json(producto);
            } else {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
        } else {
            const productos = await productosService.getProductos();
            return res.status(200).json(productos);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

const getProductosDestacados = async (req, res) => {
    try {
        const productos = await productosService.getProductosDestacados();
        return res.status(200).json(productos);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

module.exports = {
    getProductos,
    getProductosDestacados
};
