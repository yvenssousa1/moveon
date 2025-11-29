    combinado_multiplas_articulacoes: [
      { name: 'core stability', display: 'Estabilidade de Core', logic: ['Se dor lombar e joelho, priorizar exercícios de core', 'Se fadiga, reduzir repetições'], objetivo: ['estabilidade'], equipamento: [], restricoes: ['dor lombar', 'dor joelho'] },
      { name: 'balance board', display: 'Prancha de Equilíbrio', logic: ['Se instabilidade, usar apoio', 'Se fácil, avançar para olhos fechados'], objetivo: ['propriocepção'], equipamento: ['prancha'], restricoes: ['instabilidade'] },
    ],
    elite_esportivo: [
      { name: 'agility ladder', display: 'Escada de Agilidade', logic: ['Se dor, reduzir velocidade', 'Se fácil, aumentar complexidade'], objetivo: ['agilidade', 'potência'], equipamento: ['escada'], restricoes: ['atleta'] },
      { name: 'plyo box jump', display: 'Salto em Caixa', logic: ['Se dor, reduzir altura', 'Se fácil, aumentar repetições'], objetivo: ['potência'], equipamento: ['caixa'], restricoes: ['atleta'] },
    ],
    pos_cirurgico_complicado: [
      { name: 'gentle ROM', display: 'Mobilidade Suave', logic: ['Se dor intensa, interromper', 'Se fácil, avançar para isometria'], objetivo: ['amplitude'], equipamento: [], restricoes: ['complicação'] },
      { name: 'pain monitoring', display: 'Monitoramento de Dor', logic: ['Se dor >7, pausar protocolo', 'Se dor <3, avançar para mobilidade ativa'], objetivo: ['segurança'], equipamento: [], restricoes: ['complicação'] },
    ],
    // Lógica clínica multifatorial avançada
    // Se múltiplas dores/articulações, usar protocolo combinado
    if (userData.dores && userData.dores.length > 1) {
      exercises = protocols['combinado_multiplas_articulacoes'];
    }
    // Se perfil atleta e objetivo esportivo, usar elite_esportivo
    if (userData.perfil === 'atleta' && userData.objetivos?.includes('esportivo')) {
      exercises = protocols['elite_esportivo'];
    }
    // Se pós-cirúrgico com complicação
    if (userData.objetivos?.includes('pós-cirúrgico') && userData.comorbidades?.includes('complicação')) {
      exercises = protocols['pos_cirurgico_complicado'];
    }
    // Ajuste dinâmico por feedback de dor/fadiga
    if (userData.feedback && userData.feedback.dor > 7) {
      exercises = exercises.filter(ex => ex.objetivo?.includes('segurança') || ex.logic?.some(l => l.includes('interromper')));
    }
    if (userData.feedback && userData.feedback.fadiga > 7) {
      exercises = exercises.filter(ex => ex.objetivo?.includes('amplitude') || ex.logic?.some(l => l.includes('reduzir')));
    }
  pos_cirurgico_joelho: [
    { name: 'isometric quad', display: 'Isometria de Quadríceps', logic: ['Se dor, reduzir tempo', 'Se fácil, avançar para extensão ativa'], objetivo: ['força'], equipamento: [], restricoes: ['<30dias'] },
    { name: 'active extension', display: 'Extensão Ativa', logic: ['Se dor, voltar para isometria', 'Se fácil, avançar para elevação de perna'], objetivo: ['amplitude', 'força'], equipamento: [], restricoes: ['<60dias'] },
    { name: 'straight leg raise', display: 'Elevação de Perna Estendida', logic: ['Se dor, reduzir carga', 'Se fácil, repetir'], objetivo: ['força'], equipamento: [], restricoes: ['<90dias'] },
  ],
  esportivo_ombro: [
    { name: 'plyometric push up', display: 'Flexão Pliométrica', logic: ['Se dor, reduzir intensidade', 'Se fácil, avançar para arremesso'], objetivo: ['potência'], equipamento: [], restricoes: ['<30anos'] },
    { name: 'medicine ball throw', display: 'Arremesso com Medicine Ball', logic: ['Se dor, reduzir peso', 'Se fácil, repetir'], objetivo: ['potência', 'funcional'], equipamento: ['bola'], restricoes: ['<40anos'] },
  ],
  funcional_idoso: [
    { name: 'sit to stand', display: 'Sentar e Levantar', logic: ['Se dor, aumentar apoio', 'Se fácil, avançar para caminhada'], objetivo: ['funcional'], equipamento: [], restricoes: ['>65anos'] },
    { name: 'walking', display: 'Caminhada', logic: ['Se dor, reduzir distância', 'Se fácil, aumentar tempo'], objetivo: ['funcional', 'cardio'], equipamento: [], restricoes: ['>65anos'] },
  ],
