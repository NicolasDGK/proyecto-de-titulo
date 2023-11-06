"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool = require('../connect_database');
const router = express_1.default.Router();
// Define a route to get the saved lowest price for a product and user
router.get('/:userId/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        // Query the database to fetch the saved lowest price for the specified product and user
        const query = `
      SELECT lowest_price
      FROM usuarios_preferencias
      WHERE id_usuario = $1 AND id_producto = $2
    `;
        const result = yield pool.query(query, [userId, productId]);
        if (result.rows.length === 0) {
            // No saved lowest price found
            return res.status(404).json({ error: 'Saved lowest price not found' });
        }
        const savedLowestPrice = result.rows[0].lowest_price;
        // Return the saved lowest price as a JSON response
        res.json({ savedLowestPrice });
    }
    catch (error) {
        console.error('Error fetching saved lowest price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
