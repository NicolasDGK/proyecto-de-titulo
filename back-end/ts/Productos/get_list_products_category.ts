import { Producto } from "../interfaces/Producto";

const pool = require('../connect_database');

const GetListProductosCategoria = (req:any, res:any) => {
    const id = parseInt(req.params.id);
    let ListProductosCategoria = new Array<Producto>();
    let query = `SELECT p.id_producto, c.categoria, m.marca, REPLACE(t.tipo, 'NA', c.categoria) AS tipo_producto, p.nombre, p.imagen, p.descripcion, p.ingredientes
                 FROM productos AS p
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE p.nombre <> 'NA' AND c.id_categoria = $1`
    pool.query(query, [id], (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListProductosCategoria.push(row);
        }
        
        console.log(ListProductosCategoria);
        res.send(JSON.stringify({"satus":"ok", "items":ListProductosCategoria}));
    })
}

module.exports = {
    GetListProductosCategoria
}