import React from 'react';
import { Nurse } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Calendar,
  Building,
  Award,
  Clock,
  HeartPulse,
  Baby,
  Car,
  FileCheck,
  Edit,
  Printer
} from 'lucide-react';
import {
  calculateAge,
  calculateSeniority,
  calculateRemainingAdminDays,
  calculateRemainingSickDays
} from '../utils/leaveCalculations';

interface NurseDetailModalProps {
  nurseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (nurse: Nurse) => void;
}

export const NurseDetailModal: React.FC<NurseDetailModalProps> = ({
  nurseId,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { nurses, demandes } = useApp();

  if (!isOpen || !nurseId) return null;

  const nurse = nurses.find((n) => n.id === nurseId);
  if (!nurse) return null;

  const age = calculateAge(nurse.dateNaissance);
  const seniority = calculateSeniority(nurse.dateRecrutement);
  const remainingAdmin = calculateRemainingAdminDays(nurse);
  const remainingSick = calculateRemainingSickDays(nurse);
  const nurseDemandes = demandes.filter((d) => d.nurseId === nurse.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header with Moroccan Hospital Styling */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center font-bold text-lg text-white">
              {nurse.prenom.charAt(0)}{nurse.nom.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">
                  {nurse.nom} {nurse.prenom}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-white/20 text-blue-100 border border-white/30">
                  {nurse.specialite} — {nurse.fonction}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                PPR: {nurse.ppr} | CNI: {nurse.cni} | Bloc Opératoire Central CHP Sidi Ifni
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(nurse);
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Modifier la fiche"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Imprimer la fiche individuelle"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium block">Âge</span>
              <span className="text-base font-bold text-slate-900">{age} ans</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Né(e) le {nurse.dateNaissance}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium block">Ancienneté</span>
              <span className="text-base font-bold text-slate-900">
                {seniority.years} ans {seniority.months > 0 ? `${seniority.months}m` : ''}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Recruté(e) le {nurse.dateRecrutement}</span>
            </div>

            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs">
              <span className="text-blue-700 font-medium block">Solde Congé Admin</span>
              <span className="text-base font-bold text-blue-900">{remainingAdmin} jours</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Statutaire: 22j + {nurse.congeAdmin?.joursReportes || 0}j</span>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs">
              <span className="text-emerald-700 font-medium block">Statut Actuel</span>
              <span className="text-sm font-bold text-emerald-900 truncate block">
                {nurse.situationActuelle}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">{nurse.etatFonctionPublique}</span>
            </div>
          </div>

          {/* Conditional Special Banners */}
          {nurse.enceinte && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center space-x-3 text-xs text-purple-900">
              <Baby className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold">Grossesse déclarée</span> — Bénéficiaire légale du congé de maternité marocain de 3 mois (90 jours).
                {nurse.dossierMedical && <span className="ml-2 bg-purple-200 px-2 py-0.5 rounded text-[10px] font-semibold">Dossier médical validé</span>}
              </div>
            </div>
          )}

          {nurse.navette && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-3 text-xs text-emerald-900">
              <Car className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Personnel Navettiste</span> : Trajet régulier de <b>{nurse.trajetNavette || nurse.lieuResidence}</b> vers Sidi Ifni. Résidence principale : {nurse.lieuResidence}.
              </div>
            </div>
          )}

          {/* Personal & Professional Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: General Info */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5 text-blue-900">
                <User className="w-4 h-4" />
                <span>Renseignements Généraux</span>
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nom Complet:</span>
                <span className="font-semibold text-slate-800">{nurse.nom} {nurse.prenom}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sexe:</span>
                <span className="font-semibold text-slate-800">{nurse.sexe}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Lieu de Naissance:</span>
                <span className="font-semibold text-slate-800">{nurse.lieuNaissance || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">État Matrimonial:</span>
                <span className="font-semibold text-slate-800">{nurse.etatMarital} ({nurse.nombreEnfants} enfant(s))</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Lieu de Résidence:</span>
                <span className="font-semibold text-slate-800">{nurse.lieuResidence}</span>
              </div>
            </div>

            {/* Right: Career & System */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5 text-blue-900">
                <Building className="w-4 h-4" />
                <span>Situation Administrative & Système</span>
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Grade Actuel:</span>
                <span className="font-semibold text-slate-800">{nurse.grade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Statut Fonction Publique:</span>
                <span className="font-semibold text-slate-800">{nurse.etatFonctionPublique}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Système de Travail:</span>
                <span className="font-bold text-blue-700">{nurse.situationActuelle}</span>
              </div>
              {nurse.shiftNormalDetails && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Détails Shift Normal:</span>
                  <span className="font-semibold text-slate-800">{nurse.shiftNormalDetails}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Téléphone:</span>
                <span className="font-semibold text-slate-800">{nurse.telephone || 'Non renseigné'}</span>
              </div>
            </div>
          </div>

          {/* Leave Quota Table */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 flex items-center space-x-1.5 text-blue-900">
              <Calendar className="w-4 h-4" />
              <span>Droits & Soldes de Congés Réglementaires (Maroc)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800">Congé Administratif (Annuel)</div>
                <div className="text-[11px] text-slate-500 mt-1">Droit: 22 jours ouvrables / an</div>
                <div className="mt-2 text-slate-700">
                  Consommés : <b>{nurse.congeAdmin?.joursConsommes || 0}j</b>
                </div>
                <div className="text-emerald-700 font-bold mt-0.5">
                  Restants : {remainingAdmin} jours
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800">Congé de Maladie Ordinaire</div>
                <div className="text-[11px] text-slate-500 mt-1">Plafond: Jusqu'à 3 mois continus / an</div>
                <div className="mt-2 text-slate-700">
                  Consommés : <b>{nurse.congeMaladie?.joursConsommes || 0}j</b>
                </div>
                <div className="text-slate-700 font-bold mt-0.5">
                  Restants : {remainingSick} jours
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800">Congé Exceptionnel</div>
                <div className="text-[11px] text-slate-500 mt-1">Plafond: 10 jours / an</div>
                <div className="mt-2 text-slate-700">
                  Consommés : <b>{nurse.congeExceptionnel?.joursConsommes || 0}j</b>
                </div>
                <div className="text-slate-700 font-bold mt-0.5">
                  Restants : {10 - (nurse.congeExceptionnel?.joursConsommes || 0)} jours
                </div>
              </div>
            </div>
          </div>

          {/* Leave History Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-blue-700" />
                <span>Historique des Demandes & Arrêts ({nurseDemandes.length})</span>
              </h4>
            </div>

            {nurseDemandes.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                Aucun historique de congé enregistré pour cet agent.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Date Demande</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Cessation ➔ Reprise</th>
                    <th className="px-3 py-2">Jours</th>
                    <th className="px-3 py-2">Statut</th>
                    <th className="px-3 py-2">Décision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nurseDemandes.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-500 font-mono">{d.dateDemande}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">{d.typeConge}</td>
                      <td className="px-3 py-2 font-mono text-slate-700">
                        {d.dateCessation} ➔ {d.dateRepriseEffective || d.dateReprisePrevue}
                      </td>
                      <td className="px-3 py-2 font-bold text-blue-700">{d.nombreJours}j</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            d.etatDemande === 'Confirmé'
                              ? 'bg-emerald-100 text-emerald-800'
                              : d.etatDemande === 'Refusé'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {d.etatDemande}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {d.decisionRecue || 'Non reçue'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Fiche certifiée conforme par l'administration du Bloc Opératoire — CHP Sidi Ifni
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
