import Login from './pages/Login';
import Home from './pages/Aluno/Home';
import SelectType from './pages/Aluno/SelectType';
import SelectInstructor from './pages/Aluno/SelectInstrutor';
import SelectDateAndHour from './pages/Aluno/SelectDateAndHour';
import Confirm from './pages/Confirm';
import End from './pages/End';
import Erro from './pages/Erro';
import Perfil from './pages/Perfil';
import HomeInstrutor from './pages/Instrutor/HomeInstrutorView';
import ListAulasInstrutor from './pages/Instrutor/ListAulasInstrutorView';
import ListAlunosView from './pages/Instrutor/ListAlunosView';
import SelectVeicle from './pages/Aluno/SelectVeicle';
import CreateAula from './pages/Instrutor/CreateAula';
import SelectAutoescola from './pages/Instrutor/SelectAutoescola';

import Layout from './layout/Layout';

import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Home com Layout */}
          <Route
            path="/home"
            element={
              <Layout back="/" home="">
                <Home />
              </Layout>
            }
          />

          <Route
            path="/selecionarTipo"
            element={
              <Layout back="/home" home="/home">
                <SelectType />
              </Layout>
            }
          />

          <Route
            path="/selecionarAutoescola"
            element={
              <Layout>
                <SelectAutoescola />
              </Layout>
            }
          />

          <Route
            path="/selecionarInstrutor"
            element={
              <Layout back="/selecionarTipo" home="/home">
                <SelectInstructor />
              </Layout>
            }
          />

          <Route
            path="/selecionarVeiculo"
            element={
              <Layout back="/selecionarInstrutor" home="/home">
                <SelectVeicle back="/selecionarInstrutor" home="/home" />
              </Layout>
            }
          />

          <Route
            path="/selecionarDataEHora"
            element={
              <Layout back="/selecionarVeiculo" home="/home">
                <SelectDateAndHour />
              </Layout>
            }
          />

          <Route
            path="/confirmar"
            element={
              <Layout back="/selecionarDataEHora" home="/home">
                <Confirm />
              </Layout>
            }
          />

          <Route
            path="/fim"
            element={
              <End />
            }
          />

          <Route
            path="/erro"
            element={
              <Erro />
            }
          />

          <Route
            path="/perfil"
            element={
              <Layout>
                <Perfil />
              </Layout>
            }
          />

          <Route
            path="/homeinstrutor"
            element={
              <Layout back="/" home="">
                <HomeInstrutor />
              </Layout>
            }
          />

          <Route
            path="/listAulasInstrutor"
            element={
              <Layout back="/homeinstrutor" home="/homeinstrutor" >
                <ListAulasInstrutor />
              </Layout>
            }
          />

          <Route
            path="/listarAlunosInstrutor"
            element={
              <Layout back="/homeinstrutor" home="/homeinstrutor">
                <ListAlunosView />
              </Layout>
            }
          />

          <Route
            path="/criarAula"
            element={
              <Layout back="/listarAlunosInstrutor" home="/homeinstrutor">
                <CreateAula />
              </Layout>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
