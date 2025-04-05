import React, { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import Button from '../components/Button';
import ButtonBack from '../components/ButtonBack';
import ButtonHome from '../components/ButtonHome';
import Count from '../components/Count';

import { PegarData } from '../controller/ControllerDataEHora';
import { SearchAndFilterHour } from '../controller/ControllerAulas';
import useAulaStore from '../store/useAulaStore';
import useUserStore from '../store/useUserStore';
import { format, isValid, isBefore, addDays, subDays, isAfter } from 'date-fns';
import { formatarDataParaSalvar } from '../utils/dataFormat';

export default function SelectDateAndHour() {

  const navigate = useNavigate();
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

  const { updateAula, aula } = useAulaStore.getState();
  const { usuario } = useUserStore();
  const instrutor = aula.instrutor.instrutor_id;
  const veiculo = aula.veiculo.veiculo_id;
  const tipo = usuario.tipo_usuario === "aluno" ? "normal" : "adm";

  const namesForDays = ["Erro", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

  const fetchInitialData = async () => {
    try {
      const now = await PegarData(); // Obtendo data e hora atual do dispositivo
      const dataAtual = format(now, 'yyyy-MM-dd'); // Formatar para 'yyyy-MM-dd'
      const horaAtual = format(now, 'HH:mm'); // Formatar para 'HH:mm'

      setCurrentDate(dataAtual);
      setCurrentTime(horaAtual);
      setDate(now);
      // console.log(horaAtual);
      // console.log(dataAtual);


      // Feriados (opcional, ainda pode continuar buscando de uma API se desejar)
      const response = await fetch('https://brasilapi.com.br/api/feriados/v1/2024');
      const data = await response.json();
      setHolidays(data.map(holiday => holiday.date));
    } catch (error) {
      toast.error('Erro ao buscar os dados iniciais.');
      console.error(error);
    } finally {
      setInitialLoading(false);
    }
  }

  async function fetchHours() {
    setLoading(true);
    try {
      const result = await SearchAndFilterHour(
        instrutor,
        veiculo,
        date // Usando date-fns para formatar a data
      );

      const dayOfWeek = format(date, 'i'); // Retorna o índice do dia da semana (1 = Segunda-feira, 2 = Terça-feira, ...)
      // console.log(dayOfWeek);
      setHoras(result);
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
    if (!date) {
      setDate(selectedDate);
      return;
    }
    if (isAfter(selectedDate, addDays(currentDate, 7))) {
      toast.error('Data muito longe!');
      return;
    }
  
    setDate(selectedDate);
  };
  

  const handleHourClick = (hora) => {
    const selectedHourParsed = new Date(`1970-01-01T${hora}:00`); // Parse a hora
    if (isBefore(selectedHourParsed, new Date(currentTime)) && isBefore(date, new Date())) {
      toast.error('Hora anterior à atual. Escolha outro horário!');
    } else {
      setSelectedHour(hora);
      setModalVisible(true);
    }
  };

  const confirmSelection = () => {
    setModalVisible(false);
    updateAula('hora', selectedHour);
    const dataFormatada = formatarDataParaSalvar(date)
    updateAula('data', dataFormatada);
    console.log(selectedHour, " asdasdda ", dataFormatada)
    navigate('/confirmar');
  };

  const handleBack = () => {
    navigate("/selecionarVeiculo")
  };

  const handleHome = () => {
    if (tipo === 'adm') {
      navigate('/homeinstrutor');
    } else {
      navigate('/home');
    }
  };

  if (initialLoading) {
    return <LoadingIndicator visible />;
  }

  return (
    <div className='container'>
      <div className='button-container'>
        <ButtonBack event={handleBack} />
        <ButtonHome event={handleHome} />
      </div>

      <h3 className='greatText'>Selecione a data e hora da sua aula!</h3>
      <div className='container-flat'>
        <AiOutlineLeft size={30} onClick={() => handleDateChange(subDays(date, 1))} />
        <div className='container-vertical'>
          <DatePicker
            selected={date}  // Garantindo que o valor de `date` seja um objeto `Date`
            onChange={handleDateChange}
            minDate={new Date(currentDate)} // Usando a data atual
            maxDate={addDays(new Date(currentDate), 7)} // Limite para 7 dias à frente
            dateFormat="dd/MM/yyyy"
            className="custom-datepicker-input"
          />
          <h4 className='greatText'>{dayName}</h4>
        </div>
        <AiOutlineRight size={30} onClick={() => handleDateChange(addDays(date, 1))} />
      </div>

      <LoadingIndicator visible={loading} />
      {error && <p className='text-error'>{error}</p>}


      <div className='listContainer'>
        {holidays.includes(format(date, 'yyyy-MM-dd')) ||
          format(date, 'i') == 7 ||
          format(date, 'i') == 6 ? (
          <div className='container-error'>
            <p className='text-error'>
              {'Nenhum horário disponível essa data!'}
            </p>
          </div>
        ) : horas.length > 0 ? (
          horas.map((hora, index) => (
            <Button back={'#4B003B'} key={index} onClick={() => handleHourClick(hora)}>
              {hora}
            </Button>
          ))
        ) : (
          <div className='container-error'>
            <p className='text-error'>
              {'Nenhum horário disponível essa data!'}
            </p>
          </div>
        )}
      </div>


      <Modal isOpen={modalVisible}>
        <p>Você tem certeza que deseja selecionar essa data: <strong>{format(date, 'dd/MM/yyyy')} </strong>  ás <strong>{selectedHour}</strong> </p>
        <Button back={'#2A8C68'} onClick={confirmSelection}>Sim</Button>
        <Button back={'#A61723'} onClick={() => setModalVisible(false)}>Não</Button>
      </Modal>
      <Count num={3} />
      <ToastContainer />
    </div>
  );
}
