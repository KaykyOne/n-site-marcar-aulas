import Login from './pages/Login';
import Home from './pages/Home';
import ListAulas from './pages/ListAulas';
import SelectType from './pages/SelectType';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          {/* Página de login */}
          <Route path="/" element={<Login />} />
          {/* Página principal (Home) */}
          <Route path="/home" element={<Home />} />
          {/* Página Listar Aulas (ListAulas) */}
          <Route path="/listarAulas" element={<ListAulas />} />
          {/* Página Selecionar tipo da Aula (SelectType) */}
          <Route path="/selecionarTipo" element={<SelectType />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
