import express from 'express';
const pool = require('../connect_database');
const router = express.Router();

// Define a route to fetch the subscribed products for a user
router.get('/:userId/subscribed-products', async (req: any, res: any) => {
  const userId = req.params.userId;

  try {
    // Query the database to fetch the list of products the user has subscribed to
    const query = 'SELECT id_producto FROM usuarios_preferencias WHERE id_usuario = $1';
    const result = await pool.query(query, [userId]);

    const subscribedProductIds = result.rows.map((row: any) => row.id_producto);

    // You can fetch additional product details if needed based on the subscribedProductIds

    res.json({ subscribedProductIds });
  } catch (error) {
    console.error('Error fetching subscribed products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;