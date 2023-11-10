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
router.put('/:productId/UpdateLowestPrice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const newLowestPrice = req.body.newLowestPrice;
    try {
        const checkQuery = 'SELECT lowest_price FROM usuarios_preferencias WHERE id_producto = $1';
        const checkResult = yield pool.query(checkQuery, [productId]);
        if (checkResult.rows.length === 1) {
            const currentLowestPrice = checkResult.rows[0].lowest_price;
            if (currentLowestPrice === newLowestPrice) {
                return res.status(200).json({ message: 'Lowest price is the same, no update needed' });
            }
        }
        else {
            return res.status(404).json({ error: 'Product not found in usuarios_preferencias' });
        }
        const updateQuery = 'UPDATE usuarios_preferencias SET lowest_price = $1 WHERE id_producto = $2';
        yield pool.query(updateQuery, [newLowestPrice, productId]);
        res.status(200).json({ message: 'Lowest price updated successfully' });
    }
    catch (error) {
        console.error('Error updating lowest price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
