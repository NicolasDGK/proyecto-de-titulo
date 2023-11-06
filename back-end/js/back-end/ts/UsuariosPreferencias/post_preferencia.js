"use strict";
/*import express from 'express';
import { Router, Request, Response } from 'express';
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../connect_database');


// Define the route for saving user preferences
router.post('/save', bodyParser.json(), async (req:any, res:any) => {
  const { id_usuario, id_producto } = req.body;

  try {
    const query = 'INSERT INTO usuarios_preferencias (id_usuario, id_producto) VALUES ($1, $2)';
    await pool.query(query, [id_usuario, id_producto]);
    res.json({ message: 'User preference saved successfully' });
  } catch (error) {
    console.error('Error saving user preference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const bodyParser = require('body-parser');
// Import your database connection pool (if not already done elsewhere)
const pool = require('../connect_database'); // Adjust the path as needed
// Define the route for saving user preferences
router.post('/save', bodyParser.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received POST request to /usuarios-preferencias/save');
    console.log('Request Body:', req.body);
    const { user_id_usuario: userId, product_id: productId } = req.body;
    console.log('Received id_usuario:', userId);
    console.log('Received id_producto:', productId);
    try {
        const query = 'INSERT INTO usuarios_preferencias (id_usuario, id_producto) VALUES ($1, $2)';
        yield pool.query(query, [userId, productId]);
        res.json({ message: 'User preference saved successfully' });
    }
    catch (error) {
        console.error('Error saving user preference:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
