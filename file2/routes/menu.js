// routes/menu.js
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

// 获取当前登录商家的菜单（受保护接口）
router.get('/', authenticateToken, async (req, res) => {
  const businessId = Number(req.businessId);
  try {
    const [rows] = await db.execute('SELECT * FROM menu_items WHERE business_id = ?', [businessId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加菜单项（受保护接口）
router.post('/', authenticateToken, async (req, res) => {
  const businessId = Number(req.businessId);
  const { name, price, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  try {
    const [result] = await db.execute(
      "INSERT INTO menu_items (business_id, name, price, description) VALUES (?, ?, ?, ?)",
      [businessId, name, price, description]
    );
    res.status(201).json({ message: "菜品添加成功", menuId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;