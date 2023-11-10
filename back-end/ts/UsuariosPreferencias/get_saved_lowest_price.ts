import express from 'express';
const pool = require('../connect_database');
const router = express.Router();

router.get('/:userId/:productId', async (req: any, res: any) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    const query = `
      SELECT lowest_price
      FROM usuarios_preferencias
      WHERE id_usuario = $1 AND id_producto = $2
    `;
    const result = await pool.query(query, [userId, productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Saved lowest price not found' });
    }

    const savedLowestPrice = result.rows[0].lowest_price;

    res.json({ savedLowestPrice });
  } catch (error) {
    console.error('Error fetching saved lowest price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
