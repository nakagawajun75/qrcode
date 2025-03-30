// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 引入路由文件
const businessesRouter = require('./routes/businesses');
const menuRouter = require('./routes/menu');
const menuOrder = require('./routes/order');
const qrcode = require('./routes/qrcode');
const guestmenu = require('./routes/guestmenu');

// 挂载路由
app.use('/api/businesses', businessesRouter); // 商家相关接口
app.use('/api/menu', menuRouter);             // 菜单相关接口
app.use('/api/order', menuOrder);             // 订单相关接口
app.use('/api/getqrcode',qrcode);
app.use('/api/guestmenu',guestmenu);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});