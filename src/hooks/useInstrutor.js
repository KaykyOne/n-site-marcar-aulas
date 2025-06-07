import { useCallback } from "react";
import useInstrutorStore from "../store/useInstrutorStore";
import useGeneric from "./useGeneric";
import { toast } from "react-toastify";

// Pega o autoescola_id do sessionStorage
const getAutoescolaId = () => {
    const id = sessionStorage.getItem("autoescola_id");
    return id ? parseInt(id) : null;
};

export default function useInstrutor() {
    const {
        GenericCreate,
        GenericSearch,
        loading
    } = useGeneric();

    const GetInstrutor = async (instrutorId) => {
        const setInstrutor = useInstrutorStore.getState().setInstrutor;

        if (!instrutorId) {
            toast.error("ID do instrutor não informado!");
            return null;
        }

        const body = { id: instrutorId };
        const result = await GenericCreate('instrutor', 'buscarInstrutor', body);

        if (result.success) {
            setInstrutor(result.data);
            return result.data;
        } else {
            return result;
        }
    };

    const GetAlunos = async (instrutorId) => {
        const autoescola_id = getAutoescolaId();

        if (!instrutorId || !autoescola_id) {
            toast.error("ID do instrutor ou autoescola não informado!");
            return null;
        }

        const query = `?instrutor_id=${instrutorId}&autoescola_id=${autoescola_id}`;
        const result = await GenericSearch('instrutor', 'buscarAlunos', query);

        if (result.success) {
            return result.data

        } else {

            return result;
        }
    };

    const SearchAulasInstrutor = async (instrutorId, data) => {
        const autoescola_id = getAutoescolaId();

        if (!instrutorId || !data || !autoescola_id) {
            toast.error("ID do instrutor, data ou autoescola não informado!");
            return null;
        }

        const query = `?instrutor_id=${instrutorId}&data=${data}&autoescola_id=${autoescola_id}`;
        const result = await GenericSearch('instrutor', 'buscarAulasPorInstrutor', query);

        if (result.success) {
            return result.data

        } else {

            return result;
        }
    };

    const SearchInstrutorByAluno = useCallback(async (aluno_id, tipo) => {
        const autoescola_id = getAutoescolaId();

        if (!aluno_id || !tipo || !autoescola_id) {
            toast.error("Todos os parâmetros são obrigatórios!");
            return null;
        }

        const query = `?aluno_id=${aluno_id}&tipo=${tipo}&autoescola_id=${autoescola_id}`;
        const result = await GenericSearch('instrutor', 'buscarInstrutorPorAluno', query);
        if (!result) {
            toast.error("Erro ao buscar instrutor do aluno.");
            return null;
        }

        return result.data;
    }, [GenericSearch]);

    const GetAutoescolas = useCallback(async (instrutor_id) => {
        if (!instrutor_id) {
            toast.error("ID do instrutor obrigatório!");
            return null;
        }

        const query = `?instrutor_id=${instrutor_id}`;
        const result = await GenericSearch('instrutor', 'buscarAutoescolas', query);

        if (result.success) {
            return result.data

        } else {

            return result;
        }

    }, [GenericSearch]);

    return {
        GetInstrutor,
        GetAlunos,
        SearchAulasInstrutor,
        SearchInstrutorByAluno,
        GetAutoescolas,
        loading
    };
}
