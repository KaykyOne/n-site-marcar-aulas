import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../components/Modal';
import Button from '../../components/Button'; // Importe o componente Button
import Count from '../../components/Count';
import ButtonBack from '../../components/ButtonBack';

export default function SelectTypeView() {

    //#region Logica
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario, configs } = location.state || {};
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

        fetchCategorias();
    }, [usuario]);

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
        navigate('/selecionarInstrutor', { state: { usuario, configs, type: selectedType } });
    };

    const renderCategoriaItem = (item, index) => (
        <Button key={index} onClick={() => handleButtonClick(item)}>
            {categoriasEscrito[item] || item}
            <span className="material-icons">
                {iconsButton[item] || ""}
            </span>
        </Button>
    );

    const onCancel = () => {
        setModalVisible(false);
        setSelectedType(null);
    };

    //#endregion

    return (
        <div className='container'>
            <ButtonBack event={() => navigate('/home', { state: { usuario, configs } })} />
            <h1 className='greatText'>Clique no tipo da AULA que deseja marcar!</h1>
            <LoadingIndicator visible={loading} />
            {categorias.Count === 0 ? (
                <div className='container-error'>
                    <p className='text-error'>
                        {'Nenhuma categoria encontrada, entre em contato com o suporte!'}
                    </p>
                    <span className="material-icons">
                        error
                    </span>
                </div>
            ) : (
                <div className='container-vertical'>
                    {categorias.map(renderCategoriaItem)}
                </div>
            )}

            <Count num={1} />
            <Modal
                isOpen={modalVisible}   >
                <p>Você tem certeza que deseja selecionar o tipo: {selectedType}</p>
                <Button back={'#2A8C68'}  onClick={confirmSelection}>Sim</Button>
                <Button back={'#A61723'} onClick={() => onCancel()}>Não</Button>
            </Modal>

            <ToastContainer />
        </div>
    );
};