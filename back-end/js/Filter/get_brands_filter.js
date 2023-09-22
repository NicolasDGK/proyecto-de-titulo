"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const PostBrandsFilter = (req, res) => {
    let ListaMarcas = new Array();
    let query = `SELECT DISTINCT m.id_marca, m.marca
                 FROM marcas AS m
                 JOIN productos AS p ON p.marca = m.id_marca
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE c.id_categoria = COALESCE(NULL, c.id_categoria) AND
                 	   t.id_tipo = COALESCE(NULL, t.id_tipo);`;
    pool.query(query, (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListaMarcas.push(row);
        }
        console.log(ListaMarcas);
        res.send(JSON.stringify({ "satus": "ok", "items": ListaMarcas }));
    });
};
module.exports = {
    PostBrandsFilter
};
