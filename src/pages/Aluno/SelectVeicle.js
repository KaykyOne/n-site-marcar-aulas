import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import LoadingIndicator from '../../components/LoadingIndicator';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ButtonBack from '../../components/ButtonBack';
import ButtonHome from '../../components/ButtonHome';
import Count from '../../components/Count';
import { SelectVeicleByInstrutor } from '../../controller/ControllerVeiculo';

import useAulaStore from '../../store/useAulaStore';
import useUserStore from '../../store/useUserStore';

export default function SelectVeicle() {
    
    //#region Logica
    const { updateAula, aula } = useAulaStore.getState();
    const { usuario } = useUserStore();    

    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVeicle, setSelectedVeicle] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVeicles = async () => {
            if (!usuario || !aula) {
                showToast('Erro', 'Usuário e Tipo são necessários.');
                return;
            }
            setLoading(true);
            try {
                
                const instrutor = aula.instrutor.id_instrutor;
                console.log(aula)
                console.log(aula.instrutor.instrutor_id);
                console.log(aula.tipo);

                const veiclesData = await SelectVeicleByInstrutor(aula.instrutor.instrutor_id, aula.tipo); 
                setVeiculos(veiclesData || []); // Garante que seja um array                
            } catch (error) {
                showToast('Erro', 'Ocorreu um erro ao buscar os veículos.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVeicles();
    }, [usuario, aula]);

    const showToast = (title, message) => {
        toast.dismiss();
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedVeicle(value);
        setModalVisible(true);
    };

    const confirmSelection = () => {
        setModalVisible(false);
        if (!selectedVeicle) {
            showToast('Erro', 'Selecione um veículo primeiro.');
            return;
        }
        updateAula('veiculo', selectedVeicle);
        navigate('/selecionarDataEHora');
    };

    const renderVeicleItem = (item) => (
        <Button key={item.veiculo_id} onClick={() => handleButtonClick(item)}>
            {item.modelo}
        </Button>
    );

    const onCancel = () => {
        setModalVisible(false);
        setSelectedVeicle(null);
    };

    //#endregion

    return (
        <div className='container'>
            <LoadingIndicator visible={loading} />
            <div className='button-container'>
                <ButtonBack event={() => navigate('/selecionarInstrutor')} />
                <ButtonHome event={() => navigate('/home')} />
            </div>
            <h1 className='greatText'>
                Clique no veículo que deseja utilizar na aula!
            </h1>
            {veiculos.length === 0 ? (
                <div className='container-error'>
                    <p className='text-error'>
                        {'Nenhum veículo encontrado, entre em contato com o suporte!'}
                    </p>
                    <span className="material-icons">error</span>
                </div>
            ) : (
                <div className='container-vertical'>
                    {veiculos.map(renderVeicleItem)}
                </div>
            )}
            <Count num={3} />
            <Modal isOpen={modalVisible}>
                <p>Você tem certeza que deseja selecionar o veículo: <strong>{selectedVeicle?.modelo}</strong>?</p>
                <Button back={'#2A8C68'} onClick={confirmSelection}>Sim</Button>
                <Button back={'#A61723'} onClick={onCancel}>Não</Button>
            </Modal>

            <ToastContainer />
        </div>
    );
}
