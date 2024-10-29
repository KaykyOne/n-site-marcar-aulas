import Login from './pages/Login';
import Home from './pages/Home';
import ListAulas from './pages/ListAulas';
import SelectType from './pages/SelectType';
import SelectInstructor from './pages/SelectInstrutor';
import SelectDateAndHour from './pages/SelectDateAndHour';
import Confirm from './pages/Confirm';
import End from './pages/End';
import Erro from './pages/Erro';
import Perfil from './pages/Perfil';



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
          {/* Página Selecionar tipo da Aula (Erro) */}
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
