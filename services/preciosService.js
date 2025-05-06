const db = require('../utils/db');

const getPreciosPorLista = async (idListaPrecio) => {
    const [precios] = await db.query(`CALL sp_get_precios_por_lista(?)`, [idListaPrecio]);
    return precios[0];
};

const getListasPrecios = async () => {
    const [listas_precios] = await db.query(
        `SELECT * FROM listas_precios;`
    )    
    return listas_precios
};

const aplicarPorcentaje = async (idListaPrecio, porcentaje, marca = null) => {
    const factor = 1 + porcentaje / 100;

    let query = `
        UPDATE precios p
        INNER JOIN productos prod ON p.id_producto = prod.id_producto
        SET p.precio = p.precio * ?
        WHERE p.id_lista_precio = ?
    `;
    const params = [factor, idListaPrecio];

    if (marca) {
        query += ` AND prod.id_marca = ?`;
        params.push(marca);
    }

    const [result] = await db.query(query, params);
    return result.affectedRows;
};



module.exports = {
    getPreciosPorLista,
    getListasPrecios,
    aplicarPorcentaje
};
