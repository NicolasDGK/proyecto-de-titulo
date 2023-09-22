import { CotizacionesProductos } from "../interfaces/CotizacionesProductos";

const pool = require('../connect_database');

const GetCotizacionProductos = (req: any, res: any) => {
    const id = req.params.id;
    let Cotizacion:CotizacionesProductos;
    let query = `SELECT cp.id_cotizacion, cp.id_producto, cp.cantidad AS multiplicador, p.nombre AS nombre_producto, m.marca AS marca_producto, p.imagen AS imagen_producto
                 FROM cotizaciones_productos AS cp
                 JOIN productos AS p ON p.id_producto = cp.id_producto
                 JOIN marcas AS m ON m.id_marca = p.marca
                 WHERE cp.id_cotizacion = $1;`;
    
    pool.query(query, [id], (err: any, respuesta: any) => {
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
    GetCotizacionProductos 
}