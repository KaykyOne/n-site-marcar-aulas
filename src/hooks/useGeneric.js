import { useState } from 'react';
import useUserStore from "../store/useUserStore";
import { toast } from "react-toastify";

export default function useGeneric() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 🔥 DELETE - Excluir por ID
    const GenericDelete = async (rota, caminho, campos) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}?${campos}`,
                { method: 'DELETE', }
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

            return result.data;
        } catch (err) {
            toast.error("Erro na requisição ao buscar a data!");
            return false;
        }
    };

    const LoginFunc = async (cpf, senha) => {
        const setUsuario = useUserStore.getState().setUsuario;

        const aluno = {
            cpf: cpf,
            senha: senha,
        };
        if (!cpf || !senha) {
            toast.error("CPF ou senha não preenchidos!");
            return false;
        }

        const response = await GenericCreate("usuario", "login", aluno)
        if (response) {
            await setUsuario(response);
            toast.success("Login realizado com sucesso!");
            return response;
        } else {
            toast.error(response?.message || "Erro no login!");
            return false;
        }

    };

    const AlterarSenha = async (id, senha) => {
        if (!id || !senha) {
            toast.error('ID ou senha inválidos!');
            return null;
        }

        const body = { id, senha };
        const res = await GenericUpdate('usuario', 'alterarsenha', body);
        console.log(res);
        if (res) {
            toast.success("Senha alterada com sucesso!");
        } else {
            toast.error("Erro ao alterar a senha!");
        }

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
