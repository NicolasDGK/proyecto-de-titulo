import { Cotizacion } from "../interfaces/Cotizacion";

const pool = require('../connect_database');

const GetCotizacionesUsuario = (req: any, res: any) => {
    const id = req.params.id;
    const offset = req.params.offset;
    let Cotizacion:Cotizacion;
    let query = `SELECT id_cotizacion, monto_total, fecha 
                 FROM cotizaciones
                 WHERE id_usuario = $1
                 ORDER BY id_cotizacion DESC
                 LIMIT 10
                 OFFSET $2`;
    
    pool.query(query, [id, offset], (err: any, respuesta: any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        Cotizacion = respuesta.rows;
        console.log(Cotizacion);
        
        res.send(JSON.stringify(Cotizacion));
    })
}

module.exports = { 
    GetCotizacionesUsuario 
}