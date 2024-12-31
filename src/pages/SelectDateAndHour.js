import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';
import { SelectDateAndHourPageModel } from '../pageModel/SelectDateAndHourPageModel';
import Button from '../components/Button';

export default function SelectDateAndHour() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cpf, type, nameInstructor, nome, tipo = 'normal', codigo = 0 } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [horas, setHoras] = useState([]);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayName, setDayName] = useState('');
  const [hover, setHover] = useState(false);  // Adicionado para hover no botão

  const namesForDays = new Array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado");

  const selectDateAndHourPageModel = new SelectDateAndHourPageModel();

  // Função para buscar feriados
  useEffect(() => {
    // console.log(cpf);
    // console.log(type);
    // console.log(nameInstructor);
    // console.log(nome);
    // console.log(tipo);
    // console.log(codigo);
    async function fetchHolidays() {
      try {
        const response = await fetch('https://brasilapi.com.br/api/feriados/v1/2024');
        const data = await response.json();
        setHolidays(data.map(holiday => holiday.date));
      } catch (error) {
        toast.error('Erro ao buscar os feriados.');
      }
    }
    fetchHolidays();
  }, []);

  // Função para buscar horas disponíveis e horário atual
  useEffect(() => {
    async function fetchHoursAndCurrentTime() {
      setLoading(true);
      try {
        const { horasDisponiveis } = await selectDateAndHourPageModel.atualizarValores(
          nameInstructor,
          moment(date).format('YYYY-MM-DD')
        );
        const { currentTime, currentDate } = await selectDateAndHourPageModel.getCurrentTimeAndDateFromServer();
        setHoras(horasDisponiveis);
        setCurrentTime(currentTime);
        setCurrentDate(currentDate);
        let parsedDate = new Date(date);
        setDayName(namesForDays[parsedDate.getDay()]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHoursAndCurrentTime();
  }, [date]);

  const showToast = (type, text1, text2) => {
    toast.dismiss();  // Remove todos os toasts anteriores
    toast[type](`${text1}: ${text2}`);
  };

  const handleDateChange = (selectedDate) => {
    // console.log('Data Selecionada:', selectedDate);
    // console.log('Formato YYYY-MM-DD:', moment(selectedDate).format('YYYY-MM-DD'));
    // console.log('Horário Local:', selectedDate.toString());
    // console.log('Horário UTC:', selectedDate.toUTCString());
    if (moment(selectedDate) >= moment(currentDate) && moment(selectedDate) <= moment().add(7, 'days')) {
      setDate(selectedDate);
    }
  };

  const handleHourClick = (hora) => {
    if (hora < currentTime && moment(date).isSame(moment(), 'day')) {
      showToast('error', 'Hora anterior à atual.', 'Escolha outro horário!');
    } else {
      setSelectedHour(hora);
      setModalVisible(true);
    }
  };

  const confirmSelection = () => {
    setModalVisible(false);
    navigate('/confirmar', {
      state: {
        cpf,
        type,
        nameInstructor,
        data: date,
        hora: selectedHour,
        nome,
        tipo,
        codigo,
      }
    });
  };

  const handleBack = () => {
    if (codigo != 0 && tipo === 'adm') {
      navigate('/selectAluno', { state: { nome: nameInstructor, codigo: codigo } });
    } else {
      navigate('/selecionarInstrutor', { state: { cpf, type, nome } });
    }
  };


  return (
    <div style={styles.container}>
      <h3 style={styles.tipText}>Selecione a data para escolher um novo dia ou use as setas!</h3>
      <div style={styles.rowContainer}>
        <button
          style={hover ? { ...styles.buttonDate, ...styles.buttonDateHover } : styles.buttonDate}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => handleDateChange(moment(date).subtract(1, 'day').toDate())}
        >
          <AiOutlineLeft size={30} />
        </button>
        <div style={styles.containerCalendar}>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            minDate={new Date()}
            maxDate={moment().add(7, 'days').toDate()}
            dateFormat="dd/MM/yyyy"
          />
          <h4 style={styles.nameDayText}>{dayName}</h4>
        </div>
        <button
          style={hover ? { ...styles.buttonDate, ...styles.buttonDateHover } : styles.buttonDate}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => handleDateChange(moment(date).add(1, 'day').toDate())}
        >
          <AiOutlineRight size={30} />
        </button>
      </div>

      <LoadingIndicator visible={loading} />
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.listContainer}>
        {holidays.includes(moment(date).format('YYYY-MM-DD')) ||
          moment(date).day() === 0 ||
          moment(date).day() === 6 || horas.length === 0 ? (
          <p style={styles.messageText}>Dia não letivo ou sem horas disponíveis</p>
        ) : (
          horas.map((hora, index) => (
            <button key={index} style={styles.button} onClick={() => handleHourClick(hora)}>
              {hora}
            </button>
          ))
        )}
      </div>

      <Button onClick={handleBack} back="gray" cor="#FFF" styleAct={styles.buttonBack}>
        Voltar
      </Button>


      <Modal
        isOpen={modalVisible}
        onConfirm={confirmSelection}
        onCancel={() => setModalVisible(false)}
        customStyles={customStyles.modal} // Personalização do modal
      >
        <p>Você tem certeza que deseja selecionar essa data: {date.toLocaleDateString()} e {selectedHour}</p>
      </Modal>

      <ToastContainer />
    </div>
  );
}

// Estilos
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    minHeight: '100vh',
    overflowX: 'hidden', // Evita que o conteúdo saia da tela horizontalmente
  },
  nameDayText: {
    textAlign: 'center',
  },
  containerCalendar: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    cursor: 'pointer',
    padding: '10px 20px',
    backgroundColor: '#0056b3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    width: 'auto', // Ajuste de largura para não ocupar 100% da tela
    minWidth: '90px', // Define uma largura mínima para cada botão
    transition: 'all 0.3s ease',
  },
  buttonDate: {
    cursor: 'pointer',
    margin: '5px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'blue',  // Cor azul para combinar com o tema
    border: 'none',
    display: 'flex',
    alignItems: 'center',  // Centraliza o conteúdo do botão (ícone)
    justifyContent: 'center',  // Garante que o ícone fique no centro
  },
  buttonBack: {
    width: '40%',
    borderRadius: 8,
    marginTop: 20,
  },
  tipText: {
    textAlign: 'center',
    color: 'green',
    marginBottom: '20px'
  },
  errorText: {
    color: 'red'
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Faz com que os botões se ajustem em várias linhas se não houver espaço
    justifyContent: 'center', // Centraliza os botões
    alignItems: 'center', // Alinha os botões no centro verticalmente
    marginTop: '20px',
    gap: '10px', // Espaço entre os botões
    overflowX: 'auto', // Adiciona rolagem horizontal se necessário
    maxWidth: '100%', // Impede que ultrapassem o limite da tela
  },
};

// Estilos do modal
const customStyles = {
  modal: {
    content: {
      maxWidth: '400px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      backgroundColor: '#fff',
    },
  },
};

