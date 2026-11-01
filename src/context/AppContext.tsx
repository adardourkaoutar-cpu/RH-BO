import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Nurse,
  DemandeConge,
  PlanningArchive,
  DatabaseState,
  AppUser,
  MotifSuppression,
  TypeConge,
  StatutPrevisionnel,
} from '../types';
import { INITIAL_DATABASE } from '../data/initialData';
import { calculateStatutoryDays, computeProjectedEndDate } from '../utils/moroccanHolidays';

const STORAGE_KEY = 'BLOC_RH_CHP_IFNI_DATABASE_V1';
const USER_KEY = 'BLOC_RH_CHP_IFNI_ACTIVE_USER';

interface AppContextType {
  database: DatabaseState;
  nurses: Nurse[];
  activeNurses: Nurse[];
  archivedNurses: Nurse[];
  demandes: DemandeConge[];
  plannings: PlanningArchive[];
  currentUser: AppUser;
  lastSyncTime: Date;
  isOnline: boolean;
  syncChannelActive: boolean;

  // Auth / Role
  setCurrentUser: (user: AppUser) => void;
  loginWithGoogle: (email?: string, name?: string, role?: AppUser['role'], nurseId?: string) => void;
  logout: () => void;

  // Personnel CRUD
  addNurse: (nurse: Omit<Nurse, 'id' | 'congeAdmin' | 'congeMaladie'> & Partial<Pick<Nurse, 'congeAdmin' | 'congeMaladie'>>) => Nurse;
  updateNurse: (id: string, updates: Partial<Nurse>) => void;
  deleteNurse: (id: string, reason: MotifSuppression, notes?: string) => void;
  restoreNurse: (id: string) => void;

  // Leave Management CRUD & Actions
  addDemande: (demande: {
    nurseId: string;
    typeConge: TypeConge;
    dateCessation: string;
    dateReprisePrevue: string;
    nombreJours?: number;
    motifExceptionnel?: string;
    estMaladieDirecte?: boolean;
    certificatMedicalNumero?: string;
    medecinTraitant?: string;
    statutPrevisionnel?: StatutPrevisionnel;
    moisPrevu?: string;
    notes?: string;
  }) => DemandeConge;
  updateDemande: (id: string, updates: Partial<DemandeConge>) => void;
  deleteDemande: (id: string) => void;
  giveHeadNurseOpinion: (id: string, decision: 'Favorable' | 'Défavorable', remarque?: string) => void;
  giveVisaRH: (id: string, decision: 'Visé' | 'Refusé', reference?: string, remarque?: string) => void;
  recordEarlyResumption: (id: string, effectiveReturnDate: string) => void;
  signCessation: (id: string) => void;
  signReprise: (id: string) => void;
  uploadDecisionPdf: (id: string, fileName: string) => void;
  confirmMonthlyPlanning: (id: string, action: 'confirme_debut_mois' | 'annule') => void;

  // Archive & Planning
  addPlanning: (planning: Omit<PlanningArchive, 'id' | 'dateCreation' | 'derniereModification' | 'rectifications'>) => PlanningArchive;
  rectifyPlanning: (id: string, motif: string, details: string) => void;

