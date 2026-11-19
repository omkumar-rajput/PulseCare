import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { calculateMewsScore } from '../../utils/mewsCalculator';
import { VitalRecord } from '../../types';
import {
  Activity,
  HeartPulse,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const EarlyWarningScoreCalculator: React.FC = () => {
  const { patients, beds, broadcastEmergencyCode, setActiveTab } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Interactive Vital Simulators
  const initialVitals = selectedPatient?.vitalsHistory?.[0] || {
    heartRate: 114,
    systolicBp: 172,
    diastolicBp: 98,
    respiratoryRate: 23,
    spO2: 93,
    temperature: 38.6,
    avpu: 'Alert' as const,
  };

  const [simVitals, setSimVitals] = useState({
    heartRate: initialVitals.heartRate,
    systolicBp: initialVitals.systolicBp,
    diastolicBp: initialVitals.diastolicBp,
    respiratoryRate: initialVitals.respiratoryRate,
    spO2: initialVitals.spO2,
    temperature: initialVitals.temperature,
    avpu: initialVitals.avpu,
  });

  const mewsAssessment = calculateMewsScore(
    selectedPatient.id,
    selectedPatient.name,
    selectedPatient.assignedBedId || 'Bed Unassigned',
    'ICU / Stepdown',
    {
      id: 'SIM',
      timestamp: new Date().toISOString(),
      ...simVitals,
    }
  );

  const isCritical = mewsAssessment.score >= 7;
  const isHigh = mewsAssessment.score >= 5;

  // Batch calculate for all inpatients
  const inpatientScores = patients.map((p) => {
    const v = p.vitalsHistory[0] || initialVitals;
    return calculateMewsScore(p.id, p.name, p.assignedBedId || 'Outpatient', p.admissionStatus, v);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            <HeartPulse className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Modified Early Warning Score (MEWS / NEWS2)</h1>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                Advanced Feature #2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predictive physiological deterioration algorithm identifying impending sepsis, respiratory failure, and cardiac arrest hours prior to collapse.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Simulator & Live Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Telemetry Slider Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-teal-600" />
                Live Patient Telemetry & Simulation Controls
              </span>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  const p = patients.find((pat) => pat.id === e.target.value);
                  if (p && p.vitalsHistory[0]) {
                    setSimVitals({
                      heartRate: p.vitalsHistory[0].heartRate,
                      systolicBp: p.vitalsHistory[0].systolicBp,
                      diastolicBp: p.vitalsHistory[0].diastolicBp,
                      respiratoryRate: p.vitalsHistory[0].respiratoryRate,
                      spO2: p.vitalsHistory[0].spO2,
                      temperature: p.vitalsHistory[0].temperature,
                      avpu: p.vitalsHistory[0].avpu,
                    });
                  }
                }}
                className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.uhid})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-4">
              {/* Heart Rate Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Heart Rate: {simVitals.heartRate} bpm</span>
                  <span className="font-mono text-xs font-bold text-teal-600">
                    Points: +{mewsAssessment.breakdown.heartRateScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={simVitals.heartRate}
                  onChange={(e) => setSimVitals({ ...simVitals, heartRate: parseInt(e.target.value) })}
                  className="mt-1 w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>30 (Bradycardia)</span>
                  <span>Normal (60-90)</span>
                  <span>180 (Tachycardia)</span>
                </div>
              </div>

              {/* Systolic BP Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Systolic Blood Pressure: {simVitals.systolicBp} mmHg</span>
                  <span className="font-mono text-xs font-bold text-teal-600">
                    Points: +{mewsAssessment.breakdown.bpScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="230"
                  value={simVitals.systolicBp}
                  onChange={(e) => setSimVitals({ ...simVitals, systolicBp: parseInt(e.target.value) })}
                  className="mt-1 w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50 (Hypotensive Shock)</span>
                  <span>Normal (100-140)</span>
                  <span>230 (Hypertensive Crisis)</span>
                </div>
              </div>

              {/* SpO2 Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Oxygen Saturation (SpO2): {simVitals.spO2}%</span>
                  <span className="font-mono text-xs font-bold text-teal-600">
                    Points: +{mewsAssessment.breakdown.spO2Score}
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={simVitals.spO2}
                  onChange={(e) => setSimVitals({ ...simVitals, spO2: parseInt(e.target.value) })}
                  className="mt-1 w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>70% (Severe Hypoxia)</span>
                  <span>95%+ (Normal Room Air)</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Respiratory Rate Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Respiratory Rate: {simVitals.respiratoryRate} /min</span>
                  <span className="font-mono text-xs font-bold text-teal-600">
                    Points: +{mewsAssessment.breakdown.respScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={simVitals.respiratoryRate}
                  onChange={(e) => setSimVitals({ ...simVitals, respiratoryRate: parseInt(e.target.value) })}
                  className="mt-1 w-full accent-teal-600"
                />
              </div>

              {/* Temperature & AVPU */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Temp: {simVitals.temperature}°C (+{mewsAssessment.breakdown.tempScore} pts)
                  </label>
                  <input
                    type="range"
                    min="34.0"
                    max="41.0"
                    step="0.1"
                    value={simVitals.temperature}
                    onChange={(e) => setSimVitals({ ...simVitals, temperature: parseFloat(e.target.value) })}
                    className="mt-1 w-full accent-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    AVPU: (+{mewsAssessment.breakdown.avpuScore} pts)
                  </label>
                  <select
                    value={simVitals.avpu}
                    onChange={(e) => setSimVitals({ ...simVitals, avpu: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Alert">Alert (0 pts)</option>
                    <option value="Voice">Voice (+1 pt)</option>
                    <option value="Pain">Pain (+2 pts)</option>
                    <option value="Unresponsive">Unresponsive (+3 pts)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated MEWS Score Gauge & Clinical Protocol */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-all ${
              isCritical
                ? 'border-red-400 bg-red-50 dark:border-red-900 dark:bg-red-950/40'
                : isHigh
                ? 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Composite MEWS Score</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  isCritical
                    ? 'bg-red-600 text-white animate-pulse'
                    : isHigh
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {mewsAssessment.riskLevel}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span
                className={`text-6xl font-black ${
                  isCritical
                    ? 'text-red-600 dark:text-red-400'
                    : isHigh
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {mewsAssessment.score}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 18 Maximum Risk Index</span>
            </div>

            {/* Recommended Protocol Action */}
            <div className="mt-4 rounded-xl bg-white/90 p-3.5 text-xs dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">Escalation Protocol:</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {mewsAssessment.recommendedAction}
              </p>
            </div>

            {/* Direct Emergency Code Trigger if Critical */}
            {isCritical && (
              <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-900">
                <button
                  onClick={() => broadcastEmergencyCode('Code Blue (Cardiac)', `${selectedPatient.name} @ ${selectedPatient.assignedBedId || 'ICU'}`)}
                  className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/40 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="h-4 w-4 animate-spin" />
                  <span>DISPATCH MEDICAL EMERGENCY CRASH TEAM</span>
                </button>
              </div>
            )}
          </div>

          {/* Breakdown Score Matrix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score Contribution Factors</span>
            <div className="mt-3 grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>Heart Rate Score:</span> <strong>+{mewsAssessment.breakdown.heartRateScore}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>Blood Pressure Score:</span> <strong>+{mewsAssessment.breakdown.bpScore}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>Respiration Score:</span> <strong>+{mewsAssessment.breakdown.respScore}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>SpO2 Oxygen Score:</span> <strong>+{mewsAssessment.breakdown.spO2Score}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>Temperature Score:</span> <strong>+{mewsAssessment.breakdown.tempScore}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span>AVPU Consciousness:</span> <strong>+{mewsAssessment.breakdown.avpuScore}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital-Wide Ward Patient MEWS Heatmap */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Hospital-Wide Inpatient Sepsis & Deterioration Monitor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {inpatientScores.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPatientId(item.patientId)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3.5 hover:border-teal-500 transition-colors dark:border-slate-800 dark:bg-slate-800/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.patientName}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-black ${
                  item.score >= 7 ? 'bg-red-600 text-white animate-pulse' : item.score >= 5 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  MEWS {item.score}
                </span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">{item.bedNumber} • {item.riskLevel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
