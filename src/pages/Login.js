import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InstrutorModel } from '../pageModel/InstrutorModel';
import { UserModel } from '../pageModel/UserModel';
import { ManagerModel } from '../pageModel/ManagerModel';
import { useNavigate } from 'react-router-dom';
import Cripto from '../controller/Cripto';
import InputField from '../components/Input';
import Button from '../components/Button'; // Importe o Button
import ModalLogin from '../components/ModalLogin';
import ModalErroHora from '../components/ModalHoraInvalida';
import Modal from '../components/Modal';

import logoNovusTech from '../imgs/logoNovusTech.png';
import LogoApp from "../imgs/logoAutoEscolaIdeal.png";

export default function Login() {

    //#region Logica
    const [cpfNormal, setCpf] = useState('');
    const [senhaInput, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [seePass, setSeePass] = useState(false);
    const [modalMan, setModalMan] = useState(false);
    const [modalHoraErro, setModalErroHora] = useState(false);
    const [chechRemember, setCheckRemember] = useState(false);

    const instrutorModel = new InstrutorModel();
    const lanagerModel = new ManagerModel();
    const userModel = new UserModel();


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

        if (!senhaInput) {
            showToast('error', 'Erro', 'Por favor, insira a Senha.');
            return;
        }

        const cpf = Cripto(cpfNormal);
        setLoading(true);

        try {
            const usuario = await userModel.searchUsersByCPF(cpf);
            console.log(usuario);
            if (!usuario) {
                showToast('error', 'Erro', 'Cpf ou senha incorretos, ou usuário não existe!');
                return;
            }

            rememberMe('login');

            const senha = usuario.senha;
            const atividade = usuario.atividade;
            const tipo = usuario.tipo_usuario;
            const usuarioId = usuario.usuario_id;
            const configs = await lanagerModel.verificarManutencao(usuario.autoescola_id);
            const manutencao = configs.find(item => item.chave === 'manutencao');
            if (senha === Cripto(senhaInput) || senhaInput === senha) {
                if (!atividade) {
                    toggleModal('Usuário inativo ou com acesso restrito!');
                    return;
                }
                if (manutencao.valor === 'TRUE') {
                    toggleModal('Aparentemente a sua autoescola está com o app em manutenção!');
                    return;
                }
                if (tipo === 'aluno') {

                    navigate('/home', { state: { usuario, configs } });
                    setCpf('');
                    setSenha('');
                    return;
                } else if (tipo === 'instrutor') {
                    const instrutor = await instrutorModel.searchInstrutorById(usuarioId);
                    navigate('/homeinstrutor', { state: { usuario, configs, instrutor } });
                    setCpf('');
                    setSenha('');
                    return;
                }

            } else {
                toggleModal('Nenhum usuário encontrado com esse CPF.');
                setCpf('');
                setSenha('');
            }
        } catch (error) {
            showToast('error', 'Erro', `Ocorreu um erro ao tentar fazer login.: ${error.message}`);
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
        if (/^\d+$/.test(text)) {
            setCpf(text);
        } else {
            showToast('error', 'Erro', 'O CPF deve conter Apenas numeros!');
            setCpf('');
        }

        if (!isRunning) {
            startTimer();
        } else {
            setTimer(60);
        }
    };

    const rememberMe = (type) => {
        setLoading(true);
        try {
            if (type === 'restore') {
                let senha = localStorage.getItem("senha");
                let cpf = localStorage.getItem("cpf");
                if (!senha || !cpf) {
                    return;
                } else {
                    setCpf(cpf);
                    setSenha(senha);
                    setCheckRemember(true);
                    return;
                }
            } else if (type === 'login') {
                if (chechRemember) {
                    localStorage.setItem('senha', senhaInput);
                    localStorage.setItem('cpf', cpfNormal);
                } else {
                    localStorage.removeItem("senha");
                    localStorage.removeItem("cpf");
                }

            }
        } catch (error) {
            console.error('erro ao salvar dados: ', error.message)
        } finally {
            setLoading(false);
        }
    };

    const alterRemember = () => {
        setCheckRemember(!chechRemember)
        console.log(chechRemember);
    };

    useEffect(() => {
        setLoading(true);
        try {
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
        } catch (error) {
            console.error('Erro: ', error.message);
        } finally {
            setLoading(false);
        }


    }, [isRunning, timer]);

    useEffect(() => {
        rememberMe('restore');
    }, [])

    //#endregion

    return (
        <div className="container">
            <div className='container-vertical'>
                <img
                    src={LogoApp}
                    alt="Logo Auto Escola Ideal"
                    className="image"
                />
                <div>
                    <h1 className='veryGreatText'>NovusAuto</h1>
                    <h3>Seu aplicativo de Gerenciamento de aulas confiável e simples!</h3>
                </div>
            </div>

            <InputField
                type="text"
                placeholder="Digite seu CPF"
                inputMode="numeric"
                value={cpfNormal}
                onChange={handleCpfChange}
                classNamePersonalized='input'
            />
            <div className="container-pass">
                <InputField
                    type={seePass ? 'text' : 'password'}
                    placeholder="Digite sua Senha"
                    value={senhaInput}
                    onChange={(e) => setSenha(e.target.value)}
                    classNamePersonalized="input password-input"
                />
                <button onClick={() => setSeePass(!seePass)} className="show-button">
                    <span className="material-icons">{seePass ? 'visibility_off' : 'visibility'}</span>
                </button>

            </div>
            <label className="checkbox-container">
                <input
                    checked={chechRemember}
                    value={chechRemember}
                    onChange={alterRemember}  // Corrigido: chamando a função corretamente
                    type="checkbox"
                    id="minhaCheckbox"
                    name="minhaCheckbox"
                />
                Salvar login
            </label>


            {/* Substitua o botão padrão pelo componente Button */}
            <Button
                onClick={login}
                disabled={loading}
            >
                {loading ? 'Carregando...' : 'Entrar'}
                <span className="material-icons">login</span>
            </Button>
            <div className="footer">
                <p>Feito por NovusTech <img className="logo" src={logoNovusTech} /></p>
            </div>
            <ModalLogin visible={modalMan} setModalVisible={setModalMan} />
            <ModalErroHora visible={modalHoraErro} setModalVisible={setModalErroHora} />

            {/* Modal de mensagem */}
            <Modal isOpen={isModalVisible}>
                <p>{modalMessage}</p>
                <Button back={'#A61723'} onClick={() => setModalVisible(false)} className="modal-button">
                    Fechar
                </Button>
            </Modal>

            {/* Toast container */}
            <ToastContainer position="top-center" />
        </div>
    );
}
