
import express, { Request, Response } from 'express';
const pool = require('../connect_database');

const router = express.Router();

// Create a route for fetching notifications
router.get('/get/:userId', async (req: Request, res: Response) => {
  try {
    // Fetch notifications from the database (adjust the query as needed)
    const query = 'SELECT * FROM notificaciones WHERE id_usuario = $1';
    const userId = req.params.userId;
    const values = [userId];
    console.log('Received userId:', userId);
    const result = await pool.query(query, values);

    // Send the notifications to the client
    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
