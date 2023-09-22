// Import required modules and dependencies
import express, { Request, Response } from 'express';
const pool = require('../connect_database');

const router = express.Router();

// Create a route for posting notifications
router.post('/post/:userId', async (req: Request, res: Response) => {
  try {
    // Extract notification data from the request body
    const userId = req.params.userId;
    const { id_producto, message } = req.body;

    // Insert the notification into the "notificaciones" table
    const query = `
      INSERT INTO notificaciones (id_usuario, id_producto, message, is_Read, created_at)
      VALUES ($1, $2, $3, false, NOW())
      RETURNING id;
    `;

    const values = [userId, id_producto, message];
    const result = await pool.query(query, values);

    // Return the newly created notification's ID
    const newNotificationId = result.rows[0].id;
    res.status(201).json({ id: newNotificationId });
  } catch (error) {
    console.error('Error posting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; // Export the router here

