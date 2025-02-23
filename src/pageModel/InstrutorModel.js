import supabase from '../controller/supabase';

export class InstrutorModel {

    async searchInstrutorById(codigo) {
        const { data, error } = await supabase
            .from('instrutores')
            .select('*')
            .eq('usuario_id', codigo)
            .single(); // Adiciona .single() para retornar apenas um resultado

        if (error) {
            console.error('Erro ao código do instrutor:', error);
            return null; // Retorna null em caso de erro
        }

        return data.instrutor_id ? data : null; // Retorna apenas o campo 'nome'
    }

    async searchInstructoresForCategory(id, type) {
        if (!type) {
          console.log('O Tipo é necessário.');
          return [];
        }
    
        // Buscar instrutores relacionados ao usuario_id
        const { data: usuarioInstrutorData, error: usuarioInstrutorError } = await supabase
          .from('usuarios_instrutores')
          .select('instrutor_id')
          .eq('usuario_id', id);
    
        if (usuarioInstrutorError || !usuarioInstrutorData.length) {
          console.log('Erro ao buscar dados de instrutores para o usuário: ' + (usuarioInstrutorError?.message || 'Nenhum instrutor encontrado'));
          console.error(usuarioInstrutorError);
          return [];
        }
    
        // Extrair os IDs dos instrutores
        let instrutores_id = usuarioInstrutorData.map(instrutor => instrutor.instrutor_id);
    
        // Buscar instrutores usando uma única query com todos os IDs
        const { data: instrutoresData, error: instrutoresError } = await supabase
          .from('instrutores')
          .select('*')
          .in('instrutor_id', instrutores_id)
          .ilike('tipo_instrutor', `%${type}%`)
          .eq('atividade_instrutor', true);
    
        if (instrutoresError) {
          console.log('Erro ao buscar instrutores: ' + instrutoresError.message);
          console.error(instrutoresError);
          return [];
        }
    
        return instrutoresData;
      }

}