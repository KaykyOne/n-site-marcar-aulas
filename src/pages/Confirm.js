import React, { useState } from 'react';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConfirmPageModel } from '../pageModel/ConfirmPageModel';
import LoadingIndicator from './LoadingIndicator';
import Modal from '../components/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/Button'; 
import { format } from 'date-fns';

const Confirm = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const { nameInstructor, data, cpf, type, hora, nome } = location.state || {};
  const [date] = useState(data);
  const [holidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const confirmPageModel = new ConfirmPageModel();

  const isHoliday = (date) => holidays.includes(moment(date).format('YYYY-MM-DD'));
  const isWeekend = (date) => moment(date).day() === 0 || moment(date).day() === 6;

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (isHoliday(date) || isWeekend(date)) {
        toggleModal('Data Indisponível: A data selecionada é um feriado, sábado ou domingo.');
        setLoading(false);
        return;
      }
      const formattedDate = format(date, 'yyyy-MM-dd');
      const user = await confirmPageModel.getUsuarioByCpf(cpf);
      const totalClassCount = await confirmPageModel.countClass(user.usuario_id, 'Pendente');
      const totalClassHoje = await confirmPageModel.countClassHoje(user.usuario_id, formattedDate);
      const config = await confirmPageModel.getConfig();
      const aulas = config['aulas'];
      const maximoNormalDia = config['maximoNormalDia'];
      const isOutraCidade = user.outra_cidade;

      if (totalClassCount >= aulas) {
        toggleModal('Número máximo de 4 aulas atingido. Conclua suas aulas para poder marcar mais!');
        return;
      }

      if ((isOutraCidade || type === 'D' || type === 'E') && totalClassHoje >= 2) {
        toggleModal('Você já atingiu o número máximo de 2 aulas para este dia.');
        return;
      } else if (totalClassHoje >= maximoNormalDia) {
        toggleModal('Você já marcou uma aula para este dia. Marque em outro dia.');
        return;
      }

      const result = await confirmPageModel.createClass(nameInstructor, date, cpf, type, hora);
      if (result) {
        navigate('/Fim', { state: { nameInstructor, data, cpf, type, hora, nome } });
      } else {
        navigate('/Erro', { state: { message: 'Não foi possível marcar a aula' } });
      }
    } catch (error) {
      navigate('/Erro', { state: { message: error.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Modal
        isOpen={isModalVisible}
        onConfirm={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <p>{modalMessage}</p>
      </Modal>

      <h1 style={styles.title}>Confirme sua Aula</h1>
      <h3 style={styles.detail}>Tipo da Aula: <span style={styles.detailValue}>{type}</span></h3>
      <h3 style={styles.detail}>Instrutor: <span style={styles.detailValue}>{nameInstructor}</span></h3>
      <h3 style={styles.detail}>Data Selecionada: <span style={styles.detailValue}>{moment(date).format('DD/MM/YYYY')}</span></h3>
      <h3 style={styles.detail}>Hora da Aula: <span style={styles.detailValue}>{hora}</span></h3>

      <LoadingIndicator visible={loading} />

      <Button
        style={styles.button}
        onClick={loading ? null : handleConfirm}
      >
        {loading ? 'Processando...' : 'Finalizar'}
      </Button>

      <Button
        styleAct={styles.buttonBack}
        onClick={() => navigate('/selecionarDataEHora', { state: { cpf, type, nameInstructor, nome} })}
        back="gray" cor="#FFF"
      >
        Voltar
      </Button>
      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Alinha o conteúdo verticalmente
    padding: 20,
    minHeight: '100vh', // Faz com que o contêiner ocupe toda a altura da tela
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    margin: '5px 0',
    color: '#555',
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: 'blue',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    cursor: 'pointer',
  },
  buttonBack: {
    backgroundColor: 'gray',
    marginTop: 20,
  }
};

export default Confirm;
