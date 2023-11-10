"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const PostCotizacionesProductos = (req, res) => {
    let query = `INSERT INTO public.cotizaciones_productos(
                 id_cotizacion, id_producto, cantidad)
                 VALUES ` + req.body.values;
    console.log(query);
    pool.query(query, (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(respuesta.rows[0]);
        res.send(JSON.stringify({ "status": "ok", "item": respuesta.rows[0] }));
    });
};
module.exports = {
    PostCotizacionesProductos
};
