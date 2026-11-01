import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAge,
  calculateSeniority,
  calculateRemainingAdminDays,
  calculateRemainingSickDays,
  isLeaveActiveToday
} from './leaveCalculations';
import {
  calculateStatutoryDays,
  computeProjectedEndDate,
  isMoroccanHoliday
} from './moroccanHolidays';
import { Nurse, DemandeConge } from '../types';

test('calculateStatutoryDays: excludes weekends and Moroccan holidays for administrative leave', () => {
  // 2026-11-02 (Monday) to 2026-11-09 (Monday):
  // Days: Mon 2, Tue 3, Wed 4, Thu 5, Fri 6 (Marche Verte holiday!), Sat 7 (weekend), Sun 8 (weekend), Mon 9
  // Working days = 2, 3, 4, 5, 9 = 5 days (Nov 6 is Marche Verte, Nov 7-8 is weekend)
  const days = calculateStatutoryDays('2026-11-02', '2026-11-09', 'Congé Administratif');
  assert.equal(days, 5);
});

test('calculateStatutoryDays: counts continuous calendar days for sick leave', () => {
  // From 2026-11-02 to 2026-11-09: 8 calendar days total
  const days = calculateStatutoryDays('2026-11-02', '2026-11-09', 'Congé Maladie');
  assert.equal(days, 8);
});

test('isMoroccanHoliday: recognizes Marche Verte and Fête de l\'Indépendance', () => {
  const marcheVerte = isMoroccanHoliday('2026-11-06');
  assert.ok(marcheVerte);
  assert.equal(marcheVerte?.name, 'Anniversaire de la Marche Verte');

  const feteIndep = isMoroccanHoliday('2026-11-18');
  assert.ok(feteIndep);
  assert.equal(feteIndep?.name, "Fête de l'Indépendance");

  const normalDay = isMoroccanHoliday('2026-11-03');
  assert.equal(normalDay, undefined);
});

test('computeProjectedEndDate: calculates accurate resumption date skipping weekends and holidays', () => {
  // Start Monday 2026-11-02 for 5 working days:
  // Day 1: Nov 2 (Mon)
  // Day 2: Nov 3 (Tue)
  // Day 3: Nov 4 (Wed)
  // Day 4: Nov 5 (Thu)
  // Nov 6: Holiday (Marche Verte) -> skipped
  // Nov 7, 8: Weekend -> skipped
  // Day 5: Nov 9 (Mon)
  const endDate = computeProjectedEndDate('2026-11-02', 5, 'Congé Administratif');
  assert.equal(endDate, '2026-11-09');
});

test('calculateRemainingAdminDays: respects carried over and consumed days', () => {
  const dummyNurse = {
    congeAdmin: {
      limiteAnnuelle: 22,
      joursReportes: 4,
      joursConsommes: 6,
    }
  } as Nurse;

  const remaining = calculateRemainingAdminDays(dummyNurse);
  assert.equal(remaining, 20); // 22 + 4 - 6 = 20
});

test('calculateRemainingSickDays: calculates remaining days out of 90 days (3 months)', () => {
  const dummyNurse = {
    congeMaladie: {
      limiteAnnuelleMois: 3,
      joursConsommes: 15,
    }
  } as Nurse;

  const remaining = calculateRemainingSickDays(dummyNurse);
  assert.equal(remaining, 75); // 90 - 15 = 75
});

test('isLeaveActiveToday: accurately identifies active leaves during period', () => {
  const demande: DemandeConge = {
    id: 'dem-test',
    nurseId: 'nurse-1',
    typeConge: 'Congé Administratif',
    dateDemande: '2026-10-25',
    dateCessation: '2026-11-01',
    dateReprisePrevue: '2026-11-10',
    nombreJours: 7,
    etatDemande: 'Confirmé',
  };

  assert.equal(isLeaveActiveToday(demande, '2026-11-05'), true);
  assert.equal(isLeaveActiveToday(demande, '2026-11-12'), false);
  assert.equal(isLeaveActiveToday(demande, '2026-10-28'), false);
});
