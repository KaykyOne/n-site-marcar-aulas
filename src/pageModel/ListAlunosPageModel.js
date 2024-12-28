import supabase from '../controller/supabase';

export class ListAlunosPageModel {

  async searchAlunos(instrutor_id) {
    let { data, error } = await supabase
      .from('usuarios_instrutores')
      .select("usuario_id, usuarios(usuario_id, nome, sobrenome, telefone)")
      .eq('instrutor_id', instrutor_id);

    if (error) {
        console.log(error.message);
      return error.message;
    }
    return data
  }
}
