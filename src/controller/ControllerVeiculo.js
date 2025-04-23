const urlBack = process.env.REACT_APP_URL_BACK;

const SelectVeicleByInstrutor = async (id_instrutor, type) => {  // Passando a data de atualização também

    if (!id_instrutor || !type) {
        console.error("id_instrutor ou type não encontrado");
        return false; // Melhor retornar false para indicar falha
    }

    try {
        const response = await fetch(`${urlBack}/veiculos/buscarVeiculos?instrutor_id=${id_instrutor}&tipo=${type}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
            console.error("Erro na requisição:", response.status);
            return [];
        }
        
        const data = await response.json();
        return data;        
        

    } catch (err) {
        console.error("Erro na requisição:", err);
        return false;
    }
};

export { SelectVeicleByInstrutor };
