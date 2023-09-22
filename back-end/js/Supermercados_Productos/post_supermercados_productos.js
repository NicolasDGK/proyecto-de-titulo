"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const PostCotizacion = (req, res) => {
    let query = `INSERT INTO public.cotizaciones(
                 id_usuario, monto_total, fecha)
                 VALUES ?
                 RETURNING id_cotizacion;`;
    pool.query(query, [req.body.productos], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(respuesta.rows[0]);
        res.send(JSON.stringify({ "status": "ok", "item": respuesta.rows[0] }));
    });
};
module.exports = {
    PostCotizacion
};
