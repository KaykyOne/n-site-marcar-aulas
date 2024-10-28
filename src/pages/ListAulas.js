import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';
import { ListAulasPageModel } from '../pageModel/ListAulasPageModel';
import { format, isAfter, differenceInHours, parseISO, isBefore } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListAulas() {
    const location = useLocation();
    const { cpf } = location.state || {}; // Recebe os dados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aulas, setAulas] = useState([]);
    const [currentTime, setCurrentTime] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const listAulasPageModel = new ListAulasPageModel();
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAula, setSelectedAula] = useState(null);
    const [modalAction, setModalAction] = useState(null);

    const showToast = (type, text1, text2) => {
        toast[type](`${text1}: ${text2}`);
    };

    const fetchAulas = async () => {
        setLoading(true);
        setError(null);

        try {
            const { currentTime, currentDate } = await listAulasPageModel.getCurrentTimeAndDateFromServer();
            setCurrentTime(currentTime);
            setCurrentDate(currentDate);

            const data = await listAulasPageModel.searchAulas(cpf);
            setAulas(data || []);
            if (!data) setError('Nenhuma aula encontrada.');
        } catch (error) {
            setError(error.message);
            showToast('error', 'Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cpf) fetchAulas();
    }, [cpf]);

    const handleAction = (action, item) => {
        const { data, hora } = item;
        const aulaDateTime = parseISO(`${data}T${hora}:00`);
        const currentDateTime = new Date();
        console.log(aulaDateTime);
        console.log(currentDateTime);

        if (action === 'Excluir') {
                setSelectedAula(item);
                setModalAction('Excluir');
                setModalVisible(true);
        } else if (action === 'Confirmar') {
            if (isBefore(aulaDateTime, currentDateTime)) {
                setSelectedAula(item);
                setModalAction('Confirmar');
                setModalVisible(true);
            } else {
                showToast('error', 'Erro', 'Você só pode confirmar aulas passadas.');
            }
        }
    };

    const confirmAction = async () => {
        if (selectedAula && selectedAula.aula_id) {
            try {
                if (modalAction === 'Excluir') {
                    let res = await listAulasPageModel.deleteAula(selectedAula.aula_id, selectedAula.data, selectedAula.hora);
                    showToast(res ? 'success': 'error', res ? 'Sucesso' : 'Erro', res ? 'Aula excluída com sucesso!' : 'Erro ao excluir a aula!');
                } else if (modalAction === 'Confirmar') {
                    await listAulasPageModel.alterAula("Concluída", selectedAula.aula_id, "Concluída", cpf);
                    showToast('success', 'Sucesso', 'Aula confirmada com sucesso!');
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
        <div style={styles.itemContainer}>
            <p style={styles.itemTitle}>Data: {format(parseISO(item.data), 'dd/MM/yyyy')}</p>
            <p style={styles.itemText}>Tipo: {item.tipo}</p>
            <p style={styles.itemText}>Hora: {item.hora}</p>
            <div style={styles.buttonContainer}>
                <button style={styles.deleteButton} onClick={() => handleAction('Excluir', item)}>Excluir</button>
                <button style={styles.confirmButton} onClick={() => handleAction('Confirmar', item)}>Confirmar</button>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Aulas</h1>
            {loading && <LoadingIndicator />}
            {error ? (
                <div style={styles.errorContainer}><p style={styles.errorText}>Erro: {error}</p></div>
            ) : (
                <div style={styles.flatListContainer}>{aulas.map(renderAulaItem)}</div>
            )}
            <button style={styles.buttonBack} onClick={() => navigate(-1)}>Voltar</button>

            {modalVisible && (
                <div style={styles.modalContent}>
                    <p>{modalAction === 'Excluir' ? `Deseja excluir a aula ${selectedAula?.tipo}?` : `Deseja confirmar a aula ${selectedAula?.tipo}?`}</p>
                    <div style={styles.modalButtons}>
                        <button style={styles.modalButton} onClick={confirmAction}>Confirmar</button>
                        <button style={styles.modalButton} onClick={() => setModalVisible(false)}>Cancelar</button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-center" />
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '28px',
        color: '#333',
        textAlign: 'center',
    },
    flatListContainer: {
        width: '100%',
    },
    errorContainer: {
        color: 'red',
    },
    itemContainer: {
        backgroundColor: '#D9D9D9',
        borderRadius: '10px',
        padding: '20px',
        margin: '10px 0',
    },
    buttonContainer: {
        marginTop: '10px',
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        margin: '5px',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        margin: '5px',
    },
    buttonBack: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        marginTop: '20px',
        cursor: 'pointer',
    },
    modalContent: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'center',
    },
    modalButton: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        margin: '10px',
    },
};

export default ListAulas;

