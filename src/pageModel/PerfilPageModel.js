import supabase from '../controller/supabase';
import Cripto from '../controller/Cripto';

export class PerfilPageModel {
  users = [];

  // Método para verificar a senha atual do usuário
  async searchUsersByCPF(cpf, senhaAtual) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('senha')
        .eq('cpf', cpf)
        .single(); // Retorna apenas um resultado

    if (error || !data) {
        console.error('Erro ao buscar usuário:', error);
        return false; // Retorna false se ocorrer um erro
    }

    // Compara a senha armazenada com a senha atual
    if (senhaAtual === '123456') {
        // Se a senha atual for a padrão, compara diretamente
        if (data.senha === '123456') {
            return true; // Retorna true se a senha padrão estiver correta
        } else {
            console.error('Senha atual incorreta');
            return false; // Retorna false se a senha não corresponder
        }
    } else {
        // Para outras senhas, compara usando a criptografia
        if (data.senha !== Cripto(senhaAtual)) {
            console.error('Senha atual incorreta');
            return false; // Retorna false se a senha não corresponder
        }
    }

    return true; // Retorna true se a senha atual estiver correta
}


  // Método para atualizar a senha
  async updatePassword(cpf, novaSenha) {
    const { error } = await supabase
      .from('usuarios')
      .update({ senha: novaSenha })
      .eq('cpf', cpf);

    if (error) {
      console.error('Erro ao atualizar a senha:', error);
      return false; // Retorna false em caso de erro
    }
    console.log('Senha atualizada');
    return true; // Retorna true se a senha foi alterada com sucesso
  }

  // Método completo para verificação e atualização de senha
  async alterarSenha(cpf, senhaAtual, novaSenha) {
    const senhaValida = await this.searchUsersByCPF(cpf, senhaAtual);

    if (!senhaValida) return false;

    // Criptografa a nova senha
    const senhaAtt = Cripto(novaSenha);

    // Atualiza a senha se a verificação passou
    return await this.updatePassword(cpf, senhaAtt);
  }
}
