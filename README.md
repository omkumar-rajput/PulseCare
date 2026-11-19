# 🏥 PulseCare OS 2.0 — Next-Gen Intelligent Hospital Management System (HMS)

> An enterprise-grade, clinical-decision-augmented Hospital Management System featuring **10 Core Healthcare Administration Modules** and **10 Cutting-Edge Clinical AI & Critical Care Systems**.

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![HIPAA Compliant Architecture](https://img.shields.io/badge/HIPAA-Audit%20Ready-emerald.svg)](https://www.hhs.gov/hipaa/index.html)

---

## 🌟 Executive Summary

**PulseCare OS** is an advanced hospital operating system designed to bridge the gap between traditional administrative Electronic Health Record (EHR) software and real-time clinical AI decision support. It empowers hospitals, intensive care teams, outpatient clinics, and surgical departments with zero-friction workflows, predictive sepsis alerts, automated drug-drug interaction safeguards, and cryptographic audit accountability.

---

## 📋 Comprehensive Feature Matrix

### 🏥 10 Core Hospital Management Features

| # | Feature Name | Description & Clinical Capabilities |
|---|---|---|
| **1** | **Patient EHR & Longitudinal Timeline** | Unique Hospital Identification (UHID), comprehensive demographic profiles, documented drug allergies, chronic illness histories, live vital sign telemetry, and chronological clinical encounter timelines. |
| **2** | **Doctor Directory & Medical Roster** | Multi-department specialist roster (Cardiology, Trauma ER, Neuro, Pediatrics, Nephrology), credential verification, on-duty presence toggles, consultation fees, and shift timetables. |
| **3** | **OPD Appointments & Queue Control** | Automated token generator, department-wise scheduling, doctor time-slot booking, token queue visualizer, and status lifecycle tracking (Scheduled, In-Progress, Completed, Cancelled). |
| **4** | **Bed & Ward Fleet Management** | Real-time visual tracking across ICU, CCU, Emergency, General Ward A/B, and Pediatric suites with piped oxygen support and mechanical ventilator capability indicators. |
| **5** | **Pharmacy & Drug Formulary** | Pharmaceutical inventory catalog with batch numbers, expiration countdowns, automated critical low-stock reorder thresholds, and outpatient dispensation logging. |
| **6** | **Laboratory & Diagnostics Hub** | Pathology, radiology, biochemistry, and microbiology order management. Panic / abnormal value alert flags, reference range validation, and certified digital report generation. |
| **7** | **Medical Billing, Invoicing & Insurance (TPA)** | Itemized medical invoices covering room charges, surgical procedures, doctor rounds, lab assays, and medications. Third-Party Administrator (TPA) insurance pre-authorization and patient co-pay calculations. |
| **8** | **Emergency ER Rapid Intake Desk** | Fast-track emergency admissions without paperwork delay, ambulance docking, trauma bay assignment, and rapid stabilization status tracking. |
| **9** | **Role-Based Access Control (RBAC)** | Strict Principle of Least Privilege (PoLP) enforcing customized dashboards for **7 Healthcare Personas**: Super Admin, Attending Doctor, Head Nurse, Pharmacist, Lab Tech, Receptionist, and Patient. |
| **10** | **Digital Prescription Pad (E-Rx)** | Physician prescription generator with medication dosage, multi-frequency timing (1-0-1, SOS, STAT), food timing rules, duration, and cryptographically verified digital signatures. |

---

### 🚀 10 Cutting-Edge & Unique Advanced Features

| # | Advanced Feature | Technical Implementation & Clinical Value |
|---|---|---|
| **1** | **AI Clinical Decision Support (CDSS) & DDI Checker** | Real-time pharmacokinetic & pharmacodynamic interaction analyzer. Evaluates prospective prescriptions against concurrent medications and patient allergies, classifying interactions by severity (Critical / Major / Moderate) with physiological mechanisms and clinical guidance. |
| **2** | **Modified Early Warning Score (MEWS / NEWS2)** | Predictive deterioration scoring computed from live vital signs (Heart rate, Systolic BP, Respiratory rate, SpO2, Temperature, AVPU consciousness). Identifies impending septic shock, respiratory failure, or cardiac arrest hours prior to collapse. |
| **3** | **Smart AI Emergency Triage Assistant** | NLP-assisted intake classifier that processes natural language chief complaints and vital telemetry, mapping patients into the **Emergency Severity Index (ESI Levels 1-5)** with red-flag detection and STAT diagnostic recommendations. |
| **4** | **Interactive 2D Spatial Ward Floor Plan** | Multi-level architectural blueprint view (Ground Floor ER, 1st Floor Wards, 2nd Floor ICU) with real-time color-coded room status pulses, life-support connections, and direct tap-to-manage room modals. |
| **5** | **Smart Blood Bank & Plasma Network** | Inventory management for all 8 ABO/Rh blood groups, real-time cold-chain temperature telemetry (2.0°C - 6.0°C), transfusion cross-match compatibility matrix, and 1-click emergency regional donor SOS broadcasts. |
| **6** | **Ambient AI Clinical Scribe** | Speech-to-text dictation simulator that parses natural physician-patient dialogue and automatically formats it into structured **SOAP Notes** (Subjective, Objective, Assessment, Plan) with auto-suggested **ICD-10 diagnostic billing codes**. |
| **7** | **Cryptographic PHI Access Audit Ledger** | Immutable, blockchain-inspired SHA-256 block hash chaining satisfying **HIPAA § 164.312(b)**. Features a live mathematical verification engine that detects tampering or unauthorized alteration in any block. |
| **8** | **Emergency Code Blue & Disaster Dispatcher** | Hospital-wide broadcast command center for **Code Blue** (Cardiac Arrest), **Code Red** (Fire), **Code Black** (Threat), **Code Pink** (Infant), and **Mass Casualty Incidents (MCI)** with real-time crash team paging acknowledgements. |
| **9** | **Organ Transplant Match Registry** | UNOS/OPTN-standard transplant allocation algorithm computing compatibility scores based on ABO blood group matching, **HLA antigen overlap**, Medical Urgency tiers (Status 1A/1B), and **Cold Ischemia Time (CIT)** viability timers. |
| **10** | **Telemedicine Virtual Consultation Suite** | Encrypted virtual examination room with simulated WebRTC peer feeds, live biometric vital signs telemetry overlay, shared educational whiteboard, in-call messaging, and seamless electronic prescription handoff. |

---

## 👥 7 Role-Based Personas (RBAC)

Experience the entire system through any healthcare stakeholder persona via the **Role Switcher**:
1. **🏥 Hospital Administrator**: Institutional metrics, bed occupancy, billing audits, compliance verification.
2. **🩺 Attending Physician**: Prescription writing, CDSS drug interaction checks, lab ordering, clinical rounds.
3. **👩‍⚕️ Head Nurse (ICU)**: MEWS early warning score tracking, vital signs telemetry, bed sanitation cycles.
4. **💊 Clinical Pharmacist**: Formulary inventory, drug dispensation, batch tracking, cold storage monitoring.
5. **🔬 Laboratory Specialist**: Pathology assay results, panic critical alert flags, verified report signatures.
6. **🧑‍💼 Admissions Receptionist**: UHID patient registration, OPD token queue appointments, front-desk triage.
7. **👤 Patient Self-Service**: Electronic health record summary, lab report review, bill payments, telemedicine room access.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling & Design System**: Tailwind CSS v3 with clinical slate, teal, and emergency rose palettes
- **Icons**: Lucide React
- **Cryptography**: Web Crypto API / SHA-256 Hash Chaining
- **State Management**: Reactive React Context with LocalStorage persistence and reset capability
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile devices

---

## ⚡ Getting Started & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/pulsecare-hospital-os.git
cd pulsecare-hospital-os
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the platform.

### 4. Build for production
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory ready for deployment to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 🛡️ Regulatory Standards & Compliance

- **HIPAA**: § 164.312(b) Audit Controls via cryptographic hash chaining.
- **HL7 / FHIR**: Standardized EHR patient resource schema and lab diagnostics nomenclature.
- **Clinical Protocols**:
  - UK Royal College of Physicians **NEWS2 / MEWS** deterioration scoring.
  - Emergency Severity Index (**ESI Levels 1 to 5**).
  - American College of Cardiology (**ACC/AHA**) door-to-balloon guidelines.
  - UNOS/OPTN organ allocation compatibility standards.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
