const urlBack = process.env.REACT_APP_URL_BACK;

const SearchAndFilterHour = async (instrutor_id, veiculo_id , data) => {
    if(!instrutor_id || !veiculo_id || !data){
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


export { SearchAndFilterHour };
