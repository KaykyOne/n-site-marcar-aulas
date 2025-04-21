import useInstrutorStore from "../store/useInstrutorStore"; 
const urlBack = process.env.REACT_APP_URL_BACK;

const GetInstrutor = async (instrutorId) => {
    const setInstrutor = useInstrutorStore.getState().setInstrutor;

    if (!instrutorId) {
        console.warn("ID do instrutor não informado");
        return null; 
    }

    try {
        const response = await fetch(`${urlBack}/buscarInstrutor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: instrutorId }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn("Instrutor não encontrado");
            } else {
                console.error("Erro ao buscar instrutor:", response.statusText);
            }
            return null;
        }

        const data = await response.json();
        setInstrutor(data);
        return data;

    } catch (err) {
        console.error("Erro na requisição:", err);
        return null;
    }
};

const GetAlunos = async (instrutorId) => {
    if (!instrutorId) {
        console.warn("ID do instrutor não informado");
        return null; 
    }

    try {
        const response = await fetch(`${urlBack}/buscarAlunos?instrutor_id=${instrutorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Erro na requisição:", err);
        return null;
    }
};

const SearchAulasInstrutor = async (instrutorId, data) => {
    if (!instrutorId || !data) {
        console.warn("ID do instrutor ou data não informado");
        return null; 
    }

    try {
        const response = await fetch(`${urlBack}/buscarAulasPorInstrutor?instrutor_id=${instrutorId}&data=${data}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }

        const res = await response.json();
        return res;

    } catch (err) {
        console.error("Erro na requisição:", err);
        return null;
    }
};


export { GetInstrutor, GetAlunos, SearchAulasInstrutor };
