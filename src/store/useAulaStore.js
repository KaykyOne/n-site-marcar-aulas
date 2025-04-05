import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store para gerenciar as aulas com persistência
const useAulaStore = create(
  persist(
    (set) => ({
      aula: {
        aula_id: null,
        aluno_id: null,
        instrutor: null, // Agora é um objeto, não um ID
        data: '',
        hora: '',
        situacao: 'Pendente',
        veiculo: null,
        tipo: '',
        autoescola_id: null,
      },

      // Função para atualizar a aula inteira
      setAula: (aula) => set({ aula }),

      // Função para atualizar um campo específico da aula
      updateAula: (campo, valor) => set((state) => ({
        aula: { ...state.aula, [campo]: valor },
      })),

      // Função para resetar o estado da aula
      resetAula: () => set({
        aula: {
          aula_id: null,
          aluno_id: null,
          instrutor: null, // Resetando para null
          data: '',
          hora: '',
          situacao: 'Pendente',
          veiculo: null,
          tipo: '',
          autoescola_id: null,
        },
      }),
    }),
    {
      name: 'aula-storage', // Nome da chave no localStorage
      getStorage: () => localStorage, // Define localStorage como armazenamento
    }
  )
);

export default useAulaStore;
