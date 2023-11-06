"use strict";
/*import { SupermercadosProductos } from "../interfaces/supermercados-productos";

const pool = require('../connect_database');

const GetPriceHistory = (req:any, res:any, id:any) => {
    //const id = parseInt(req.params.productId);
    
    const query =
        `SELECT s.supermercado,
        sp.id_producto,
        REPLACE(sp.precio_oferta, 'NA', '-') AS precio_oferta,
        REPLACE(sp.precio_normal, 'NA', '-') AS precio_normal,
        sp.fecha
        FROM PRECIO_HISTORICO AS sp
        JOIN supermercados AS s ON s.id_supermercado = sp.id_supermercado
        WHERE sp.id_producto = $1
        ORDER BY fecha DESC;`

    console.log('Query:', query);
    
    pool.query(query, [id], (err:any, result:any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const priceHistory = result.rows;
        console.log('ID PRODUCT For Price History', id);
        console.log('Price History Data:', priceHistory);
        res.json({ items: priceHistory });
    });
};

module.exports = {
    GetPriceHistory
};*/
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetPriceHistory = (req, res) => {
    const id = parseInt(req.params.id);
    let ListPriceHistory = new Array();
    let query = `
    SELECT s.supermercado, 
           ph.id_producto, 
           REPLACE(ph.precio_oferta, 'NA', '-') AS precio_oferta,
           REPLACE(ph.precio_normal, 'NA', '-') AS precio_normal,
           ph.url_product,
           ph.fecha,
           REPLACE(ph.disponibilidad, 'Yes', 'Sí') AS disponibilidad
    FROM precio_historico AS ph
    JOIN supermercados AS s ON s.id_supermercado = ph.id_supermercado
    WHERE ph.id_producto = $1`;
    pool.query(query, [id], (err, respuesta) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let row of respuesta.rows) {
            ListPriceHistory.push(row);
        }
        console.log(ListPriceHistory);
        res.send(JSON.stringify({ "satus": "ok", "items": ListPriceHistory }));
    });
};
module.exports = {
    GetPriceHistory
};
