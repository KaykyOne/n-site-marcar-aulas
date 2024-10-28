import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
import { LoginPageModel } from '../pageModel/LoginPageModel';
import logoAutoEscola from "../imgs/logoAutoEscolaIdeal.png";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [cpfNormal, setCpf] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const loginPageModel = new LoginPageModel();
    const navigate = useNavigate(); // Use useNavigate aqui

    const toggleModal = (message) => {
        setModalMessage(message);
        setModalVisible(!isModalVisible);
    };

    const showToast = (type, text1, text2) => {
        toast[type](`${text1}: ${text2}`);
    };

    const generateHash = (input) => {
        const combinedInput = input + process.env.REACT_APP_SECRET_KEY; // Use REACT_APP_ para variáveis de ambiente
        const hash = CryptoJS.SHA256(combinedInput).toString(CryptoJS.enc.Hex);
        return hash;
    };

    const login = async () => {
        if (!cpfNormal) {
            showToast('error', 'Erro', 'Por favor, insira o CPF.');
            return;
        }

        const cpf = generateHash(cpfNormal);
        setLoading(true);

        try {
            const nome = await loginPageModel.searchUsersByCPF(cpf);
            if (!nome) {
                toggleModal('Nenhum usuário encontrado com esse CPF.');
            } else {
                navigate('/home', { state: { nome, cpf } }); // Navega usando navigate
                setCpf('');
            }
        } catch (error) {
            showToast('error', 'Erro', 'Ocorreu um erro ao tentar fazer login.');
            console.error(error);
            setCpf('');
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        setTimer(60);
        setIsRunning(true);
    };

    const handleCpfChange = (event) => {
        const text = event.target.value;
        setCpf(text);
        if (!isRunning) {
            startTimer();
        } else {
            setTimer(60);
        }
    };

    useEffect(() => {
        let interval;
        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isRunning) {
            setIsRunning(false);
            setCpf('');
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    return (
        <div style={styles.container}>
            <img
                src={logoAutoEscola}
                alt="Logo Auto Escola Ideal"
                style={styles.image}
            />
            <input
                type="text"
                placeholder="Digite seu CPF"
                value={cpfNormal}
                onChange={handleCpfChange}
                style={styles.textInput}
            />
            <button style={styles.button} onClick={login} disabled={loading}>
                {loading ? 'Carregando...' : 'Entrar'}
            </button>
            <p style={styles.textLink} onClick={() => navigate('/support')}>
                Não consegue Entrar? Clique aqui!!
            </p>

            {/* Modal de mensagem */}
            {isModalVisible && (
                <div style={styles.modalContent}>
                    <p>{modalMessage}</p>
                    <button onClick={() => setModalVisible(false)} style={styles.modalButton}>
                        Fechar
                    </button>
                </div>
            )}

            {/* Toast container */}
            <ToastContainer position="top-center" />
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        height: '100vh',
    },
    image: {
        height: '100px',
        width: '200px',
        margin: '20px',
    },
    textInput: {
        width: '80%',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '10px',
        border: '1px solid #ddd',
    },
    button: {
        width: '80%',
        backgroundColor: 'blue',
        color: '#fff',
        borderRadius: '10px',
        padding: '15px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    textLink: {
        marginTop: '20px',
        color: 'blue',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    modalContent: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
    modalButton: {
        backgroundColor: 'blue',
        color: '#fff',
        padding: '10px 20px',
        marginTop: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
};

export default Login;
