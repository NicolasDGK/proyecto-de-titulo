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
// Define a route to fetch the subscribed products for a user
router.get('/:userId/subscribed-products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        // Query the database to fetch the list of products the user has subscribed to
        const query = 'SELECT id_producto FROM usuarios_preferencias WHERE id_usuario = $1';
        const result = yield pool.query(query, [userId]);
        const subscribedProductIds = result.rows.map((row) => row.id_producto);
        // You can fetch additional product details if needed based on the subscribedProductIds
        res.json({ subscribedProductIds });
    }
    catch (error) {
        console.error('Error fetching subscribed products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
