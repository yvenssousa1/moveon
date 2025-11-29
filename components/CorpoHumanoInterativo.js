import React, { useState } from 'react';

// Grandes áreas e protocolos gerais
const grandesAreas = [
  { id: 'coluna', label: 'Coluna (cervical, torácica, lombar)' },
  { id: 'ombro', label: 'Ombro' },
  { id: 'joelho', label: 'Joelho' },
  { id: 'quadril', label: 'Quadril' },
  { id: 'tornozelo', label: 'Tornozelo/Pé' },
  { id: 'cotovelo', label: 'Cotovelo' },
  { id: 'punho', label: 'Punho/Mão' },
];

const protocolosPorArea = {
  coluna: {
    pergunta: 'Sua dor ou atenção é na coluna? Qual região?',
    regioes: ['Cervical', 'Torácica', 'Lombar'],
    sugestoes: {
      Cervical: ['Cervicalgia', 'Radiculopatia', 'Tensão muscular'],
      Torácica: ['Dorsalgia', 'Disfunção postural'],
      Lombar: ['Lombalgia', 'Hérnia de disco', 'Ciatalgia']
    },
    protocolos: {
      Cervical: 'Teste de Spurling, Avaliação de amplitude cervical, Palpação muscular.',
      Torácica: 'Avaliação postural, Mobilização torácica, Palpação muscular.',
      Lombar: 'Teste de Lasègue, Avaliação de flexão lombar, Palpação paravertebral.'
    }
  },
  ombro: {
    pergunta: 'Sua dor ou atenção é no ombro?',
    regioes: ['Direito', 'Esquerdo'],
    sugestoes: {
      Direito: ['Síndrome do impacto', 'Tendinite do manguito rotador', 'Irradiação cervical'],
      Esquerdo: ['Síndrome do impacto', 'Tendinite do manguito rotador', 'Irradiação cervical']
    },
    protocolos: {
      Direito: 'Teste de Neer, Teste de Hawkins-Kennedy, Avaliação cervical.',
      Esquerdo: 'Teste de Neer, Teste de Hawkins-Kennedy, Avaliação cervical.'
    }
  },
  joelho: {
    pergunta: 'Sua dor ou atenção é no joelho?',
    regioes: ['Direito', 'Esquerdo'],
    sugestoes: {
      Direito: ['Condromalácia patelar', 'Lesão meniscal', 'Tendinite patelar'],
      Esquerdo: ['Condromalácia patelar', 'Lesão meniscal', 'Tendinite patelar']
    },
    protocolos: {
      Direito: 'Teste de compressão patelar, Teste de McMurray, Teste de Lachman.',
      Esquerdo: 'Teste de compressão patelar, Teste de McMurray, Teste de Lachman.'
    }
  },
  quadril: {
    pergunta: 'Sua dor ou atenção é no quadril?',
    regioes: ['Direito', 'Esquerdo'],
    sugestoes: {
      Direito: ['Bursite trocantérica', 'Coxartrose', 'Síndrome do piriforme'],
      Esquerdo: ['Bursite trocantérica', 'Coxartrose', 'Síndrome do piriforme']
    },
    protocolos: {
      Direito: 'Teste de FABER, Teste de FADIR, Palpação trocantérica.',
      Esquerdo: 'Teste de FABER, Teste de FADIR, Palpação trocantérica.'
    }
  },
  tornozelo: {
    pergunta: 'Sua dor ou atenção é no tornozelo/pé?',
    regioes: ['Direito', 'Esquerdo'],
    sugestoes: {
      Direito: ['Entorse', 'Fascite plantar', 'Tendinite aquileana'],
      Esquerdo: ['Entorse', 'Fascite plantar', 'Tendinite aquileana']
    },
    protocolos: {
      Direito: 'Teste de gaveta anterior, Palpação plantar, Teste de Thompson.',
      Esquerdo: 'Teste de gaveta anterior, Palpação plantar, Teste de Thompson.'
    }
  },
  cotovelo: {
    pergunta: 'Sua dor ou atenção é no cotovelo?',
    regioes: ['Direito', 'Esquerdo'],
    sugestoes: {
      Direito: ['Epicondilite lateral', 'Epicondilite medial', 'Irradiação cervical'],
      Esquerdo: ['Epicondilite lateral', 'Epicondilite medial', 'Irradiação cervical']
    },
    protocolos: {
      Direito: 'Teste de Cozen, Teste de Mill, Teste de flexores do punho, Avaliação cervical.',
      Esquerdo: 'Teste de Cozen, Teste de Mill, Teste de flexores do punho, Avaliação cervical.'
    }
  },
  punho: {
    pergunta: 'Sua dor ou atenção é no punho/mão?',
    regioes: ['Direito', 'Esquerdo'],
    sugestoes: {
      Direito: ['Síndrome do túnel do carpo', 'Tendinite de De Quervain'],
      Esquerdo: ['Síndrome do túnel do carpo', 'Tendinite de De Quervain']
    },
    protocolos: {
      Direito: 'Teste de Phalen, Teste de Finkelstein, Palpação tenar.',
      Esquerdo: 'Teste de Phalen, Teste de Finkelstein, Palpação tenar.'
    }
  },
};
// Regiões detalhadas para visão anterior
const regioesAnterior = [
  { id: 'cabeca', label: 'Cabeça', cx: 110, cy: 40 },
  { id: 'pescoco', label: 'Pescoço', cx: 110, cy: 65 },
  { id: 'ombroE', label: 'Ombro Esquerdo', cx: 80, cy: 75 },
  { id: 'ombroD', label: 'Ombro Direito', cx: 140, cy: 75 },
  { id: 'bracoE', label: 'Braço Esquerdo', cx: 75, cy: 110 },
  { id: 'bracoD', label: 'Braço Direito', cx: 145, cy: 110 },
  { id: 'cotoveloE', label: 'Cotovelo Esquerdo', cx: 75, cy: 135 },
  { id: 'cotoveloD', label: 'Cotovelo Direito', cx: 145, cy: 135 },
  { id: 'antebracoE', label: 'Antebraço Esquerdo', cx: 75, cy: 160 },
  { id: 'antebracoD', label: 'Antebraço Direito', cx: 145, cy: 160 },
  { id: 'maoE', label: 'Mão Esquerda', cx: 75, cy: 185 },
  { id: 'maoD', label: 'Mão Direita', cx: 145, cy: 185 },
  { id: 'dedosMaoE', label: 'Dedos da Mão Esquerda', cx: 75, cy: 200 },
  { id: 'dedosMaoD', label: 'Dedos da Mão Direita', cx: 145, cy: 200 },
  { id: 'torax', label: 'Tórax', cx: 110, cy: 90 },
  { id: 'quadril', label: 'Quadril', cx: 110, cy: 140 },
  { id: 'coxaE', label: 'Coxa Esquerda', cx: 95, cy: 170 },
  { id: 'coxaD', label: 'Coxa Direita', cx: 125, cy: 170 },
  { id: 'joelhoE', label: 'Joelho Esquerdo', cx: 95, cy: 200 },
  { id: 'joelhoD', label: 'Joelho Direito', cx: 125, cy: 200 },
  { id: 'panturrilhaE', label: 'Panturrilha Esquerda', cx: 95, cy: 230 },
  { id: 'panturrilhaD', label: 'Panturrilha Direita', cx: 125, cy: 230 },
  { id: 'peE', label: 'Pé Esquerdo', cx: 95, cy: 260 },
  { id: 'peD', label: 'Pé Direito', cx: 125, cy: 260 },
  { id: 'dedosPeE', label: 'Dedos dos Pés Esquerdo', cx: 95, cy: 275 },
  { id: 'dedosPeD', label: 'Dedos dos Pés Direito', cx: 125, cy: 275 },
];

