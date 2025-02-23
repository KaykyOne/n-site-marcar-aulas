import supabase from '../controller/supabase';
import ServerTimeService from '../controller/ServerTimeService';
import { parse, isValid, differenceInHours, differenceInMinutes } from 'date-fns';

export class ClassModel {

    constructor() {
        this.serverTimeService = new ServerTimeService(); // Instancia a classe
    }

    async insertClass(instrutor, aluno, data, type, hora) {
        const horaFormatada = hora.includes(':') ? hora : new Date(hora).toISOString().substr(11, 5);
        try {
            const { data: aulaData, error } = await supabase.from('aulas').insert([{
                aluno_id: aluno.usuario_id,
                instrutor_id: instrutor.instrutor_id,
                situacao: 'Pendente',
                data: data,
                hora: horaFormatada,
                tipo: type,
                autoescola_id: instrutor.autoescola_id
            }]);
            if (error) {
                console.error('Erro ao inserir aula:', error.message);
                return null;
            } else {
                console.log('Dados da aula inseridos com sucesso:');
                return true;
            }

        } catch (error) {
            console.error('Erro inesperado ao inserir aula:', error.message);
            return null;
        }
    }

    async countClass(id, situacao = null, data = null) {
        try {
            let query = supabase.from('aulas').select('*', { count: 'exact' }).eq('aluno_id', id);

            // Adiciona a condição de 'situacao' se for fornecida
            if (situacao) {
                query = query.eq('situacao', situacao);
            }

            // Adiciona a condição de 'data' se for fornecida
            if (data) {
                query = query.eq('data', data);
            }

            const { count, error } = await query;

            if (error) {
                console.error('Erro ao contar aulas:', error.message);
                return null;
            }

            return count;
        } catch (error) {
            console.error('Erro inesperado ao contar aulas:', error.message);
            return null;
        }
    }

    async countClassByDateAndHoour(tipo, hora, data) {
        try {
            let query = supabase
                .from('aulas')
                .select('*', { count: 'exact' })
                .eq('data', data)
                .eq('hora', hora)
                .eq('tipo', tipo);

            const { count, error } = await query;

            if (error) {
                console.error('Erro ao contar aulas:', error.message);
                return null;
            }

            return count;
        } catch (error) {
            console.error('Erro inesperado ao contar aulas:', error.message);
            return null;
        }
    }

    async searchAulasInstrutor(codigo, dia) {
        try {
            // Busca as aulas associadas ao ID do aluno
            const { data, error } = await supabase
                .from('aulas')
                .select(`
            aula_id,
            data,
            hora,
            tipo,
            aluno_id,
            usuarios (
              nome
            )
          `)
                .eq('instrutor_id', codigo)
                .eq('data', dia)
                .order('data', { ascending: true });

            if (error) {
                console.error("Erro ao buscar aulas:", error);
                return null; // Retorna null em caso de erro
            }

            const { data: count, error: errorCount } = await supabase
                .from('aulas')
                .select('*', { count: 'exact' })
                .eq('instrutor_id', codigo)
                .eq('situacao', 'Concluída');

            if (errorCount) {
                console.error('Erro ao contar gerais aulas:', errorCount.message);
                return null; // Retorna null em caso de erro
            }

            this.aulas = data || []; // Armazena os dados no ViewModel
            return { aulas: this.aulas, count };

        } catch (error) {
            return null;
        }
    }

    async searchAulas(alunoId) {
        try {
            if (!alunoId) {
                throw new Error(
                    'ID do aluno não encontrado'
                );
            }

            const { currentDate } = await this.getCurrentTimeAndDateFromServer();

            // Busca as aulas associadas ao ID do aluno
            const { data, error } = await supabase
                .from('aulas')
                .select(`*,
            instrutores (
              nome_instrutor
            )
          `)
                .eq('aluno_id', alunoId)
                .gte('data', currentDate)
                .order('data', { ascending: true });

            if (error) {
                console.error("Erro ao buscar aulas:", error);
                return null; // Retorna null em caso de erro
            }

            this.aulas = data || []; // Armazena os dados no ViewModel
            return { aulas: this.aulas };

        } catch (error) {
            return null;
        }
    }

