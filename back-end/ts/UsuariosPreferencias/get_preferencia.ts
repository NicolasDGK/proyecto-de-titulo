import express from 'express';
const pool = require('../connect_database');
const router = express.Router();

router.get('/:userId/:productId', async (req:any, res:any) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    const query = 'SELECT * FROM usuarios_preferencias WHERE id_usuario = $1 AND id_producto = $2';
    const result = await pool.query(query, [userId, productId]);

    if (result.rows.length > 0) {
      res.json({ message: 'User preferences exist', data: result.rows[0] });
    } else {
      res.json({ message: 'User preferences do not exist', data: null });
    }
  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export async function isSubscribed(userId: number, productId: number): Promise<boolean> {
  try {
    const query = 'SELECT * FROM usuarios_preferencias WHERE id_usuario = $1 AND id_producto = $2';
    const result = await pool.query(query, [userId, productId]);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking user subscription:', error);
    throw error;
  }
}

router.get('/:userId/:productId', async (req: any, res: any) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    const isUserSubscribed = await isSubscribed(userId, productId);

    if (isUserSubscribed) {
      res.json({ message: 'User is subscribed to the product' });
    } else {
      res.json({ message: 'User is not subscribed to the product' });
    }
  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;