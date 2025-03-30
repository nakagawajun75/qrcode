// routes/menu.js
const express = require('express');
const router = express.Router();
const db = require('../db');


// 获取当前登录商家的菜单（受保护接口）
router.get('/',  async (req, res) => {
  const businessId = Number(req.query.businessId);
  console.log(req.query.tableId);
  try {
    const [rows] = await db.execute('SELECT * FROM menu_items WHERE business_id = ?', [businessId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;