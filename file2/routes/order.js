// routes/order.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 示例认证中间件（如果需要保护 API）
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: '缺少 token' });
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token 无效或已过期' });
    req.businessId = user.businessId;
    next();
  });
}

// 获取某个商家的所有订单
router.get('/', authenticateToken, async (req, res) => {
    const businessId = Number(req.businessId);
    try {
        const [rows] = await db.execute('SELECT * FROM orders WHERE business_id = ?', [businessId]);
         console.log(rows);       
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 创建订单
router.post('/', authenticateToken, async (req, res) => {
  const businessId = Number(req.businessId);
    const {  customerName, totalPrice } = req.body;
    if (!customerName || !totalPrice) {
    return res.status(400).json({ error: '缺少必要参数' });
 	}
    try {
        const [result] = await db.execute(
            'INSERT INTO orders (business_id, customer_name, total_price) VALUES (?, ?, ?)',
            [businessId, customerName, totalPrice]
        );
        res.status(201).json({ orderId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;