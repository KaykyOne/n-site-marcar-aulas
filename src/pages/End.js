import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';

export default function EndView(){

  //#region Logica
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, configs, instrutor, tipo = 'normal' } = location.state || {}; // Obtém o parâmetro 'cpf' da navegação anterior

  const handleSecondButton = () => {
    navigate('/');
  };

  const secondClassButton = () => {
    if(tipo == 'adm'){
      navigate('/homeinstrutor', { state: { usuario, configs, instrutor } });
    }else{
      navigate('/selecionarTipo', { state: { usuario, configs } });
    }
  };

  //#endregion

  return (
    <div className='container'>
      <h1>Sucesso!</h1>

      <Button back={'#2A8C68'} onClick={handleSecondButton}>
        Início
      </Button>
      <Button onClick={secondClassButton}>
        Marcar Outra Aula
      </Button>
    </div>
  );
};
