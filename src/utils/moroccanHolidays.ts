export interface MoroccanHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'national' | 'religious';
}

/**
 * Official Moroccan Public Holidays (Jours fériés officiels au Maroc)
 * Covering 2025, 2026, and 2027.
 */
export const MOROCCAN_HOLIDAYS: MoroccanHoliday[] = [
  // 2026
  { date: '2026-01-01', name: "Nouvel An", type: 'national' },
  { date: '2026-01-11', name: "Manifeste de l'Indépendance", type: 'national' },
  { date: '2026-01-14', name: "Nouvel An Amazigh (Yennayer)", type: 'national' },
  { date: '2026-03-20', name: "Aïd El Fitr (1er jour)", type: 'religious' },
  { date: '2026-03-21', name: "Aïd El Fitr (2ème jour)", type: 'religious' },
  { date: '2026-05-01', name: "Fête du Travail", type: 'national' },
  { date: '2026-05-27', name: "Aïd Al Adha (1er jour)", type: 'religious' },
  { date: '2026-05-28', name: "Aïd Al Adha (2ème jour)", type: 'religious' },
  { date: '2026-06-17', name: "1er Moharram (Nouvel An de l'Hégire)", type: 'religious' },
  { date: '2026-07-30', name: "Fête du Trône", type: 'national' },
  { date: '2026-08-14', name: "Récupération d'Oued Ed-Dahab", type: 'national' },
  { date: '2026-08-20', name: "Révolution du Roi et du Peuple", type: 'national' },
  { date: '2026-08-21', name: "Fête de la Jeunesse", type: 'national' },
  { date: '2026-08-26', name: "Aïd Al Mawlid Annabawi (1er jour)", type: 'religious' },
  { date: '2026-08-27', name: "Aïd Al Mawlid Annabawi (2ème jour)", type: 'religious' },
  { date: '2026-11-06', name: "Anniversaire de la Marche Verte", type: 'national' },
  { date: '2026-11-18', name: "Fête de l'Indépendance", type: 'national' },

  // 2027
  { date: '2027-01-01', name: "Nouvel An", type: 'national' },
  { date: '2027-01-11', name: "Manifeste de l'Indépendance", type: 'national' },
  { date: '2027-01-14', name: "Nouvel An Amazigh", type: 'national' },
  { date: '2027-03-10', name: "Aïd El Fitr (1er jour)", type: 'religious' },
  { date: '2027-03-11', name: "Aïd El Fitr (2ème jour)", type: 'religious' },
  { date: '2027-05-01', name: "Fête du Travail", type: 'national' },
  { date: '2027-05-17', name: "Aïd Al Adha", type: 'religious' },
  { date: '2027-07-30', name: "Fête du Trône", type: 'national' },
  { date: '2027-08-14', name: "Allégeance Oued Ed-Dahab", type: 'national' },
  { date: '2027-08-20', name: "Révolution du Roi et du Peuple", type: 'national' },
  { date: '2027-08-21', name: "Fête de la Jeunesse", type: 'national' },
  { date: '2027-11-06', name: "Marche Verte", type: 'national' },
  { date: '2027-11-18', name: "Fête de l'Indépendance", type: 'national' },
];

export function isMoroccanHoliday(dateStr: string): MoroccanHoliday | undefined {
  return MOROCCAN_HOLIDAYS.find((h) => h.date === dateStr);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Calculates the number of days between cessation and resumption according to Moroccan Civil Service regulations.
 * - Administrative and Exceptional leaves exclude weekends and Moroccan official holidays.
 * - Sick and Maternity leaves count continuous calendar days.
 */
export function calculateStatutoryDays(
  startDateStr: string,
  endDateStr: string,
  typeConge: 'Congé Administratif' | 'Congé Maladie' | 'Congé Maternité' | 'Congé Exceptionnel'
): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 0;
  }

  // Sick and Maternity: continuous calendar days inclusive
  if (typeConge === 'Congé Maladie' || typeConge === 'Congé Maternité') {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // Administrative and Exceptional: exclude weekends (Saturday, Sunday) and official Moroccan holidays
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const isoDate = cur.toISOString().split('T')[0];
    if (!isWeekend(cur) && !isMoroccanHoliday(isoDate)) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return count;
}

/**
 * Given a start date and a requested number of working days, computes the projected resumption date.
 */
export function computeProjectedEndDate(
  startDateStr: string,
  workingDays: number,
  typeConge: 'Congé Administratif' | 'Congé Maladie' | 'Congé Maternité' | 'Congé Exceptionnel'
): string {
  if (!startDateStr || workingDays <= 0) return startDateStr;
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return startDateStr;

  if (typeConge === 'Congé Maladie' || typeConge === 'Congé Maternité') {
    const end = new Date(start);
    end.setDate(end.getDate() + workingDays - 1);
    return end.toISOString().split('T')[0];
  }

  let daysAdded = 0;
  const cur = new Date(start);

  while (daysAdded < workingDays) {
    const isoDate = cur.toISOString().split('T')[0];
    if (!isWeekend(cur) && !isMoroccanHoliday(isoDate)) {
      daysAdded++;
      if (daysAdded === workingDays) {
        return isoDate;
      }
    }
    cur.setDate(cur.getDate() + 1);
  }

  return cur.toISOString().split('T')[0];
}
