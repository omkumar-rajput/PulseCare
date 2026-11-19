import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PrescriptionItem, Prescription } from '../../types';
import { checkPrescriptionConflicts } from '../../utils/cdssEngine';
import {
  FileSignature,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Printer,
  BrainCircuit,
  Pill,
  User,
  X
} from 'lucide-react';

export const DigitalPrescriptionPad: React.FC = () => {
  const { patients, doctors, medicines, createPrescription, prescriptions } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('Coronary Artery Disease with Post-PCI Angina');
  const [clinicalNotes, setClinicalNotes] = useState('Patient responding to cardiac rehabilitation. Continue dual antiplatelet and statin therapy.');
  const [followUpDate, setFollowUpDate] = useState('2026-12-05');

  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medicineId: 'MED-001',
      medicineName: 'Warfarin Sodium',
      dosage: '5 mg',
      frequency: '0-0-1',
      timing: 'Bedtime',
      durationDays: 30,
      instructions: 'Take with full glass of water. Strictly monitor weekly INR levels.',
    },
    {
      medicineId: 'MED-002',
      medicineName: 'Aspirin Cardio',
      dosage: '81 mg',
      frequency: '1-0-0',
      timing: 'After Meals',
      durationDays: 30,
      instructions: 'Enteric-coated; do not crush or chew.',
    }
  ]);

  const [overrideConflict, setOverrideConflict] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState<Prescription | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Run Real-Time CDSS Conflict Engine on the current items
  const currentMedNames = items.map((i) => i.medicineName);
  const conflictReport = checkPrescriptionConflicts(currentMedNames, [], selectedPatient);

  const handleAddItem = () => {
    const defaultMed = medicines[0];
    setItems((prev) => [
      ...prev,
      {
        medicineId: defaultMed.id,
        medicineName: defaultMed.name,
        dosage: defaultMed.strength,
        frequency: '1-0-1',
        timing: 'After Meals',
        durationDays: 7,
        instructions: 'Take as prescribed.',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === 'medicineName') {
        const found = medicines.find((m) => m.name === value);
        if (found) {
          updated[index] = {
            ...updated[index],
            medicineId: found.id,
            medicineName: found.name,
            dosage: found.strength,
          };
          return updated;
        }
      }
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmitPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (conflictReport.riskRating === 'Lethal Hazard' && !overrideConflict) {
      alert('WARNING: Severe Drug-Drug or Patient Allergy Conflict detected! You must check the clinical override box to proceed.');
      return;
    }

    createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      uhid: selectedPatient.uhid,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      diagnosis,
      clinicalNotes,
      items,
      followUpDate,
      digitalSignature: `SHA256:AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}-VERIFIED`,
    });

    // Reset items or show print
    setItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Digital Prescription Pad (E-Rx) & Clinical Order</h1>
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
            Core Feature #10
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Electronic prescription generation with automatic cross-checking against patient allergies and concurrent drug interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prescription Pad Form */}
        <div className="lg:col-span-8 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.uhid}) - Allergies: {p.allergies.join(', ') || 'None'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prescribing Attending</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clinical Diagnosis & Notes */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Working Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clinical Advice / Notes</label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Prescribed Medications Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Pill className="h-4 w-4 text-teal-600" />
                  Rx Medications List ({items.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Drug</span>
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-semibold text-slate-400">Drug Formulation</label>
                        <select
                          value={item.medicineName}
                          onChange={(e) => handleItemChange(idx, 'medicineName', e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          {medicines.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name} ({m.genericName} - {m.strength})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <label className="text-[10px] font-semibold text-slate-400">Dosage</label>
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="mt-3 p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Frequency</label>
                        <select
                          value={item.frequency}
                          onChange={(e) => handleItemChange(idx, 'frequency', e.target.value as any)}
                          className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="1-0-0">1-0-0 (Morning)</option>
                          <option value="1-0-1">1-0-1 (Morning & Night)</option>
                          <option value="1-1-1">1-1-1 (Thrice daily)</option>
                          <option value="0-0-1">0-0-1 (Night only)</option>
                          <option value="SOS (As Needed)">SOS (As Needed)</option>
                          <option value="STAT (Immediate)">STAT (Immediate)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Food Timing</label>
                        <select
                          value={item.timing}
                          onChange={(e) => handleItemChange(idx, 'timing', e.target.value as any)}
                          className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="Before Meals">Before Meals</option>
                          <option value="After Meals">After Meals</option>
                          <option value="With Food">With Food</option>
                          <option value="Bedtime">Bedtime</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Duration (Days)</label>
                        <input
                          type="number"
                          value={item.durationDays}
                          onChange={(e) => handleItemChange(idx, 'durationDays', parseInt(e.target.value) || 1)}
                          className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FileSignature className="h-4 w-4 text-teal-600" />
                <span>Signing as: <strong>{selectedDoctor.name}</strong></span>
              </div>

              <button
                onClick={handleSubmitPrescription}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 active:scale-95 transition-all"
              >
                <span>Authorize & Sign Prescription</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Integrated AI CDSS Safety Scanner & Patient Context */}
        <div className="lg:col-span-4 space-y-4">
          {/* Real-Time AI CDSS Conflict Guard */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">AI CDSS Safety Engine</h3>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  conflictReport.riskRating === 'Safe'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : conflictReport.riskRating === 'Lethal Hazard'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {conflictReport.riskRating}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {conflictReport.allergyConflicts.length > 0 && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs dark:border-rose-900 dark:bg-rose-950/40">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Fatal Allergy Warning!</span>
                  </div>
                  {conflictReport.allergyConflicts.map((ac, i) => (
                    <div key={i} className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">
                      <strong>{ac.drugName}</strong> matches patient allergy to <strong>{ac.allergenMatched}</strong>.
                      <p className="mt-0.5 opacity-90">{ac.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}

              {conflictReport.interactions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drug-Drug Interactions</span>
                  {conflictReport.interactions.map((ddi) => (
                    <div
                      key={ddi.id}
                      className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs dark:border-rose-900/40 dark:bg-rose-950/20"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-300">
                        <span>{ddi.drugA} + {ddi.drugB}</span>
                        <span className="rounded bg-rose-200 px-1 py-0.5 text-[9px] font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                          {ddi.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{ddi.clinicalEffect}</p>
                      <p className="mt-1 text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{ddi.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}

              {conflictReport.interactions.length === 0 && conflictReport.allergyConflicts.length === 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <span>No contraindications or pharmacological cross-reactions detected. Safe to authorize.</span>
                </div>
              )}

              {conflictReport.riskRating === 'Lethal Hazard' && (
                <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <input
                    type="checkbox"
                    id="override"
                    checked={overrideConflict}
                    onChange={(e) => setOverrideConflict(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="override" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Physician Clinical Override: I acknowledge the contraindication risk and have reviewed clinical necessity with patient.
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Patient Quick Medical Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient EHR Profile</span>
            <div className="mt-2 font-bold text-sm text-slate-900 dark:text-white">{selectedPatient.name}</div>
            <div className="text-[11px] text-teal-600 font-mono">{selectedPatient.uhid}</div>

            <div className="mt-3 space-y-1.5 text-slate-600 dark:text-slate-400">
              <div>Age / Gender: <strong className="text-slate-800 dark:text-slate-200">{selectedPatient.age} yrs / {selectedPatient.gender}</strong></div>
              <div>Blood Group: <strong className="text-rose-600">{selectedPatient.bloodGroup}</strong></div>
              <div>Known Allergies: <strong className="text-rose-600">{selectedPatient.allergies.join(', ') || 'None'}</strong></div>
              <div>Chronic Illness: <strong className="text-amber-600">{selectedPatient.chronicConditions.join(', ') || 'None'}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
