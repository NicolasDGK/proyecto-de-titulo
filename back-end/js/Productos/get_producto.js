"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const GetProducto = (req, res) => {
    const id = parseInt(req.params.id);
    let Producto;
    let query = `SELECT id_producto, c.categoria, m.marca, REPLACE(t.tipo, 'NA', c.categoria) AS tipo_producto, nombre, imagen, REPLACE(descripcion, 'NA', 'Descripción no disponible') AS descripcion, REPLACE(ingredientes, 'NA', 'No disponible') AS ingredientes
                 FROM productos AS p
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE id_producto = $1`;
    pool.query(query, [id], (err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        Producto = response.rows;
        console.log(Producto);
        res.send(JSON.stringify(Producto));
    });
};
const GetProductoName = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT nombre AS product_name FROM productos WHERE id_producto = $1';
        const result = yield pool.query(query, [productId]);
        if (result.rows.length === 1) {
            const productName = result.rows[0].product_name;
            return productName;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error fetching product name:', error);
        return null;
    }
});
const GetLowestPriceProducto = (req, res) => {
    const productId = parseInt(req.params.productId);
    let currentLowestPrice;
    const query = `
      SELECT MIN(COALESCE(NULLIF(precio_oferta, 'NA'), precio_normal)) AS lowest_price
      FROM supermercados_productos
      WHERE id_producto = $1
      AND (precio_oferta != 'NA' OR precio_normal != 'NA');
    `;
    pool.query(query, [productId], (err, response) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        currentLowestPrice = response.rows[0].lowest_price;
        res.json({ currentLowestPrice });
    });
};
module.exports = {
    GetProducto,
    GetLowestPriceProducto,
    GetProductoName
};
