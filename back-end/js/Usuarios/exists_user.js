"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const Get = (req, res) => {
    const id = parseInt(req.params.id);
    let Producto;
    let query = `SELECT id_producto, c.categoria, m.marca, REPLACE(t.tipo, 'NA', c.categoria) AS tipo, nombre, imagen, REPLACE(descripcion, 'NA', 'Descripción no disponible') AS descripcion, REPLACE(ingredientes, 'NA', 'No disponible') AS ingredientes
                 FROM productos AS p
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE id_producto = $1`;
    pool.query(query, [id], (err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        Producto = response.rows;
        console.log(Producto);
        res.send(JSON.stringify(Producto));
    });
};
module.exports = {
    GetProducto
};
