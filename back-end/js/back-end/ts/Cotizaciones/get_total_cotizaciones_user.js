"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetTotalCotizacionUser = (req, res) => {
    const id = req.params.id;
    let query = `SELECT COUNT(*) FROM (
                    SELECT id_cotizacion, monto_total, fecha 
                    FROM cotizaciones
                    WHERE id_usuario = $1
                 ) total;`;
    pool.query(query, [id], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(respuesta.rows[0].count);
        res.send(JSON.stringify({ "status": "ok", "items": respuesta.rows[0].count }));
    });
};
module.exports = {
    GetTotalCotizacionUser
};
