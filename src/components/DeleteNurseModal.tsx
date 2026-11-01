import React, { useState } from 'react';
import { Nurse, MotifSuppression } from '../types';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteNurseModalProps {
  nurse: Nurse | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nurseId: string, reason: MotifSuppression, notes: string) => void;
}

export const DeleteNurseModal: React.FC<DeleteNurseModalProps> = ({
  nurse,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState<MotifSuppression>('Mutation');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !nurse) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Veuillez sélectionner un motif administratif obligatoire.');
      return;
    }
    onConfirm(nurse.id, reason, notes);
    onClose();
  };

  const reasonsList: { value: MotifSuppression; label: string; desc: string }[] = [
    { value: 'Mutation', label: 'Mutation', desc: 'Transfert administratif vers un autre hôpital / délégation' },
    { value: 'Retraite', label: 'Retraite (Retrait)', desc: 'Départ à la retraite (limite d’âge ou anticipée)' },
    { value: 'Démission', label: 'Démission', desc: 'Démission acceptée par le Ministère de la Santé' },
    { value: 'Décès', label: 'Décès', desc: 'Radiation des cadres suite à décès' },
    { value: 'Exclusion', label: 'Exclusion / Révocation', desc: 'Décision disciplinaire ministérielle' },
    { value: 'Suspension', label: 'Suspension de fonction', desc: 'Interruption temporaire d’activité' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-700 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Suppression Administrative d'un Agent</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="font-semibold text-slate-800 text-sm">
              {nurse.prenom} {nurse.nom}
            </div>
            <div className="text-slate-600 mt-1 flex flex-wrap gap-x-3">
              <span>PPR: <b>{nurse.ppr}</b></span>
              <span>CNI: <b>{nurse.cni}</b></span>
              <span>Spécialité: <b>{nurse.specialite}</b></span>
              <span>Fonction: <b>{nurse.fonction}</b></span>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            Conformément aux directives de gestion RH du CHP Sidi Ifni, la radiation ou suppression d'un personnel infirmier du Bloc requiert obligatoirement un motif réglementaire d'archive.
          </div>

          {/* Mandatory Reason Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Motif Réglementaire de Suppression / Radiation <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as MotifSuppression)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              required
            >
              {reasonsList.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} — {r.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Reference or Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Référence Administrative & Observations
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Arrêté ministériel n° 458/2026, mutation vers CHR Guelmim..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          {error && <div className="text-xs text-red-600 font-semibold">{error}</div>}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors"
            >
              Confirmer la Radiation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
