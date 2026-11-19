import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Stethoscope,
  Activity,
  Pill,
  FlaskConical,
  ClipboardList,
  User,
  Check,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';

export const RolePortalDashboard: React.FC = () => {
  const { currentRole, setCurrentRole, currentUser, addNotification, setActiveTab } = useHospital();

  const roleDefinitions: {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    permissions: string[];
    primaryDashboard: string;
  }[] = [
    {
      role: 'admin',
      title: 'Hospital Administrator (Super Admin)',
      description: 'Institutional oversight, bed allocation analytics, revenue billing, cryptographic audit logs, and crisis protocols.',
      icon: ShieldCheck,
      color: 'bg-slate-800 text-white dark:bg-slate-700',
      permissions: ['EHR Full Access', 'Staff Credentials Roster', 'Billing & Claims Write', 'Emergency Protocol Dispatch', 'Cryptographic Audit Trail'],
      primaryDashboard: 'dashboard',
    },
    {
      role: 'doctor',
      title: 'Attending Physician & Surgeon',
      icon: Stethoscope,
      description: 'Electronic prescribing with AI interaction warnings, inpatient rounds, diagnostic orders, and surgical notes.',
      color: 'bg-teal-600 text-white',
      permissions: ['Prescription Generation', 'AI CDSS Drug Safety', 'Lab Diagnostics Ordering', 'Inpatient EHR Clinical Notes', 'Telemedicine Suite'],
      primaryDashboard: 'core-prescription',
    },
    {
      role: 'nurse',
      title: 'Charge Nurse & Critical Care Unit',
      icon: Activity,
      description: 'Continuous vital signs recording, MEWS deterioration tracking, medication administration, and bed sanitization.',
      color: 'bg-emerald-600 text-white',
      permissions: ['Vitals Telemetry Logging', 'MEWS Sepsis Alert Scoring', 'Bed Ward State Control', 'Emergency Fast Intake Access'],
      primaryDashboard: 'adv-mews',
    },
    {
      role: 'pharmacist',
      title: 'Chief Clinical Pharmacist',
      icon: Pill,
      description: 'Medication formulary control, cold-chain blood storage, drug stock reorders, and prescription dispensing.',
      color: 'bg-blue-600 text-white',
      permissions: ['Pharmacy Stock Control', 'Medication Dispensation', 'Drug-Drug Conflict Checks', 'Formulary Batch Tracking'],
      primaryDashboard: 'core-pharmacy',
    },
    {
      role: 'lab_technician',
      title: 'Pathology & Diagnostic Specialist',
      icon: FlaskConical,
      description: 'Assay execution, abnormal panic value validation, radiology scans, and verified digital report transmission.',
      color: 'bg-purple-600 text-white',
      permissions: ['Specimen Collection', 'Assay Execution & Entry', 'Panic Value Clinical Escalation', 'Verified Report Signature'],
      primaryDashboard: 'core-lab',
    },
    {
      role: 'receptionist',
      title: 'Front Desk Admissions & Triage Clerk',
      icon: ClipboardList,
      description: 'UHID demographic registration, OPD doctor appointment booking, queue token issuance, and emergency check-in.',
      color: 'bg-amber-600 text-white',
      permissions: ['Patient Intake Registration', 'OPD Token Scheduling', 'Demographic Identity Records', 'Emergency Desk Rapid Intake'],
      primaryDashboard: 'core-appointments',
    },
    {
      role: 'patient',
      title: 'Patient Self-Service Health Portal',
      icon: User,
      description: 'Personal EHR history review, test report downloads, doctor appointment booking, and bill payments.',
      color: 'bg-rose-600 text-white',
      permissions: ['Personal Medical History', 'View Lab Reports', 'Book OPD Appointments', 'Pay Medical Bills Online'],
      primaryDashboard: 'patient-portal',
    },
  ];

  const handleSwitch = (role: UserRole, landingTab: string) => {
    setCurrentRole(role);
    setActiveTab(landingTab);
    addNotification('info', 'Active Persona Switched', `Logged in as ${role.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Architecture</h1>
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
            Core Feature #9
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Strict HIPAA-compliant principle of least privilege (PoLP) enforcing separate operational views across 7 healthcare personas.
        </p>
      </div>

      {/* Active Role Notice */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900/50 dark:bg-teal-950/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
              <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                Active: {currentRole}
              </span>
            </div>
            <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5">{currentUser.department || 'General Staff'}</p>
          </div>
        </div>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roleDefinitions.map((item) => {
          const Icon = item.icon;
          const isCurrent = currentRole === item.role;

          return (
            <div
              key={item.role}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-sm ${
                isCurrent
                  ? 'border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/20 dark:bg-teal-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active Now
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>

                {/* Permissions checklist */}
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Granted Permissions</span>
                  <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                    {item.permissions.map((perm) => (
                      <li key={perm} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleSwitch(item.role, item.primaryDashboard)}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{isCurrent ? 'Viewing Persona Portal' : 'Switch to this Persona'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
