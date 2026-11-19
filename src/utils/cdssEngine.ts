import { DrugInteraction, AllergyConflict, Patient, Medicine } from '../types';

// Pharmacological Drug-Drug Interaction Knowledge Base
export const DRUG_INTERACTIONS_DB: DrugInteraction[] = [
  {
    id: 'DDI-01',
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    severity: 'Critical',
    mechanism: 'Additive antithrombotic and anticoagulant synergism.',
    clinicalEffect: 'Severe gastrointestinal and systemic hemorrhagic risk.',
    recommendation: 'Avoid concurrent use unless strictly indicated under continuous INR monitoring.'
  },
  {
    id: 'DDI-02',
    drugA: 'Lisinopril',
    drugB: 'Spironolactone',
    severity: 'Major',
    mechanism: 'Additive inhibition of aldosterone causing potassium retention.',
    clinicalEffect: 'Severe hyperkalemia leading to life-threatening cardiac arrhythmias.',
    recommendation: 'Monitor serum potassium and renal panel within 3-5 days of initiation.'
  },
  {
    id: 'DDI-03',
    drugA: 'Metformin',
    drugB: 'Iodinated Radiocontrast',
    severity: 'Major',
    mechanism: 'Contrast-induced acute nephropathy impairing metformin clearance.',
    clinicalEffect: 'Lactic acidosis, renal failure.',
    recommendation: 'Withhold Metformin 48h prior to and 48h following radiocontrast administration.'
  },
  {
    id: 'DDI-04',
    drugA: 'Ciprofloxacin',
    drugB: 'Amiodarone',
    severity: 'Critical',
    mechanism: 'Dual blockade of cardiac hERG potassium channels.',
    clinicalEffect: 'QT prolongation, Torsades de Pointes ventricular tachycardia.',
    recommendation: 'Strictly contraindicated. Substitute fluoroquinolone with alternative antibiotic.'
  },
  {
    id: 'DDI-05',
    drugA: 'Atorvastatin',
    drugB: 'Clarithromycin',
    severity: 'Major',
    mechanism: 'CYP3A4 inhibition elevates atorvastatin serum concentrations.',
    clinicalEffect: 'Severe rhabdomyolysis and acute myoglobinuric kidney injury.',
    recommendation: 'Temporarily suspend Statin therapy during macrolide antibiotic course.'
  },
  {
    id: 'DDI-06',
    drugA: 'Methotrexate',
    drugB: 'Ibuprofen',
    severity: 'Major',
    mechanism: 'NSAIDs decrease renal prostaglandin synthesis and methotrexate excretion.',
    clinicalEffect: 'Severe bone marrow suppression, leukopenia, mucositis.',
    recommendation: 'Avoid concurrent high-dose NSAID usage. Consider acetaminophen as analgesic.'
  },
  {
    id: 'DDI-07',
    drugA: 'Tramadol',
    drugB: 'Sertraline',
    severity: 'Critical',
    mechanism: 'Dual serotonergic reuptake inhibition and neurotransmitter excess.',
    clinicalEffect: 'Serotonin Syndrome (hyperthermia, clonus, autonomic instability).',
    recommendation: 'Avoid combination. Monitor neurological signs if co-prescribed.'
  },
  {
    id: 'DDI-08',
    drugA: 'Digoxin',
    drugB: 'Furosemide',
    severity: 'Moderate',
    mechanism: 'Loop diuretic causes hypokalemia, sensitizing myocardium to digitalis.',
    clinicalEffect: 'Digoxin toxicity (arrhythmias, nausea, visual halos).',
    recommendation: 'Check serum potassium levels and prescribe oral potassium replacement.'
  }
];

// Allergy cross-reference dictionary
export const ALLERGEN_CLASS_MAPPING: Record<string, string[]> = {
  'penicillin': ['amoxicillin', 'ampicillin', 'piperacillin', 'augmentin', 'penicillin v', 'methicillin'],
  'sulfa': ['sulfamethoxazole', 'bactrim', 'sulfasalazine', 'furosemide'],
  'nsaid': ['aspirin', 'ibuprofen', 'naproxen', 'ketorolac', 'diclofenac'],
  'cephalosporin': ['cephalexin', 'ceftriaxone', 'cefuroxime', 'cefepime'],
  'codeine': ['codeine', 'morphine', 'tramadol', 'oxycodone']
};

export function checkPrescriptionConflicts(
  newMedicationNames: string[],
  existingMedicationNames: string[],
  patient: Patient
): {
  interactions: DrugInteraction[];
  allergyConflicts: AllergyConflict[];
  riskRating: 'Safe' | 'Caution' | 'High Alert' | 'Lethal Hazard';
} {
  const interactions: DrugInteraction[] = [];
  const allergyConflicts: AllergyConflict[] = [];

  const allPrescribed = [...new Set([...newMedicationNames, ...existingMedicationNames])];

  // 1. Check Drug-Drug Interactions
  for (let i = 0; i < allPrescribed.length; i++) {
    for (let j = i + 1; j < allPrescribed.length; j++) {
      const medA = allPrescribed[i].toLowerCase().trim();
      const medB = allPrescribed[j].toLowerCase().trim();

      const foundDDI = DRUG_INTERACTIONS_DB.find(
        (ddi) =>
          (ddi.drugA.toLowerCase() === medA && ddi.drugB.toLowerCase() === medB) ||
          (ddi.drugA.toLowerCase() === medB && ddi.drugB.toLowerCase() === medA)
      );

      if (foundDDI) {
        interactions.push(foundDDI);
      }
    }
  }

  // 2. Check Patient Allergies against new meds
  if (patient.allergies && patient.allergies.length > 0) {
    for (const allergy of patient.allergies) {
      const cleanAllergy = allergy.toLowerCase().trim();
      const mappedDrugs = ALLERGEN_CLASS_MAPPING[cleanAllergy] || [cleanAllergy];

      for (const newMed of newMedicationNames) {
        const cleanNewMed = newMed.toLowerCase().trim();
        const hasConflict = mappedDrugs.some((d) => cleanNewMed.includes(d) || d.includes(cleanNewMed));

        if (hasConflict) {
          allergyConflicts.push({
            drugName: newMed,
            allergenMatched: allergy,
            severity: cleanAllergy.includes('penicillin') || cleanAllergy.includes('sulfa') 
              ? 'Fatal Anaphylaxis Risk' 
              : 'High',
            recommendation: `Patient is documented allergic to ${allergy}. Immediately substitute with non-cross-reactive pharmacological class.`
          });
        }
      }
    }
  }

  // Calculate composite risk rating
  let riskRating: 'Safe' | 'Caution' | 'High Alert' | 'Lethal Hazard' = 'Safe';
  if (allergyConflicts.length > 0 || interactions.some((i) => i.severity === 'Critical')) {
    riskRating = 'Lethal Hazard';
  } else if (interactions.some((i) => i.severity === 'Major')) {
    riskRating = 'High Alert';
  } else if (interactions.length > 0) {
    riskRating = 'Caution';
  }

  return { interactions, allergyConflicts, riskRating };
}
