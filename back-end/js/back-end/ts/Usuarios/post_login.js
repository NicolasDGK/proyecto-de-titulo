"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../connect_database');
const PostLogin = (req, res) => {
    let query = `SELECT id_usuario, nombre, password, email FROM usuarios
                 WHERE email = $1`;
    pool.query(query, [req.body.email], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        if (respuesta.rows.length == 0 || !bcrypt.compareSync(req.body.password, respuesta.rows[0].password)) {
            return res.status(400).json({
                mensaje: 'Usuario o contraseña! inválidos',
            });
        }
        let result = respuesta.rows[0];
        delete result.password;
        let token = jwt.sign({
            data: result
        }, 'secret', { expiresIn: 60 * 60 * 24 }); // Expira en 1 día
        console.log(result);
        console.log(token);
        return res.json({
            result,
            token
        });
    });
};
module.exports = {
    PostLogin
};
