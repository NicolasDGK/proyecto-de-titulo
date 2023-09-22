import { ProductBestPrice } from "../interfaces/product-best-price";

const pool = require('../connect_database');

const GetListProductsBestPrice = (req:any, res:any) => {
    let ListProductos = new Array<ProductBestPrice>();
    let query = `SELECT p.id_producto, 
                        m.marca, 
                        p.nombre, 
                        p.imagen, 
                        MIN(sp.precio_normal::INTEGER) AS precio_normal, 
                        MIN(CAST(REPLACE(sp.precio_oferta, 'NA', '999999999') AS INTEGER)) AS precio_oferta
                 FROM productos AS p
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN supermercados_productos AS sp ON sp.id_producto = p.id_producto
                 WHERE p.nombre <> 'NA' AND 
                    p.nombre <> 'E' AND
                    sp.precio_normal <> 'NA' 
                 GROUP BY p.id_producto, m.marca, p.nombre, p.imagen
                 LIMIT 40`
                 
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
    GetListProductsBestPrice
}