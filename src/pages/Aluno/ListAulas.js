import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { ClassModel } from '../../pageModel/ClassModel.js';
import { format, parseISO } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../components/Modal';
import ButtonBack from '../../components/ButtonBack';
import Button from '../../components/Button';

import useUserStore from '../../store/useUserStore.js';

export default function ListAulas() {
    const { usuario } = useUserStore();

    //#region Logica
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aulas, setAulas] = useState([]);
    const [currentTime, setCurrentTime] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const classModel = new ClassModel();
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAula, setSelectedAula] = useState(null);
    const [modalAction, setModalAction] = useState(null);

    const showToast = (type, text1, text2) => {
        toast.dismiss();
        toast[type](`${text1}: ${text2}`);
    };

    const fetchAulas = async () => {
        setLoading(true);
        setError(null);
        try {
            const { currentTime, currentDate } = await classModel.getCurrentTimeAndDateFromServer();
            setCurrentTime(currentTime);
            setCurrentDate(currentDate);

            const data = await classModel.searchAulas(usuario.usuario_id);
            setAulas(data.aulas || []);
            if (!data.aulas) setError('Nenhuma aula encontrada.');
        } catch (error) {
            setError(error.message);
            showToast('error', 'Erro', error.message);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        if (usuario) fetchAulas();
    }, [usuario]);

    const handleAction = (action, item) => {
        const { data, hora } = item;
        
        if (action === 'Excluir') {
            setSelectedAula(item);
            setModalAction('Excluir');
            setModalVisible(true);
        } else if (action === 'Confirmar') {
            if (currentDate > data || (currentDate === data && hora < currentTime)) {
                setSelectedAula(item);
                setModalAction('Confirmar');
                setModalVisible(true);
            } else {
                showToast('error', 'Erro', 'Muito cedo para concluir a aula!');
            }


        }
    };

    const confirmAction = async () => {
        const horaPraPoderExcluir = usuario.configuracoes.find(item => item.chave === 'horasPraDesmarcarAulas');
        if (selectedAula && selectedAula.aula_id) {
            try {
                if (modalAction === 'Excluir') {
                    let res = await classModel.deleteAula(selectedAula.aula_id, selectedAula.data, selectedAula.hora, horaPraPoderExcluir.valor);
                    if (res) {
                        showToast('success', 'Sucesso', 'Aula Excluída com sucesso!');
                    } else {
                        if (selectedAula.hora === '07:00:00') {
                            showToast('error', 'Erro', 'A aula não  pode ser excluida, aulas ás 7:00 dever ser exluídas com 24 horas de antecedência!');
                        } else {
                            showToast('error', 'Erro', `A aula não  pode ser excluida, isso deve ser feito com ${horaPraPoderExcluir.valor} horas de antecedência!`);
                        }
                    }
                } 
                fetchAulas();
                setModalVisible(false);
                setSelectedAula(null);
            } catch (error) {
                showToast('error', 'Erro', error.message);
            }
        }
    };

    const renderAulaItem = (item) => (
        <div className='itemContainer' key={item.aula_id}>
            <p>Data: {format(parseISO(item.data), 'dd/MM/yyyy')}</p>
            <p>Tipo: {item.tipo}</p>
            <p>Hora: {item.hora}</p>
            <p>Instrutor: {item.instrutores?.nome_instrutor || 'Não especificado'}</p>
            <div>
                <Button back="red" cor="white" onClick={() => handleAction('Excluir', item)}>
                    Excluir
                    <span className="material-icons">delete</span>
                </Button>
            </div>
        </div>
    );

    //#endregion

    return (
        <div className='container'>
            <ButtonBack event={() => navigate(`/home`)} />
            <h1>Aulas</h1>

            {loading && <LoadingIndicator />}
            {error || aulas.length === 0 ? (
                <div>
                    <p className='text-error'>
                        {error ? `Erro: ${error}` : 'Nenhuma aula marcada!'}
                    </p>
                </div>
            ) : (
                <div>{aulas.map(renderAulaItem)}</div>
            )}

            <Modal
                isOpen={modalVisible}>
                <p>{modalAction === 'Excluir' ? `Deseja excluir a aula ${selectedAula?.tipo}?` : `Deseja confirmar a aula de tipo: ${selectedAula?.tipo}?`}</p>
                <Button back={'#2A8C68'} onClick={confirmAction}>sim <span className="material-icons">check</span></Button>
                <Button back={'#A61723'} onClick={() => setModalVisible(false)}>não <span className="material-icons">close</span></Button>
            </Modal>
            <ToastContainer position="top-center" />
        </div>
    );
}