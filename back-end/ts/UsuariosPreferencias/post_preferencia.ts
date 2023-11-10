
import { Router, Request, Response } from 'express';
const router = Router();
const bodyParser = require('body-parser'); 

const pool = require('../connect_database'); 

router.post('/save', bodyParser.json(), async (req: any, res: any) => {
  console.log('Received POST request to /usuarios-preferencias/save');
  console.log('Request Body:', req.body);
  const { user_id_usuario: userId, product_id: productId } = req.body;

  console.log('Received id_usuario:', userId);
  console.log('Received id_producto:', productId);
    
  try {
    const query = 'INSERT INTO usuarios_preferencias (id_usuario, id_producto) VALUES ($1, $2)';
    await pool.query(query, [userId, productId]);
    res.json({ message: 'User preference saved successfully' });
  } catch (error) {
    console.error('Error saving user preference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;