// Regiões detalhadas para visão posterior
const regioesPosterior = [
  { id: 'cabeca', label: 'Cabeça', cx: 110, cy: 40 },
  { id: 'cervical', label: 'Cervical (Pescoço)', cx: 110, cy: 65 },
  { id: 'ombroE', label: 'Ombro Esquerdo', cx: 80, cy: 75 },
  { id: 'ombroD', label: 'Ombro Direito', cx: 140, cy: 75 },
  { id: 'bracoE', label: 'Braço Esquerdo', cx: 75, cy: 110 },
  { id: 'bracoD', label: 'Braço Direito', cx: 145, cy: 110 },
  { id: 'cotoveloE', label: 'Cotovelo Esquerdo', cx: 75, cy: 135 },
  { id: 'cotoveloD', label: 'Cotovelo Direito', cx: 145, cy: 135 },
  { id: 'antebracoE', label: 'Antebraço Esquerdo', cx: 75, cy: 160 },
  { id: 'antebracoD', label: 'Antebraço Direito', cx: 145, cy: 160 },
  { id: 'maoE', label: 'Mão Esquerda', cx: 75, cy: 185 },
  { id: 'maoD', label: 'Mão Direita', cx: 145, cy: 185 },
  { id: 'troncoCervical', label: 'Tronco - Cervical', cx: 110, cy: 80 },
  { id: 'troncoTorax', label: 'Tronco - Tórax', cx: 110, cy: 110 },
  { id: 'troncoLombar', label: 'Tronco - Lombar', cx: 110, cy: 140 },
  { id: 'quadril', label: 'Quadril', cx: 110, cy: 160 },
  { id: 'coxaE', label: 'Coxa Esquerda', cx: 95, cy: 170 },
  { id: 'coxaD', label: 'Coxa Direita', cx: 125, cy: 170 },
  { id: 'fossaPopliteaE', label: 'Fossa Poplítea Esquerda', cx: 95, cy: 200 },
  { id: 'fossaPopliteaD', label: 'Fossa Poplítea Direita', cx: 125, cy: 200 },
  { id: 'panturrilhaE', label: 'Panturrilha Esquerda', cx: 95, cy: 230 },
  { id: 'panturrilhaD', label: 'Panturrilha Direita', cx: 125, cy: 230 },
  { id: 'peE', label: 'Pé Esquerdo', cx: 95, cy: 260 },
  { id: 'peD', label: 'Pé Direito', cx: 125, cy: 260 },
];


