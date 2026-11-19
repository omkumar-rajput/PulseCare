import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyCase } from '../../types';
import {
  Ambulance,
  AlertOctagon,
  Clock,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';

export const EmergencyIntakeDesk: React.FC = () => {
  const { emergencyCases, doctors, setActiveTab } = useHospital();
  const [casesList, setCasesList] = useState<EmergencyCase[]>(emergencyCases);
  const [showRapidModal, setShowRapidModal] = useState(false);

  // Rapid Intake Form
  const [newCase, setNewCase] = useState({
    patientName: 'Unidentified Female #45',
    estimatedAge: 28,
    gender: 'Female' as const,
    arrivalMode: 'Ambulance' as const,
    triageSeverity: 'Red (Resuscitation)' as const,
    chiefComplaint: 'Severe multi-trauma, altered sensorium, BP 80/50 mmHg',
    assignedDoctorName: 'Dr. Marcus Vance',
    bayNumber: 'Trauma Bay 2',
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EmergencyCase = {
      id: `ER-${Date.now().toString().slice(-4)}`,
      code: `RED-TRAUMA-${Math.floor(10 + Math.random() * 90)}`,
      patientName: newCase.patientName,
      estimatedAge: newCase.estimatedAge,
      gender: newCase.gender,
      arrivalMode: newCase.arrivalMode,
      triageSeverity: newCase.triageSeverity,
      chiefComplaint: newCase.chiefComplaint,
      arrivalTimestamp: new Date().toISOString(),
      status: 'In Trauma Bay',
      assignedDoctorName: newCase.assignedDoctorName,
      bayNumber: newCase.bayNumber,
    };

    setCasesList((prev) => [created, ...prev]);
    setShowRapidModal(false);
  };

  const handleUpdateStatus = (caseId: string, newStatus: EmergencyCase['status']) => {
    setCasesList((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Emergency Department & Rapid Intake Desk</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #8
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Zero-delay emergency triage intake, ambulance bay docking, trauma resuscitation routing, and acute stabilization tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('adv-triage')}
            className="flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300"
          >
            <span>Launch AI Triage Assistant &rarr;</span>
          </button>
          <button
            onClick={() => setShowRapidModal(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Fast-Track ER Intake</span>
          </button>
        </div>
      </div>

      {/* Trauma Bay Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {casesList.map((c) => {
          const isRed = c.triageSeverity.includes('Red');
          const isOrange = c.triageSeverity.includes('Orange');

          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all ${
                isRed
                  ? 'border-red-300 bg-red-50/40 dark:border-red-900/60 dark:bg-red-950/20 ring-1 ring-red-500/30'
                  : 'border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{c.code}</span>
                    <span className="rounded bg-white/80 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {c.bayNumber}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-black text-slate-900 dark:text-white">{c.patientName}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Est. {c.estimatedAge} yrs • {c.gender} • Arrival Mode: <strong className="text-slate-700 dark:text-slate-300">{c.arrivalMode}</strong>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    isRed
                      ? 'bg-red-600 text-white animate-pulse shadow-sm shadow-red-500/50'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {c.triageSeverity}
                </span>
              </div>

              {/* Chief Complaint */}
              <div className="mt-3 rounded-xl bg-white/80 p-3 text-xs dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Chief Complaint & Vitals on Intake:</span>
                <p className="mt-0.5 text-slate-900 dark:text-white font-medium">{c.chiefComplaint}</p>
              </div>

              {/* Attending & Status */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-200/60 pt-3 dark:border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400">Attending Trauma Lead:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{c.assignedDoctorName}</div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => handleUpdateStatus(c.id, e.target.value as any)}
                    className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Triage Pending">Triage Pending</option>
                    <option value="In Trauma Bay">In Trauma Bay</option>
                    <option value="Transferred to OT">Transferred to OT</option>
                    <option value="Admitted to ICU">Admitted to ICU</option>
                    <option value="Stabilized">Stabilized</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Rapid Intake */}
      {showRapidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-white p-6 shadow-2xl dark:border-red-900/50 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency Fast-Track Intake</h3>
              <button onClick={() => setShowRapidModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Patient Identifier (or Trauma ID)</label>
                <input
                  type="text"
                  required
                  value={newCase.patientName}
                  onChange={(e) => setNewCase({ ...newCase, patientName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Est. Age</label>
                  <input
                    type="number"
                    value={newCase.estimatedAge}
                    onChange={(e) => setNewCase({ ...newCase, estimatedAge: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                  <select
                    value={newCase.gender}
                    onChange={(e) => setNewCase({ ...newCase, gender: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Arrival Mode</label>
                  <select
                    value={newCase.arrivalMode}
                    onChange={(e) => setNewCase({ ...newCase, arrivalMode: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Ambulance">Ambulance</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Air Ambulance">Air Ambulance</option>
                    <option value="Police Escort">Police Escort</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Triage Severity Rating</label>
                <select
                  value={newCase.triageSeverity}
                  onChange={(e) => setNewCase({ ...newCase, triageSeverity: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Red (Resuscitation)">🔴 Red (Resuscitation - Immediate)</option>
                  <option value="Orange (Emergent)">🟠 Orange (Emergent - 10 Mins)</option>
                  <option value="Yellow (Urgent)">🟡 Yellow (Urgent - 30 Mins)</option>
                  <option value="Green (Standard)">🟢 Green (Standard / Ambulatory)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chief Emergency Complaint</label>
                <textarea
                  rows={2}
                  required
                  value={newCase.chiefComplaint}
                  onChange={(e) => setNewCase({ ...newCase, chiefComplaint: e.target.value })}
                  placeholder="e.g. Unresponsive post high-speed MVC, severe open femur fracture, respiratory stridor..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRapidModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-red-700"
                >
                  Dock to Trauma Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
