import supabase from '../controller/supabase';


export class ManagerModel {
    async verificarManutencao(id) {
        const { data, error } = await supabase.from('configuracoes').select('*').eq('autoescola_id', id);
      
        if (error) {
          console.error('Erro ao buscar dados de manutenção:', error);
          return null;
        }
      
        return data || []; // Retorna um array vazio se não houver dados
      }
}
