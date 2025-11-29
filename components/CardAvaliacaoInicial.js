
import CorpoHumanoInterativo from './CorpoHumanoInterativo';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Upload, Frown, Smile, CheckCircle } from 'lucide-react';


const CardAvaliacaoInicial = ({ onComplete }) => {
  const router = useRouter();
  const [exames, setExames] = useState([]);
  const [temDor, setTemDor] = useState(null); // 'sim' ou 'nao'
  const [examePreview, setExamePreview] = useState([]);
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [regioesDor, setRegioesDor] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [mostrarTratamento, setMostrarTratamento] = useState(false);
  const fileInputRef = useRef(null);

  const handleExameChange = (e) => {
    const files = Array.from(e.target.files);
    setExames(files);
    setExamePreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setExames(files);
    setExamePreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (temDor === null) {
      setErro('Por favor, responda se você sente dor.');
      return;
    }
    if (exames.length === 0) {
      setErro('Por favor, faça upload de pelo menos um exame ou documento.');
      return;
    }
    if (temDor && regioesDor.length === 0) {
      setErro('Por favor, marque no corpo onde sente dor.');
      return;
    }
    setErro('');
    setEnviado(true);
    if (onComplete) onComplete();
  };

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="rounded-lg shadow-md bg-green-50 p-6 text-center max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Avaliação enviada!</h3>
          <p className="text-green-700 mb-4">Obrigado por completar sua avaliação inicial.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow mt-2"
            onClick={() => router.push('/dashboard-paciente')}
          >
            Ver próximos passos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Avaliação Inicial</h1>
          <p className="text-gray-500 text-sm mt-2">Vamos checar como você está hoje.</p>
        </div>

        {/* Área de Upload (Dropzone Bonita) */}
        <div
          className={`border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 p-8 text-center cursor-pointer hover:bg-blue-100 transition-colors relative ${dragActive ? 'border-blue-400 bg-blue-100' : ''}`}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleExameChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            {exames.length > 0 ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500" />
                <span className="text-sm font-medium text-green-700">{exames[0].name}{exames.length > 1 ? ` +${exames.length - 1} arquivo(s)` : ''}</span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-blue-400" />
                <span className="text-sm font-medium text-blue-700">Clique ou arraste seus exames</span>
                <span className="text-xs text-blue-400">PDF, JPG ou PNG</span>
              </>
            )}
          </div>
        </div>

        {/* Pergunta sobre Dor (Botões Grandes) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Você está sentindo dor hoje?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Botão SIM */}
            <button
              type="button"
              onClick={() => setTemDor('sim')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all w-full
                ${temDor === 'sim' ? 'border-red-500 bg-red-50 text-red-600 scale-105' : 'border-gray-200 hover:border-red-200 hover:bg-gray-50 text-gray-600'}`}
            >
              <Frown className={`w-8 h-8 ${temDor === 'sim' ? 'fill-current' : ''}`} />
              <span className="font-semibold">Sim, sinto</span>
            </button>

            {/* Botão NÃO */}
            <button
              type="button"
              onClick={() => setTemDor('nao')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all w-full
                ${temDor === 'nao' ? 'border-green-500 bg-green-50 text-green-600 scale-105' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-600'}`}
            >
              <Smile className={`w-8 h-8 ${temDor === 'nao' ? 'fill-current' : ''}`} />
              <span className="font-semibold">Não, estou bem</span>
            </button>
          </div>
        </div>

        {/* Corpo Humano Interativo se dor */}

        {temDor === 'sim' && (
          <div className="w-full mt-4">
            <CorpoHumanoInterativo value={regioesDor} onChange={setRegioesDor} />
          </div>
        )}

        {temDor === 'nao' && !mostrarTratamento && (
          <div className="flex flex-col items-center mt-4 gap-4">
            <div className="text-gray-600 text-center">Ótimo! Caso sinta dor futuramente, vamos tratar juntos.</div>
            <button
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-6 py-3 rounded-xl shadow mt-2"
              onClick={() => setMostrarTratamento(true)}
            >
              Não, mas quero tratamento
            </button>
          </div>
        )}

        {temDor === 'nao' && mostrarTratamento && (
          <div className="flex flex-col items-center mt-4 gap-4">
            <div className="text-gray-700 text-center mb-2">Selecione a área que deseja tratar preventivamente:</div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow"
              onClick={() => router.push('/grandes-areas')}
            >
              Escolher grande área
            </button>
          </div>
        )}

        {erro && <div className="text-red-600 mb-4 text-center">{erro}</div>}

        {/* Botão de Enviar (Chamativo) */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 mt-2 text-xl"
        >
          Enviar Avaliação
        </button>
      </div>
    </div>
  );
};

export default CardAvaliacaoInicial;
