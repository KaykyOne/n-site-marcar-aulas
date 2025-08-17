import { useNavigate } from 'react-router-dom';
import { Button } from '../NovusUI/All';

export default function EndView() {

  //#region Logica
  const navigate = useNavigate();

  const handleSecondButton = () => {
    navigate('/home');
  };

  const secondClassButton = () => {
    navigate('/selecionarTipo');
  };

  //#endregion

  return (
    <div className='flex h-screen items-center justify-center flex-col gap-3'>
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
