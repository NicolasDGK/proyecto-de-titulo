"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetCotizacionesUsuario = (req, res) => {
    const id = req.params.id;
    const offset = req.params.offset;
    let Cotizacion;
    let query = `SELECT id_cotizacion, monto_total, fecha 
                 FROM cotizaciones
                 WHERE id_usuario = $1
                 ORDER BY id_cotizacion DESC
                 LIMIT 10
                 OFFSET $2`;
    pool.query(query, [id, offset], (err, respuesta) => {
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
    GetCotizacionesUsuario
};
