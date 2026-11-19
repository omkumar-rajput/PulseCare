export type UserRole = 
  | 'admin' 
  | 'doctor' 
  | 'nurse' 
  | 'pharmacist' 
  | 'lab_technician' 
  | 'receptionist' 
  | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  department?: string;
  licenseNumber?: string;
}

// ----------------- Core Feature 1: Patients & EHR -----------------
export interface VitalRecord {
  id: string;
  timestamp: string;
  heartRate: number; // bpm
  systolicBp: number; // mmHg
  diastolicBp: number; // mmHg
  respiratoryRate: number; // breaths/min
  spO2: number; // %
  temperature: number; // °C
  avpu: 'Alert' | 'Voice' | 'Pain' | 'Unresponsive';
}

export interface Patient {
  id: string;
  uhid: string; // Unique Hospital Identification
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  admissionStatus: 'Outpatient' | 'Inpatient' | 'Emergency' | 'Discharged';
  assignedDoctorId?: string;
  assignedBedId?: string;
  admissionDate?: string;
  vitalsHistory: VitalRecord[];
  medicalTimeline: {
    id: string;
    date: string;
    title: string;
    type: 'admission' | 'consultation' | 'lab' | 'surgery' | 'prescription' | 'discharge';
    notes: string;
    doctorName: string;
  }[];
}

// ----------------- Core Feature 2: Doctors & Staff -----------------
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  qualifications: string;
  experienceYears: number;
  phone: string;
  email: string;
  consultationFee: number;
  rating: number;
  availableDays: string[];
  shiftTiming: string;
  isOnDuty: boolean;
  avatar: string;
}

// ----------------- Core Feature 3: Appointments & Queue -----------------
export interface Appointment {
  id: string;
  tokenNumber: number;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  timeSlot: string;
  type: 'OPD' | 'Follow-up' | 'Telemedicine' | 'Emergency';
  status: 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show';
  symptoms: string;
  createdDate: string;
}

// ----------------- Core Feature 4: Beds & Wards -----------------
export type WardType = 'ICU' | 'CCU' | 'Emergency' | 'General Ward A' | 'General Ward B' | 'Pediatric' | 'Maternity' | 'Surgical Suite';

export interface Bed {
  id: string;
  bedNumber: string;
  ward: WardType;
  floor: number;
  roomNumber: string;
  status: 'Available' | 'Occupied' | 'Sanitizing' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  uhid?: string;
  hasOxygenSupport: boolean;
  hasVentilator: boolean;
  dailyRate: number;
  admissionTimestamp?: string;
}

// ----------------- Core Feature 5: Pharmacy & Inventory -----------------
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'Sedative' | 'Antiviral' | 'Emergency IV';
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Ointment';
  strength: string;
  stockQuantity: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  manufacturer: string;
  sideEffects?: string;
  contraindications?: string[];
}

// ----------------- Core Feature 6: Laboratory & Diagnostics -----------------
export interface LabTestOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  uhid: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Radiology' | 'Pathology';
  sampleType: 'Blood' | 'Serum' | 'Urine' | 'Sputum' | 'Imaging';
  status: 'Order Placed' | 'Sample Collected' | 'Analyzing' | 'Report Ready' | 'Critical Alert';
  orderDate: string;
  reportDate?: string;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
  }[];
  findingsNotes?: string;
  technicianNotes?: string;
}

// ----------------- Core Feature 7: Billing & Invoicing -----------------
export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Room' | 'Consultation' | 'Lab' | 'Pharmacy' | 'Surgery' | 'Nursing';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  uhid: string;
  billingDate: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  insuranceClaim: {
    hasInsurance: boolean;
    provider?: string;
    policyNumber?: string;
    coverageAmount?: number;
    claimStatus?: 'Pending Approval' | 'Approved' | 'Partially Approved' | 'Rejected';
    copayAmount?: number;
  };
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Claim Processing';
  paymentMethod?: 'Card' | 'Cash' | 'Wire' | 'Insurance Direct';
}

// ----------------- Core Feature 8: Emergency Intake -----------------
export interface EmergencyCase {
  id: string;
  code: string;
  patientName: string;
  estimatedAge: number;
  gender: 'Male' | 'Female' | 'Other';
  arrivalMode: 'Ambulance' | 'Walk-in' | 'Police Escort' | 'Air Ambulance';
  triageSeverity: 'Red (Resuscitation)' | 'Orange (Emergent)' | 'Yellow (Urgent)' | 'Green (Standard)';
  chiefComplaint: string;
  arrivalTimestamp: string;
  status: 'Triage Pending' | 'In Trauma Bay' | 'Transferred to OT' | 'Admitted to ICU' | 'Stabilized';
  assignedDoctorName: string;
  bayNumber: string;
}

// ----------------- Core Feature 10: Digital Prescription -----------------
export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: '1-0-0' | '1-0-1' | '1-1-1' | '0-0-1' | 'SOS (As Needed)' | 'STAT (Immediate)';
  timing: 'Before Meals' | 'After Meals' | 'With Food' | 'Bedtime';
  durationDays: number;
  instructions: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  uhid: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  diagnosis: string;
  clinicalNotes: string;
  items: PrescriptionItem[];
  followUpDate?: string;
  digitalSignature: string;
}

