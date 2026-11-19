import { TriagePrediction } from '../types';

export function classifyEmergencyTriage(
  chiefComplaint: string,
  heartRate: number = 75,
  systolicBp: number = 120,
  spO2: number = 98,
  respiratoryRate: number = 16,
  isConscious: boolean = true
): TriagePrediction {
  const text = chiefComplaint.toLowerCase();
  const redFlags: string[] = [];
  const diagnosticRecommendations: string[] = [];

  // Check Level 1: Immediate Resuscitation
  if (
    !isConscious ||
    text.includes('unresponsive') ||
    text.includes('cardiac arrest') ||
    text.includes('not breathing') ||
    text.includes('severe anaphylaxis') ||
    spO2 < 85 ||
    systolicBp < 70
  ) {
    if (!isConscious) redFlags.push('Loss of consciousness / unresponsiveness');
    if (spO2 < 85) redFlags.push(`Critical hypoxia (SpO2: ${spO2}%)`);
    if (systolicBp < 70) redFlags.push(`Profound hypotensive shock (SBP: ${systolicBp} mmHg)`);
    if (text.includes('cardiac arrest')) redFlags.push('Cardiopulmonary arrest');

    return {
      esiLevel: 1,
      category: 'Resuscitation',
      priorityColor: 'bg-red-600 text-white animate-pulse',
      targetMaxWaitMinutes: 0,
      redFlags: redFlags.length ? redFlags : ['Life-threatening hemodynamic instability detected'],
      diagnosticRecommendations: [
        'Immediate Endotracheal Intubation / Airway Management',
        'Large-Bore IV Access x2 & Rapid Infusion',
        'STAT 12-Lead ECG & Defibrillator Standby',
        'Bedside Point-of-Care Ultrasound (eFAST)'
      ],
      suggestedDepartment: 'Trauma Resuscitation Bay 1',
      clinicalReasoning: 'Patient exhibits immediate threat to life, requiring immediate physician intervention and advanced airway/circulatory resuscitation.'
    };
  }

  // Check Level 2: Emergent / High Risk
  const isHighRiskSymptom =
    text.includes('chest pain') ||
    text.includes('stroke') ||
    text.includes('facial droop') ||
    text.includes('slurred speech') ||
    text.includes('heavy bleeding') ||
    text.includes('severe shortness of breath') ||
    text.includes('asthma attack') ||
    text.includes('head trauma');

  if (isHighRiskSymptom || spO2 <= 91 || systolicBp >= 200 || heartRate >= 135 || respiratoryRate >= 26) {
    if (text.includes('chest pain')) redFlags.push('Potential Acute Coronary Syndrome (STEMI/NSTEMI)');
    if (text.includes('stroke') || text.includes('facial droop')) redFlags.push('Acute CVA / Stroke code protocol');
    if (spO2 <= 91) redFlags.push(`Severe respiratory distress (SpO2: ${spO2}%)`);
    if (systolicBp >= 200) redFlags.push(`Hypertensive crisis (SBP: ${systolicBp} mmHg)`);

    return {
      esiLevel: 2,
      category: 'Emergent',
      priorityColor: 'bg-rose-500 text-white',
      targetMaxWaitMinutes: 10,
      redFlags: redFlags.length ? redFlags : ['High-risk physiological markers indicating potential rapid deterioration'],
      diagnosticRecommendations: [
        'STAT High-Sensitivity Troponin I & Cardiac Biomarkers',
        'Continuous Cardiac Telemetry Monitoring',
        'Immediate Non-Contrast Head CT (if neurological)',
        'Arterial Blood Gas (ABG) & Lactate'
      ],
      suggestedDepartment: 'Emergency Acute Care',
      clinicalReasoning: 'High-risk situation, severe pain/distress, or abnormal vital signs indicating impending organ compromise.'
    };
  }

  // Check Level 3: Urgent (Needs multiple resources: Lab, IV, Imaging)
  const isUrgent =
    text.includes('abdominal pain') ||
    text.includes('fracture') ||
    text.includes('high fever') ||
    text.includes('vomiting blood') ||
    text.includes('deep laceration') ||
    text.includes('infection');

  if (isUrgent || heartRate > 105 || systolicBp < 100) {
    return {
      esiLevel: 3,
      category: 'Urgent',
      priorityColor: 'bg-amber-500 text-white',
      targetMaxWaitMinutes: 30,
      redFlags: ['Complex diagnostic workup needed with laboratory and radiographic resources'],
      diagnosticRecommendations: [
        'Complete Blood Count (CBC) & Comprehensive Metabolic Panel (CMP)',
        'Abdominal Ultrasound / Plain X-Ray Series',
        'Intravenous Fluid Hydration & Analgesia'
      ],
      suggestedDepartment: 'Urgent Care & Observation',
      clinicalReasoning: 'Stable vital signs but condition warrants extensive diagnostic testing and therapeutic management.'
    };
  }

  // Check Level 4: Less Urgent (Needs 1 resource)
  const isLessUrgent =
    text.includes('sprain') ||
    text.includes('suture') ||
    text.includes('cut') ||
    text.includes('urinary pain') ||
    text.includes('earache') ||
    text.includes('mild burn');

  if (isLessUrgent) {
    return {
      esiLevel: 4,
      category: 'Less Urgent',
      priorityColor: 'bg-emerald-600 text-white',
      targetMaxWaitMinutes: 60,
      redFlags: [],
      diagnosticRecommendations: [
        'Focused X-Ray of affected extremity or Urine Dipstick',
        'Local wound irrigation, dressing, or simple closure'
      ],
      suggestedDepartment: 'Fast Track Ambulatory Clinic',
      clinicalReasoning: 'Requires single diagnostic or procedural intervention. Low systemic acuity.'
    };
  }

  // Level 5: Non-Urgent
  return {
    esiLevel: 5,
    category: 'Non-Urgent',
    priorityColor: 'bg-teal-600 text-white',
    targetMaxWaitMinutes: 120,
    redFlags: [],
    diagnosticRecommendations: [
      'Prescription refill or outpatient referral counseling'
    ],
    suggestedDepartment: 'Outpatient Triage Desk',
    clinicalReasoning: 'Non-emergent condition requiring physical examination with zero specialized hospital resources.'
  };
}
