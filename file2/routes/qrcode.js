const express = require('express');
const QRCode = require('qrcode');
const app = express();
const router = express.Router();

router.get('/', async (req, res) => {
  //const { businessId } = Number(req.businessId);
  //const url = `http://localhost:3000/guestmenu/${businessId}`; // 商家的菜单页面
  //const url = `http://localhost:5173/`; 
   const { businessId } = Number(req.businessId);
   const { tableId } = Number(req.tableId);
  const url = `http://localhost:5173/guestmenu/${businessId}&${tableId}`; 

  try {
    const qrCodeData = await QRCode.toDataURL(url); // 生成二维码
    res.send(`<img src="${qrCodeData}" alt="QR Code">`);
  } catch (err) {
    res.status(500).send('生成二维码失败');
  }
});

module.exports = router;