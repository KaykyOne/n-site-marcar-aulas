import CryptoJS from 'crypto-js';

const Cripto = (input) => {
    const combinedInput = input + process.env.REACT_APP_SECRET_KEY; // Use REACT_APP_ para variáveis de ambiente
    const hash = CryptoJS.SHA256(combinedInput).toString(CryptoJS.enc.Hex);
    return hash;
};

export default Cripto;
