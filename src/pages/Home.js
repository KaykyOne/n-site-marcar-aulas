import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';
import { HomePageModel } from '../pageModel/HomePageModel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/Button'; // Importe o componente Button

const HomeView = () => {
  const location = useLocation();
  const { nome, cpf, senha } = location.state || {}; // Recebe os dados
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  // Use useMemo para garantir que o HomePageModel não seja recriado em cada renderização
  const homePageModel = useMemo(() => new HomePageModel(), []);

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    toast[type](`${text1}: ${text2}`);
  };

  useEffect(() => {
    const verificarAulasPendentes = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

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

  const alterPage = async (page, nome = '', senha = '') => {
    setLoading(true);
    try {
      const test = await homePageModel.testUser(cpf);
      if (test) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(`/${page}`, { state: { cpf, nome, senha } });
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
      <Button onClick={() => alterPage('selecionarTipo', nome)} back="#0056b3" cor="#FFF">
        Marcar Aula
      </Button>
      <Button onClick={() => alterPage('listarAulas', nome)} back="#FFC601" cor="#333">
        Aulas
      </Button>
      <Button onClick={() => navigate('/')} back="#0074D9" cor="#FFF" styleAct={{ width: '40%' }}>
        Voltar
      </Button>
      <Button onClick={() => alterPage('perfil', nome, senha)} back="#0074D9" cor="#FFF" styleAct={{ width: '40%' }}>
        Alterar Senha
      </Button>
      <LoadingIndicator visible={loading} />
      {isModalVisible && (
        <div style={styles.modalContent}>
          <p>{modalMessage}</p>
          <Button onClick={() => setModalVisible(false)} back="#0056b3" cor="#FFF">
            Fechar
          </Button>
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
    color: '#003366', // Azul escuro para contraste
  },
  modalContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Sombra mais visível
    textAlign: 'center',
  },
};

export default HomeView;