const CorpoHumanoInterativo = ({ value = [], onChange, semDor = false }) => {
  const [areaSelecionada, setAreaSelecionada] = useState(null); // Ex: 'ombro'
  const [ladoSelecionado, setLadoSelecionado] = useState(null); // Ex: 'Direito'
  const [diagnostico, setDiagnostico] = useState([]); // [{area, regiao, sugestao}]
  const [modal, setModal] = useState(null); // Modal de sugestão

  // Seleção inicial: grandes áreas
  if (!areaSelecionada) {
    return (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold mb-4">{semDor ? 'Onde você gostaria de atenção?' : 'Selecione a grande área da dor:'}</h2>
        <div className="grid grid-cols-2 gap-4">
          {grandesAreas.map(area => (
            <button key={area.id} className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-6 py-4 rounded-xl shadow" onClick={() => setAreaSelecionada(area.id)}>
              {area.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Seleção de lado/região dentro da área
  const protocolo = protocolosPorArea[areaSelecionada];
  if (protocolo && !ladoSelecionado) {
    return (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold mb-4">{protocolo.pergunta}</h2>
        <div className="grid grid-cols-2 gap-4">
          {protocolo.regioes.map(regiao => (
            <button key={regiao} className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-6 py-4 rounded-xl shadow" onClick={() => setLadoSelecionado(regiao)}>
              {regiao}
            </button>
          ))}
        </div>
        <button className="mt-4 text-gray-500 underline" onClick={() => setAreaSelecionada(null)}>Voltar</button>
      </div>
    );
  }

  // Modal de hipóteses e protocolos
  if (protocolo && ladoSelecionado && !modal) {
    setModal({
      area: areaSelecionada,
      regiao: ladoSelecionado,
      sugestoes: protocolo.sugestoes[ladoSelecionado],
      protocolo: protocolo.protocolos[ladoSelecionado]
    });
    return null;
  }

  // Exibe modal de confirmação
  if (modal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Confirmação</h2>
          <p className="mb-4">Hipóteses iniciais para <b>{modal.area}</b> ({modal.regiao}):</p>
          <ul className="list-disc pl-5 text-gray-700 mb-4">
            {modal.sugestoes.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <div className="mb-4 w-full">
            <div className="font-semibold mb-2">Protocolos sugeridos:</div>
            <div className="text-gray-700">{modal.protocolo}</div>
          </div>
          <div className="flex gap-4 mt-2">
            {modal.sugestoes.map((s, i) => (
              <button key={i} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => {
                setDiagnostico([...diagnostico, { area: modal.area, regiao: modal.regiao, sugestao: s }]);
                setModal(null);
                setAreaSelecionada(null);
                setLadoSelecionado(null);
              }}>
                Confirmar: {s}
              </button>
            ))}
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-300" onClick={() => { setModal(null); setAreaSelecionada(null); setLadoSelecionado(null); }}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  // Diagnóstico final
  if (diagnostico.length > 0) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
        <h3 className="font-bold mb-2">Fisiodiagnóstico inicial</h3>
        {diagnostico.map((c, i) => (
          <div key={i} className="mb-2">
            <span>
              Tudo indica que você apresenta <b>{c.sugestao}</b> em <b>{c.area}</b> ({c.regiao}),
              pois relatou dor/atenção e os protocolos sugeridos serão aplicados para confirmação.
            </span>
          </div>
        ))}
        <div className="mt-2">Vamos continuar o tratamento, evoluindo os exercícios conforme sua resposta e sintomas. Até amanhã!</div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => { setAreaSelecionada(null); setLadoSelecionado(null); }}>Adicionar outra área</button>
      </div>
    );
  }

  // Modal de confirmação
  if (modal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Confirmação</h2>
          <p className="mb-4">{modal.pergunta}</p>
          <div className="mb-4 w-full">
            <div className="font-semibold mb-2">Hipóteses iniciais:</div>
            <ul className="list-disc pl-5 text-gray-700">
              {modal.sugestoes.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4 w-full">
            <div className="font-semibold mb-2">Protocolos sugeridos:</div>
            <div className="text-gray-700">{modal.protocolo}</div>
          </div>
          <div className="flex gap-4 mt-2">
            {modal.sugestoes.map((s, i) => (
              <button key={i} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => confirmarModal(s)}>
                Confirmar: {s}
              </button>
            ))}
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-300" onClick={() => setModal(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  // Seleção inicial: grandes áreas
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold mb-4">{semDor ? 'Onde você gostaria de atenção?' : 'Selecione a grande área da dor:'}</h2>
      <div className="grid grid-cols-2 gap-4">
        {grandesAreas.map(area => (
          <button key={area.id} className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-6 py-4 rounded-xl shadow" onClick={() => setAreaSelecionada(area.id)}>
            {area.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CorpoHumanoInterativo;
