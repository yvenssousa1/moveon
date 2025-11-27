import React from 'react';
import { FaHome, FaClipboardList, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const menuItems = [
  { label: 'Início', icon: <FaHome />, href: '/dashboard-paciente' },
  { label: 'Avaliação', icon: <FaClipboardList />, href: '/avaliacao' },
  { label: 'Agendamentos', icon: <FaCalendarAlt />, href: '/agendamentos' },
  { label: 'Perfil', icon: <FaUser />, href: '/perfil' },
];

const SidebarMenu = ({ onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-white shadow-lg flex flex-col items-center py-6 z-30">
      <div className="mb-8">
        <img src="/Icons/Gemini_Generated_Image_8m4a2k8m4a2k8m4a.png" alt="Logo" className="w-2 h-2 rounded-full object-cover" />
      </div>
      <nav className="flex-1 flex flex-col gap-8">
        {menuItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
            title={item.label}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="mt-8 flex flex-col items-center text-gray-400 hover:text-red-500 transition"
        title="Sair"
      >
        <FaSignOutAlt className="text-2xl mb-1" />
        <span className="text-xs font-medium">Sair</span>
      </button>
    </aside>
  );
};

export default SidebarMenu;
