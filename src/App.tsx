import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PersonnelView } from './components/PersonnelView';
import { LeaveManagementView } from './components/LeaveManagementView';
import { CalendarPlanningView } from './components/CalendarPlanningView';
import { ArchiveView } from './components/ArchiveView';
import { AddEditNurseModal } from './components/AddEditNurseModal';
import { DeleteNurseModal } from './components/DeleteNurseModal';
import { NurseDetailModal } from './components/NurseDetailModal';
import { OfficialSlipModal } from './components/OfficialSlipModal';
import { DatabaseSyncModal } from './components/DatabaseSyncModal';
import { Nurse, DemandeConge, MotifSuppression } from './types';

const MainApp: React.FC = () => {
  const { addNurse, updateNurse, deleteNurse, nurses } = useApp();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nurseToDelete, setNurseToDelete] = useState<Nurse | null>(null);

  const [selectedNurseIdForDetail, setSelectedNurseIdForDetail] = useState<string | null>(null);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Official Slip state
  const [officialSlipState, setOfficialSlipState] = useState<{
    isOpen: boolean;
    slipType: 'cessation' | 'reprise';
    demande: DemandeConge | null;
    nurse: Nurse | null;
  }>({
    isOpen: false,
    slipType: 'cessation',
    demande: null,
    nurse: null,
  });

  // Shortcut for new leave type from dashboard
  const [defaultLeaveType, setDefaultLeaveType] = useState<string | null>(null);

  const handleOpenAddNurse = () => {
    setEditingNurse(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditNurse = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setIsAddEditModalOpen(true);
  };

  const handleSaveNurse = (nurseData: any) => {
    if (editingNurse) {
      updateNurse(editingNurse.id, nurseData);
    } else {
      addNurse(nurseData);
    }
  };

  const handleOpenDeleteNurse = (nurse: Nurse) => {
    setNurseToDelete(nurse);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (nurseId: string, reason: MotifSuppression, notes: string) => {
    deleteNurse(nurseId, reason, notes);
  };

  const handleOpenOfficialSlip = (
    slipType: 'cessation' | 'reprise',
    demande: DemandeConge,
    nurse: Nurse
  ) => {
    setOfficialSlipState({
      isOpen: true,
      slipType,
      demande,
      nurse,
    });
  };

  const handleOpenNewLeaveWithShortcut = (type?: string) => {
    setDefaultLeaveType(type || 'Congé Administratif');
    setActiveTab('conges');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenAddNurseModal={handleOpenAddNurse}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'database') {
            setIsSyncModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateToLeaves={() => setActiveTab('conges')}
            onNavigateToPersonnel={() => setActiveTab('personnel')}
            onOpenAddNurseModal={handleOpenAddNurse}
            onOpenNewLeaveModal={handleOpenNewLeaveWithShortcut}
            onSelectNurse={(id) => setSelectedNurseIdForDetail(id)}
          />
        )}

        {activeTab === 'personnel' && (
          <PersonnelView
            onOpenAddModal={handleOpenAddNurse}
            onSelectNurse={(id) => setSelectedNurseIdForDetail(id)}
            onEditNurse={handleOpenEditNurse}
            onDeleteNurse={handleOpenDeleteNurse}
          />
        )}

        {activeTab === 'conges' && (
          <LeaveManagementView
            onOpenOfficialSlip={handleOpenOfficialSlip}
            defaultNewLeaveType={defaultLeaveType}
            onClearDefaultType={() => setDefaultLeaveType(null)}
          />
        )}

        {activeTab === 'planning' && <CalendarPlanningView />}

        {activeTab === 'archives' && <ArchiveView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <b>Centre Hospitalier Provincial (CHP) de Sidi Ifni</b> — Bloc Opératoire Central
          </div>
          <div className="text-slate-400">
            Système RH Infirmiers • Version 1.0 • Conforme réglementation fonction publique marocaine
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddEditNurseModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveNurse}
        nurseToEdit={editingNurse}
      />

      <DeleteNurseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        nurse={nurseToDelete}
      />

      <NurseDetailModal
        isOpen={!!selectedNurseIdForDetail}
        nurseId={selectedNurseIdForDetail}
        onClose={() => setSelectedNurseIdForDetail(null)}
        onEdit={(nurse) => {
          setSelectedNurseIdForDetail(null);
          handleOpenEditNurse(nurse);
        }}
      />

      <OfficialSlipModal
        isOpen={officialSlipState.isOpen}
        slipType={officialSlipState.slipType}
        demande={officialSlipState.demande}
        nurse={officialSlipState.nurse}
        onClose={() => setOfficialSlipState((prev) => ({ ...prev, isOpen: false }))}
      />

      <DatabaseSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
