import React, { useState } from 'react';

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

const CorpoHumanoInterativo = ({ value = [], onChange }) => {

  const [selecionadasAnterior, setSelecionadasAnterior] = useState([]);
  const [selecionadasPosterior, setSelecionadasPosterior] = useState([]);

  const toggleRegiaoAnterior = (id) => {
    let novas;
    if (selecionadasAnterior.includes(id)) {
      novas = selecionadasAnterior.filter((r) => r !== id);
    } else {
      novas = [...selecionadasAnterior, id];
    }
    setSelecionadasAnterior(novas);
    if (onChange) onChange({ anterior: novas, posterior: selecionadasPosterior });
  };

  const toggleRegiaoPosterior = (id) => {
    let novas;
    if (selecionadasPosterior.includes(id)) {
      novas = selecionadasPosterior.filter((r) => r !== id);
    } else {
      novas = [...selecionadasPosterior, id];
    }
    setSelecionadasPosterior(novas);
    if (onChange) onChange({ anterior: selecionadasAnterior, posterior: novas });
  };

  return (
    <div className="flex flex-row items-center justify-center gap-8 my-6">
      {/* SVG Vista Anterior */}
      <svg viewBox="0 0 220 320" width={160} height={320} style={{ background: 'none' }}>
        {/* Cabeça */}
        <path d="M90,30 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0" fill={selecionadasAnterior.includes('cabeca') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('cabeca') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('cabeca')} />
        {/* Pescoço */}
        <rect x="100" y="50" width="20" height="20" rx="6" fill={selecionadasAnterior.includes('pescoco') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('pescoco') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('pescoco')} />
        {/* Ombro Esquerdo */}
        <ellipse cx="85" cy="70" rx="15" ry="10" fill={selecionadasAnterior.includes('ombroE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('ombroE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('ombroE')} />
        {/* Ombro Direito */}
        <ellipse cx="135" cy="70" rx="15" ry="10" fill={selecionadasAnterior.includes('ombroD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('ombroD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('ombroD')} />
        {/* Tórax */}
        <rect x="90" y="80" width="40" height="40" rx="16" fill={selecionadasAnterior.includes('torax') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('torax') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('torax')} />
        {/* Quadril */}
        <rect x="95" y="120" width="30" height="25" rx="12" fill={selecionadasAnterior.includes('quadril') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('quadril') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('quadril')} />
        {/* Braço Esquerdo */}
        <rect x="65" y="80" width="20" height="60" rx="10" fill={selecionadasAnterior.includes('bracoE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('bracoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('bracoE')} />
        {/* Braço Direito */}
        <rect x="135" y="80" width="20" height="60" rx="10" fill={selecionadasAnterior.includes('bracoD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('bracoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('bracoD')} />
        {/* Cotovelo Esquerdo */}
        <ellipse cx="75" cy="140" rx="10" ry="7" fill={selecionadasAnterior.includes('cotoveloE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('cotoveloE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('cotoveloE')} />
        {/* Cotovelo Direito */}
        <ellipse cx="145" cy="140" rx="10" ry="7" fill={selecionadasAnterior.includes('cotoveloD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('cotoveloD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('cotoveloD')} />
        {/* Antebraço Esquerdo */}
        <rect x="65" y="147" width="15" height="35" rx="7" fill={selecionadasAnterior.includes('antebracoE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('antebracoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('antebracoE')} />
        {/* Antebraço Direito */}
        <rect x="140" y="147" width="15" height="35" rx="7" fill={selecionadasAnterior.includes('antebracoD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('antebracoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('antebracoD')} />
        {/* Mão Esquerda */}
        <ellipse cx="72" cy="185" rx="10" ry="12" fill={selecionadasAnterior.includes('maoE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('maoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('maoE')} />
        {/* Mão Direita */}
        <ellipse cx="148" cy="185" rx="10" ry="12" fill={selecionadasAnterior.includes('maoD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('maoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('maoD')} />
        {/* Coxa Esquerda */}
        <rect x="95" y="145" width="15" height="45" rx="8" fill={selecionadasAnterior.includes('coxaE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('coxaE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('coxaE')} />
        {/* Coxa Direita */}
        <rect x="120" y="145" width="15" height="45" rx="8" fill={selecionadasAnterior.includes('coxaD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('coxaD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('coxaD')} />
        {/* Joelho Esquerdo */}
        <ellipse cx="102" cy="195" rx="8" ry="10" fill={selecionadasAnterior.includes('joelhoE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('joelhoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('joelhoE')} />
        {/* Joelho Direito */}
        <ellipse cx="128" cy="195" rx="8" ry="10" fill={selecionadasAnterior.includes('joelhoD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('joelhoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('joelhoD')} />
        {/* Panturrilha Esquerda */}
        <rect x="97" y="205" width="10" height="35" rx="5" fill={selecionadasAnterior.includes('panturrilhaE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('panturrilhaE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('panturrilhaE')} />
        {/* Panturrilha Direita */}
        <rect x="123" y="205" width="10" height="35" rx="5" fill={selecionadasAnterior.includes('panturrilhaD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('panturrilhaD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('panturrilhaD')} />
        {/* Pé Esquerdo */}
        <ellipse cx="102" cy="250" rx="10" ry="7" fill={selecionadasAnterior.includes('peE') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('peE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('peE')} />
        {/* Pé Direito */}
        <ellipse cx="128" cy="250" rx="10" ry="7" fill={selecionadasAnterior.includes('peD') ? '#1976d2' : '#e0e7ef'} opacity={selecionadasAnterior.includes('peD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoAnterior('peD')} />
      </svg>
      {/* SVG Vista Posterior */}
      <svg viewBox="0 0 220 320" width={160} height={320} style={{ background: 'none' }}>
        {/* Silhueta realista (costas) - paths para cada região */}
        {/* Cabeça */}
        <path d="M90,30 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0" fill={selecionadasPosterior.includes('cabeca') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('cabeca') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('cabeca')} />
        {/* Cervical (Pescoço) */}
        <rect x="100" y="50" width="20" height="20" rx="6" fill={selecionadasPosterior.includes('cervical') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('cervical') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('cervical')} />
        {/* Ombro Esquerdo */}
        <ellipse cx="85" cy="70" rx="15" ry="10" fill={selecionadasPosterior.includes('ombroE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('ombroE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('ombroE')} />
        {/* Ombro Direito */}
        <ellipse cx="135" cy="70" rx="15" ry="10" fill={selecionadasPosterior.includes('ombroD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('ombroD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('ombroD')} />
        {/* Tronco - Cervical */}
        <rect x="100" y="80" width="20" height="20" rx="8" fill={selecionadasPosterior.includes('troncoCervical') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('troncoCervical') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('troncoCervical')} />
        {/* Tronco - Tórax */}
        <rect x="95" y="100" width="30" height="30" rx="10" fill={selecionadasPosterior.includes('troncoTorax') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('troncoTorax') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('troncoTorax')} />
        {/* Tronco - Lombar */}
        <rect x="95" y="130" width="30" height="25" rx="10" fill={selecionadasPosterior.includes('troncoLombar') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('troncoLombar') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('troncoLombar')} />
        {/* Quadril */}
        <rect x="95" y="155" width="30" height="20" rx="10" fill={selecionadasPosterior.includes('quadril') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('quadril') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('quadril')} />
        {/* Braço Esquerdo */}
        <rect x="65" y="80" width="20" height="60" rx="10" fill={selecionadasPosterior.includes('bracoE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('bracoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('bracoE')} />
        {/* Braço Direito */}
        <rect x="135" y="80" width="20" height="60" rx="10" fill={selecionadasPosterior.includes('bracoD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('bracoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('bracoD')} />
        {/* Cotovelo Esquerdo */}
        <ellipse cx="75" cy="140" rx="10" ry="7" fill={selecionadasPosterior.includes('cotoveloE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('cotoveloE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('cotoveloE')} />
        {/* Cotovelo Direito */}
        <ellipse cx="145" cy="140" rx="10" ry="7" fill={selecionadasPosterior.includes('cotoveloD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('cotoveloD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('cotoveloD')} />
        {/* Antebraço Esquerdo */}
        <rect x="65" y="147" width="15" height="35" rx="7" fill={selecionadasPosterior.includes('antebracoE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('antebracoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('antebracoE')} />
        {/* Antebraço Direito */}
        <rect x="140" y="147" width="15" height="35" rx="7" fill={selecionadasPosterior.includes('antebracoD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('antebracoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('antebracoD')} />
        {/* Mão Esquerda */}
        <ellipse cx="72" cy="185" rx="10" ry="12" fill={selecionadasPosterior.includes('maoE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('maoE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('maoE')} />
        {/* Mão Direita */}
        <ellipse cx="148" cy="185" rx="10" ry="12" fill={selecionadasPosterior.includes('maoD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('maoD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('maoD')} />
        {/* Coxa Esquerda */}
        <rect x="95" y="175" width="15" height="35" rx="8" fill={selecionadasPosterior.includes('coxaE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('coxaE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('coxaE')} />
        {/* Coxa Direita */}
        <rect x="120" y="175" width="15" height="35" rx="8" fill={selecionadasPosterior.includes('coxaD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('coxaD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('coxaD')} />
        {/* Fossa Poplítea Esquerda */}
        <ellipse cx="102" cy="215" rx="8" ry="10" fill={selecionadasPosterior.includes('fossaPopliteaE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('fossaPopliteaE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('fossaPopliteaE')} />
        {/* Fossa Poplítea Direita */}
        <ellipse cx="128" cy="215" rx="8" ry="10" fill={selecionadasPosterior.includes('fossaPopliteaD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('fossaPopliteaD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('fossaPopliteaD')} />
        {/* Panturrilha Esquerda */}
        <rect x="97" y="225" width="10" height="35" rx="5" fill={selecionadasPosterior.includes('panturrilhaE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('panturrilhaE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('panturrilhaE')} />
        {/* Panturrilha Direita */}
        <rect x="123" y="225" width="10" height="35" rx="5" fill={selecionadasPosterior.includes('panturrilhaD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('panturrilhaD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('panturrilhaD')} />
        {/* Pé Esquerdo */}
        <ellipse cx="102" cy="270" rx="10" ry="7" fill={selecionadasPosterior.includes('peE') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('peE') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('peE')} />
        {/* Pé Direito */}
        <ellipse cx="128" cy="270" rx="10" ry="7" fill={selecionadasPosterior.includes('peD') ? '#e91e63' : '#e0e7ef'} opacity={selecionadasPosterior.includes('peD') ? 0.7 : 0.35} stroke="#0d223a" strokeWidth="3.5" style={{cursor:'pointer'}} onClick={() => toggleRegiaoPosterior('peD')} />
      </svg>
    </div>
  );
};

export default CorpoHumanoInterativo;
