import supabase from '../controller/supabase';
import Cripto from '../controller/Cripto';

export class UserModel {
  async searchUsersByCPF(cpf) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('cpf', cpf)
      .single(); // Adiciona .single() para retornar apenas um resultado

    if (error) {
      console.error('Erro ao buscar usuário:', error);
      return null; // Retorna null em caso de erro
    }

    return data ? data : null; // Retorna apenas o campo 'nome'
  }

  async searchAlunos(instrutor_id) {
    let { data, error } = await supabase
      .from('usuarios_instrutores')
      .select("usuario_id, usuarios(usuario_id, nome, sobrenome, telefone)")
      .eq('instrutor_id', instrutor_id)
      .eq('', true);

    if (error) {
      console.log(error.message);
      return error.message;
    }
    return data
  }

  async updatePassword(usuario, novaSenha) {
    console.log(novaSenha);
    console.log(usuario);

    const { error } = await supabase
      .from('usuarios')
      .update({ senha: novaSenha })
      .eq('usuario_id', usuario.usuario_id);

    if (error) {
      console.error('Erro ao atualizar a senha:', error);
      return false; // Retorna false em caso de erro
    }
    console.log('Senha atualizada');
    return true; // Retorna true se a senha foi alterada com sucesso
  }

  // Método completo para verificação e atualização de senha
  async alterarSenha(usuario, senhaAtual, novaSenha) {

    if (senhaAtual != '123456') {
      senhaAtual = Cripto(senhaAtual);
    }

    if (usuario.senha != senhaAtual) return false;

    // Criptografa a nova senha
    const senhaAtt = Cripto(novaSenha);

    const resultado = await this.updatePassword(usuario, senhaAtt);
    return { resultado, senhaAtt };
  }
}