import CorpoHumanoInterativo from './CorpoHumanoInterativo';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const CardAvaliacaoInicial = ({ onComplete }) => {
  const [exames, setExames] = useState([]);
  const [temDor, setTemDor] = useState(null);
  const [examePreview, setExamePreview] = useState([]);
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [regioesDor, setRegioesDor] = useState([]);
  const router = useRouter();

  const handleExameChange = (e) => {
    const files = Array.from(e.target.files);
    setExames(files);
    setExamePreview(files.map(file => URL.createObjectURL(file)));
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
          <p className="text-green-700">Obrigado por completar sua avaliação inicial.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <form onSubmit={handleSubmit} className="rounded-lg shadow-md bg-white p-8 mb-6 w-full max-w-md flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-6 text-center">Avaliação Inicial</h3>
        <div className="mb-6 w-full">
          <label className="block font-medium mb-2 text-center">Upload de exames/documentos</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleExameChange}
            className="block w-full border rounded p-2 text-center"
          />
          <div className="flex flex-wrap mt-2 gap-2 justify-center">
            {examePreview.map((src, idx) => (
              <img key={idx} src={src} alt="Prévia" className="w-16 h-16 object-cover rounded border" />
            ))}
          </div>
        </div>
        <div className="mb-6 w-full flex flex-col items-center">
          <label className="block font-medium mb-2 text-center">Você tem dor?</label>
          <div className="flex gap-6 justify-center mb-2">
            <button
              type="button"
              className={`px-6 py-2 rounded-lg text-lg font-semibold ${temDor === true ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setTemDor(true);
                router.push('/marcar-dor');
              }}
            >
              Sim
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-lg text-lg font-semibold ${temDor === false ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setTemDor(false)}
            >
              Não
            </button>
          </div>
          {temDor === true && (
            <CorpoHumanoInterativo value={regioesDor} onChange={setRegioesDor} />
          )}
          {temDor === false && (
            <div className="text-gray-600 text-center mt-4">Ótimo! Caso sinta dor futuramente, vamos tratar juntos.</div>
          )}
        </div>
        {erro && <div className="text-red-600 mb-4 text-center">{erro}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition mt-2"
        >
          Enviar avaliação
        </button>
      </form>
    </div>
  );
};

export default CardAvaliacaoInicial;
