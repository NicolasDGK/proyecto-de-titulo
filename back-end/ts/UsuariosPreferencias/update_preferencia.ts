import express from 'express';
const pool = require('../connect_database');
const router = express.Router();

// Define the PUT route for updating the lowest price
router.put('/:productId/UpdateLowestPrice', async (req: any, res: any) => {
  const productId = req.params.productId;
  const newLowestPrice = req.body.newLowestPrice;

  try {
    // Check if the new lowest price is different from the current lowest price
    const checkQuery = 'SELECT lowest_price FROM usuarios_preferencias WHERE id_producto = $1';
    const checkResult = await pool.query(checkQuery, [productId]);
    
    if (checkResult.rows.length === 1) {
      const currentLowestPrice = checkResult.rows[0].lowest_price;

      if (currentLowestPrice === newLowestPrice) {
        // Prices are the same, no update needed
        return res.status(200).json({ message: 'Lowest price is the same, no update needed' });
      }
    } else {
      return res.status(404).json({ error: 'Product not found in usuarios_preferencias' });
    }

    // Update the lowest_price in the usuarios_preferencias table for the specified product
    const updateQuery = 'UPDATE usuarios_preferencias SET lowest_price = $1 WHERE id_producto = $2';
    await pool.query(updateQuery, [newLowestPrice, productId]);

    // Send a success response
    res.status(200).json({ message: 'Lowest price updated successfully' });
  } catch (error) {
    console.error('Error updating lowest price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
