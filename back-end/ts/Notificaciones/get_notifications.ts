
import express, { Request, Response } from 'express';
const pool = require('../connect_database');

const router = express.Router();

router.get('/get/:userId', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM notificaciones WHERE id_usuario = $1';
    const userId = req.params.userId;
    const values = [userId];
    console.log('Received userId:', userId);
    const result = await pool.query(query, values);

    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
