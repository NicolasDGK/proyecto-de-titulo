"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetListProductos = (req, res) => {
    let ListProductos = new Array();
    let query = `SELECT p.id_producto, c.categoria, m.marca, REPLACE(t.tipo, 'NA', c.categoria) AS tipo_producto, p.nombre, p.imagen, p.descripcion, p.ingredientes
                 FROM productos AS p
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE p.nombre <> 'NA'`;
    pool.query(query, (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListProductos.push(row);
        }
        console.log(ListProductos);
        res.send(JSON.stringify({ "satus": "ok", "items": ListProductos }));
    });
};
module.exports = {
    GetListProductos
};
