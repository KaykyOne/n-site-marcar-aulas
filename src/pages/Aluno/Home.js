import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Loading, Modal } from '../../NovusUI/All';
import useUserStore from '../../store/useUserStore';
import modalIcon from '../../imgs/icons/undraw_notify_rnwe.svg'
import RenderAula from '../../components/RenderAula.js';
import { parse, subDays } from "date-fns";

import useAula from '../../hooks/useAula.js';

export default function HomeView() {
  const { usuario } = useUserStore();

  const [loadingTotal, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const { SearchAulas, loading: loadingAulas, error, DeleteAula, RenderTotalAulas, aulas } = useAula();

  const loading = loadingAulas || loadingTotal && true;

  useEffect(() => {
    const verificarSenha = () => {
      if (usuario.senha === '123456') {
        setModalMessage(
          <>
            <img alt='imageModal' className='image' src={modalIcon} />
            <p>Percebemos que sua senha ainda é a padrão(123456), aconselhamos mudar para uma maior segurança!</p>
            <Button back={'#4B003B'} onClick={() => setModalMessage('')} cor="#FFF">
              Fechar
            </Button>
          </>
        )
        return;
      }
    };
    verificarSenha();
  }, [])
  const alterPage = (page) => {
    setLoading(true);
    try {
      if (usuario.atividade) {
        navigate(`/${page}`);
      } else {
        setModalMessage('Ops! Sua conta está bloqueada. Por favor, entre em contato com o nosso atendimento para resolver isso rapidinho!');
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAulas = useCallback(async () => {
    await SearchAulas(usuario.usuario_id);
  }, [usuario.usuario_id]);
  useEffect(() => {
    if (usuario) {
      fetchAulas();
    }
  }, [usuario, fetchAulas]);
  const handleAction = async (acao, item) => {
    if (acao === "Excluir") {
      setModalMessage(
        <>
          <p className='mb-4'>
            Deseja excluir a aula do dia <strong>{item?.data}</strong>?
          </p>
          <div className="flex gap-2 justify-center">
            <Button type={4} onClick={() => confirmAction(item)}>
              sim <span className="material-icons">check</span>
            </Button>
            <Button type={3} onClick={() => setModalMessage('')}>
              não <span className="material-icons">close</span>
            </Button>
          </div>
        </>
      )
      await fetchAulas();
    }
  }
  const confirmAction = async (item) => {
    const horaPraPoderExcluir = usuario.configuracoes.find(item => item.chave === 'horasPraDesmarcarAulas');

    if (!item || !horaPraPoderExcluir) {
      toast.error('Erro ao excluir aula!')
      fetchAulas();
      setModalMessage('');
      return;
    }

    let res = await DeleteAula(item, horaPraPoderExcluir);
    if (res) {
      fetchAulas();
      setModalMessage('');
    }
  };
  const renderAulaItem = (item) => (
    <RenderAula item={item} key={item.aula_id} tipo={2} handleAction={handleAction} />
  );
  const aulasFuturas = (aulas || []).filter(
    (item) => parse(item.data, "dd/MM/yyyy", new Date()) >= subDays(new Date(), 1)
  );

  localStorage.setItem('aulasFuturas', JSON.stringify(aulasFuturas));

  return (
    <div className='flex flex-col gap-3 h-screen justify-center items-center p-3'>
      <h1 className='font-bold text-2xl capitalize'>Bem-vindo, {usuario.nome}!</h1>
      <Button onClick={() => alterPage('selecionarTipo')}>
        Marcar Aula
        <span className="material-icons">add</span>
      </Button>
      <RenderTotalAulas categorias={(usuario.categoria_pretendida).split("")} />
      <div className='w-full'>
        <h1 className='text-xl font-semibold'>Aulas Agendadas:</h1>
        <div className='w-full mt-3 overflow-y-auto rounded-md border max-w-[800px] max-h-[300px]'>
          {loading && <Loading />}

          {!loading && (error || aulasFuturas.length === 0) ? (
            <div className='p-5'>
              <p className='text-error'>
                {error ? `Erro: ${error}` : 'Nenhuma aula agendada!'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col p-2 gap-2">
              {aulasFuturas.map(renderAulaItem)}
            </div>
          )}
        </div>
        {aulasFuturas?.length > 2 && 
          <p className='flex gap-2 w-full items-center justify-center pt-2'>Arraste para ver mais aulas!
            <span class="material-icons">
              swipe_down
            </span>
          </p>
        }

      </div>
      <Loading visible={loading} />
      <Modal isOpen={modalMessage}>
        {modalMessage}
      </Modal>
    </div>
  );
};