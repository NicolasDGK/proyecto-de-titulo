import express from 'express';
const pool = require('../connect_database');
const router = express.Router();

// Define a route to get the saved lowest price for a product and user
router.get('/:userId/:productId', async (req: any, res: any) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    // Query the database to fetch the saved lowest price for the specified product and user
    const query = `
      SELECT lowest_price
      FROM usuarios_preferencias
      WHERE id_usuario = $1 AND id_producto = $2
    `;
    const result = await pool.query(query, [userId, productId]);

    if (result.rows.length === 0) {
      // No saved lowest price found
      return res.status(404).json({ error: 'Saved lowest price not found' });
    }

    const savedLowestPrice = result.rows[0].lowest_price;

    // Return the saved lowest price as a JSON response
    res.json({ savedLowestPrice });
  } catch (error) {
    console.error('Error fetching saved lowest price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
