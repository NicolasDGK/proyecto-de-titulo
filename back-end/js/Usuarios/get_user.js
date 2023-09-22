"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetUser = (req, res) => {
    const email = req.params.email;
    let Usuario;
    let query = `SELECT id_usuario, nombre, email
                 FROM usuarios
                 WHERE email = $1`;
    pool.query(query, [email], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        Usuario = respuesta.rows;
        console.log(Usuario);
        res.send(JSON.stringify(Usuario));
    });
};
module.exports = {
    GetUser
};
