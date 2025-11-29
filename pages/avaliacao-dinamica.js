import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Upload, ArrowRight, ArrowLeft, Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AvaliacaoDinamica() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Inicio, 2: Area, 3: Lado, 4: Confirmação
  const [hasPain, setHasPain] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);

  const hipoteses = {
    Joelho: ['Condromalácia Patelar', 'Lesão Meniscal', 'Tendinite Patelar'],
    Ombro: ['Bursite Subacromial', 'Tendinite do Manguito', 'Capsulite Adesiva'],
    Coluna: ['Hérnia de Disco', 'Lombalgia Mecânica', 'Cervicalgia'],
    // Adicione outros mapeamentos aqui...
  };

  const bodyParts = [
    'Coluna', 'Ombro', 'Joelho', 'Quadril', 'Tornozelo/Pé', 'Cotovelo', 'Punho/Mão'
  ];

  // --- Funções de Navegação ---
  const handlePainSelection = (pain) => {
    setHasPain(pain);
    if (pain) {
      setStep(2);
    } else {
      // Redireciona para prevenção personalizada
      router.push('/grandes-areas');
    }
  };

  const handlePartSelection = (part) => {
    setSelectedPart(part);
    setStep(3);
  };

  const handleSideSelection = (side) => {
    setSelectedSide(side);
    setStep(4);
  };

  const handleRestart = () => {
    setStep(1);
    setHasPain(null);
    setSelectedPart(null);
    setSelectedSide(null);
  };

  const goToProtocols = () => {
    router.push(`/protocolos?area=${encodeURIComponent(selectedPart)}&lado=${encodeURIComponent(selectedSide)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {/* Barra de Progresso Simples */}
      <div className="w-full max-w-2xl mb-6 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
        {/* Cabeçalho Padrão */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">
            {step === 4 ? 'Confirmação da Área de Dor' : 'Avaliação Inicial'}
          </h1>
          <p className="opacity-90 text-sm">
            {step === 4 ? `Você sente dor em ${selectedPart ? selectedPart.toLowerCase() : ''}${selectedSide ? ' (' + selectedSide.toLowerCase() + ')' : ''}?` : 'Vamos entender como você está hoje.'}
          </p>
        </div>
        <div className="p-8">
          {/* PASSO 1: UPLOAD E DOR */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer group">
                <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Arraste seus exames aqui (PDF/JPG)</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Você está sentindo dor hoje?</h3>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => handlePainSelection(true)} className="px-6 py-3 rounded-xl border-2 border-red-100 bg-red-50 text-red-700 font-bold hover:bg-red-100 hover:scale-105 transition flex items-center gap-2">
                    <AlertTriangle size={18}/> Sim, sinto dor
                  </button>
                  <button onClick={() => handlePainSelection(false)} className="px-6 py-3 rounded-xl border-2 border-green-100 bg-green-50 text-green-700 font-bold hover:bg-green-100 hover:scale-105 transition flex items-center gap-2">
                    <CheckCircle size={18}/> Não, estou bem
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* PASSO 2: SELEÇÃO DA ÁREA */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <h3 className="text-lg font-semibold mb-4 text-center">Onde é a sua dor principal?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {bodyParts.map((part) => (
                  <button
                    key={part}
                    onClick={() => handlePartSelection(part)}
                    className="p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition text-sm font-medium text-gray-600 text-center shadow-sm"
                  >
                    {part}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">
                <ArrowLeft size={14}/> Voltar
              </button>
            </div>
          )}
          {/* PASSO 3: LADO */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 text-center">
              <h3 className="text-lg font-semibold mb-6">A dor no(a) <span className="text-indigo-600">{selectedPart}</span> é em qual lado?</h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleSideSelection('Esquerdo')} className="w-32 py-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 font-bold transition">
                  Esquerdo
                </button>
                <button onClick={() => handleSideSelection('Direito')} className="w-32 py-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 font-bold transition">
                  Direito
                </button>
              </div>
              <button onClick={() => setStep(2)} className="mt-8 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">
                <ArrowLeft size={14}/> Voltar
              </button>
            </div>
          )}
          {/* PASSO 4: CONFIRMAÇÃO */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-300">
              {/* Box de Hipóteses */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedPart} {selectedSide ? `(${selectedSide})` : ''}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">Hipóteses diagnósticas possíveis:</p>
                    <ul className="space-y-2">
                      {(hipoteses[selectedPart] || ['Dor inespecífica', 'Necessária avaliação clínica']).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-3 py-2 rounded-md border border-gray-100 shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-gray-600 mb-4 font-semibold">Você sente dor em {selectedPart ? selectedPart.toLowerCase() : ''}{selectedSide ? ' (' + selectedSide.toLowerCase() + ')' : ''}?</p>
                <button 
                  onClick={goToProtocols}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Sim, iniciar protocolo
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleRestart}
                  className="w-full py-3 text-gray-500 font-medium hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Não, refazer avaliação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
