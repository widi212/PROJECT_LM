// ✅ sheetsService.js - FIXED agar tidak menambah kolom atau baris saat update
const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1Z9aBWkiLrHFtFBW4pJX8HjFyc4UcEDwH49XfJKMvyaM';
const SHEET_NAME = 'master';
const TOTAL_COLUMNS = 17; // Kolom A–Q

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await auth.getClient();
}

// Ambil data dari Google Sheets
async function getOrders() {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const range = `${SHEET_NAME}!A2:Q`; // A sampai Q (kolom 1–17)

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const values = response.data.values || [];

    // Tambahkan informasi index baris asli (untuk update ke baris yang sama nanti)
    const indexed = values.map((row, i) => {
      const filled = Array.from({ length: TOTAL_COLUMNS }, (_, c) => row[c] || '');
      filled.push(i); // Simpan index baris (0-based)
      return filled;
    });

    console.log(`📥 Total ${indexed.length} baris diambil dari sheet.`);
    return indexed;
  } catch (err) {
    console.error('❌ Gagal ambil data:', err.message);
    throw err;
  }
}

// Update data ke baris tertentu tanpa menambah baris atau kolom
async function updateRow(rowIndex, newRow) {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Pastikan hanya 17 kolom (A sampai Q)
    const fixedRow = Array.from({ length: TOTAL_COLUMNS }, (_, i) => newRow[i] || '');

    const range = `${SHEET_NAME}!A${rowIndex + 2}:Q${rowIndex + 2}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [fixedRow],
      },
    });

    console.log(`✅ Baris ${rowIndex + 2} berhasil diperbarui.`);
  } catch (err) {
    console.error('❌ Gagal update baris:', err.message);
    throw err;
  }
}

module.exports = {
  getOrders,
  updateRow,
};
