import { Nurse, DemandeConge } from '../types';

/**
 * Calculates current age from date of birth (YYYY-MM-DD).
 */
export function calculateAge(dateNaissance: string): number {
  if (!dateNaissance) return 0;
  const dob = new Date(dateNaissance);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculates seniority in years and months from recruitment date (YYYY-MM-DD).
 */
export function calculateSeniority(dateRecrutement: string): { years: number; months: number } {
  if (!dateRecrutement) return { years: 0, months: 0 };
  const rec = new Date(dateRecrutement);
  const today = new Date();
  let years = today.getFullYear() - rec.getFullYear();
  let months = today.getMonth() - rec.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months) };
}

/**
 * Calculates remaining administrative leave days.
 * Statutory: 22 days per year + carried over days - consumed days.
 */
export function calculateRemainingAdminDays(nurse: Nurse): number {
  const limite = nurse.congeAdmin?.limiteAnnuelle ?? 22;
  const reportes = nurse.congeAdmin?.joursReportes ?? 0;
  const consommes = nurse.congeAdmin?.joursConsommes ?? 0;
  return Math.max(0, limite + reportes - consommes);
}

/**
 * Calculates remaining sick leave allowance in months/days (max 3 months / ~90 days).
 */
export function calculateRemainingSickDays(nurse: Nurse): number {
  const limiteMois = nurse.congeMaladie?.limiteAnnuelleMois ?? 3;
  const maxDays = limiteMois * 30; // 90 days
  const consommes = nurse.congeMaladie?.joursConsommes ?? 0;
  return Math.max(0, maxDays - consommes);
}

/**
 * Check if a date string is today or within the next N days.
 */
export function isWithinDays(dateStr: string, daysAhead: number): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysAhead;
}

/**
 * Check if a leave request is active right now.
 */
export function isLeaveActiveToday(demande: DemandeConge, todayStr = new Date().toISOString().split('T')[0]): boolean {
  if (demande.etatDemande !== 'Confirmé') return false;
  if (!demande.dateCessation) return false;

  const returnDate = demande.dateRepriseEffective || demande.dateReprisePrevue;
  return demande.dateCessation <= todayStr && todayStr <= returnDate;
}

/**
 * Check if nurse is currently active on leave.
 */
export function getActiveLeaveForNurse(nurseId: string, demandes: DemandeConge[]): DemandeConge | undefined {
  const todayStr = new Date().toISOString().split('T')[0];
  return demandes.find(d => d.nurseId === nurseId && isLeaveActiveToday(d, todayStr));
}
