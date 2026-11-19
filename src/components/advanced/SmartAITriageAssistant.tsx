import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { classifyEmergencyTriage } from '../../utils/triageClassifier';
import {
  HeartPulse,
  Sparkles,
  AlertOctagon,
  Clock,
  ShieldAlert,
  ArrowRight,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const SmartAITriageAssistant: React.FC = () => {
  const { setActiveTab } = useHospital();

  const [complaintText, setComplaintText] = useState(
    '54-year-old male presenting with acute crushing substernal chest pressure radiating into left jaw, profuse diaphoresis, mild shortness of breath for past 45 minutes.'
  );
  const [heartRate, setHeartRate] = useState(115);
  const [systolicBp, setSystolicBp] = useState(165);
  const [spO2, setSpO2] = useState(92);
  const [respiratoryRate, setRespiratoryRate] = useState(24);
  const [isConscious, setIsConscious] = useState(true);

  const presets = [
    {
      title: 'Acute Coronary Syndrome (STEMI)',
      text: 'Acute retrosternal crushing chest pain radiating to left arm and neck with cold diaphoresis.',
      hr: 110,
      sbp: 160,
      spo2: 93,
      rr: 22,
      conscious: true,
    },
    {
      title: 'Acute Stroke (CVA / FAST)',
      text: 'Sudden onset right-sided facial droop, slurred speech, and acute hemiplegia onset 25 minutes ago.',
      hr: 95,
      sbp: 195,
      spo2: 96,
      rr: 18,
      conscious: true,
    },
    {
      title: 'Cardiac Arrest / Unresponsive',
      text: 'Unresponsive male found collapsed on sidewalk, no palpable carotid pulse, agonal respirations.',
      hr: 35,
      sbp: 50,
      spo2: 74,
      rr: 6,
      conscious: false,
    },
    {
      title: 'Acute Asthma Attack',
      text: 'Severe shortness of breath, expiratory wheezing, unable to speak full sentences.',
      hr: 125,
      sbp: 135,
      spo2: 90,
      rr: 28,
      conscious: true,
    },
    {
      title: 'Simple Ankle Sprain',
      text: 'Inversion injury to right lateral malleolus while playing soccer. Ambulating with mild limp, no deformities.',
      hr: 74,
      sbp: 120,
      spo2: 99,
      rr: 14,
      conscious: true,
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setComplaintText(p.text);
    setHeartRate(p.hr);
    setSystolicBp(p.sbp);
    setSpO2(p.spo2);
    setRespiratoryRate(p.rr);
    setIsConscious(p.conscious);
  };

  const prediction = classifyEmergencyTriage(
    complaintText,
    heartRate,
    systolicBp,
    spO2,
    respiratoryRate,
    isConscious
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-teal-100 p-2 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Smart AI Emergency Triage Assistant</h1>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                Advanced Feature #3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Natural Language Processing (NLP) intake classifier mapping chief complaints and vital signs into Emergency Severity Index (ESI Levels 1-5).
            </p>
          </div>
        </div>
      </div>

      {/* Preset Fast-Test Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">Clinical Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(p)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 whitespace-nowrap transition-colors"
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint & Vitals Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Patient Chief Complaint & Presenting Symptoms
            </label>
            <textarea
              rows={4}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Describe symptoms, onset time, pain severity, radiating factors..."
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-teal-500 focus:outline-none"
            />

            {/* Accompanying Vitals Input */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Triage Desk Physiological Telemetry</span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spO2}
                    onChange={(e) => setSpO2(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Resp Rate (/min)</label>
                  <input
                    type="number"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-500">Consciousness</label>
                  <div className="mt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsConscious(true)}
                      className={`flex-1 rounded-xl py-1.5 text-xs font-semibold border ${
                        isConscious ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' : 'border-slate-200'
                      }`}
                    >
                      Conscious
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConscious(false)}
                      className={`flex-1 rounded-xl py-1.5 text-xs font-semibold border ${
                        !isConscious ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' : 'border-slate-200'
                      }`}
                    >
                      Unresponsive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Triage Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">AI Triage Classification</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                Target Wait: <strong>{prediction.targetMaxWaitMinutes === 0 ? 'IMMEDIATE' : `< ${prediction.targetMaxWaitMinutes} Mins`}</strong>
              </span>
            </div>

            {/* ESI Badge Banner */}
            <div className={`mt-4 rounded-2xl p-4 flex items-center justify-between ${prediction.priorityColor}`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Emergency Severity Index</span>
                <div className="text-2xl font-black">Level {prediction.esiLevel}: {prediction.category}</div>
                <div className="text-xs opacity-90 mt-0.5">Assigned Facility: {prediction.suggestedDepartment}</div>
              </div>
              <div className="text-4xl font-black opacity-80 font-mono">ESI-{prediction.esiLevel}</div>
            </div>

            {/* Clinical Reasoning */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs dark:bg-slate-800/60">
              <span className="font-bold text-slate-900 dark:text-white">NLP Clinical Rationale:</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{prediction.clinicalReasoning}</p>
            </div>

            {/* Red Flags if any */}
            {prediction.redFlags.length > 0 && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs dark:border-rose-900 dark:bg-rose-950/20">
                <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Identified Red Flags & Critical Triggers:</span>
                </div>
                <ul className="mt-1.5 list-disc list-inside space-y-1 text-rose-700 dark:text-rose-300">
                  {prediction.redFlags.map((rf, i) => (
                    <li key={i}>{rf}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Diagnostic Recommendations */}
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="font-bold text-slate-900 dark:text-white">Recommended STAT Diagnostic Orders:</span>
              <ul className="mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
                {prediction.diagnosticRecommendations.map((diag, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                    <span>{diag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('core-emergency')}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Fast-Track Transfer to {prediction.suggestedDepartment}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
