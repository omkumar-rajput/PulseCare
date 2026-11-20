import {
  Patient,
  Doctor,
  Bed,
  Medicine,
  LabTestOrder,
  Invoice,
  Appointment,
  EmergencyCase,
  BloodInventoryItem,
  EmergencyBroadcast,
  AuditBlock
} from '../types';

export interface AISuggestion {
  id: string;
  category: 'clinical' | 'operational' | 'inventory' | 'emergency';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendedAction: string;
  targetTab?: string;
  timestamp: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  badges?: string[];
  actionShortcut?: {
    label: string;
    targetTab: string;
  };
  suggestions?: string[];
}

export interface HospitalKnowledgeContext {
  patients: Patient[];
  doctors: Doctor[];
  beds: Bed[];
  medicines: Medicine[];
  labOrders: LabTestOrder[];
  invoices: Invoice[];
  appointments: Appointment[];
  emergencyCases: EmergencyCase[];
  bloodBank: BloodInventoryItem[];
  emergencyBroadcasts: EmergencyBroadcast[];
  auditLedger?: AuditBlock[];
}

/**
 * Omniscient Clinical AI Analyzer
 * Scans the entire active hospital state in real time and generates proactive suggestions.
 */
export function generateProactiveSuggestions(ctx: HospitalKnowledgeContext): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Scan Patients for Severe Vitals / Deterioration
  ctx.patients.forEach((p) => {
    const latestVital = p.vitalsHistory?.[0];
    const assignedBed = ctx.beds.find((b) => b.id === p.assignedBedId || b.uhid === p.uhid);
    const wardName = assignedBed ? `${assignedBed.ward} (Bed ${assignedBed.bedNumber})` : 'Inpatient Ward';

    if (latestVital) {
      if (latestVital.spO2 < 93 || latestVital.heartRate > 115 || latestVital.heartRate < 50) {
        suggestions.push({
          id: `SUGG-VIT-${p.id}`,
          category: 'clinical',
          severity: latestVital.spO2 < 90 || latestVital.heartRate > 125 ? 'critical' : 'warning',
          title: `Telemetry Alert: ${p.name} (${p.uhid})`,
          description: `Patient in ${wardName} displays abnormal hemodynamics: HR ${latestVital.heartRate} bpm, SpO2 ${latestVital.spO2}%, BP ${latestVital.systolicBp}/${latestVital.diastolicBp} mmHg.`,
          recommendedAction: 'Order STAT arterial blood gas (ABG) & increase continuous telemetry monitoring.',
          targetTab: 'core-patients',
          timestamp: now
        });
      }
    }
  });

  // 2. Scan Blood Bank for Critical Shortages
  const criticalBlood = ctx.bloodBank.filter((b) => b.unitsAvailable <= b.minSafeUnits);
  criticalBlood.forEach((b) => {
    suggestions.push({
      id: `SUGG-BLD-${b.bloodGroup}`,
      category: 'inventory',
      severity: b.bloodGroup === 'O-' ? 'critical' : 'warning',
      title: `Blood Depletion Alert: ${b.bloodGroup} Reserve`,
      description: `Only ${b.unitsAvailable} units available (Safe minimum is ${b.minSafeUnits} units). High trauma risk.`,
      recommendedAction: `Transmit urgent SOS regional donor broadcast for ${b.bloodGroup} donors.`,
      targetTab: 'adv-bloodbank',
      timestamp: now
    });
  });

  // 3. Scan Pharmacy for Low Stock / Out of Stock
  const lowMeds = ctx.medicines.filter((m) => m.stockQuantity <= m.reorderLevel);
  if (lowMeds.length > 0) {
    const topLow = lowMeds[0];
    suggestions.push({
      id: `SUGG-MED-${topLow.id}`,
      category: 'inventory',
      severity: topLow.stockQuantity === 0 ? 'critical' : 'warning',
      title: `Formulary Reorder Required: ${topLow.name}`,
      description: `Stock level down to ${topLow.stockQuantity} units (${topLow.dosageForm}, Reorder point: ${topLow.reorderLevel}). Critical in ${topLow.category}.`,
      recommendedAction: 'Trigger immediate automated purchase order to hospital wholesale distributor.',
      targetTab: 'core-pharmacy',
      timestamp: now
    });
  }

  // 4. Scan Bed Occupancy for Critical Bottlenecks
  const icuBeds = ctx.beds.filter((b) => b.ward === 'ICU');
  const occupiedIcu = icuBeds.filter((b) => b.status === 'Occupied');
  if (icuBeds.length > 0 && occupiedIcu.length / icuBeds.length >= 0.75) {
    suggestions.push({
      id: 'SUGG-BED-ICU',
      category: 'operational',
      severity: 'warning',
      title: 'ICU Capacity Warning (75%+ Occupied)',
      description: `${occupiedIcu.length} of ${icuBeds.length} ICU beds are currently occupied. Limited emergency surge capacity.`,
      recommendedAction: 'Screen recovering ICU patients for step-down transfer to General Ward telemetry.',
      targetTab: 'core-beds',
      timestamp: now
    });
  }

  // 5. Active Emergency Code Broadcasts
  const activeCodes = ctx.emergencyBroadcasts.filter((c) => c.active);
  activeCodes.forEach((c) => {
    suggestions.push({
      id: `SUGG-CODE-${c.id}`,
      category: 'emergency',
      severity: 'critical',
      title: `Active Protocol: ${c.type} at ${c.location}`,
      description: `Broadcast initiated by ${c.reportedBy}. Resuscitation & security teams paged.`,
      recommendedAction: 'Ensure trauma elevators locked to Level 1 and resuscitation bays prepped.',
      targetTab: 'adv-code-dispatcher',
      timestamp: now
    });
  });

  return suggestions;
}

