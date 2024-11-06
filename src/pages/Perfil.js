import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PerfilPageModel } from '../pageModel/PerfilPageModel';
import InputField from '../components/Input';

export default function Perfil() {
    const { state: { cpf, nome } = {} } = useLocation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const perfilPageModel = new PerfilPageModel();

    const handleChangePassword = async () => {
        if (newPassword.length < 6 || newPassword.length > 12) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres e no máximo 12.');
            return;
        }

        setLoading(true);
        try {
            const senhaAlterada = await perfilPageModel.alterarSenha(cpf, currentPassword, newPassword);
            if (!senhaAlterada) {
                toast.error('Senha atual incorreta');
                return;
            }
            toast.success('Senha alterada com sucesso!');
            setInterval(() => {
                navigate('/home', { state: { cpf, nome } });
            }, 3000);

        } catch (error) {
            toast.error('Erro ao alterar a senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1>Olá, {nome}</h1>
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
                onChange={(e) => setNewPassword(e.target.value)}
                typ={'password'}
            />       
            <button 
                onClick={handleChangePassword} 
                style={styles.button} 
                disabled={loading}
            >
                {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>

            <button 
                onClick={() => navigate('/home', { state: { cpf, nome } })}
                style={styles.buttonBack} 
                disabled={loading}>
                Voltar
            </button>
            <ToastContainer position="top-center" />
        </div>
    );
}


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        height: '100vh',
        justifyContent: 'center',
        textAlign: 'center',
    },
    button: {
        width: '80%',
        backgroundColor: '#0056b3', // Azul corporativo
        color: '#fff',
        borderRadius: '10px',
        padding: '12px',
        cursor: 'pointer',
        marginTop: '15px',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background 0.3s',
    },
    buttonBack: {
        width: '80%',
        backgroundColor: 'gray', // Azul corporativo
        color: '#fff',
        borderRadius: '10px',
        padding: '12px',
        cursor: 'pointer',
        marginTop: '15px',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background 0.3s',
    },

};
