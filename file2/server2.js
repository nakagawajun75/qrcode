const express = require('express');
const cors = require('cors');
const db = require('./db'); // 确保 db.js 正确连接 MySQL
require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
console.log("服务器已启动...");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// JWT 秘钥（建议存入 .env 文件中）
const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

// 商家注册 API
app.post('/api/businesses/register', async (req, res) => {
  const { name, address, phone, email, username, password } = req.body;
  try {
    // 对密码进行哈希处理
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

// 商家登录 API
app.post('/api/businesses/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM businesses WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }
    const business = rows[0];
    // 比对密码
    const match = await bcrypt.compare(password, business.password);
    if (!match) {
      return res.status(401).json({ error: '无效的账号或密码' });
    }
    // 生成 JWT，有效期 1 小时
    const token = jwt.sign({ businessId: business.id }, JWT_SECRET, { expiresIn: '1h' });
        
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 认证中间件
function authenticateToken(req, res, next) {
	
  const authHeader = req.headers['authorization'];
  // 期望格式：Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];
  console.log("解析的商家ID:",token);
  if (!token) return res.status(401).json({ error: '缺少 token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token 无效或已过期' });
   console.log("解析的商家ID:", user.businessId); // 打印商家ID
    // 将商家 ID 存入请求对象，后续接口可以使用
    req.businessId = user.businessId;
    next();
  });
}

// 获取所有商家
app.get('/api/businesses', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM businesses');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 添加商家
app.post('/api/businesses', async (req, res) => {
    const { name, address, phone } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO businesses (name, address, phone) VALUES (?, ?, ?)',
            [name, address, phone]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 获取某个商家的菜单
// 获取当前商家的菜单（受保护接口）
app.get('/api/menu', authenticateToken, async (req, res) => {
	
  const businessId = req.businessId;  // 从 token 中获取商家 ID
  try {
    const [rows] = await db.execute('SELECT * FROM menu_items WHERE business_id = ?', [businessId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加菜单项
app.post('/api/menu', async (req, res) => {
    const { businessId, name, description, price, imageUrl } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO menu_items (business_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
            [businessId, name, description, price, imageUrl]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 创建订单
app.post('/api/order', async (req, res) => {
    const { businessId, customerName, totalPrice } = req.body;
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

// 获取某个商家的所有订单
app.get('/api/orders/:businessId', async (req, res) => {
    const { businessId } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM orders WHERE business_id = ?', [businessId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});