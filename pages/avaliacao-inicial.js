import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Upload, ArrowRight, ArrowLeft, Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import CorpoHumanoInterativo from '../components/CorpoHumanoInterativo';

import { supabase } from '../services/supabaseClient';

export default function AvaliacaoInicial() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Inicio, 2: CorpoHumanoInterativo, 3: Confirmação
  const [hasPain, setHasPain] = useState(null);
  const [diagnostico, setDiagnostico] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // hipoteses e bodyParts removidos, pois agora usamos CorpoHumanoInterativo


  const handlePainSelection = (pain) => {
    setHasPain(pain);
    if (pain) {
      setStep(2);
    } else {
      router.push('/grandes-areas'); // Redireciona para prevenção personalizada
    }
  };

  // Callback para receber diagnóstico do CorpoHumanoInterativo
  const handleDiagnostico = (novoDiagnostico) => {
    setDiagnostico(novoDiagnostico);
    setStep(3);
  };

  const handleFileChange = async (e) => {
    setUploadError('');
    setUploading(true);
    const files = Array.from(e.target.files);
    const uploaded = [];
    for (const file of files) {
      const filePath = `avaliacoes/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('exames').upload(filePath, file);
      if (error) {
        setUploadError('Erro ao fazer upload. Tente novamente.');
      } else {
        uploaded.push({ name: file.name, path: filePath });
      }
    }
    setUploadedFiles([...uploadedFiles, ...uploaded]);
    setUploading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {/* Barra de Progresso Fixa no Topo */}
      <div className="w-full max-w-2xl sticky top-0 z-20 mb-6 flex gap-2 bg-opacity-80 backdrop-blur-sm py-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-indigo-500 to-blue-400 shadow-lg' : 'bg-gray-200'}`}
            aria-label={`Passo ${s}`}
          />
        ))}
      </div>
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 border border-blue-100 animate-fade-in">
        {/* Cabeçalho Padrão */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center shadow-md">
          <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg">
            {step === 4 ? 'Confirmação do Diagnóstico' : 'Avaliação Inicial'}
          </h1>
          <p className="opacity-90 text-base mt-2">
            {step === 4 ? 'Verifique os dados antes de iniciar o protocolo.' : 'Vamos entender como você está hoje.'}
          </p>
        </div>
        <div className="p-8">
          {/* PASSO 1: UPLOAD E DOR */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div
                className={`border-2 border-dashed border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer group relative ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                tabIndex={0}
                aria-label="Upload de exames"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Selecionar arquivos para upload"
                />
                <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-all duration-300">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-base font-medium text-blue-700">Clique ou arraste seus exames aqui (PDF/JPG)</p>
                {uploading && <span className="text-xs text-blue-600 mt-2 animate-pulse">Enviando arquivos...</span>}
                {uploadError && <span className="text-xs text-red-600 mt-2">{uploadError}</span>}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 w-full">
                    <span className="text-green-700 text-sm font-semibold">Arquivos enviados:</span>
                    <ul className="list-disc pl-5 text-green-700 text-xs mt-1">
                      {uploadedFiles.map((f, i) => (
                        <li key={i}>{f.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Você está sentindo dor hoje?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => handlePainSelection(true)} className="px-8 py-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-700 font-bold hover:bg-red-100 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg shadow-sm focus:ring-2 focus:ring-red-300" aria-label="Sim, sinto dor">
                    <AlertTriangle size={22}/> Sim, sinto dor
                  </button>
                  <button onClick={() => handlePainSelection(false)} className="px-8 py-4 rounded-2xl border-2 border-green-100 bg-green-50 text-green-700 font-bold hover:bg-green-100 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg shadow-sm focus:ring-2 focus:ring-green-300" aria-label="Não, estou bem">
                    <CheckCircle size={22}/> Não, estou bem
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* PASSO 2: CorpoHumanoInterativo para dor */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <CorpoHumanoInterativo
                value={diagnostico}
                onChange={novoDiagnostico => handleDiagnostico(novoDiagnostico)}
                semDor={false}
              />
              <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">
                <ArrowLeft size={14}/> Voltar
              </button>
            </div>
          )}
          {/* PASSO 3: CONFIRMAÇÃO (usando diagnóstico do CorpoHumanoInterativo) */}
          {step === 3 && diagnostico.length > 0 && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-100 rounded-2xl p-8 mb-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow text-indigo-600">
                    <Activity size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Diagnóstico(s) inicial(is)</h2>
                    <ul className="space-y-2">
                      {diagnostico.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-base font-medium text-gray-700 bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          {item.sugestao} em {item.area} ({item.regiao})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-gray-700 text-lg mb-4">Confirma que estes são seus sintomas para gerarmos o protocolo correto?</p>
                <button 
                  onClick={() => router.push('/protocolos')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-indigo-400"
                >
                  Sim, Iniciar Protocolos
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleRestart}
                  className="w-full py-3 text-gray-500 font-medium hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Não, refazer avaliação
                </button>
              </div>
            </div>
          )}
          {/* PASSO 4: CONFIRMAÇÃO */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-300">
              {/* Box de Destaque */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedPart} ({selectedSide})
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Hipóteses iniciais identificadas:</p>
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
                <p className="text-gray-600 mb-4">Confirma que estes são seus sintomas para gerarmos o protocolo correto?</p>
                {/* Botão Principal de Ação */}
                <button 
                  onClick={goToProtocols}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Sim, Iniciar Protocolos
                  <ArrowRight className="w-5 h-5" />
                </button>
                {/* Botão Secundário */}
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
