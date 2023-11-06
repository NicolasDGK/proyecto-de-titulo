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
exports.isSubscribed = void 0;
const express_1 = __importDefault(require("express"));
const pool = require('../connect_database');
const router = express_1.default.Router();
// Define the route for getting user preferences
router.get('/:userId/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        // Query the database to check if the user already has preferences for the product
        const query = 'SELECT * FROM usuarios_preferencias WHERE id_usuario = $1 AND id_producto = $2';
        const result = yield pool.query(query, [userId, productId]);
        if (result.rows.length > 0) {
            // User preferences for the product already exist
            res.json({ message: 'User preferences exist', data: result.rows[0] });
        }
        else {
            // No preferences found for the user and product
            res.json({ message: 'User preferences do not exist', data: null });
        }
    }
    catch (error) {
        console.error('Error getting user preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Function to check if a user is subscribed to a product
function isSubscribed(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query the database to check if the user already has preferences for the product
            const query = 'SELECT * FROM usuarios_preferencias WHERE id_usuario = $1 AND id_producto = $2';
            const result = yield pool.query(query, [userId, productId]);
            return result.rows.length > 0;
        }
        catch (error) {
            console.error('Error checking user subscription:', error);
            throw error;
        }
    });
}
exports.isSubscribed = isSubscribed;
// Define the route for getting user preferences
router.get('/:userId/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        const isUserSubscribed = yield isSubscribed(userId, productId);
        if (isUserSubscribed) {
            res.json({ message: 'User is subscribed to the product' });
        }
        else {
            res.json({ message: 'User is not subscribed to the product' });
        }
    }
    catch (error) {
        console.error('Error getting user preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
