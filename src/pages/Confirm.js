import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import Modal from '../components/Modal';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/Button';
import ButtonBack from '../components/ButtonBack';
import ButtonHome from '../components/ButtonHome';

import useAulaStore from '../store/useAulaStore';
import useUserStore from '../store/useUserStore';
import { formatarDataParaExibir, formatarDataParaSalvar } from '../utils/dataFormat';
import { toast, ToastContainer } from 'react-toastify';
import useAula from '../hooks/useAula.js';

export default function Confirm() {

  const { InsertClass } = useAula();

  //#region Logica
  const { aula } = useAulaStore.getState();
  const { usuario } = useUserStore();
  const instrutor = aula.instrutor;
  const configs = usuario.configuracoes;
  const veiculo = aula.veiculo;
  const type = aula.tipo;
  const data = aula.data;
  const hora = aula.hora;

  const navigate = useNavigate();
  const [date] = useState(data);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = (message) => {
    setLoading(false);
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    toast.dismiss();  // Remove todos os toasts anteriores
    toast[type](`${text1}: ${text2}`);
  };

  // useEffect(() => {

  //   console.log((configs.find(item => item.chave === type)).valor);
  // }, []);

  const handleConfirm = async () => {
    // Validação dos campos obrigatórios
    if (!type || !veiculo || !hora || !date) {
      showToast('error', 'Campos obrigatórios', 'Preencha todos os campos antes de continuar!');
      return;
    }

    try {
      setLoading(true);
      let result;

      // Inserir a aula com base no tipo de usuário
      result = await InsertClass(
        instrutor.instrutor_id,
        usuario.usuario_id,
        date,
        type,
        hora,
        veiculo.veiculo_id,
        instrutor.autoescola_id,
        1,
        usuario.configuracoes
      );

      console.log(result);
      // Verificar se a inserção foi bem-sucedida
      if (result === "Aula criada com sucesso") {
        navigate('/Fim', { state: { usuario, configs, instrutor, type } });
      } else {
        toggleModal(result);
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Erro ao criar aula', error.message);
      navigate('/Erro', { state: { message: error.message } });
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  return (
    <div className="flex flex-col  px-4 py-6 bg-white shadow-md rounded-xl max-w-2xl mx-auto">
      <div className="flex justify-between items-center w-full mb-6">
        <ButtonBack event={() => navigate('/selecionarDataEHora')} />
        <ButtonHome event={() => navigate('/home')} />
      </div>

      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Confirme sua Aula</h1>

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

      <LoadingIndicator visible={loading} />

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
        <p className="text-gray-800">{modalMessage}</p>
        <Button onClick={() => setModalVisible(false)} className="mt-4">
          Ok
        </Button>
      </Modal>
    </div>

  );
};

