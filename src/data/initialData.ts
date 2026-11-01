import { DatabaseState, PlanningArchive } from '../types';

export const INITIAL_ARCHIVES: PlanningArchive[] = [
  {
    id: 'plan-2026-10',
    titre: 'Planning Mensuel des Gardes & Astreintes - Octobre 2026',
    mois: '2026-10',
    typePlanning: 'Garde',
    dateCreation: '2026-09-28T09:00:00Z',
    creePar: 'Kaoutar ADARDOUR (Infirmier Chef)',
    derniereModification: '2026-10-15T14:30:00Z',
    description: 'Planning validé pour les équipes de garde 24h et astreintes chirurgicales et anesthésiques.',
    rectifications: [
      {
        id: 'rect-1',
        date: '2026-10-15T14:30:00Z',
        auteur: 'Kaoutar ADARDOUR',
        motif: 'Arrêt maladie soudain',
        details: 'Permutation de garde entre HSSAIN Mohammed et ZAGGOUDI Ahmed pour le 18 Octobre.'
      }
    ],
    items: [
      { date: '2026-10-01', shift: 'Garde 24H Bloc', personnelIds: ['nurse-1792859079909', 'nurse-1792857867180'] },
      { date: '2026-10-02', shift: 'Garde 24H Bloc', personnelIds: ['nurse-1792858993187', 'nurse-1792857457758'] },
      { date: '2026-10-03', shift: 'Astreinte Nuit', personnelIds: ['nurse-1792857053858'] }
    ]
  },
  {
    id: 'plan-2026-11',
    titre: 'Tableau de Service - Système Normal & Gardes - Novembre 2026',
    mois: '2026-11',
    typePlanning: 'Mixte',
    dateCreation: '2026-10-25T11:00:00Z',
    creePar: 'Kaoutar ADARDOUR (Infirmier Chef)',
    derniereModification: '2026-10-25T11:00:00Z',
    description: 'Horaires normaux 08h30-16h30 et rotation des gardes de nuit.',
    rectifications: [],
    items: [
      { date: '2026-11-01', shift: 'Garde Dimanche', personnelIds: ['nurse-1792858464768', 'nurse-1792856669415'] },
      { date: '2026-11-02', shift: 'Programme Normal 1', personnelIds: ['nurse-1792858902765', 'nurse-1792858692003'] }
    ]
  }
];

