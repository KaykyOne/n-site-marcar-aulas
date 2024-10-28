import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SelectInstructorPageModel } from '../pageModel/SelectInstructorPageModel';
import { toast, ToastContainer } from 'react-toastify';
import LoadingIndicator from './LoadingIndicator';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';

const SelectInstructor = () => {
    const location = useLocation();
    const { cpf, type } = location.state || {};
    const [instrutores, setInstrutores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const selectInstructorPageModel = new SelectInstructorPageModel();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            if (!type) {
                showToast('Erro', 'O Tipo é necessário.');
                return;
            }

            setLoading(true);
            try {
                const instructorsData = await selectInstructorPageModel.searchInstructoresForCategory(cpf, type);
                setInstrutores(instructorsData.map((instructor) => instructor.nome_instrutor));
            } catch (error) {
                showToast('Erro', 'Ocorreu um erro ao buscar os instrutores.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, [type]);

    const showToast = (title, message) => {
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedInstructor(value);
        setModalVisible(true); // Exibe o modal de confirmação
    };

    const confirmSelection = () => {
        setModalVisible(false); // Fecha o modal
        navigate('/selecionarDataEHora', { state: { cpf, type, nameInstructor: selectedInstructor } });
    };

    const renderInstrutorItem = (item, index) => (
        <button key={index} style={styles.button} onClick={() => handleButtonClick(item)}>
            {item}
        </button>
    );

    return (
        <div style={styles.container}>
            <LoadingIndicator visible={loading} />
            <h1 style={styles.textInStart}>
                Clique no instrutor que deseja marcar a aula!
            </h1>
            <div style={styles.flatListContainer}>
                {instrutores.map(renderInstrutorItem)}
            </div>
            <button style={styles.buttonBack} onClick={() => navigate(-1)}>
                Voltar
            </button>
            <div style={styles.contador}>
                <div style={{ ...styles.circle, backgroundColor: 'blue' }} />
                <div style={{ ...styles.circle, backgroundColor: 'blue' }} />
                <div style={{ ...styles.circle, backgroundColor: 'lightgray' }} />
                <div style={{ ...styles.circle, backgroundColor: 'lightgray' }} />
            </div>

            {/* Modal de confirmação */}
            <Modal
                isOpen={modalVisible}
                onConfirm={confirmSelection}
                onCancel={() => setModalVisible(false)} // Função anônima
            >
                <p>Você tem certeza que deseja selecionar o instrutor: {selectedInstructor}</p>
            </Modal>

            <ToastContainer />

        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
        minHeight: '100vh',
    },
    textInStart: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        marginTop: '10%',
    },
    circle: {
        width: 15,
        margin: 2,
        height: 15,
        borderRadius: '50%',
        backgroundColor: '#6200ea',
    },
    contador: {
        display: 'flex',
        flexDirection: 'row',
        margin: 10,
    },
    flatListContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    buttonBack: {
        width: '40%',
        backgroundColor: 'gray',
        borderRadius: 8,
        color: '#fff',
        padding: 10,
        marginTop: 20,
        cursor: 'pointer',
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 10,
        color: '#fff',
        padding: '10px 20px',
        margin: 5,
        cursor: 'pointer',
    },
    modal: {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    modalMessage: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        margin: '0 5px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
};

export default SelectInstructor;
