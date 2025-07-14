import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../components/Modal';
import ButtonBack from '../../components/ButtonBack';
import Button from '../../components/Button';
import RenderAula from '../../components/RenderAula.js';
import { parse } from "date-fns";

import useUserStore from '../../store/useUserStore.js';
import useAula from '../../hooks/useAula.js'
import { ToastContainer } from 'react-toastify';

export default function ListAulas() {
  const { usuario } = useUserStore();
  const { SearchAulas, loading, error, DeleteAula } = useAula();

  const iconsButton = {
    A: "two_wheeler",
    B: "directions_car",
    C: "local_shipping",
    D: "directions_bus",
    E: "local_shipping"
  };

  const nameTips = {
    A: "moto",
    B: "carro",
    C: "caminhao",
    D: "onibus",
    E: "carreta"
  };

  function faixaDeAulas(qtd) {
    if (qtd >= 20) return "concluido";
    if (qtd >= 15) return "finalizando..";
    if (qtd >= 10) return "avançando...";
    if (qtd <= 5) return "inicio!";
    return "nenhuma aula registrada!";
  }


  //#region Logica
  const [aulas, setAulas] = useState([]);

  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const fetchAulas = useCallback(async () => {
    const data = await SearchAulas(usuario.usuario_id);
    setAulas(data || []);
  }, [usuario.usuario_id]);

  useEffect(() => {
    if (usuario) {
      fetchAulas();

      setCategorias((usuario.categoria_pretendida).split(""))
    }
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

  const aulasFuturas = (aulas || []).filter(
    (item) => parse(item.data, "dd/MM/yyyy", new Date()) >= new Date()
  );

  //#endregion
  return (
    <div className='flex flex-col w-screen h-screen mx-auto px-4 justify-start items-center'>
      <div className='w-full max-w-[800px] mt-[40px] bg-gray-100 shadow-md rounded-2xl p-3'>
        <h1 className='font-medium '>Progresso nas Aulas</h1>
        <div className='flex gap-2 justify-center items-center p-2 flex-wrap'>
          {(categorias || []).map((item) =>
            <div key={item} className='flex flex-1 max-h-[40vh] h-full flex-col bg-primary text-white hover:scale-95 transition-all duration-300 rounded-full justify-center items-center p-3 min-w-[120px] shadow-md'>
              <div className='flex gap-1 justify-center items-center mb-1'>
                <h1 className='font-medium text-sm capitalize text-white/90'>{nameTips[item.toUpperCase()]}</h1>
                <span className="material-icons">
                  {iconsButton[(item.toUpperCase() || "").toUpperCase()] || ""}
                </span>
              </div>
              <h2 className='text-sm font-light text-white/80'>
                {faixaDeAulas((aulas || []).filter((a) => a.tipo.toLowerCase() == item.toLowerCase()).length)}
              </h2>
            </div>
          )}
        </div>
      </div>


      <h2 className='font-bold mt-[10px]'>Aulas Marcadas:</h2>
      <div className='w-full mt-3 overflow-y-auto rounded-2xl border max-w-[800px] max-h-[400px]'>
        {loading && <LoadingIndicator />}

        {!loading && (error || aulasFuturas.length === 0) ? (
          <div className='p-5'>
            <p className='text-error'>
              {error ? `Erro: ${error}` : 'Nenhuma aula marcada!'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col p-2 gap-2">
            {aulasFuturas.map(renderAulaItem)}
          </div>
        )}
      </div>

      <div className='flex gap-2 mt-[10px]'>
        <h1>Arraste para ver mais aulas!</h1>
        <span className="material-icons">swipe_up</span>
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