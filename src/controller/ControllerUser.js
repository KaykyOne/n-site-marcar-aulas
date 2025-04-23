import useUserStore from "../store/useUserStore"; 
const urlBack = process.env.REACT_APP_URL_BACK;

const LoginFunc = async (cpf, senha, lastUpdated, autoescola_id, configuracoes) => {
    const setUsuario = useUserStore.getState().setUsuario;
    
    if (!cpf || !senha) {
        console.error("Senha ou CPF não encontrado");
        return false; 
    }

    try {
        const response = await fetch(`${urlBack}/usuario/login`, {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha, lastUpdate: lastUpdated, autoescola_id, configuracoes }),
        });

        if (response.status === 304) {
            console.log("Dados não modificados, mantendo os dados locais.");
            return true;  
        }

        const data = await response.json();
        // console.log(data);
        if (response.ok) {
            await setUsuario(data); // Atualiza o Zustand

            return data; // Retorna os dados para serem usados imediatamente
        } else {
            console.error("Erro no login:", data?.message || "Erro desconhecido");
            return false;
        }

    } catch (err) {
        console.error("Erro na requisição:", err);
        return false;
    }
};


export { LoginFunc };
