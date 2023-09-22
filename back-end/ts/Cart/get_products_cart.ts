import { ProductCart } from "../interfaces/ProductCart";

const pool = require('../connect_database');

const GetProductsCart = (req:any, res:any) => {
    let list_ids = req.params.ids;
    let ListaProductos = new Array<ProductCart>();
    let query = `SELECT s.supermercado,
                        sp.id_producto,
                        REPLACE(sp.precio_normal, 'NA', '-') AS precio_normal, 
                        REPLACE(sp.precio_oferta, 'NA', '-') AS precio_oferta, 
                        sp.disponibilidad 
                 FROM supermercados_productos AS sp
                 JOIN supermercados AS s ON s.id_supermercado = sp.id_supermercado
                 WHERE sp.id_producto IN (` + list_ids + `);`
    pool.query(query, (err:any, respuesta:any) => {
        console.log(req.body.ids)
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListaProductos.push(row);
        }
        
        console.log(ListaProductos);
        res.send(JSON.stringify({"satus":"ok", "items":ListaProductos}));
    })
}

module.exports = {
    GetProductsCart
}