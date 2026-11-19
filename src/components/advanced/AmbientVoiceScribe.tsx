import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Mic,
  MicOff,
  Sparkles,
  FileText,
  CheckCircle2,
  Copy,
  RotateCcw,
  Volume2
} from 'lucide-react';

export const AmbientVoiceScribe: React.FC = () => {
  const { addNotification } = useHospital();
  const [isRecording, setIsRecording] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const presets = [
    {
      title: 'Cardiology Clinic Consultation (CAD & Angina)',
      transcript:
        "Doctor: 'Good morning, Eleanor. How have you been feeling since we placed the stent last Tuesday?'\nPatient: 'Much better doctor, though I had a brief spell of mild substernal pressure yesterday when climbing two flights of stairs.'\nDoctor: 'Understood. Let us examine your heart sounds. S1 and S2 are regular, no murmurs. Blood pressure today is 134 over 84, heart rate 72 beats per minute, oxygen saturation 98 percent on room air. Let us adjust your Atorvastatin to 40 mg daily and keep Aspirin 81 mg. We will order a follow-up stress echocardiogram in three weeks.'",
      soap: {
        subjective:
          "64-year-old female post-LAD PCI stenting presents for follow-up. Reports significant symptomatic improvement with isolated episode of mild substernal chest pressure upon exertion (climbing stairs). Denies orthopnea or paroxysmal nocturnal dyspnea.",
        objective:
          "Vitals: BP 134/84 mmHg, HR 72 bpm, SpO2 98% on room air. Cardiovascular: S1 and S2 present, regular rhythm, no murmurs, rubs, or gallops. Lungs clear to auscultation bilaterally.",
        assessment:
          "1. Coronary Artery Disease (CAD), status post drug-eluting stent to LAD.\n2. Exertional angina pectoris, Class I.\n3. Essential hypertension, well controlled.",
        plan:
          "1. Titrate Atorvastatin to 40 mg PO QHS.\n2. Continue Aspirin 81 mg PO daily and Warfarin per INR protocol.\n3. Order outpatient Stress Echocardiogram in 3 weeks.\n4. Return to clinic in 4 weeks or ER immediately if resting chest pain recurs.",
      },
      icd10: [
        { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery', confidence: 96 },
        { code: 'I20.9', description: 'Angina pectoris, unspecified', confidence: 91 },
        { code: 'I10', description: 'Essential (primary) hypertension', confidence: 98 },
      ]
    },
    {
      title: 'Emergency Resuscitation Intake (Severe Sepsis)',
      transcript:
        "Doctor: 'Patient is febrile to 39.1 degrees Celsius, heart rate is 126, blood pressure 82 over 48. Crackles at the right lung base.'\nNurse: 'Lactate is back from blood gas at 4.2 millimoles per liter.'\nDoctor: 'Initiate 30 mL per kilogram balanced crystalloid bolus STAT. Draw two sets of blood cultures before giving IV Ceftriaxone and Vancomycin. Alert ICU for septic shock admission.'",
      soap: {
        subjective:
          "Patient brought by emergency EMS with altered mental status, high-grade fevers, and productive purulent cough for 48 hours.",
        objective:
          "Vitals: Temp 39.1°C, HR 126 bpm, BP 82/48 mmHg (MAP < 60), RR 26/min, SpO2 91% on room air. Labs: Point-of-care venous lactate 4.2 mmol/L. Exam: Right base rales, delayed capillary refill > 3 seconds.",
        assessment:
          "1. Septic Shock secondary to Community-Acquired Pneumonia.\n2. Refractory hypotension requiring volume resuscitation and vasopressor readiness.",
        plan:
          "1. IV crystalloid bolus 30 mL/kg STAT.\n2. Blood cultures x2, Urinalysis & Sputum gram stain.\n3. Broad-spectrum empiric IV Ceftriaxone 2g + Vancomycin 1.5g.\n4. Emergency transfer to Intensive Care Unit (ICU Bed 101).",
      },
      icd10: [
        { code: 'R65.21', description: 'Severe sepsis with septic shock', confidence: 99 },
        { code: 'J18.9', description: 'Pneumonia, unspecified organism', confidence: 94 },
        { code: 'R57.2', description: 'Septic shock', confidence: 97 },
      ]
    }
  ];

  const currentPreset = presets[activePresetIndex];

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      addNotification('info', 'Ambient Clinical Scribe Active', 'Listening to room conversation and transcribing live...');
      setTimeout(() => {
        setIsRecording(false);
        addNotification('success', 'Transcription Synthesized', 'Extracted structured SOAP notes and ICD-10 diagnostic codes.');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleCopyNotes = () => {
    const fullText = `SOAP CLINICAL PROGRESS NOTE\n\nSUBJECTIVE:\n${currentPreset.soap.subjective}\n\nOBJECTIVE:\n${currentPreset.soap.objective}\n\nASSESSMENT:\n${currentPreset.soap.assessment}\n\nPLAN:\n${currentPreset.soap.plan}`;
    navigator.clipboard.writeText(fullText);
    addNotification('success', 'Copied to Clipboard', 'SOAP clinical note ready to paste into EHR.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-purple-100 p-2 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">AI Ambient Clinical Scribe & Voice-to-SOAP</h1>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                Advanced Feature #6
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-click physician dictation processing: automatically synthesizes ambient room conversations into structured SOAP notes & ICD-10 billing codes.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Dialogue Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Encounter Dialogue Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActivePresetIndex(idx)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
              activePresetIndex === idx
                ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ambient Recording & Raw Transcript */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-600" />
                Live Ambient Audio Feed
              </span>

              <button
                onClick={handleToggleRecording}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                <span>{isRecording ? 'Listening...' : 'Simulate Dictation'}</span>
              </button>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            {isRecording && (
              <div className="mt-4 flex items-center justify-center gap-1.5 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 p-2">
                <span className="h-6 w-1 rounded bg-purple-600 animate-pulse"></span>
                <span className="h-10 w-1 rounded bg-purple-600 animate-bounce"></span>
                <span className="h-4 w-1 rounded bg-purple-600 animate-pulse"></span>
                <span className="h-8 w-1 rounded bg-purple-600 animate-bounce"></span>
                <span className="h-12 w-1 rounded bg-purple-600 animate-pulse"></span>
                <span className="h-5 w-1 rounded bg-purple-600 animate-bounce"></span>
              </div>
            )}

            {/* Raw Speech Transcript */}
            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Natural Ambient Conversation</span>
              <div className="mt-2 rounded-xl bg-slate-50 p-3.5 text-xs font-mono text-slate-700 leading-relaxed dark:bg-slate-800/60 dark:text-slate-300 whitespace-pre-line max-h-64 overflow-y-auto">
                {currentPreset.transcript}
              </div>
            </div>
          </div>

          {/* ICD-10 Auto-Coder */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Automated ICD-10 Diagnostic & Billing Codes
            </span>

            <div className="mt-3 space-y-2">
              {currentPreset.icd10.map((icd) => (
                <div
                  key={icd.code}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div>
                    <span className="font-mono font-bold text-purple-700 dark:text-purple-300">{icd.code}</span>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{icd.description}</div>
                  </div>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 font-mono">
                    {icd.confidence}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured SOAP Clinical Note */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Synthesized SOAP Progress Note
              </span>

              <button
                onClick={handleCopyNotes}
                className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline dark:text-purple-300"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy to EHR</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Subjective */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-purple-700 dark:text-purple-300 uppercase text-[10px] tracking-wider">
                  S — Subjective
                </span>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentPreset.soap.subjective}
                </p>
              </div>

              {/* Objective */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-purple-700 dark:text-purple-300 uppercase text-[10px] tracking-wider">
                  O — Objective
                </span>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentPreset.soap.objective}
                </p>
              </div>

              {/* Assessment */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-purple-700 dark:text-purple-300 uppercase text-[10px] tracking-wider">
                  A — Assessment
                </span>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentPreset.soap.assessment}
                </p>
              </div>

              {/* Plan */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-purple-700 dark:text-purple-300 uppercase text-[10px] tracking-wider">
                  P — Plan
                </span>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentPreset.soap.plan}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
