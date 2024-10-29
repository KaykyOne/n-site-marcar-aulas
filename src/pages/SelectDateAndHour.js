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

export default function SelectDateAndHour() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cpf, type, nameInstructor } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [horas, setHoras] = useState([]);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectDateAndHourPageModel = new SelectDateAndHourPageModel();

  // Função para buscar feriados
  useEffect(() => {
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHoursAndCurrentTime();
  }, [date]);

  const handleDateChange = (selectedDate) => {
    if (moment(selectedDate) >= moment(currentDate) && moment(selectedDate) <= moment().add(7, 'days')) {
      setDate(selectedDate);
    }
  };

  const handleHourClick = (hora) => {
    if (hora < currentTime && moment(date).isSame(moment(), 'day')) {
      toast.error('Hora anterior à atual.');
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
        hora: selectedHour
      }
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.tipText}>Selecione a data para escolher um novo dia ou use as setas!</h3>
      <div style={styles.rowContainer}>
        <button style={styles.buttonDate} onClick={() => handleDateChange(moment(date).subtract(1, 'day').toDate())}>
          <AiOutlineLeft size={30} />
        </button>
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          minDate={new Date()}
          maxDate={moment().add(7, 'days').toDate()}
          dateFormat="dd/MM/yyyy"
        />
        <button style={styles.buttonDate} onClick={() => handleDateChange(moment(date).add(1, 'day').toDate())}>
          <AiOutlineRight size={30} />
        </button>
      </div>

      <LoadingIndicator visible={loading} />
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.listContainer}>
        {holidays.includes(moment(date).format('YYYY-MM-DD')) ||
          moment(date).day() === 0 ||
          moment(date).day() === 6 ? (
          <p style={styles.messageText}>Dia não letivo</p>
        ) : (
          horas.map((hora, index) => (
            <button key={index} style={styles.button} onClick={() => handleHourClick(hora)}>
              {hora}
            </button>
          ))
        )}
      </div>

      <button style={styles.buttonBack} onClick={() => navigate('/selecionarInstrutor', { state: { cpf, type } })}>
        Voltar
      </button>

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
  },
  rowContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  button: { 
    cursor: 'pointer', 
    margin: '5px', 
    padding: '10px 20px', 
    backgroundColor: 'blue', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '5px' 
  },
  buttonDate: { 
    cursor: 'pointer', 
    margin: '5px', 
    padding: '10px 20px', 
    backgroundColor: 'transparent', 
    color: 'blue', 
    border: 'none', 
    borderRadius: '5px' 
  },
  buttonBack: { 
    cursor: 'pointer', 
    marginTop: '20px', 
    backgroundColor: 'gray', 
    padding: '10px', 
    color: '#fff', 
    borderRadius: '5px' 
  },
  tipText: { 
    textAlign: 'center', 
    color: 'green' 
  },
  errorText: { 
    color: 'red' 
  },
  listContainer: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    justifyContent: 'center' 
  },
};

const customStyles = {
  modal: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '400px',
      width: '90%',
    },
  },
};
