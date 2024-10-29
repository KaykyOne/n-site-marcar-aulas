import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SelectTypeViewModel } from '../pageModel/SelectTypePageModel';
import LoadingIndicator from './LoadingIndicator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';

const SelectTypeView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cpf } = location.state || {};
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const selectTypeViewModel = new SelectTypeViewModel();

    useEffect(() => {
        const fetchCategorias = async () => {
            if (!cpf) {
                showToast('Erro', 'O CPF é necessário.');
                return;
            }

            setLoading(true);
            try {
                const categoriasData = await selectTypeViewModel.searchCategoriaPretendida(cpf);
                if (categoriasData.length > 0) {
                    const categoria = categoriasData[0].categoria_pretendida;
                    setCategorias(categoria.split('').map((char) => char.toUpperCase()));
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
    }, [cpf]);

    const showToast = (title, message) => {
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedType(value);
        setModalVisible(true);
    };

    const confirmSelection = () => {
        setModalVisible(false);
        navigate('/selecionarInstrutor', { state: { cpf, type: selectedType } });
    };

    const renderCategoriaItem = (item, index) => (
        <button key={index} style={styles.button} onClick={() => handleButtonClick(item)}>
            {item}
        </button>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.textInStart}>Clique no tipo da AULA que deseja marcar!</h1>
            <LoadingIndicator visible={loading} />
            <div style={styles.flatListContainer}>
                {categorias.map(renderCategoriaItem)}
            </div>
            <button style={styles.buttonBack} onClick={() => navigate('/home', { state: { cpf } })}>Voltar</button>
            <div style={styles.contador}>
                <div style={{ ...styles.circle, ...styles.blue }} />
                <div style={{ ...styles.circle, ...styles.lightgray }} />
                <div style={{ ...styles.circle, ...styles.lightgray }} />
                <div style={{ ...styles.circle, ...styles.lightgray }} />
            </div>

            <Modal
                isOpen={modalVisible}
                onConfirm={confirmSelection}
                onCancel={() => setModalVisible(false)} // Função anônima
            >
                <p>Você tem certeza que deseja selecionar o tipo: {selectedType}</p>
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
    circle: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        margin: 2,
    },
    blue: {
        backgroundColor: 'blue',
    },
    lightgray: {
        backgroundColor: 'lightgray',
    },
    textInStart: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        marginTop: '10%',
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
    flatListContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: 10,
    },
    contador: {
        display: 'flex',
        flexDirection: 'row', // Alinha as bolinhas em linha
        justifyContent: 'center',
        margin: 10,
    },
};

export default SelectTypeView;
