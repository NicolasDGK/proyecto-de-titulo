"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('./connect_database');
const GetProducto = (req, res) => {
    const id = parseInt(req.params.id);
    let Producto;
    /* let query = `SELECT * FROM productos WHERE id_producto = $1`; */
    pool.query(`SELECT * FROM productos WHERE id_producto = $1`, [id], (err, response) => {
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
