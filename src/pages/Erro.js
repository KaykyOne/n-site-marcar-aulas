import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Erro() {

  //#region Logica
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = location.state || {}; // Obtem o parâmetro 'error' passado na navegação

  const handleFirstButton = () => {
    navigate('/');
  };

  //#endregion

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Erro!</h1>
      <p style={styles.title2}>{error}</p>

      <button style={styles.button} onClick={handleFirstButton}>
        Sair
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  title2: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    width: '80%',
    backgroundColor: 'red',
    borderRadius: '8px',
    padding: '15px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '10px 0',
    cursor: 'pointer',
    border: 'none',
  },
};