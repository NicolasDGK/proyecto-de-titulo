import { Producto } from "../interfaces/Producto";

const pool = require('../connect_database');

const GetProducto = (req: any, res: any) => {
    const id = parseInt(req.params.id);
    let Producto:Producto;
    let query = `SELECT id_producto, c.categoria, m.marca, REPLACE(t.tipo, 'NA', c.categoria) AS tipo_producto, nombre, imagen, REPLACE(descripcion, 'NA', 'Descripción no disponible') AS descripcion, REPLACE(ingredientes, 'NA', 'No disponible') AS ingredientes
                 FROM productos AS p
                 JOIN categorias AS c ON c.id_categoria = p.categoria
                 JOIN marcas AS m ON m.id_marca = p.marca
                 JOIN tipos AS t ON t.id_tipo = p.tipo_producto
                 WHERE id_producto = $1`;
    
    pool.query(query, [id], (err: any, response: any) => {
        if(err) {
            console.log(err);
            return;
        }
        
        Producto = response.rows;
        console.log(Producto);
        
        res.send(JSON.stringify(Producto))
    })
}


  const GetProductoName = async (productId: number): Promise<string | null> => {
    try {
      const query = 'SELECT nombre AS product_name FROM productos WHERE id_producto = $1';
      const result = await pool.query(query, [productId]);
  
      if (result.rows.length === 1) {
        const productName = result.rows[0].product_name;
        return productName; 
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching product name:', error);
      return null;
    }
  };

const GetLowestPriceProducto = (req: any, res: any) => {
    const productId = parseInt(req.params.productId);
    let currentLowestPrice: number; 

    const query = `
      SELECT MIN(COALESCE(NULLIF(precio_oferta, 'NA'), precio_normal)) AS lowest_price
      FROM supermercados_productos
      WHERE id_producto = $1
      AND (precio_oferta != 'NA' OR precio_normal != 'NA');
    `;

    pool.query(query, [productId], (err: any, response: any) => {
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
}