// Protocolos clínicos expandidos para múltiplas áreas
export const protocols = {
  joelho: [
    { name: 'leg extension', display: 'Extensão de Joelho', logic: ['Se dor, voltar para alongamento', 'Se fácil, avançar para agachamento'], objetivo: ['força', 'amplitude'], equipamento: ['faixa', 'halter'] },
    { name: 'squat', display: 'Agachamento', logic: ['Se dor, voltar para extensão', 'Se fácil, avançar para avanço'], objetivo: ['força', 'funcional'], equipamento: [] },
    { name: 'lunge', display: 'Avanço', logic: ['Se dor, voltar para agachamento', 'Se fácil, repetir avanço'], objetivo: ['funcional'], equipamento: [] },
  ],
  lombar: [
    { name: 'cat cow', display: 'Gato-Vaca', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para criança'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'child pose', display: 'Postura da Criança', logic: ['Se dor, manter postura', 'Se fácil, avançar para ponte'], objetivo: ['alongamento'], equipamento: [] },
    { name: 'bridge', display: 'Ponte', logic: ['Se dor, voltar para criança', 'Se fácil, repetir ponte'], objetivo: ['força', 'funcional'], equipamento: [] },
  ],
  ombro: [
    { name: 'shoulder press', display: 'Desenvolvimento de Ombro', logic: ['Se dor, reduzir carga', 'Se fácil, avançar para elevação lateral'], objetivo: ['força'], equipamento: ['halter'] },
    { name: 'lateral raise', display: 'Elevação Lateral', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para elevação frontal'], objetivo: ['força', 'amplitude'], equipamento: ['halter'] },
    { name: 'front raise', display: 'Elevação Frontal', logic: ['Se dor, voltar para lateral', 'Se fácil, repetir frontal'], objetivo: ['força', 'amplitude'], equipamento: ['halter'] },
  ],
  tornozelo: [
    { name: 'ankle circles', display: 'Círculos com Tornozelo', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para dorsiflexão'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'ankle dorsiflexion', display: 'Dorsiflexão de Tornozelo', logic: ['Se dor, manter círculos', 'Se fácil, avançar para elevação de panturrilha'], objetivo: ['amplitude'], equipamento: [] },
    { name: 'calf raise', display: 'Elevação de Panturrilha', logic: ['Se dor, voltar para dorsiflexão', 'Se fácil, repetir panturrilha'], objetivo: ['força'], equipamento: [] },
  ],
  cervical: [
    { name: 'neck flexion', display: 'Flexão Cervical', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para extensão'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'neck extension', display: 'Extensão Cervical', logic: ['Se dor, voltar para flexão', 'Se fácil, avançar para rotação'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'neck rotation', display: 'Rotação Cervical', logic: ['Se dor, voltar para extensão', 'Se fácil, repetir rotação'], objetivo: ['mobilidade'], equipamento: [] },
  ],
  quadril: [
    { name: 'hip flexion', display: 'Flexão de Quadril', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para extensão'], objetivo: ['mobilidade', 'amplitude'], equipamento: [] },
    { name: 'hip extension', display: 'Extensão de Quadril', logic: ['Se dor, voltar para flexão', 'Se fácil, avançar para abdução'], objetivo: ['mobilidade', 'força'], equipamento: [] },
    { name: 'hip abduction', display: 'Abdução de Quadril', logic: ['Se dor, voltar para extensão', 'Se fácil, repetir abdução'], objetivo: ['força', 'amplitude'], equipamento: ['faixa'] },
  ],
  punho_mao: [
    { name: 'wrist flexion', display: 'Flexão de Punho', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para extensão'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'wrist extension', display: 'Extensão de Punho', logic: ['Se dor, voltar para flexão', 'Se fácil, avançar para preensão'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'grip', display: 'Exercício de Preensão', logic: ['Se dor, reduzir carga', 'Se fácil, repetir preensão'], objetivo: ['força'], equipamento: ['bola'] },
  ],
  escapula: [
    { name: 'scapular retraction', display: 'Retração de Escápula', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para elevação'], objetivo: ['postura'], equipamento: [] },
    { name: 'scapular elevation', display: 'Elevação de Escápula', logic: ['Se dor, reduzir amplitude', 'Se fácil, repetir elevação'], objetivo: ['postura'], equipamento: [] },
  ],
  toracica: [
    { name: 'thoracic rotation', display: 'Rotação Torácica', logic: ['Se dor, reduzir amplitude', 'Se fácil, avançar para extensão'], objetivo: ['mobilidade'], equipamento: [] },
    { name: 'thoracic extension', display: 'Extensão Torácica', logic: ['Se dor, voltar para rotação', 'Se fácil, repetir extensão'], objetivo: ['mobilidade'], equipamento: [] },
  ],
};
