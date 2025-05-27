import { useState } from 'react';
import useUserStore from "../store/useInstrutorStore";

export default function useGeneric() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 🔥 DELETE - Excluir por ID
    const GenericDelete = async (rota, id, caminho, campo) => {
        if (!id) {
            setError('ID inválido!');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}?${campo}=${id}`,
                { method: 'DELETE' }
            );

            const response = await res.json();

            if (!res.ok) {
                setError(response?.message || 'Erro na requisição');
                return null;
            }

            return response.message;
        } catch (error) {
            setError(`Erro ao excluir ${caminho}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 DELETE - Excluir relação (Ex.: tabela relacional)
    const GenericDeleteRelation = async (rota, caminho, campo1, campo2, id1, id2) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}?${campo1}=${id1}&&${campo2}=${id2}`,
                { method: 'DELETE' }
            );

            const response = await res.json();

            if (!res.ok) {
                setError(response?.message || 'Erro na requisição');
                return null;
            }

            return response.message;
        } catch (error) {
            setError(`Erro ao excluir ${caminho}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🟢 POST - Criar novo registro
    const GenericCreate = async (rota, caminho, body) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                }
            );

            const response = await res.json();

            if (!res.ok) {
                setError(response?.message || 'Erro na criação');
                return null;
            }

            return response;
        } catch (error) {
            setError(`Erro ao criar ${caminho}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔵 GET - Buscar dados
    const GenericSearch = async (rota, caminho, pesquisa = '') => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}${pesquisa}`,
                { method: 'GET' }
            );

            const response = await res.json();

            if (!res.ok) {
                setError(response?.message || 'Erro na requisição');
                return null;
            }

            return response;
        } catch (error) {
            setError(`Erro ao buscar ${caminho}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🟠 PUT - Atualizar dados
    const GenericUpdate = async (rota, caminho, body) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                }
            );

            const response = await res.json();

            if (!res.ok) {
                setError(response?.message || 'Erro na atualização');
                return null;
            }

            return response;
        } catch (error) {
            setError(`Erro ao atualizar ${caminho}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const PegarData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_BACK}/sistema/pegarDataAtual`, {
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

    const LoginFunc = async (cpf, senha, lastUpdated, autoescola_id, configuracoes) => {
        const setUsuario = useUserStore.getState().setUsuario;

        if (!cpf || !senha) {
            console.error("Senha ou CPF não encontrado");
            return false;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_URL_BACK}/usuario/login`, {
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

    const AlterarSenha = async (id, senha) => {
        if (!id || !senha) {
            setError('ID ou senha inválidos!');
            return null;
        }

        const body = { id, senha };
        const res = await GenericUpdate('usuario', 'alterarsenha', body);
        return res;
    };


    return {
        GenericDelete,
        GenericDeleteRelation,
        GenericCreate,
        GenericSearch,
        GenericUpdate,
        PegarData,
        LoginFunc,
        AlterarSenha,
        loading,
        error,
    };
}