export const INITIAL_DATABASE: DatabaseState = {
  version: "1.0",
  exportedAt: "2026-10-27T10:17:33.685Z",
  service: "Bloc Opératoire Central - CHP Sidi Ifni",
  nurses: [
    {
      id: "nurse-1792859079909",
      nom: "ZAGGOUDI",
      prenom: "Ahmed",
      sexe: "Homme",
      ppr: "1834790",
      cni: "JA160404",
      specialite: "ISM",
      fonction: "Aide-opératoire",
      dateNaissance: "1993-01-29",
      lieuNaissance: "Errachidia",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2017-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792858993187",
      nom: "ENNAAMAOUI",
      prenom: "Hakim",
      sexe: "Homme",
      ppr: "2026370",
      cni: "JD67024",
      specialite: "ISM",
      fonction: "Aide-opératoire",
      dateNaissance: "1995-06-07",
      lieuNaissance: "Sidi Ifni",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2018-11-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792858902765",
      nom: "HSSAIN",
      prenom: "Mohammed",
      sexe: "Homme",
      ppr: "1764334",
      cni: "JE268703",
      specialite: "IP",
      fonction: "Stérilisation",
      dateNaissance: "1992-05-10",
      lieuNaissance: "Tiznit",
      etatMarital: "Divorcé(e)",
      nombreEnfants: 1,
      grade: "Infirmier Principal",
      dateRecrutement: "2015-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système normal"
    },
    {
      id: "nurse-1792858788529",
      nom: "ZOBI",
      prenom: "Maryem",
      sexe: "Femme",
      ppr: "1764322",
      cni: "JB462345",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "1999-06-01",
      lieuNaissance: "Tiznit",
      etatMarital: "Marié(e)",
      enceinte: false,
      dossierMedical: true,
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Tiznit",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 22
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système normal"
    },
    {
      id: "nurse-1792858692003",
      nom: "BAIROUK",
      prenom: "Abdellatif",
      sexe: "Homme",
      ppr: "1833487",
      cni: "JE270490",
      specialite: "IP",
      fonction: "Stérilisation",
      dateNaissance: "1992-04-13",
      lieuNaissance: "Ouijan, Aglou, Tiznit",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système normal"
    },
    {
      id: "nurse-1792858566937",
      nom: "BOUTRID",
      prenom: "Sara",
      sexe: "Femme",
      ppr: "2030472",
      cni: "JM57092",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "1996-12-14",
      lieuNaissance: "Khouribga",
      etatMarital: "Marié(e)",
      enceinte: true,
      dossierMedical: true,
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2018-11-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Congé administratif"
    },
    {
      id: "nurse-1792858464768",
      nom: "ER-RAYI",
      prenom: "Said",
      sexe: "Homme",
      ppr: "2253264",
      cni: "JE317605",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "2007-08-07",
      lieuNaissance: "Aglou, Tiznit",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2022-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792858320248",
      nom: "EL HACHEMY",
      prenom: "Hasnae",
      sexe: "Femme",
      ppr: "1833827",
      cni: "JE317605",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "1992-10-23",
      lieuNaissance: "Tiznit",
      etatMarital: "Marié(e)",
      enceinte: false,
      dossierMedical: false,
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Tiznit",
      navette: true,
      trajetNavette: "Tiznit",
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792858209995",
      nom: "TAMYM",
      prenom: "Sanae",
      sexe: "Femme",
      ppr: "2067872",
      cni: "JD75840",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "1998-01-02",
      lieuNaissance: "Sidi Ifni",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2022-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792858108813",
      nom: "BILALI",
      prenom: "Karima",
      sexe: "Femme",
      ppr: "1833845",
      cni: "JC496236",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "1993-01-06",
      lieuNaissance: "Ighrem, Taroudant",
      etatMarital: "Marié(e)",
      enceinte: true,
      dossierMedical: true,
      congeMaternite: {
        dateCessation: "2026-10-24",
        dateReprise: "2027-01-22",
        dureeJours: 90,
        actif: false
      },
      nombreEnfants: 2,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Mirleft",
      navette: true,
      trajetNavette: "Mirleft",
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792857992579",
      nom: "ZAKI",
      prenom: "Sanae",
      sexe: "Femme",
      ppr: "2171943",
      cni: "JC589466",
      specialite: "IP",
      fonction: "Aide-opératoire",
      dateNaissance: "1999-03-01",
      lieuNaissance: "Taroudant",
      etatMarital: "Marié(e)",
      enceinte: false,
      dossierMedical: false,
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2022-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792857867180",
      nom: "ATIQUE",
      prenom: "Zineb",
      sexe: "Femme",
      ppr: "2342195",
      cni: "JA195543",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "2003-06-14",
      lieuNaissance: "Rabat",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2026-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Guelmim",
      navette: true,
      trajetNavette: "Guelmim",
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792857754910",
      nom: "ADARDOUR",
      prenom: "Kaoutar",
      sexe: "Femme",
      ppr: "2029329",
      cni: "JD69641",
      specialite: "IAR",
      fonction: "Infirmier chef",
      dateNaissance: "1997-05-31",
      lieuNaissance: "Sidi Ifni",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier en Chef",
      dateRecrutement: "2018-11-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système normal"
    },
    {
      id: "nurse-1792857457758",
      nom: "LBREK",
      prenom: "Khadija",
      sexe: "Femme",
      ppr: "1765507",
      cni: "JK15696",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "1992-06-06",
      lieuNaissance: "Ouled Taima",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Agadir",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792857325571",
      nom: "ID LACHGUER",
      prenom: "Hafida",
      sexe: "Femme",
      ppr: "2424850",
      cni: "JE325456",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "2004-05-11",
      lieuNaissance: "Tiznit",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2026-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792857166676",
      nom: "MAJDI",
      prenom: "Maryem",
      sexe: "Femme",
      ppr: "1560415",
      cni: "JB343576",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "1986-09-22",
      lieuNaissance: "Massa",
      etatMarital: "Marié(e)",
      enceinte: false,
      dossierMedical: false,
      nombreEnfants: 2,
      grade: "Grade exceptionnel",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Tiznit",
      navette: true,
      trajetNavette: "Tiznit",
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792857053858",
      nom: "OUBAIROUK",
      prenom: "Lahoucine",
      sexe: "Homme",
      ppr: "1560414",
      cni: "JB357081",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "1982-07-12",
      lieuNaissance: "Massa",
      etatMarital: "Marié(e)",
      nombreEnfants: 2,
      grade: "Grade exceptionnel",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792856929467",
      nom: "BAHOU",
      prenom: "Zakaria",
      sexe: "Homme",
      ppr: "2342200",
      cni: "JB357081",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "2008-01-05",
      lieuNaissance: "Taghjijt",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2026-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Guelmim",
      navette: true,
      trajetNavette: "Guelmim",
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792856799444",
      nom: "AMALOUK",
      prenom: "Ikram",
      sexe: "Femme",
      ppr: "2342209",
      cni: "JA199287",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "2003-11-18",
      lieuNaissance: "Dakhla",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2026-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Guelmim",
      navette: true,
      trajetNavette: "Guelmim",
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Congé administratif"
    },
    {
      id: "nurse-1792856669415",
      nom: "CHAJEA",
      prenom: "Hicham",
      sexe: "Homme",
      ppr: "2342198",
      cni: "JD25754",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "2003-11-15",
      lieuNaissance: "Lakhsas",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2025-01-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792856530331",
      nom: "HAJJAMI",
      prenom: "Latifa",
      sexe: "Femme",
      ppr: "2029247",
      cni: "JD67856",
      specialite: "IAR",
      fonction: "Anesthésiste",
      dateNaissance: "1996-06-18",
      lieuNaissance: "Sidi Ifni",
      etatMarital: "Marié(e)",
      enceinte: false,
      dossierMedical: false,
      nombreEnfants: 1,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2018-11-01",
      etatFonctionPublique: "Fonctionnaire Titulaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    },
    {
      id: "nurse-1792856395521",
      nom: "R’HIMINE",
      prenom: "Amal",
      sexe: "Femme",
      ppr: "2424887",
      cni: "EC88792",
      specialite: "IBO",
      fonction: "Aide-opératoire",
      dateNaissance: "2004-06-06",
      lieuNaissance: "Sidi Bouzid Rgragui, Chichaoua",
      etatMarital: "Célibataire",
      nombreEnfants: 0,
      grade: "Infirmier 1er Grade",
      dateRecrutement: "2016-01-01",
      etatFonctionPublique: "Stagiaire",
      lieuResidence: "Sidi Ifni",
      navette: false,
      congeAdmin: {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0
      },
      congeMaladie: {
        limiteAnnuelleMois: 3,
        joursConsommes: 0
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0
      },
      situationActuelle: "Système de garde"
    }
  ],
  demandes: [
    {
      id: "dem-1792938747750",
      nurseId: "nurse-1792858788529", // ZOBI Maryem
      typeConge: "Congé Administratif",
      dateDemande: "2026-10-24",
      dateCessation: "2026-09-19",
      dateReprisePrevue: "2026-10-22",
      nombreJours: 24,
      etatDemande: "Confirmé",
      decisionRecue: "Reçue et visée",
      estMaladieDirecte: false,
      statutPrevisionnel: "confirme_debut_mois",
      moisPrevu: "2026-09",
      dateRepriseEffective: "2026-10-24",
      cessationSignee: true,
      dateCessationSignee: "2026-09-19",
      repriseSignee: true,
      dateRepriseSignee: "2026-10-24",
      decisionPdfName: "Decision_Conge_Admin_ZOBI_Maryem_2026_09.pdf",
      avisInfirmierChef: {
        decision: "Favorable",
        date: "2026-09-15",
        signataire: "Kaoutar ADARDOUR",
        remarque: "Effectif suffisant assuré au bloc."
      },
      visaRH: {
        decision: "Visé",
        date: "2026-09-18",
        reference: "CHP-SI/RH/2026-842"
      }
    },
    {
      id: "dem-1792882956719",
      nurseId: "nurse-1792856799444", // AMALOUK Ikram
      typeConge: "Congé Administratif",
      dateDemande: "2026-10-17",
      dateCessation: "2026-10-17",
      dateReprisePrevue: "2026-10-28",
      nombreJours: 8,
      etatDemande: "Confirmé",
      decisionRecue: "Reçue et visée",
      estMaladieDirecte: false,
      statutPrevisionnel: "confirme_debut_mois",
      moisPrevu: "2026-10",
      cessationSignee: true,
      dateCessationSignee: "2026-10-17",
      repriseSignee: true,
      dateRepriseSignee: "2026-10-28",
      decisionPdfName: "Decision_Conge_AMALOUK_Ikram_Oct2026.pdf"
    },
    {
      id: "dem-1792882754179",
      nurseId: "nurse-1792856799444", // AMALOUK Ikram
      typeConge: "Congé Administratif",
      dateDemande: "2026-10-17",
      dateCessation: "2026-10-16",
      dateReprisePrevue: "2026-11-30",
      nombreJours: 30,
      etatDemande: "Refusé",
      decisionRecue: "Reçue et visée",
      estMaladieDirecte: false,
      statutPrevisionnel: "annule",
      moisPrevu: "2026-10",
      avisInfirmierChef: {
        decision: "Défavorable",
        date: "2026-10-17",
        signataire: "Kaoutar ADARDOUR",
        remarque: "Nécessité de service - période d'interventions programmées majeures."
      }
    },
    {
      id: "dem-1792859170856",
      nurseId: "nurse-1792858566937", // BOUTRID Sara
      typeConge: "Congé Administratif",
      dateDemande: "2026-10-22",
      dateCessation: "2026-11-01",
      dateReprisePrevue: "2026-11-30",
      nombreJours: 20,
      etatDemande: "Confirmé",
      decisionRecue: "En cours de visa",
      cessationSignee: true,
      dateCessationSignee: "2026-11-01",
      statutPrevisionnel: "confirme_debut_mois",
      moisPrevu: "2026-11",
      avisInfirmierChef: {
        decision: "Favorable",
        date: "2026-10-23",
        signataire: "Kaoutar ADARDOUR",
        remarque: "Accordé sous réserve du visa délégation."
      }
    }
  ],
  plannings: INITIAL_ARCHIVES
};
