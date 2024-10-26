import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';
import { HomePageModel } from '../pageModel/HomePageModel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeView = () => {
  const location = useLocation();
  const { nome, cpf } = location.state || {}; // Recebe os dados
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const homePageModel = new HomePageModel();
  const navigate = useNavigate();

  const hasVerified = useRef(false); // Para manter o estado entre renderizações

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    toast[type](`${text1}: ${text2}`);
  };

  useEffect(() => {
    const verificarAulasPendentes = async () => {
      if (hasVerified.current) return; // Impede múltiplas verificações
      hasVerified.current = true; // Marca como verificado

      setLoading(true);
      try {
        await homePageModel.marcarAulasConcluidas(cpf);
      } catch (error) {
        showToast('error', 'Erro', error.message);
      } finally {
        setLoading(false);
      }
    };

    verificarAulasPendentes();
  }, [cpf, homePageModel]);

  const alterPage = async (page) => {
    setLoading(true);
    try {
      const test = await homePageModel.testUser(cpf);
      if (test) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(`/${page}`, { state: { cpf } });
      } else {
        toggleModal('Você está bloqueado temporariamente, vá até o atendimento!');
      }
    } catch (error) {
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.welcomeText, fontSize: '1.5em' }}>Bem-vindo, {nome}!</h1>
      <button style={styles.fullWidthButton} onClick={() => alterPage('selecionarTipo')}>
        Marcar Aula
      </button>
      <button style={styles.fullWidthButton2} onClick={() => alterPage('listarAulas', cpf)}>
        Aulas
      </button>
      <button style={styles.buttonBack} onClick={() => navigate(-1)}>
        Voltar
      </button>
      {loading && <LoadingIndicator />}
      {isModalVisible && (
        <div style={styles.modalContent}>
          <p>{modalMessage}</p>
          <button onClick={() => setModalVisible(false)} style={styles.modalButton}>
            Fechar
          </button>
        </div>
      )}
      <ToastContainer position="top-center" />
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
    height: '100vh',
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: 'blue',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    padding: '15px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  fullWidthButton2: {
    width: '100%',
    backgroundColor: '#FFC601',
    borderRadius: '8px',
    color: 'black',
    fontWeight: 'bold',
    padding: '15px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  buttonBack: {
    width: '40%',
    backgroundColor: 'gray',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  modalContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'blue',
    color: '#fff',
    padding: '10px 20px',
    marginTop: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default HomeView;
