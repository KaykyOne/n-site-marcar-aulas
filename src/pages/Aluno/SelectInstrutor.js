import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InstrutorModel } from '../../pageModel/InstrutorModel';
import { toast, ToastContainer } from 'react-toastify';
import LoadingIndicator from '../../components/LoadingIndicator';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../components/Modal';
import Button from '../../components/Button'; // Importe o componente Button
import ButtonBack from '../../components/ButtonBack';
import ButtonHome from '../../components/ButtonHome';
import Count from '../../components/Count';

export default function SelectInstructor() {

    //#region Logica
    const location = useLocation();
    const { usuario, configs, type } = location.state || {};
    const [instrutores, setInstrutores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const instrutorModel = new InstrutorModel();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            if (!usuario || !type) {
                showToast('Erro', 'Usuário e Tipo são necessários.');
                return;
            }
            console.log(configs);
            setLoading(true);
            try {
                const instructorsData = await instrutorModel.searchInstructoresForCategory(usuario.usuario_id, type);
                setInstrutores(instructorsData);
            } catch (error) {
                showToast('Erro', 'Ocorreu um erro ao buscar os instrutores.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, [usuario, type]);

    const showToast = (title, message) => {
        toast.dismiss();
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedInstructor(value);
        setModalVisible(true);
    };

    const confirmSelection = () => {
        setModalVisible(false);
        if (!selectedInstructor) {
            showToast('Erro', 'Selecione um instrutor primeiro.');
            return;
        }
        navigate('/selecionarDataEHora', { state: { usuario, configs, instrutor: selectedInstructor, type } });
    };

    const renderInstrutorItem = (item) => (
        <Button key={item.instrutor_id} onClick={() => handleButtonClick(item)}>
            {item.nome_instrutor}
        </Button>
    );

    const onCancel = () => {
        setModalVisible(false);
        setSelectedInstructor(null);
    };

    //#endregion

    return (
        <div className='container'>
            <LoadingIndicator visible={loading} />
            <div className='button-container'>
                <ButtonBack event={() => navigate('/selecionarTipo', { state: { usuario, configs } })}  />
                <ButtonHome event={() => navigate('/home', { state: { usuario, configs } })} />
            </div>
            <h1 className='greatText'>
                Clique no instrutor que deseja marcar a aula!
            </h1>
            {instrutores.length === 0 ? (
                <div className='container-error'>
                    <p className='text-error'>
                        {'Nenhum instrutor encontrado, entre em contato com o suporte!'}
                    </p>
                    <span className="material-icons">
                        error
                    </span>
                </div>
            ) : (
                <div className='container-vertical'>
                    {instrutores.map(renderInstrutorItem)}
                </div>
            )}
            <Count num={2} />
            <Modal
                isOpen={modalVisible}   >
                <p>Você tem certeza que deseja selecionar o instrutor: <strong>{selectedInstructor?.nome_instrutor}</strong></p>
                <Button back={'#2A8C68'} onClick={confirmSelection}>Sim</Button>
                <Button back={'#A61723'} onClick={() => onCancel()}>Não</Button>
            </Modal>

            <ToastContainer />
        </div>
    );
};
