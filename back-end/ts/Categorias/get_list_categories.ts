import { Categorias } from "../interfaces/Categoria";

const pool = require('../connect_database');

const GetListCategorias = (req:any, res:any) => {
    let ListaCategorias = new Array<Categorias>();
    let query = `SELECT DISTINCT id_categoria, categoria 
                 FROM categorias
                 ORDER BY categorias.categoria ASC`
    pool.query(query, (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListaCategorias.push(row);
        }
        
        console.log(ListaCategorias);
        res.send(JSON.stringify({"satus":"ok", "items":ListaCategorias}));
    })
}

module.exports = {
    GetListCategorias
}