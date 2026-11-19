import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { PersonaManagementModal } from './components/common/PersonaManagementModal';
import { NotificationToast } from './components/common/NotificationToast';
import { AccessDeniedGate } from './components/common/AccessDeniedGate';
import { UserRole } from './types';

// Dashboards
import { OverviewDashboard } from './components/dashboards/OverviewDashboard';
import { AnalyticsDashboard } from './components/dashboards/AnalyticsDashboard';
import { PatientSelfServicePortal } from './components/dashboards/PatientSelfServicePortal';

// 10 Core Features
import { PatientRegistry } from './components/core/PatientRegistry';
import { DoctorDirectory } from './components/core/DoctorDirectory';
import { AppointmentScheduler } from './components/core/AppointmentScheduler';
import { BedWardManager } from './components/core/BedWardManager';
import { PharmacyInventory } from './components/core/PharmacyInventory';
import { LaboratoryHub } from './components/core/LaboratoryHub';
import { BillingInvoicePortal } from './components/core/BillingInvoicePortal';
import { EmergencyIntakeDesk } from './components/core/EmergencyIntakeDesk';
import { RolePortalDashboard } from './components/core/RolePortalDashboard';
import { DigitalPrescriptionPad } from './components/core/DigitalPrescriptionPad';

// 10 Cutting-Edge & Unique Features
import { CDSSDrugInteractionChecker } from './components/advanced/CDSSDrugInteractionChecker';
import { EarlyWarningScoreCalculator } from './components/advanced/EarlyWarningScoreCalculator';
import { SmartAITriageAssistant } from './components/advanced/SmartAITriageAssistant';
import { FloorPlanVisualizer } from './components/advanced/FloorPlanVisualizer';
import { BloodBankMatrix } from './components/advanced/BloodBankMatrix';
import { AmbientVoiceScribe } from './components/advanced/AmbientVoiceScribe';
import { CryptographicAuditLedger } from './components/advanced/CryptographicAuditLedger';
import { EmergencyCodeDispatcher } from './components/advanced/EmergencyCodeDispatcher';
import { OrganTransplantRegistry } from './components/advanced/OrganTransplantRegistry';
import { TelemedicineSuite } from './components/advanced/TelemedicineSuite';

const MainLayout: React.FC = () => {
  const { activeTab, currentRole } = useHospital();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  // Security Gate Rule Check
  const checkAccessPermission = (): { hasAccess: boolean; requiredTitle: string; allowed: UserRole[] } => {
    // 1. Patient Role Restrictions: Patients can only view their self-service portal & personal appointments
    if (currentRole === 'patient') {
      const patientAllowedTabs = ['patient-portal', 'core-appointments'];
      if (!patientAllowedTabs.includes(activeTab)) {
        return {
          hasAccess: false,
          requiredTitle: 'Clinical & Administrative Protected Area',
          allowed: ['admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'receptionist'],
        };
      }
    }

    // 2. Doctor Prescription & CDSS: restricted to Doctor & Admin
    if (activeTab === 'core-prescription' || activeTab === 'adv-cdss') {
      if (currentRole !== 'admin' && currentRole !== 'doctor') {
        return {
          hasAccess: false,
          requiredTitle: 'Licensed Prescribing Physician Authorization',
          allowed: ['doctor', 'admin'],
        };
      }
    }

    // 3. Cryptographic Audit Ledger: restricted to Admin & Compliance Officers
    if (activeTab === 'adv-audit') {
      if (currentRole !== 'admin') {
        return {
          hasAccess: false,
          requiredTitle: 'Chief Compliance & Information Security Officer (CISO)',
          allowed: ['admin'],
        };
      }
    }

    // 4. Emergency Code Blue Dispatch: restricted to clinical & administrative staff (not patient)
    if (activeTab === 'adv-code-dispatcher') {
      if (currentRole === 'patient') {
        return {
          hasAccess: false,
          requiredTitle: 'Hospital Resuscitation & Emergency Operations Command',
          allowed: ['admin', 'doctor', 'nurse'],
        };
      }
    }

    return { hasAccess: true, requiredTitle: '', allowed: [] };
  };

  const accessCheck = checkAccessPermission();

  const renderActiveView = () => {
    // Enforce Security Gate if unauthorized
    if (!accessCheck.hasAccess) {
      return (
        <AccessDeniedGate
          requiredRoleName={accessCheck.requiredTitle}
          allowedRoles={accessCheck.allowed}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
        />
      );
    }

    switch (activeTab) {
      // Dashboards
      case 'dashboard':
        return <OverviewDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'patient-portal':
        return <PatientSelfServicePortal />;

      // 10 Core Features
      case 'core-patients':
        return <PatientRegistry />;
      case 'core-doctors':
        return <DoctorDirectory />;
      case 'core-appointments':
        return <AppointmentScheduler />;
      case 'core-beds':
        return <BedWardManager />;
      case 'core-pharmacy':
        return <PharmacyInventory />;
      case 'core-lab':
        return <LaboratoryHub />;
      case 'core-billing':
        return <BillingInvoicePortal />;
      case 'core-emergency':
        return <EmergencyIntakeDesk />;
      case 'core-role-portal':
        return <RolePortalDashboard />;
      case 'core-prescription':
        return <DigitalPrescriptionPad />;

      // 10 Cutting-Edge Features
      case 'adv-cdss':
        return <CDSSDrugInteractionChecker />;
      case 'adv-mews':
        return <EarlyWarningScoreCalculator />;
      case 'adv-triage':
        return <SmartAITriageAssistant />;
      case 'adv-floorplan':
        return <FloorPlanVisualizer />;
      case 'adv-bloodbank':
        return <BloodBankMatrix />;
      case 'adv-scribe':
        return <AmbientVoiceScribe />;
      case 'adv-audit':
        return <CryptographicAuditLedger />;
      case 'adv-code-dispatcher':
        return <EmergencyCodeDispatcher />;
      case 'adv-organ-match':
        return <OrganTransplantRegistry />;
      case 'adv-telemedicine':
        return <TelemedicineSuite />;

      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      <Navbar
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      <PersonaManagementModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
      />

      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
