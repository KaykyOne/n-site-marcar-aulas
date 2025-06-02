import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../components/Modal';
import Button from '../../components/Button'; // Importe o componente Button
import Count from '../../components/Count';
import ButtonBack from '../../components/ButtonBack';

import useAulaStore from '../../store/useAulaStore';
import useUserStore from '../../store/useUserStore';

export default function SelectTypeView() {

    //#region Logica
    const navigate = useNavigate();
    const updateAula = useAulaStore.getState().updateAula;
    const resetAula = useAulaStore.getState().resetAula;

    const { usuario } = useUserStore();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

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

    useEffect(() => {
        const fetchCategorias = async () => {
            if (!usuario.cpf) {
                showToast('Erro', 'O CPF é necessário.');
                return;
            }

            setLoading(true);
            try {
                const categoriasData = usuario.categoria_pretendida;
                if (categoriasData.length > 0) {
                    setCategorias(categoriasData.split('').map((char) => char.toUpperCase()));
                } else {
                    showToast('Nenhum Resultado', 'Nenhuma categoria encontrada.');
                }
            } catch (error) {
                showToast('Erro', 'Ocorreu um erro ao buscar as categorias.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        resetAula();
        fetchCategorias();
    }, [usuario, resetAula]);

    const showToast = (title, message) => {
        toast.dismiss();
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedType(value);
        setModalVisible(true);
    };

    const confirmSelection = () => {
        setModalVisible(false);
        updateAula('tipo', selectedType.toUpperCase());
        updateAula('aluno_id', usuario.usuario_id);
        updateAula('autoescola_id', usuario.autoescola_id);


        navigate('/selecionarInstrutor');
    };

    const renderCategoriaItem = (item, index) => (
        <div className='flex bg-white shadow-md p-3 rounded-xl align-middle justify-start gap-3' key={index} onClick={() => handleButtonClick(item)}>
            <h1 className='text-7xl font-bold p-2 border-r-2 border-gray-400'>{item}</h1>
            <div className='w-full'>
                <div className='flex justify-start align-middle gap-1'>
                    <h1 className='font-bold'>{categoriasEscrito[item] || item}</h1>
                    <span className="material-icons">
                        {iconsButton[item] || ""}
                    </span>
                </div>
                <Button className='mt-2' type={1}>
                    Selecionar
                    <span className="material-icons">arrow_forward_ios</span>
                </Button>
            </div>
        </div>
    );

    const onCancel = () => {
        setModalVisible(false);
        setSelectedType(null);
    };

    //#endregion

    return (
        <div className='flex flex-col gap-5'>
            <ButtonBack event={() => navigate('/home')} />
            <h1 className='font-bold'>Clique no tipo da AULA que deseja marcar!</h1>
            <LoadingIndicator visible={loading} />
            {categorias.Count === 0 ? (
                <div className='flex flex-col'>
                    <p className='text-red-800'>
                        {'Nenhuma categoria encontrada, entre em contato com o suporte!'}
                    </p>
                    <span className="material-icons">
                        error
                    </span>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {categorias.map(renderCategoriaItem)}
                </div>
            )}

            <Count num={1} />
            <Modal
                isOpen={modalVisible}   >
                <p>Você tem certeza que deseja selecionar o tipo: <strong>{categoriasEscrito[selectedType]}</strong></p>
                <Button onClick={confirmSelection} type={4}>Sim
                    <span className="material-icons">
                        check
                    </span></Button>
                <Button onClick={() => onCancel()} type={3}>Não
                    <span className="material-icons">
                        close
                    </span></Button>
            </Modal>

            <ToastContainer />
        </div>
    );
};