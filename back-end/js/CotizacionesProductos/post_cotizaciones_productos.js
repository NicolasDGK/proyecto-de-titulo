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
/*

const PostCotizacionesProductos = (req:any, res:any) => {
    const values = req.body.values; // Assuming values is an array of objects
    
    if (!Array.isArray(values) || values.length === 0) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    
    const query = `INSERT INTO public.cotizaciones_productos(
                 id_cotizacion, id_producto, cantidad)
                 VALUES ($1, $2, $3)`;
    
    console.log(query)

    const valuesToInsert = values.map((item) => [
        item.id_cotizacion,
        item.id_producto,
        item.cantidad
    ]);
    
    pool.query(query, valuesToInsert, (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        console.log(respuesta.rows);
        res.json({ status: 'ok', message: 'Cotizaciones productos saved successfully' });
    });
};

module.exports = {
    PostCotizacionesProductos
};*/ 
