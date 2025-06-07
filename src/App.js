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
import NavBar from './components/NavBar';
import SelectAutoescola from './pages/Instrutor/SelectAutoescola';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          {/* Página de login */}
          <Route path="/" element={<Login />} />

          {/* Página principal (home) */}
          <Route path="/home" element={
            <>
              <Home />
              <NavBar back={'/'} home={''} />
            </>
          } />

          <Route path="/listarAulas" element={
            <>
              <ListAulas />
              <NavBar back={'/home'} home={'/home'} />
            </>
          } />

          <Route path="/selecionarTipo" element={
            <>
              <SelectType />
              <NavBar back={'/home'} home={'/home'} />
            </>
          } />

          <Route path="/selecionarAutoescola" element={
            <>
              <SelectAutoescola />
            </>
          } />

          <Route path="/selecionarInstrutor" element={
            <>
              <SelectInstructor />
              <NavBar back={'/selecionarTipo'} home={'/home'} />
            </>
          } />

          <Route path="/selecionarVeiculo" element={
            <>
              <SelectVeicle />
              <NavBar  back={'/selecionarInstrutor'} home={'/home'} />
            </>
          } />

          <Route path="/selecionarDataEHora" element={
            <>
              <SelectDateAndHour />
              <NavBar back={'/selecionarVeiculo'} home={'/home'} />
            </>
          } />

          <Route path="/confirmar" element={
            <>
              <Confirm />
              <NavBar back={'/selecionarDataEHora'} home={'/home'} />
            </>
          } />

          <Route path="/fim" element={
            <>
              <End />
            </>
          } />

          <Route path="/erro" element={
            <>
              <Erro />
            </>
          } />

          <Route path="/perfil" element={
            <>
              <Perfil />
              <NavBar back={-1} home={-1} />
            </>
          } />

          <Route path="/homeinstrutor" element={
            <>
              <HomeInstrutor />
              <NavBar back={'/'} home={''} />
            </>
          } />

          <Route path="/listAulasInstrutor" element={
            <>
              <ListAulasInstrutor />
              <NavBar back={'/homeinstrutor'} home={'/homeinstrutor'} />
            </>
          } />

          <Route path="/listarAlunosInstrutor" element={
            <>
              <ListAlunosView />
              <NavBar back={'/homeinstrutor'} home={'/homeinstrutor'} />
            </>
          } />

          <Route path="/criarAula" element={
            <>
              <CreateAula />
              <NavBar back={'/listarAlunosInstrutor'} home={'/homeinstrutor'} />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
