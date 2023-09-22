import { ProductBestPrice } from "../interfaces/product-best-price";

const pool = require('../connect_database');

const GetProductsFilter = (req:any, res:any) => {
    let categoria = req.params.categoria;
    let marca = req.params.marca;
    let tipo = req.params.tipo;
    let precio_inicial = req.params.precio_inicial;
    let precio_final = req.params.precio_final;
    let offset = req.params.offset;
    
    if (categoria == 'null') {
        categoria = null;
    }
      
    if (marca == 'null') {
        marca = null;
    }
      
    if (tipo == 'null') {
        tipo = null;
    }
      
    if (precio_inicial == '') {
        precio_inicial = '0';
    } 
      
    if (precio_final == '') {
        precio_final = '0';
    }
    
    let Producto:ProductBestPrice;
    let ListProductos = new Array<ProductBestPrice>();
    let query = `SELECT p.id_producto, 
                        p.nombre, 
                        m.marca, 
                        p.imagen,
                        MIN(CAST(REPLACE(sp.precio_normal, 'NA', '999999999') AS INTEGER)) AS precio_normal, 
                        MIN(CAST(REPLACE(sp.precio_oferta, 'NA', '999999999') AS INTEGER)) AS precio_oferta
                 FROM supermercados_productos AS sp
                 JOIN productos AS p ON sp.id_producto = p.id_producto
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE p.nombre <> 'NA' AND 
                       p.nombre <> 'E' AND
                       p.categoria = COALESCE($1, p.categoria) AND
                       p.marca = COALESCE($2, p.marca) AND
                       p.tipo_producto = COALESCE($3, p.tipo_producto) AND
                       (REPLACE(sp.precio_normal, 'NA', '-1')::INTEGER BETWEEN $4 AND $5 OR 
                       REPLACE(sp.precio_oferta, 'NA', '-1')::INTEGER BETWEEN $4 AND $5)
                 GROUP BY p.id_producto, m.marca, p.nombre, p.imagen
                 ORDER BY p.nombre
                 LIMIT 20
                 OFFSET $6;`
                 
pool.query(query, [categoria, marca, tipo, precio_inicial, precio_final, offset], (err:any, respuesta:any) => {
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
    GetProductsFilter
}

