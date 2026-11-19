import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { DRUG_INTERACTIONS_DB, checkPrescriptionConflicts } from '../../utils/cdssEngine';
import {
  BrainCircuit,
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  Pill,
  Sparkles
} from 'lucide-react';

export const CDSSDrugInteractionChecker: React.FC = () => {
  const { medicines, patients } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [drugA, setDrugA] = useState('Warfarin Sodium');
  const [drugB, setDrugB] = useState('Aspirin Cardio');
  const [customDrugList, setCustomDrugList] = useState<string[]>(['Warfarin Sodium', 'Aspirin Cardio']);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const simulationResult = checkPrescriptionConflicts(customDrugList, [], selectedPatient);

  const handleToggleDrug = (drugName: string) => {
    if (customDrugList.includes(drugName)) {
      setCustomDrugList(customDrugList.filter((d) => d !== drugName));
    } else {
      setCustomDrugList([...customDrugList, drugName]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">AI Clinical Decision Support System (CDSS)</h1>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                Advanced Feature #1
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pharmacokinetic & pharmacodynamic cross-interaction engine with patient-specific genomic/allergy contraindication detection.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Context & Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Patient Profile</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.uhid}) — Allergies: {p.allergies.join(', ') || 'None'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Documented Allergies:</span>
              <div className="font-bold text-rose-600">{selectedPatient.allergies.join(', ') || 'NKDA'}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400">Underlying Conditions:</span>
              <div className="font-bold text-amber-600">{selectedPatient.chronicConditions.join(', ') || 'None'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Formulation Selection Multi-picker */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="h-4 w-4 text-indigo-600" />
            Select Medications for Multi-Drug Regimen Simulation
          </span>
          <span className="text-xs font-mono text-slate-400">{customDrugList.length} drugs active in simulator</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {medicines.map((m) => {
            const isSelected = customDrugList.includes(m.name);
            return (
              <button
                key={m.id}
                onClick={() => handleToggleDrug(m.name)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {m.name} ({m.strength})
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Interaction Report Output */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time CDSS Risk Assessment</h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              simulationResult.riskRating === 'Safe'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : simulationResult.riskRating === 'Lethal Hazard'
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            Composite Risk: {simulationResult.riskRating}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {/* Allergy Match Alert */}
          {simulationResult.allergyConflicts.map((ac, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-rose-300 bg-rose-50/80 p-4 text-xs dark:border-rose-900 dark:bg-rose-950/40"
            >
              <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <span className="text-sm">PATIENT ALLERGY HAZARD: {ac.severity}</span>
              </div>
              <p className="mt-2 text-rose-900 dark:text-rose-200">
                Drug <strong>{ac.drugName}</strong> cross-reacts with known patient hypersensitivity to <strong>{ac.allergenMatched}</strong>.
              </p>
              <div className="mt-2 rounded-xl bg-white/80 p-2.5 font-medium text-rose-800 dark:bg-slate-900/60 dark:text-rose-300">
                💡 <strong>Clinical Guidance:</strong> {ac.recommendation}
              </div>
            </div>
          ))}

          {/* DDI Interactions */}
          {simulationResult.interactions.map((ddi) => (
            <div
              key={ddi.id}
              className={`rounded-2xl border p-4 text-xs ${
                ddi.severity === 'Critical'
                  ? 'border-rose-300 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/20'
                  : 'border-amber-300 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {ddi.drugA} ↔ {ddi.drugB}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        ddi.severity === 'Critical'
                          ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                          : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {ddi.severity} Severity
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Mechanism: {ddi.mechanism}</div>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-white/90 p-3 text-xs dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Physiological Consequence:</div>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300">{ddi.clinicalEffect}</p>
                <div className="mt-2 text-indigo-700 dark:text-indigo-400 font-bold">
                  Recommended Action: {ddi.recommendation}
                </div>
              </div>
            </div>
          ))}

          {simulationResult.interactions.length === 0 && simulationResult.allergyConflicts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Clear Pharmacological Profile</h4>
              <p className="mt-1 max-w-md text-xs text-slate-500">
                No lethal or severe drug-drug interactions or allergy contraindications detected between the selected medications.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Built-in Knowledge Base Reference */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Evidence-Based Pharmacological Knowledge Base ({DRUG_INTERACTIONS_DB.length} High-Acuity Rules Loaded)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {DRUG_INTERACTIONS_DB.map((d) => (
            <div key={d.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>{d.drugA} + {d.drugB}</span>
                <span className="font-mono text-[9px] text-teal-600">{d.id}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{d.clinicalEffect}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
