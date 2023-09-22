"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetAllProductsName = (req, res) => {
    let search = req.params.search.toUpperCase();
    let ListProductos = new Array();
    let query = `SELECT p.id_producto, p.nombre
                 FROM productos AS p
                 WHERE p.nombre <> 'NA' AND p.nombre <> 'E' AND p.nombre LIKE '%${search}%'
                 LIMIT 10`;
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
    GetAllProductsName
};
