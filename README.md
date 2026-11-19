# 🏥 PulseCare OS 2.0 — Enterprise Full-Stack Hospital Management System (HMS)

> An enterprise-grade, clinical-decision-augmented Full-Stack Hospital Management System featuring **10 Core Healthcare Administration Modules**, **10 Cutting-Edge Clinical AI & Critical Care Systems**, **durable zero-config database persistence**, **live telemetry syncing**, and **strict role-based security access control**.

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20API-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![HIPAA Compliant Architecture](https://img.shields.io/badge/HIPAA-Audit%20Ready-emerald.svg)](https://www.hhs.gov/hipaa/index.html)

---

## 🌟 Executive Summary

**PulseCare OS** is a production-grade full-stack hospital operating system designed to bridge the gap between traditional administrative Electronic Health Record (EHR) software and real-time clinical AI decision support. It features a complete **Express REST API backend** with **durable in-repository persistence** (`server/data/hospital_db.json`), zero external database installation prerequisites, continuous real-time ICU telemetry updates, persona lifecycle management (add/edit/delete staff personas), and strict HIPAA-compliant role-based security gates.

---

## ⚡ New Enterprise Full-Stack Capabilities

- **🚀 Dual-Engine Full-Stack Architecture**: Single-command startup (`npm run dev`) launches both the Express API backend (`http://localhost:5001`) and Vite frontend (`http://localhost:3000`) simultaneously via `concurrently`.
- **💾 Durable In-Repository Database**: Stored in [`server/data/hospital_db.json`](file:///Users/omkumar/Desktop/MDM/server/data/hospital_db.json). Whenever you reopen the website—whether after 5 days, 5 months, or a server reboot—all patient admissions, vitals, edited records, custom personas, and prescriptions remain 100% intact.
- **👥 Persona Management (Add, Edit, Delete)**: Allows creating new clinical staff personas, configuring custom permissions, deleting obsolete roles (with protection against deleting the Root Administrator), and instant role switching.
- **🛡️ Strict Privacy & RBAC Route Gates**:
  - **Patient Access Lock**: Patients are strictly restricted to their personal portal and appointments. Attempting to view doctor prescriptions, ICU bed allocation, hospital billing rates, or emergency dispatchers displays a 403 Forbidden security gate.
  - **Physician Gate**: Digital prescriptions and CDSS drug interaction overrides require physician or administrator credentials.
  - **Compliance Gate**: The SHA-256 Cryptographic Audit Ledger requires administrative authorization.
- **✏️ Universal Administrative Editing**: Administrators have master privileges to edit any patient record, doctor fees, bed occupancy states, medication stock, and invoice amounts.
- **📡 Continuous Live Sync (3.5s Interval)**: Live background auto-polling continuously pulls updated patient telemetry, ICU vital changes, and emergency Code Blue broadcasts in real time without refreshing the page.

---

## 📋 Comprehensive Feature Matrix

### 🏥 10 Core Hospital Management Features

| # | Feature Name | Description & Clinical Capabilities |
|---|---|---|
| **1** | **[Patient EHR & Longitudinal Timeline](file:///Users/omkumar/Desktop/MDM/src/components/core/PatientRegistry.tsx)** | Unique Hospital Identification (UHID), comprehensive demographic profiles, documented drug allergies, chronic illness histories, live vital sign telemetry, admin editing, and chronological clinical encounter timelines. |
| **2** | **[Doctor Directory & Medical Roster](file:///Users/omkumar/Desktop/MDM/src/components/core/DoctorDirectory.tsx)** | Multi-department specialist roster (Cardiology, Trauma ER, Neuro, Pediatrics, Nephrology), credential verification, on-duty presence toggles, consultation fees, and shift timetables. |
| **3** | **[OPD Appointments & Queue Control](file:///Users/omkumar/Desktop/MDM/src/components/core/AppointmentScheduler.tsx)** | Automated token generator, department-wise scheduling, doctor time-slot booking, token queue visualizer, and status lifecycle tracking (`Scheduled`, `In-Progress`, `Completed`, `Cancelled`). |
| **4** | **[Bed & Ward Fleet Management](file:///Users/omkumar/Desktop/MDM/src/components/core/BedWardManager.tsx)** | Real-time visual tracking across ICU, CCU, Emergency, General Ward A/B, and Pediatric suites with piped oxygen support and mechanical ventilator capability indicators. |
| **5** | **[Pharmacy & Drug Formulary](file:///Users/omkumar/Desktop/MDM/src/components/core/PharmacyInventory.tsx)** | Pharmaceutical inventory catalog with batch numbers, expiration countdowns, automated critical low-stock reorder thresholds, and outpatient dispensation logging. |
| **6** | **[Laboratory & Diagnostics Hub](file:///Users/omkumar/Desktop/MDM/src/components/core/LaboratoryHub.tsx)** | Pathology, radiology, biochemistry, and microbiology order management. Panic / abnormal value alert flags, reference range validation, and certified digital report generation. |
| **7** | **[Medical Billing, Invoicing & Insurance (TPA)](file:///Users/omkumar/Desktop/MDM/src/components/core/BillingInvoicePortal.tsx)** | Itemized medical invoices covering room charges, surgical procedures, doctor rounds, lab assays, and medications. Third-Party Administrator (TPA) insurance pre-authorization and patient co-pay calculations. |
| **8** | **[Emergency ER Rapid Intake Desk](file:///Users/omkumar/Desktop/MDM/src/components/core/EmergencyIntakeDesk.tsx)** | Fast-track emergency admissions without paperwork delay, ambulance docking, trauma bay assignment, and rapid stabilization status tracking. |
| **9** | **[Role-Based Access Control (RBAC)](file:///Users/omkumar/Desktop/MDM/src/components/core/RolePortalDashboard.tsx)** | Strict Principle of Least Privilege (PoLP) enforcing customized dashboards for **7 Healthcare Personas**: Super Admin, Attending Doctor, Head Nurse, Pharmacist, Lab Tech, Receptionist, and Patient. |
| **10** | **[Digital Prescription Pad (E-Rx)](file:///Users/omkumar/Desktop/MDM/src/components/core/DigitalPrescriptionPad.tsx)** | Physician prescription generator with medication dosage, multi-frequency timing (1-0-1, SOS, STAT), food timing rules, duration, and cryptographically verified digital signatures. |

---

### 🚀 10 Cutting-Edge & Unique Advanced Features

| # | Advanced Feature | Technical Implementation & Clinical Value |
|---|---|---|
| **1** | **[AI CDSS & Drug Interaction Checker](file:///Users/omkumar/Desktop/MDM/src/components/advanced/CDSSDrugInteractionChecker.tsx)** | Real-time pharmacokinetic & pharmacodynamic interaction analyzer. Evaluates prospective prescriptions against concurrent medications and patient allergies, classifying interactions by severity (`Critical`, `Major`, `Moderate`) with physiological mechanisms and clinical guidance. |
| **2** | **[Modified Early Warning Score (MEWS / NEWS2)](file:///Users/omkumar/Desktop/MDM/src/components/advanced/EarlyWarningScoreCalculator.tsx)** | Predictive deterioration scoring computed from live vital signs (Heart rate, Systolic BP, Respiratory rate, SpO2, Temperature, AVPU consciousness). Identifies impending septic shock, respiratory failure, or cardiac arrest hours prior to collapse. |
| **3** | **[Smart AI Emergency Triage Assistant](file:///Users/omkumar/Desktop/MDM/src/components/advanced/SmartAITriageAssistant.tsx)** | NLP-assisted intake classifier that processes natural language chief complaints and vital telemetry, mapping patients into the **Emergency Severity Index (ESI Levels 1-5)** with red-flag detection and STAT diagnostic recommendations. |
| **4** | **[Interactive 2D Spatial Ward Floor Plan](file:///Users/omkumar/Desktop/MDM/src/components/advanced/FloorPlanVisualizer.tsx)** | Multi-level architectural blueprint view (Ground Floor ER, 1st Floor Wards, 2nd Floor ICU) with real-time color-coded room status pulses, life-support connections, and direct tap-to-manage room modals. |
| **5** | **[Smart Blood Bank & Plasma Network](file:///Users/omkumar/Desktop/MDM/src/components/advanced/BloodBankMatrix.tsx)** | Inventory management for all 8 ABO/Rh blood groups, real-time cold-chain temperature telemetry (2.0°C - 6.0°C), transfusion cross-match compatibility matrix, and 1-click emergency regional donor SOS broadcasts. |
| **6** | **[Ambient AI Clinical Scribe](file:///Users/omkumar/Desktop/MDM/src/components/advanced/AmbientVoiceScribe.tsx)** | Speech-to-text dictation simulator that parses natural physician-patient dialogue and automatically formats it into structured **SOAP Notes** (Subjective, Objective, Assessment, Plan) with auto-suggested **ICD-10 diagnostic billing codes**. |
| **7** | **[Cryptographic PHI Access Audit Ledger](file:///Users/omkumar/Desktop/MDM/src/components/advanced/CryptographicAuditLedger.tsx)** | Immutable, blockchain-inspired SHA-256 block hash chaining satisfying **HIPAA § 164.312(b)**. Features a live mathematical verification engine that detects tampering or unauthorized alteration in any block. |
| **8** | **[Emergency Code Blue & Disaster Dispatcher](file:///Users/omkumar/Desktop/MDM/src/components/advanced/EmergencyCodeDispatcher.tsx)** | Hospital-wide broadcast command center for **Code Blue** (Cardiac Arrest), **Code Red** (Fire), **Code Black** (Threat), **Code Pink** (Infant), and **Mass Casualty Incidents (MCI)** with real-time crash team paging acknowledgements. |
| **9** | **[Organ Transplant Match Registry](file:///Users/omkumar/Desktop/MDM/src/components/advanced/OrganTransplantRegistry.tsx)** | UNOS/OPTN-standard transplant allocation algorithm computing compatibility scores based on ABO blood group matching, **HLA antigen overlap**, Medical Urgency tiers (Status 1A/1B), and **Cold Ischemia Time (CIT)** viability timers. |
| **10** | **[Telemedicine Virtual Consultation Suite](file:///Users/omkumar/Desktop/MDM/src/components/advanced/TelemedicineSuite.tsx)** | Encrypted virtual examination room with simulated WebRTC peer feeds, live biometric vital signs telemetry overlay, shared educational whiteboard, in-call messaging, and seamless electronic prescription handoff. |

---

## ⚡ Quick Start (Single Command)

From the project root:

```bash
# Start both the Express API backend & Vite frontend simultaneously
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5001/api`
- **Live Sync Stream**: `http://localhost:5001/api/sync/live-state`
- **Durable Database**: `server/data/hospital_db.json`

---

## 🐙 Pushing to Your GitHub Repository

```bash
# 1. Link your remote repository
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 2. Push all commits to main
git branch -M main
git push -u origin main
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
