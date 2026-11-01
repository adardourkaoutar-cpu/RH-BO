import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Nurse, RoleFonction, Specialite, MotifSuppression } from '../types';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  Car,
  Baby,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Stethoscope
} from 'lucide-react';
import { calculateAge, calculateSeniority, calculateRemainingAdminDays } from '../utils/leaveCalculations';

interface PersonnelViewProps {
  onOpenAddModal: () => void;
  onSelectNurse: (nurseId: string) => void;
  onEditNurse: (nurse: Nurse) => void;
  onDeleteNurse: (nurse: Nurse) => void;
}

export const PersonnelView: React.FC<PersonnelViewProps> = ({
  onOpenAddModal,
  onSelectNurse,
  onEditNurse,
  onDeleteNurse,
}) => {
  const { activeNurses, archivedNurses, restoreNurse } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState<string>('all');
  const [filterFonction, setFilterFonction] = useState<string>('all');
  const [filterSituation, setFilterSituation] = useState<string>('all');
  const [filterNavette, setFilterNavette] = useState<string>('all');
  const [sortByAgeOrder, setSortByAgeOrder] = useState<'asc' | 'desc'>('asc'); // default sorted by age
  const [groupByRole, setGroupByRole] = useState<boolean>(true); // default group primarily by Role

  // Filtered list
  const currentList = activeTab === 'active' ? activeNurses : archivedNurses;

  const filteredNurses = useMemo(() => {
    return currentList.filter((nurse) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = `${nurse.nom} ${nurse.prenom}`.toLowerCase().includes(q);
        const matchPpr = nurse.ppr.toLowerCase().includes(q);
        const matchCni = nurse.cni.toLowerCase().includes(q);
        const matchVille = (nurse.lieuResidence || '').toLowerCase().includes(q) || (nurse.trajetNavette || '').toLowerCase().includes(q);
        if (!matchName && !matchPpr && !matchCni && !matchVille) return false;
      }

      // Specialite
      if (filterSpecialite !== 'all' && nurse.specialite !== filterSpecialite) {
        return false;
      }

      // Fonction
      if (filterFonction !== 'all' && nurse.fonction !== filterFonction) {
        return false;
      }

      // Situation
      if (filterSituation !== 'all' && nurse.situationActuelle !== filterSituation) {
        return false;
      }

      // Navette
      if (filterNavette === 'navette_only' && !nurse.navette) return false;
      if (filterNavette === 'local_only' && nurse.navette) return false;

      return true;
    });
  }, [currentList, searchQuery, filterSpecialite, filterFonction, filterSituation, filterNavette]);

  // Sort by age primarily
  const sortedNurses = useMemo(() => {
    const list = [...filteredNurses];
    list.sort((a, b) => {
      const ageA = calculateAge(a.dateNaissance);
      const ageB = calculateAge(b.dateNaissance);
      return sortByAgeOrder === 'asc' ? ageA - ageB : ageB - ageA;
    });
    return list;
  }, [filteredNurses, sortByAgeOrder]);

  // Role groups if grouping enabled
  const roleGroups: RoleFonction[] = ['Infirmier chef', 'Anesthésiste', 'Aide-opératoire', 'Stérilisation'];

  const getRoleBadgeColor = (role: RoleFonction) => {
    switch (role) {
      case 'Infirmier chef':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Anesthésiste':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'Aide-opératoire':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Stérilisation':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-teal-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">
              Fiche du Personnel Infirmier du Bloc
            </h2>
            <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
              {activeNurses.length} actifs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Classification réglementaire par rôle et par âge — CHP Sidi Ifni
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toggle Active / Archived */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'active' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Personnel Actif ({activeNurses.length})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'archived' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Archives Départs ({archivedNurses.length})
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajouter Personnel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par Nom, Prénom, PPR, CNI, Ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
            />
          </div>

          {/* Grouping Toggle */}
          <div className="flex items-center space-x-2 text-xs">
            <label className="flex items-center space-x-1.5 font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={groupByRole}
                onChange={(e) => setGroupByRole(e.target.checked)}
                className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
              />
              <span>Grouper par Rôle / Fonction</span>
            </label>

            {/* Sort Age Toggle */}
            <button
              onClick={() => setSortByAgeOrder(sortByAgeOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 px-3 py-2 border border-teal-200 rounded-lg bg-teal-50/50 hover:bg-teal-50 text-teal-900 font-medium transition-colors cursor-pointer"
              title="Trier par âge"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-teal-700" />
              <span>Âge : {sortByAgeOrder === 'asc' ? 'Croissant' : 'Décroissant'}</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Spécialité</label>
            <select
              value={filterSpecialite}
              onChange={(e) => setFilterSpecialite(e.target.value)}
              className="w-full text-xs p-1.5 border border-slate-300 rounded-md bg-white"
            >
              <option value="all">Toutes les spécialités</option>
              <option value="IAR">IAR (Anesthésie Réanimation)</option>
              <option value="IP">IP (Polyvalent)</option>
              <option value="ISM">ISM (Soins d'urgence)</option>
              <option value="IBO">IBO (Bloc Opératoire)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Fonction</label>
            <select
              value={filterFonction}
              onChange={(e) => setFilterFonction(e.target.value)}
              className="w-full text-xs p-1.5 border border-slate-300 rounded-md bg-white"
            >
              <option value="all">Toutes les fonctions</option>
              <option value="Anesthésiste">Anesthésiste</option>
              <option value="Aide-opératoire">Aide-opératoire</option>
              <option value="Stérilisation">Stérilisation</option>
              <option value="Infirmier chef">Infirmier chef</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Système de Travail</label>
            <select
              value={filterSituation}
              onChange={(e) => setFilterSituation(e.target.value)}
              className="w-full text-xs p-1.5 border border-slate-300 rounded-md bg-white"
            >
              <option value="all">Tous les systèmes</option>
              <option value="Système de garde">Système de garde</option>
              <option value="Système normal">Système normal</option>
              <option value="Système d'astreinte">Système d'astreinte</option>
              <option value="Congé administratif">En Congé</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Navette (Déplacement)</label>
            <select
              value={filterNavette}
              onChange={(e) => setFilterNavette(e.target.value)}
              className="w-full text-xs p-1.5 border border-slate-300 rounded-md bg-white"
            >
              <option value="all">Tous les agents</option>
              <option value="navette_only">Navettistes seulement</option>
              <option value="local_only">Résidents Sidi Ifni</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Personnel List / Grouped View */}
      {sortedNurses.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Aucun personnel trouvé</h3>
          <p className="text-xs text-slate-400 mt-1">
            Modifiez vos filtres ou effectuez une autre recherche.
          </p>
        </div>
      ) : groupByRole && activeTab === 'active' ? (
        /* Grouped Primarily By Role */
        <div className="space-y-6">
          {roleGroups.map((role) => {
            const nursesInRole = sortedNurses.filter((n) => n.fonction === role);
            if (nursesInRole.length === 0) return null;

            return (
              <div key={role} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Role Group Header */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getRoleBadgeColor(role)}`}>
                      {role}
                    </span>
                    <span className="text-xs text-slate-500">
                      {nursesInRole.length} agent(s) — classés par âge ({sortByAgeOrder === 'asc' ? 'croissant' : 'décroissant'})
                    </span>
                  </div>
                </div>

                {/* Table for this Role */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Agent (Nom & Prénom)</th>
                        <th className="px-4 py-2.5">PPR / CNI</th>
                        <th className="px-4 py-2.5">Spécialité</th>
                        <th className="px-4 py-2.5">Grade</th>
                        <th className="px-4 py-2.5">Âge (Date Naiss.)</th>
                        <th className="px-4 py-2.5">Ancienneté</th>
                        <th className="px-4 py-2.5">Système / Statut</th>
                        <th className="px-4 py-2.5">Conditions Spécifiques</th>
                        <th className="px-4 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {nursesInRole.map((nurse) => {
                        const age = calculateAge(nurse.dateNaissance);
                        const seniority = calculateSeniority(nurse.dateRecrutement);
                        const remaining = calculateRemainingAdminDays(nurse);

                        return (
                          <tr key={nurse.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Name & Avatar */}
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs border border-teal-200">
                                  {nurse.prenom.charAt(0)}{nurse.nom.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">
                                    {nurse.nom} {nurse.prenom}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {nurse.sexe} • {nurse.etatMarital}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* PPR / CNI */}
                            <td className="px-4 py-3 font-mono">
                              <div className="font-semibold text-slate-800">{nurse.ppr}</div>
                              <div className="text-[10px] text-slate-500">{nurse.cni}</div>
                            </td>

                            {/* Specialite */}
                            <td className="px-4 py-3">
                              <span className="bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded font-medium text-[11px]">
                                {nurse.specialite}
                              </span>
                            </td>

                            {/* Grade */}
                            <td className="px-4 py-3 text-slate-700">
                              {nurse.grade}
                            </td>

                            {/* Age */}
                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-900">{age} ans</span>
                              <div className="text-[10px] text-slate-400 font-mono">{nurse.dateNaissance}</div>
                            </td>

                            {/* Seniority */}
                            <td className="px-4 py-3 text-slate-700">
                              <span className="font-medium">{seniority.years} ans</span>
                              <div className="text-[10px] text-slate-400 font-mono">depuis {nurse.dateRecrutement}</div>
                            </td>

                            {/* Situation */}
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  nurse.situationActuelle.includes('garde')
                                    ? 'bg-teal-100 text-teal-900'
                                    : nurse.situationActuelle.includes('normal')
                                    ? 'bg-cyan-100 text-cyan-900'
                                    : nurse.situationActuelle.includes('astreinte')
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {nurse.situationActuelle}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                Solde congé: <b className="text-teal-800">{remaining}j</b>
                              </div>
                            </td>

                            {/* Conditions Spécifiques */}
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1">
                                {nurse.enceinte && (
                                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-teal-900 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-300">
                                    <Baby className="w-3 h-3 text-teal-700" />
                                    <span>Enceinte (Maternité)</span>
                                  </span>
                                )}
                                {nurse.navette ? (
                                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    <Car className="w-3 h-3 text-emerald-700" />
                                    <span>De {nurse.trajetNavette || nurse.lieuResidence}</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">
                                    {nurse.lieuResidence}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => onSelectNurse(nurse.id)}
                                  className="p-1.5 text-slate-500 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                                  title="Consulter la fiche"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onEditNurse(nurse)}
                                  className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                                  title="Rectifier les informations"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteNurse(nurse)}
                                  className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  title="Supprimer / Archiver l'agent (justification obligatoire)"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat Table (or Archived View) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Agent</th>
                  <th className="px-4 py-2.5">PPR / CNI</th>
                  <th className="px-4 py-2.5">Spécialité</th>
                  <th className="px-4 py-2.5">Fonction</th>
                  <th className="px-4 py-2.5">Âge</th>
                  <th className="px-4 py-2.5">Ancienneté</th>
                  {activeTab === 'archived' ? (
                    <>
                      <th className="px-4 py-2.5 text-red-700">Motif Réglementaire de Départ</th>
                      <th className="px-4 py-2.5">Date & Notes</th>
                      <th className="px-4 py-2.5 text-right">Restauration</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2.5">Système de Travail</th>
                      <th className="px-4 py-2.5">Conditions Spécifiques</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedNurses.map((nurse) => {
                  const age = calculateAge(nurse.dateNaissance);
                  const seniority = calculateSeniority(nurse.dateRecrutement);

                  return (
                    <tr key={nurse.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {nurse.nom} {nurse.prenom}
                        <div className="text-[10px] font-normal text-slate-500">
                          {nurse.sexe} • {nurse.etatMarital}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {nurse.ppr}
                        <div className="text-[10px] text-slate-400">{nurse.cni}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                          {nurse.specialite}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{nurse.fonction}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{age} ans</td>
                      <td className="px-4 py-3 text-slate-600">{seniority.years} ans</td>

                      {activeTab === 'archived' ? (
                        <>
                          <td className="px-4 py-3 font-bold text-red-600">
                            {nurse.archiveReason || 'Non spécifié'}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            <div>Date: {nurse.archiveDate || 'N/A'}</div>
                            <div className="text-[10px] text-slate-400 italic">{nurse.archiveNotes}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => restoreNurse(nurse.id)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restaurer</span>
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800">{nurse.situationActuelle}</span>
                          </td>
                          <td className="px-4 py-3">
                            {nurse.navette && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold block w-fit mb-0.5">
                                Navette ({nurse.trajetNavette})
                              </span>
                            )}
                            {nurse.enceinte && (
                              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-semibold block w-fit">
                                Enceinte
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => onSelectNurse(nurse.id)}
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onEditNurse(nurse)}
                                className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded-md cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteNurse(nurse)}
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
