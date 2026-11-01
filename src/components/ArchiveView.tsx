import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Archive,
  FileText,
  FileCheck,
  History,
  Calendar,
  Plus,
  Edit,
  Download,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { PlanningArchive } from '../types';

export const ArchiveView: React.FC = () => {
  const { plannings, addPlanning, rectifyPlanning, demandes, activeNurses } = useApp();

  const [activeTab, setActiveTab] = useState<'schedules' | 'documents'>('schedules');

  // Rectification modal state
  const [rectifyModalPlan, setRectifyModalPlan] = useState<PlanningArchive | null>(null);
  const [rectifyMotif, setRectifyMotif] = useState('Changement d’astreinte / absence imprévue');
  const [rectifyDetails, setRectifyDetails] = useState('');

  // New Planning Modal state
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [newTitre, setNewTitre] = useState('');
  const [newMois, setNewMois] = useState('2026-11');
  const [newType, setNewType] = useState<PlanningArchive['typePlanning']>('Garde');
  const [newDescription, setNewDescription] = useState('');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitre.trim()) return;

    addPlanning({
      titre: newTitre.trim(),
      mois: newMois,
      typePlanning: newType,
      creePar: 'Kaoutar ADARDOUR (Infirmier Chef)',
      description: newDescription.trim() || undefined,
      items: [],
    });

    setIsNewPlanModalOpen(false);
    setNewTitre('');
  };

  const handleConfirmRectify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rectifyModalPlan || !rectifyMotif.trim()) return;
    rectifyPlanning(rectifyModalPlan.id, rectifyMotif, rectifyDetails);
    setRectifyModalPlan(null);
    setRectifyDetails('');
  };

  // Official PDF decisions from all leave requests
  const archivedDecisions = demandes.filter((d) => d.decisionPdfName || d.decisionRecue === 'Reçue et visée');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">
              Rubrique Archives & Tableaux de Service
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Conservation & Traçabilité
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Archivage des tableaux de garde et horaires normaux avec historique de rectification, et gestion des décisions officielles en format PDF.
          </p>
        </div>

        {/* View Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'schedules' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tableaux de Garde & Horaires ({plannings.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'documents' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Archives Décisions PDF ({archivedDecisions.length})
          </button>
        </div>
      </div>

      {activeTab === 'schedules' ? (
        /* Schedules Archive with Rectifications */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">
              Historique des Tableaux de Service du Bloc Opératoire
            </h3>
            <button
              onClick={() => setIsNewPlanModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Tableau de Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plannings.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      Mois : {plan.mois} • {plan.typePlanning}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {plan.titre}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                  </div>

                  <button
                    onClick={() => setRectifyModalPlan(plan)}
                    className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Rectifier ce tableau de service"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-700" />
                    <span>Rectifier</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 border-t border-slate-100 pt-2">
                  <span>Créé par : <b>{plan.creePar}</b></span>
                  <span>Modifié le : {new Date(plan.derniereModification).toLocaleDateString()}</span>
                </div>

                {/* Rectifications History */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 flex items-center justify-between mb-1.5">
                    <span className="flex items-center space-x-1">
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Historique des Rectifications ({plan.rectifications.length})</span>
                    </span>
                  </div>

                  {plan.rectifications.length === 0 ? (
                    <div className="text-slate-400 text-[11px] italic">
                      Aucune modification enregistrée sur ce planning.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {plan.rectifications.map((rec) => (
                        <div key={rec.id} className="p-2 bg-white rounded border border-slate-200 text-[11px]">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>Motif: {rec.motif}</span>
                            <span className="text-slate-400 font-mono text-[10px]">
                              {new Date(rec.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-slate-600 mt-0.5">{rec.details}</div>
                          <div className="text-slate-400 text-[10px] mt-0.5">Par {rec.auteur}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Official PDF Decisions Archive */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Registre des Décisions Officielles de Congé (Format PDF)
              </h3>
              <p className="text-xs text-slate-500">
                Documents visés et archivés pour la délégation provinciale et le dossier administratif
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Document / Décision</th>
                  <th className="px-4 py-3">Agent Bénéficiaire</th>
                  <th className="px-4 py-3">Type de Congé</th>
                  <th className="px-4 py-3">Période Validée</th>
                  <th className="px-4 py-3">Statut Visa</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {archivedDecisions.map((dem) => {
                  const nurse = activeNurses.find((n) => n.id === dem.nurseId);
                  const fileName = dem.decisionPdfName || `Decision_CHP_${dem.typeConge.replace(/\s+/g, '_')}_${dem.dateCessation}.pdf`;

                  return (
                    <tr key={dem.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-red-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900">{fileName}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Réf: {dem.visaRH?.reference || 'CHP/RH-2026'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">
                          {nurse ? `${nurse.prenom} ${nurse.nom}` : 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">PPR: {nurse?.ppr}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{dem.typeConge}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {dem.dateCessation} ➔ {dem.dateRepriseEffective || dem.dateReprisePrevue} ({dem.nombreJours}j)
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          Reçue & Visée
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => alert(`Téléchargement de l'archive officielle: ${fileName}`)}
                          className="inline-flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Rectification of Schedule */}
      {rectifyModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-base border-b border-slate-100 pb-2">
              <Edit className="w-5 h-5 text-amber-600" />
              <span>Rectification Réglementaire du Tableau</span>
            </div>

            <p className="text-xs text-slate-600">
              Toute modification apportée au tableau de service <b>{rectifyModalPlan.titre}</b> est consignée dans le registre d'audit avec motif obligatoire.
            </p>

            <form onSubmit={handleConfirmRectify} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Motif de la Rectification <span className="text-red-500">*</span>
                </label>
                <select
                  value={rectifyMotif}
                  onChange={(e) => setRectifyMotif(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="Changement d’astreinte / absence imprévue">Changement d’astreinte / absence imprévue</option>
                  <option value="Arrêt maladie soudain">Arrêt maladie soudain</option>
                  <option value="Échange de garde consenti">Échange de garde consenti</option>
                  <option value="Renfort pour urgence chirurgicale majeure">Renfort pour urgence chirurgicale</option>
                  <option value="Ajustement de planning mensuel">Ajustement de planning mensuel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Détails des permutations / ajustements <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Remplacement de l'agent X par l'agent Y pour la garde du 20 Novembre suite à un arrêt médical..."
                  value={rectifyDetails}
                  onChange={(e) => setRectifyDetails(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRectifyModalPlan(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
                >
                  Enregistrer la Rectification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Planning */}
      {isNewPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-base border-b border-slate-100 pb-2">
              <Plus className="w-5 h-5 text-blue-700" />
              <span>Créer un Tableau de Service / Planning</span>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Titre du Tableau de Service <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tableau de Garde - Décembre 2026"
                  value={newTitre}
                  onChange={(e) => setNewTitre(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Mois (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    value={newMois}
                    onChange={(e) => setNewMois(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Type de Planning
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="Garde">Système de Garde (24h)</option>
                    <option value="Normal">Système Normal (08h-16h30)</option>
                    <option value="Astreinte">Système d'Astreinte</option>
                    <option value="Mixte">Mixte (Garde + Astreinte)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Description & Directives particulières
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ex: Équipes d'anesthésie et panseurs d'astreinte..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPlanModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
