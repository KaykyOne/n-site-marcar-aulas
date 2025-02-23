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
import LoadingIndicator from '../components/LoadingIndicator';
import { SelectDateAndHourPageModel } from '../pageModel/SelectDateAndHourPageModel';
import Button from '../components/Button';
import ButtonBack from '../components/ButtonBack';
import ButtonHome from '../components/ButtonHome';
import Count from '../components/Count';

export default function SelectDateAndHour() {

  //#region Logica
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, configs, instrutor,  type,  tipo = 'normal', aluno = null} = location.state || {};
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
        instrutor,
        moment(date).format('YYYY-MM-DD')
      );
      
      const dayOfWeek = moment(date).day(); // Obter o dia da semana (0 = Domingo, 1 = Segunda, ...)

      // Removendo a filtragem do horário 07:00 na segunda-feira
      setHoras(horasDisponiveis);
      setDayName(namesForDays[dayOfWeek]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log(configs);
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
      state: { usuario, configs, instrutor,  type, tipo, aluno, data: date, hora: selectedHour},
    });
  };

  const handleBack = () => {
    if (tipo === 'adm') {
      navigate('/selectAluno', { state: { usuario, configs, instrutor } });
    } else {
      navigate('/selecionarInstrutor', { state: { usuario, configs, type } });
    }
  };

  const handleHome = () => {
    if ( tipo === 'adm') {
      navigate('/homeinstrutor', { state: { usuario, configs, instrutor } });
    } else {
      navigate('/home', { state: { usuario, configs } });
    }
  };

  if (initialLoading) {
    return <LoadingIndicator visible />;
  }

  //#endregion

  return (
    <div className='container'>
      <div className='button-container'>
        <ButtonBack event={handleBack} />
        <ButtonHome event={handleHome} />
      </div>

      <h3 className='greatText'>Selecione a data e hora da sua aula!</h3>
      <div className='container-flat'>
        <AiOutlineLeft size={30} onClick={() => handleDateChange(moment(date).subtract(1, 'day').toDate())} />
        <div className='container-vertical'>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            minDate={moment(currentDate).toDate()}
            maxDate={moment(currentDate).add(7, 'days').toDate()}
            dateFormat="dd/MM/yyyy"
            className="custom-datepicker-input"
          />
          <h4 className='greatText'>{dayName}</h4>
        </div>
        <AiOutlineRight size={30} onClick={() => handleDateChange(moment(date).add(1, 'day').toDate())} />
      </div>

      <LoadingIndicator visible={loading} />
      {error && <p className='text-error'>{error}</p>}

      <div className='listContainer '>
        {holidays.includes(moment(date).format('YYYY-MM-DD')) ||
          moment(date).day() === 0 ||
          moment(date).day() === 6 ||
          horas.length === 0 ? (
          <div className='container-error'>
            <p className='text-error'>
              {'Nenhum horário disponivel essa data!'}
            </p>
          </div>
        ) : (
          horas.map((hora, index) => (
            <Button back={'#030a90'} key={index} onClick={() => handleHourClick(hora)}>
              {hora}
            </Button>
          ))
        )}
      </div>

      <Modal
        isOpen={modalVisible}
      >
        <p>Você tem certeza que deseja selecionar essa data: <strong>{moment(date).format('DD/MM/YYYY')} </strong>  ás <strong>{selectedHour}</strong> </p>
        <Button back={'#2A8C68'} onClick={confirmSelection}>Sim</Button>
        <Button back={'#A61723'} onClick={() => setModalVisible(false)}>Não</Button>
      </Modal>
      <Count num={3} />
      <ToastContainer />
    </div>
  );
}
