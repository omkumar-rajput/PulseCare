import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  Stethoscope,
  Activity,
  Pill,
  FlaskConical,
  ClipboardList,
  User,
  CheckCircle2,
  X
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setCurrentRole, addNotification, setActiveTab } = useHospital();

  if (!isOpen) return null;

  const roles: {
    role: UserRole;
    name: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    landingTab: string;
    color: string;
  }[] = [
    {
      role: 'admin',
      name: 'Arthur Vance, MHA',
      title: 'Hospital Administrator / Chief of Operations',
      icon: ShieldAlert,
      description: 'Full administrative authority: analytics, bed occupancy, billing audits, compliance & emergency protocols.',
      landingTab: 'dashboard',
      color: 'border-slate-500 bg-slate-500/10 text-slate-700 dark:text-slate-200',
    },
    {
      role: 'doctor',
      name: 'Dr. Sarah Lin, MD, FACC',
      title: 'Interventional Cardiologist',
      icon: Stethoscope,
      description: 'Prescription writing, AI CDSS interaction verification, lab ordering, and clinical decisioning.',
      landingTab: 'core-prescription',
      color: 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300',
    },
    {
      role: 'nurse',
      name: 'Nurse Clara Hughes, BSN, RN',
      title: 'Head Nurse - Intensive Care Unit',
      icon: Activity,
      description: 'MEWS deterioration monitoring, real-time vitals recording, bed status management, and patient care.',
      landingTab: 'adv-mews',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    {
      role: 'pharmacist',
      name: 'Robert Tanaka, PharmD',
      title: 'Chief Clinical Pharmacist',
      icon: Pill,
      description: 'Medication formulary control, drug interaction safety clearance, and prescription dispensing.',
      landingTab: 'core-pharmacy',
      color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    },
    {
      role: 'lab_technician',
      name: 'Chen Wei, MLS (ASCP)',
      title: 'Laboratory Diagnostic Specialist',
      icon: FlaskConical,
      description: 'Pathology & radiology test execution, abnormal panic value validation, and report uploading.',
      landingTab: 'core-lab',
      color: 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    },
    {
      role: 'receptionist',
      name: 'Jessica Gomez',
      title: 'Front Desk & Patient Admissions',
      icon: ClipboardList,
      description: 'UHID registration, appointment booking, OPD queue tokens, and initial insurance verification.',
      landingTab: 'core-appointments',
      color: 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    },
    {
      role: 'patient',
      name: 'Eleanor Harrison',
      title: 'Verified Patient Portal',
      icon: User,
      description: 'View health summary, lab reports, electronic prescriptions, bill payments, and book telemedicine.',
      landingTab: 'patient-portal',
      color: 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    },
  ];

  const handleSelectRole = (role: UserRole, landingTab: string) => {
    setCurrentRole(role);
    setActiveTab(landingTab);
    addNotification('info', 'Active Role Changed', `Switched active persona to ${role.toUpperCase()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Switcher</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any hospital persona to immediately test their customized view and access rights.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {roles.map((item) => {
            const Icon = item.icon;
            const isCurrent = currentRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => handleSelectRole(item.role, item.landingTab)}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-950/40 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`rounded-xl p-2 ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{item.title}</div>
                      </div>
                    </div>
                    {isCurrent && <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-700/60 text-[10px]">
                  <span className="font-mono text-slate-400">Persona: {item.role}</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">Launch Portal &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
