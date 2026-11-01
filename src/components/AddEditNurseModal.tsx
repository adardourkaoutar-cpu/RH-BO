import React, { useState, useEffect } from 'react';
import {
  Nurse,
  Sexe,
  Specialite,
  RoleFonction,
  Grade,
  EtatFonctionPublique,
  SituationActuelle,
} from '../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface AddEditNurseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nurseData: any) => void;
  nurseToEdit?: Nurse | null;
}

export const AddEditNurseModal: React.FC<AddEditNurseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  nurseToEdit,
}) => {
  const isEditing = !!nurseToEdit;

  // Form states
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [sexe, setSexe] = useState<Sexe>('Femme');
  const [ppr, setPpr] = useState('');
  const [cni, setCni] = useState('');
  const [dateNaissance, setDateNaissance] = useState('1995-01-01');
  const [lieuNaissance, setLieuNaissance] = useState('Sidi Ifni');
  const [etatMarital, setEtatMarital] = useState<'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)'>('Célibataire');
  const [nombreEnfants, setNombreEnfants] = useState<number>(0);

  // Professional profile
  const [specialite, setSpecialite] = useState<Specialite>('IP');
  const [fonction, setFonction] = useState<RoleFonction>('Aide-opératoire');
  const [grade, setGrade] = useState<Grade>('Infirmier 1er Grade');
  const [dateRecrutement, setDateRecrutement] = useState('2018-01-01');
  const [etatFonctionPublique, setEtatFonctionPublique] = useState<EtatFonctionPublique>('Fonctionnaire Titulaire');

  // Residence & Commute
  const [lieuResidence, setLieuResidence] = useState('Sidi Ifni');
  const [navette, setNavette] = useState<boolean>(false);
  const [trajetNavette, setTrajetNavette] = useState<string>('Tiznit');

  // Conditional: Femmes Mariées
  const [enceinte, setEnceinte] = useState<boolean>(false);
  const [dossierMedical, setDossierMedical] = useState<boolean>(false);

  // Schedule system
  const [situationActuelle, setSituationActuelle] = useState<SituationActuelle>('Système de garde');
  const [shiftNormalDetails, setShiftNormalDetails] = useState('08h30 - 16h30 / Repos hebdomadaire sam-dim');

  // Leave balances
  const [joursReportes, setJoursReportes] = useState<number>(0);
  const [telephone, setTelephone] = useState('');

  const [validationError, setValidationError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (nurseToEdit) {
      setNom(nurseToEdit.nom);
      setPrenom(nurseToEdit.prenom);
      setSexe(nurseToEdit.sexe);
      setPpr(nurseToEdit.ppr);
      setCni(nurseToEdit.cni);
      setDateNaissance(nurseToEdit.dateNaissance || '1995-01-01');
      setLieuNaissance(nurseToEdit.lieuNaissance || '');
      setEtatMarital(nurseToEdit.etatMarital || 'Célibataire');
      setNombreEnfants(nurseToEdit.nombreEnfants || 0);

      setSpecialite(nurseToEdit.specialite);
      setFonction(nurseToEdit.fonction);
      setGrade(nurseToEdit.grade);
      setDateRecrutement(nurseToEdit.dateRecrutement || '2018-01-01');
      setEtatFonctionPublique(nurseToEdit.etatFonctionPublique || 'Fonctionnaire Titulaire');

      setLieuResidence(nurseToEdit.lieuResidence || 'Sidi Ifni');
      setNavette(!!nurseToEdit.navette);
      setTrajetNavette(nurseToEdit.trajetNavette || 'Tiznit');

      setEnceinte(!!nurseToEdit.enceinte);
      setDossierMedical(!!nurseToEdit.dossierMedical);

      setSituationActuelle(nurseToEdit.situationActuelle || 'Système de garde');
      setShiftNormalDetails(nurseToEdit.shiftNormalDetails || '08h30 - 16h30');
      setJoursReportes(nurseToEdit.congeAdmin?.joursReportes || 0);
      setTelephone(nurseToEdit.telephone || '');
    } else {
      // Defaults for new nurse
      setNom('');
      setPrenom('');
      setSexe('Femme');
      setPpr('');
      setCni('');
      setDateNaissance('1997-06-15');
      setLieuNaissance('Sidi Ifni');
      setEtatMarital('Célibataire');
      setNombreEnfants(0);
      setSpecialite('IP');
      setFonction('Aide-opératoire');
      setGrade('Infirmier 1er Grade');
      setDateRecrutement('2020-01-01');
      setEtatFonctionPublique('Fonctionnaire Titulaire');
      setLieuResidence('Sidi Ifni');
      setNavette(false);
      setTrajetNavette('Tiznit');
      setEnceinte(false);
      setDossierMedical(false);
      setSituationActuelle('Système de garde');
      setShiftNormalDetails('08h30 - 16h30 / Repos réglementaire');
      setJoursReportes(0);
      setTelephone('');
    }
    setValidationError('');
  }, [nurseToEdit, isOpen]);

  if (!isOpen) return null;

  const isFemaleMarried = sexe === 'Femme' && etatMarital === 'Marié(e)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!nom.trim() || !prenom.trim()) {
      setValidationError('Le Nom et le Prénom sont obligatoires.');
      return;
    }
    if (!ppr.trim()) {
      setValidationError("Le Numéro d'Immatriculation / PPR est obligatoire.");
      return;
    }
    if (!cni.trim()) {
      setValidationError('Le numéro de CNI est obligatoire.');
      return;
    }
    if (!dateNaissance) {
      setValidationError('La date de naissance est obligatoire.');
      return;
    }

    const payload = {
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      sexe,
      ppr: ppr.trim(),
      cni: cni.trim().toUpperCase(),
      dateNaissance,
      lieuNaissance: lieuNaissance.trim(),
      etatMarital,
      nombreEnfants: Number(nombreEnfants) || 0,
      specialite,
      fonction,
      grade,
      dateRecrutement,
      etatFonctionPublique,
      lieuResidence: lieuResidence.trim(),
      navette,
      trajetNavette: navette ? trajetNavette.trim() : undefined,
      enceinte: isFemaleMarried ? enceinte : false,
      dossierMedical: isFemaleMarried ? dossierMedical : false,
      situationActuelle,
      shiftNormalDetails: situationActuelle === 'Système normal' ? shiftNormalDetails : undefined,
      telephone: telephone.trim() || undefined,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: Number(joursReportes) || 0,
        joursConsommes: nurseToEdit?.congeAdmin?.joursConsommes || 0,
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: nurseToEdit?.congeMaladie?.joursConsommes || 0,
      },
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isEditing ? <Save className="w-5 h-5 text-blue-300" /> : <UserPlus className="w-5 h-5 text-blue-300" />}
            <span className="font-bold text-base">
              {isEditing ? `Modifier la Fiche : ${nurseToEdit.prenom} ${nurseToEdit.nom}` : 'Ajouter un Nouveau Personnel Infirmier'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Informations Personnelles */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>1. État Civil & Données Personnelles</span>
              <span className="text-[10px] font-normal text-slate-500 lowercase">* champs obligatoires</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: BENNANI"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fatima"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sexe <span className="text-red-500">*</span>
                </label>
                <select
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value as Sexe)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PPR (N° Immatriculation) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 2029329"
                  value={ppr}
                  onChange={(e) => setPpr(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CNI (Carte Nationale) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: JD69641"
                  value={cni}
                  onChange={(e) => setCni(e.target.value)}
                  className="w-full text-xs font-mono uppercase border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date de Naissance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lieu de Naissance
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sidi Ifni, Tiznit, Guelmim..."
                  value={lieuNaissance}
                  onChange={(e) => setLieuNaissance(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  État Marital
                </label>
                <select
                  value={etatMarital}
                  onChange={(e) => setEtatMarital(e.target.value as any)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre d'enfants
                </label>
                <input
                  type="number"
                  min="0"
                  value={nombreEnfants}
                  onChange={(e) => setNombreEnfants(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Profil Professionnel */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              2. Profil Professionnel & Statut de la Fonction Publique
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spécialité <span className="text-red-500">*</span>
                </label>
                <select
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value as Specialite)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="IAR">IAR (Infirmier Anesthésiste Réanimateur)</option>
                  <option value="IP">IP (Infirmier Polyvalent)</option>
                  <option value="ISM">ISM (Infirmier Soins d'Urgence / Médicaux)</option>
                  <option value="IBO">IBO (Infirmier de Bloc Opératoire)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rôle / Fonction au Bloc <span className="text-red-500">*</span>
                </label>
                <select
                  value={fonction}
                  onChange={(e) => setFonction(e.target.value as RoleFonction)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Aide-opératoire">Aide opératoire / Panseur</option>
                  <option value="Anesthésiste">Anesthésiste</option>
                  <option value="Stérilisation">Stérilisation</option>
                  <option value="Infirmier chef">Infirmier Chef</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as Grade)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Infirmier 1er Grade">Infirmier 1er Grade</option>
                  <option value="Infirmier Principal">Infirmier Principal</option>
                  <option value="Grade exceptionnel">Grade Exceptionnel</option>
                  <option value="Infirmier en Chef">Infirmier en Chef</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date de Recrutement (Ancienneté) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateRecrutement}
                  onChange={(e) => setDateRecrutement(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Statut Fonction Publique <span className="text-red-500">*</span>
                </label>
                <select
                  value={etatFonctionPublique}
                  onChange={(e) => setEtatFonctionPublique(e.target.value as EtatFonctionPublique)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Fonctionnaire Titulaire">Fonctionnaire Titulaire</option>
                  <option value="Stagiaire">Stagiaire</option>
                  <option value="En disponibilité">En Disponibilité</option>
                  <option value="Sous drapeau">Sous Drapeau (Service Militaire)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone de contact
                </label>
                <input
                  type="tel"
                  placeholder="06 XX XX XX XX"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Conditions Spécifiques (Conditional Fields) */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              3. Conditions Spécifiques & Statut Navette
            </h3>

            {/* Conditional fields for Femmes Mariées */}
            {isFemaleMarried && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-purple-900">
                  Condition spécifique : Agent Féminin Marié(e)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enceinteCheck"
                      checked={enceinte}
                      onChange={(e) => setEnceinte(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    />
                    <label htmlFor="enceinteCheck" className="text-xs font-semibold text-purple-900 cursor-pointer">
                      État de Grossesse (Enceinte) — Droit au congé maternité 3 mois
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="dossierMedCheck"
                      checked={dossierMedical}
                      onChange={(e) => setDossierMedical(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    />
                    <label htmlFor="dossierMedCheck" className="text-xs font-semibold text-purple-900 cursor-pointer">
                      Dossier Médical de suivi déposé (Oui / Non)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Commuter / Navettiste Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lieu de Résidence Actuel
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sidi Ifni, Tiznit, Mirleft, Guelmim..."
                  value={lieuResidence}
                  onChange={(e) => setLieuResidence(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Statut Navettiste (Déplacement quotidien)
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={navette}
                      onChange={(e) => setNavette(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium text-blue-700">Oui, Navettiste</span>
                  </label>
                </div>

                {navette && (
                  <div className="mt-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ville de provenance vers Sidi Ifni
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: De Tiznit vers Sidi Ifni, De Guelmim..."
                      value={trajetNavette}
                      onChange={(e) => setTrajetNavette(e.target.value)}
                      className="w-full text-xs border border-blue-300 bg-blue-50/50 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Système de Travail & Horaires */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              4. Système de Travail & Organisation au Bloc
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Système de Travail Assigné <span className="text-red-500">*</span>
                </label>
                <select
                  value={situationActuelle}
                  onChange={(e) => setSituationActuelle(e.target.value as SituationActuelle)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Système de garde">Système de garde (Équipe 24h / Rotation)</option>
                  <option value="Système normal">Système normal (Horaire continu)</option>
                  <option value="Système d'astreinte">Système d'astreinte</option>
                  <option value="Congé administratif">En Congé administratif</option>
                  <option value="Congé maladie">En Congé maladie</option>
                  <option value="Congé maternité">En Congé maternité</option>
                </select>
              </div>

              {situationActuelle === 'Système normal' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Définition de l'horaire normal / shift
                  </label>
                  <input
                    type="text"
                    value={shiftNormalDetails}
                    onChange={(e) => setShiftNormalDetails(e.target.value)}
                    placeholder="Ex: 08h30 - 16h30 / Repos week-end"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-amber-700 mt-1">
                    *Note réglementaire: Le système normal exclut le programme opératoire ou l'affectation en salle.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jours de congé annuel reportés de l'année précédente
                </label>
                <input
                  type="number"
                  min="0"
                  max="22"
                  value={joursReportes}
                  onChange={(e) => setJoursReportes(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Quota légal : 22 jours statutaires + report (hors week-ends & fériés).
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Enregistrer les Modifications' : 'Créer la Fiche Personnel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
