import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store de instrutor com persistência
const useInstrutorStore = create(
  persist(
    (set) => ({
      instrutor: {
        instrutor_id: null,
        usuario_id: null,
        nome_instrutor: '',
        tipo_instrutor: '',
        atividade_instrutor: false,
        autoescola_id: null,
      },

      // Atualiza o instrutor inteiro
      setInstrutor: (instrutor) => set({ instrutor }),

      // Atualiza um campo específico
      updateInstrutor: (campo, valor) => set((state) => ({
        instrutor: { ...state.instrutor, [campo]: valor },
      })),

      // Reseta o estado do instrutor
      resetInstrutor: () => set({
        instrutor: {
          instrutor_id: null,
          usuario_id: null,
          nome_instrutor: '',
          tipo_instrutor: '',
          atividade_instrutor: false,
          autoescola_id: null,
        },
      }),
    }),
    {
      name: 'user-instrutor', // Chave no localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useInstrutorStore;
