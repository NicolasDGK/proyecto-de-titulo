import { SupermercadosProductos } from "../interfaces/supermercados-productos";

const pool = require('../connect_database');

const GetListHistorialId = (req:any, res:any) => {
    const id = parseInt(req.params.id);
    let ListHistorial = new Array<SupermercadosProductos>();
    let query = `SELECT s.supermercado, 
                        sp.id_producto, 
                        REPLACE(sp.precio_oferta, 'NA', '-') AS precio_oferta, 
                        REPLACE(sp.precio_normal, 'NA', '-') AS precio_normal, 
                        sp.fecha
                        
                 FROM precio_historico AS sp
                 JOIN supermercados AS s ON s.id_supermercado = sp.id_supermercado
                 WHERE sp.id_producto = $1`;
                 
    pool.query(query, [id], (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListHistorial.push(row);
        }
        
        console.log(ListHistorial);
        res.send(JSON.stringify({"satus":"ok", "items":ListHistorial}));
    })
}

module.exports = {
    GetListHistorialId
}