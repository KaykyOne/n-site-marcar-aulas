import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { SelectAlunoPageModel } from '../../pageModel/SelectAlunoPageModel';
import InputField from '../../components/Input';
import { toast, ToastContainer } from 'react-toastify';
import Cripto from '../../controller/Cripto';
import LoadingIndicator from '../LoadingIndicator';
import ModalConfirm from '../../components/ModalConfirm';

export default function SelectAlunoView() {
  const location = useLocation();
  const { nome, codigo } = location.state || {};
  const [cpf, setCPF] = useState('');
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const selectAlunoPageModel = new SelectAlunoPageModel();
  const [selectedOption, setSelectedOption] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alunoNome, setAlunoNome] = useState(''); // Novo estado para armazenar o nome do aluno

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    toast.dismiss(); // Remove todos os toasts anteriores
    toast[type](`${text1}: ${text2}`);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmModalConfirm = () => {
    if (alunoNome) {
      const cpfCriptaddo = Cripto(cpf);
      navigate(`/selecionarDataEHora`, {
        state: {
          cpf: cpfCriptaddo,
          type: selectedOption,
          nameInstructor: nome,
          nome: alunoNome, // Usando alunoNome corretamente
          tipo: 'adm',
          codigo: codigo,
        },
      });
    } else {
      console.error('Erro: Nome do aluno vazio.');
      showToast('error', 'Erro', 'Nome do aluno não encontrado.');
    }
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

      const aluno = await selectAlunoPageModel.searchUsersByCPF(cpf, codigo);
      if (aluno) {
        setAlunoNome(`${aluno.nome} ${aluno.sobrenome}`); // Armazenando o nome do aluno
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
    // console.log(nome);
    // console.log(codigo);

    const fetchCategorias = async () => {
      if (!codigo) {
        showToast('error', 'O código é necessário.', 'Erro');
        return;
      }

      setLoading(true);
      try {
        const categoriasData = await selectAlunoPageModel.searchCategoriaInstrutor(codigo);

        if (categoriasData && categoriasData.tipo_instrutor) {
          const categoria = categoriasData.tipo_instrutor.trim(); // Remove espaços extras
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
  }, [codigo]);

  return (
    <div style={styles.container}>
      <LoadingIndicator visible={loading} />
      <h1 style={styles.title}>Selecionar Aluno</h1>
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
        style={styles.select}
      >
        <option value="">Selecione o tipo da aula</option>
        {categorias.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Button
        styleAct={styles.buttonBack}
        onClick={handleClick}
        back="blue" cor="#FFF"
      >
        Avançar
      </Button>
      <Button
        styleAct={styles.buttonBack}
        onClick={() => navigate(`/homeinstrutor`, { state: { codigo, nome } })}
        back="gray" cor="#FFF"
      >
        Voltar
      </Button>

      {isModalVisible && (
        <div style={styles.modalContent}>
          <p>{modalMessage}</p>
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

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Sombra mais visível
    textAlign: 'center',
  },
  select: {
    width: '80%',
    padding: '12px',
    fontSize: '1.1em',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'border 0.3s',
  },
  title: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#003366',
  },
  buttonBack: {
    backgroundColor: '#0074D9',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background 0.3s',
  },
};
