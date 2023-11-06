"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const PostCategoriesFilter = (req, res) => {
    let ListaCategorias = new Array();
    let query = `SELECT DISTINCT c.id_categoria, c.categoria
                 FROM marcas AS m
                 JOIN productos AS p ON p.marca = m.id_marca
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE m.id_marca = COALESCE($1, m.id_marca) AND
                       t.id_tipo = COALESCE($2, t.id_tipo)
                 ORDER BY c.categoria ASC;`;
    pool.query(query, [req.body.marca, req.body.tipo], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListaCategorias.push(row);
        }
        console.log(ListaCategorias);
        res.send(JSON.stringify({ "satus": "ok", "items": ListaCategorias }));
    });
};
module.exports = {
    PostCategoriesFilter
};
