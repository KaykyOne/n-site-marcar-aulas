import supabase from '../controller/supabase';
import Cripto from '../controller/Cripto';

export class SelectAlunoPageModel {
  users = [];

  // Método para verificar a senha atual do usuário
  async searchUsersByCPF(cpf, instrutorId) {
    const cpfCripto = Cripto(cpf);  // Verifique se Cripto é uma função ou classe
    const { data, error } = await supabase
      .from('usuarios')
      .select('usuario_id, nome, sobrenome')
      .eq('cpf', cpfCripto)
      .single(); // Retorna apenas um resultado

    if (error || !data) {
      console.error('Erro ao buscar usuário:', error);
      return null; // Retorna null se ocorrer um erro
    }

    const { data: resInstrutorAluno, error: errorInstrutorAluno } = await supabase
      .from('usuarios_instrutores')
      .select('*')
      .eq('usuario_id', data.usuario_id)
      .eq('instrutor_id', instrutorId)
      .limit(1); // Retorna apenas um resultado

    if (errorInstrutorAluno || !resInstrutorAluno) {
      console.error('Erro ao buscar relação instrutor aluno:', errorInstrutorAluno);
      return null; // Retorna null se ocorrer um erro
    }

    if(resInstrutorAluno.length > 0){
      return data; // Retorna o nome do aluno se a relação for válida
    }else{
      return null;
    }

  }

  async searchCategoriaInstrutor(codigo) {
    const { data, error } = await supabase
      .from('instrutores')
      .select('tipo_instrutor')
      .eq('instrutor_id', codigo);
  
    if (error || !data || data.length === 0) {
      console.error('Erro ao buscar categorias:', error?.message || 'Nenhum dado encontrado');
      return null;
    }
  
    return data[0]; // Retorna apenas o primeiro resultado
  }
  
}
