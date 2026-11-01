import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  RefreshCw,
  Download,
  Upload,
  UserCheck,
  Building2,
  Stethoscope,
  Wifi,
  WifiOff,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  onOpenSyncModal: () => void;
  onOpenAddNurseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSyncModal, onOpenAddNurseModal }) => {
  const {
    currentUser,
    setCurrentUser,
    isOnline,
    lastSyncTime,
    manualSyncTrigger,
    exportDatabaseJSON,
    nurses,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'head_nurse':
        return { label: 'Infirmier Chef (Bloc)', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'hr_officer':
        return { label: 'Bureau RH (Visa CHP)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Personnel Infirmier', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
      {/* Official Moroccan Administrative Top Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2 font-medium tracking-wide">
          <span className="text-amber-400 font-semibold">المملكة المغربية</span>
          <span className="text-slate-400">|</span>
          <span>Royaume du Maroc — Ministère de la Santé et de la Protection Sociale</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">Délégation Sidi Ifni — CHP Sidi Ifni</span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5" title="Synchronisation inter-terminaux active">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Terminal Synchronisé</span>
          </div>

          <div className="flex items-center space-x-1.5">
            {isOnline ? (
              <span className="flex items-center text-emerald-400 space-x-1">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">En Ligne</span>
              </span>
            ) : (
              <span className="flex items-center text-amber-400 space-x-1">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Hors-Ligne (Local)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Service Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Bloc Opératoire Central
                </h1>
                <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  CHP Sidi Ifni
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Système de Gestion des Ressources Humaines & Plannings
              </p>
            </div>
          </div>

          {/* Quick Action & User Auth Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Export JSON button */}
            <button
              onClick={exportDatabaseJSON}
              title="Exporter la base de données en JSON"
              className="hidden lg:flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Sauvegarder JSON</span>
            </button>

            {/* Sync trigger */}
            <button
              onClick={manualSyncTrigger}
              title={`Dernière synchronisation: ${lastSyncTime.toLocaleTimeString()}`}
              className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Fast Add Nurse */}
            <button
              onClick={onOpenAddNurseModal}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs shadow-blue-600/30 transition-colors"
            >
              <span className="text-base leading-none font-normal">+</span>
              <span className="hidden sm:inline">Ajouter Personnel</span>
            </button>

            {/* User Account / Role Selector */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2.5 pr-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-300">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {currentUser.email}
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${badge.bg}`}>
                  {badge.label}
                </span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Session Authentifiée (Gmail OAuth)
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">{currentUser.name}</div>
                    <div className="text-xs text-blue-600 font-mono truncate">{currentUser.email}</div>
                  </div>

                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Changer de Profil Administratif
                  </div>

                  <button
                    onClick={() => {
                      setCurrentUser({
                        email: 'adardourkaoutar@gmail.com',
                        name: 'Kaoutar ADARDOUR',
                        role: 'head_nurse',
                        nurseId: 'nurse-1792857754910',
                      });
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'head_nurse' ? 'bg-indigo-50/70 text-indigo-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>Kaoutar ADARDOUR</div>
                        <div className="text-[10px] text-slate-500">Infirmier Chef du Bloc</div>
                      </div>
                    </div>
                    {currentUser.role === 'head_nurse' && <span className="text-indigo-600">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentUser({
                        email: 'rh.chp.sidiifni@sante.gov.ma',
                        name: 'Bureau RH (Délégation/CHP)',
                        role: 'hr_officer',
                      });
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'hr_officer' ? 'bg-emerald-50/70 text-emerald-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Bureau des Ressources Humaines</div>
                        <div className="text-[10px] text-slate-500">Visa & Décisions Officielles</div>
                      </div>
                    </div>
                    {currentUser.role === 'hr_officer' && <span className="text-emerald-600">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      const firstNurse = nurses[0];
                      setCurrentUser({
                        email: `${firstNurse?.prenom.toLowerCase()}.${firstNurse?.nom.toLowerCase()}@chpsidiifni.ma`,
                        name: `${firstNurse?.prenom} ${firstNurse?.nom}`,
                        role: 'nursing_staff',
                        nurseId: firstNurse?.id,
                      });
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'nursing_staff' ? 'bg-blue-50/70 text-blue-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>Personnel Infirmier (Agent)</div>
                        <div className="text-[10px] text-slate-500">Consultation fiche & demandes</div>
                      </div>
                    </div>
                    {currentUser.role === 'nursing_staff' && <span className="text-blue-600">✓</span>}
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onOpenSyncModal();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 font-medium flex items-center space-x-2"
                    >
                      <Radio className="w-3.5 h-3.5 text-blue-600" />
                      <span>Gérer la synchronisation / Authentification</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
