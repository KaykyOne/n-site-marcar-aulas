import { useCallback } from "react";
import useGeneric from "./useGeneric";
import { toast } from "react-toastify";

export default function useAula() {
    const {
        GenericCreate,
        GenericSearch,
        GenericDelete,
        error,
        loading
    } = useGeneric();

    const SearchAndFilterHour = useCallback(async (instrutor_id, veiculo_id, data) => {
        if (!instrutor_id || !veiculo_id || !data) {
            console.log(`${instrutor_id} ${veiculo_id} ${data}`)
            toast.error("Todos os campos são obrigatórios!");
            return false;
        }

        const pesquisa = `?instrutor_id=${instrutor_id}&veiculo_id=${veiculo_id}&data=${data}`;
        const result = await GenericSearch('aulas', 'buscarHorarioLivre', pesquisa);

        return result;
    }, [GenericSearch]);

    const InsertClass = async (aula) => {
        const {
            instrutor_id,
            aluno_id,
            data,
            tipo,
            hora,
            veiculo_id,
            autoescola_id,
            marcada_por,
            configuracoes
        } = aula;

        if (!instrutor_id || !aluno_id || !data || !tipo || !hora || !veiculo_id || !autoescola_id || !marcada_por || !configuracoes) {
            toast.error("Todos os campos obrigatórios devem ser preenchidos!");
            return false;
        }

        const result = await GenericCreate('aulas', 'inserirAula', aula);
        if (result) {
            return result.message;
        } else {
            toast.error("Erro ao cadastrar aula!");
        }

        return result;
    };

    const SelectVeicleByInstrutor = useCallback(async (id_instrutor, type, autoescola_id) => {
        if (!id_instrutor || !type) {
            toast.error("ID do instrutor ou tipo não encontrado!");
            return false;
        }

        const pesquisa = `?instrutor_id=${id_instrutor}&tipo=${type}&autoescola_id=${autoescola_id}`;
        const response = await GenericSearch("veiculos", "buscarVeiculos", pesquisa);

        return response;
    }, [GenericSearch]);

    const SearchAulas = async (id) => {
        if (!id) {
            toast.error("ID não encontrado!");
            return false;
        }

        const pesquisa = `?id=${id}`;
        const result = await GenericSearch("aulas", "buscarAulas", pesquisa);

        return result;
    };

    const DeleteAula = async (aulaA, tempoAntes) => {
        const dados = `aula_id=${aulaA.aula_id}&&data=${aulaA.data}&&hora=${aulaA.hora}&&tempoAntes=${tempoAntes.valor}`;
        const res = await GenericDelete('aulas', 'removerAula', dados);
        console.log(res);
        if (res) {
            toast.warn(res);
        } else {
            toast.error("Erro ao excluir aula!");
        }

        return res;
    };

    return {
        SearchAndFilterHour,
        InsertClass,
        SelectVeicleByInstrutor,
        SearchAulas,
        DeleteAula,
        error,
        loading
    };
}
