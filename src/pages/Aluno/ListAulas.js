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

    const categoriasEscrito = {
        A: "Moto",
        B: "Carro",
        C: "Caminhão",
        D: "Ônibus"
    };

    const iconsButton = {
        A: "two_wheeler",
        B: "directions_car",
        C: "local_shipping",
        D: "directions_bus",
        E: "local_shipping"
    };

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
        <div className='flex gap-3 bg-white shadow-md rounded-lg p-3 justify-start items-stretch text-start m-2' key={item.aula_id}>

            <div className='flex flex-col border-r-2 border-gray-400 p-1 m-2 justify-center'>
                <span className="material-icons text-7xl">
                    {iconsButton[item.tipo] || ""}
                </span>
            </div>


            <div className='flex flex-col min-w-[150px]'>
                <h1 className='font-bold text-2xl'>{format(parseISO(item.data), 'dd/MM/yyyy')}</h1>
                <p><strong>Hora:</strong> {item.hora}</p>
                <p className='capitalize'><strong>Instrutor:</strong> {item.instrutores?.nome_instrutor || 'Não especificado'}</p>
                <div className='p-2'>

                </div>
            </div>
            <Button type={3} onClick={() => handleAction('Excluir', item)}>
                <span className="material-icons">delete</span>
            </Button>
        </div>
    );

    //#endregion

    return (
        <div className='flex flex-col'>
            <ButtonBack event={() => navigate(`/home`)} />
            <h1 className='font-bold text-2xl '>Aulas</h1>

            <div className='min-h-[400px] min-w-[250px] align-top mt-3 max-h-[500px] overflow-y-auto'>
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
            </div>


            <Modal
                isOpen={modalVisible}>
                <p>{modalAction === 'Excluir' ? `Deseja excluir a aula ${selectedAula?.tipo}?` : `Deseja confirmar a aula de tipo: ${selectedAula?.tipo}?`}</p>
                <Button type={4} onClick={confirmAction}>sim <span className="material-icons">check</span></Button>
                <Button type={3} onClick={() => setModalVisible(false)}>não <span className="material-icons">close</span></Button>
            </Modal>
            <ToastContainer position="top-center" />
        </div>
    );
}