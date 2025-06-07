import { useState, useEffect } from 'react';
import useInstrutorStore from '../../store/useInstrutorStore';
import useUserStore from '../../store/useUserStore';
import Select from '../../components/Select';
import InputField from '../../components/Input';
import ButtonBack from '../../components/ButtonBack';
import DateTimePicker from '../../components/DateTimePicker';
import Button from '../../components/Button';
import { toast, ToastContainer } from 'react-toastify';

import { useNavigate, useLocation } from 'react-router-dom';
import useAula from '../../hooks/useAula';


export default function CreateAula() {

    const { SelectVeicleByInstrutor, SearchAndFilterHour, InsertClass } = useAula();

    const getAutoescolaId = () => {
        const id = sessionStorage.getItem("autoescola_id");
        return id ? parseInt(id) : null;
    };

    const navigate = useNavigate();
    const location = useLocation();
    const { aluno } = location.state || {};
    const { instrutor } = useInstrutorStore();
    const { usuario } = useUserStore();
    const categoria = instrutor.tipo_instrutor;

    const [selectedTipo, setTipo] = useState('');
    const [selectedVeiculo, setVeiculo] = useState('');
    const [selectedHora, setHora] = useState('');

    const categorias = categoria.split("");
    const [veiculos, setVeiculos] = useState([]);
    const [horas, setHoras] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(null);

    const showToast = (type, text1, text2) => {
        toast.dismiss();  // Remove todos os toasts anteriores
        toast[type](`${text1}: ${text2}`);
    };

    const changeComboTipo = (item) => {
        setTipo(item)
    }

    const changeComboVeiculo = (item) => {
        setVeiculo(item)
    }

    const changComboHora = (item) => {
        setHora(item)
    }

    const changeData = (novaData) => {
        setDataSelecionada(novaData);
    };

    const createAula = async () => {

        if (!selectedTipo || !selectedVeiculo || !selectedHora || !dataSelecionada) {
            showToast('error', 'Campos obrigatórios', 'Preencha todos os campos antes de continuar!');
            return;
        }

        const veiculoSelecionado = veiculos.find(v => v.placa === selectedVeiculo);
        const idDoVeiculo = veiculoSelecionado?.veiculo_id;

        if (!idDoVeiculo) {
            showToast('error', 'Veículo inválido', 'Selecione um veículo válido!');
            return;
        }
        const autoescola_id = getAutoescolaId();
        // console.log(aluno);
        // console.log(instrutor);
        // console.log(usuario);

        const aula1 = {
            instrutor_id: instrutor.instrutor_id,
            aluno_id: aluno.usuario_id,
            data: dataSelecionada,
            tipo: selectedTipo,
            hora: selectedHora,
            veiculo_id: idDoVeiculo,
            autoescola_id: autoescola_id,
            marcada_por: 2,
            configuracoes: usuario.configuracoes
        };

        const result = await InsertClass(aula1);

        if (result.success) {
            showToast('success', 'Sucesso', 'Aula marcada com sucesso!');
            setHora('');
            setVeiculo('');
            setTipo('');
        } else {
            showToast('error', 'Erro ao criar aula', result.error);
        }
    };

    useEffect(() => {
        if (!selectedTipo || !selectedVeiculo || !dataSelecionada) return;
        const searchHoras = async () => {
            const veiculoSelecionado = veiculos.find(v => v.placa === selectedVeiculo);
            const idDoVeiculo = veiculoSelecionado?.veiculo_id;
            const response = await SearchAndFilterHour(instrutor.instrutor_id, idDoVeiculo, dataSelecionada);
            setHoras(response);
        }
        searchHoras();
    }, [selectedTipo, selectedVeiculo, dataSelecionada, SearchAndFilterHour])

    useEffect(() => {
        // console.log(usuario)
        const autoescola_id = getAutoescolaId();
        if (!selectedTipo) return;
        const searchVeiculos = async () => {
            const response = await SelectVeicleByInstrutor(instrutor.instrutor_id, selectedTipo, autoescola_id);
            setVeiculos(response || []);
        }
        searchVeiculos();
    }, [selectedTipo, SelectVeicleByInstrutor])

    return (
        <div className='flex flex-col text-start h-screen justify-center'>
            <h1 className='text-2xl font-bold w-full text-center'>Marcar Aula</h1>
            <div id='form' className='flex flex-col mt-5 gap-1'>
                <h1 className='font-bold'>Aluno:</h1>
                <InputField
                    disabled={true}
                    value={`${aluno.nome} ${aluno.sobrenome}`}
                    className='capitalize' />
                <h1 className='font-bold'>Tipo da Aula:</h1>
                <Select
                    value={selectedTipo}
                    onChange={(a) => changeComboTipo(a.target.value)}
                    options={categorias}
                    placeholder={"Seleciona o tipo da aula!"} />
                <h1 className='font-bold'>Veículo:</h1>
                <Select
                    value={selectedVeiculo}
                    onChange={(a) => changeComboVeiculo(a.target.value)}
                    options={veiculos.map(v => v.placa)}
                    placeholder={"Selecione o Veículo:"} />
                <h1 className='font-bold'>Data:</h1>
                <DateTimePicker onChange={changeData} />
                <h1 className='font-bold'>Hora:</h1>
                <Select
                    value={selectedHora}
                    onChange={(a) => changComboHora(a.target.value)}
                    options={horas}
                    placeholder={"Selecione a Hora:"} />
                <Button className='mt-2' onClick={createAula}>
                    Finalizar
                    <span className="material-icons">
                        check
                    </span>
                </Button>
            </div>
            <ToastContainer position="top-center" />
        </div>
    )
}
