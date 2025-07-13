import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ResultTable from './components/ResultTable';

function App() {
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Tambahkan animasi spin hanya sekali saat komponen dimount
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }`;
    try {
      if (styleSheet && styleSheet.insertRule) {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      }
    } catch (e) {
      console.warn("❗Tidak bisa menyisipkan keyframes spin:", e.message);
    }
  }, []);

  const handleSearch = (awbList) => {
    setQuery(awbList);
    setHasSearched(true);
    setLoading(true);

    if (!awbList || awbList.length === 0) {
      setFiltered([]);
      setLoading(false);
      return;
    }

    axios.get('http://localhost:3001/api/orders')
      .then((res) => {
        const lowerAwbs = awbList.map(a => a.toLowerCase().trim());
        const filteredResults = res.data.data.filter(row =>
          row[3] && lowerAwbs.includes(row[3].toLowerCase())
        );
        setFiltered(filteredResults);
      })
      .catch((err) => {
        console.error('❌ Gagal mencari AWB:', err);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  };

  const handleSave = async (rowIndex, updatedRow) => {
  if (!updatedRow || updatedRow.length === 0) {
    alert('❗Tidak ada data yang disimpan.');
    return;
  }

  // Pastikan jumlah kolom 17 (kolom Status Trakingan diabaikan)
  const fixedRow = Array.from({ length: 17 }, (_, i) => updatedRow[i] || '');

  try {
    const res = await axios.post('http://localhost:3001/api/update-row', {
      rowIndex,
      newRow: fixedRow
    });

    if (res.data && res.data.success) {
      alert('✅ Data berhasil disimpan ke Google Sheets');
    } else {
      throw new Error('Gagal menyimpan');
    }
  } catch (err) {
    console.error('❌ Gagal simpan data:', err);
    alert('❌ Gagal menyimpan data');
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <h1 style={styles.header}>
          🚚 lincah-<span style={styles.highlight}>Tracking last mile</span>
        </h1>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div style={styles.loaderContainer}>
          <div className="spinner" style={styles.spinner}></div>
          <p style={{ marginTop: '1rem', color: '#ccc' }}>Sedang mencari...</p>
        </div>
      ) : hasSearched ? (
        filtered.length > 0 ? (
          <ResultTable data={filtered} onSave={handleSave} />
        ) : (
          <p style={{ color: '#ccc', marginTop: '1rem', textAlign: 'center' }}>
            ❗Data tidak ditemukan
          </p>
        )
      ) : null}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Segoe UI, sans-serif',
  },
  headerWrapper: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  highlight: {
    color: '#ff4c60',
  },
  loaderContainer: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  spinner: {
    border: '6px solid #444',
    borderTop: '6px solid #ff4c60',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: 'auto',
  },
};

export default App;
