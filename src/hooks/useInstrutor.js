import useInstrutorStore from "../store/useInstrutorStore";
import useGeneric from "./useGeneric";

export default function useInstrutor() {
    const {
        GenericCreate,
        GenericSearch,
        error,
        loading
    } = useGeneric();

    // 🟢 POST - Buscar dados do instrutor
    const GetInstrutor = async (instrutorId) => {
        const setInstrutor = useInstrutorStore.getState().setInstrutor;

        if (!instrutorId) {
            console.warn("ID do instrutor não informado");
            return null;
        }

        const body = { id: instrutorId };
        const result = await GenericCreate('instrutor', 'buscarInstrutor', body);

        if (result) {
            setInstrutor(result);
        }

        return result;
    };

    // 🔵 GET - Buscar alunos do instrutor
    const GetAlunos = async (instrutorId) => {
        if (!instrutorId) {
            console.warn("ID do instrutor não informado");
            return null;
        }

        const query = `?instrutor_id=${instrutorId}`;
        const result = await GenericSearch('instrutor', 'buscarAlunos', query);

        return result;
    };

    // 🔵 GET - Buscar aulas do instrutor por data
    const SearchAulasInstrutor = async (instrutorId, data) => {
        if (!instrutorId || !data) {
            console.warn("ID do instrutor ou data não informado");
            return null;
        }

        const query = `?instrutor_id=${instrutorId}&data=${data}`;
        const result = await GenericSearch('instrutor', 'buscarAulasPorInstrutor', query);

        return result;
    };

    // 🔵 GET - Buscar instrutor por aluno
    const SearchInstrutorByAluno = async (aluno_id, tipo, autoescola_id) => {
        if (!aluno_id || !tipo || !autoescola_id) {
            console.warn("Todos os parâmetros são obrigatórios");
            return null;
        }

        const query = `?aluno_id=${aluno_id}&tipo=${tipo}&autoescola_id=${autoescola_id}`;
        const result = await GenericSearch('instrutor', 'buscarInstrutorPorAluno', query);

        return result;
    };

    return {
        GetInstrutor,
        GetAlunos,
        SearchAulasInstrutor,
        SearchInstrutorByAluno,
        error,
        loading
    };
}
