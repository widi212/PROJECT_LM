// ======================= server/index.js =======================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sheetsService = require('./sheetsService');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // <== Tambahkan ini

app.get('/api/orders', async (req, res) => {
  try {
    const rawQuery = req.query.awb || '';
    const awbList = rawQuery
      .split(/\r?\n/)
      .map(a => a.trim().toLowerCase())
      .filter(a => a);

    const data = await sheetsService.getOrders();
    console.log(`📄 Total baris dari Google Sheet: ${data.length}`);

    if (awbList.length > 0) {
      const filtered = data.filter((row) => {
        const awbCell = row[3]?.toString().trim().toLowerCase();
        return awbList.includes(awbCell);
      });
      return res.json({ success: true, data: filtered });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('❌ Gagal mengambil data:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal ambil data dari Google Sheet.' });
  }
});

app.post('/api/update-row', async (req, res) => {
  try {
    const { rowIndex, newRow } = req.body;
    await sheetsService.updateRow(rowIndex, newRow);
    res.json({ success: true, message: '✅ Baris berhasil diperbarui' });
  } catch (err) {
    console.error('❌ Gagal update baris:', err.message);
    res.status(500).json({ success: false, message: 'Gagal update baris' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
