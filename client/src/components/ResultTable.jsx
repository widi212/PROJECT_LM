// ✅ ResultTable.jsx
import React, { useState } from 'react';

const ResultTable = ({ data, onSave }) => {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState([]);

  const handleEditClick = (row, index) => {
    setEditRowIndex(index);
    const fixedRow = Array.from({ length: columns.length }, (_, i) => row[i] || '');
    const sheetRowIndex = row[17] ?? index; // baris asli di spreadsheet
    setEditedRow([...fixedRow, sheetRowIndex]);
  };

  const handleInputChange = (value, colIndex) => {
    const updated = [...editedRow];
    updated[colIndex] = value;
    setEditedRow(updated);
  };

  const handleSaveClick = () => {
    const sheetRowIndex = editedRow[17];
    onSave(sheetRowIndex, editedRow.slice(0, 17));
    setEditRowIndex(null);
  };

  const isEditing = (index) => editRowIndex === index;

  const getInputElement = (colName, colIndex) => {
    const value = editedRow[colIndex] || '';

    if (colName === 'Instruksi') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e.target.value, colIndex)} style={styles.input}>
          <option value="">-- Pilih --</option>
          {instruksiOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (colName === 'Level') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e.target.value, colIndex)} style={styles.input}>
          <option value="">-- Pilih --</option>
          {levelOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (colName === 'Status FU') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e.target.value, colIndex)} style={styles.input}>
          <option value="">-- Pilih --</option>
          {statusFUOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (colName === 'PIC') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e.target.value, colIndex)} style={styles.input}>
          <option value="">-- Pilih --</option>
          {picOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (["Tanggal Input", "Tanggal Feedback 3PL", "Tanggal FU"].includes(colName)) {
      return <input type="date" value={value} onChange={(e) => handleInputChange(e.target.value, colIndex)} style={styles.input} />;
    }

    return <input value={value} onChange={(e) => handleInputChange(e.target.value, colIndex)} style={styles.input} />;
  };

  return (
    <div>
      <div style={styles.wrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={{ ...styles.th, ...styles.narrowColumn }}>Aksi</th>
              {columns.map((col, i) => (
                <th key={i} style={{ ...styles.th, ...styles.narrowColumn }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const filledRow = Array.from({ length: columns.length }, (_, i) => row[i] || '');
              return (
                <tr key={rowIndex} style={{ ...styles.tr, backgroundColor: rowIndex % 2 === 0 ? '#1e1e1e' : '#2a2a2a' }}>
                  <td style={{ ...styles.td, ...styles.narrowColumn }}>
                    <button onClick={() => handleEditClick(row, rowIndex)} style={styles.editButton}>✏️</button>
                  </td>
                  {filledRow.map((cell, colIndex) => {
                    const colName = columns[colIndex];
                    return (
                      <td key={colIndex} style={{ ...styles.td, ...styles.narrowColumn }} title={cell}>
                        {isEditing(rowIndex) && colIndex !== columns.length - 1? getInputElement(colName, colIndex) : colName === 'Link Complaint' && cell? (<a href={cell} target="_blank" rel="noopener noreferrer" style={styles.link}>📎 Lihat Gambar</a> ): cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editRowIndex !== null && (
        <div style={styles.buttonWrapper}>
          <button onClick={handleSaveClick} style={styles.button}>💾 Simpan Perubahan</button>
        </div>
      )}
    </div>
  );
};

const columns = [
  'Tanggal Input', 'Source', 'Agent', 'AWB', 'Courier', 'Seller Email',
  'Case Detail', 'Link Complaint', 'Instruksi', 'Done Feedback seller', 'Level',
  'Status FU', 'Tanggal FU', 'PIC', 'Feedback 3PL', 'Tanggal Feedback 3PL', 'Status Trakingan'
];

const instruksiOptions = [
  'Instruksi - Antar ulang', 'Instruksi - Ambil sendiri', 'Instruksi - Hold',
  'Instruksi - Return', 'Instruksi - Maksimalkan pengiriman', 'Instruksi - Batal kirim',
  'Perubahan Data - Nominal COD', 'Perubahan Data - Metode bayar COD ke Reguler',
  'Perubahan Data - Alamat', 'Perubahan Data - Kontak penerima',
  'Validasi Pengiriman - Bukti pengiriman / POD', 'Validasi Pengiriman - Salah Sortir',
  'Validasi Pengiriman - Paket salah / tertukar / tidak sesuai',
  'Validasi Pengiriman - Penerima merasa belum terima', 'Update status kiriman - Delivered',
  'Fraud Report - Kurir', 'Informasi - Rekening Gerai',
  'Validasi Sistem - Penyesuaian berat / volume / ongkos kirim',
  'Validasi Pengiriman - Paket Rusak', 'Validasi Pengiriman - Paket RTS belum terima',
  'Validasi Pengiriman - Investigasi'
];

const levelOptions = [
  'New Case', 'Reminder 1', 'Reminder 2', 'Reminder 3', 'Eskalasi 2 up PIC'
];

const statusFUOptions = [
  'DONE FU', 'DELIVERED', 'JALAN RETURN', 'DECLARE CLAIM',
  'FEEDBACK TERLAMPIR', 'RTS', 'DIBATALKAN'
];

const picOptions = ['elis pic', 'rizal pic', 'ericha', 'rizky', 'ibnu', 'primus', 'nano'];

const styles = {
  wrapper: { maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto', border: '1px solid #333', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#222', fontSize: '0.9rem', minWidth: '1000px' },
  thead: { position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#333' },
  th: { padding: '10px', backgroundColor: '#333', color: '#ff4c60', textAlign: 'left', borderBottom: '2px solid #444', whiteSpace: 'nowrap' },
  td: { padding: '8px', color: '#f0f0f0', borderBottom: '1px solid #444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tr: { transition: 'background 0.2s ease-in-out' },
  input: { width: '100%', padding: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #666', borderRadius: '4px' },
  narrowColumn: { maxWidth: '140px', width: '140px' },
  buttonWrapper: { textAlign: 'center', marginTop: '1rem' },
  button: { padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  editButton: { padding: '6px 10px', backgroundColor: '#ff4c60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default ResultTable;
