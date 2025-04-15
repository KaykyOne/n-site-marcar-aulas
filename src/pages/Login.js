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
import { GetInstrutor } from '../controller/ControllerInstrutor';
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
            if (loading) {
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
            if (atividade === false && responseUsuario) {
                showToast('error', 'Erro', 'Você está desativado');
                return;
            }
            let usuarioAtual;
            if (responseUsuario === true) {
                usuarioAtual = usuario;
            } else {
                usuarioAtual = responseUsuario;
            }

            if (usuarioAtual.usuario_id != null) {
                const manutencaoConfig = usuarioAtual.configuracoes.find(config => config.chave === "manutencao");
                const manutencao = manutencaoConfig ? manutencaoConfig.valor : "TRUE";
                if (manutencao === "FALSE") {
                    toggleModal("O sistema de sua autoescola está em manutenção!");
                    return;
                }
                // console.log(usuarioAtual.tipo_usuario);
                if (usuarioAtual.tipo_usuario === "aluno") {
                    rememberMe("login");
                    navigate("home");
                    return;
                }else if(usuarioAtual.tipo_usuario === "instrutor"){
                    rememberMe("login");
                    await GetInstrutor(usuarioAtual.usuario_id);
                    navigate("homeinstrutor");
                }
            } else {
                return;
            }
        } catch (error) {
            console.error("Erro no login:", error);
        } finally {
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
        <div className="flex flex-col justify-center h-full w-full">

            <div className="flex flex-col pt-10 items-center text-center gap-2  bg-primary rounded-t-[50px]">
                <img
                    src={LogoApp}
                    alt="Logo Auto Escola Ideal"
                    className="h-full w-full max-w-[200px] max-h-[200px]"
                />

                <div className='flex flex-col w-full h-full gap-4 p-4 bg-[#f4f4f4] rounded-tl-[50px] pt-10 align-middle justify-center items-center'>
                    <h1 className='text-3xl mb-2'>Login</h1>
                    {/* CPF */}
                    <InputField
                        type="text"
                        placeholder="Digite seu CPF"
                        inputMode="numeric"
                        value={cpfNormal}
                        onChange={handleCpfChange}
                        classNamePersonalized="input"
                    />

                    {/* Senha + botão de mostrar/ocultar */}
                    <div className="flex items-center align-middle justify-center w-full gap-2">
                        <InputField
                            type={seePass ? 'text' : 'password'}
                            placeholder="Digite sua Senha"
                            value={senhaInput}
                            onChange={(e) => setSenha(e.target.value)}
                            classNamePersonalized="input password-input"
                        />
                        <button onClick={() => setSeePass(!seePass)} className="flex h-[50px] rounded-md w-[100px]  bg-secondary justify-center align-middle items-center">
                            <span className="material-icons">
                                {seePass ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            checked={chechRemember}
                            value={chechRemember}
                            onChange={alterRemember}
                            type="checkbox"
                            id="minhaCheckbox"
                            name="minhaCheckbox"
                        />
                        Salvar login
                    </label>

                    {/* Botão login */}
                    <Button onClick={login} disabled={loading}>
                        {loading ? 'Carregando...' : 'Entrar'}
                        <span className="material-icons">login</span>
                    </Button>

                    {/* Footer */}
                    <div className="footer text-sm text-gray-500 flex items-center gap-2 mt-4">
                        <p>Feito por NovusTech</p>
                        <img className="logo w-5 h-5" src={logoNovusTech} alt="NovusTech logo" />
                    </div>
                </div>
            </div>



            {/* Modais */}
            <ModalLogin visible={modalMan} setModalVisible={setModalMan} />
            <ModalErroHora visible={modalHoraErro} setModalVisible={setModalErroHora} />
            <Modal isOpen={isModalVisible}>
                <p>{modalMessage}</p>
                <Button
                    back="#A61723"
                    onClick={() => setModalVisible(false)}
                    className="modal-button"
                >
                    Fechar
                </Button>
            </Modal>

            {/* Toast */}
            <ToastContainer position="top-center" />
        </div>
    );
}
