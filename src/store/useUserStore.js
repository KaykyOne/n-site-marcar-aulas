import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store de usuários com persistência
const useUserStore = create(
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
        autoescola_id: null,
      },

      // Função para atualizar o usuário
      setUsuario: (usuario) => set({ usuario }),

      // Função para atualizar um campo específico do usuário
      updateUsuario: (campo, valor) => set((state) => ({
        usuario: { ...state.usuario, [campo]: valor },
      })),

      // Função para resetar o estado do usuário
      resetUsuario: () => set({
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
          autoescola_id: null,
        },
      }),
    }),
    {
      name: 'user-storage', // Nome da chave no localStorage
      getStorage: () => localStorage, // Define localStorage como armazenamento
    }
  )
);

export default useUserStore;
