import { Producto } from "../interfaces/Producto";

const pool = require('../connect_database');

const GetAllProductsName = (req:any, res:any) => {
    let search = req.params.search.toUpperCase();
    let ListProductos = new Array<Producto>();
    let query = `SELECT p.id_producto, p.nombre
                 FROM productos AS p
                 WHERE p.nombre <> 'NA' AND p.nombre <> 'E' AND p.nombre LIKE '%${search}%'
                 LIMIT 10`

    pool.query(query, (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListProductos.push(row);
        }
        
        console.log(ListProductos);
        res.send(JSON.stringify({"satus":"ok", "items":ListProductos}));
    })
}

module.exports = {
    GetAllProductsName
}