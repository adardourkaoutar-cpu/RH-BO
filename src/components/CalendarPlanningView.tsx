import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Info,
  CalendarCheck
} from 'lucide-react';
import { MOROCCAN_HOLIDAYS, isMoroccanHoliday, isWeekend } from '../utils/moroccanHolidays';
import { DemandeConge, Nurse } from '../types';

export const CalendarPlanningView: React.FC = () => {
  const { activeNurses, demandes, confirmMonthlyPlanning } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 1)); // November 2026 (matching dataset)
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'annual_plan'>('calendar');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calendar matrix computation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0, Monday=1
  // Moroccan/European week: Monday=0, ..., Sunday=6
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Find leaves and holidays for each day
  const getDayData = (dayNumber: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(dayNumber).padStart(2, '0');
    const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

    const holiday = isMoroccanHoliday(isoDate);

    // Leaves spanning this day
    const dayLeaves = demandes.filter((d) => {
      if (d.etatDemande === 'Refusé') return false;
      const returnDate = d.dateRepriseEffective || d.dateReprisePrevue;
      return d.dateCessation <= isoDate && isoDate <= returnDate;
    });

    return { isoDate, holiday, dayLeaves };
  };

  // December Annual Planning list
  const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const plannedLeavesForMonth = demandes.filter((d) => {
    const matchMoisPrevu = d.moisPrevu === currentMonthStr;
    const matchStart = d.dateCessation.startsWith(currentMonthStr);
    return matchMoisPrevu || matchStart;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar with Tab switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">
              Calendrier du Bloc & Planning Prévisionnel
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Année {currentYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intégration des jours fériés officiels du Royaume du Maroc et validation du planning établi en Décembre.
          </p>
        </div>

        {/* View Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'calendar' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendrier Mensuel
          </button>
          <button
            onClick={() => setActiveSubTab('annual_plan')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'annual_plan' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Planning Annuel (Décembre) & Confirmation Début de Mois
          </button>
        </div>
      </div>

      {activeSubTab === 'calendar' ? (
        /* Interactive Monthly Calendar View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Calendar Header with Navigation */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <span className="text-xs text-slate-300">
                  Bloc Opératoire Central — CHP Sidi Ifni
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Mois précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(2026, 10, 1))}
                className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Aujourd'hui
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Mois suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center font-bold text-xs py-2.5 bg-slate-100 text-slate-700 border-b border-slate-200">
            <div>Lundi</div>
            <div>Mardi</div>
            <div>Mercredi</div>
            <div>Jeudi</div>
            <div>Vendredi</div>
            <div className="text-blue-700">Samedi</div>
            <div className="text-red-600">Dimanche</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 border-b border-slate-200 divide-x divide-y divide-slate-100 text-xs">
            {/* Empty offset cells */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[110px] bg-slate-50/50 p-1.5 text-slate-300"></div>
            ))}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const { isoDate, holiday, dayLeaves } = getDayData(dayNum);
              const isToday = isoDate === '2026-11-01'; // reference time
              const dayOfWeek = (startOffset + i) % 7;
              const isWeekendDay = dayOfWeek === 5 || dayOfWeek === 6;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-blue-50/70 border-2 border-blue-600'
                      : holiday
                      ? 'bg-amber-50/40'
                      : isWeekendDay
                      ? 'bg-slate-50/80'
                      : 'bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`font-bold text-xs inline-block w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-blue-700 text-white'
                          : holiday
                          ? 'bg-amber-500 text-white font-extrabold'
                          : isWeekendDay
                          ? 'text-slate-400 font-semibold'
                          : 'text-slate-800'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Holiday badge */}
                    {holiday && (
                      <span
                        className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1 py-0.5 rounded leading-tight max-w-[90px] truncate"
                        title={holiday.name}
                      >
                        {holiday.name}
                      </span>
                    )}
                  </div>

                  {/* Registered Leaves for this day */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {dayLeaves.map((d) => {
                      const nurse = activeNurses.find((n) => n.id === d.nurseId);
                      const isSick = d.typeConge === 'Congé Maladie';
                      const isMaternity = d.typeConge === 'Congé Maternité';

                      return (
                        <div
                          key={d.id}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${
                            isSick
                              ? 'bg-red-100 text-red-900 border-red-200'
                              : isMaternity
                              ? 'bg-purple-100 text-purple-900 border-purple-200'
                              : 'bg-blue-100 text-blue-900 border-blue-200'
                          }`}
                          title={`${nurse?.prenom} ${nurse?.nom} (${d.typeConge})`}
                        >
                          {nurse ? `${nurse.nom} ${nurse.prenom.charAt(0)}.` : 'Agent'}
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-slate-400 text-right mt-1">
                    {dayLeaves.length > 0 && `${dayLeaves.length} absent(s)`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="font-medium">Jour Férié Officiel Maroc</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="font-medium">Congé Administratif</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="font-medium">Congé Maladie</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span className="font-medium">Congé Maternité</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500">
              * Règle CHP : Congé admin exclut les samedis, dimanches et fériés.
            </span>
          </div>
        </div>
      ) : (
        /* Annual Planning Established in December & Confirmation Début de Mois */
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-amber-950">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              <span>Réglementation : Planning Annuel Prévisionnel (Établi chaque année en Décembre)</span>
            </div>
            <p className="leading-relaxed">
              Conformément aux directives de l'administration hospitalière du CHP Sidi Ifni, le <b>Planning Annuel des Congés</b> est arrêté au mois de <b>Décembre</b> pour l'année suivante.
              <br />
              <b className="underline">Obligation préalable :</b> Au début de chaque mois ({monthNames[currentMonth]} {currentYear}), l'administration doit obligatoirement <b>confirmer ou annuler les congés prévus</b> <i>avant</i> de traiter toute nouvelle demande ponctuelle.
            </p>
          </div>

          {/* Month selector for annual planning confirmation */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm">
              <span>Mois en cours de révision :</span>
              <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {monthNames[currentMonth]} {currentYear}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
              >
                Mois précédent
              </button>
              <button
                onClick={nextMonth}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
              >
                Mois suivant
              </button>
            </div>
          </div>

          {/* Previsional Leaves Table for this Month */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Congés Programmés pour {monthNames[currentMonth]} {currentYear}
                </h4>
                <p className="text-xs text-slate-500">
                  Validation obligatoire au début du mois par l'Infirmier Chef
                </p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                {plannedLeavesForMonth.length} agent(s) programmé(s)
              </span>
            </div>

            {plannedLeavesForMonth.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aucun congé prévisionnel n'est programmé pour {monthNames[currentMonth]} {currentYear}.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Agent</th>
                    <th className="px-4 py-3">PPR / Fonction</th>
                    <th className="px-4 py-3">Période Programmée</th>
                    <th className="px-4 py-3">Jours</th>
                    <th className="px-4 py-3">Statut Prévisionnel</th>
                    <th className="px-4 py-3 text-right">Action Début de Mois</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plannedLeavesForMonth.map((d) => {
                    const nurse = activeNurses.find((n) => n.id === d.nurseId);
                    const isConfirmed = d.statutPrevisionnel === 'confirme_debut_mois';
                    const isCancelled = d.statutPrevisionnel === 'annule';

                    return (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {nurse ? `${nurse.prenom} ${nurse.nom}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {nurse?.ppr} • {nurse?.fonction}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {d.dateCessation} ➔ {d.dateReprisePrevue}
                        </td>
                        <td className="px-4 py-3 font-bold text-blue-800">
                          {d.nombreJours}j
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isConfirmed
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCancelled
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isConfirmed
                              ? 'Confirmé Début de Mois'
                              : isCancelled
                              ? 'Annulé (Nécessité service)'
                              : 'En attente confirmation'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => confirmMonthlyPlanning(d.id, 'confirme_debut_mois')}
                              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => confirmMonthlyPlanning(d.id, 'annule')}
                              className="px-2 py-1 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