    async alterAula(campo, id, tipy, cpf) {
        try {
            // Obtém a data e hora atuais do servidor
            const { currentDate, currentTime } = await this.getCurrentTimeAndDateFromServer();

            // Busca a aula pelo ID
            const { data: aulaData, error: aulaError } = await supabase
                .from('aulas')
                .select('data, hora')
                .eq('aula_id', id)
                .single();

            if (aulaError) {
                console.log(aulaError.message);
            }


            const adjustedCurrentDate = new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

            // Verifica se a aula já passou ou se está dentro do horário permitido
            if (aulaData.data < adjustedCurrentDate || (aulaData.hora == currentTime && aulaData.data <= adjustedCurrentDate)) {
                console.log('erro ao concluir aula, muito cedo!');
                return false;
            }

            // Atualiza o campo 'situacao' da aula
            const { data: updateAulaData, error: updateAulaError } = await supabase
                .from('aulas')
                .update({ situacao: campo })
                .eq('aula_id', id);

            if (updateAulaError) {
                console.error('Erro ao atualizar a aula:', updateAulaError.message);
                throw new Error(updateAulaError.message);
            }

            // Busca o valor atual dos contadores
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('num_aulas')
                .eq('cpf', cpf)
                .single();

            if (userError) {
                console.log(`erro ao concluir aula: ${userError.message}`);
                return false;
            }

            // Incrementa o valor apropriado
            const newValues = {};
            if (tipy === 'Concluída') {
                newValues.num_aulas = (userData.num_aulas || 0) + 1;
            }

            // Atualiza os contadores no banco de dados
            const { data: updateUserData, error: updateUserError } = await supabase
                .from('usuarios')
                .update(newValues)
                .eq('cpf', cpf);

            if (updateUserError) {
                console.log(`erro ao concluir aula: ${updateUserError.message}`);
                return false;
            }

            return updateUserData;
        } catch (error) {
            console.log(`erro ao concluir aula: ${error.message}`);
            return false;
        }
    }

    async deleteAula(id, data, hora, horaPraPoderExcluir) {
        const { currentDate, currentTime } = await this.getCurrentTimeAndDateFromServer();
        if (!currentDate || !currentTime) {
            console.log('Erro ao buscar data e hora do server!');
            return false;
        }

        try {
            // Normaliza o formato de currentTime removendo frações de segundo
            const normalizedTime = currentTime.split('.')[0]; // Remove tudo após o ponto

            // Concatena e tenta parsear
            const currentDateTime = parse(`${currentDate} ${normalizedTime}`, 'yyyy-MM-dd HH:mm:ss', new Date());
            const aulaDateTime = parse(`${data} ${hora}`, 'yyyy-MM-dd HH:mm:ss', new Date());

            // Valida os objetos Date gerados
            if (!isValid(currentDateTime) || !isValid(aulaDateTime)) {
                console.error('Erro: formato de data ou hora inválido!');
                return false;
            }

            // Calcula a diferença em horas
            const differenceHours = differenceInHours(aulaDateTime, currentDateTime);
            const differenceMinutes = differenceInMinutes(aulaDateTime, currentDateTime) % 60;

            // Verifica se a aula é às 7:00 e exige 24 horas de antecedência
            if (hora === '07:00:00') {
                if (differenceHours < 24 || (differenceHours === 24 && differenceMinutes > 0)) {
                    console.log('Não foi possível excluir a aula das 7:00: precisa ser excluída com 24 horas de antecedência.');
                    return false;
                }
            } else {
                // Verifica se outras aulas têm no mínimo 12 horas de antecedência
                if (differenceHours < horaPraPoderExcluir || (differenceHours === horaPraPoderExcluir && differenceMinutes < 0)) {
                    console.log('Não foi possível excluir a aula: precisa ser excluída com 3 horas de antecedência ou mais.');
                    return false;
                }
            }

            // Realiza a exclusão
            const { data: deleteData, error } = await supabase
                .from('aulas')
                .delete()
                .eq('aula_id', id)
                .select();

            // Verifica se houve um erro
            if (error) {
                throw error;
            }

            return deleteData ? true : false; // Retorna true se a exclusão afetou algum registro
        } catch (error) {
            console.error('Erro no processo de exclusão: ', error);
            return false; // Retorna false em caso de erro
        }
    }

    async searchMaxAulas(usuario) {
        let { data: max, error } = await supabase
            .from('configuracoes')
            .select("valor")
            .eq('chave', 'aulas')
            .eq('autoescola_id', usuario.autoescola_id)
            .single();
        // console.log(max);
        if (error) {
            return error.message;
        }
        return max.valor
    }

    async getCurrentTimeAndDateFromServer() {
        const { currentDate, currentTime } =
            await this.serverTimeService.getCurrentTimeAndDateFromServer();
        return { currentDate, currentTime }; // Retorna um objeto com data e hora
    }
}