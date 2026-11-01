export type Sexe = 'Homme' | 'Femme';

export type Specialite = 'IAR' | 'IP' | 'ISM' | 'IBO';

export type RoleFonction =
  | 'Anesthésiste'
  | 'Aide-opératoire'
  | 'Stérilisation'
  | 'Infirmier chef';

export type Grade =
  | 'Infirmier 1er Grade'
  | 'Infirmier Principal'
  | 'Grade exceptionnel'
  | 'Infirmier en Chef';

export type EtatFonctionPublique =
  | 'Fonctionnaire Titulaire'
  | 'Stagiaire'
  | 'En disponibilité'
  | 'Sous drapeau';

export type SituationActuelle =
  | 'Système normal'
  | 'Système de garde'
  | "Système d'astreinte"
  | 'Congé administratif'
  | 'Congé maladie'
  | 'Congé maternité'
  | 'Congé exceptionnel';

export type MotifSuppression =
  | 'Décès'
  | 'Mutation'
  | 'Retraite'
  | 'Démission'
  | 'Exclusion'
  | 'Suspension';

export interface CongeAdminData {
  limiteAnnuelle: number; // statutory 22 days
  joursReportes: number;  // carried over from previous year
  joursConsommes: number;
}

export interface CongeMaladieData {
  limiteAnnuelleMois: number; // 3 months max
  joursConsommes: number;
}

export interface CongeMaterniteData {
  dateCessation?: string;
  dateReprise?: string;
  dureeJours?: number; // 90 days / 3 months
  actif?: boolean;
}

export interface CongeExceptionnelData {
  limiteAnnuelle: number; // statutory 10 days
  joursConsommes: number;
}

export interface Nurse {
  id: string;
  nom: string;
  prenom: string;
  sexe: Sexe;
  ppr: string; // Numéro d'immatriculation / PPR
  cni: string; // Carte Nationale d'Identité
  specialite: Specialite;
  fonction: RoleFonction;
  dateNaissance: string; // YYYY-MM-DD
  lieuNaissance: string;
  etatMarital: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)';
  nombreEnfants: number;
  grade: Grade;
  dateRecrutement: string; // YYYY-MM-DD
  etatFonctionPublique: EtatFonctionPublique;
  lieuResidence: string;
  navette: boolean;
  trajetNavette?: string; // e.g. "Tiznit", "Guelmim", "Mirleft"
  enceinte?: boolean;     // Conditional: Femmes mariées
  dossierMedical?: boolean; // Conditional: Dossier médical si enceinte / suivi
  situationActuelle: SituationActuelle;
  shiftNormalDetails?: string; // Normal schedule period/shift definitions
  congeAdmin: CongeAdminData;
  congeMaladie: CongeMaladieData;
  congeMaternite?: CongeMaterniteData;
  congeExceptionnel?: CongeExceptionnelData;
  telephone?: string;
  email?: string;
  archived?: boolean;
  archiveReason?: MotifSuppression;
  archiveDate?: string;
  archiveNotes?: string;
}

export type TypeConge =
  | 'Congé Administratif'
  | 'Congé Maladie'
  | 'Congé Maternité'
  | 'Congé Exceptionnel';

export type EtatDemande =
  | 'Demandé'
  | 'En attente'
  | 'Confirmé'
  | 'Refusé';

export type DecisionRecue =
  | 'Non reçue'
  | 'En cours de visa'
  | 'Reçue et visée';

export type StatutPrevisionnel =
  | 'prevu_decembre'
  | 'confirme_debut_mois'
  | 'annule'
  | 'non_planifie';

export interface AvisAvis {
  decision: 'Favorable' | 'Défavorable';
  date: string;
  signataire: string;
  remarque?: string;
}

export interface VisaRH {
  decision: 'Visé' | 'Refusé';
  date: string;
  reference?: string;
  remarque?: string;
}

export interface DemandeConge {
  id: string;
  nurseId: string;
  typeConge: TypeConge;
  dateDemande: string;
  dateCessation: string;
  dateReprisePrevue: string;
  dateRepriseEffective?: string;
  nombreJours: number;
  etatDemande: EtatDemande;
  decisionRecue?: DecisionRecue;
  estMaladieDirecte?: boolean; // Direct registration for sick leave without waiting for prior approval
  certificatMedicalNumero?: string;
  medecinTraitant?: string;
  motifExceptionnel?: string;
  statutPrevisionnel?: StatutPrevisionnel;
  moisPrevu?: string; // YYYY-MM
  avisInfirmierChef?: AvisAvis;
  visaRH?: VisaRH;
  cessationSignee?: boolean;
  dateCessationSignee?: string;
  repriseSignee?: boolean;
  dateRepriseSignee?: string;
  decisionPdfName?: string;
  decisionPdfDate?: string;
  notes?: string;
}

export interface PlanningArchive {
  id: string;
  titre: string;
  mois: string; // YYYY-MM
  typePlanning: 'Garde' | 'Normal' | "Astreinte" | 'Global';
  dateCreation: string;
  creePar: string;
  derniereModification: string;
  description?: string;
  rectifications: Array<{
    id: string;
    date: string;
    auteur: string;
    motif: string;
    details: string;
  }>;
  items: Array<{
    date: string;
    shift: string;
    personnelIds: string[];
    remarques?: string;
  }>;
}

export interface AppUser {
  email: string;
  name: string;
  role: 'head_nurse' | 'hr_officer' | 'nursing_staff';
  nurseId?: string;
  avatarUrl?: string;
}

export interface DatabaseState {
  version: string;
  exportedAt: string;
  service: string;
  nurses: Nurse[];
  demandes: DemandeConge[];
  plannings?: PlanningArchive[];
}
