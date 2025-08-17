import { useState } from "react";
import { useCallback } from "react";
import useGeneric from "./useGeneric";
import { toast } from "react-toastify";

export default function useAula() {
    const {
        GenericCreate,
        GenericSearch,
        GenericDelete,
        loading
    } = useGeneric();

    const [aulas, setAulas] = useState([]);

    const iconsButton = {
        A: "two_wheeler",
        B: "directions_car",
        C: "local_shipping",
        D: "directions_bus",
        E: "local_shipping"
    };
    const nameTips = {
        A: "moto",
        B: "carro",
        C: "caminhao",
        D: "onibus",
        E: "carreta"
    };
    function faixaDeAulas(qtd) {
        if (qtd >= 20) return "concluido";
        if (qtd >= 15) return "finalizando..";
        if (qtd >= 10) return "avançando...";
        if (qtd <= 5) return "inicio!";
        return "nenhuma aula registrada!";
    }

    const SearchAndFilterHour = useCallback(async (instrutor_id, veiculo_id, data) => {
        if (!instrutor_id || !veiculo_id || !data) {
            console.log(`${instrutor_id} ${veiculo_id} ${data}`)
            toast.error("Todos os campos são obrigatórios!");
            return false;
        }

        const pesquisa = `?instrutor_id=${instrutor_id}&veiculo_id=${veiculo_id}&data=${data}`;
        const result = await GenericSearch('aulas', 'buscarHorarioLivre', pesquisa);
        if (result.success) {
            return result.data;
        } else {
            toast.error("Erro ao buscar horários disponíveis.");
            return result;
        }


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

        // console.log({
        //     instrutor_id,
        //     aluno_id,
        //     data,
        //     tipo,
        //     hora,
        //     veiculo_id,
        //     autoescola_id,
        //     marcada_por,
        //     configuracoes
        // });

        if (!instrutor_id || !aluno_id || !data || !tipo || !hora || !veiculo_id || !autoescola_id || !marcada_por || !configuracoes) {
            toast.error("Todos os campos obrigatórios devem ser preenchidos!");
            return false;
        }

        const result = await GenericCreate('aulas', 'inserirAula', aula);
        console.log(result);
        if (result?.message) {
            toast.success("Aula cadastrada com sucesso!");
            return result;
        } else {
            toast.error(result?.error || "Erro ao cadastrar aula!");
            return result;
        }
    };
    const SelectVeicleByInstrutor = useCallback(async (id_instrutor, type, autoescola_id) => {
        if (!id_instrutor || !type || !autoescola_id) {
            toast.error("ID do instrutor, tipo ou autoescola não encontrado!");
            return false;
        }


        const pesquisa = `?instrutor_id=${id_instrutor}&tipo=${type}&autoescola_id=${autoescola_id}`;
        const response = await GenericSearch("veiculos", "buscarVeiculos", pesquisa);
        if (response.success) {
            return response.data;
        } else {
            toast.error("Erro ao buscar veículos.");
            return response;
        }
    }, [GenericSearch]);
    const SearchAulas = async (id) => {
        if (!id) {
            toast.error("ID não encontrado!");
            return false;
        }

        const pesquisa = `?id=${id}`;
        const result = await GenericSearch("aulas", "buscarAulas", pesquisa);

        if (result.success) {
            setAulas(result.data);
        } else {
            toast.error("Erro ao buscar aulas.");
            setAulas([]);
        }


    };
    const DeleteAula = async (aulaA, tempoAntes) => {
        const dados = `aula_id=${aulaA.aula_id}&&data=${aulaA.data}&&hora=${aulaA.hora}&&tempoAntes=${tempoAntes.valor}`;
        const res = await GenericDelete('aulas', 'removerAula', dados);

        if (res.success) {
            toast.warn(res.data);
            return res;
        } else {
            toast.error("Erro ao excluir aula!");
            return false;
        }
    };
    const RenderTotalAulas = ({ categorias }) => {
        return (
            <div className='flex gap-2 justify-center items-center flex-wrap w-full'>
                {(categorias || []).map((item) =>
                    <div key={item} className='flex max-h-[40vh] flex-1 bg-primary text-[#ffa6ec] hover:shadow-2xl transition-all duration-300 rounded-md ms-center min-w-[120px] shadow-md text-start cursor-pointer gap-4'>
                        <div className="p-3 flex flex-col -space-y-1">
                            <h1 className="w-full text-start mb-3">...</h1>
                            <div className='flex gap-1 items-center'>
                                <h1 className='font-normal text-sm capitalize'>{nameTips[item.toUpperCase()]}</h1>
                                <span className="material-icons">
                                    {iconsButton[(item.toUpperCase() || "").toUpperCase()] || ""}
                                </span>
                            </div>
                            <h2 className='font-semibold text-[#ffdef8] text-xl capitalize'>
                                {faixaDeAulas((aulas || []).filter((a) => a.tipo.toLowerCase() == item.toLowerCase()).length)}
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        )
    };

    return {
        SearchAndFilterHour,
        InsertClass,
        SelectVeicleByInstrutor,
        SearchAulas,
        aulas,
        DeleteAula,
        RenderTotalAulas,
        loading
    };
}
