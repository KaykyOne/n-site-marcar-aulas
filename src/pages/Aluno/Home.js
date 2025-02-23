import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { LogModel } from '../../pageModel/LogModel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button'; // Importe o componente Button
import Modal from '../../components/Modal';
import ButtonBack from '../../components/ButtonBack';

export default function HomeView() {

  //#region Logica
  const location = useLocation();
  const { usuario, configs } = location.state || {}; // Recebe os dados
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  const [ horasAntes, setHorasAntes ] = useState('');

  // Use useMemo para garantir que o LogModel não seja recriado em cada renderização
  const Log = new LogModel();

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const verificarSenha = () => {
    if(usuario.senha == '123456'){
      setModalMessage("Percebemos que sua senha ainda é a padrão(123456), aconselhamos mudar para uma maior segurança!");
      setModalVisible(true); 
      return;
    }
  }

  const showToast = (type, text1, text2) => {
    toast.dismiss();
    toast[type](`${text1}: ${text2}`);
  };

  useEffect(() => {
    const verificarAulasPendentes = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      const horas = configs.find(item => item.chave === 'horasPraDesmarcarAulas');
      setHorasAntes(horas.valor);

      setLoading(true);
      try {
        await Log.checkAndUpdateLog(usuario.usuario_id);
      } catch (error) {
        showToast('error', 'Erro', error.message);
      } finally {
        setLoading(false);
      }
    };

    verificarSenha();

    verificarAulasPendentes();
  }, [usuario]);

  const alterPage = async (page, usuario) => {
    setLoading(true);
    try {
      if (usuario.atividade) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(`/${page}`, { state: { usuario, configs } });
      } else {
        toggleModal('Ops! Sua conta está bloqueada. Por favor, entre em contato com o nosso atendimento para resolver isso rapidinho!');
      }
    } catch (error) {
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  //#endregion

  return (
    <div className='container'>
      <ButtonBack event={() => navigate('/')}/>
      <h1 className='greatText'>Bem-vindo, {usuario.nome}!</h1>
      <Button onClick={() => alterPage('selecionarTipo', usuario)}>
        Marcar Aula
        <span className="material-icons">add</span>
      </Button>
      <Button onClick={() => alterPage('listarAulas', usuario)}>
        Aulas
        <span className="material-icons">directions_car</span>
      </Button>
      <Button onClick={() => alterPage('perfil', usuario)} back="#ffcc00" cor="black">
        Alterar Senha
        <span className="material-icons">key</span>
      </Button>
      <a
        className='txtTermo'
        onClick={() =>
          toggleModal(
            `Termos de Utilização\n\nO usuario é responsável por:\n- Marcar suas aulas no sistema.\n- Desmarcar as aulas com antecedência mínima de ${horasAntes} horas.\n- Comparecer no horário agendado. Ausências podem levar a penalidades.\n\nAo continuar utilizando o sistema, você aceita esses termos.`
          )
        }
      >
        Termos de Utilização
      </a>

      <LoadingIndicator visible={loading} />
      <Modal isOpen={isModalVisible}>
          <p>{modalMessage}</p>
          <Button back={'#A61723'} onClick={() => setModalVisible(false)}cor="#FFF">
            Fechar
          </Button>
      </Modal>
      <ToastContainer position="top-center" />
    </div>
  );
};