import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginPageModel } from '../pageModel/LoginPageModel';
import logoAutoEscola from "../imgs/logoAutoEscolaIdeal.png";
import { useNavigate } from 'react-router-dom';
import Cripto from '../controller/Cripto';
import InputField from '../components/Input';
import Button from '../components/Button'; // Importe o Button

function Login() {
    const [cpfNormal, setCpf] = useState('');
    const [senhaInput, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [seePass, setSeePass] = useState(false);

    const loginPageModel = new LoginPageModel();
    const navigate = useNavigate(); // Use useNavigate aqui

    const toggleModal = (message) => {
        setModalMessage(message);
        setModalVisible(!isModalVisible);
    };

    const showToast = (type, text1, text2) => {
        toast.dismiss();  // Remove todos os toasts anteriores
        toast[type](`${text1}: ${text2}`);
    };

    const login = async () => {
        if (!cpfNormal) {
            showToast('error', 'Erro', 'Por favor, insira o CPF.');
            return;
        }

        const cpf = Cripto(cpfNormal);
        setLoading(true);

        try {
            const data = await loginPageModel.searchUsersByCPF(cpf);
            const nome = data.nome;
            const senha = data.senha;
            if (senha === Cripto(senhaInput) || senhaInput === senha) {
                navigate('/home', { state: { nome, cpf, senha } });
                setCpf('');
                setSenha('');
            } else {
                toggleModal('Nenhum usuário encontrado com esse CPF.');
                setCpf('');
                setSenha('');
            }
        } catch (error) {
            showToast('error', 'Erro', 'Ocorreu um erro ao tentar fazer login.');
            console.error(error.message);
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
        if(/^\d+$/.test(text)){
            setCpf(text);
        }else{
            showToast('error', 'Erro', 'O CPF deve conter Apenas numeros!');
            setCpf('');
        }

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
            <InputField
                typ="text"
                placeholder="Digite seu CPF"
                inputMode="numeric"
                value={cpfNormal}
                onChange={handleCpfChange}
            />
            <div style={styles.containerPass}>
                <InputField
                    typ={seePass ? 'text' : 'password'}
                    placeholder="Digite sua Senha"
                    value={senhaInput}
                    inputMode="numeric" 
                    onChange={(e) => setSenha(e.target.value)}
                    styleAct={styles.passwordInput}
                />
                <button onClick={() => setSeePass(!seePass)} style={styles.showButton}>
                    {seePass ? 'Ocultar' : 'Mostrar'}
                </button>
            </div>
            {/* Substitua o botão padrão pelo componente Button */}
            <Button
                onClick={login}
                cor="#FFF"
                back="#0056b3" // Azul corporativo
                styleAct={styles.button}
                disabled={loading}
            >
                {loading ? 'Carregando...' : 'Entrar'}
            </Button>
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
        padding: '20px',
        height: '100vh',
    },
    containerPass: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        width: '80%',
    },
    image: {
        height: '100px',
        width: 'auto',
        marginBottom: '20px',
    },
    passwordInput: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px 0 0 8px',
        border: '1px solid #ccc',
        borderRight: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    showButton: {
        padding: '12px',
        borderRadius: '0 8px 8px 0',
        border: '1px solid #ccc',
        backgroundColor: '#FFC601',
        cursor: 'pointer',
        color: '#333',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    textLink: {
        marginTop: '20px',
        color: '#0056b3',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '0.9em',
    },
    modalContent: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    modalButton: {
        backgroundColor: '#0056b3',
        color: '#fff',
        padding: '10px 20px',
        marginTop: '10px',
        cursor: 'pointer',
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
};

export default Login;
