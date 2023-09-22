import { Supermarket } from "../interfaces/Supermercado";

const pool = require('../connect_database');

const GetSupermarkets = (req:any, res:any) => {
    let ListSupermercados = new Array<Supermarket>();
    let query = `SELECT id_supermercado, supermercado, logo
                 FROM supermercados`
    pool.query(query, (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        for(let row of respuesta.rows) {
            ListSupermercados.push(row);
        }
        
        console.log(ListSupermercados);
        res.send(JSON.stringify({"satus":"ok", "items":ListSupermercados}));
    })
}

module.exports = {
    GetSupermarkets
}