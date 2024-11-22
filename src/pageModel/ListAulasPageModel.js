import supabase from '../controller/supabase';
import ServerTimeService from '../controller/ServerTimeService';
import { isAfter, differenceInHours, parseISO } from 'date-fns';

export class ListAulasPageModel {
  aulas = [];
  constructor() {
    this.serverTimeService = new ServerTimeService(); // Instancia a classe
  }

  async searchAulas(cpf) {
    try {
      // Busca o ID do usuário com base no CPF e verifica se a situação é 'Pendente'
      const { data: alunoData, error: alunoError } = await supabase
        .from('usuarios')
        .select('usuario_id')
        .eq('cpf', cpf)
        .single();

      if (alunoError) {
        console.error(alunoError);  // Log do erro para facilitar o diagnóstico
        return null;
      }

      const alunoId = alunoData?.usuario_id;

      if (!alunoId) {
        throw new Error(
          'ID do aluno não encontrado ou situação não é Pendente.'
        );
      }

      const { currentDate } = await this.getCurrentTimeAndDateFromServer();

      // Busca as aulas associadas ao ID do aluno
      const { data, error } = await supabase
        .from('aulas')
        .select('aula_id, data, hora, tipo') // Incluindo aula_id
        .eq('aluno_id', alunoId)
        .gte('data', currentDate)
        .order('data', { ascending: true });

      if (error) {
        return null; // Retorna null em caso de erro
      }

      const { data: count, error: errorCount } = await supabase
        .from('aulas')
        .select('*', { count: 'exact' })
        .eq('aluno_id', alunoId)
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

  async deleteAula(id, data, hora) {
    const { currentDate, currentTime } = await this.getCurrentTimeAndDateFromServer();
    if (!currentDate || !currentTime) {
      console.log('Erro ao buscar data e hora do server!');
      return false;
    }

    try {
      // Verifica se a data da aula é maior que a data atual
      if (currentDate < data ||
        (currentDate === data && (parseInt(hora.split(':')[0]) - parseInt(currentTime.split(':')[0]) > 24 ||
          (parseInt(hora.split(':')[0]) === parseInt(currentTime.split(':')[0]) &&
            parseInt(hora.split(':')[1]) >= parseInt(currentTime.split(':')[1]))))) {
        // Realiza a exclusão
        const { data: deleteData, error } = await supabase
          .from('aulas')
          .delete()
          .eq('aula_id', id)
          .select();  // 'select()' pode ser usado para tentar capturar os dados retornados

        // Verifique se houve um erro
        if (error) {
          throw error;
        }
        // Verifique o número de registros excluídos
        return deleteData ? true : false;  // Retorna true se a exclusão afetou algum registro
      } else {
        console.log('Não foi possível excluir a aula: precisa ser excluída com 3 horas de antecedência ou mais.');
        return false;
      }
    } catch (error) {
      console.error('Erro no processo de exclusão: ', error); // Log do erro
      return false; // Retorna false em caso de erro
    }
  }

  async getCurrentTimeAndDateFromServer() {
    const { currentDate, currentTime } =
      await this.serverTimeService.getCurrentTimeAndDateFromServer();
    return { currentDate, currentTime }; // Retorna um objeto com data e hora
  }

}
