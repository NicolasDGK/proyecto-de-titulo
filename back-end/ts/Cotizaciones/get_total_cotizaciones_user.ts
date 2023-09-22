import { Cotizacion } from "../interfaces/Cotizacion";

const pool = require('../connect_database');

const GetTotalCotizacionUser = (req: any, res: any) => {
    const id = req.params.id;
    
    let query = `SELECT COUNT(*) FROM (
                    SELECT id_cotizacion, monto_total, fecha 
                    FROM cotizaciones
                    WHERE id_usuario = $1
                 ) total;`;
    
    pool.query(query, [id], (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        console.log(respuesta.rows[0].count);
        
        res.send(JSON.stringify({"status":"ok", "items":respuesta.rows[0].count}))
    })
}

module.exports = { 
    GetTotalCotizacionUser 
}