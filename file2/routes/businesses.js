// routes/businesses.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

// 商家注册
router.post('/register', async (req, res) => {
  const { name, address, phone, email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO businesses (name, address, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, address, phone, email, username, hashedPassword]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 商家登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM businesses WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }
    const business = rows[0];
    const match = await bcrypt.compare(password, business.password);
    if (!match) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }
    const token = jwt.sign({ businessId: business.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;