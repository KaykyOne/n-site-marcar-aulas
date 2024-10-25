import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// Componente de página não encontrada
const NotFound = () => <h2>404 - Página não encontrada</h2>;

function App() {
  return (
    <div>
      <Router basename="/site-marcar-aulas"> {/* Adicione o basename aqui */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
