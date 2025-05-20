const productosService = require('../services/productosService');
const preciosService = require('../services/preciosService');
const usuariosService = require('../services/usuariosService');

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

const getProductosConPrecio = async (req, res) => {
    try {
        const idUsuario = req.query.id_usuario || req.user?.id_usuario;

        let idLista = 1;
        if (idUsuario) {
            const usuario = await usuariosService.getUsuario(idUsuario);
            idLista = usuario?.id_lista_precio || 1;
        } else if (req.query.lista) {
            idLista = req.query.lista;
        }

        if (req.params.id) {
            // Si se pide un producto específico
            const producto = await productosService.getProducto(req.params.id);
            const precios = await preciosService.getPreciosPorLista(idLista);
            const precio = precios.find(pr => pr.id_producto === producto.id_producto);
            
            
            return res.json({
                ...producto,
                precio: precio ? precio.precio : null
            });
        } else {
            // Si se piden todos
            const productos = await productosService.getProductos();
            const precios = await preciosService.getPreciosPorLista(idLista);
            
            const productosConPrecio = 
            productos
            .filter((p) => p.estado === "A")
            .map(p => {
                const precio = precios.find(pr => pr.id_producto === p.id_producto);
                return {
                    ...p,
                    precio: precio ? precio.precio : null
                };
            });            

            return res.json(productosConPrecio);
        }
    } catch (error) {
        console.error("Error al obtener productos con precios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getMarcas = async (req, res) => {    
    try {
        const marcas = await productosService.getMarcas();
        return res.status(200).json(marcas);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las marcas', error });
    }
};

const crearProductoController = async (req, res) => {
    const datos = req.body;
    console.log('Cuerpo de la solicitud:', datos);

    try {
        const response = await productosService.crearProducto(datos);
        console.log('Resultado del producto:', response);

        if (!response || !response.message) {
            return res.status(500).json({ message: 'Error al procesar la respuesta del servicio' });
        }

        res.status(200).json({
            message: response.message,
            success: true,
            producto: { ...datos, id_producto: response.id_producto }, // devolvés también el id generado
        });

    } catch (error) {
        console.error('Error en el controller:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error desconocido' });
    }
};

const actualizarProductoController = async (req, res) => {
    const datos = req.body;

    try {
        const resultado = await productosService.actualizarProducto(datos);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error al actualizar el producto' });
    }
};

module.exports = {
    getProductos,
    getProductosDestacados,
    getProductosConPrecio,
    getMarcas,
    crearProductoController,
    actualizarProductoController
};
