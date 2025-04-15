import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';

export default function EndView() {

  //#region Logica
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, configs, instrutor, tipo = 'normal' } = location.state || {}; // Obtém o parâmetro 'cpf' da navegação anterior

  const handleSecondButton = () => {
    navigate('/');
  };

  const secondClassButton = () => {
    if (tipo === 'adm') {
      navigate('/homeinstrutor', { state: { usuario, configs, instrutor } });
    } else {
      navigate('/selecionarTipo', { state: { usuario, configs } });
    }
  };

  //#endregion

  return (
    <div className='flex flex-col gap-3'>
      <h1>Sucesso!</h1>
      <Button onClick={handleSecondButton} type={4}>Início
        <span className="material-icons">
          home
        </span></Button>
      <Button onClick={secondClassButton} type={1}>Marcar Outra Aula
        <span className="material-icons">
          replay
        </span></Button>
    </div >
  );
};
