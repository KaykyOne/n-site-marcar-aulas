import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Loading } from '../NovusUI/All';
import useAulaStore from '../store/useAulaStore';
import useUserStore from '../store/useUserStore';
import { formatarDataParaExibir } from '../utils/dataFormat';
import { ToastContainer } from 'react-toastify';
import useAula from '../hooks/useAula.js';

export default function Confirm() {

  const { InsertClass, loading } = useAula();

  //#region Logica
  const { aula } = useAulaStore.getState();
  const { usuario } = useUserStore();
  const instrutor = aula.instrutor;
  const veiculo = aula.veiculo;
  const type = aula.tipo;
  const data = aula.data;
  const hora = aula.hora;

  const navigate = useNavigate();
  const [date] = useState(data);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };
  // useEffect(() => {

  //   console.log((configs.find(item => item.chave === type)).valor);
  // }, []);

  const handleConfirm = async () => {
    // Inserir a aula com base no tipo de usuário
    const aula = {
      instrutor_id: instrutor.instrutor_id,
      aluno_id: usuario.usuario_id,
      data: date,
      tipo: type,
      hora: hora,
      veiculo_id: veiculo.veiculo_id,
      autoescola_id: usuario.autoescola_id,
      marcada_por: 1,
      configuracoes: usuario.configuracoes
    };

    const result = await InsertClass(aula);
    if (result.success) {
      navigate('/fim');
    } else {
      toggleModal(result.error);
      return;
    }

  };

  const ModalContent = () => {
    return (
      <>
        <div className='flex gap-3 p-2 items-center'>
          <span className="material-icons !text-7xl text-red-600" >
            error
          </span >
          <div className='text-start'>
            <h1 className='text-2xl font-bold '>Aviso!</h1>
            <p className="text-gray-800">{modalMessage}</p>
          </div>
        </div>

        <Button onClick={() => setModalVisible(false)} className="mt-4" type={3}>
          Ok
        </Button>
      </>
    )
  }
  //#endregion

  return (
    <div className="flex flex-col  px-4 py-6 mx-auto w-full h-screen justify-center items-center p-2 max-w-[800px]">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Confirme sua Aula</h1>

      <div className="space-y-3 mb-6">
        <h3 className="text-lg text-gray-700">
          <span className="font-semibold">Tipo da Aula:</span> {type}
        </h3>
        <h3 className="text-lg text-gray-700">
          <span className="font-semibold">Instrutor:</span> {instrutor.nome_instrutor}
        </h3>
        <h3 className="text-lg text-gray-700">
          <span className="font-semibold">Data Selecionada:</span> {formatarDataParaExibir(date)}
        </h3>
        <h3 className="text-lg text-gray-700">
          <span className="font-semibold">Hora da Aula:</span> {hora}
        </h3>
      </div>

      <Loading visible={loading} />

      <Button
        onClick={loading ? null : handleConfirm}
        disabled={loading}
        className="mt-4"
      >
        {loading ? 'Processando...' : 'Finalizar'}
        
      </Button>

      <ToastContainer />

      <Modal
        isOpen={isModalVisible}
        onConfirm={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <ModalContent />
      </Modal>
    </div>

  );
};

