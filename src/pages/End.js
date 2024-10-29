import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EndView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cpf } = location.state || {}; // Obtém o parâmetro 'cpf' da navegação anterior

  const handleSecondButton = () => {
    navigate('/');
  };

  const secondClassButton = () => {
    navigate('/selecionarTipo', { state: { cpf } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sucesso!</h1>

      <button style={styles.button} onClick={handleSecondButton}>
        Início
      </button>
      <button style={styles.button2} onClick={secondClassButton}>
        Marcar Outra Aula
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
  button: {
    width: '80%',
    backgroundColor: 'green',
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
  button2: {
    width: '80%',
    backgroundColor: 'blue',
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

export default EndView;
