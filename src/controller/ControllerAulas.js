const urlBack = process.env.REACT_APP_URL_BACK;

const SearchAndFilterHour = async (instrutor_id, veiculo_id, data) => {
    if (!instrutor_id || !veiculo_id || !data) {
        console.error("id do usuario é necessário!");
        return false;
    }

    try {
        const response = await fetch(`${urlBack}/buscarHorarioLivre?instrutor_id=${instrutor_id}&veiculo_id=${veiculo_id}&data=${data}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 304) {
            console.log("Dados não modificados, mantendo os dados locais.");
            return true;
        }

        const result = await response.json(); // ✅ Nome alterado para `result`

        return result;

    } catch (err) {
        console.error("Erro na requisição:", err);
        return false;
    }
};

const InsertClass = async (instrutor_id, aluno_id, data, tipo, hora, veiculo_id, autoescola_id, marcada_por, configuracoes) => {
    if (!instrutor_id || !aluno_id || !data || !tipo || !hora || !veiculo_id || !autoescola_id) {
        console.error("Todos os campos são obrigatórios!");
        return false;
    }

    try {
        const response = await fetch(`${urlBack}/inserirAula`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instrutor_id,
                aluno_id,
                data,
                tipo,
                hora,
                veiculo_id,
                autoescola_id,
                marcada_por,
                configuracoes
            }),
        });

        const result = await response.json(); // 👈 Lê o body!

        if (!response.ok) {
            console.error("Erro na resposta do servidor:", response.status, result.message);
            return result.message; // ou apenas `false` se preferir simplificar
        }

        return result.message;

    } catch (err) {
        console.error("Erro ao inserir aula:", err);
    
    }
};


export { SearchAndFilterHour, InsertClass };
