import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/Input';
import Button from '../components/Button'; // Importe o Button
import ModalLogin from '../components/ModalLogin';
import ModalErroHora from '../components/ModalHoraInvalida';
import Modal from '../components/Modal';
import useUserStore from '../store/useUserStore';

import logoNovusTech from '../imgs/logoNovusTech.png';
import LogoApp from "../imgs/LogoNovusCFC.png";

import useGeneric from '../hooks/useGeneric';
import useInstrutor from '../hooks/useInstrutor';


export default function Login() {
    //#region Logica 
    const { usuario } = useUserStore();
    const { GetInstrutor } = useInstrutor();
    const { LoginFunc, ForPass } = useGeneric();

    const [cpfNormal, setCpf] = useState('');
    const [senhaInput, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [seePass, setSeePass] = useState(false);
    const [modalMan, setModalMan] = useState(false);
    const [modalHoraErro, setModalErroHora] = useState(false);
    const [checkRemember, setCheckRemember] = useState(true);
    const [cpfEsqueci, setCpfEsqueci] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [modalTipo, setModalTipo] = useState(""); // ex: 'esqueci', 'manutencao', 'erroHora'


    const navigate = useNavigate(); // Use useNavigate aqui

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

        const cpfLimpo = cpfNormal.replace(/\D/g, "");
        // console.log(usuario);
        try {
            let responseUsuario = await LoginFunc(cpfLimpo, senhaInput);
            // console.log(responseUsuario);
            if (!responseUsuario) {
                showToast('error', 'Erro', 'Cpf ou senha incorretos, ou usuário não existe!');
                return;
            }
            // console.log(responseUsuario);
            let atividade = responseUsuario.atividade;
            console.log(responseUsuario);
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
                if (manutencao === "TRUE") {
                    setModalTipo("manutencao");
                    setModalAberto(true);
                    return;
                }
                // console.log(usuarioAtual.tipo_usuario);
                if (usuarioAtual.tipo_usuario === "aluno") {
                    rememberMe("login");
                    navigate("home");
                    return;
                } else if (usuarioAtual.tipo_usuario === "instrutor") {
                    rememberMe("login");
                    await GetInstrutor(usuarioAtual.usuario_id);
                    navigate("selecionarAutoescola");
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

    const confirmEsqueciSenha = async () => {
        if (cpfEsqueci.length >= 11) {
            const cpfLimpo = cpfEsqueci.replace(/\D/g, "");
            await ForPass(cpfLimpo);
            setCpfEsqueci("");
            setModalAberto(false)
            setModalTipo("");
        } else {
            toast.error("CPF incorreto para solicitar senha!");
        }
    }

    const rememberMe = useCallback((type) => {
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
                if (checkRemember) {  // corrigido typo aqui
                    localStorage.setItem('senha', senhaInput);
                    localStorage.setItem('cpf', cpfNormal);
                } else {
                    localStorage.removeItem("senha");
                    localStorage.removeItem("cpf");
                }
            }
        } catch (error) {
            console.error('Erro ao salvar dados: ', error.message);
        } finally {
            setLoading(false);
        }
    }, [checkRemember, senhaInput, cpfNormal]);


    const alterRemember = () => {
        setCheckRemember(!checkRemember)
        // console.log(checkRemember);
    };

    useEffect(() => {
        rememberMe('restore');
    }, [])

    //#endregion    
    return (
        <div className="flex flex-col h-screen w-screen justify-center items-center">

            <div className="flex flex-col w-full pt-10 items-center text-center gap-2 bg-primary rounded-t-[50px] max-w-[800px]">
                <img
                    src={LogoApp}
                    alt="Logo Auto Escola Ideal"
                    className="h-full w-full max-w-[200px] max-h-[200px]"
                />

                <div className='flex flex-col w-full h-full gap-4 p-4 bg-white rounded-tl-[50px] pt-10 align-middle justify-center items-center'>
                    <h1 className='text-3xl mb-2'>Login</h1>
                    {/* CPF */}
                    <InputField
                        type="text"
                        placeholder="Digite seu CPF"
                        inputMode="numeric"
                        value={cpfNormal}
                        onChange={(e) => setCpf(e.target.value)}
                        maxLength={14}
                    />

                    {/* Senha + botão de mostrar/ocultar */}
                    <div className="flex items-center align-middle justify-center w-full gap-2">
                        <InputField
                            type={seePass ? 'text' : 'password'}
                            placeholder="Digite sua Senha"
                            value={senhaInput}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <button onClick={() => setSeePass(!seePass)} className="flex h-[50px] rounded-md w-[100px]  bg-secondary justify-center align-middle items-center">
                            <span className="material-icons">
                                {seePass ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            checked={checkRemember}
                            value={checkRemember}
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

                    <div className='flex gap-2 hover:text-primary transition-all duration-300 cursor-pointer' onClick={() => {
                        setModalTipo("esqueci");
                        setModalAberto(true);
                    }}>
                        <a>Esqueci a senha</a>
                        <span className="material-icons">
                            lock_reset
                        </span>
                    </div>

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

            <Modal isOpen={modalAberto}>
                {modalTipo === "esqueci" && (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Digite seu CPF</h1>
                        <p>Enviaremos uma nova senha para você pelo celular!</p>

                        <InputField
                            type="text"
                            placeholder="Digite seu CPF"
                            inputMode="numeric"
                            value={cpfEsqueci}
                            onChange={(e) => setCpfEsqueci(e.target.value)}
                            maxLength={14}
                        />

                        <div className="flex flex-col w-full gap-1">
                            <Button type={4} onClick={confirmEsqueciSenha}>
                                Confirmar
                                <span className="material-icons">check</span>
                            </Button>
                            <Button type={3} onClick={() => setModalAberto(false)}>
                                Cancelar
                                <span className="material-icons">clear</span>
                            </Button>
                        </div>

                        <p className="italic text-sm">Pode demorar até 5 minutos para a senha chegar!</p>
                    </div>
                )}

                {modalTipo === "manutencao" && (
                    <div className="flex flex-col gap-4 items-center text-center">
                        <p className="text-lg">O sistema da sua autoescola está em manutenção.</p>
                        <Button back="#A61723" onClick={() => setModalAberto(false)}>Fechar</Button>
                    </div>
                )}
            </Modal>


            {/* Toast */}
            <ToastContainer position="top-center" />
        </div>
    );
}
