"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../connect_database');
const PostUsuario = (req, res) => {
    let query = `INSERT INTO public.usuarios(
                 nombre, password, email)
                 VALUES ($1, $2, $3)
                 RETURNING *`;
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds, (err, hash) => {
        if (err)
            throw (err);
        req.body.password = hash;
    });
    pool.query(query, [req.body.nombre, req.body.password, req.body.email], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(respuesta.rows[0].id_usuario);
        res.send(JSON.stringify({ "status": "ok", "item": respuesta.rows[0].id_usuario }));
    });
};
module.exports = {
    PostUsuario
};
