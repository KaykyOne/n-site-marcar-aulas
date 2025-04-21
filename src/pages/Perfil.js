import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserModel } from '../pageModel/UserModel';
import InputField from '../components/Input';
import ButtonBack from '../components/ButtonBack';
import Button from '../components/Button';

import useUserStore from '../store/useUserStore';

export default function Perfil() {
    const { usuario } = useUserStore();
    const location = useLocation();
    const tipo = location.state?.tipo;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [nivelDaSenha, setNivelDaSenha] = useState('Ruim.');
    const [nivelProgressBar, setnivelProgressBar] = useState(0);
    const navigate = useNavigate();
    const userModel = new UserModel();

    const showToast = (type, text1, text2) => {
        toast.dismiss();  // Remove todos os toasts anteriores
        toast[type](`${text1}: ${text2}`);
    };


    const handleChangePassword = async () => {
        if (newPassword.length < 6 || newPassword.length > 12) {
            showToast('error', 'Erro', 'A nova senha deve ter pelo menos 6 caracteres e no máximo 12.');
            return;
        }

        if (currentPassword === newPassword) {
            showToast('error', 'Erro', 'A nova senha não pode ser igual a anterior!');
            return;
        }

        if (newPassword === '123456') {
            showToast('error', 'Erro', 'A nova senha não pode ser igual a padrão!');
            return;
        }


        setLoading(true);
        try {
            const { resultado, senhaAtt } = await userModel.alterarSenha(usuario, currentPassword, newPassword);
            if (!resultado) {
                showToast('error', 'Erro', 'Senha atual incorreta');
                return;
            }
            usuario.senha = senhaAtt;
            showToast('success', 'Sucesso', 'Senha Alterada!');

        } catch (error) {
            showToast('error', 'Erro', `Erro ao alterar Senha: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    function AlterandoSenhaEVerificando(str) {
        const temMaiuscula = /[A-Z]/.test(str);
        const temNumero = /\d/.test(str);
        const temSimbolo = /[^A-Za-z0-9]/.test(str);
        const tamanhoSuficiente = str.length >= 6;

        let nivel = "Ruim.";
        let progresso = 0;

        if (tamanhoSuficiente) {
            if (temMaiuscula && temNumero && temSimbolo) {
                nivel = "Perfeito!!";
                progresso = 100;
            } else if (temMaiuscula && temNumero) {
                nivel = "Ótimo!";
                progresso = 80;
            } else if (temMaiuscula) {
                nivel = "Bom.";
                progresso = 40;
            } else {
                nivel = "Aceitável.";
                progresso = 30;
            }
        }

        setNivelDaSenha(nivel);
        setnivelProgressBar(progresso);
        setNewPassword(str);
    }

    function getCorSenha(nivel) {
        switch (nivel) {
            case "Ruim.":
                return "red";
            case "Aceitável.":
                return "orange";
            case "Bom.":
                return "green";
            case "Ótimo!":
                return "blue";
            case "Perfeito!!":
                return "green";
            default:
                return "gray";
        }
    }

    const handleBack = () => {
        if(tipo === 1){
            navigate('/homeInstrutor')
            return;
        }else{
            navigate('/home')
            return;
        }
    }

    //#endregion

    return (
        <div className='flex flex-col gap-2'>
            <ButtonBack event={handleBack} />
            <h1>Olá, {usuario.nome}</h1>
            <h3>Altere sua Senha!</h3>
            <h5>Lembrando, a senha deve ter no minimo 6 e no máximo 12 caracteres!</h5>
            <InputField
                placeholder="Senha Atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                typ={'password'}
            />
            <InputField
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => AlterandoSenhaEVerificando(e.target.value)}
                typ={'password'}
            />
            <h3 style={{ color: getCorSenha(nivelDaSenha) }}>Nível da Senha: {nivelDaSenha}</h3>
            <progress
                className='progressBarPas'
                value={nivelProgressBar}
                max="100"
            ></progress>


            <Button
                onClick={handleChangePassword}
                disabled={loading}

            >
                {loading ? 'Alterando...' : 'Alterar Senha'}
                <span className="material-icons">check</span>
            </Button>
            <ToastContainer position="top-center" />
        </div>
    );
}
