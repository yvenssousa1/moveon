
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const protocolos = {
  Joelho: [
    'Exercício de mobilidade leve',
    'Fortalecimento de quadríceps',
    'Alongamento posterior de coxa',
  ],
  Ombro: [
    'Mobilidade de ombro com bastão',
    'Fortalecimento do manguito',
    'Alongamento de peitoral',
  ],
  Coluna: [
    'Mobilidade lombar em quatro apoios',
    'Alongamento de cadeia posterior',
    'Exercício de estabilização abdominal',
  ],
  // ...adicione outros protocolos por área...
};

const ExerciciosEvolutivos = dynamic(() => import('../Next.js/components/ExerciciosEvolutivos'), { ssr: false });

export default function Protocolos() {
  const router = useRouter();
  const { area, lado } = router.query;
  const lista = protocolos[area] || ['Protocolo geral: Exercícios leves, mobilidade e fortalecimento.'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-10 border border-blue-100 animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-6 text-indigo-900 drop-shadow-lg tracking-tight">Protocolos para {area} {lado ? `(${lado})` : ''}</h1>
        <ul className="list-disc pl-6 mb-8 text-gray-800 text-lg">
          {lista.map((item, idx) => (
            <li key={idx} className="mb-3 animate-fade-in delay-100">{item}</li>
          ))}
        </ul>
        {/* Vídeos evolutivos */}
        <div className="my-10">
          <ExerciciosEvolutivos area={(area || '').toLowerCase().replace(' ', '_').replace('ã','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').replace('/','_')} />
        </div>
        <div className="space-y-4 mt-8">
          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg text-xl transition-all focus:ring-2 focus:ring-indigo-400"
            onClick={() => router.push('/dashboard-paciente')}
            aria-label="Concluir e voltar ao dashboard"
          >
            Concluir e voltar ao dashboard
          </button>
          <div className="text-center text-gray-500 font-semibold mt-6 mb-2">Ou escolha outras sugestões de atendimento:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 rounded-xl shadow-md text-lg transition-all"
              onClick={() => router.push('/agendar-presencial')}
            >
              Agendar atendimento presencial
            </button>
            <button
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-lg transition-all"
              onClick={() => router.push('/teleatendimento')}
            >
              Teleatendimento (vídeo)
            </button>
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 rounded-xl shadow-md text-lg transition-all"
              onClick={() => router.push('/reavaliacao')}
            >
              Solicitar reavaliação
            </button>
            <button
              className="bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-md text-lg transition-all"
              onClick={() => router.push('/contato-especialista')}
            >
              Falar com especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
