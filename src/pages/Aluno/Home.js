import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button'; 

import Modal from '../../components/Modal';
import ButtonBack from '../../components/ButtonBack';
import useUserStore from '../../store/useUserStore';
import modalIcon from '../../imgs/icons/undraw_notify_rnwe.svg'

export default function HomeView() {
  const { usuario } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [ horasAntes, setHorasAntes ] = useState('');

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const verificarSenha = () => {
    if(usuario.senha === '123456'){
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
    let horas = usuario.configuracoes.find(config => config.chave === "horasPraDesmarcarAulas");
    setHorasAntes(horas.valor)
    verificarSenha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alterPage = (page) => {
    setLoading(true);
    try {
      if (usuario.atividade) {
        navigate(`/${page}`);
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
    <div className='flex flex-col md:w-[600px] p-4 gap-4'>
      <ButtonBack event={() => navigate("/")}/>
      <h1 className='font-bold text-2xl capitalize'>Bem-vindo, {usuario.nome}!</h1>
      <Button onClick={() => alterPage('selecionarTipo')}>
        Marcar Aulas
        <span className="material-icons">add</span>
      </Button>
      <Button onClick={() => alterPage('listarAulas')}>
        Listar Aulas
        <span className="material-icons">directions_car</span>
      </Button>
      <Button onClick={() => navigate(`/perfil`, { state: { tipo: 2 } })} type={2}>
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
          <img alt='imageModal' className='image' src={modalIcon}/>
          <p>{modalMessage}</p>
          <Button back={'#4B003B'} onClick={() => setModalVisible(false)}cor="#FFF">
            Fechar
          </Button>
      </Modal>
      
      <ToastContainer position="top-center" />
    </div>
  );
};