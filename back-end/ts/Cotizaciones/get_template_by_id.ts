import { Cotizacion } from "../interfaces/Cotizacion";

const pool = require('../connect_database');

// Define the function to get a template by ID
const getTemplateById = (req:any, res:any) => {
    const idTemplate = req.params.idTemplate; // Assuming your route parameter is named "idTemplate"
    console.log('Received template ID:', idTemplate);

    // Define the SQL query to retrieve template data by its ID
    const query = `
        SELECT c.*, cp.id_producto, cp.cantidad
        FROM cotizaciones AS c
        LEFT JOIN Cotizaciones_Productos AS cp ON c.id_cotizacion = cp.id_cotizacion
        WHERE c.id_template = $1
    `;

    pool.query(query, [idTemplate], (err:any, result:any) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Check if any rows were returned
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Process the result and build the template object
        const template = {
            id_cotizacion: result.rows[0].id_cotizacion,
            id_usuario: result.rows[0].id_usuario,
            monto_total: result.rows[0].monto_total,
            fecha: result.rows[0].fecha,
            id_template: result.rows[0].id_template,
            productos: result.rows.map((row: any) => ({
            id_producto: row.id_producto,
            cantidad: row.cantidad
            }))
        };

        // Return the template data as JSON
        res.status(200).json(template);
    });
};

module.exports = {
    getTemplateById
};
