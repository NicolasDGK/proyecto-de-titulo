"use strict";
const CopyTemplateToLocalStorage = (req, res) => {
    const id_template = req.params.id_template;
    // Modify the query to retrieve the template by id_template
    let query = `
      SELECT c.*, cp.id_producto, cp.cantidad
      FROM cotizaciones AS c
      LEFT JOIN cotizacionesproductos AS cp ON c.id_cotizacion = cp.id_cotizacion
      WHERE c.id_template = $1
    `;
    pool.query(query, [id_template], (err, respuesta) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Construct a JSON representation of the template
        const template = {
            id_template: id_template,
            productos: respuesta.rows.map((row) => ({
                id_producto: row.id_producto,
                cantidad: row.cantidad
            }))
        };
        // Store the template in localStorage of the user
        // Return a success response or appropriate status code
        res.status(200).json({ message: 'Template copied to cart successfully' });
    });
};
module.exports = {
    CopyTemplateToLocalStorage
};
