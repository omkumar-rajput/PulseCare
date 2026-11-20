import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Patient,
  Doctor,
  Appointment,
  Bed,
  Medicine,
  LabTestOrder,
  Invoice,
  EmergencyCase,
  BloodInventoryItem,
  AuditBlock,
  EmergencyBroadcast,
  OrganDonor,
  OrganRecipient,
  Prescription,
  TelemedicineSession,
  VitalRecord
} from '../types';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_MEDICINES,
  INITIAL_LAB_ORDERS,
  INITIAL_INVOICES,
  INITIAL_APPOINTMENTS,
  INITIAL_EMERGENCY_CASES,
  INITIAL_BLOOD_BANK,
  INITIAL_AUDIT_LEDGER,
  INITIAL_ORGAN_DONORS,
  INITIAL_ORGAN_RECIPIENTS,
  INITIAL_EMERGENCY_BROADCASTS,
  INITIAL_TELEMEDICINE_SESSIONS
} from '../data/mockData';
import { createAuditBlock } from '../utils/cryptoAudit';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
}

const DEFAULT_PERSONAS: UserProfile[] = [
  {
    id: 'ADM-01',
    name: 'Arthur Vance, MHA',
    role: 'admin',
    title: 'Hospital Administrator / Chief of Operations',
    email: 'admin.vance@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    department: 'Hospital Administration & Executive Operations',
    permissions: ['ALL_ACCESS', 'EDIT_PATIENTS', 'EDIT_BILLING', 'EDIT_BEDS', 'MANAGE_PERSONAS', 'DISPATCH_CODE'],
    isSystemDefault: true,
  },
  {
    id: 'DOC-OMK',
    name: 'Omkumar Rajput',
    role: 'doctor',
    title: 'Consultant Physician',
    email: 'omkumar.rajput@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250',
    department: 'Cardiovascular Sciences',
    licenseNumber: 'MD-99412-CARD',
    permissions: ['WRITE_PRESCRIPTION', 'VIEW_EHR', 'ORDER_LABS', 'CDSS_ACCESS', 'TELEMEDICINE'],
    isSystemDefault: true,
  },
  {
    id: 'DOC-01',
    name: 'Dr. Sarah Lin, MD, FACC',
    role: 'doctor',
    title: 'Senior Interventional Cardiologist',
    email: 'sarah.lin@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    department: 'Cardiovascular Sciences',
    licenseNumber: 'MD-88392-CAR',
    permissions: ['WRITE_PRESCRIPTION', 'VIEW_EHR', 'ORDER_LABS', 'CDSS_ACCESS', 'TELEMEDICINE'],
    isSystemDefault: true,
  },
  {
    id: 'NUR-01',
    name: 'Nurse Clara Hughes, BSN, RN',
    role: 'nurse',
    title: 'Head Nurse - Intensive Care Unit',
    email: 'clara.hughes@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=250',
    department: 'Intensive Care Unit (ICU)',
    licenseNumber: 'RN-55410-ICU',
    permissions: ['LOG_VITALS', 'MEWS_MONITOR', 'BED_SANITIZATION', 'ER_INTAKE'],
    isSystemDefault: true,
  },
  {
    id: 'PHARM-01',
    name: 'Robert Tanaka, PharmD',
    role: 'pharmacist',
    title: 'Chief Clinical Pharmacist',
    email: 'robert.tanaka@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    department: 'Clinical Pharmacology & Dispensing',
    licenseNumber: 'RPH-19042',
    permissions: ['DISPENSE_DRUGS', 'MANAGE_INVENTORY', 'DDI_REVIEW'],
    isSystemDefault: true,
  },
  {
    id: 'LAB-01',
    name: 'Chen Wei, MLS (ASCP)',
    role: 'lab_technician',
    title: 'Laboratory Diagnostic Specialist',
    email: 'chen.wei@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Pathology & Molecular Diagnostics',
    licenseNumber: 'MLS-77209',
    permissions: ['RUN_ASSAYS', 'VALIDATE_RESULTS', 'UPLOAD_REPORTS'],
    isSystemDefault: true,
  },
  {
    id: 'REC-01',
    name: 'Jessica Gomez',
    role: 'receptionist',
    title: 'Front Desk & Patient Admissions',
    email: 'jessica.gomez@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    department: 'Patient Admissions & Front Desk',
    permissions: ['REGISTER_PATIENTS', 'SCHEDULE_OPD', 'ISSUE_TOKENS'],
    isSystemDefault: true,
  },
  {
    id: 'PAT-101',
    name: 'Eleanor Harrison',
    role: 'patient',
    title: 'Verified Inpatient Portal',
    email: 'eleanor.harrison@email.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    department: 'Patient Portal',
    permissions: ['VIEW_OWN_EHR', 'VIEW_OWN_BILLS', 'BOOK_OWN_OPD'],
    isSystemDefault: true,
  }
];

