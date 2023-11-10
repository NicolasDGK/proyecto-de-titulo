"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require('../connect_database');
const getTemplateById = (req, res) => {
    const idTemplate = req.params.idTemplate;
    console.log('Received template ID:', idTemplate);
    const query = `
        SELECT c.*, cp.id_producto, cp.cantidad
        FROM cotizaciones AS c
        LEFT JOIN Cotizaciones_Productos AS cp ON c.id_cotizacion = cp.id_cotizacion
        WHERE c.id_template = $1
    `;
    pool.query(query, [idTemplate], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Template not found' });
        }
        const template = {
            id_cotizacion: result.rows[0].id_cotizacion,
            id_usuario: result.rows[0].id_usuario,
            monto_total: result.rows[0].monto_total,
            fecha: result.rows[0].fecha,
            id_template: result.rows[0].id_template,
            productos: result.rows.map((row) => ({
                id_producto: row.id_producto,
                cantidad: row.cantidad
            }))
        };
        res.status(200).json(template);
    });
};
module.exports = {
    getTemplateById
};
