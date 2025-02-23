import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { UserModel } from '../../pageModel/UserModel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ListAlunosView() {

    //#region Logica
    const location = useLocation();
    const { usuario, instrutor } = location.state || {}; // Recebe os dados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const userModel = new UserModel();
    const navigate = useNavigate();

    const showToast = (type, message) => {
        toast.dismiss();
        toast[type](message);
    };

    const fetchAlunos = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await userModel.searchAlunos(instrutor.instrutor_id);
            setAlunos(data || []);

            if (!data || data.length === 0) {
                setError('Nenhum aluno encontrado.');
            }
        } catch (error) {
            setError(error.message);
            showToast('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (instrutor) fetchAlunos();
    }, [instrutor]);

    const renderAlunoItem = (aluno) => (
        <div style={styles.itemContainer} key={aluno.usuario_id}>
            <p style={styles.itemTitle}>Nome: {aluno.usuarios?.nome || 'Não especificado'} {aluno.usuarios?.sobrenome || 'Não especificado'}</p>
            <p style={styles.itemText}>Telefone: {aluno.usuarios?.telefone || 'Não especificado'}</p>
        </div>
    );

    //#endregion

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Alunos</h1>
            {loading && <LoadingIndicator />}
            {error || alunos.length === 0 ? (
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error ? `Erro: ${error}` : 'Nenhum aluno encontrado!'}</p>
                </div>
            ) : (
                <div style={styles.listContainer}>{alunos.map(renderAlunoItem)}</div>
            )}
            <button
                style={styles.buttonBack}
                onClick={() => navigate('/homeinstrutor', { state: { usuario, instrutor } })}
            >
                Voltar
            </button>
            <ToastContainer position="top-center" />
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#003366',
    },
    listContainer: {
        width: '100%',
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '10px',
        boxSizing: 'border-box',
    },
    errorContainer: {
        color: 'red',
    },
    itemContainer: {
        backgroundColor: '#D9D9D9',
        borderRadius: '12px',
        padding: '20px',
        margin: '10px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    itemTitle: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    itemText: {
        fontSize: '1em',
    },
    buttonBack: {
        width: '40%',
        backgroundColor: '#0074D9',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: 'bold',
        padding: '15px',
        cursor: 'pointer',
        marginTop: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: 'none',
        transition: 'background 0.3s',
    },
};