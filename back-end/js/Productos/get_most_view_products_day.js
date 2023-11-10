"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetMostViewProductsDay = (req, res) => {
    let ListProductos = new Array();
    let query = `SELECT 
                    p.id_producto,
                    m.marca,
                    p.nombre,
                    p.imagen, 
                    sp.precio_normal AS precio_normal, 
                    sp.precio_oferta AS precio_oferta
                FROM 
                    productos AS p
                JOIN 
                    supermercados_productos AS sp ON sp.id_producto = p.id_producto
                JOIN 
                    marcas AS m ON m.id_marca = p.marca
                WHERE 
                    EXISTS (
                        SELECT 1
                        FROM supermercados_productos AS sp1
                        WHERE sp1.id_producto = p.id_producto AND sp1.id_supermercado = 1
                    )
                    AND EXISTS (
                        SELECT 1
                        FROM supermercados_productos AS sp2
                        WHERE sp2.id_producto = p.id_producto AND sp2.id_supermercado = 2
                    )
                    AND EXISTS (
                        SELECT 1
                        FROM supermercados_productos AS sp3
                        WHERE sp3.id_producto = p.id_producto AND sp3.id_supermercado = 3
                    )
                    AND sp.precio_oferta <> 'NA' 
                    AND sp.precio_normal <> 'NA' 
                    AND CAST(sp.precio_oferta AS INTEGER) < CAST(sp.precio_normal AS INTEGER)
                ORDER BY RANDOM()
                LIMIT 40;`;
    pool.query(query, (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        let result = respuesta.rows;
        delete result.fecha;
        for (let row of result) {
            ListProductos.push(row);
        }
        console.log(ListProductos);
        res.send(JSON.stringify({ "satus": "ok", "items": ListProductos }));
    });
};
module.exports = {
    GetMostViewProductsDay
};
