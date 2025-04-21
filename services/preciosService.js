const db = require('../utils/db');

const getPreciosPorLista = async (idListaPrecio) => {
    const [precios] = await db.query(`CALL sp_get_precios_por_lista(?)`, [idListaPrecio]);
    return precios[0];
};

module.exports = {
    getPreciosPorLista
};
