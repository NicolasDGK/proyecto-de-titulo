"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetCategoryType = (req, res) => {
    const id = parseInt(req.params.id);
    let Categoria;
    let query = `SELECT id_categoria, categoria
                 FROM categorias
                 WHERE id_categoria = $1`;
    pool.query(query, [id], (err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        Categoria = response.rows;
        console.log(Categoria);
        res.send(JSON.stringify(Categoria));
    });
};
module.exports = {
    GetCategoryType
};
