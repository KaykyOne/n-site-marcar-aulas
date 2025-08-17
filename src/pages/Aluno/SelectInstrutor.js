import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Modal, Count, Loading} from '../../NovusUI/All';
import useAulaStore from '../../store/useAulaStore';
import useUserStore from '../../store/useUserStore';
import useInstrutor from '../../hooks/useInstrutor'

export default function SelectInstructor() {

    const { SearchInstrutorByAluno } = useInstrutor();
    //#region Logica
    const { updateAula, aula } = useAulaStore.getState();
    const { usuario } = useUserStore();

    const [instrutores, setInstrutores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            if (!usuario || !aula) {
                showToast('Erro', 'Usuário e Tipo são necessários.');
                return;
            }
            setLoading(true);
            try {
                const instructorsData = await SearchInstrutorByAluno(usuario.usuario_id, aula.tipo, usuario.autoescola_id);
                setInstrutores(instructorsData || []);
            } catch (error) {
                showToast('Erro', 'Ocorreu um erro ao buscar os instrutores.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, [usuario, aula, SearchInstrutorByAluno]);

    const showToast = (title, message) => {
        toast.dismiss();
        toast.error(`${title}: ${message}`, { position: 'top-center' });
    };

    const handleButtonClick = (value) => {
        setSelectedInstructor(value);
        setModalVisible(true);
    };

    const confirmSelection = () => {
        setModalVisible(false);
        if (!selectedInstructor) {
            showToast('Erro', 'Selecione um instrutor primeiro.');
            return;
        }
        updateAula('instrutor', selectedInstructor);
        navigate('/selecionarVeiculo');
    };

    const renderInstrutorItem = (item) => (
        <div className='flex bg-white border border-gray-200 shadow-md p-3 rounded-xl align-middle justify-start gap-3' key={item.instrutor_id} onClick={() => handleButtonClick(item)}>
            <div className='w-full text-start'>
                <h1>Instrutor: </h1>
                <h1 className='font-bold text-4xl capitalize'>{item.nome_instrutor}</h1>
                <Button className='mt-2'>
                    Selecionar
                    <span className="material-icons">arrow_forward_ios</span>
                </Button>
            </div>
        </div >
    );

    const onCancel = () => {
        setModalVisible(false);
        setSelectedInstructor(null);
    };

    //#endregion

    return (
        <div className='flex flex-col gap-5 w-full h-screen justify-center items-center p-3'>
            <Loading visible={loading} />
            <h1 className='text-2xl font-bold'>Selecionar Instrutor</h1>
            <h2 className='greatText'>
                Clique no instrutor que deseja marcar a aula!
            </h2>
            {instrutores.length === 0 ? (
                <div className='flex flex-col'>
                    <p className='text-red-800'>
                        {'Nenhum instrutor encontrado, entre em contato com o suporte!'}
                    </p>
                    <span className="material-icons">
                        error
                    </span>
                </div>
            ) : (
                <div className='flex flex-col gap-3 max-h-[400px] overflow-y-auto w-full max-w-[800px]'>
                    {instrutores.map(renderInstrutorItem)}
                </div>
            )}
            <Count num={2} />
            <Modal
                isOpen={modalVisible}   >
                <p>Você tem certeza que deseja selecionar o instrutor: <strong>{selectedInstructor?.nome_instrutor}</strong></p>
                <Button onClick={confirmSelection} type={4}>Sim
                    <span className="material-icons">
                        check
                    </span></Button>
                <Button onClick={() => onCancel()} type={3}>Não
                    <span className="material-icons">
                        close
                    </span></Button>
            </Modal>

            <ToastContainer />
        </div>
    );
};
