import { Usuario } from "../interfaces/Usuarios";

const pool = require('../connect_database');

const GetUser = (req: any, res: any) => {
    const email = req.params.email;
    let Usuario:Usuario;
    let query = `SELECT id_usuario, nombre, email
                 FROM usuarios
                 WHERE email = $1`;
    
    pool.query(query, [email], (err: any, respuesta: any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        Usuario = respuesta.rows;
        console.log(Usuario);
        
        res.send(JSON.stringify(Usuario));
    })
}

module.exports = { 
    GetUser 
}