import { useRouter } from 'next/router';

const grandesAreas = [
  { id: 'coluna', label: 'Coluna' },
  { id: 'ombro', label: 'Ombro' },
  { id: 'joelho', label: 'Joelho' },
  { id: 'quadril', label: 'Quadril' },
  { id: 'tornozelo', label: 'Tornozelo' },
  { id: 'cotovelo', label: 'Cotovelo' },
  { id: 'punho', label: 'Punho/Mão' },
];

export default function GrandesAreas() {
  const router = useRouter();

  const handleAreaClick = (area) => {
    router.push(`/possibilidades?area=${area}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-900 drop-shadow-lg tracking-tight">Selecione a grande área que deseja tratar</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        {grandesAreas.map((area) => (
          <button
            key={area.id}
            className="bg-gradient-to-r from-blue-100 to-blue-300 hover:from-blue-200 hover:to-blue-400 text-blue-900 font-bold px-8 py-6 rounded-2xl shadow-lg transition-all duration-300 text-lg focus:ring-2 focus:ring-blue-400"
            onClick={() => handleAreaClick(area.id)}
            aria-label={`Selecionar área ${area.label}`}
          >
            {area.label}
          </button>
        ))}
      </div>
    </div>
  );
}
