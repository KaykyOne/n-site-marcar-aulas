import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PerfilPageModel } from '../pageModel/PerfilPageModel';

export default function Perfil() {
    const { state: { cpf, nome } = {} } = useLocation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const perfilPageModel = new PerfilPageModel();

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres.');
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
            navigate('/home', { state: { cpf, nome } });
        } catch (error) {
            toast.error('Erro ao alterar a senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1>Olá, {nome}</h1>
            <h2>Alterar Senha</h2>
            <InputField
                placeholder="Senha Atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <InputField
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button 
                onClick={handleChangePassword} 
                style={styles.button} 
                disabled={loading}
            >
                {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>

            <button 
                onClick={() => navigate('/home', { state: { cpf } })}
                style={styles.buttonBack} 
                disabled={loading}>
                Voltar
            </button>
            <ToastContainer position="top-center" />
        </div>
    );
}

const InputField = ({ placeholder, value, onChange }) => (
    <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
    />
);

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
        backgroundColor: 'blue',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '5px',
        marginTop: '20px',
        cursor: 'pointer',
        border: 'none',
    },
    buttonBack: {
        backgroundColor: 'gray',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '5px',
        marginTop: '20px',
        cursor: 'pointer',
        border: 'none',
    },
    input: {
        width: '80%',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        fontSize: '1em',
    },
};