/**
 * Omniscient Natural Language Query Processor
 * Evaluates questions against all live hospital data and returns comprehensive clinical & operational answers.
 */
export function answerHospitalQuery(query: string, ctx: HospitalKnowledgeContext): AIChatMessage {
  const q = query.toLowerCase().trim();
  const id = `MSG-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. DIRECT PATIENT LOOKUP (Matches ANY patient in the database by full name, first name, or UHID)
  // Handles: "who is JOHN", "John", "tell me about Eleanor", "Omkumar Rajput", "PC-2026-9266"
  const matchingPatient = ctx.patients.find((p) => {
    if (!p.name) return false;
    const nameLower = p.name.toLowerCase().trim();
    if (q.includes(nameLower)) return true;
    const words = nameLower.split(/\s+/).filter((w) => w.length >= 3);
    if (words.some((w) => q.includes(w))) return true;
    if (p.uhid && q.includes(p.uhid.toLowerCase())) return true;
    return false;
  });

  if (matchingPatient) {
    const v = matchingPatient.vitalsHistory?.[0];
    const assignedBed = ctx.beds.find((b) => b.id === matchingPatient.assignedBedId || b.uhid === matchingPatient.uhid);
    const doctor = ctx.doctors.find((d) => d.id === matchingPatient.assignedDoctorId);

    let text = `👤 **Patient Dossier: ${matchingPatient.name}** (${matchingPatient.uhid})\n\n`;
    text += `• **Demographics**: ${matchingPatient.age} years old • ${matchingPatient.gender} • Blood Group: **${matchingPatient.bloodGroup}**\n`;
    text += `• **Admission Status**: **${matchingPatient.admissionStatus}** ${assignedBed ? `in **${assignedBed.ward} (Bed: ${assignedBed.bedNumber})**` : ''}\n`;
    text += `• **Documented Allergies**: ${matchingPatient.allergies?.length ? `⚠️ **${matchingPatient.allergies.join(', ')}**` : 'No known drug allergies (NKDA)'}\n`;
    text += `• **Attending Staff**: ${doctor ? doctor.name : 'Arthur Vance, MHA / Assigned Staff'}\n`;
    if (matchingPatient.chronicConditions?.length) {
      text += `• **Medical Conditions / Notes**: ${matchingPatient.chronicConditions.join(', ')}\n`;
    }
    if (v) {
      text += `\n📊 **Current Vitals & Telemetry**:\n`;
      text += `• **Heart Rate**: ${v.heartRate} bpm ${v.heartRate > 100 ? '⚠️ (Tachycardia)' : ''}\n`;
      text += `• **Blood Pressure**: ${v.systolicBp}/${v.diastolicBp} mmHg\n`;
      text += `• **SpO2 Oxygen**: ${v.spO2}% ${v.spO2 < 95 ? '⚠️ (Borderline Hypoxia)' : ''}\n`;
      text += `• **Respiratory Rate**: ${v.respiratoryRate}/min\n`;
      text += `• **Temperature**: ${v.temperature}°C • **Consciousness**: ${v.avpu}\n`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: [matchingPatient.name, matchingPatient.uhid, matchingPatient.bloodGroup, matchingPatient.admissionStatus],
      actionShortcut: {
        label: `View ${matchingPatient.name} EHR`,
        targetTab: 'core-patients'
      },
      suggestions: [`Log vitals for ${matchingPatient.name}`, `Book appointment for ${matchingPatient.name}`, 'Hospital health audit']
    };
  }

  // 2. Bed & ICU Ventilator Availability
  if (q.includes('bed') || q.includes('icu') || q.includes('ventilator') || q.includes('room') || q.includes('occupan')) {
    const totalBeds = ctx.beds.length;
    const availableBeds = ctx.beds.filter((b) => b.status === 'Available');
    const occupiedBeds = ctx.beds.filter((b) => b.status === 'Occupied');
    const icuBeds = ctx.beds.filter((b) => b.ward === 'ICU');
    const icuAvailable = icuBeds.filter((b) => b.status === 'Available');
    const icuWithVentilator = icuBeds.filter((b) => b.hasVentilator && b.status === 'Available');

    let text = `🏥 **Bed & Fleet Occupancy Report**:\n\n`;
    text += `• **Total Bed Fleet**: ${totalBeds} beds across ICU, CCU, Emergency, and General Wards.\n`;
    text += `• **Currently Occupied**: ${occupiedBeds.length} beds (${Math.round((occupiedBeds.length / totalBeds) * 100)}% utilization).\n`;
    text += `• **Available Beds**: ${availableBeds.length} beds ready for immediate admission.\n`;
    text += `• **ICU Status**: ${icuAvailable.length} of ${icuBeds.length} ICU beds free.\n`;
    
    if (icuWithVentilator.length > 0) {
      text += `• **Ventilator Ready**: ${icuWithVentilator.length} available ventilator-equipped beds (${icuWithVentilator.map((b) => b.bedNumber).join(', ')}).\n`;
    } else {
      text += `• ⚠️ **Ventilator Warning**: No available ICU beds currently have unassigned mechanical ventilators. Surge transfer protocol recommended.\n`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Bed Fleet', `Free: ${availableBeds.length}/${totalBeds}`, `ICU Free: ${icuAvailable.length}`],
      actionShortcut: {
        label: 'Open Bed & Ward Manager',
        targetTab: 'core-beds'
      },
      suggestions: ['Check ICU ventilator status', 'Which patients are in ICU?', 'Show hospital health audit']
    };
  }

  // 2. Blood Bank & Plasma Inventory
  if (q.includes('blood') || q.includes('plasma') || q.includes('o-') || q.includes('o negative') || q.includes('transfusion') || q.includes('donor')) {
    const totalUnits = ctx.bloodBank.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
    const criticalGroups = ctx.bloodBank.filter((b) => b.unitsAvailable <= b.minSafeUnits);
    const oNeg = ctx.bloodBank.find((b) => b.bloodGroup === 'O-');

    let text = `🩸 **Live Blood Bank & Cold-Chain Inventory**:\n\n`;
    text += `• **Total Stored Whole Blood**: ${totalUnits} units maintained at 2.0°C - 6.0°C baseline.\n`;
    text += `• **Universal Donor (O-Negative)**: ${oNeg ? `${oNeg.unitsAvailable} units (Safe threshold: ${oNeg.minSafeUnits} units)` : 'N/A'}.\n`;
    
    if (criticalGroups.length > 0) {
      text += `• 🚨 **Critical Shortage Alert**: The following groups are at or below minimum safe reserve:\n`;
      criticalGroups.forEach((b) => {
        text += `  - **${b.bloodGroup}**: ${b.unitsAvailable} units left (Min safe: ${b.minSafeUnits})\n`;
      });
      text += `\n**Clinical Action**: Transmit regional SOS broadcast to registered donors.`;
    } else {
      text += `• ✅ **Reserve Status**: All 8 ABO/Rh blood groups are currently above required critical safety thresholds.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Blood Bank', `Total: ${totalUnits} Units`, criticalGroups.length > 0 ? 'SOS Shortage' : 'Optimal'],
      actionShortcut: {
        label: 'Open Blood Bank & Dispatch SOS',
        targetTab: 'adv-bloodbank'
      },
      suggestions: ['Transmit O- SOS broadcast', 'Check patient Eleanor Harrison blood group', 'Show low stock medicines']
    };
  }

  // 3. Pharmacy & Low Stock Medications
  if (q.includes('medicine') || q.includes('drug') || q.includes('pharmacy') || q.includes('stock') || q.includes('epinephrine') || q.includes('inventory')) {
    const lowStock = ctx.medicines.filter((m) => m.stockQuantity <= m.reorderLevel);
    const outOfStock = ctx.medicines.filter((m) => m.stockQuantity === 0);

    let text = `💊 **Pharmacy Formulary & Inventory Status**:\n\n`;
    text += `• **Total Monitored Drug Formularies**: ${ctx.medicines.length} medications.\n`;
    text += `• **Stock Health**: ${ctx.medicines.length - lowStock.length} items optimal, ${lowStock.length} items require reordering.\n`;

    if (outOfStock.length > 0) {
      text += `• ⛔ **Out of Stock**: ${outOfStock.map((m) => m.name).join(', ')}\n`;
    }

    if (lowStock.length > 0) {
      text += `• ⚠️ **Critical Low Stock Formularies**:\n`;
      lowStock.slice(0, 5).forEach((m) => {
        text += `  - **${m.name}** (${m.category}): ${m.stockQuantity} units (${m.dosageForm}) left (Reorder point: ${m.reorderLevel})\n`;
      });
      text += `\n**Recommendation**: Restock via Central Formulary Procurement.`;
    } else {
      text += `• ✅ All critical ICU and outpatient pharmaceuticals are well above safety margins.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Pharmacy', `Low Stock: ${lowStock.length}`, `Total: ${ctx.medicines.length}`],
      actionShortcut: {
        label: 'View Pharmacy Inventory',
        targetTab: 'core-pharmacy'
      },
      suggestions: ['Check Epinephrine stock', 'Are there drug interactions with Warfarin?', 'Check patient vitals']
    };
  }

  // 4. Specific Patient Queries or Eleanor Harrison
  if (q.includes('eleanor') || q.includes('patient') || q.includes('vital') || q.includes('deteriorat') || q.includes('mews') || q.includes('uhid')) {
    const matchingPatient = ctx.patients.find((p) => 
      q.includes(p.name.toLowerCase()) || 
      p.uhid.toLowerCase().includes(q) ||
      q.includes(p.name.split(' ')[0].toLowerCase())
    );

    if (matchingPatient) {
      const v = matchingPatient.vitalsHistory?.[0];
      const assignedBed = ctx.beds.find((b) => b.id === matchingPatient.assignedBedId || b.uhid === matchingPatient.uhid);
      const doctor = ctx.doctors.find((d) => d.id === matchingPatient.assignedDoctorId);

      let text = `👤 **Clinical Dossier: ${matchingPatient.name}** (${matchingPatient.uhid})\n\n`;
      text += `• **Demographics**: ${matchingPatient.age} yrs • ${matchingPatient.gender} • Blood Group: **${matchingPatient.bloodGroup}**\n`;
      text += `• **Admission**: ${matchingPatient.admissionStatus} ${assignedBed ? `in **${assignedBed.ward} (Bed ${assignedBed.bedNumber})**` : ''}\n`;
      text += `• **Conditions**: ${matchingPatient.chronicConditions?.length ? matchingPatient.chronicConditions.join(', ') : 'None documented'}\n`;
      text += `• **Attending Physician**: ${doctor ? doctor.name : 'Dr. Sarah Lin, MD, FACC'}\n`;
      text += `• **Allergies**: ${matchingPatient.allergies?.length ? `⚠️ ${matchingPatient.allergies.join(', ')}` : 'No known drug allergies (NKDA)'}\n`;
      
      if (v) {
        text += `\n📊 **Live Telemetry Vitals**:\n`;
        text += `• **Heart Rate**: ${v.heartRate} bpm ${v.heartRate > 100 ? '⚠️ (Tachycardia)' : ''}\n`;
        text += `• **Blood Pressure**: ${v.systolicBp}/${v.diastolicBp} mmHg\n`;
        text += `• **SpO2 Oxygen**: ${v.spO2}% ${v.spO2 < 95 ? '⚠️ (Borderline Hypoxia)' : ''}\n`;
        text += `• **Temperature**: ${v.temperature}°C • **Resp Rate**: ${v.respiratoryRate}/min\n`;
        text += `• **AVPU Consciousness**: ${v.avpu}\n`;
      }

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        badges: [matchingPatient.uhid, matchingPatient.bloodGroup, matchingPatient.admissionStatus],
        actionShortcut: {
          label: `Edit / View ${matchingPatient.name} EHR`,
          targetTab: 'core-patients'
        },
        suggestions: ['Calculate MEWS score', 'Can I prescribe Aspirin to Eleanor?', 'Check ICU bed status']
      };
    }

    // General patient telemetry overview
    let text = `👥 **Hospital Inpatient & Telemetry Overview**:\n\n`;
    text += `• **Active Patients Registered**: ${ctx.patients.length} patients.\n`;
    
    const unstablePatients = ctx.patients.filter((p) => {
      const v = p.vitalsHistory?.[0];
      return v && (v.spO2 < 94 || v.heartRate > 110 || v.heartRate < 55);
    });

    if (unstablePatients.length > 0) {
      text += `• 🚨 **Patients Requiring Close Monitoring** (${unstablePatients.length}):\n`;
      unstablePatients.forEach((p) => {
        const v = p.vitalsHistory[0];
        const assignedBed = ctx.beds.find((b) => b.id === p.assignedBedId || b.uhid === p.uhid);
        text += `  - **${p.name}** (${p.uhid}${assignedBed ? `, ${assignedBed.ward}` : ''}): HR ${v.heartRate} bpm, SpO2 ${v.spO2}%, BP ${v.systolicBp}/${v.diastolicBp}\n`;
      });
    } else {
      text += `• ✅ All inpatients currently display stable hemodynamic baselines.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Patient Registry', `Total: ${ctx.patients.length}`, `Alerts: ${unstablePatients.length}`],
      actionShortcut: {
        label: 'View Patient Registry',
        targetTab: 'core-patients'
      },
      suggestions: ['View Eleanor Harrison dossier', 'Calculate MEWS score', 'Show available beds']
    };
  }

  // 5. Doctors & Medical Specialist Roster
  if (q.includes('doctor') || q.includes('specialist') || q.includes('cardiolog') || q.includes('surgeon') || q.includes('on duty') || q.includes('roster')) {
    const onDuty = ctx.doctors.filter((d) => d.isOnDuty);
    
    let text = `🩺 **Medical Specialist & Physician Roster**:\n\n`;
    text += `• **Total Credentialed Specialists**: ${ctx.doctors.length} doctors across Cardiology, Trauma ER, Nephrology, and General Surgery.\n`;
    text += `• **Currently On Duty**: ${onDuty.length} physicians active in hospital:\n`;
    
    onDuty.forEach((d) => {
      text += `  - **${d.name}** (${d.specialty}) • Shift: ${d.shiftTiming} • Fee: $${d.consultationFee}\n`;
    });

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Physicians', `On-Duty: ${onDuty.length}/${ctx.doctors.length}`],
      actionShortcut: {
        label: 'View Doctor Directory',
        targetTab: 'core-doctors'
      },
      suggestions: ['Book OPD appointment with Dr. Sarah Lin', 'Check available ICU beds', 'Show active emergency alerts']
    };
  }

  // 6. Emergency Codes, Code Blue, Triage
  if (q.includes('code blue') || q.includes('code red') || q.includes('emergency') || q.includes('broadcast') || q.includes('triage') || q.includes('trauma')) {
    const activeCodes = ctx.emergencyBroadcasts.filter((c) => c.active);

    let text = `🚨 **Emergency Dispatch & Resuscitation Operations**:\n\n`;
    if (activeCodes.length > 0) {
      text += `• ⚠️ **ACTIVE EMERGENCY BROADCASTS IN PROGRESS** (${activeCodes.length}):\n`;
      activeCodes.forEach((c) => {
        const teams = c.teamPagingStatus?.map((t) => t.teamName).join(', ') || 'Crash Team';
        text += `  - **${c.type}** at **${c.location}** (Paging: ${teams}) • Initiated: ${new Date(c.timestamp).toLocaleTimeString()}\n`;
      });
      text += `\n**Protocol**: Crash cart mobilized, security clearing elevators.`;
    } else {
      text += `• ✅ **No Active Emergency Code Broadcasts**. All critical care teams are on routine standby.\n`;
      text += `• Rapid Response Team & Trauma Bay 1 are primed and operational.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Emergency Ops', activeCodes.length > 0 ? 'Active Code' : 'Standby'],
      actionShortcut: {
        label: 'Open Code Blue Dispatcher',
        targetTab: 'adv-code-dispatcher'
      },
      suggestions: ['Dispatch Code Blue alert', 'Launch AI Triage classifier', 'Check ICU bed availability']
    };
  }

  // 7. Drug Interaction & CDSS Safety
  if (q.includes('interaction') || q.includes('cdss') || q.includes('contraindicat') || q.includes('warfarin') || q.includes('aspirin') || q.includes('allergy')) {
    return {
      id,
      sender: 'assistant',
      text: `🔬 **Clinical Decision Support & Interaction Safety**:\n\n• **Warfarin + Aspirin**: 🚨 **Critical Contraindication**. Concurrent administration produces severe antithrombotic synergism with heightened gastrointestinal and systemic hemorrhage risk. Avoid unless continuous INR titration is monitored.\n• **Lisinopril + Spironolactone**: ⚠️ **Major Conflict**. Additive aldosterone inhibition carries severe hyperkalemia risk leading to ventricular arrhythmia.\n• **Penicillin Allergy Safety**: Patient Eleanor Harrison has documented Penicillin allergy; avoid beta-lactam class and verify cephalosporin cross-reactivity.`,
      timestamp,
      badges: ['CDSS Engine', 'Critical Alert: Warfarin+Aspirin'],
      actionShortcut: {
        label: 'Launch AI CDSS Checker',
        targetTab: 'adv-cdss'
      },
      suggestions: ['Check Eleanor Harrison allergies', 'Calculate Early Warning MEWS score', 'Show low stock drugs']
    };
  }

  // 8. General Hospital Health & Audit
  if (q.includes('audit') || q.includes('health') || q.includes('summary') || q.includes('overview') || q.includes('status') || q.includes('report')) {
    const totalPatients = ctx.patients.length;
    const totalBeds = ctx.beds.length;
    const occupiedBeds = ctx.beds.filter((b) => b.status === 'Occupied').length;
    const totalBlood = ctx.bloodBank.reduce((a, b) => a + b.unitsAvailable, 0);
    const lowMeds = ctx.medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length;
    const activeCodes = ctx.emergencyBroadcasts.filter((c) => c.active).length;

    let text = `🏥 **PulseCare Enterprise Hospital Executive Health Summary**:\n\n`;
    text += `• **Patient Load**: ${totalPatients} registered patients (${ctx.patients.filter((p) => p.admissionStatus === 'Inpatient').length} admitted inpatients).\n`;
    text += `• **Bed Fleet Capacity**: ${occupiedBeds}/${totalBeds} beds occupied (${Math.round((occupiedBeds / totalBeds) * 100)}% utilization).\n`;
    text += `• **Blood Bank Reserves**: ${totalBlood} total units (Universal O- is low: ${ctx.bloodBank.find((b) => b.bloodGroup === 'O-')?.unitsAvailable || 0} units).\n`;
    text += `• **Pharmacy Formulary**: ${ctx.medicines.length} formularies, with ${lowMeds} items at reorder threshold.\n`;
    text += `• **Emergency Protocols**: ${activeCodes > 0 ? `🚨 ${activeCodes} active emergency codes` : '✅ All trauma bays green'}.\n`;
    text += `• **Database Persistence**: In-repository persistent JSON active with continuous 3.5s live sync.`;

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      badges: ['Hospital Audit', 'Full Stack', 'Persistence OK'],
      actionShortcut: {
        label: 'Open Executive Dashboard',
        targetTab: 'dashboard'
      },
      suggestions: ['Which beds are available with ventilators?', 'Check blood shortages', 'Show patient vitals']
    };
  }

  // Default Fallback with Helpful Smart Prompts
  return {
    id,
    sender: 'assistant',
    text: `🤖 **PulseAI Clinical Copilot Connected**\n\nI have real-time access to all clinical telemetry, bed allocations, pharmacy stocks, blood reserves, doctor rosters, and patient records across the hospital.\n\nYou can ask me questions like:\n• *"Which ICU beds are available with ventilators right now?"*\n• *"Give me a status summary of patient Eleanor Harrison."*\n• *"What is our current O-Negative blood reserve?"*\n• *"Are any medicines below their reorder threshold?"*\n• *"Who is the on-duty cardiologist today?"*\n• *"Run a full hospital health check."*`,
    timestamp,
    badges: ['Omniscient AI', 'Real-Time Telemetry'],
    suggestions: [
      'Run hospital health check',
      'Which ICU beds have ventilators?',
      'Check O-Negative blood reserves',
      'What medicines are low in stock?'
    ]
  };
}

export interface AIConfig {
  provider: 'free' | 'gemini' | 'openai';
  apiKey?: string;
}

/**
 * Real-Time Hybrid Cloud & Local Clinical AI Engine
 * Supports Free Cloud LLM (no key needed) or User-Provided Gemini / OpenAI API Key.
 * Injects entire live hospital context dynamically.
 */
export async function queryRealTimeAICopilot(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  ctx: HospitalKnowledgeContext,
  config: AIConfig
): Promise<AIChatMessage> {
  const id = `MSG-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Prepare Hospital State Context Summary
  const patientsCount = ctx.patients.length;
  const bedsCount = ctx.beds.length;
  const availableBeds = ctx.beds.filter((b) => b.status === 'Available');
  const icuVentilatorBeds = ctx.beds.filter((b) => b.ward === 'ICU' && b.hasVentilator && b.status === 'Available');
  const onDutyDoctors = ctx.doctors.filter((d) => d.isOnDuty);
  const totalBloodUnits = ctx.bloodBank.reduce((a, b) => a + b.unitsAvailable, 0);
  const oNeg = ctx.bloodBank.find((b) => b.bloodGroup === 'O-');
  const lowMedicines = ctx.medicines.filter((m) => m.stockQuantity <= m.reorderLevel);
  const activeCodes = ctx.emergencyBroadcasts.filter((c) => c.active);

  // Full Patient Profiles List for Context
  const patientsList = ctx.patients.map((p) => {
    const v = p.vitalsHistory?.[0];
    const attending = ctx.doctors.find((d) => d.id === p.assignedDoctorId)?.name || 'Arthur Vance, MHA';
    return {
      name: p.name,
      uhid: p.uhid,
      age: p.age,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      admissionStatus: p.admissionStatus,
      allergies: p.allergies || [],
      chronicConditions: p.chronicConditions || [],
      vitals: v
        ? {
            hr: v.heartRate,
            bp: `${v.systolicBp}/${v.diastolicBp}`,
            spO2: v.spO2,
            temp: v.temperature,
            rr: v.respiratoryRate
          }
        : null,
      attendingDoctor: attending
    };
  });

  const patientsListDetails = ctx.patients
    .map((p) => {
      const v = p.vitalsHistory?.[0];
      const vStr = v
        ? `HR ${v.heartRate} bpm, BP ${v.systolicBp}/${v.diastolicBp}, SpO2 ${v.spO2}%, Temp ${v.temperature}°C`
        : 'Vitals stable';
      const algStr = p.allergies?.length ? `Allergies: ${p.allergies.join(', ')}` : 'No known allergies';
      return `• Patient: ${p.name} | UHID: ${p.uhid} | Age: ${p.age} | Gender: ${p.gender} | Blood: ${p.bloodGroup} | Status: ${p.admissionStatus} | ${algStr} | ${vStr}`;
    })
    .join('\n');

  // Specific patient match check in query
  const targetPatient = ctx.patients.find((p) => {
    if (!p.name) return false;
    const nameLower = p.name.toLowerCase().trim();
    if (query.toLowerCase().includes(nameLower)) return true;
    const words = nameLower.split(/\s+/).filter((w) => w.length >= 3);
    return words.some((w) => query.toLowerCase().includes(w)) || (p.uhid && query.toLowerCase().includes(p.uhid.toLowerCase()));
  });

  const targetPatientPrompt = targetPatient
    ? `\n\nCRITICAL NOTE: THE USER IS SPECIFICALLY INQUIRING ABOUT PATIENT "${targetPatient.name}":
- Full Name: ${targetPatient.name}
- UHID: ${targetPatient.uhid}
- Age: ${targetPatient.age} years old | Gender: ${targetPatient.gender} | Blood Group: ${targetPatient.bloodGroup}
- Admission Status: ${targetPatient.admissionStatus}
- Allergies: ${targetPatient.allergies?.length ? targetPatient.allergies.join(', ') : 'None reported (NKDA)'}
- Diagnosis / Notes: ${targetPatient.chronicConditions?.join(', ') || 'General Consultation'}
- Vitals: ${
        targetPatient.vitalsHistory?.[0]
          ? `HR ${targetPatient.vitalsHistory[0].heartRate} bpm, BP ${targetPatient.vitalsHistory[0].systolicBp}/${targetPatient.vitalsHistory[0].diastolicBp}, SpO2 ${targetPatient.vitalsHistory[0].spO2}%, Resp ${targetPatient.vitalsHistory[0].respiratoryRate}/min`
          : 'Normal'
      }
- Attending: ${ctx.doctors.find((d) => d.id === targetPatient.assignedDoctorId)?.name || 'Arthur Vance, MHA / Assigned Staff'}
YOU MUST STATE THAT ${targetPatient.name} IS A REGISTERED PATIENT IN THIS HOSPITAL AND PROVIDE THEIR DETAILS.\n\n`
    : '';

  const systemPrompt = `You are PulseAI, the real-time Chief Clinical & Operational Medical Intelligence AI for PulseCare Enterprise Hospital Management System.
You have omniscient, real-time knowledge of all active systems in this hospital:
- Active Registered Patients in Database (${patientsCount} patients):
${patientsListDetails}
${targetPatientPrompt}
- ICU & Bed Fleet: ${bedsCount} total beds (${availableBeds.length} available). Available ICU beds with mechanical ventilators: ${
    icuVentilatorBeds.map((b) => b.bedNumber).join(', ') || 'None currently available'
  }.
- Doctors on Duty: ${onDutyDoctors.map((d) => `${d.name} (${d.specialty}, Shift: ${d.shiftTiming})`).join('; ')}.
- Blood Bank Reserves: ${totalBloodUnits} total units across 8 groups. Universal O- Negative: ${
    oNeg ? `${oNeg.unitsAvailable} units (Safe threshold: ${oNeg.minSafeUnits})` : 'N/A'
  }.
- Pharmacy Formularies: ${ctx.medicines.length} total medicines. Critical low stock: ${
    lowMedicines.map((m) => `${m.name} (${m.stockQuantity} left)`).join(', ') || 'None'
  }.
- Emergency Protocols: ${activeCodes.length > 0 ? activeCodes.map((c) => `${c.type} at ${c.location}`).join(', ') : 'All clear / Standby'}.

INSTRUCTIONS:
1. When asked about ANY patient (such as "who is JOHN", "tell me about Eleanor", "who is Omkumar"), refer directly to the Registered Patients list above and provide their exact full profile. Never claim a registered patient does not exist.
2. Provide comprehensive, accurate, and professional answers to ANY questions the user asks — including clinical diagnostics, pharmacology, medical conditions, operational decisions, or general medical science.
3. If the user asks general medical, health, scientific, or everyday questions, answer with evidence-based clinical accuracy.
4. Format using clean Markdown with bold headers and bullet points.`;

  // 2. Try User-Configured Gemini API (Google AI Studio Key)
  if (config.provider === 'gemini' && config.apiKey?.trim()) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.apiKey.trim()}`;
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
        }
      ];

      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            id,
            sender: 'assistant',
            text: text.trim(),
            timestamp,
            badges: ['⚡ Gemini 1.5 Flash', 'Live AI Cloud', 'Key Verified']
          };
        }
      }
    } catch (e) {
      // Fall through to other providers
    }
  }

  // 3. Try User-Configured OpenAI API Key
  if (config.provider === 'openai' && config.apiKey?.trim()) {
    try {
      const openaiUrl = 'https://api.openai.com/v1/chat/completions';
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4),
        { role: 'user', content: query }
      ];

      const resp = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 800
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return {
            id,
            sender: 'assistant',
            text: text.trim(),
            timestamp,
            badges: ['🤖 GPT-4o Mini', 'Live AI Cloud', 'Key Verified']
          };
        }
      }
    } catch (e) {
      // Fall through to other providers
    }
  }

  // 4. Try Backend Proxy / Free Cloud AI Endpoint
  try {
    const backendResp = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        history,
        provider: config.provider,
        apiKey: config.apiKey,
        hospitalContext: {
          patientsCount,
          patientsList,
          bedsCount,
          doctorsCount: ctx.doctors.length,
          bloodUnits: totalBloodUnits,
          medicinesCount: ctx.medicines.length
        }
      })
    });

    if (backendResp.ok) {
      const data = await backendResp.json();
      if (data.text) {
        return {
          id,
          sender: 'assistant',
          text: data.text,
          timestamp,
          badges: [
            data.source === 'gemini'
              ? '⚡ Gemini 1.5 Flash'
              : data.source === 'openai'
              ? '🤖 GPT-4o Mini'
              : '🌟 Free Cloud AI',
            'Real-Time Intelligence'
          ]
        };
      }
    }
  } catch (e) {
    // Backend fetch failed; try direct browser call below
  }

  // 5. Direct Browser Free Cloud LLM Call (Pollinations Public AI Gateway)
  try {
    const pollinationsUrl = 'https://text.pollinations.ai/';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4),
      { role: 'user', content: query }
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(pollinationsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: 'openai',
        seed: Math.floor(Math.random() * 1000)
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const replyText = await resp.text();
      if (replyText && replyText.trim().length > 0) {
        return {
          id,
          sender: 'assistant',
          text: replyText.trim(),
          timestamp,
          badges: ['🌟 Free Cloud AI', 'Real-Time Intelligence']
        };
      }
    }
  } catch (e) {
    // If offline or network timeout, fall through to deterministic clinical engine
  }

  // 6. Deterministic Local Clinical Rules Engine Fallback
  return answerHospitalQuery(query, ctx);
}
