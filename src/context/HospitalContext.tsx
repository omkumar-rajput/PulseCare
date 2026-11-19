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

interface HospitalContextType {
  // Authentication & Active Role
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;

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

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'uhid' | 'vitalsHistory' | 'medicalTimeline'>) => Patient;
  updatePatientVitals: (patientId: string, vitals: Omit<VitalRecord, 'id' | 'timestamp'>) => void;
  assignBedToPatient: (bedId: string, patientId: string) => void;
  dischargeBed: (bedId: string) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'tokenNumber' | 'createdDate'>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  dispenseMedicine: (medicineId: string, quantity: number) => boolean;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  createLabOrder: (order: Omit<LabTestOrder, 'id' | 'orderNumber' | 'orderDate'>) => void;
  updateLabStatus: (orderId: string, status: LabTestOrder['status'], findingsNotes?: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'billingDate'>) => Invoice;
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

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  admin: {
    id: 'ADM-01',
    name: 'Arthur Vance, MHA',
    role: 'admin',
    email: 'admin.vance@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    department: 'Hospital Administration & Executive Operations',
  },
  doctor: {
    id: 'DOC-01',
    name: 'Dr. Sarah Lin, MD, FACC',
    role: 'doctor',
    email: 'sarah.lin@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    department: 'Cardiovascular Sciences',
    licenseNumber: 'MD-88392-CAR',
  },
  nurse: {
    id: 'NUR-01',
    name: 'Nurse Clara Hughes, BSN, RN',
    role: 'nurse',
    email: 'clara.hughes@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=250',
    department: 'Intensive Care Unit (ICU)',
    licenseNumber: 'RN-55410-ICU',
  },
  pharmacist: {
    id: 'PHARM-01',
    name: 'Robert Tanaka, PharmD',
    role: 'pharmacist',
    email: 'robert.tanaka@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    department: 'Clinical Pharmacology & Dispensing',
    licenseNumber: 'RPH-19042',
  },
  lab_technician: {
    id: 'LAB-01',
    name: 'Chen Wei, MLS (ASCP)',
    role: 'lab_technician',
    email: 'chen.wei@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Pathology & Molecular Diagnostics',
    licenseNumber: 'MLS-77209',
  },
  receptionist: {
    id: 'REC-01',
    name: 'Jessica Gomez',
    role: 'receptionist',
    email: 'jessica.gomez@pulsecare.health',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    department: 'Patient Admissions & Front Desk',
  },
  patient: {
    id: 'PAT-101',
    name: 'Eleanor Harrison',
    role: 'patient',
    email: 'eleanor.harrison@email.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
  }
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // State with LocalStorage fallback
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('pc_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);

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

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist important data to localStorage
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

  const addNotification = (type: ToastNotification['type'], title: string, message: string) => {
    const newNotif: ToastNotification = {
      id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 5)]);

    // Auto dismiss after 6 seconds
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
    const user = ROLE_PROFILES[currentRole];
    const prevBlock = auditLedger.length > 0 ? auditLedger[auditLedger.length - 1] : null;
    const newBlock = await createAuditBlock(
      prevBlock,
      user.id,
      user.name,
      currentRole,
      action,
      resourceId,
      resourceType,
      details
    );
    setAuditLedger((prev) => [...prev, newBlock]);
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'uhid' | 'vitalsHistory' | 'medicalTimeline'>): Patient => {
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
          notes: 'Registered in PulseCare HMS via front desk admission portal.',
          doctorName: ROLE_PROFILES[currentRole].name,
        }
      ],
    };

    setPatients((prev) => [newPatient, ...prev]);
    recordAuditLog('UPDATE_EHR', newPatient.id, 'Patient', `Registered new patient ${newPatient.name} (UHID: ${uhid})`);
    addNotification('success', 'Patient Registered', `UHID ${uhid} created for ${newPatient.name}`);
    return newPatient;
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

    recordAuditLog('UPDATE_EHR', patientId, 'Patient', `Updated vital telemetry: HR ${vitals.heartRate}, BP ${vitals.systolicBp}/${vitals.diastolicBp}, SpO2 ${vitals.spO2}%`);
    addNotification('info', 'Vitals Recorded', `Vital signs updated for patient record #${patientId}`);
  };

  const assignBedToPatient = (bedId: string, patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
          return {
            ...b,
            status: 'Occupied',
            patientId: patient.id,
            patientName: patient.name,
            uhid: patient.uhid,
            admissionTimestamp: new Date().toISOString(),
          };
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
          return {
            ...b,
            status: 'Sanitizing',
            patientId: undefined,
            patientName: undefined,
            uhid: undefined,
            admissionTimestamp: undefined,
          };
        }
        return b;
      })
    );

    recordAuditLog('UPDATE_EHR', bedId, 'Patient', `Discharged bed ${targetBed.bedNumber}. Initiating sanitization cycle.`);
    addNotification('info', 'Bed Discharged', `${targetBed.bedNumber} is now queued for sanitization.`);
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'tokenNumber' | 'createdDate'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: `APP-${Date.now().toString().slice(-4)}`,
      tokenNumber: appointments.length + 1,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    recordAuditLog('UPDATE_EHR', newAppointment.id, 'Patient', `Scheduled appointment token #${newAppointment.tokenNumber} with ${newAppointment.doctorName}`);
    addNotification('success', 'Appointment Scheduled', `Token #${newAppointment.tokenNumber} for ${newAppointment.patientName}`);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
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
            return { ...med, stockQuantity: med.stockQuantity - quantity };
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
    setMedicines((prev) => [newMed, ...prev]);
    addNotification('success', 'Medication Added', `${newMed.name} added to pharmacy formulary.`);
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
    setInvoices((prev) => [newInvoice, ...prev]);
    recordAuditLog('UPDATE_EHR', newInvoice.id, 'Billing', `Generated medical billing invoice #${newInvoice.invoiceNumber} for $${newInvoice.totalAmount.toFixed(2)}`);
    addNotification('success', 'Invoice Generated', `Invoice #${newInvoice.invoiceNumber} generated.`);
    return newInvoice;
  };

  const broadcastEmergencyCode = (type: EmergencyBroadcast['type'], location: string) => {
    const newBroadcast: EmergencyBroadcast = {
      id: `EM-BC-${Date.now().toString().slice(-4)}`,
      type,
      location,
      reportedBy: ROLE_PROFILES[currentRole].name,
      timestamp: new Date().toISOString(),
      active: true,
      urgency: 'MAXIMUM_CRITICAL',
      teamPagingStatus: [
        { teamName: 'Anesthesiology Crash Team', status: 'En Route', respondersCount: 2 },
        { teamName: 'Emergency Medical Registrar', status: 'En Route', respondersCount: 1 },
        { teamName: 'ICU Charge Nurse & Defibrillator Team', status: 'On Scene', respondersCount: 2 }
      ],
    };

    setEmergencyBroadcasts((prev) => [newBroadcast, ...prev]);
    recordAuditLog('CODE_DISPATCH', newBroadcast.id, 'Patient', `DISPATCHED ${type} at ${location}`);
    addNotification('critical', `🚨 ${type} DISPATCHED!`, `Location: ${location}. Crash teams paged!`);
  };

  const resolveEmergencyBroadcast = (id: string, notes: string) => {
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
    addNotification('info', 'System Reset', 'All records restored to clean demonstration dataset.');
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser: ROLE_PROFILES[currentRole],
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
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
        updatePatientVitals,
        assignBedToPatient,
        dischargeBed,
        bookAppointment,
        updateAppointmentStatus,
        dispenseMedicine,
        addMedicine,
        createLabOrder,
        updateLabStatus,
        createInvoice,
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
