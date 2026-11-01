import React from 'react';
import { DemandeConge, Nurse } from '../types';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OfficialSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slipType: 'cessation' | 'reprise';
  demande: DemandeConge | null;
  nurse: Nurse | null;
}

export const OfficialSlipModal: React.FC<OfficialSlipModalProps> = ({
  isOpen,
  onClose,
  slipType,
  demande,
  nurse,
}) => {
  if (!isOpen || !demande || !nurse) return null;

  const isCessation = slipType === 'cessation';
  const title = isCessation ? 'AVIS DE CESSATION DE SERVICE' : 'AVIS DE REPRISE DE SERVICE';
  const subTitle = isCessation
    ? '(Avis officiel de départ en congé / arrêt réglementaire)'
    : '(Avis officiel de reprise effective de fonction)';

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls Bar */}
        <div className="bg-gradient-to-r from-[#0b3334] via-[#0f4c4c] to-[#0d4554] p-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-300" />
            <span className="font-bold text-sm">
              Document Administratif Officiel — CHP Sidi Ifni
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer l'Avis</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Moroccan Slip Area */}
        <div id="printable-official-slip" className="p-8 sm:p-12 text-slate-900 bg-white space-y-6">
          {/* Moroccan Administrative Official Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start text-xs font-serif leading-tight">
              <div className="space-y-0.5 text-left">
                <div className="font-bold uppercase tracking-wider text-[11px]">Royaume du Maroc</div>
                <div>Ministère de la Santé et de la Protection Sociale</div>
                <div>Direction Régionale de la Santé - Guelmim Oued-Noun</div>
                <div>Délégation Provinciale de Sidi Ifni</div>
                <div className="font-semibold">Centre Hospitalier Provincial de Sidi Ifni</div>
                <div className="font-bold text-teal-950">Service : Bloc Opératoire Central</div>
              </div>

              <div className="text-right space-y-0.5 font-sans">
                <div className="text-[11px] font-bold text-slate-800">Réf : CHP-SI/BOC/RH/2026</div>
                <div className="text-slate-500 text-[11px]">Sidi Ifni, le {todayStr}</div>
                <div className="text-[10px] text-slate-400 font-mono">ID: {demande.id}</div>
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center py-3 my-2 border-y border-slate-300 bg-slate-50">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-slate-900 font-serif">
              {title}
            </h1>
            <p className="text-xs text-slate-600 mt-1 italic">{subTitle}</p>
          </div>

          {/* Statement body */}
          <div className="text-sm leading-relaxed space-y-4">
            <p>
              L'Infirmier Chef du <b>Bloc Opératoire Central</b> soussigné, atteste que :
            </p>

            {/* Personnel Identity Table */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-sans">
              <div>
                <span className="text-slate-500">Nom & Prénom : </span>
                <b className="text-slate-900 uppercase">{nurse.nom} {nurse.prenom}</b>
              </div>
              <div>
                <span className="text-slate-500">Numéro PPR : </span>
                <b className="text-slate-900 font-mono">{nurse.ppr}</b>
              </div>
              <div>
                <span className="text-slate-500">CNI : </span>
                <b className="text-slate-900 font-mono">{nurse.cni}</b>
              </div>
              <div>
                <span className="text-slate-500">Grade : </span>
                <b className="text-slate-900">{nurse.grade}</b>
              </div>
              <div>
                <span className="text-slate-500">Spécialité : </span>
                <b className="text-slate-900">{nurse.specialite} ({nurse.fonction})</b>
              </div>
              <div>
                <span className="text-slate-500">Affectation : </span>
                <b className="text-slate-900">Bloc Opératoire Central</b>
              </div>
            </div>

            {/* Leave Details Statement */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              {isCessation ? (
                <>
                  <p>
                    A <b>cessé le service</b> le : <span className="underline font-bold text-teal-950">{demande.dateCessation}</span>
                  </p>
                  <p>
                    Pour motif de : <span className="font-bold underline">{demande.typeConge}</span> d'une durée réglementaire de <b className="text-teal-950">{demande.nombreJours} jours</b>.
                  </p>
                  {demande.typeConge === 'Congé Maladie' && (
                    <p className="text-xs text-slate-700 bg-red-50 p-2.5 rounded border border-red-200">
                      Arrêt de travail médicalisé. Référence certificat médical : <b>{demande.certificatMedicalNumero || 'CM/2026/SP'}</b> délivré par le Dr <b>{demande.medecinTraitant || 'Médecin traitant conventionné'}</b>.
                    </p>
                  )}
                  <p>
                    Date de reprise prévisionnelle fixée au : <span className="font-bold underline text-slate-900">{demande.dateReprisePrevue}</span>.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Après avoir bénéficié d'un(e) <b className="underline">{demande.typeConge}</b> ayant débuté le <b>{demande.dateCessation}</b>,
                  </p>
                  <p>
                    A <b>effectivement repris son service</b> au Bloc Opératoire le : <span className="underline font-bold text-emerald-800 text-base">{demande.dateRepriseEffective || demande.dateReprisePrevue}</span> à 08h30.
                  </p>
                  {demande.dateRepriseEffective && demande.dateRepriseEffective < demande.dateReprisePrevue && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                      * Reprise anticipée constatée avant la fin de l'arrêt initialement prévu le {demande.dateReprisePrevue}.
                    </p>
                  )}
                </>
              )}
            </div>

            <p className="text-xs text-slate-600 pt-2">
              Le présent avis est délivré à l'intéressé(e) pour servir et valoir ce que de droit, et transmis au Bureau des Ressources Humaines du CHP de Sidi Ifni pour inscription au dossier administratif.
            </p>
          </div>

          {/* Official Signatures & Stamps Box */}
          <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs font-serif border-t border-slate-200 mt-6">
            <div>
              <div className="font-bold text-slate-800 uppercase mb-12">L'Agent Intéressé(e)</div>
              <div className="text-[11px] text-slate-400 italic">Signature</div>
            </div>

            <div>
              <div className="font-bold text-slate-800 uppercase mb-2">L'Infirmier Chef du Bloc</div>
              <div className="text-[11px] font-sans font-semibold text-slate-700">Kaoutar ADARDOUR</div>
              <div className="w-20 h-20 border-2 border-dashed border-teal-300 rounded-full mx-auto flex items-center justify-center text-[10px] text-teal-700 font-sans mt-2">
                Cachet du Service
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-800 uppercase mb-2">Le Directeur du CHP Sidi Ifni</div>
              <div className="text-[11px] font-sans text-slate-500">Pour visa & enregistrement</div>
              <div className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-full mx-auto flex items-center justify-center text-[10px] text-slate-400 font-sans mt-2">
                Cachet CHP
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl cursor-pointer"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-teal-700 to-cyan-800 hover:from-teal-800 hover:to-cyan-900 text-white rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le document officiel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
