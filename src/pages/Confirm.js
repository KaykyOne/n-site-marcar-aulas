import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClassModel } from '../pageModel/ClassModel.js';
import LoadingIndicator from '../components/LoadingIndicator';
import Modal from '../components/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/Button';
import { format } from 'date-fns';
import ButtonBack from '../components/ButtonBack';
import ButtonHome from '../components/ButtonHome';

export default function Confirm() {

  //#region Logica
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, configs, instrutor, type, tipo, aluno, data, hora } = location.state || {};
  const [date] = useState(data);
  const [holidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const classModel = new ClassModel();

  const isHoliday = (date) => holidays.includes(moment(date).format('YYYY-MM-DD'));
  const isWeekend = (date) => moment(date).day() === 0 || moment(date).day() === 6;

  const toggleModal = (message) => {
    setLoading(false);
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    console.log((configs.find(item => item.chave === type)).valor);
  }, []);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Formatted Date:', formattedDate);

      if (isHoliday(date) || isWeekend(date) || formattedDate == '2025-01-01') {
        toggleModal('Data Indisponível: A data selecionada é um feriado, sábado ou domingo.');
        setLoading(false);
        return;
      }

      let user;
      if (tipo === "adm") {
        user = aluno;
      } else {
        user = usuario;
      }
      console.log('User:', user);

      const totalClassCount = await classModel.countClass(user.usuario_id, 'Pendente');
      console.log('Total Classes Pending:', totalClassCount);

      const totalClassHoje = await classModel.countClass(user.usuario_id, null, formattedDate);
      console.log('Total Classes Today:', totalClassHoje);

      let aulas = (configs.find(item => item.chave === 'aulas')).valor;
      const maximoNormalDia = (configs.find(item => item.chave === 'maximoNormalDia')).valor;
      const isOutraCidade = user.outra_cidade;

      console.log('Aulas:', aulas);
      console.log('Maximo Normal Dia:', maximoNormalDia);
      console.log('Is Outra Cidade:', isOutraCidade);

      const numeroMaximoDeAulasDeUmTipoDeVeiculo = (configs.find(item => item.chave === type)).valor;
      const aulasDoTipoJaMarcadas = await classModel.countClassByDateAndHoour(type, hora, formattedDate)
      console.log('Max aulas tipo de veículo:', numeroMaximoDeAulasDeUmTipoDeVeiculo);
      console.log('Max aulas tipo de veículo já marcadas :', aulasDoTipoJaMarcadas);

      if (aulasDoTipoJaMarcadas >= numeroMaximoDeAulasDeUmTipoDeVeiculo) {
        toggleModal(`O número máximo de aulas do tipo '${type}' já foi atingido neste horário. Por favor, escolha outro horário!`);
        return;
      }

      if (tipo === 'adm') {
        aulas = aulas + 2;
      }

      console.log('Aulas após ajuste para admin:', aulas);

      if (totalClassCount >= aulas) {
        toggleModal('Número máximo de aulas atingido. Conclua suas aulas para poder marcar mais!');
        return;
      }

      if (tipo === 'adm') {
        if (totalClassHoje >= 2) {
          toggleModal('Aluno atingiu o máximo de 2 aulas nesse dia!');
          return;
        }
      } else if ((isOutraCidade || type === 'D' || type === 'E') && totalClassHoje >= 2) {
        toggleModal('Você já atingiu o número máximo de aulas para este dia.');
        return;
      } else if (!isOutraCidade && type !== 'D' && type !== 'E' && totalClassHoje >= maximoNormalDia) {
        toggleModal('Você já atingiu o número máximo de aulas para este dia.');
        return;
      }

      let result;

      if (tipo === 'adm') {
        result = await classModel.insertClass(instrutor, aluno, date, type, hora);
      } else {
        result = await classModel.insertClass(instrutor, usuario, date, type, hora);
      }

      console.log('Result da inserção da aula:', result);

      if (result) {
        if (tipo === 'adm') {
          navigate('/Fim', { state: { usuario, configs, instrutor, tipo } });
        } else {
          navigate('/Fim', { state: { usuario, configs, instrutor, tipo } });
        }
      } else {
        navigate('/Erro', { state: { message: 'Não foi possível marcar a aula' } });
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/Erro', { state: { message: error.message } });
    } finally {
      setLoading(false);
    }
  };


  //#endregion

  return (
    <div className='container'  >
      <div className='button-container'>
        <ButtonBack event={() => navigate('/selecionarDataEHora', { state: { usuario, instrutor, configs,  type,  tipo, aluno } })} />
        <ButtonHome event={() => navigate('/home', { state: { usuario, configs } })} />
      </div>

      <h1>Confirme sua Aula</h1>
      <h3 className='greatText'>Tipo da Aula: <span>{type}</span></h3>
      <h3 className='greatText'>Instrutor: <span>{instrutor.nome_instrutor}</span></h3>
      <h3 className='greatText'>Data Selecionada: <span>{moment(date).format('DD/MM/YYYY')}</span></h3>
      <h3 className='greatText'>Hora da Aula: <span>{hora}</span></h3>

      <LoadingIndicator visible={loading} />

      <Button
        onClick={loading ? null : handleConfirm}
        disabled={loading}
      >
        {loading ? 'Processando...' : 'Finalizar'}
      </Button>
      <ToastContainer />

      <Modal
        isOpen={isModalVisible}
        onConfirm={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <p>{modalMessage}</p>
        <Button onClick={() => setModalVisible(false)}>
          Ok
        </Button>
      </Modal>
    </div>
  );
};

