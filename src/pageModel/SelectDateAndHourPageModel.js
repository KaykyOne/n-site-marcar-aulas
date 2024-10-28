import supabase from '../controller/supabase';
import ServerTimeService from '../controller/ServerTimeService';

export class SelectDateAndHourPageModel {
  horasDisponiveis = [];

  constructor() {
    this.serverTimeService = new ServerTimeService(); // Instancia a classe
  }

  // Função para implementar timeout de 5 segundos nas requisições
  async fetchWithTimeout(resource, options = {}) {
    const { timeout = 10000 } = options;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Requisição expirou')), timeout)
    );

    return Promise.race([fetch(resource, options), timeoutPromise]);
  }

  // Mova a função adicionarHoras para o escopo da classe
  adicionarHoras(inicio, fim, intervalo) {
    const horas = [];
    let horaAtual = new Date(`1970-01-01T${inicio}Z`);
    const horaFim = new Date(`1970-01-01T${fim}Z`);

    while (horaAtual < horaFim) {
      horas.push(horaAtual.toISOString().substr(11, 5)); // HH:MM
      horaAtual = new Date(horaAtual.getTime() + intervalo);
    }
    return horas;
  }

  async atualizarValores(nomeInstrutor, data) {
    if (!nomeInstrutor || !data) {
      throw new Error('Todos os parâmetros são necessários.');
    }

    const dataFormatada = new Date(data);
    if (isNaN(dataFormatada.getTime())) {
      throw new Error('Data inválida.');
    }

    // Buscar código e tipo do instrutor
    const { data: instrutorData, error: instrutorError } = await supabase
      .from('instrutores')
      .select('instrutor_id, tipo_instrutor')
      .eq('nome_instrutor', nomeInstrutor)
      .single();

    if (instrutorError) throw new Error(instrutorError.message);
    const instrutorId = instrutorData?.instrutor_id;
    const instrutorTipo = instrutorData?.tipo_instrutor || '';

    // Buscar horários trabalhados e horários ocupados de forma paralela
    const [horariosTrabalhadosData, horariosInstrutorData, horasDosExames] =
      await Promise.all([
        supabase
          .from('horariosinstrutores')
          .select('hora_inicio, hora_fim, hora_inicio_almoco, hora_fim_almoco')
          .eq('instrutor_id', instrutorId)
          .single(),

        supabase
          .from('aulas')
          .select('hora')
          .eq('instrutor_id', instrutorId)
          .eq('data', dataFormatada.toISOString().split('T')[0]),

        supabase
          .from('exames')
          .select('hora, tipo')
          .eq('data', dataFormatada.toISOString().split('T')[0]),
      ]);

    if (horariosTrabalhadosData.error)
      throw new Error(horariosTrabalhadosData.error.message);
    if (horariosInstrutorData.error)
      throw new Error(horariosInstrutorData.error.message);
    if (horasDosExames.error) throw new Error(horasDosExames.error.message);

    const { hora_inicio, hora_fim, hora_inicio_almoco, hora_fim_almoco } =
      horariosTrabalhadosData.data;

    const intervalo = 50 * 60 * 1000; // 50 minutos em milissegundos

    // Agora chama adicionarHoras usando this.adicionarHoras
    const horasTrabalhadas = [
      ...this.adicionarHoras(hora_inicio, hora_inicio_almoco, intervalo),
      ...this.adicionarHoras(hora_fim_almoco, hora_fim, intervalo),
    ];

    const horasInstrutores = horariosInstrutorData.data.map((item) =>
      item.hora.substr(0, 5)
    );

    const horasExames = horasDosExames.data
      .filter((exame) => instrutorTipo.includes(exame.tipo))
      .map((exame) => exame.hora.substr(0, 5));

    const filtrarHorasEmTornoExames = (horasDisponiveis, horasExames) => {
      const diferencaEmMinutos = (hora1, hora2) => {
        const data1 = new Date(`1970-01-01T${hora1}Z`);
        const data2 = new Date(`1970-01-01T${hora2}Z`);
        return (data2 - data1) / (60 * 1000);
      };

      return horasDisponiveis.filter((hora) => {
        return !horasExames.some((horaExame) => {
          const diferenca = diferencaEmMinutos(hora, horaExame);
          return diferenca >= -50 && diferenca <= 50;
        });
      });
    };

    const horasOcupadas = [...horasInstrutores, ...horasExames];
    const horasDisponiveisSemOcupados = horasTrabalhadas.filter(
      (hora) => !horasOcupadas.includes(hora)
    );

    this.horasDisponiveis = filtrarHorasEmTornoExames(
      horasDisponiveisSemOcupados,
      horasExames
    );

    return { horasDisponiveis: this.horasDisponiveis };
  }

  async getCurrentTimeAndDateFromServer() {
    const { currentDate, currentTime } =
      await this.serverTimeService.getCurrentTimeAndDateFromServer();
    return { currentDate, currentTime };
  }
}