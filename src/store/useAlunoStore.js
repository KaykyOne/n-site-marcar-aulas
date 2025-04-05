import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store de usuários com persistência
const useAlunoStore = create(
  persist(
    (set) => ({
      usuario: {
        usuario_id: null,
        nome: '',
        sobrenome: '',
        cpf: '',
        tipo_usuario: '',
        telefone: '',
        categoria_pretendida: '',
        num_aulas: 0,
        data_cadastro: '',
        outra_cidade: false,
        atividade: '',
        senha: '',
        configuracoes: [],
        updated_at: null,
      },

      // Função para atualizar o usuário
      setAluno: (usuario) => set({ usuario }),

      // Função para atualizar um campo específico do usuário
      updateAluno: (campo, valor) => set((state) => ({
        usuario: { ...state.usuario, [campo]: valor },
      })),

      // Função para resetar o estado do usuário
      resetAluno: () => set({
        usuario: {
          usuario_id: null,
          nome: '',
          sobrenome: '',
          cpf: '',
          tipo_usuario: '',
          telefone: '',
          categoria_pretendida: '',
          num_aulas: 0,
          data_cadastro: '',
          outra_cidade: false,
          atividade: '',
          senha: '',
          configuracoes: [],
          updated_at: null,
        },
      }),
    }),
    {
      name: 'user-aluno', // Nome da chave no localStorage
      getStorage: () => localStorage, // Define localStorage como armazenamento
    }
  )
);

export default useAlunoStore;
