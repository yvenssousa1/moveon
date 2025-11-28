
import React from 'react';
import { Calendar, TrendingUp, Activity, ArrowRight, Clock, User } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. SIDEBAR (Menu Lateral Fixo e Limpo) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tighter">MoveOn</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
            <Activity size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <TrendingUp size={20} /> Tarefas
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Calendar size={20} /> Agendamentos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <User size={20} /> Perfil
          </a>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Cabeçalho Simples */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Olá, Yvens! 👋</h2>
            <p className="text-gray-500 mt-1">Aqui está o resumo da sua evolução hoje.</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
            YP
          </div>
        </header>

        {/* GRADE DE CARDS (Widgets) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Próximo Agendamento */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                <Calendar size={24} />
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Confirmado</span>
            </div>
            <p className="text-sm text-gray-500">Próxima Consulta</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">29 Nov, 14:00</h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <User size={14}/> Dr. Marcos (Online)
            </p>
          </div>

          {/* Card 2: Progresso Geral (Visual) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <TrendingUp size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">60%</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Plano Concluído</p>
            {/* Barra de Progresso */}
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Continue assim! Você está indo bem.</p>
          </div>

           {/* Card 3: Status Atual */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                <Clock size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500">Sessões Restantes</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">4 Sessões</h3>
            <p className="text-sm text-gray-400 mt-1">Renovação em 15 dias</p>
          </div>
        </div>

        {/* SEÇÃO DE AÇÃO PRINCIPAL (Antigo link "Avaliação Inicial") */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg relative overflow-hidden">
          {/* Círculos decorativos de fundo (opcional para estilo) */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"></div>

          <div className="z-10 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Avaliação Inicial Pendente</h3>
            <p className="text-blue-100 max-w-lg">
              Precisamos atualizar seus dados para personalizar seus próximos exercícios. Leva menos de 2 minutos.
            </p>
          </div>
          <button className="z-10 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2">
            Começar Agora <ArrowRight size={18} />
          </button>
        </div>

      </main>
    </div>
  );
}
