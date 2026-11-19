import { VitalRecord, MewsAssessment } from '../types';

/**
 * Calculates Modified Early Warning Score (MEWS / NEWS2 standard)
 * Returns structured scoring and actionable clinical escalation trigger.
 */
export function calculateMewsScore(
  patientId: string,
  patientName: string,
  bedNumber: string,
  ward: string,
  vitals: VitalRecord
): MewsAssessment {
  let heartRateScore = 0;
  let bpScore = 0;
  let respScore = 0;
  let spO2Score = 0;
  let tempScore = 0;
  let avpuScore = 0;

  // 1. Heart Rate (bpm)
  if (vitals.heartRate <= 40) heartRateScore = 3;
  else if (vitals.heartRate <= 50) heartRateScore = 1;
  else if (vitals.heartRate <= 90) heartRateScore = 0;
  else if (vitals.heartRate <= 110) heartRateScore = 1;
  else if (vitals.heartRate <= 130) heartRateScore = 2;
  else heartRateScore = 3; // > 130

  // 2. Systolic Blood Pressure (mmHg)
  if (vitals.systolicBp <= 70) bpScore = 3;
  else if (vitals.systolicBp <= 80) bpScore = 2;
  else if (vitals.systolicBp <= 100) bpScore = 1;
  else if (vitals.systolicBp <= 160) bpScore = 0;
  else if (vitals.systolicBp <= 199) bpScore = 2;
  else bpScore = 3; // >= 200

  // 3. Respiratory Rate (breaths/min)
  if (vitals.respiratoryRate <= 8) respScore = 3;
  else if (vitals.respiratoryRate <= 11) respScore = 1;
  else if (vitals.respiratoryRate <= 20) respScore = 0;
  else if (vitals.respiratoryRate <= 24) respScore = 2;
  else respScore = 3; // >= 25

  // 4. Oxygen Saturation SpO2 (%)
  if (vitals.spO2 <= 91) spO2Score = 3;
  else if (vitals.spO2 <= 93) spO2Score = 2;
  else if (vitals.spO2 <= 95) spO2Score = 1;
  else spO2Score = 0; // >= 96%

  // 5. Body Temperature (°C)
  if (vitals.temperature <= 35.0) tempScore = 3;
  else if (vitals.temperature <= 36.0) tempScore = 1;
  else if (vitals.temperature <= 38.0) tempScore = 0;
  else if (vitals.temperature <= 39.0) tempScore = 1;
  else tempScore = 2; // > 39.0

  // 6. Consciousness (AVPU)
  if (vitals.avpu === 'Alert') avpuScore = 0;
  else if (vitals.avpu === 'Voice') avpuScore = 1;
  else if (vitals.avpu === 'Pain') avpuScore = 2;
  else avpuScore = 3; // Unresponsive

  const totalScore = heartRateScore + bpScore + respScore + spO2Score + tempScore + avpuScore;

  let riskLevel: MewsAssessment['riskLevel'] = 'Low';
  let recommendedAction = 'Continue routine nursing monitoring every 4-6 hours.';

  if (totalScore >= 7) {
    riskLevel = 'Critical / Code Blue Imminent';
    recommendedAction = 'IMMEDIATE EMERGENCY: Activate Medical Emergency Team (MET) / ICU Outreach Specialist. Prepare Crash Cart & Resuscitation.';
  } else if (totalScore >= 5 || heartRateScore === 3 || bpScore === 3 || respScore === 3 || spO2Score === 3) {
    riskLevel = 'High / Sepsis Risk';
    recommendedAction = 'URGENT: Request urgent doctor review within 15 minutes. Check lactate, blood cultures, initiate oxygen therapy.';
  } else if (totalScore >= 3) {
    riskLevel = 'Medium';
    recommendedAction = 'Escalate to Charge Nurse. Increase vital monitoring frequency to every 1 hour.';
  }

  return {
    patientId,
    patientName,
    bedNumber,
    ward,
    score: totalScore,
    riskLevel,
    recommendedAction,
    breakdown: {
      heartRateScore,
      bpScore,
      respScore,
      spO2Score,
      tempScore,
      avpuScore,
    },
    timestamp: new Date().toISOString(),
  };
}
