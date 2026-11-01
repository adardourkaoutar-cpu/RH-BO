import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Archive,
  Database,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type NavTab = 'dashboard' | 'personnel' | 'conges' | 'planning' | 'archives' | 'database';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const { demandes, currentUser } = useApp();

  // Pending count requiring attention
  const pendingCount = demandes.filter((d) => {
    if (currentUser.role === 'head_nurse') {
      return d.etatDemande === 'Demandé' && !d.avisInfirmierChef;
    }
    if (currentUser.role === 'hr_officer') {
      return d.etatDemande === 'En attente' && !d.visaRH;
    }
    return d.etatDemande === 'Demandé' || d.etatDemande === 'En attente';
  }).length;

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'personnel',
      label: 'Fiche du Personnel',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'conges',
      label: 'Gestion des Congés',
      icon: <FileText className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'planning',
      label: 'Planning & Calendrier',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'archives',
      label: 'Tableaux & Archives',
      icon: <Archive className="w-4 h-4" />,
    },
    {
      id: 'database',
      label: 'Base JSON & Sync',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="bg-white border-b border-teal-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-700 to-cyan-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-amber-300 text-slate-900' : 'bg-red-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
