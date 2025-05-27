import useGeneric from "./useGeneric";

export default function useAula() {
    const {
        GenericCreate,
        GenericSearch,
        error,
        loading
    } = useGeneric();

    const SearchAndFilterHour = async (instrutor_id, veiculo_id, data) => {
        if (!instrutor_id || !veiculo_id || !data) {
            console.error("Todos os campos são obrigatórios!");
            return false;
        }

        const pesquisa = `?instrutor_id=${instrutor_id}&veiculo_id=${veiculo_id}&data=${data}`;
        const result = await GenericSearch('aulas', 'buscarHorarioLivre', pesquisa);

        return result;
    };

    const InsertClass = async (instrutor_id, aluno_id, data, tipo, hora, veiculo_id, autoescola_id, marcada_por, configuracoes) => {
        if (!instrutor_id || !aluno_id || !data || !tipo || !hora || !veiculo_id || !autoescola_id) {
            console.error("Todos os campos são obrigatórios!");
            return false;
        }

        const body = {
            instrutor_id,
            aluno_id,
            data,
            tipo,
            hora,
            veiculo_id,
            autoescola_id,
            marcada_por,
            configuracoes
        };

        const result = await GenericCreate('aulas', 'inserirAula', body);

        return result;
    };

    const SelectVeicleByInstrutor = async (id_instrutor, type) => {

        if (!id_instrutor || !type) {
            console.error("id_instrutor ou type não encontrado");
            return false; // Melhor retornar false para indicar falha
        }

        const pesquisa = `?instrutor_id=${id_instrutor}&tipo=${type}`;
        const response = await GenericSearch("veiculos", "buscarVeiculos", pesquisa);

        return response;
    };

    const SearchAulas = async (id) => {
        if (!id) {
            console.error("id não encontrado");
            return false;
        }

        const pesquisa = `?id=${id}`
        const result = await GenericSearch("aulas", "buscarAulas", pesquisa);

        return result;
    }

    return {
        SearchAndFilterHour,
        InsertClass,
        SelectVeicleByInstrutor,
        SearchAulas,
        error,
        loading
    };
}
