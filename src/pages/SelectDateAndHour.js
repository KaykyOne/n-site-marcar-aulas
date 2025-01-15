import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br'; // Para exibir os dias da semana e meses em português
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

  //#region Logica
  const location = useLocation();
  const navigate = useNavigate();
  const { cpf, type, nameInstructor, nome, tipo = 'normal', codigo = 0 } = location.state || {};
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [horas, setHoras] = useState([]);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [date, setDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [dayName, setDayName] = useState('');
  const [hover, setHover] = useState(false);

  const namesForDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const selectDateAndHourPageModel = new SelectDateAndHourPageModel();

  async function fetchInitialData() {
    try {
      const { currentTime, currentDate } = await selectDateAndHourPageModel.getCurrentTimeAndDateFromServer();
      setCurrentTime(moment(currentTime, 'HH:mm:ss'));
      setCurrentDate(moment(currentDate, 'YYYY-MM-DD'));

      // console.log("Data (formatada):", moment(currentDate).format('YYYY-MM-DD'));
      // console.log("Hora (formatada):", moment(currentTime, 'HH:mm:ss').format('HH:mm:ss'));

      if (currentDate && !date) {
        setDate(moment(currentDate, 'YYYY-MM-DD').toDate());
      }

      const response = await fetch('https://brasilapi.com.br/api/feriados/v1/2024');
      const data = await response.json();
      setHolidays(data.map(holiday => holiday.date));
    } catch (error) {
      toast.error('Erro ao buscar os dados iniciais.');
    } finally {
      setInitialLoading(false);
    }
  }

  async function fetchHours() {
    setLoading(true);
    try {
      const { horasDisponiveis } = await selectDateAndHourPageModel.atualizarValores(
        nameInstructor,
        moment(date).format('YYYY-MM-DD')
      );
  
      const dayOfWeek = moment(date).day(); // Obter o dia da semana (0 = Domingo, 1 = Segunda, ...)
  
      // Filtrar os horários: remover 7:00 se for segunda-feira
      const filteredHoras = horasDisponiveis.filter(hora => {
        if (dayOfWeek === 1 && hora === '07:00') { // Segunda-feira
          return false;
        }
        return true;
      });
  
      setHoras(filteredHoras); // Atualizar os horários disponíveis
      setDayName(namesForDays[dayOfWeek]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (date) fetchHours();
  }, [date]);

  const handleDateChange = (selectedDate) => {
    const selectedMoment = moment(selectedDate);
    if (selectedMoment.isSameOrAfter(moment(currentDate), 'day') && selectedMoment.isSameOrBefore(moment().add(7, 'days'), 'day')) {
      setDate(selectedMoment.toDate());
    } else {
      toast.error('Selecione uma data válida.');
    }
  };

  const handleHourClick = (hora) => {
    const selectedHourMoment = moment(hora, 'HH:mm:ss');
    if (selectedHourMoment.isBefore(currentTime) && moment(date).isSame(moment(), 'day')) {
      toast.error('Hora anterior à atual. Escolha outro horário!');
    } else {
      setSelectedHour(hora);
      setModalVisible(true);
    }
  };

  const confirmSelection = () => {
    setModalVisible(false);
    navigate('/confirmar', {
      state: { cpf, type, nameInstructor, data: date, hora: selectedHour, nome, tipo, codigo },
    });
  };

  const handleBack = () => {
    if (codigo !== 0 && tipo === 'adm') {
      navigate('/selectAluno', { state: { nome: nameInstructor, codigo } });
    } else {
      navigate('/selecionarInstrutor', { state: { cpf, type, nome } });
    }
  };

  if (initialLoading) {
    return <LoadingIndicator visible />;
  }

  //#endregion

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
            minDate={moment(currentDate).toDate()}
            maxDate={moment(currentDate).add(7, 'days').toDate()}
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
        moment(date).day() === 6 ||
        horas.length === 0 ? (
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
        customStyles={customStyles.modal}
      >
        <p>Você tem certeza que deseja selecionar essa data: {moment(date).format('DD/MM/YYYY')} e {selectedHour}</p>
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