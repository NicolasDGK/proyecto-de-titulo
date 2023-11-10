
import express, { Request, Response } from 'express';
const pool = require('../connect_database');

const router = express.Router();

router.post('/post/:userId', async (req: Request, res: Response) => {
  try {

    const userId = req.params.userId;
    const { id_producto, message } = req.body;

    const query = `
      INSERT INTO notificaciones (id_usuario, id_producto, message, is_Read, created_at)
      VALUES ($1, $2, $3, false, NOW())
      RETURNING id;
    `;

    const values = [userId, id_producto, message];
    const result = await pool.query(query, values);


    const newNotificationId = result.rows[0].id;
    res.status(201).json({ id: newNotificationId });
  } catch (error) {
    console.error('Error posting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 