interface HospitalContextType {
  // Authentication & Personas
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  personas: UserProfile[];
  addPersona: (data: Omit<UserProfile, 'id'>) => Promise<UserProfile>;
  deletePersona: (id: string) => Promise<boolean>;

  // Navigation & Preferences
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  liveSyncActive: boolean;

  // Core Data
  patients: Patient[];
  doctors: Doctor[];
  beds: Bed[];
  medicines: Medicine[];
  labOrders: LabTestOrder[];
  invoices: Invoice[];
  appointments: Appointment[];
  emergencyCases: EmergencyCase[];
  prescriptions: Prescription[];

  // Advanced Modules Data
  bloodBank: BloodInventoryItem[];
  auditLedger: AuditBlock[];
  emergencyBroadcasts: EmergencyBroadcast[];
  organDonors: OrganDonor[];
  organRecipients: OrganRecipient[];
  telemedicineSessions: TelemedicineSession[];

  // Notifications
  notifications: ToastNotification[];
  addNotification: (type: ToastNotification['type'], title: string, message: string) => void;
  dismissNotification: (id: string) => void;

  // Actions & Full Admin Editing
  addPatient: (patient: Omit<Patient, 'id' | 'uhid' | 'vitalsHistory' | 'medicalTimeline'>) => Promise<Patient>;
  editPatient: (patientId: string, updates: Partial<Patient>) => Promise<void>;
  updatePatientVitals: (patientId: string, vitals: Omit<VitalRecord, 'id' | 'timestamp'>) => void;
  assignBedToPatient: (bedId: string, patientId: string) => void;
  dischargeBed: (bedId: string) => void;
  editBed: (bedId: string, updates: Partial<Bed>) => Promise<void>;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber' | 'createdDate'>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  dispenseMedicine: (medicineId: string, quantity: number) => boolean;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  editMedicine: (medicineId: string, updates: Partial<Medicine>) => Promise<void>;
  createLabOrder: (order: Omit<LabTestOrder, 'id' | 'orderNumber' | 'orderDate'>) => void;
  updateLabStatus: (orderId: string, status: LabTestOrder['status'], findingsNotes?: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'billingDate'>) => Invoice;
  editInvoice: (invoiceId: string, updates: Partial<Invoice>) => Promise<void>;
  recordAuditLog: (
    action: AuditBlock['action'],
    resourceId: string,
    resourceType: AuditBlock['resourceType'],
    details: string
  ) => Promise<void>;
  broadcastEmergencyCode: (type: EmergencyBroadcast['type'], location: string) => void;
  resolveEmergencyBroadcast: (id: string, notes: string) => void;
  createPrescription: (prescription: Omit<Prescription, 'id' | 'rxNumber' | 'date'>) => void;
  updateBloodStock: (bloodGroup: string, deltaUnits: number) => void;
  resetAllDataToDefaults: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [liveSyncActive, setLiveSyncActive] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Personas List (Persisted across sessions)
  const [personas, setPersonas] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('pc_personas');
    return saved ? JSON.parse(saved) : DEFAULT_PERSONAS;
  });

  // State with LocalStorage & Initial Fallbacks
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('pc_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('pc_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem('pc_beds');
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pc_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [labOrders, setLabOrders] = useState<LabTestOrder[]>(() => {
    const saved = localStorage.getItem('pc_lab_orders');
    return saved ? JSON.parse(saved) : INITIAL_LAB_ORDERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('pc_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pc_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>(INITIAL_EMERGENCY_CASES);
  const [bloodBank, setBloodBank] = useState<BloodInventoryItem[]>(INITIAL_BLOOD_BANK);
  const [auditLedger, setAuditLedger] = useState<AuditBlock[]>(INITIAL_AUDIT_LEDGER);
  const [emergencyBroadcasts, setEmergencyBroadcasts] = useState<EmergencyBroadcast[]>(INITIAL_EMERGENCY_BROADCASTS);
  const [organDonors] = useState<OrganDonor[]>(INITIAL_ORGAN_DONORS);
  const [organRecipients] = useState<OrganRecipient[]>(INITIAL_ORGAN_RECIPIENTS);
  const [telemedicineSessions] = useState<TelemedicineSession[]>(INITIAL_TELEMEDICINE_SESSIONS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Find active profile
  const currentUser = personas.find((p) => p.role === currentRole) || personas[0];

  // Dark mode HTML class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save to LocalStorage permanently
  useEffect(() => {
    localStorage.setItem('pc_personas', JSON.stringify(personas));
  }, [personas]);

  useEffect(() => {
    localStorage.setItem('pc_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('pc_beds', JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem('pc_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pc_lab_orders', JSON.stringify(labOrders));
  }, [labOrders]);

  useEffect(() => {
    localStorage.setItem('pc_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('pc_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('pc_doctors', JSON.stringify(doctors));
  }, [doctors]);

  // Cross-module sync: Synchronize doctor & patient personas into doctors & patients lists
  useEffect(() => {
    // 1. Ensure any doctor persona is registered in the Doctor Directory
    const doctorPersonas = personas.filter((p) => p.role === 'doctor');
    if (doctorPersonas.length > 0) {
      setDoctors((prevDocs) => {
        let updated = [...prevDocs];
        let hasChanges = false;
        doctorPersonas.forEach((dp) => {
          const docName = dp.name.startsWith('Dr.') ? dp.name : `Dr. ${dp.name}`;
          const exists = updated.some(
            (d) => d.id === `DOC-${dp.id}` || d.id === dp.id || d.name.toLowerCase() === docName.toLowerCase()
          );
          if (!exists) {
            updated.push({
              id: `DOC-${dp.id}`,
              name: docName,
              specialty: dp.department || dp.title || 'General Medicine',
              department: dp.department || 'General Medicine',
              qualifications: dp.title || 'MBBS, MD',
              experienceYears: 8,
              phone: '+1 (555) 234-5678',
              email: dp.email,
              consultationFee: 120,
              rating: 4.9,
              availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              shiftTiming: '09:00 AM - 05:00 PM',
              isOnDuty: true,
              avatar: dp.avatar,
            });
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prevDocs;
      });
    }

    // 2. Ensure any patient persona is registered in the Patient Registry
    const patientPersonas = personas.filter((p) => p.role === 'patient');
    if (patientPersonas.length > 0) {
      setPatients((prevPats) => {
        let updated = [...prevPats];
        let hasChanges = false;
        patientPersonas.forEach((pp) => {
          const exists = updated.some(
            (pat) => pat.id === `PAT-${pp.id}` || pat.id === pp.id || pat.name.toLowerCase() === pp.name.toLowerCase()
          );
          if (!exists) {
            updated.unshift({
              id: `PAT-${pp.id}`,
              uhid: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              name: pp.name,
              age: 28,
              gender: 'Male',
              bloodGroup: 'O+',
              phone: '+1 (555) 345-6789',
              email: pp.email,
              address: 'Registered via Persona Intake Portal',
              emergencyContact: {
                name: 'Family Contact',
                relationship: 'Spouse',
                phone: '+1 (555) 999-1122',
              },
              allergies: [],
              chronicConditions: [pp.title || 'General Consultation'],
              admissionStatus: 'Outpatient',
              vitalsHistory: [
                {
                  id: `VIT-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  heartRate: 74,
                  systolicBp: 120,
                  diastolicBp: 80,
                  respiratoryRate: 16,
                  spO2: 98,
                  temperature: 37.0,
                  avpu: 'Alert',
                },
              ],
              medicalTimeline: [
                {
                  id: `TL-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  title: 'Patient Account Registered',
                  type: 'admission',
                  notes: 'Registered as verified patient in PulseCare OS.',
                  doctorName: 'Dr. Sarah Lin',
                },
              ],
            });
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prevPats;
      });
    }
  }, [personas]);

  // -------------------------------------------------------------
  // CONTINUOUS LIVE-SYNC AUTO-POLLING ENGINE (EVERY 3 SECONDS)
  // -------------------------------------------------------------
  useEffect(() => {
    let isSubscribed = true;

    const syncLiveState = async () => {
      try {
        const response = await fetch('/api/sync/live-state');
        if (!response.ok) return;
        const data = await response.json();
        if (!isSubscribed) return;

        setLiveSyncActive(true);

        if (data.personas && data.personas.length > 0) setPersonas(data.personas);
        if (data.patients && data.patients.length > 0) setPatients(data.patients);
        if (data.doctors && data.doctors.length > 0) setDoctors(data.doctors);
        if (data.beds && data.beds.length > 0) setBeds(data.beds);
        if (data.medicines && data.medicines.length > 0) setMedicines(data.medicines);
        if (data.invoices && data.invoices.length > 0) setInvoices(data.invoices);
        if (data.appointments && data.appointments.length > 0) setAppointments(data.appointments);
        if (data.bloodBank && data.bloodBank.length > 0) setBloodBank(data.bloodBank);
        if (data.emergencyBroadcasts && data.emergencyBroadcasts.length > 0) {
          setEmergencyBroadcasts(data.emergencyBroadcasts);
        }
      } catch (err) {
        // Fallback to local storage gracefully if server not reachable
        setLiveSyncActive(false);
      }
    };

    // Initial sync
    syncLiveState();

    // Auto-poll continuously every 3.5 seconds
    const interval = setInterval(syncLiveState, 3500);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const addNotification = (type: ToastNotification['type'], title: string, message: string) => {
    const newNotif: ToastNotification = {
      id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 5)]);

    setTimeout(() => {
      dismissNotification(newNotif.id);
    }, 6000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const recordAuditLog = async (
    action: AuditBlock['action'],
    resourceId: string,
    resourceType: AuditBlock['resourceType'],
    details: string
  ) => {
    const prevBlock = auditLedger.length > 0 ? auditLedger[auditLedger.length - 1] : null;
    const newBlock = await createAuditBlock(
      prevBlock,
      currentUser.id,
      currentUser.name,
      currentRole,
      action,
      resourceId,
      resourceType,
      details
    );
    setAuditLedger((prev) => [...prev, newBlock]);
  };

  // -------------------------------------------------------------
  // PERSONA ACTIONS (ADD / DELETE)
  // -------------------------------------------------------------
  const addPersona = async (data: Omit<UserProfile, 'id'>): Promise<UserProfile> => {
    const newId = `PER-${Date.now().toString().slice(-4)}`;
    const created: UserProfile = { ...data, id: newId, isSystemDefault: false };

    try {
      await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });
    } catch (e) {
      // offline fallback
    }

    setPersonas((prev) => [...prev, created]);

    // Cross-module immediate local registration
    if (created.role === 'doctor') {
      const docName = created.name.startsWith('Dr.') ? created.name : `Dr. ${created.name}`;
      const newDoc: Doctor = {
        id: `DOC-${created.id}`,
        name: docName,
        specialty: created.department || created.title || 'General Medicine',
        department: created.department || 'General Medicine',
        qualifications: created.title || 'MBBS, MD',
        experienceYears: 8,
        phone: '+1 (555) 234-5678',
        email: created.email,
        consultationFee: 120,
        rating: 4.9,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        shiftTiming: '09:00 AM - 05:00 PM',
        isOnDuty: true,
        avatar: created.avatar,
      };
      setDoctors((prev) => {
        if (prev.some((d) => d.id === newDoc.id || d.name.toLowerCase() === docName.toLowerCase())) return prev;
        return [...prev, newDoc];
      });
    } else if (created.role === 'patient') {
      const newPat: Patient = {
        id: `PAT-${created.id}`,
        uhid: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: created.name,
        age: 28,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '+1 (555) 345-6789',
        email: created.email,
        address: 'Registered via Persona Intake Portal',
        emergencyContact: {
          name: 'Family Contact',
          relationship: 'Spouse',
          phone: '+1 (555) 999-1122',
        },
        allergies: [],
        chronicConditions: [created.title || 'General Consultation'],
        admissionStatus: 'Outpatient',
        vitalsHistory: [
          {
            id: `VIT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            heartRate: 74,
            systolicBp: 120,
            diastolicBp: 80,
            respiratoryRate: 16,
            spO2: 98,
            temperature: 37.0,
            avpu: 'Alert',
          },
        ],
        medicalTimeline: [
          {
            id: `TL-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Patient Account Registered',
            type: 'admission',
            notes: 'Registered as verified patient in PulseCare OS.',
            doctorName: 'Dr. Sarah Lin',
          },
        ],
      };
      setPatients((prev) => {
        if (prev.some((p) => p.name.toLowerCase() === created.name.toLowerCase())) return prev;
        return [newPat, ...prev];
      });
    }

    recordAuditLog('UPDATE_EHR', created.id, 'Patient', `Created new clinical persona: ${created.name} (${created.role})`);
    addNotification('success', 'Persona Created', `${created.name} (${created.title}) added to staff roster.`);
    return created;
  };

  const deletePersona = async (id: string): Promise<boolean> => {
    const target = personas.find((p) => p.id === id);
    if (!target) return false;

    if (target.id === 'ADM-01') {
      addNotification('critical', 'Action Blocked', 'Primary Root Administrator cannot be deleted.');
      return false;
    }

    try {
      await fetch(`/api/personas/${id}`, { method: 'DELETE' });
    } catch (e) {
      // offline fallback
    }

    setPersonas((prev) => prev.filter((p) => p.id !== id));

    // Cross-module cleanup
    if (target.role === 'doctor') {
      setDoctors((prev) => prev.filter((d) => d.id !== `DOC-${id}` && d.name !== target.name && d.name !== `Dr. ${target.name}`));
    } else if (target.role === 'patient') {
      setPatients((prev) => prev.filter((p) => p.id !== `PAT-${id}` && p.name !== target.name));
    }

    recordAuditLog('UPDATE_EHR', id, 'Patient', `Deleted persona: ${target.name} (${target.role})`);
    addNotification('info', 'Persona Deleted', `${target.name} removed from hospital roster.`);
    return true;
  };

  // -------------------------------------------------------------
  // PATIENT ACTIONS (ADD / FULL ADMIN EDIT)
  // -------------------------------------------------------------
  const addPatient = async (patientData: Omit<Patient, 'id' | 'uhid' | 'vitalsHistory' | 'medicalTimeline'>): Promise<Patient> => {
    const newId = `PAT-${Date.now().toString().slice(-4)}`;
    const uhid = `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      uhid,
      vitalsHistory: [
        {
          id: 'VIT-' + Date.now(),
          timestamp: new Date().toISOString(),
          heartRate: 76,
          systolicBp: 120,
          diastolicBp: 80,
          respiratoryRate: 16,
          spO2: 98,
          temperature: 37.0,
          avpu: 'Alert',
        }
      ],
      medicalTimeline: [
        {
          id: 'TL-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          title: 'Patient Intake & Registration',
          type: 'admission',
          notes: 'Registered in PulseCare HMS via Admissions Portal.',
          doctorName: currentUser.name,
        }
      ],
    };

    try {
      await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
    } catch (e) {}

    setPatients((prev) => [newPatient, ...prev]);
    recordAuditLog('UPDATE_EHR', newPatient.id, 'Patient', `Registered new patient ${newPatient.name} (UHID: ${uhid})`);
    addNotification('success', 'Patient Registered', `UHID ${uhid} created for ${newPatient.name}`);
    return newPatient;
  };

  // Full Admin Edit of Patient
  const editPatient = async (patientId: string, updates: Partial<Patient>): Promise<void> => {
    try {
      await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {}

    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...updates } : p))
    );
    recordAuditLog('UPDATE_EHR', patientId, 'Patient', `Admin updated clinical fields for patient ID ${patientId}`);
    addNotification('success', 'Patient Record Saved', `Patient data updated and synchronized.`);
  };

  const updatePatientVitals = (patientId: string, vitals: Omit<VitalRecord, 'id' | 'timestamp'>) => {
    const newVitalRecord: VitalRecord = {
      id: 'VIT-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...vitals,
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            vitalsHistory: [newVitalRecord, ...p.vitalsHistory],
          };
        }
        return p;
      })
    );

    try {
      fetch(`/api/patients/${patientId}/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitals),
      });
    } catch (e) {}

    recordAuditLog('UPDATE_EHR', patientId, 'Patient', `Logged vitals: HR ${vitals.heartRate}, BP ${vitals.systolicBp}/${vitals.diastolicBp}, SpO2 ${vitals.spO2}%`);
    addNotification('info', 'Vitals Recorded', `Vital signs updated for patient record #${patientId}`);
  };

  const assignBedToPatient = (bedId: string, patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
          const updated = {
            ...b,
            status: 'Occupied' as const,
            patientId: patient.id,
            patientName: patient.name,
            uhid: patient.uhid,
            admissionTimestamp: new Date().toISOString(),
          };
          fetch(`/api/beds/${bedId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch(() => {});
          return updated;
        }
        return b;
      })
    );

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return { ...p, admissionStatus: 'Inpatient', assignedBedId: bedId };
        }
        return p;
      })
    );

    recordAuditLog('UPDATE_EHR', patientId, 'Patient', `Assigned Bed ${bedId} to patient ${patient.name}`);
    addNotification('success', 'Bed Allocated', `Assigned Bed to ${patient.name}`);
  };

  const dischargeBed = (bedId: string) => {
    const targetBed = beds.find((b) => b.id === bedId);
    if (!targetBed) return;

    if (targetBed.patientId) {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id === targetBed.patientId) {
            return { ...p, admissionStatus: 'Discharged', assignedBedId: undefined };
          }
          return p;
        })
      );
    }

    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
          const updated = {
            ...b,
            status: 'Sanitizing' as const,
            patientId: undefined,
            patientName: undefined,
            uhid: undefined,
            admissionTimestamp: undefined,
          };
          fetch(`/api/beds/${bedId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch(() => {});
          return updated;
        }
        return b;
      })
    );

    recordAuditLog('UPDATE_EHR', bedId, 'Patient', `Discharged bed ${targetBed.bedNumber}. Sanitization cycle initiated.`);
    addNotification('info', 'Bed Discharged', `${targetBed.bedNumber} queued for sanitization.`);
  };

  const editBed = async (bedId: string, updates: Partial<Bed>) => {
    try {
      await fetch(`/api/beds/${bedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {}

    setBeds((prev) => prev.map((b) => (b.id === bedId ? { ...b, ...updates } : b)));
    addNotification('success', 'Bed Updated', 'Bed parameters updated and saved.');
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'tokenNumber' | 'createdDate'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: `APP-${Date.now().toString().slice(-4)}`,
      tokenNumber: appointments.length + 1,
      createdDate: new Date().toISOString().split('T')[0],
    };

    try {
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });
    } catch (e) {}

    setAppointments((prev) => [newAppointment, ...prev]);
    recordAuditLog('UPDATE_EHR', newAppointment.id, 'Patient', `Scheduled appointment token #${newAppointment.tokenNumber} with ${newAppointment.doctorName}`);
    addNotification('success', 'Appointment Scheduled', `Token #${newAppointment.tokenNumber} for ${newAppointment.patientName}`);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    try {
      fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {}

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
    );
    addNotification('info', 'Appointment Updated', `Status changed to ${status}`);
  };

  const dispenseMedicine = (medicineId: string, quantity: number): boolean => {
    let success = false;
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          if (med.stockQuantity >= quantity) {
            success = true;
            const updated = { ...med, stockQuantity: med.stockQuantity - quantity };
            fetch(`/api/medicines/${medicineId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            }).catch(() => {});
            return updated;
          }
        }
        return med;
      })
    );

    if (success) {
      recordAuditLog('DISPENSE_MEDICATION', medicineId, 'Prescription', `Dispensed ${quantity} units of medicine ID ${medicineId}`);
      addNotification('success', 'Medication Dispensed', `Dispensed ${quantity} units successfully.`);
    } else {
      addNotification('critical', 'Insufficient Stock', 'Unable to dispense medication: stock too low.');
    }
    return success;
  };

  const addMedicine = (medicineData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...medicineData,
      id: `MED-${Date.now().toString().slice(-4)}`,
    };
    try {
      fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed),
      });
    } catch (e) {}
    setMedicines((prev) => [newMed, ...prev]);
    addNotification('success', 'Medication Added', `${newMed.name} added to pharmacy formulary.`);
  };

  const editMedicine = async (medicineId: string, updates: Partial<Medicine>) => {
    try {
      await fetch(`/api/medicines/${medicineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {}

    setMedicines((prev) => prev.map((m) => (m.id === medicineId ? { ...m, ...updates } : m)));
    addNotification('success', 'Medication Updated', 'Formulary parameters updated.');
  };

  const createLabOrder = (orderData: Omit<LabTestOrder, 'id' | 'orderNumber' | 'orderDate'>) => {
    const newOrder: LabTestOrder = {
      ...orderData,
      id: `LAB-${Date.now().toString().slice(-4)}`,
      orderNumber: `LAB-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString(),
    };
    setLabOrders((prev) => [newOrder, ...prev]);
    recordAuditLog('UPDATE_EHR', newOrder.id, 'LabReport', `Ordered laboratory diagnostics: ${newOrder.testName} for ${newOrder.patientName}`);
    addNotification('info', 'Lab Order Placed', `${newOrder.testName} order #${newOrder.orderNumber}`);
  };

  const updateLabStatus = (orderId: string, status: LabTestOrder['status'], findingsNotes?: string) => {
    setLabOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            reportDate: status === 'Report Ready' ? new Date().toISOString() : ord.reportDate,
            findingsNotes: findingsNotes || ord.findingsNotes,
          };
        }
        return ord;
      })
    );
    recordAuditLog('UPDATE_EHR', orderId, 'LabReport', `Updated lab order status to ${status}`);
    addNotification('success', 'Lab Status Updated', `Diagnostic order updated to ${status}`);
  };

  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'billingDate'>): Invoice => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `INV-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      billingDate: new Date().toISOString(),
    };

    try {
      fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });
    } catch (e) {}

    setInvoices((prev) => [newInvoice, ...prev]);
    recordAuditLog('UPDATE_EHR', newInvoice.id, 'Billing', `Generated billing invoice #${newInvoice.invoiceNumber} for $${newInvoice.totalAmount.toFixed(2)}`);
    addNotification('success', 'Invoice Generated', `Invoice #${newInvoice.invoiceNumber} generated.`);
    return newInvoice;
  };

  const editInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {}

    setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? { ...inv, ...updates } : inv)));
    addNotification('success', 'Invoice Updated', 'Billing invoice parameters saved.');
  };

  const broadcastEmergencyCode = (type: EmergencyBroadcast['type'], location: string) => {
    const newBroadcast: EmergencyBroadcast = {
      id: `EM-BC-${Date.now().toString().slice(-4)}`,
      type,
      location,
      reportedBy: currentUser.name,
      timestamp: new Date().toISOString(),
      active: true,
      urgency: 'MAXIMUM_CRITICAL',
      teamPagingStatus: [
        { teamName: 'Anesthesiology Crash Team', status: 'En Route', respondersCount: 2 },
        { teamName: 'Emergency Medical Registrar', status: 'En Route', respondersCount: 1 },
        { teamName: 'ICU Charge Nurse & Defibrillator Team', status: 'On Scene', respondersCount: 2 }
      ],
    };

    try {
      fetch('/api/emergency-broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBroadcast),
      });
    } catch (e) {}

    setEmergencyBroadcasts((prev) => [newBroadcast, ...prev]);
    recordAuditLog('CODE_DISPATCH', newBroadcast.id, 'Patient', `DISPATCHED ${type} at ${location}`);
    addNotification('critical', `🚨 ${type} DISPATCHED!`, `Location: ${location}. Crash teams paged!`);
  };

  const resolveEmergencyBroadcast = (id: string, notes: string) => {
    try {
      fetch(`/api/emergency-broadcasts/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionNotes: notes }),
      });
    } catch (e) {}

    setEmergencyBroadcasts((prev) =>
      prev.map((bc) => (bc.id === id ? { ...bc, active: false, resolutionNotes: notes } : bc))
    );
    addNotification('success', 'Emergency Stand-Down', 'Emergency code cleared and incident logged.');
  };

  const createPrescription = (prescriptionData: Omit<Prescription, 'id' | 'rxNumber' | 'date'>) => {
    const newPrescription: Prescription = {
      ...prescriptionData,
      id: `RX-${Date.now().toString().slice(-4)}`,
      rxNumber: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
    };

    setPrescriptions((prev) => [newPrescription, ...prev]);
    recordAuditLog('UPDATE_EHR', newPrescription.id, 'Prescription', `Prescription #${newPrescription.rxNumber} generated for ${newPrescription.patientName}`);
    addNotification('success', 'Prescription Generated', `Prescription #${newPrescription.rxNumber} created.`);
  };

  const updateBloodStock = (bloodGroup: string, deltaUnits: number) => {
    try {
      fetch(`/api/blood-bank/${bloodGroup}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deltaUnits }),
      });
    } catch (e) {}

    setBloodBank((prev) =>
      prev.map((b) => {
        if (b.bloodGroup === bloodGroup) {
          const newUnits = Math.max(0, b.unitsAvailable + deltaUnits);
          return {
            ...b,
            unitsAvailable: newUnits,
            tempStatus: newUnits < b.minSafeUnits ? 'Warning' : 'Optimal',
          };
        }
        return b;
      })
    );
    recordAuditLog('UPDATE_EHR', bloodGroup, 'BloodBank', `Modified blood stock for group ${bloodGroup} by ${deltaUnits} units`);
    addNotification('info', 'Blood Reserve Updated', `${bloodGroup} stock modified by ${deltaUnits > 0 ? '+' : ''}${deltaUnits}`);
  };

  const resetAllDataToDefaults = () => {
    localStorage.clear();
    try {
      fetch('/api/system/reset', { method: 'POST' });
    } catch (e) {}

    setPersonas(DEFAULT_PERSONAS);
    setPatients(INITIAL_PATIENTS);
    setBeds(INITIAL_BEDS);
    setMedicines(INITIAL_MEDICINES);
    setLabOrders(INITIAL_LAB_ORDERS);
    setInvoices(INITIAL_INVOICES);
    setAppointments(INITIAL_APPOINTMENTS);
    setEmergencyCases(INITIAL_EMERGENCY_CASES);
    setBloodBank(INITIAL_BLOOD_BANK);
    setAuditLedger(INITIAL_AUDIT_LEDGER);
    setEmergencyBroadcasts(INITIAL_EMERGENCY_BROADCASTS);
    addNotification('info', 'System Reset', 'All database records restored to default benchmark seed.');
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        personas,
        addPersona,
        deletePersona,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        liveSyncActive,
        patients,
        doctors,
        beds,
        medicines,
        labOrders,
        invoices,
        appointments,
        emergencyCases,
        prescriptions,
        bloodBank,
        auditLedger,
        emergencyBroadcasts,
        organDonors,
        organRecipients,
        telemedicineSessions,
        notifications,
        addNotification,
        dismissNotification,
        addPatient,
        editPatient,
        updatePatientVitals,
        assignBedToPatient,
        dischargeBed,
        editBed,
        bookAppointment,
        updateAppointmentStatus,
        dispenseMedicine,
        addMedicine,
        editMedicine,
        createLabOrder,
        updateLabStatus,
        createInvoice,
        editInvoice,
        recordAuditLog,
        broadcastEmergencyCode,
        resolveEmergencyBroadcast,
        createPrescription,
        updateBloodStock,
        resetAllDataToDefaults,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
