import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const awbList = query
      .split("\n") // hanya pisahkan berdasarkan baris
      .map(item => item.trim())
      .filter(item => item.length > 0);

    onSearch(awbList);
  };

  return (
    <div style={styles.container}>
      <textarea
        placeholder="🔍 Masukkan beberapa AWB (1 per baris)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
        style={styles.textarea}
      />
      <button onClick={handleSearch} style={styles.button}>
        Cari
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    marginBottom: '1.5rem',
  },
  textarea: {
    width: '100%',
    height: '120px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2e2e2e',
    color: 'white',
    fontSize: '1rem',
    padding: '10px',
    resize: 'none',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#ff4c60',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
  },
  link: {
  color: '#4fc3f7',
  textDecoration: 'underline',
  cursor: 'pointer'}

};

export default SearchBar;
