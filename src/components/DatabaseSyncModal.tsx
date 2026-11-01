import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Radio,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Key,
  X,
  Copy,
  Check
} from 'lucide-react';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    database,
    currentUser,
    loginWithGoogle,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetDatabaseToDefault,
    manualSyncTrigger,
    lastSyncTime,
    isOnline,
    syncChannelActive,
    nurses,
  } = useApp();

  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      const res = importDatabaseJSON(content);
      if (res.success) {
        setImportStatus({ success: true, message: 'Base de données JSON importée avec succès !' });
      } else {
        setImportStatus({ success: false, message: res.error || 'Erreur lors de l’importation.' });
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!jsonInput.trim()) return;
    const res = importDatabaseJSON(jsonInput);
    if (res.success) {
      setImportStatus({ success: true, message: 'Base de données JSON importée avec succès !' });
    } else {
      setImportStatus({ success: false, message: res.error || 'Erreur lors de l’importation.' });
    }
  };

  const handleCopyRawJson = () => {
    navigator.clipboard.writeText(JSON.stringify(database, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">
                Gestionnaire de Base de Données & Synchronisation Inter-Terminaux
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentification Gmail OAuth & Export / Import JSON — CHP Sidi Ifni
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Section 1: Terminal Sync & Network Status */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>État de Synchronisation des Postes Administratifs</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Canal Actif
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Statut Réseau</span>
                <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span>{isOnline ? 'Connecté (En ligne)' : 'Hors-ligne (Local Storage)'}</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Dernière Synchronisation</span>
                <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5">
                  {lastSyncTime.toLocaleTimeString()}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">Diffusion multi-terminaux</span>
                  <span className="font-semibold text-emerald-700 text-xs">Temps réel</span>
                </div>
                <button
                  onClick={manualSyncTrigger}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg cursor-pointer"
                  title="Forcer la synchronisation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Gmail OAuth Authentication & User Roles */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-2">
              <Key className="w-4 h-4 text-blue-700" />
              <span>Authentification Gmail OAuth & Gestion des Droits</span>
            </h4>

            <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-700 font-semibold block uppercase">Session Active</span>
                <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                <div className="text-blue-800 font-mono text-[11px]">{currentUser.email}</div>
              </div>
              <span className="px-2.5 py-1 bg-blue-700 text-white font-bold rounded-lg text-xs">
                {currentUser.role === 'head_nurse'
                  ? 'Infirmier Chef'
                  : currentUser.role === 'hr_officer'
                  ? 'Bureau RH'
                  : 'Personnel Infirmier'}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Connexion Rapide / Changement de Compte Administrateur :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => loginWithGoogle('adardourkaoutar@gmail.com', 'Kaoutar ADARDOUR', 'head_nurse', 'nurse-1792857754910')}
                  className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <div className="font-bold text-indigo-900">Kaoutar ADARDOUR</div>
                  <div className="text-[10px] text-slate-500">adardourkaoutar@gmail.com</div>
                  <div className="text-[10px] text-indigo-700 font-semibold mt-1">Rôle : Infirmier Chef</div>
                </button>

                <button
                  onClick={() => loginWithGoogle('rh.chp.sidiifni@sante.gov.ma', 'Bureau RH (Délégation)', 'hr_officer')}
                  className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="font-bold text-emerald-900">Bureau des RH</div>
                  <div className="text-[10px] text-slate-500">rh.chp.sidiifni@sante.gov.ma</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1">Rôle : Visa & Validation RH</div>
                </button>

                <button
                  onClick={() => {
                    const firstNurse = nurses[0];
                    loginWithGoogle(
                      `${firstNurse?.prenom.toLowerCase()}@chpsidiifni.ma`,
                      `${firstNurse?.prenom} ${firstNurse?.nom}`,
                      'nursing_staff',
                      firstNurse?.id
                    );
                  }}
                  className="p-2.5 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="font-bold text-blue-900">Personnel Infirmier</div>
                  <div className="text-[10px] text-slate-500">agent@chpsidiifni.ma</div>
                  <div className="text-[10px] text-blue-700 font-semibold mt-1">Rôle : Consultation & Requêtes</div>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Backup, Export & Import */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-blue-700" />
                <span>Sauvegarde & Restauration Complète (JSON)</span>
              </span>
              <span className="text-[10px] text-slate-500">
                {database.nurses.length} infirmiers • {database.demandes.length} congés
              </span>
            </h4>

            {importStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                  importStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {importStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportDatabaseJSON}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger Sauvegarde JSON</span>
              </button>

              <label className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold border border-slate-300 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Importer Fichier JSON</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={handleCopyRawJson}
                className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors cursor-pointer"
                title="Copier le JSON brut dans le presse-papier"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copié !' : 'Copier JSON'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Voulez-vous réinitialiser la base de données aux 22 agents officiels du CHP Sidi Ifni ?')) {
                    resetDatabaseToDefault();
                    setImportStatus({ success: true, message: 'Base de données réinitialisée aux données certifiées CHP Sidi Ifni.' });
                  }
                }}
                className="flex items-center space-x-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium border border-red-200 transition-colors ml-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-red-600" />
                <span>Réinitialiser Données Initiales</span>
              </button>
            </div>

            {/* Direct JSON editor / inspector */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-[11px] font-semibold text-slate-600">
                Inspecteur & Rectificateur JSON Direct (Coller ou modifier du JSON) :
              </label>
              <textarea
                rows={5}
                placeholder="Collez ici le contenu JSON complet pour importer manuellement..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full text-[11px] font-mono border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              {jsonInput && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handlePasteImport}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                  >
                    Valider le texte JSON collé
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
