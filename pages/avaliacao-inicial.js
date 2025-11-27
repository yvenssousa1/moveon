import React, { useEffect, useState } from 'react';
import CardAvaliacaoInicial from '../components/CardAvaliacaoInicial';
import DashboardHeader from '../components/DashboardHeader';
import SidebarMenu from '../components/SidebarMenu';
import { supabase } from '../services/supabaseClient';

export default function AvaliacaoInicialPage() {
  const [nome, setNome] = useState('');

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
        <div className="mt-8">
          <CardAvaliacaoInicial />
        </div>
      </div>
    </div>
  );
}
