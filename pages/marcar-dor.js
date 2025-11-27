import React, { useState } from 'react';
import CorpoHumanoInterativo from '../components/CorpoHumanoInterativo';
import DashboardHeader from '../components/DashboardHeader';
import SidebarMenu from '../components/SidebarMenu';

export default function MarcarDorPage() {
  const [etapa, setEtapa] = useState('escolha'); // escolha | marcar
  const [regiao, setRegiao] = useState(null); // anterior | posterior | ambos

  const handleEscolha = (valor) => {
    setRegiao(valor);
    setEtapa('marcar');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SidebarMenu onLogout={() => alert('Logout')} />
      <div className="flex-1 ml-20 max-w-2xl mx-auto px-4 pb-8">
        <DashboardHeader nome="" />
        <div className="mt-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-center">Onde está a sua dor?</h1>
          <div className="w-full flex flex-col items-center">
            {etapa === 'escolha' && (
              <div className="flex flex-col gap-4 items-center">
                <p className="text-lg font-medium mb-2 text-center">A dor está na parte da frente, nas costas ou nos dois?</p>
                <div className="flex gap-4">
                  <button onClick={() => handleEscolha('anterior')} className="px-6 py-3 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700">Frente (anterior)</button>
                  <button onClick={() => handleEscolha('posterior')} className="px-6 py-3 rounded bg-pink-600 text-white font-semibold shadow hover:bg-pink-700">Costas (posterior)</button>
                  <button onClick={() => handleEscolha('ambos')} className="px-6 py-3 rounded bg-gray-700 text-white font-semibold shadow hover:bg-gray-900">Ambos</button>
                </div>
              </div>
            )}
            {etapa === 'marcar' && (
              <>
                <CorpoHumanoInterativo mostrarAnterior={regiao === 'anterior' || regiao === 'ambos'} mostrarPosterior={regiao === 'posterior' || regiao === 'ambos'} />
                <div className="mt-8 w-full max-w-md">
                  <label className="block font-medium mb-2 text-center">Não conseguiu marcar? Descreva onde sente dor:</label>
                  <textarea className="w-full border rounded p-2" rows={3} placeholder="Ex: dor no ombro direito, joelho esquerdo..." />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
