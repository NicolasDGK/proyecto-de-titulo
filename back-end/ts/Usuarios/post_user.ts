const bcrypt = require('bcrypt');
const saltRounds = 10;

import { Usuario } from "../interfaces/Usuarios";

const pool = require('../connect_database');

const PostUsuario = (req:any, res:any) => {
    let query = `INSERT INTO public.usuarios(
                 nombre, password, email)
                 VALUES ($1, $2, $3)
                 RETURNING *`
    
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds, (err:any, hash:any) => {
        if (err) throw (err)
        req.body.password = hash;
    });
    
    
    pool.query(query, [req.body.nombre, req.body.password, req.body.email], (err:any, respuesta:any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        console.log(respuesta.rows[0].id_usuario);
        res.send(JSON.stringify({"status":"ok", "item": respuesta.rows[0].id_usuario}));
    })
}

module.exports = {
    PostUsuario
}