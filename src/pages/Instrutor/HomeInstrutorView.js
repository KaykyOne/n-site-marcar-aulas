import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../LoadingIndicator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button'; // Importe o componente Button

const HomeInstrutorView = () => {
  const location = useLocation();
  const { nome, codigo } = location.state || {}; 
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    toast.dismiss();
    toast[type](`${text1}: ${text2}`);
  };

  const alterPage = async (page, codigo = 0, nome = "", senha = "") => {
    setLoading(true);
    try {
        navigate(`/${page}`, { state: { codigo, nome, senha } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.welcomeText, fontSize: '1.5em' }}>Bem-vindo, {nome}!</h1>
      <Button onClick={() => alterPage('selectAluno', codigo , nome)} back="#0056b3" cor="#FFF">
        Marcar Aula
      </Button>
      <Button onClick={() => alterPage('listAulasInstrutor', codigo, nome)} back="#FFC601" cor="#333">
        Aulas
      </Button>
      <Button onClick={() => alterPage('listarAlunosInstrutor', codigo, nome)} back="gray" cor="white">
        Alunos
      </Button>
      <Button onClick={() => navigate('/')} back="#0074D9" cor="#FFF" styleAct={{ width: '40%' }}>
        Voltar
      </Button>
      <a
        style={styles.txtTermo}
        onClick={() =>
          toggleModal(
            'Termos de Utilização\n\nO aluno é responsável por:\n- Marcar suas aulas no sistema.\n- Desmarcar as aulas com antecedência mínima de 12 horas.\n- Comparecer no horário agendado. Ausências podem levar a penalidades.\n\nAo continuar utilizando o sistema, você aceita esses termos.'
          )
        }
      >
        Termos de Utilização — Clique aqui para conferir
      </a>

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
  txtTermo: {
    fontSize: '10px',
    margin: '20px',
    cursor: 'pointer',
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

export default HomeInstrutorView;
