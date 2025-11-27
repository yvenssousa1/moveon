
import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import CardBoasVindas from '../components/CardBoasVindas';
import CardAvaliacaoInicial from '../components/CardAvaliacaoInicial';
import SidebarMenu from '../components/SidebarMenu';
import { supabase } from '../services/supabaseClient';


export default function DashboardPaciente() {
  const [nome, setNome] = useState('');
  const proximoAgendamento = '29/11/2025, 14:00 - Dr. Marcos (Online)';
  const progresso = '60% do Plano Concluído';
  const [avaliacaoCompleta, setAvaliacaoCompleta] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setNome(user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Usuário');
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex">
      <SidebarMenu onLogout={() => alert('Logout')} />
      <div className="flex-1 ml-20 max-w-3xl mx-auto px-4 pb-8">
        <DashboardHeader nome={nome} />
        <CardBoasVindas nome={nome} proximoAgendamento={proximoAgendamento} progresso={progresso} />
        <div className="mt-8 flex flex-col items-center">
          <a
            href="/avaliacao-inicial"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition text-lg font-semibold"
          >
            Avaliação Inicial
          </a>
        </div>
        {/* Outras funcionalidades do dashboard só aparecem após avaliação inicial */}
      </div>
    </div>
  );
}
