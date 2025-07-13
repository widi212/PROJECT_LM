// ✅ sheetsService.js
const { google } = require('googleapis');
const path = require('path');
const SHEET_ID = '1yIkCfRXYvHGjG_XDKfbKBwlzeRu9yblAU2j9t5fC774';
const SHEET_NAME = 'master';

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await auth.getClient();
}

async function getOrders() {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const range = `${SHEET_NAME}!A2:Q`; // tanpa header

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const values = response.data.values || [];
    console.log(`📥 Data diambil dari Sheet: ${values.length} baris`);
    return values;
  } catch (err) {
    console.error('❌ Error Google Sheets API:', err.message);
    throw err;
  }
}

async function updateRow(rowIndex, newRow) {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Pastikan panjangnya 17 kolom, isi kosong jika kurang
    const fullRow = Array(17).fill('').map((_, i) => newRow[i] || '');
    const range = `${SHEET_NAME}!A${rowIndex + 2}:Q${rowIndex + 2}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [fullRow],
      },
    });

    console.log(`✅ Baris ke-${rowIndex + 2} berhasil diupdate`);
  } catch (err) {
    console.error('❌ Gagal update baris:', err.message);
    throw err;
  }
}

module.exports = {
  getOrders,
  updateRow,
};