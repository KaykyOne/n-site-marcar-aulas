import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button'; // Importe o componente Button
import useUserStore from '../../store/useUserStore';
import useInstrutorStore from '../../store/useInstrutorStore';

export default function HomeInstrutorView() {

  const { instrutor } = useInstrutorStore();
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const alterPage = async (page) => {
    setLoading(true);
    try {
      if (instrutor.atividade_instrutor === true) {
        navigate(`/${page}`);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(instrutor);
  }, [])

  //#endregion

  return (
    <div className='flex flex-col gap-3 min-w-[200px]'>
      <h1 className='font-bold text-2xl capitalize'>Bem-vindo, {instrutor.nome_instrutor}!</h1>  
      <Button onClick={() => alterPage('listAulasInstrutor')} type={1}>
        Aulas
        <span className="material-icons">directions_car</span>
      </Button>
      <Button onClick={() => alterPage('listarAlunosInstrutor')} type={1}>
        Alunos
        <span className="material-icons">groups</span>
      </Button>
      <Button onClick={() => navigate(`/perfil`, { state: { tipo: 1 } })} type={1}>
        Alterar Senha
        <span className="material-icons">key</span>
      </Button>
      <Button onClick={() => navigate('/')} type={2}>
        Sair
        <span className="material-icons">logout</span>
      </Button>

      <LoadingIndicator visible={loading} />
      {isModalVisible && (
        <div className='flex flex-col'>
          <p>{modalMessage}</p>
          <Button onClick={() => setModalVisible(false)} type={1}>
            Fechar
          </Button>
        </div>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};