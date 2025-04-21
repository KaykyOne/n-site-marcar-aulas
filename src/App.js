import Login from './pages/Login';
import Home from './pages/Aluno/Home';
import ListAulas from './pages/Aluno/ListAulas';
import SelectType from './pages/Aluno/SelectType';
import SelectInstructor from './pages/Aluno/SelectInstrutor';
import SelectDateAndHour from './pages/SelectDateAndHour';
import Confirm from './pages/Confirm';
import End from './pages/End';
import Erro from './pages/Erro';
import Perfil from './pages/Perfil';
import HomeInstrutor from './pages/Instrutor/HomeInstrutorView';
import ListAulasInstrutor from './pages/Instrutor/ListAulasInstrutorView';
import ListAlunosView from './pages/Instrutor/ListAlunosView';
import SelectVeicle from './pages/Aluno/SelectVeicle';
import CreateAula from './pages/Instrutor/CreateAula';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          {/* Página de login */}
          <Route path="/" element={<Login />} />
          {/* Página principal (home) */}
          <Route path="/home" element={<Home />} />
          {/* Página Listar Aulas (listarAulas) */}
          <Route path="/listarAulas" element={<ListAulas />} />
          {/* Página Selecionar tipo da Aula (selecionarTipo) */}
          <Route path="/selecionarTipo" element={<SelectType />} />
          {/* Página Selecionar tipo da Aula (selecionarInstrutor) */}
          <Route path="/selecionarInstrutor" element={<SelectInstructor />} />
          {/* Página Selecionar tipo da Aula (selecionarDataEHora) */}
          <Route path="/selecionarDataEHora" element={<SelectDateAndHour />} />
          {/* Página Selecionar tipo da Aula (confirmar) */}
          <Route path="/confirmar" element={<Confirm />} />
          {/* Página Selecionar tipo da Aula (Fim) */}
          <Route path="/fim" element={<End />} />
          {/* Página Selecionar tipo da Aula (Erro) */}
          <Route path="/erro" element={<Erro />} />
          {/* Página Perfil */}
          <Route path="/perfil" element={<Perfil />} />
          {/* Página Home Instrutor */}
          <Route path="/homeinstrutor" element={<HomeInstrutor />} />
          {/* Página de Selecionar o Aluno */}
          <Route path="/listAulasInstrutor" element={<ListAulasInstrutor />} />
          {/* Página de Listar Os Alunos do instrutor o Aluno */}
          <Route path="/listarAlunosInstrutor" element={<ListAlunosView />} />
          {/* Página de Listar Os veiculos do instrutor ao Aluno */}
          <Route path="/selecionarVeiculo" element={<SelectVeicle />} />
          {/* Página de Listar Os veiculos do instrutor ao Aluno */}
          <Route path="/criarAula" element={<CreateAula />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
