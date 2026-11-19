import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole, UserProfile } from '../../types';
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  X,
  Stethoscope,
  Activity,
  Pill,
  FlaskConical,
  ClipboardList,
  User,
  Lock
} from 'lucide-react';

interface PersonaManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonaManagementModal: React.FC<PersonaManagementModalProps> = ({ isOpen, onClose }) => {
  const { personas, addPersona, deletePersona, currentRole, setCurrentRole, currentUser, addNotification, setActiveTab } = useHospital();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersona, setNewPersona] = useState<{
    name: string;
    role: UserRole;
    title: string;
    email: string;
    department: string;
    avatar: string;
  }>({
    name: '',
    role: 'doctor',
    title: 'Consultant Physician',
    email: '',
    department: 'Cardiovascular Sciences',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
  });

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersona.name.trim()) return;

    await addPersona({
      name: newPersona.name,
      role: newPersona.role,
      title: newPersona.title,
      email: newPersona.email || `${newPersona.name.toLowerCase().replace(/\s+/g, '.')}@pulsecare.health`,
      department: newPersona.department,
      avatar: newPersona.avatar,
    });

    setShowAddForm(false);
    setNewPersona({
      name: '',
      role: 'doctor',
      title: 'Consultant Physician',
      email: '',
      department: 'Cardiovascular Sciences',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete persona "${name}"?`)) {
      await deletePersona(id);
    }
  };

  const handleSelectPersona = (p: UserProfile) => {
    setCurrentRole(p.role);
    if (p.role === 'patient') {
      setActiveTab('patient-portal');
    } else if (p.role === 'admin') {
      setActiveTab('dashboard');
    } else if (p.role === 'doctor') {
      setActiveTab('core-prescription');
    } else if (p.role === 'nurse') {
      setActiveTab('adv-mews');
    } else if (p.role === 'pharmacist') {
      setActiveTab('core-pharmacy');
    } else if (p.role === 'lab_technician') {
      setActiveTab('core-lab');
    } else if (p.role === 'receptionist') {
      setActiveTab('core-appointments');
    }
    addNotification('info', 'Switched Persona', `Active persona is now: ${p.name} (${p.role.toUpperCase()})`);
    onClose();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case 'doctor':
        return <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      case 'nurse':
        return <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'pharmacist':
        return <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'lab_technician':
        return <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'receptionist':
        return <ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'patient':
        return <User className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Persona & Staff Role Management</h3>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                {personas.length} Active Personas
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create, configure, switch, or remove hospital clinical personas. Data persists permanently across all sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>{showAddForm ? 'View All' : 'Add New Persona'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Add Persona Form */}
        {showAddForm ? (
          <form onSubmit={handleCreate} className="mt-5 space-y-4 rounded-2xl border border-teal-200 bg-teal-50/40 p-5 dark:border-teal-900/60 dark:bg-teal-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-900 dark:text-teal-300">
              <UserPlus className="h-4 w-4" />
              <span>Register New Hospital Staff / Persona</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPersona.name}
                  onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                  placeholder="e.g. Dr. Jordan Cole, MD"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">System Role</label>
                <select
                  value={newPersona.role}
                  onChange={(e) => setNewPersona({ ...newPersona, role: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="admin">Admin (Executive Operations)</option>
                  <option value="doctor">Doctor (Physician / Prescribing)</option>
                  <option value="nurse">Nurse (ICU & Wards)</option>
                  <option value="pharmacist">Pharmacist (Formulary)</option>
                  <option value="lab_technician">Lab Technician (Diagnostics)</option>
                  <option value="receptionist">Receptionist (Admissions)</option>
                  <option value="patient">Patient (Self-Service Portal)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Professional Title</label>
                <input
                  type="text"
                  required
                  value={newPersona.title}
                  onChange={(e) => setNewPersona({ ...newPersona, title: e.target.value })}
                  placeholder="e.g. Pediatric Neurosurgeon"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department</label>
                <input
                  type="text"
                  required
                  value={newPersona.department}
                  onChange={(e) => setNewPersona({ ...newPersona, department: e.target.value })}
                  placeholder="e.g. Neurocritical Care"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
              >
                Create & Save to Persistent Database
              </button>
            </div>
          </form>
        ) : null}

        {/* Personas List */}
        <div className="mt-5 space-y-3">
          {personas.map((p) => {
            const isCurrent = currentUser?.id === p.id || currentRole === p.role;
            const isRootAdmin = p.id === 'ADM-01';

            return (
              <div
                key={p.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/50 dark:border-teal-500/80 dark:bg-teal-950/30 ring-1 ring-teal-500/30'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</span>
                      <span className="flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase border border-slate-200 dark:border-slate-700">
                        {getRoleIcon(p.role)}
                        {p.role}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Active Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">{p.title}</div>
                    <div className="text-[11px] text-slate-400">{p.department} • {p.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectPersona(p)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isCurrent ? 'Active Persona' : 'Switch To This Role'}
                  </button>

                  {!isRootAdmin && (
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      title="Delete Persona"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
