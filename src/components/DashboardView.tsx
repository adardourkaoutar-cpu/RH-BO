import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Baby,
  ChevronRight,
  Plus
} from 'lucide-react';
import { isLeaveActiveToday, isWithinDays } from '../utils/leaveCalculations';

interface DashboardViewProps {
  onNavigateToLeaves: () => void;
  onNavigateToPersonnel: () => void;
  onOpenAddNurseModal: () => void;
  onOpenNewLeaveModal: (defaultType?: string) => void;
  onSelectNurse: (nurseId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToLeaves,
  onNavigateToPersonnel,
  onOpenAddNurseModal,
  onOpenNewLeaveModal,
  onSelectNurse,
}) => {
  const { activeNurses, demandes, currentUser, giveHeadNurseOpinion, giveVisaRH } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Specialty Breakdown
  const iarCount = activeNurses.filter((n) => n.specialite === 'IAR').length;
  const ipCount = activeNurses.filter((n) => n.specialite === 'IP').length;
  const ismCount = activeNurses.filter((n) => n.specialite === 'ISM').length;
  const iboCount = activeNurses.filter((n) => n.specialite === 'IBO').length;

  // Role Breakdown
  const anesthesisteCount = activeNurses.filter((n) => n.fonction === 'Anesthésiste').length;
  const aideOpCount = activeNurses.filter((n) => n.fonction === 'Aide-opératoire').length;
  const sterilisationCount = activeNurses.filter((n) => n.fonction === 'Stérilisation').length;
  const chefCount = activeNurses.filter((n) => n.fonction === 'Infirmier chef').length;

  // Schedule breakdown
  const gardeCount = activeNurses.filter((n) => n.situationActuelle === 'Système de garde').length;
  const normalCount = activeNurses.filter((n) => n.situationActuelle === 'Système normal').length;
  const astreinteCount = activeNurses.filter((n) => n.situationActuelle === "Système d'astreinte").length;

  // Active leaves today
  const activeLeaves = demandes.filter((d) => isLeaveActiveToday(d, todayStr));
  const activeSickLeaves = activeLeaves.filter((d) => d.typeConge === 'Congé Maladie');
  const activeMaternityLeaves = activeLeaves.filter((d) => d.typeConge === 'Congé Maternité' || activeNurses.some(n => n.id === d.nurseId && n.enceinte));

  // Pending approvals
  const pendingRequests = demandes.filter((d) => d.etatDemande === 'Demandé' || d.etatDemande === 'En attente');

  // Upcoming returns (< 7 days)
  const upcomingReturns = demandes.filter((d) => {
    if (d.etatDemande !== 'Confirmé') return false;
    const returnDate = d.dateRepriseEffective || d.dateReprisePrevue;
    return isWithinDays(returnDate, 7);
  });

  // Pregnant nurses tracking
  const pregnantNurses = activeNurses.filter((n) => n.sexe === 'Femme' && n.enceinte);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Action bar */}
      <div className="bg-gradient-to-r from-[#0b3334] via-[#0f4c4c] to-[#0d4554] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-teal-800/40">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <HeartPulse className="w-64 h-64 text-teal-200" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-teal-200 border border-white/20 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Tableau de Bord Exécutif RH — Bloc Opératoire Central</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Centre Hospitalier Provincial de Sidi Ifni
            </h2>
            <p className="text-sm text-teal-100/90 max-w-2xl mt-1">
              Surveillance continue des effectifs chirurgicaux, rotation des gardes, congés statutaires et alertes de reprise.
            </p>
          </div>

          {/* Shortcut buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenNewLeaveModal('Congé Maladie')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-slate-900" />
              <span>Arrêt Maladie Immédiat</span>
            </button>
            <button
              onClick={() => onOpenNewLeaveModal()}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-200" />
              <span>Demande Congé</span>
            </button>
            <button
              onClick={onOpenAddNurseModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white text-teal-950 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-700" />
              <span>Nouveau Personnel</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staff */}
        <div
          onClick={onNavigateToPersonnel}
          className="bg-white p-5 rounded-xl border border-teal-100 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-900/70 uppercase tracking-wider">
              Effectif Actif Bloc
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">{activeNurses.length}</span>
            <span className="text-xs text-slate-500">infirmiers & cadres</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <span className="bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded font-semibold">IAR: {iarCount}</span>
            <span className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-semibold">IP: {ipCount}</span>
            <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-semibold">ISM: {ismCount}</span>
            <span className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-semibold">IBO: {iboCount}</span>
          </div>
        </div>

        {/* Leaves Active Today */}
        <div
          onClick={onNavigateToLeaves}
          className="bg-white p-5 rounded-xl border border-teal-100 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-900/70 uppercase tracking-wider">
              En Congé Aujourd'hui
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-emerald-700">{activeLeaves.length}</span>
            <span className="text-xs text-slate-500">absents autorisés</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Maladie: <b className="text-red-600">{activeSickLeaves.length}</b></span>
            <span>Maternité: <b className="text-teal-700">{activeMaternityLeaves.length}</b></span>
            <span>Admin: <b className="text-cyan-700">{activeLeaves.length - activeSickLeaves.length - activeMaternityLeaves.length}</b></span>
          </div>
        </div>

        {/* Pending Validation */}
        <div
          onClick={onNavigateToLeaves}
          className="bg-white p-5 rounded-xl border border-teal-100 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-900/70 uppercase tracking-wider">
              Demandes à Valider
            </span>
            <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-cyan-800">{pendingRequests.length}</span>
            <span className="text-xs text-slate-500">en attente d'avis / visa</span>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-xs text-cyan-800 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Nécessite intervention hiérarchique</span>
          </div>
        </div>

        {/* Upcoming Returns */}
        <div
          onClick={onNavigateToLeaves}
          className="bg-white p-5 rounded-xl border border-teal-100 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-900/70 uppercase tracking-wider">
              Reprises Imminentes
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-teal-800">{upcomingReturns.length}</span>
            <span className="text-xs text-slate-500">dans les 7 prochains jours</span>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-xs text-teal-800 font-medium">
            <span>Préparer avis de reprise signés</span>
          </div>
        </div>
      </div>

      {/* Maternal & Health Alerts Banner if any */}
      {pregnantNurses.length > 0 && (
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-teal-950">
                Suivi Spécifique Maternité ({pregnantNurses.length} agent(e)s concerné(e)s)
              </h4>
              <p className="text-xs text-teal-800">
                {pregnantNurses.map((n) => `${n.prenom} ${n.nom} (${n.fonction})`).join(', ')} — Droit au congé maternité légal de 3 mois (90 jours).
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToPersonnel}
            className="text-xs font-semibold text-teal-900 hover:text-teal-950 underline flex items-center space-x-1"
          >
            <span>Voir fiches individuelles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Dashboard Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending Actions & Immediate Validation (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Requests Card */}
          <div className="bg-white rounded-xl border border-teal-100 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>Demandes de Congé en Instance de Validation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Workflow officiel : Avis Infirmier Chef ➔ Visa Bureau RH ➔ Émission de la décision
                </p>
              </div>
              <button
                onClick={onNavigateToLeaves}
                className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center space-x-1"
              >
                <span>Toutes ({demandes.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  Aucune demande en attente. Toutes les requêtes sont à jour.
                </div>
              ) : (
                pendingRequests.slice(0, 5).map((dem) => {
                  const nurse = activeNurses.find((n) => n.id === dem.nurseId);
                  const isAvisPending = !dem.avisInfirmierChef;
                  const isVisaPending = dem.avisInfirmierChef && !dem.visaRH;

                  return (
                    <div key={dem.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {nurse ? `${nurse.prenom} ${nurse.nom}` : 'Agent inconnu'}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              PPR: {nurse?.ppr}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                              {dem.typeConge}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              Cessation: <b className="text-slate-700">{dem.dateCessation}</b>
                            </span>
                            <span>
                              Reprise prévue: <b className="text-slate-700">{dem.dateReprisePrevue}</b>
                            </span>
                            <span className="text-blue-700 font-semibold">
                              Durée: {dem.nombreJours} jours ouvrables
                            </span>
                          </div>
                        </div>

                        {/* Quick Action Buttons for Head Nurse or HR */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {currentUser.role === 'head_nurse' && isAvisPending && (
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => giveHeadNurseOpinion(dem.id, 'Favorable')}
                                className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                              >
                                Avis Favorable
                              </button>
                              <button
                                onClick={() => giveHeadNurseOpinion(dem.id, 'Défavorable', 'Nécessité de service')}
                                className="px-2 py-1 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              >
                                Défavorable
                              </button>
                            </div>
                          )}

                          {currentUser.role === 'hr_officer' && isVisaPending && (
                            <button
                              onClick={() => giveVisaRH(dem.id, 'Visé')}
                              className="px-3 py-1 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Apposer Visa RH
                            </button>
                          )}

                          <button
                            onClick={onNavigateToLeaves}
                            className="px-2.5 py-1 text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg transition-colors cursor-pointer"
                          >
                            Détails
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Leaves Today Table */}
          <div className="bg-white rounded-xl border border-teal-100 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personnel Actuellement en Congé ({activeLeaves.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Agents absents autorisés au {todayStr}
                </p>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              {activeLeaves.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Aucun membre du personnel n'est en congé aujourd'hui. Effectif complet.
                </div>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Agent</th>
                      <th className="px-4 py-2.5">Fonction</th>
                      <th className="px-4 py-2.5">Type de Congé</th>
                      <th className="px-4 py-2.5">Période</th>
                      <th className="px-4 py-2.5">Reprise Prévue</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeLeaves.map((dem) => {
                      const nurse = activeNurses.find((n) => n.id === dem.nurseId);
                      return (
                        <tr key={dem.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {nurse ? `${nurse.prenom} ${nurse.nom}` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{nurse?.fonction}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                dem.typeConge === 'Congé Maladie'
                                  ? 'bg-red-100 text-red-800'
                                  : dem.typeConge === 'Congé Maternité'
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-cyan-100 text-cyan-800'
                              }`}
                            >
                              {dem.typeConge}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono">
                            {dem.dateCessation} ➔ {dem.dateReprisePrevue}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {dem.dateReprisePrevue}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => nurse && onSelectNurse(nurse.id)}
                              className="text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
                            >
                              Fiche
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Roles Breakdown & System Allocation */}
        <div className="space-y-6">
          {/* Work Schedule Distribution Card */}
          <div className="bg-white rounded-xl border border-teal-100 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>Système de Travail au Bloc</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Système de Garde (24h/rotation)</span>
                  <span className="font-bold">{gardeCount} agents</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-700 h-2 rounded-full"
                    style={{ width: `${(gardeCount / Math.max(1, activeNurses.length)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Système Normal (Horaire continu)</span>
                  <span className="font-bold">{normalCount} agents</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-cyan-600 h-2 rounded-full"
                    style={{ width: `${(normalCount / Math.max(1, activeNurses.length)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  *Exclut le programme opératoire et l'affectation en salle
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Système d'Astreinte</span>
                  <span className="font-bold">{astreinteCount} agents</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${(astreinteCount / Math.max(1, activeNurses.length)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Breakdown */}
          <div className="bg-white rounded-xl border border-teal-100 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-700" />
              <span>Répartition par Fonction</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-700"></span>
                  <span className="font-medium text-slate-700">Anesthésistes</span>
                </div>
                <span className="font-bold text-slate-900 bg-cyan-50 text-cyan-900 px-2 py-0.5 rounded">
                  {anesthesisteCount}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="font-medium text-slate-700">Aides-opératoires / Panseurs</span>
                </div>
                <span className="font-bold text-slate-900 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded">
                  {aideOpCount}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <span className="font-medium text-slate-700">Stérilisation</span>
                </div>
                <span className="font-bold text-slate-900 bg-teal-50 text-teal-900 px-2 py-0.5 rounded">
                  {sterilisationCount}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-800"></span>
                  <span className="font-medium text-slate-700">Infirmier Chef</span>
                </div>
                <span className="font-bold text-slate-900 bg-teal-100 text-teal-950 px-2 py-0.5 rounded">
                  {chefCount}
                </span>
              </div>
            </div>
          </div>

          {/* Commuters (Navettistes) Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Agents Navettistes</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Personnel résidant hors Sidi Ifni (Tiznit, Guelmim, Mirleft, Agadir)
            </p>

            <div className="space-y-2">
              {activeNurses.filter(n => n.navette).map(nurse => (
                <div key={nurse.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{nurse.prenom} {nurse.nom}</span>
                    <span className="text-[11px] text-slate-500 block">De {nurse.trajetNavette || nurse.lieuResidence} vers Sidi Ifni</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Navette
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
