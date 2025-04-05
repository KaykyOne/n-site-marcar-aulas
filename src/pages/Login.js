import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/Input';
import Button from '../components/Button'; // Importe o Button
import ModalLogin from '../components/ModalLogin';
import ModalErroHora from '../components/ModalHoraInvalida';
import Modal from '../components/Modal';
import { LoginFunc } from '../controller/ControllerUser';
import useUserStore from '../store/useUserStore';

import logoNovusTech from '../imgs/logoNovusTech.png';
import LogoApp from "../imgs/LogoNovusCFC.png";

export default function Login() {
    //#region Logica 
    const { usuario } = useUserStore();

    const [cpfNormal, setCpf] = useState('');
    const [senhaInput, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [seePass, setSeePass] = useState(false);
    const [modalMan, setModalMan] = useState(false);
    const [modalHoraErro, setModalErroHora] = useState(false);
    const [chechRemember, setCheckRemember] = useState(true);
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

        setLoading(true);
        setTimeout(() => {
            if(loading){
                setLoading(false);
                showToast('error', 'Erro', 'Erro ao fazer login!');
            }
        }, 5000);        

        // console.log(usuario);
        try {
            let responseUsuario = await LoginFunc(cpfNormal, senhaInput, usuario.updated_at ? usuario.updated_at : null, usuario.autoescola_id, usuario.configuracoes);
            if (!responseUsuario) {
                showToast('error', 'Erro', 'Cpf ou senha incorretos, ou usuário não existe!');
                return;
            }
            // console.log(responseUsuario);
            let atividade = responseUsuario.atividade;
            if(atividade == false && responseUsuario){
                showToast('error', 'Erro', 'Você está desativado');
                return;
            }
            let usuarioAtual;
            if(responseUsuario === true){
                usuarioAtual = usuario;
            }else{
                usuarioAtual = responseUsuario;
            }

            if(usuarioAtual.usuario_id != null){
                const manutencaoConfig  = usuarioAtual.configuracoes.find(config => config.chave === "manutencao");
                const manutencao = manutencaoConfig ? manutencaoConfig.valor : "TRUE";
                if(manutencao === "TRUE"){
                    toggleModal("O sistema de sua autoescola está em manutenção!");
                    return;
                }
                // console.log(usuarioAtual.tipo_usuario);
                if (usuarioAtual.tipo_usuario === "aluno") {
                    rememberMe("login");
                    navigate("home");
                    return;
                }
            }else{
                return;
            }
        } catch (error) {
            console.error("Erro no login:", error);
        }finally{
            setLoading(false);
        }
    };

    const handleCpfChange = (event) => {
        const text = event.target.value;
        if (/^\d+$/.test(text)) {
            setCpf(text);
        } else {
            showToast('error', 'Erro', 'O CPF deve conter Apenas numeros!');
            setCpf('');
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
        // console.log(chechRemember);
    };

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
                    <h1 className='veryGreatText'>NovusCFC</h1>
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
