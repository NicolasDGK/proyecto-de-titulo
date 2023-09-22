import { Categorias } from "../interfaces/Categoria";

const pool = require('../connect_database');

const GetCategory = (req: any, res: any) => {
    const id = parseInt(req.params.id);
    let Categoria:Categorias;
    let query = `SELECT id_categoria, categoria
                 FROM categorias
                 WHERE id_categoria = $1`;
    
    pool.query(query, [id], (err: any, response: any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        Categoria = response.rows;
        console.log(Categoria);
        
        res.send(JSON.stringify(Categoria))
    })
}

module.exports = { 
    GetCategory 
}