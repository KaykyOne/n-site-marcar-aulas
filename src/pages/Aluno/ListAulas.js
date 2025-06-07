import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../components/Modal';
import ButtonBack from '../../components/ButtonBack';
import Button from '../../components/Button';
import RenderAula from '../../components/RenderAula.js';

import useUserStore from '../../store/useUserStore.js';
import useAula from '../../hooks/useAula.js'
import { ToastContainer } from 'react-toastify';

export default function ListAulas() {
  const { usuario } = useUserStore();
  const { SearchAulas, loading, error, DeleteAula } = useAula();

  //#region Logica
  const [aulas, setAulas] = useState([]);

  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const fetchAulas = useCallback(async () => {
    const data = await SearchAulas(usuario.usuario_id);
    setAulas(data || []);
  }, [usuario.usuario_id]);

  useEffect(() => {
    if (usuario) fetchAulas();
  }, [usuario, fetchAulas]);

  const handleAction = async (acao, item) => {
    if (acao === "Excluir") {
      setSelectedAula(item);
      setModalAction('Excluir');
      setModalVisible(true);
      await fetchAulas();
    }
  };

  const confirmAction = async () => {
    const horaPraPoderExcluir = usuario.configuracoes.find(item => item.chave === 'horasPraDesmarcarAulas');

    let res = await DeleteAula(selectedAula, horaPraPoderExcluir);
    if (res) {
      fetchAulas();
      setModalVisible(false);
      setSelectedAula(null);
    }
  };

  const renderAulaItem = (item) => (
    <RenderAula item={item} key={item.aula_id} tipo={2} handleAction={handleAction} />
  );

  //#endregion
  return (
    <div className='flex flex-col w-screen h-screen mx-auto px-4 justify-center items-center'>
      <h1 className='font-bold text-2xl mb-2'>Aulas</h1>

      <div className='w-full mt-3 h-[60vh] overflow-y-auto rounded-2xl border max-w-[800px] max-h-[500px]'>
        {loading && <LoadingIndicator />}
        {error || aulas.length === 0 ? (
          <div className='p-5'>
            <p className='text-error'>
              {error ? `Erro: ${error}` : 'Nenhuma aula marcada!'}
            </p>
          </div>
        ) : (
          <div className='p-4'>{aulas.map(renderAulaItem)}</div>
        )}
      </div>

      <Modal isOpen={modalVisible}>
        <p className='mb-4'>
          {modalAction === 'Excluir'
            ? `Deseja excluir a aula ${selectedAula?.tipo}?`
            : `Deseja confirmar a aula de tipo: ${selectedAula?.tipo}?`}
        </p>
        <div className="flex gap-2 justify-center">
          <Button type={4} onClick={confirmAction}>
            sim <span className="material-icons">check</span>
          </Button>
          <Button type={3} onClick={() => setModalVisible(false)}>
            não <span className="material-icons">close</span>
          </Button>
        </div>
      </Modal>
      <ToastContainer
      />
    </div>
  );
}