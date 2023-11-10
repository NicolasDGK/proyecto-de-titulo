import { Cotizacion } from "../interfaces/Cotizacion";



const pool = require('../connect_database');

const PostCotizacionesProductos = (req:any, res:any) => {
    let query = `INSERT INTO public.cotizaciones_productos(
                 id_cotizacion, id_producto, cantidad)
                 VALUES ` + req.body.values;
    
    console.log(query)
    
    pool.query(query, (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        console.log(respuesta.rows[0]);
        res.send(JSON.stringify({"status":"ok", "item": respuesta.rows[0]}));
    })
}

module.exports = {
    PostCotizacionesProductos
}
