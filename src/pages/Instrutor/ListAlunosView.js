import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Loading } from '../../NovusUI/All';


import useInstrutorStore from '../../store/useInstrutorStore';
import useInstrutor from '../../hooks/useInstrutor';

export default function ListAlunosView() {

    const { GetAlunos } = useInstrutor()

    const { instrutor } = useInstrutorStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const navigate = useNavigate();
    const mensagem = encodeURIComponent('Olá! Vamos marcar uma Aula?');

    const showToast = (type, message) => {
        toast.dismiss();
        toast[type](message);
    };

    const fetchAlunos = useCallback(async () => {
        setLoading(true);
        setError(null);
        // console.log('data')
        try {
            const data = await GetAlunos(instrutor.instrutor_id);
            setAlunos(data || []);
            setAlunosFiltrados(data || []);
            // console.log(data)
            if (!data || data.length === 0) {
                setError('Nenhum aluno encontrado.');
            }
        } catch (error) {
            setError(error.message);
            showToast('error', error.message);
        } finally {
            setLoading(false);
        }
    }, [instrutor.instrutor_id]);

    useEffect(() => {
        if (instrutor) fetchAlunos();
    }, []);

    const renderAlunoItem = (aluno) => (
        <div
            key={aluno.usuario_id}
            className=" border border-gray-300 rounded-xl p-4 mb-4 shadow-sm bg-white">

            <p className="font-semibold text-lg text-gray-800 capitalize">
                {aluno.nome || 'Não especificado'} {aluno.sobrenome || 'Não especificado'}
            </p>

            <div className='flex flex-col gap-2'>
                <Button type={2} onClick={() => window.open(`https://wa.me/55${aluno.telefone}?text=${mensagem}?`, '_blank')}>
                    Entrar em Contato
                    <span className="material-icons">forum</span>
                </Button>
                <Button onClick={() => marcarAula(aluno)}>
                    Marcar Aula
                    <span className="material-icons">add</span>
                </Button>
            </div>
        </div>
    );

    const marcarAula = (aluno) => {
        navigate('/criarAula', { state: { aluno } });
    }

    const pesquisarAluno = (valor) => {
        if (valor === null) {
            setAlunosFiltrados(alunos);
        }
        const res = alunos.filter((aluno) => {
            const nomeCompleto = `${aluno.nome || ''} ${aluno.sobrenome || ''}`.toLowerCase();
            return nomeCompleto.includes(valor.toLowerCase());
        });
        setAlunosFiltrados(res);
    };


    return (
        <div className="flex flex-col max-w-[800px] h-full p-6 gap-2 mt-16">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Lista de Alunos</h1>
            <Input onChange={(e) => pesquisarAluno(e.target.value)} placeholder={'Nome...'} />
            <h1 className='font-medium mb-6 text-start text-gray-900'>Contagem de Alunos Ativos: <strong>{alunos.length}</strong></h1>
            {loading && <Loading />}
            {error || alunos.length === 0 ? (
                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-4 text-center">
                    <p>{error ? `Erro: ${error}` : 'Nenhum aluno encontrado!'}</p>
                </div>
            ) : (
                <div className="flex flex-col max-h-[500px] overflow-y-auto w-full">
                    {alunosFiltrados.length > 0 ? (
                        alunosFiltrados.map(renderAlunoItem)
                    ) : (
                        <div className="h-[100px] w-full" />
                    )}
                </div>

            )}

            <ToastContainer position="top-center" />

        </div>
    );
}
