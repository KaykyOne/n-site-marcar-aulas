import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button'; // Importe o componente Button
import useInstrutorStore from '../../store/useInstrutorStore';

export default function HomeInstrutorView() {

  const { instrutor } = useInstrutorStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const alterPage = async (page) => {
    setLoading(true);
    try {
      if (instrutor.atividade_instrutor === true) {
        navigate(`/${page}`);
      }

    } finally {
      setLoading(false);
    }
  };

  //#endregion

  return (
    <div className='flex flex-col gap-3 h-screen justify-center items-center'>
      <h1 className='font-bold text-2xl capitalize'>Bem-vindo, {instrutor.nome_instrutor}!</h1>  
      <Button onClick={() => alterPage('listAulasInstrutor')} type={1}>
        Aulas
        <span className="material-icons">directions_car</span>
      </Button>
      <Button onClick={() => alterPage('listarAlunosInstrutor')} type={1}>
        Alunos
        <span className="material-icons">groups</span>
      </Button>
      <Button onClick={() => navigate(`/perfil`, { state: { tipo: 1 } })} type={1}>
        Alterar Senha
        <span className="material-icons">key</span>
      </Button>

      <LoadingIndicator visible={loading} />
      <ToastContainer position="top-center" />
    </div>
  );
};