// =====================================================================
// 10 UNIQUE & ADVANCED CUTTING-EDGE FEATURES
// =====================================================================

// Unique 1: AI Clinical Decision Support (CDSS) & DDI Checker
export interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
}

export interface AllergyConflict {
  drugName: string;
  allergenMatched: string;
  severity: 'Fatal Anaphylaxis Risk' | 'High' | 'Moderate';
  recommendation: string;
}

// Unique 2: Early Warning Score (MEWS/NEWS2)
export interface MewsAssessment {
  patientId: string;
  patientName: string;
  bedNumber: string;
  ward: string;
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High / Sepsis Risk' | 'Critical / Code Blue Imminent';
  recommendedAction: string;
  breakdown: {
    heartRateScore: number;
    bpScore: number;
    respScore: number;
    spO2Score: number;
    tempScore: number;
    avpuScore: number;
  };
  timestamp: string;
}

// Unique 3: Smart AI Emergency Triage Assistant
export interface TriagePrediction {
  esiLevel: 1 | 2 | 3 | 4 | 5;
  category: 'Resuscitation' | 'Emergent' | 'Urgent' | 'Less Urgent' | 'Non-Urgent';
  priorityColor: string;
  targetMaxWaitMinutes: number;
  redFlags: string[];
  diagnosticRecommendations: string[];
  suggestedDepartment: string;
  clinicalReasoning: string;
}

// Unique 4: Interactive Spatial Ward & Floor Plan
export interface HospitalFloor {
  floorNumber: number;
  name: string;
  description: string;
  totalBeds: number;
  occupiedBeds: number;
  wards: {
    name: WardType;
    zone: string;
    beds: Bed[];
  }[];
}

// Unique 5: Smart Blood Bank & Transfusion Matrix
export interface BloodInventoryItem {
  id: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  unitsAvailable: number;
  minSafeUnits: number;
  plasmaUnits: number;
  plateletsUnits: number;
  cryoUnits: number;
  temperatureCelsius: number; // e.g. 3.8°C (safe range 2°C - 6°C)
  tempStatus: 'Optimal' | 'Warning' | 'Critical';
  batches: {
    batchId: string;
    collectedDate: string;
    expiryDate: string;
    daysUntilExpiry: number;
  }[];
}

// Unique 6: Ambient Clinical AI Scribe
export interface ScribeSOAPNote {
  id: string;
  rawAudioTranscript: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  suggestedICD10: {
    code: string;
    description: string;
    confidence: number;
  }[];
  detectedVitals?: Partial<VitalRecord>;
  createdAt: string;
}

// Unique 7: Cryptographic PHI Audit Ledger (HIPAA Proof)
export interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'VIEW_RECORD' | 'UPDATE_EHR' | 'EXPORT_PHI' | 'DISPENSE_MEDICATION' | 'CODE_DISPATCH' | 'LOGIN_ATTEMPT';
  resourceId: string;
  resourceType: 'Patient' | 'LabReport' | 'Prescription' | 'Billing' | 'BloodBank';
  details: string;
  ipAddress: string;
  previousHash: string;
  currentHash: string; // SHA-256 hash
}

// Unique 8: Emergency Code Blue & Disaster Dispatcher
export type EmergencyCodeType = 'Code Blue (Cardiac)' | 'Code Red (Fire)' | 'Code Black (Threat)' | 'Code Pink (Infant)' | 'Mass Casualty Incident';

export interface EmergencyBroadcast {
  id: string;
  type: EmergencyCodeType;
  location: string;
  reportedBy: string;
  timestamp: string;
  active: boolean;
  urgency: 'MAXIMUM_CRITICAL' | 'HIGH';
  teamPagingStatus: {
    teamName: string;
    status: 'Notified' | 'En Route' | 'On Scene' | 'Standby';
    respondersCount: number;
  }[];
  resolutionNotes?: string;
}

// Unique 9: Organ Transplant & Donor Match Registry
export interface OrganDonor {
  id: string;
  donorUhid: string;
  donorName: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  hlaMarkers: string[]; // e.g. ['A1', 'A2', 'B8', 'DR3']
  availableOrgans: ('Kidney' | 'Liver' | 'Heart' | 'Lungs' | 'Cornea')[];
  harvestTime: string;
  coldIschemiaMaxHours: number; // e.g. Heart: 4-6h, Kidney: 24-36h
  coldIschemiaElapsedHours: number;
  hospitalLocation: string;
  status: 'Procured' | 'Cross-Matching' | 'Transit' | 'Transplanted';
}

export interface OrganRecipient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  hlaMarkers: string[];
  organNeeded: 'Kidney' | 'Liver' | 'Heart' | 'Lungs' | 'Cornea';
  urgencyTier: 'Status 1A (Extreme Urgent)' | 'Status 1B (Urgent)' | 'Status 2 (Elective)';
  waitingDays: number;
}

// Unique 10: Telemedicine Virtual Consultation Suite
export interface TelemedicineSession {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledTime: string;
  status: 'Waiting Room' | 'Live Session' | 'Ended';
  roomId: string;
  liveVitalsTelemetry: {
    heartRate: number;
    spO2: number;
    respiratoryRate: number;
    bloodPressure: string;
  };
  meetingNotes: string;
  whiteboardNotes: string;
}