  // Database Backup / Restore / Reset
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => { success: boolean; error?: string };
  resetDatabaseToDefault: () => void;
  manualSyncTrigger: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_USER: AppUser = {
  email: 'adardourkaoutar@gmail.com',
  name: 'Kaoutar ADARDOUR',
  role: 'head_nurse',
  nurseId: 'nurse-1792857754910', // Kaoutar ADARDOUR
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<DatabaseState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.nurses) && parsed.nurses.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading local storage database', e);
    }
    return INITIAL_DATABASE;
  });

  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_USER;
  });

  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncChannelActive, setSyncChannelActive] = useState<boolean>(true);

  // Save database to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [database]);

  // Save active user
  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  }, [currentUser]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Multi-terminal BroadcastChannel sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('bloc_rh_terminal_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'DATABASE_UPDATED' && event.data.payload) {
          setDatabase(event.data.payload);
          setLastSyncTime(new Date());
        }
      };
      setSyncChannelActive(true);
    } catch {
      setSyncChannelActive(false);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setDatabase(JSON.parse(e.newValue));
          setLastSyncTime(new Date());
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const broadcastChange = useCallback((newState: DatabaseState) => {
    try {
      const channel = new BroadcastChannel('bloc_rh_terminal_sync');
      channel.postMessage({ type: 'DATABASE_UPDATED', payload: newState });
      channel.close();
    } catch {
      // broadcast channel not supported
    }
  }, []);

  // Sync trigger
  const manualSyncTrigger = useCallback(() => {
    setLastSyncTime(new Date());
    broadcastChange(database);
  }, [database, broadcastChange]);

  // Auth functions
  const loginWithGoogle = useCallback((
    email = 'adardourkaoutar@gmail.com',
    name = 'Kaoutar ADARDOUR',
    role: AppUser['role'] = 'head_nurse',
    nurseId = 'nurse-1792857754910'
  ) => {
    const user: AppUser = { email, name, role, nurseId };
    setCurrentUser(user);
    manualSyncTrigger();
  }, [manualSyncTrigger]);

  const logout = useCallback(() => {
    // switch to nursing staff viewer
    const guest: AppUser = {
      email: 'invite@chpsidiifni.ma',
      name: 'Agent de service (Consultation)',
      role: 'nursing_staff',
    };
    setCurrentUser(guest);
  }, []);

  // Personnel CRUD
  const activeNurses = useMemo(() => {
    return database.nurses.filter((n) => !n.archived);
  }, [database.nurses]);

  const archivedNurses = useMemo(() => {
    return database.nurses.filter((n) => n.archived);
  }, [database.nurses]);

  const addNurse = useCallback((nurseData: Omit<Nurse, 'id' | 'congeAdmin' | 'congeMaladie'> & Partial<Pick<Nurse, 'congeAdmin' | 'congeMaladie'>>) => {
    const newId = `nurse-${Date.now()}`;
    const newNurse: Nurse = {
      ...nurseData,
      id: newId,
      congeAdmin: nurseData.congeAdmin || {
        limiteAnnuelle: 22,
        joursReportes: 0,
        joursConsommes: 0,
      },
      congeMaladie: nurseData.congeMaladie || {
        limiteAnnuelleMois: 3,
        joursConsommes: 0,
      },
      congeExceptionnel: {
        limiteAnnuelle: 10,
        joursConsommes: 0,
      },
    };

    setDatabase((prev) => {
      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: [newNurse, ...prev.nurses],
      };
      broadcastChange(next);
      return next;
    });

    return newNurse;
  }, [broadcastChange]);

  const updateNurse = useCallback((id: string, updates: Partial<Nurse>) => {
    setDatabase((prev) => {
      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: prev.nurses.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  const deleteNurse = useCallback((id: string, reason: MotifSuppression, notes?: string) => {
    // Mandatory administrative archive/suppression
    setDatabase((prev) => {
      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: prev.nurses.map((n) => {
          if (n.id === id) {
            return {
              ...n,
              archived: true,
              archiveReason: reason,
              archiveDate: new Date().toISOString().split('T')[0],
              archiveNotes: notes,
            };
          }
          return n;
        }),
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  const restoreNurse = useCallback((id: string) => {
    setDatabase((prev) => {
      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: prev.nurses.map((n) => (n.id === id ? { ...n, archived: false, archiveReason: undefined } : n)),
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  // Leave Management
  const addDemande = useCallback((data: {
    nurseId: string;
    typeConge: TypeConge;
    dateCessation: string;
    dateReprisePrevue: string;
    nombreJours?: number;
    motifExceptionnel?: string;
    estMaladieDirecte?: boolean;
    certificatMedicalNumero?: string;
    medecinTraitant?: string;
    statutPrevisionnel?: StatutPrevisionnel;
    moisPrevu?: string;
    notes?: string;
  }) => {
    const computedDays = data.nombreJours ?? calculateStatutoryDays(data.dateCessation, data.dateReprisePrevue, data.typeConge);

    // Special rule for Sick Leave: Immediate registration without waiting for Head Nurse or HR visa!
    const isDirectSickLeave = data.typeConge === 'Congé Maladie' || !!data.estMaladieDirecte;

    const newDemande: DemandeConge = {
      id: `dem-${Date.now()}`,
      nurseId: data.nurseId,
      typeConge: data.typeConge,
      dateDemande: new Date().toISOString().split('T')[0],
      dateCessation: data.dateCessation,
      dateReprisePrevue: data.dateReprisePrevue,
      nombreJours: computedDays,
      etatDemande: isDirectSickLeave ? 'Confirmé' : 'Demandé',
      decisionRecue: isDirectSickLeave ? 'Reçue et visée' : 'Non reçue',
      estMaladieDirecte: isDirectSickLeave,
      certificatMedicalNumero: data.certificatMedicalNumero,
      medecinTraitant: data.medecinTraitant,
      motifExceptionnel: data.motifExceptionnel,
      statutPrevisionnel: data.statutPrevisionnel || 'non_planifie',
      moisPrevu: data.moisPrevu || data.dateCessation.substring(0, 7),
      cessationSignee: isDirectSickLeave,
      dateCessationSignee: isDirectSickLeave ? data.dateCessation : undefined,
      notes: data.notes,
    };

    setDatabase((prev) => {
      // Also update nurse consumed days if already confirmed
      const updatedNurses = prev.nurses.map((nurse) => {
        if (nurse.id === data.nurseId && isDirectSickLeave) {
          return {
            ...nurse,
            situationActuelle: 'Congé maladie' as const,
            congeMaladie: {
              ...nurse.congeMaladie,
              joursConsommes: (nurse.congeMaladie?.joursConsommes ?? 0) + computedDays,
            },
          };
        }
        return nurse;
      });

      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: updatedNurses,
        demandes: [newDemande, ...prev.demandes],
      };
      broadcastChange(next);
      return next;
    });

    return newDemande;
  }, [broadcastChange]);

  const updateDemande = useCallback((id: string, updates: Partial<DemandeConge>) => {
    setDatabase((prev) => {
      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        demandes: prev.demandes.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  const deleteDemande = useCallback((id: string) => {
    setDatabase((prev) => {
      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        demandes: prev.demandes.filter((d) => d.id !== id),
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  // Step 1: Head Nurse opinion
  const giveHeadNurseOpinion = useCallback((id: string, decision: 'Favorable' | 'Défavorable', remarque?: string) => {
    setDatabase((prev) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const nextDemandes = prev.demandes.map((dem) => {
        if (dem.id === id) {
          const isRefused = decision === 'Défavorable';
          return {
            ...dem,
            etatDemande: isRefused ? ('Refusé' as const) : ('En attente' as const),
            avisInfirmierChef: {
              decision,
              date: todayStr,
              signataire: currentUser.name || 'Kaoutar ADARDOUR (Infirmier Chef)',
              remarque,
            },
            decisionRecue: isRefused ? ('Reçue et visée' as const) : ('En cours de visa' as const),
          };
        }
        return dem;
      });

      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        demandes: nextDemandes,
      };
      broadcastChange(next);
      return next;
    });
  }, [currentUser.name, broadcastChange]);

  // Step 2: HR Visa (Approves or rejects officially)
  const giveVisaRH = useCallback((id: string, decision: 'Visé' | 'Refusé', reference?: string, remarque?: string) => {
    setDatabase((prev) => {
      const todayStr = new Date().toISOString().split('T')[0];
      let affectedNurseId: string | undefined;
      let addedDays = 0;
      let typeConge: TypeConge = 'Congé Administratif';

      const nextDemandes = prev.demandes.map((dem) => {
        if (dem.id === id) {
          affectedNurseId = dem.nurseId;
          addedDays = dem.nombreJours;
          typeConge = dem.typeConge;
          const isApproved = decision === 'Visé';

          return {
            ...dem,
            etatDemande: isApproved ? ('Confirmé' as const) : ('Refusé' as const),
            visaRH: {
              decision,
              date: todayStr,
              reference: reference || `CHP-SI/RH/${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              remarque,
            },
            decisionRecue: isApproved ? ('Reçue et visée' as const) : ('Reçue et visée' as const),
          };
        }
        return dem;
      });

      // Update nurse counters if approved
      const nextNurses = prev.nurses.map((nurse) => {
        if (nurse.id === affectedNurseId && decision === 'Visé') {
          if (typeConge === 'Congé Administratif') {
            return {
              ...nurse,
              congeAdmin: {
                ...nurse.congeAdmin,
                joursConsommes: (nurse.congeAdmin?.joursConsommes ?? 0) + addedDays,
              },
            };
          } else if (typeConge === 'Congé Exceptionnel') {
            return {
              ...nurse,
              congeExceptionnel: {
                limiteAnnuelle: 10,
                joursConsommes: ((nurse.congeExceptionnel?.joursConsommes ?? 0) + addedDays),
              },
            };
          }
        }
        return nurse;
      });

      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: nextNurses,
        demandes: nextDemandes,
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  // Early Resumption for Sick Leave or any leave
  const recordEarlyResumption = useCallback((id: string, effectiveReturnDate: string) => {
    setDatabase((prev) => {
      let targetNurseId: string | null = null;
      let diffDays = 0;

      const nextDemandes = prev.demandes.map((dem) => {
        if (dem.id === id) {
          targetNurseId = dem.nurseId;
          // Recalculate days based on actual effective return date
          const recalculatedDays = calculateStatutoryDays(dem.dateCessation, effectiveReturnDate, dem.typeConge);
          diffDays = recalculatedDays - dem.nombreJours;

          return {
            ...dem,
            dateRepriseEffective: effectiveReturnDate,
            nombreJours: recalculatedDays,
            repriseSignee: true,
            dateRepriseSignee: effectiveReturnDate,
          };
        }
        return dem;
      });

      const nextNurses = prev.nurses.map((nurse) => {
        if (nurse.id === targetNurseId) {
          // Reset situation to regular schedule if leave completed
          return {
            ...nurse,
            situationActuelle: 'Système normal' as const,
            congeMaladie: {
              ...nurse.congeMaladie,
              joursConsommes: Math.max(0, (nurse.congeMaladie?.joursConsommes ?? 0) + diffDays),
            },
          };
        }
        return nurse;
      });

      const next = {
        ...prev,
        exportedAt: new Date().toISOString(),
        nurses: nextNurses,
        demandes: nextDemandes,
      };
      broadcastChange(next);
      return next;
    });
  }, [broadcastChange]);

  // Operational Documents Signatures
  const signCessation = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateDemande(id, { cessationSignee: true, dateCessationSignee: today });
  }, [updateDemande]);

  const signReprise = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateDemande(id, { repriseSignee: true, dateRepriseSignee: today, dateRepriseEffective: today });
  }, [updateDemande]);

  const uploadDecisionPdf = useCallback((id: string, fileName: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateDemande(id, {
      decisionPdfName: fileName,
      decisionPdfDate: today,
      decisionRecue: 'Reçue et visée',
    });
  }, [updateDemande]);

  // Annual Planning December & Monthly Confirmation
  const confirmMonthlyPlanning = useCallback((id: string, action: 'confirme_debut_mois' | 'annule') => {
    updateDemande(id, {
      statutPrevisionnel: action,
      etatDemande: action === 'confirme_debut_mois' ? 'Confirmé' : 'Refusé',
    });
  }, [updateDemande]);

  // Planning / Archives CRUD
  const addPlanning = useCallback((data: Omit<PlanningArchive, 'id' | 'dateCreation' | 'derniereModification' | 'rectifications'>) => {
    const now = new Date().toISOString();
    const newPlan: PlanningArchive = {
      ...data,
      id: `plan-${Date.now()}`,
      dateCreation: now,
      derniereModification: now,
      rectifications: [],
    };

    setDatabase((prev) => {
      const currentPlannings = prev.plannings || [];
      const next = {
        ...prev,
        exportedAt: now,
        plannings: [newPlan, ...currentPlannings],
      };
      broadcastChange(next);
      return next;
    });

    return newPlan;
  }, [broadcastChange]);

  const rectifyPlanning = useCallback((id: string, motif: string, details: string) => {
    const now = new Date().toISOString();
    setDatabase((prev) => {
      const plannings = (prev.plannings || []).map((p) => {
        if (p.id === id) {
          const newRect = {
            id: `rect-${Date.now()}`,
            date: now,
            auteur: currentUser.name,
            motif,
            details,
          };
          return {
            ...p,
            derniereModification: now,
            rectifications: [newRect, ...p.rectifications],
          };
        }
        return p;
      });

      const next = {
        ...prev,
        exportedAt: now,
        plannings,
      };
      broadcastChange(next);
      return next;
    });
  }, [currentUser.name, broadcastChange]);

  // Database Backup / Restore / Reset
  const exportDatabaseJSON = useCallback(() => {
    const fullState: DatabaseState = {
      ...database,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(fullState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `Base_Donnees_BlocRH_CHP_Sidi_Ifni_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [database]);

  const importDatabaseJSON = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.nurses)) {
        return { success: false, error: "Le fichier JSON doit contenir une liste valide d'infirmiers ('nurses')." };
      }

      const importedState: DatabaseState = {
        version: parsed.version || '1.0',
        exportedAt: new Date().toISOString(),
        service: parsed.service || 'Bloc Opératoire Central - CHP Sidi Ifni',
        nurses: parsed.nurses,
        demandes: Array.isArray(parsed.demandes) ? parsed.demandes : [],
        plannings: Array.isArray(parsed.plannings) ? parsed.plannings : INITIAL_ARCHIVES,
      };

      setDatabase(importedState);
      broadcastChange(importedState);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: `Erreur de lecture du fichier JSON: ${err.message}` };
    }
  }, [broadcastChange]);

  const resetDatabaseToDefault = useCallback(() => {
    setDatabase(INITIAL_DATABASE);
    broadcastChange(INITIAL_DATABASE);
  }, [broadcastChange]);

  return (
    <AppContext.Provider
      value={{
        database,
        nurses: database.nurses,
        activeNurses,
        archivedNurses,
        demandes: database.demandes,
        plannings: database.plannings || INITIAL_ARCHIVES,
        currentUser,
        lastSyncTime,
        isOnline,
        syncChannelActive,
        setCurrentUser,
        loginWithGoogle,
        logout,
        addNurse,
        updateNurse,
        deleteNurse,
        restoreNurse,
        addDemande,
        updateDemande,
        deleteDemande,
        giveHeadNurseOpinion,
        giveVisaRH,
        recordEarlyResumption,
        signCessation,
        signReprise,
        uploadDecisionPdf,
        confirmMonthlyPlanning,
        addPlanning,
        rectifyPlanning,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetDatabaseToDefault,
        manualSyncTrigger,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
