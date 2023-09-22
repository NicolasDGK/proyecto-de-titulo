"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetSupermarkets = (req, res) => {
    let ListSupermercados = new Array();
    let query = `SELECT id_supermercado, supermercado, logo
                 FROM supermercados`;
    pool.query(query, (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListSupermercados.push(row);
        }
        console.log(ListSupermercados);
        res.send(JSON.stringify({ "satus": "ok", "items": ListSupermercados }));
    });
};
module.exports = {
    GetSupermarkets
};
