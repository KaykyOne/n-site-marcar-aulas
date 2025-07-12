import { useState, useCallback } from 'react';
import useUserStore from "../store/useUserStore";
import { toast } from "react-toastify";

export default function useGeneric() {
    const [loading, setLoading] = useState(false);

    // 🔥 DELETE - Excluir por ID
    const GenericDelete = async (rota, caminho, campos) => {

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}?${campos}`,
                { method: 'DELETE' }
            );
            const response = await res.json();

            if (!res.ok) {
                const msg = response?.message || 'Erro na requisição';
                return { success: false, error: msg, status: res.status };
            }

            return { success: true, data: response.message, status: res.status };
        } catch (error) {
            const msg = `Erro ao excluir ${caminho}: ${error.message}`;
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // 🔥 DELETE - Excluir relação
    const GenericDeleteRelation = async (rota, caminho, campo1, campo2, id1, id2) => {

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}?${campo1}=${id1}&&${campo2}=${id2}`,
                { method: 'DELETE' }
            );
            const response = await res.json();

            if (!res.ok) {
                const msg = response?.message || 'Erro na requisição';
                return { success: false, error: msg, status: res.status };
            }

            return { success: true, data: response.message, status: res.status };
        } catch (error) {
            const msg = `Erro ao excluir ${caminho}: ${error.message}`;
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // 🟢 POST - Criar novo registro
    const GenericCreate = async (rota, caminho, body) => {

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
                const msg = response?.message || 'Erro na criação';
                return { success: false, error: msg, status: res.status };
            }

            return { success: true, data: response, status: res.status };
        } catch (error) {
            const msg = `Erro ao criar ${caminho}: ${error.message}`;
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // 🔵 GET - Buscar dados
    const GenericSearch = useCallback(async (rota, caminho, pesquisa = '') => {

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_URL_BACK}/${rota}/${caminho}${pesquisa}`,
                { method: 'GET' }
            );

            const response = await res.json();

            if (!res.ok) {
                const msg = response?.message || 'Erro na requisição';
                return { success: false, error: msg, status: res.status };
            }

            return { success: true, data: response, status: res.status };
        } catch (error) {
            const msg = `Erro ao buscar ${caminho}: ${error.message}`;
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    // 🟠 PUT - Atualizar dados
    const GenericUpdate = async (rota, caminho, body) => {

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
                const msg = response?.message || 'Erro na atualização';
                return { success: false, error: msg, status: res.status };
            }

            return { success: true, data: response, status: res.status };
        } catch (error) {
            const msg = `Erro ao atualizar ${caminho}: ${error.message}`;
            return { success: false, error: msg };
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

        if (!cpf || !senha) {
            toast.error("CPF ou senha não preenchidos!");
            return false;
        }

        const result = await GenericCreate("usuario", "login", { cpf, senha });

        if (result.success) {
            await setUsuario(result.data);
            return result.data;
        } else {
            toast.error(result.error || "Erro no login!");
            return false;
        }
    };

    const ForPass = async (cpf) => {
        if (!cpf) {
            return false;
        }

        const result = await GenericUpdate("usuario", "esqueciSenha", { cpf });
        console.log(result);
        if (result.success && !!result.data.message) {
            toast.success("Senha enviada com sucesso!");
            return result.data;
        } else {
            toast.error(result.error || "Erro no ao enviar senha!");
            return false;
        }
    };

    const AlterarSenha = async (id, senha) => {
        if (!id || !senha) {
            toast.error('ID ou senha inválidos!');
            return null;
        }

        const body = { id, senha };
        const result = await GenericUpdate('usuario', 'alterarsenha', body);

        if (result.success) {
            toast.success("Senha alterada com sucesso!");
            return result.data;
        } else {
            toast.error(result.error || "Erro ao alterar a senha!");
            return null;
        }
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
        ForPass,
        loading,
    };
}
