const urlBack = process.env.REACT_APP_URL_BACK;

const PegarData = async () => {
    try {
      const response = await fetch(`${urlBack}/sistema/pegarDataAtual`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log("Data e hora recebidas:", result);  // Verifique se os valores de data e hora são válidos
  
      return result.data;  // Certifique-se de que está retornando os dados no formato correto
    } catch (err) {
      console.error("Erro na requisição:", err);
      return false;
    }
  };
  


export { PegarData };
