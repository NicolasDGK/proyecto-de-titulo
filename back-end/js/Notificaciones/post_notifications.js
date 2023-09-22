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
// Import required modules and dependencies
const express_1 = __importDefault(require("express"));
const pool = require('../connect_database');
const router = express_1.default.Router();
// Create a route for posting notifications
router.post('/post/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield pool.query(query, values);
        // Return the newly created notification's ID
        const newNotificationId = result.rows[0].id;
        res.status(201).json({ id: newNotificationId });
    }
    catch (error) {
        console.error('Error posting notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router; // Export the router here
