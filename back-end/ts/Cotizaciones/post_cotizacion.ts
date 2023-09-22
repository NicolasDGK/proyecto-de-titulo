import { Cotizacion } from "../interfaces/Cotizacion";

const pool = require('../connect_database');

const PostCotizacion = (req:any, res:any) => {
    let query = `INSERT INTO public.cotizaciones(
                 id_usuario, monto_total, fecha)
                 VALUES ($1, $2, $3)
                 RETURNING id_cotizacion;`
    
    pool.query(query, [req.body.id_usuario, req.body.monto_total, req.body.fecha], (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        console.log(respuesta.rows[0]);
        res.send(JSON.stringify({"status":"ok", "item": respuesta.rows[0]}));
    })
}

module.exports = {
    PostCotizacion
}