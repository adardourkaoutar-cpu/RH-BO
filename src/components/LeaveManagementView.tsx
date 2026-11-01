import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DemandeConge, TypeConge, Nurse } from '../types';
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  FileUp,
  Printer,
  ChevronRight,
  Plus,
  AlertCircle,
  Baby,
  HeartPulse,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';
import {
  calculateRemainingAdminDays,
  calculateRemainingSickDays,
  isLeaveActiveToday,
  isWithinDays
} from '../utils/leaveCalculations';
import { calculateStatutoryDays, computeProjectedEndDate } from '../utils/moroccanHolidays';

interface LeaveManagementViewProps {
  onOpenOfficialSlip: (slipType: 'cessation' | 'reprise', demande: DemandeConge, nurse: Nurse) => void;
  defaultNewLeaveType?: string | null;
  onClearDefaultType?: () => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  onOpenOfficialSlip,
  defaultNewLeaveType,
  onClearDefaultType,
}) => {
  const {
    activeNurses,
    demandes,
    currentUser,
    addDemande,
    giveHeadNurseOpinion,
    giveVisaRH,
    recordEarlyResumption,
    signCessation,
    signReprise,
    uploadDecisionPdf,
  } = useApp();

  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchNurse, setSearchNurse] = useState('');

  // Modal: New Leave Request
  const [isNewModalOpen, setIsNewModalOpen] = useState(!!defaultNewLeaveType);
  const [selectedNurseId, setSelectedNurseId] = useState(activeNurses[0]?.id || '');
  const [selectedType, setSelectedType] = useState<TypeConge>(
    (defaultNewLeaveType as TypeConge) || 'Congé Administratif'
  );
  const [dateCessation, setDateCessation] = useState(() => new Date().toISOString().split('T')[0]);
  const [dateReprisePrevue, setDateReprisePrevue] = useState(() => {
    return computeProjectedEndDate(new Date().toISOString().split('T')[0], 5, 'Congé Administratif');
  });
  const [certificatRef, setCertificatRef] = useState('');
  const [medecin, setMedecin] = useState('');
  const [motifExceptionnel, setMotifExceptionnel] = useState('Mariage de l’agent (4 jours)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Early Resumption Modal state
  const [earlyResumptionModalDemande, setEarlyResumptionModalDemande] = useState<DemandeConge | null>(null);
  const [earlyReturnDate, setEarlyReturnDate] = useState(new Date().toISOString().split('T')[0]);

  // Upload PDF Decision state
  const [uploadPdfModalDemande, setUploadPdfModalDemande] = useState<DemandeConge | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');

  // Selected nurse data for the form
  const currentSelectedNurse = activeNurses.find((n) => n.id === selectedNurseId);
  const calculatedDays = calculateStatutoryDays(dateCessation, dateReprisePrevue, selectedType);

  // Recalculate projected end date when start date or type changes
  const handleCessationChange = (newDate: string) => {
    setDateCessation(newDate);
    const defaultDays = selectedType === 'Congé Administratif' ? 10 : selectedType === 'Congé Maladie' ? 7 : 90;
    setDateReprisePrevue(computeProjectedEndDate(newDate, defaultDays, selectedType));
  };

  const handleTypeChange = (newType: TypeConge) => {
    setSelectedType(newType);
    const defaultDays = newType === 'Congé Administratif' ? 10 : newType === 'Congé Maladie' ? 7 : newType === 'Congé Maternité' ? 90 : 3;
    setDateReprisePrevue(computeProjectedEndDate(dateCessation, defaultDays, newType));
  };

  const handleCreateDemande = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNurseId) {
      setFormError('Veuillez sélectionner un membre du personnel.');
      return;
    }
    if (!dateCessation || !dateReprisePrevue) {
      setFormError('Les dates de cessation et de reprise sont obligatoires.');
      return;
    }
    if (calculatedDays <= 0) {
      setFormError('La date de reprise doit être postérieure à la date de cessation.');
      return;
    }

    // Special validation for Administrative leave balance
    if (selectedType === 'Congé Administratif' && currentSelectedNurse) {
      const remaining = calculateRemainingAdminDays(currentSelectedNurse);
      if (calculatedDays > remaining) {
        if (!confirm(`Attention : La durée demandée (${calculatedDays} jours ouvrables) dépasse le solde restant (${remaining} jours). Confirmer tout de même ?`)) {
          return;
        }
      }
    }

    addDemande({
      nurseId: selectedNurseId,
      typeConge: selectedType,
      dateCessation,
      dateReprisePrevue,
      nombreJours: calculatedDays,
      motifExceptionnel: selectedType === 'Congé Exceptionnel' ? motifExceptionnel : undefined,
      estMaladieDirecte: selectedType === 'Congé Maladie',
      certificatMedicalNumero: selectedType === 'Congé Maladie' ? certificatRef || `CM/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}` : undefined,
      medecinTraitant: selectedType === 'Congé Maladie' ? medecin || 'Dr. Médecin Conseil CHP' : undefined,
      notes,
    });

    setIsNewModalOpen(false);
    setFormError('');
    if (onClearDefaultType) onClearDefaultType();
  };

  // Submit early resumption
  const handleConfirmEarlyResumption = () => {
    if (!earlyResumptionModalDemande) return;
    recordEarlyResumption(earlyResumptionModalDemande.id, earlyReturnDate);
    setEarlyResumptionModalDemande(null);
  };

  // Submit uploaded decision
  const handleConfirmUploadPdf = () => {
    if (!uploadPdfModalDemande) return;
    const finalName = pdfFileName.trim() || `Decision_Conge_${uploadPdfModalDemande.typeConge.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    uploadDecisionPdf(uploadPdfModalDemande.id, finalName);
    setUploadPdfModalDemande(null);
    setPdfFileName('');
  };

  // Filtered requests list
  const filteredDemandes = demandes.filter((d) => {
    if (filterType !== 'all' && d.typeConge !== filterType) return false;
    if (filterStatus !== 'all' && d.etatDemande !== filterStatus) return false;
    if (searchNurse.trim()) {
      const nurse = activeNurses.find((n) => n.id === d.nurseId);
      const name = nurse ? `${nurse.nom} ${nurse.prenom}`.toLowerCase() : '';
      const ppr = nurse ? nurse.ppr.toLowerCase() : '';
      const q = searchNurse.toLowerCase();
      if (!name.includes(q) && !ppr.includes(q)) return false;
    }
    return true;
  });

  // Alerts
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingResumptions = demandes.filter((d) => {
    if (d.etatDemande !== 'Confirmé') return false;
    const rep = d.dateRepriseEffective || d.dateReprisePrevue;
    return isWithinDays(rep, 7);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Moroccan Civil Service Quota Badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                Rubrique Gestion des Congés & Arrêts
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Fonction Publique Marocaine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Réglementation statutaire du personnel hospitalier : Congés annuels (22j ouvrables hors week-ends et fériés), arrêts maladie immédiats (3 mois max), maternité (3 mois) et autorisations exceptionnelles.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedType('Congé Maladie');
                setIsNewModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Arrêt Maladie Immédiat</span>
            </button>

            <button
              onClick={() => {
                setSelectedType('Congé Administratif');
                setIsNewModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Demande</span>
            </button>
          </div>
        </div>

        {/* 4 Quotas Quick Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/80">
            <span className="font-bold text-blue-900 block">Congé Administratif (Annuel)</span>
            <span className="text-blue-700 font-semibold text-sm">22 jours ouvrables / an</span>
            <span className="text-[10px] text-blue-600 block mt-0.5">
              Exclut samedis, dimanches et fériés marocains. Report autorisé.
            </span>
          </div>

          <div className="bg-red-50/70 p-3 rounded-xl border border-red-200/80">
            <span className="font-bold text-red-900 block flex items-center justify-between">
              <span>Congé de Maladie</span>
              <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-bold">Immédiat</span>
            </span>
            <span className="text-red-700 font-semibold text-sm">Jusqu'à 3 mois continus</span>
            <span className="text-[10px] text-red-600 block mt-0.5">
              Enregistré sans attente d'avis. Reprise anticipée permise.
            </span>
          </div>

          <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/80">
            <span className="font-bold text-purple-900 block">Congé Maternité</span>
            <span className="text-purple-700 font-semibold text-sm">3 mois (90 jours)</span>
            <span className="text-[10px] text-purple-600 block mt-0.5">
              Délivré sur présentation du certificat médical de grossesse.
            </span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
            <span className="font-bold text-emerald-900 block">Congé Exceptionnel</span>
            <span className="text-emerald-700 font-semibold text-sm">10 jours / an max</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              Événements familiaux (mariage: 4j, naissance/décès: 3j).
            </span>
          </div>
        </div>
      </div>

      {/* Alert Banner: Upcoming Resumptions (< 7 days) */}
      {upcomingResumptions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-2 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold">
              {upcomingResumptions.length} reprise(s) de service imminente(s) dans les 7 prochains jours :
            </span>
            <span>
              {upcomingResumptions.map((d) => {
                const nurse = activeNurses.find((n) => n.id === d.nurseId);
                return `${nurse?.prenom} ${nurse?.nom} (${d.dateRepriseEffective || d.dateReprisePrevue})`;
              }).join(' • ')}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            Préparer les Avis de Reprise signés
          </span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher agent, PPR..."
              value={searchNurse}
              onChange={(e) => setSearchNurse(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tous les types de congés</option>
            <option value="Congé Administratif">Congé Administratif</option>
            <option value="Congé Maladie">Congé Maladie</option>
            <option value="Congé Maternité">Congé Maternité</option>
            <option value="Congé Exceptionnel">Congé Exceptionnel</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="Demandé">Demandé (attente avis Chef)</option>
            <option value="En attente">En attente (attente Visa RH)</option>
            <option value="Confirmé">Confirmé (Validé & Actif)</option>
            <option value="Refusé">Refusé</option>
          </select>
        </div>

        <div className="text-slate-500 font-medium shrink-0">
          Total : <b>{filteredDemandes.length}</b> demandes répertoriées
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredDemandes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Aucune demande de congé ne correspond aux filtres sélectionnés.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Type & Motif</th>
                  <th className="px-4 py-3">Période (Cessation ➔ Reprise)</th>
                  <th className="px-4 py-3">Durée Statutaire</th>
                  <th className="px-4 py-3">Workflow & Décision</th>
                  <th className="px-4 py-3">Documents Officiels</th>
                  <th className="px-4 py-3 text-right">Actions Hiérarchiques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDemandes.map((dem) => {
                  const nurse = activeNurses.find((n) => n.id === dem.nurseId);
                  const isSick = dem.typeConge === 'Congé Maladie';
                  const isActiveNow = isLeaveActiveToday(dem, todayStr);

                  return (
                    <tr key={dem.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Nurse Info */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">
                          {nurse ? `${nurse.prenom} ${nurse.nom}` : 'Agent inconnu'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          PPR: {nurse?.ppr} • {nurse?.fonction}
                        </div>
                      </td>

                      {/* Type & Motif */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            dem.typeConge === 'Congé Maladie'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : dem.typeConge === 'Congé Maternité'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : dem.typeConge === 'Congé Exceptionnel'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {dem.typeConge}
                        </span>
                        {dem.motifExceptionnel && (
                          <div className="text-[10px] text-slate-500 mt-1 italic">
                            {dem.motifExceptionnel}
                          </div>
                        )}
                        {dem.certificatMedicalNumero && (
                          <div className="text-[10px] text-red-600 mt-0.5 font-mono">
                            Certif: {dem.certificatMedicalNumero}
                          </div>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-800 font-medium">
                          {dem.dateCessation} ➔ {dem.dateRepriseEffective || dem.dateReprisePrevue}
                        </div>
                        {dem.dateRepriseEffective && (
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            Reprise effective : {dem.dateRepriseEffective}
                          </span>
                        )}
                        {isActiveNow && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                            Actuellement en congé
                          </span>
                        )}
                      </td>

                      {/* Statutory Days */}
                      <td className="px-4 py-3">
                        <span className="font-extrabold text-blue-900 text-sm">
                          {dem.nombreJours} jours
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {dem.typeConge === 'Congé Administratif' ? 'ouvrables (hors w-e & fériés)' : 'continus'}
                        </div>
                      </td>

                      {/* Workflow State */}
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {/* Main badge */}
                          <div className="flex items-center space-x-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                dem.etatDemande === 'Confirmé'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : dem.etatDemande === 'Refusé'
                                  ? 'bg-red-100 text-red-800'
                                  : dem.etatDemande === 'En attente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {dem.etatDemande}
                            </span>
                            {dem.estMaladieDirecte && (
                              <span className="text-[10px] text-red-700 font-bold" title="Enregistrement direct sans avis ni visa préalable">
                                (Direct)
                              </span>
                            )}
                          </div>

                          {/* Stepper info */}
                          <div className="text-[10px] text-slate-500 space-y-0.5">
                            <div>
                              Avis Chef: {dem.avisInfirmierChef ? (
                                <b className={dem.avisInfirmierChef.decision === 'Favorable' ? 'text-emerald-700' : 'text-red-600'}>
                                  {dem.avisInfirmierChef.decision}
                                </b>
                              ) : isSick ? (
                                <span className="text-slate-400 italic">Dispensé (Maladie)</span>
                              ) : (
                                <span className="text-amber-600">En attente</span>
                              )}
                            </div>
                            <div>
                              Visa RH: {dem.visaRH ? (
                                <b className="text-blue-700">Visé ({dem.visaRH.reference || 'OK'})</b>
                              ) : isSick ? (
                                <span className="text-slate-400 italic">Enregistré d'office</span>
                              ) : (
                                <span className="text-slate-400">Non apposé</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Operational Documents (Cessation & Reprise Slips) */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {/* Cessation Slip */}
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => nurse && onOpenOfficialSlip('cessation', dem, nurse)}
                              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 underline cursor-pointer"
                              title="Générer / Imprimer l'Avis de Cessation"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Avis Cessation</span>
                            </button>
                            {dem.cessationSignee ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold">
                                Signée
                              </span>
                            ) : (
                              <button
                                onClick={() => signCessation(dem.id)}
                                className="text-[10px] text-slate-500 hover:text-emerald-700 underline"
                              >
                                Marquer signée
                              </button>
                            )}
                          </div>

                          {/* Reprise Slip */}
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => nurse && onOpenOfficialSlip('reprise', dem, nurse)}
                              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 underline cursor-pointer"
                              title="Générer / Imprimer l'Avis de Reprise"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Avis Reprise</span>
                            </button>
                            {dem.repriseSignee ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold">
                                Signée
                              </span>
                            ) : (
                              <button
                                onClick={() => signReprise(dem.id)}
                                className="text-[10px] text-slate-500 hover:text-emerald-700 underline"
                              >
                                Marquer signée
                              </button>
                            )}
                          </div>

                          {/* PDF Decision */}
                          <div className="text-[10px]">
                            {dem.decisionPdfName ? (
                              <span className="text-indigo-700 font-medium flex items-center space-x-1">
                                <FileCheck className="w-3 h-3 text-indigo-600" />
                                <span className="truncate max-w-[110px]" title={dem.decisionPdfName}>
                                  {dem.decisionPdfName}
                                </span>
                              </span>
                            ) : (
                              <button
                                onClick={() => setUploadPdfModalDemande(dem)}
                                className="text-slate-500 hover:text-blue-700 flex items-center space-x-1 underline cursor-pointer"
                              >
                                <FileUp className="w-3 h-3" />
                                <span>Joindre Décision (PDF)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Hierarchical Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end space-y-1">
                          {/* Step 1: Head Nurse Opinion */}
                          {currentUser.role === 'head_nurse' && !dem.avisInfirmierChef && !dem.estMaladieDirecte && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => giveHeadNurseOpinion(dem.id, 'Favorable')}
                                className="px-2 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                              >
                                Avis Favorable
                              </button>
                              <button
                                onClick={() => giveHeadNurseOpinion(dem.id, 'Défavorable', 'Nécessité de service')}
                                className="px-2 py-1 text-[11px] font-semibold bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors cursor-pointer"
                              >
                                Refuser
                              </button>
                            </div>
                          )}

                          {/* Step 2: HR Visa */}
                          {currentUser.role === 'hr_officer' && dem.avisInfirmierChef?.decision === 'Favorable' && !dem.visaRH && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => giveVisaRH(dem.id, 'Visé')}
                                className="px-2.5 py-1 text-[11px] font-bold bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors cursor-pointer"
                              >
                                Apposer Visa RH
                              </button>
                              <button
                                onClick={() => giveVisaRH(dem.id, 'Refusé', undefined, 'Non conforme aux quotas')}
                                className="px-2 py-1 text-[11px] font-semibold bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors cursor-pointer"
                              >
                                Rejeter
                              </button>
                            </div>
                          )}

                          {/* Early Resumption Button (Crucial for sick leaves or early returns) */}
                          {dem.etatDemande === 'Confirmé' && !dem.dateRepriseEffective && (
                            <button
                              onClick={() => {
                                setEarlyResumptionModalDemande(dem);
                                setEarlyReturnDate(new Date().toISOString().split('T')[0]);
                              }}
                              className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded border border-amber-300 transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              <span>Reprise Anticipée</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: New Leave Request */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-300" />
                <span className="font-bold text-base">
                  {selectedType === 'Congé Maladie' ? 'Enregistrement Immédiat d’Arrêt Maladie' : 'Nouvelle Demande de Congé Réglementaire'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsNewModalOpen(false);
                  if (onClearDefaultType) onClearDefaultType();
                }}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDemande} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Special Rule Note for Sick Leave */}
              {selectedType === 'Congé Maladie' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <HeartPulse className="w-4 h-4 text-red-600" />
                    <span>Règle Spéciale : Enregistrement d'Office Sans Délai</span>
                  </div>
                  <p>
                    Conformément aux instructions de service, les congés maladie sont enregistrés <b>immédiatement sans attendre l'avis de l'Infirmier Chef ni le visa du Bureau RH</b>. Ils requièrent obligatoirement les dates de cessation et de reprise, avec possibilité de reprise anticipée.
                  </p>
                </div>
              )}

              {/* Nurse Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Sélectionner l'Agent Infirmier du Bloc <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedNurseId}
                  onChange={(e) => setSelectedNurseId(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {activeNurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nom} {n.prenom} (PPR: {n.ppr}) — {n.fonction} [{n.specialite}]
                    </option>
                  ))}
                </select>

                {currentSelectedNurse && (
                  <div className="mt-1.5 flex items-center space-x-3 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span>
                      Solde Congé Admin : <b className="text-blue-700">{calculateRemainingAdminDays(currentSelectedNurse)} jours</b>
                    </span>
                    <span>•</span>
                    <span>
                      Solde Maladie : <b className="text-red-600">{calculateRemainingSickDays(currentSelectedNurse)} jours</b>
                    </span>
                    {currentSelectedNurse.enceinte && (
                      <>
                        <span>•</span>
                        <span className="text-purple-700 font-bold">Éligible Congé Maternité 90j</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Leave Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Type de Congé <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value as TypeConge)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    <option value="Congé Administratif">Congé Administratif (Annuel 22j)</option>
                    <option value="Congé Maladie">Congé Maladie (Jusqu'à 3 mois)</option>
                    <option value="Congé Maternité">Congé Maternité (3 mois / 90 jours)</option>
                    <option value="Congé Exceptionnel">Congé Exceptionnel (Plafond 10j)</option>
                  </select>
                </div>

                {selectedType === 'Congé Exceptionnel' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Motif Réglementaire de Congé Exceptionnel
                    </label>
                    <select
                      value={motifExceptionnel}
                      onChange={(e) => setMotifExceptionnel(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                    >
                      <option value="Mariage de l'agent (4 jours)">Mariage de l'agent (4 jours)</option>
                      <option value="Naissance d'un enfant (3 jours)">Naissance d'un enfant (3 jours)</option>
                      <option value="Décès du conjoint ou d'un enfant (3 jours)">Décès conjoint/enfant (3 jours)</option>
                      <option value="Décès d'un ascendant (père/mère) (3 jours)">Décès père/mère (3 jours)</option>
                      <option value="Circoncision d'un enfant (2 jours)">Circoncision (2 jours)</option>
                      <option value="Déménagement (2 jours)">Déménagement (2 jours)</option>
                    </select>
                  </div>
                )}

                {selectedType === 'Congé Maladie' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      N° Certificat Médical & Médecin Traitant
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: CM-2026/410, Dr. Amrani"
                      value={certificatRef}
                      onChange={(e) => setCertificatRef(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Date de Cessation (Départ du Bloc) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dateCessation}
                    onChange={(e) => handleCessationChange(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Date de Reprise Prévue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dateReprisePrevue}
                    onChange={(e) => setDateReprisePrevue(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Durée statutaire calculée automatiquement :
                  </span>
                  <span className="font-extrabold text-blue-900 text-sm bg-blue-100 px-3 py-1 rounded-lg">
                    {calculatedDays} jours {selectedType === 'Congé Administratif' ? 'ouvrables' : 'calendaires'}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Observations / Remarques (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Intérim assuré par un collègue, contact d'urgence..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md"
                >
                  {selectedType === 'Congé Maladie' ? 'Enregistrer Immédiatement' : 'Soumettre la Demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Early Resumption (Reprise Anticipée) */}
      {earlyResumptionModalDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-base border-b border-slate-100 pb-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Enregistrement de Reprise Anticipée</span>
            </div>

            <p className="text-xs text-slate-600">
              L'agent reprend son service au Bloc Opératoire avant l'échéance de l'arrêt initialement prévue le <b>{earlyResumptionModalDemande.dateReprisePrevue}</b>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Date de Reprise Effective au Bloc
              </label>
              <input
                type="date"
                value={earlyReturnDate}
                onChange={(e) => setEarlyReturnDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-semibold"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setEarlyResumptionModalDemande(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmEarlyResumption}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
              >
                Confirmer la Reprise Effective
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Decision PDF */}
      {uploadPdfModalDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-base border-b border-slate-100 pb-2">
              <FileUp className="w-5 h-5 text-blue-700" />
              <span>Joindre la Décision Administrative (PDF)</span>
            </div>

            <p className="text-xs text-slate-600">
              Enregistrez la référence officielle ou le fichier PDF de la décision émise par la Délégation de la Santé de Sidi Ifni.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nom du document ou référence PDF
              </label>
              <input
                type="text"
                placeholder="Ex: Decision_Conge_2026_842_CHP.pdf"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setUploadPdfModalDemande(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmUploadPdf}
                className="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md"
              >
                Valider & Attacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
