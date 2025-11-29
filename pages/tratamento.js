import { useRouter } from 'next/router';
import { useState } from 'react';

const protocolosGerais = {
  coluna: 'Protocolo geral para coluna: Mobilização suave, alongamento leve e fortalecimento básico.',
  ombro: 'Protocolo geral para ombro: Exercícios de amplitude, fortalecimento do manguito e mobilidade.',
  joelho: 'Protocolo geral para joelho: Alongamento, mobilidade e fortalecimento de quadríceps.',
  quadril: 'Protocolo geral para quadril: Mobilidade, fortalecimento de glúteos e alongamento.',
  tornozelo: 'Protocolo geral para tornozelo: Exercícios de propriocepção, mobilidade e força.',
  cotovelo: 'Protocolo geral para cotovelo: Mobilidade, alongamento e fortalecimento leve.',
  punho: 'Protocolo geral para punho/mão: Mobilidade, fortalecimento e coordenação fina.',
};

const motivos = [
  'Dor',
  'Cansaço',
  'Falta de coordenação',
  'Outro motivo',
];

const protocolosEspecificos = {
  Dor: 'Protocolo personalizado para dor: Reduzir intensidade, priorizar analgesia e mobilidade leve.',
  Cansaço: 'Protocolo para cansaço: Pausas frequentes, exercícios respiratórios e progressão gradual.',
  'Falta de coordenação': 'Protocolo para coordenação: Exercícios de controle motor, propriocepção e repetição guiada.',
  'Outro motivo': 'Protocolo adaptado: Ajustar conforme necessidade individual, consultar fisioterapeuta.',
};

export default function Tratamento() {
  const router = useRouter();
  const { area, possibilidade } = router.query;
  const [passo, setPasso] = useState(1);
  const [motivo, setMotivo] = useState('');

  const protocoloGeral = protocolosGerais[area] || 'Protocolo geral: Exercícios leves, mobilidade e fortalecimento.';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-8 text-indigo-900 drop-shadow-lg tracking-tight">Tratamento para {area}</h1>
      <h2 className="text-lg mb-6 text-blue-700">Motivo: <b>{possibilidade}</b></h2>
      {passo === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center animate-fade-in">
          <div className="mb-6 text-gray-800 text-lg font-medium">{protocoloGeral}</div>
          <button
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg text-lg transition-all duration-300 focus:ring-2 focus:ring-green-400"
            onClick={() => setPasso(2)}
            aria-label="Não consegui realizar"
          >
            Não consegui realizar
          </button>
        </div>
      )}
      {passo === 2 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center animate-fade-in">
          <div className="mb-6 text-gray-800 text-lg font-medium">Por qual motivo não conseguiu realizar?</div>
          <div className="grid grid-cols-1 gap-4 w-full">
            {motivos.map((m) => (
              <button
                key={m}
                className={`bg-gradient-to-r from-blue-100 to-blue-300 hover:from-blue-200 hover:to-blue-400 text-blue-900 font-bold px-8 py-4 rounded-2xl shadow-lg text-lg transition-all duration-300 focus:ring-2 focus:ring-blue-400 ${motivo === m ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setMotivo(m)}
                aria-label={`Selecionar motivo ${m}`}
              >
                {m}
              </button>
            ))}
          </div>
          {motivo && (
            <div className="mt-8 w-full text-center animate-fade-in">
              <div className="mb-4 text-green-700 font-semibold text-lg">{protocolosEspecificos[motivo]}</div>
              <button
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg text-lg transition-all duration-300 focus:ring-2 focus:ring-green-400"
                onClick={() => alert('Protocolo personalizado iniciado!')}
                aria-label="Iniciar protocolo personalizado"
              >
                Iniciar protocolo personalizado
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
