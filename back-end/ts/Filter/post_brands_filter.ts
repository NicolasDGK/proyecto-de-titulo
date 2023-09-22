import { Marca } from "../interfaces/Marca";

const pool = require('../connect_database');

const PostBrandsFilter = (req:any, res:any) => {
    let ListaMarcas = new Array<Marca>();
    let query = `SELECT DISTINCT m.id_marca, m.marca
                 FROM marcas AS m
                 JOIN productos AS p ON p.marca = m.id_marca
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE c.id_categoria = COALESCE($1, c.id_categoria) AND
                       t.id_tipo = COALESCE($2, t.id_tipo)
                 ORDER BY m.marca ASC;`
    pool.query(query, [req.body.categoria, req.body.tipo], (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListaMarcas.push(row);
        }
        
        console.log(ListaMarcas);
        res.send(JSON.stringify({"satus":"ok", "items":ListaMarcas}));
    })
}

module.exports = {
    PostBrandsFilter
}



