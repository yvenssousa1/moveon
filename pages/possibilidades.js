import { useRouter } from 'next/router';

const possibilidades = [
  'Não consigo esticar',
  'Não tenho força',
  'Perdi o movimento',
  'Não consigo dobrar',
  'Não tenho equilíbrio',
  'Não tenho coordenação',
  'Outro problema funcional',
];

export default function Possibilidades() {
  const router = useRouter();
  const { area } = router.query;

  const handlePossibilidadeClick = (possibilidade) => {
    router.push(`/tratamento?area=${encodeURIComponent(area)}&possibilidade=${encodeURIComponent(possibilidade)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-8 text-green-900 drop-shadow-lg tracking-tight">O que você sente na área selecionada?</h1>
      <h2 className="text-lg mb-6 text-blue-700">Área: <b>{area}</b></h2>
      <div className="grid grid-cols-1 gap-6 w-full max-w-lg">
        {possibilidades.map((poss, idx) => (
          <button
            key={idx}
            className="bg-gradient-to-r from-green-100 to-green-300 hover:from-green-200 hover:to-green-400 text-green-900 font-bold px-8 py-6 rounded-2xl shadow-lg transition-all duration-300 text-lg focus:ring-2 focus:ring-green-400"
            onClick={() => handlePossibilidadeClick(poss)}
            aria-label={`Selecionar possibilidade ${poss}`}
          >
            {poss}
          </button>
        ))}
      </div>
    </div>
  );
}
