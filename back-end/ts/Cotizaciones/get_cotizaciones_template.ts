import { Cotizacion } from "../interfaces/Cotizacion";

const pool = require('../connect_database');

const GetCotizacionesTemplate = (req: any, res: any) => {
    const id_template = req.params.id_template;
    console.log(id_template);
    let query = `
      SELECT c.*, cp.id_producto, cp.cantidad
      FROM cotizaciones AS c
      LEFT JOIN cotizacionesproductos AS cp ON c.id_cotizacion = cp.id_cotizacion
      WHERE c.id_template = $1
    `;

    pool.query(query, [id_template], (err: any, respuesta: any) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const cotizaciones = respuesta.rows.map((row: any) => ({
            id_cotizacion: row.id_cotizacion,
            id_usuario: row.id_usuario,
            monto_total: row.monto_total,
            fecha: row.fecha,
            id_template: row.id_template,
            productos: row.id_producto
                ? { id_producto: row.id_producto, cantidad: row.cantidad }
                : [], // Empty array if no associated products
        }));

        res.status(200).json(cotizaciones);
    });
};

module.exports = {
    GetCotizacionesTemplate
};
