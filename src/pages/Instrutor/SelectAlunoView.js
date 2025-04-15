import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserModel } from '../../pageModel/UserModel';
import InputField from '../../components/Input';
import { toast, ToastContainer } from 'react-toastify';
import Cripto from '../../controller/Cripto';
import LoadingIndicator from '../../components/LoadingIndicator';
import ModalConfirm from '../../components/ModalConfirm';

export default function SelectAlunoView() {
  const location = useLocation();
  const { usuario, instrutor } = location.state || {};
  const [cpf, setCPF] = useState('');
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const userModel = new UserModel();
  const [selectedOption, setSelectedOption] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alunoNome, setAlunoNome] = useState('');
  const [telefoneAluno, setTelefoneAluno] = useState('');

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    toast.dismiss();
    toast[type](`${text1}: ${text2}`);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmModalConfirm = () => {
    // lógica da navegação pode ser inserida aqui
    setConfirmModalVisible(false);
  };

  const handleCancelModalConfirm = () => {
    setConfirmModalVisible(false);
  };

  const handleClick = async () => {
    try {
      if (isNullOrEmpty(cpf)) {
        showToast('error', 'Esqueceu de colocar o CPF do Aluno!', 'ERRO');
        return;
      }

      if (isNullOrEmpty(selectedOption)) {
        showToast('error', 'Esqueceu de selecionar o tipo da Aula!', 'ERRO');
        return;
      }

      const aluno = await userModel.searchUsersByCPF(cpf);
      if (aluno) {
        setAlunoNome(`${aluno.nome} ${aluno.sobrenome}`);
        setTelefoneAluno(aluno.telefone);
        setModalMessage(`Aluno encontrado: ${aluno.nome} ${aluno.sobrenome}`);
        setConfirmModalVisible(true);
      } else {
        showToast('error', 'Erro', 'Aluno não encontrado ou relação inválida.');
      }
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      showToast('error', 'Erro', 'Não foi possível buscar o aluno.');
    }
  };

  function isNullOrEmpty(value) {
    return value === null || value === undefined || value === '';
  }

  const handleCpfChange = (event) => {
    const text = event.target.value;
    if (/^\d+$/.test(text)) {
      setCPF(text);
    } else {
      showToast('error', 'Erro', 'O CPF deve conter apenas números!');
      setCPF('');
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!instrutor) {
        showToast('error', 'O código é necessário.', 'Erro');
        return;
      }

      setLoading(true);
      try {
        const categoriasData = instrutor.tipo_instrutor;

        if (categoriasData && categoriasData.tipo_instrutor) {
          const categoria = categoriasData.tipo_instrutor.trim();
          setCategorias(categoria.split('').map((char) => char.toUpperCase()));
        } else {
          console.error('tipo_instrutor não encontrado ou inválido:', categoriasData);
          showToast('error', 'Nenhuma categoria válida encontrada.', 'Erro');
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        showToast('error', 'Erro ao buscar categorias.', 'Erro');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [instrutor]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <LoadingIndicator visible={loading} />
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Selecionar Aluno</h1>

      <InputField
        typ="text"
        placeholder="Digite seu CPF"
        inputMode="numeric"
        value={cpf}
        onChange={handleCpfChange}
      />

      <select
        id="comboBox"
        value={selectedOption}
        onChange={handleChange}
        className="w-4/5 p-3 mb-5 text-lg bg-white border border-gray-300 rounded-lg shadow-sm"
      >
        <option value="">Selecione o tipo da aula</option>
        {categorias.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <Button
        onClick={handleClick}
        back="blue"
        cor="#FFF"
        className="mb-4"
      >
        Avançar
      </Button>

      <Button
        onClick={() => navigate(`/homeinstrutor`, { state: { usuario, instrutor } })}
        back="gray"
        cor="#FFF"
        className="mb-4"
      >
        Voltar
      </Button>

      {telefoneAluno && (
        <Button
          onClick={() => {
            const numero = telefoneAluno.replace(/\D/g, '');
            const mensagem = encodeURIComponent(`Olá ${alunoNome}, tudo bem?`);
            window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank');
          }}
          back="green"
          cor="#FFF"
        >
          Chamar no WhatsApp
        </Button>
      )}

      {isModalVisible && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="mb-4">{modalMessage}</p>
          <Button onClick={() => setModalVisible(false)} back="#0056b3" cor="#FFF">
            Fechar
          </Button>
        </div>
      )}

      {isConfirmModalVisible && (
        <ModalConfirm
          message={modalMessage}
          onConfirm={handleConfirmModalConfirm}
          onCancel={handleCancelModalConfirm}
        />
      )}

      <ToastContainer position="top-center" />
    </div>
  );
}
