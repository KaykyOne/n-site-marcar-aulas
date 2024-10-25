// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import '../styles/Login.css'; // Arquivo CSS para estilos
import { LoginBack } from '../back/LoginBack';

export default function Login({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const loginBack = new LoginBack(); // Mudar o nome da instância

  useEffect(() => {
    setTimer(0);
    setIsRunning(false);
  }, []);

  const login = async () => {
    if (!cpf) {
      alert('Erro: Por favor, insira o CPF.');
      return;
    }

    setLoading(true);
    try {
      const nome = await loginBack.searchUsersByCPF(cpf);
      if (!nome) {
        alert('Nenhum usuário encontrado com esse CPF.');
      } else {
        navigation.navigate('Home', { nome, cpf });
        setCpf('');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 500000);
      }
    } catch (error) {
      alert('Erro: Ocorreu um erro ao tentar fazer login.');
      console.error(error);
      setCpf('');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setIsRunning(true);
  };

  const goSuport = () => {
    navigation.navigate('Suport');
  };

  const onTimerEnd = () => {
    setCpf('');
    alert("O tempo acabou. O campo CPF foi limpo."); // Avisar quando o timer acabar
  };

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      onTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleCpfChange = (event) => {
    const text = event.target.value;

    // Permitir apenas números
    if (/^\d*$/.test(text) || text === '') {
      setCpf(text);
      if (!isRunning) {
        startTimer();
      }
    }
  };

  return (
    <div className="container">
      <img
        className="image"
        src={require('../imgs/logoAutoEscolaIdeal.png')}
        alt="Logo"
      />
      <input
        type="text"
        placeholder="Digite seu CPF"
        value={cpf}
        onChange={handleCpfChange}
        className="textInput"
        maxLength={11} // Limitar a 11 caracteres (formato CPF)
        aria-label="Campo de CPF" // Acessibilidade
      />
      <button
        className="button"
        onClick={login}
        disabled={loading}
      >
        {loading ? (
          <span className="loader">Carregando...</span>
        ) : (
          'Entrar'
        )}
      </button>

      <button className="link" onClick={goSuport}>
        Não consegue Entrar? Clique aqui!!
      </button>
    </div>
  );
}
