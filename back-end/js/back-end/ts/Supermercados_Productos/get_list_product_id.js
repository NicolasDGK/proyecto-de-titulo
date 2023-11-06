"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetListSuperProductsId = (req, res) => {
    const id = parseInt(req.params.id);
    let ListSupermercadosProductos = new Array();
    let query = `SELECT s.supermercado, 
                        sp.id_producto, 
                        REPLACE(sp.precio_oferta, 'NA', '-') AS precio_oferta, 
                        REPLACE(sp.precio_normal, 'NA', '-') AS precio_normal, 
                        sp.url_product, 
                        sp.fecha, 
                        REPLACE(sp.disponibilidad, 'Yes', 'Sí') AS disponibilidad
                 FROM supermercados_productos AS sp
                 JOIN supermercados AS s ON s.id_supermercado = sp.id_supermercado
                 WHERE sp.id_producto = $1`;
    pool.query(query, [id], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListSupermercadosProductos.push(row);
        }
        console.log(ListSupermercadosProductos);
        res.send(JSON.stringify({ "satus": "ok", "items": ListSupermercadosProductos }));
    });
};
module.exports = {
    GetListSuperProductsId
};
