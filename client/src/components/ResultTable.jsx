import React, { useState } from 'react';

const ResultTable = ({ data, onSave }) => {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState([]);

  const handleEditClick = (row, index) => {
    setEditRowIndex(index);
    // Pastikan row memiliki panjang 17 kolom (columns.length)
    const fixedRow = Array.from({ length: columns.length }, (_, i) => row[i] || '');
    setEditedRow(fixedRow);
  };

  const handleInputChange = (value, colIndex) => {
    const updated = [...editedRow];
    updated[colIndex] = value;
    setEditedRow(updated);
  };

  const handleSaveClick = () => {
    onSave(editRowIndex, editedRow);
    setEditRowIndex(null);
  };

  const isEditing = (index) => editRowIndex === index;

  return (
    <div>
      <div style={styles.wrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const filledRow = Array.from({ length: columns.length }, (_, i) => row[i] || '');
              return (
                <tr
                  key={rowIndex}
                  style={{
                    ...styles.tr,
                    backgroundColor: rowIndex % 2 === 0 ? '#1e1e1e' : '#2a2a2a'
                  }}
                >
                  {filledRow.map((cell, colIndex) => (
                    <td key={colIndex} style={styles.td}>
                      {isEditing(rowIndex) && colIndex !== columns.length - 1 ? (
                        <input
                          value={editedRow[colIndex] || ''}
                          onChange={(e) => handleInputChange(e.target.value, colIndex)}
                          style={styles.input}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editRowIndex !== null && (
        <div style={styles.buttonWrapper}>
          <button onClick={handleSaveClick} style={styles.button}>
            💾 Simpan Perubahan
          </button>
        </div>
      )}

      <div style={styles.buttonWrapper}>
        {data.map((row, index) => (
          <button
            key={index}
            onClick={() => handleEditClick(row, index)}
            style={styles.editButton}
          >
            ✏️ Edit Baris {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const columns = [
  'Tanggal Input', 'Source', 'Agent', 'AWB', 'Courier', 'Seller Email',
  'Case Detail', 'Link Complaint', 'Instruksi', 'Done Feedback seller', 'Level',
  'Status FU', 'Tanggal FU', 'PIC', 'Feedback 3PL', 'Tanggal Feedback 3PL', 'Status Trakingan'
];

const styles = {
  wrapper: {
    maxHeight: '70vh',
    overflowY: 'auto',
    overflowX: 'auto',
    border: '1px solid #333',
    borderRadius: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#222',
    fontSize: '0.9rem',
    minWidth: '1000px',
    position: 'relative',
  },
  thead: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: '#333',
  },
  th: {
    padding: '12px',
    backgroundColor: '#333',
    color: '#ff4c60',
    textAlign: 'left',
    borderBottom: '2px solid #444',
  },
  td: {
    padding: '10px',
    color: '#f0f0f0',
    borderBottom: '1px solid #444',
    whiteSpace: 'nowrap',
  },
  tr: {
    transition: 'background 0.2s ease-in-out',
  },
  input: {
    width: '100%',
    padding: '4px',
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #666',
  },
  buttonWrapper: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  editButton: {
    margin: '4px',
    padding: '6px 12px',
    backgroundColor: '#ff4c60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default ResultTable;
