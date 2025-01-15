import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SelectInstructorPageModel } from '../pageModel/SelectInstructorPageModel';
import { toast, ToastContainer } from 'react-toastify';
import LoadingIndicator from './LoadingIndicator';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';
import Button from '../components/Button'; // Importe o componente Button

export default function SelectInstructor() {

    //#region Logica
    const location = useLocation();
    const { cpf, type, nome } = location.state || {};
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
        toast.dismiss();
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedInstructor(value);
        setModalVisible(true);
    };

    const confirmSelection = () => {
        setModalVisible(false);
        navigate('/selecionarDataEHora', { state: { cpf, type, nameInstructor: selectedInstructor, nome } });
    };

    const renderInstrutorItem = (item, index) => (
        <Button key={index} onClick={() => handleButtonClick(item)} back="#0056b3" cor="#FFF" styleAct={styles.button}>
            {item}
        </Button>
    );

    //#endregion

    return (
        <div style={styles.container}>
            <LoadingIndicator visible={loading} />
            <h1 style={styles.textInStart}>
                Clique no instrutor que deseja marcar a aula!
            </h1>
            {instrutores.length === 0 ? (
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>
                        {'Nenhum instrutor encontrado, entre em contato com o suporte!'}
                    </p>
                </div>
            ) : (
                <div style={styles.flatListContainer}>
                    {instrutores.map(renderInstrutorItem)}
                </div>
            )}

            <Button onClick={() => navigate('/selecionarTipo', { state: { cpf, nome } })} back="gray" cor="#FFF" styleAct={styles.buttonBack}>
                Voltar
            </Button>
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
                onCancel={() => setModalVisible(false)}
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
        alignItems: 'center',
    },
    buttonBack: {
        width: '40%',
        borderRadius: 8,
        marginTop: 20,
    },
    errorContainer: {
        color: 'red',
    },
    errorText: {
        color: 'red'
    },
    button: {
        width: '80%',
        marginTop: '15px',
    },
};