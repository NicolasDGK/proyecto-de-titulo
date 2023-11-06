"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetCotizacionProductos = (req, res) => {
    const id = req.params.id;
    let Cotizacion;
    let query = `SELECT cp.id_cotizacion, cp.id_producto, cp.cantidad AS multiplicador, p.nombre AS nombre_producto, m.marca AS marca_producto, p.imagen AS imagen_producto
                 FROM cotizaciones_productos AS cp
                 JOIN productos AS p ON p.id_producto = cp.id_producto
                 JOIN marcas AS m ON m.id_marca = p.marca
                 WHERE cp.id_cotizacion = $1;`;
    pool.query(query, [id], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        Cotizacion = respuesta.rows;
        console.log(Cotizacion);
        res.send(JSON.stringify(Cotizacion));
    });
};
module.exports = {
    GetCotizacionProductos
};
