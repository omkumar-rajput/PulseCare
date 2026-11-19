import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ShieldAlert, Lock, ArrowLeft, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface AccessDeniedGateProps {
  requiredRoleName: string;
  allowedRoles: UserRole[];
  onOpenRoleModal: () => void;
}

export const AccessDeniedGate: React.FC<AccessDeniedGateProps> = ({
  requiredRoleName,
  allowedRoles,
  onOpenRoleModal,
}) => {
  const { currentRole, currentUser, setActiveTab } = useHospital();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5 dark:bg-rose-950/40 dark:text-rose-400">
        <Lock className="h-10 w-10" />
      </div>

      <div className="mt-5 max-w-md">
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 dark:bg-rose-950 dark:text-rose-300">
          HIPAA & RBAC Privacy Enforcement (403 Forbidden)
        </span>

        <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          Access Restricted: {requiredRoleName}
        </h2>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          You are currently signed in as <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> with the persona role <strong className="capitalize text-teal-600">{currentRole}</strong>.
          Under hospital security protocols, this clinical module requires one of the following permissions: <span className="font-semibold text-slate-800 dark:text-slate-200">{allowedRoles.join(', ')}</span>.
        </p>

        {currentRole === 'patient' && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300 text-left">
            🛡️ <strong>Patient Privacy Safeguard:</strong> Patients are strictly segregated from administrative clinical modifications, prescription writing, hospital billing databases, and crash protocol controls.
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab(currentRole === 'patient' ? 'patient-portal' : 'dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to My Authorized Portal</span>
          </button>

          <button
            onClick={onOpenRoleModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 active:scale-95 transition-all"
          >
            <UserCheck className="h-4 w-4" />
            <span>Switch Role / Authorize Staff</span>
          </button>
        </div>
      </div>
    </div>
  );
};
