import supabase from '../controller/supabase';
import ServerTimeService from '../controller/ServerTimeService';

export class LogModel {
    constructor() {
        this.serverTimeService = new ServerTimeService(); // Instancia a classe
    }
    
    async checkAndUpdateLog(alunoId) {
        // Pega a data e hora atual do servidor
        const { currentDate, currentTime } = await this.getCurrentTimeAndDateFromServer();

        // Verifica se já existe um log para o aluno
        const { data: existingLogs, error: fetchError } = await supabase
            .from('logs')
            .select('*')
            .eq('aluno_id', alunoId);

        if (fetchError) {
            console.error('Erro ao buscar logs:', fetchError);
            return;
        }

        if (existingLogs.length > 0) {
            // Se já existe um log, atualiza o log existente
            const { error: updateError } = await supabase
                .from('logs')
                .update({
                    data: currentDate, // 🔥 Correção aqui!
                    hora: currentTime,
                })
                .eq('aluno_id', alunoId);

            if (updateError) {
                console.error('Erro ao atualizar log:', updateError);
                return;
            }

            console.log('Log atualizado com sucesso!');
        } else {
            // Se não existe um log, cria um novo
            const { data: insert, error: insertError } = await supabase
                .from('logs')
                .insert([{
                    aluno_id: alunoId,
                    data: currentDate,
                    hora: currentTime,
                }]);

            if (insertError) {
                console.error('Erro ao criar log:', insertError);
                return;
            }

            console.log('Log criado com sucesso!', insert);
        }
    }

    async getCurrentTimeAndDateFromServer() {
        return await this.serverTimeService.getCurrentTimeAndDateFromServer();
    }
}
