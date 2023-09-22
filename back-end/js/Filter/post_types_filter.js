"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const PostTypesFilter = (req, res) => {
    let ListaTipos = new Array();
    let query = `SELECT DISTINCT t.id_tipo, REPLACE(t.tipo, 'NA', c.categoria) AS tipo
                 FROM marcas AS m
                 JOIN productos AS p ON p.marca = m.id_marca
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE m.id_marca = COALESCE($1, m.id_marca) AND
                       c.id_categoria = COALESCE($2, c.id_categoria)
                 ORDER BY tipo ASC;`;
    pool.query(query, [req.body.marca, req.body.categoria], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListaTipos.push(row);
        }
        console.log(ListaTipos);
        res.send(JSON.stringify({ "satus": "ok", "items": ListaTipos }));
    });
};
module.exports = {
    PostTypesFilter
};
