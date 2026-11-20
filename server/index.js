import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db, INITIAL_PERSONAS } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PulseCare-Enterprise-HMS');
  next();
});

// -------------------------------------------------------------
// 1. PERSONAS MANAGEMENT (ADD / EDIT / DELETE PERSONA)
// -------------------------------------------------------------
app.get('/api/personas', (req, res) => {
  res.json(db.get('personas'));
});

app.post('/api/personas', (req, res) => {
  const { name, role, title, email, department, avatar, permissions, licenseNumber } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required.' });
  }

  const newPersona = {
    id: `PER-${Date.now().toString().slice(-4)}`,
    name,
    role,
    title: title || `${role.toUpperCase()} Specialist`,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@pulsecare.health`,
    department: department || 'General Medicine',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    licenseNumber: licenseNumber || undefined,
    permissions: permissions || ['VIEW_EHR'],
    isSystemDefault: false,
    createdAt: new Date().toISOString(),
  };

  db.insert('personas', newPersona);

  // Cross-module sync: Automatically register doctor personas into Doctors Roster
  if (role === 'doctor') {
    const doctorName = name.startsWith('Dr.') ? name : `Dr. ${name}`;
    const newDoctor = {
      id: `DOC-${newPersona.id}`,
      name: doctorName,
      specialty: department || title || 'General Medicine',
      department: department || 'General Medicine',
      qualifications: title || 'MBBS, MD',
      experienceYears: 8,
      phone: '+1 (555) 234-5678',
      email: newPersona.email,
      consultationFee: 120,
      rating: 4.9,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      shiftTiming: '09:00 AM - 05:00 PM',
      isOnDuty: true,
      avatar: newPersona.avatar,
      personaId: newPersona.id,
    };
    db.insert('doctors', newDoctor);
  } else if (role === 'patient') {
    // Cross-module sync: Automatically register patient personas into Patient Registry
    const newPatient = {
      id: `PAT-${newPersona.id}`,
      uhid: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newPersona.name,
      age: 29,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1 (555) 345-6789',
      email: newPersona.email,
      address: 'Registered via Persona Intake Portal',
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Spouse',
        phone: '+1 (555) 999-1122',
      },
      allergies: [],
      chronicConditions: [newPersona.title || 'General Checkup'],
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
      personaId: newPersona.id,
    };
    db.insert('patients', newPatient);
  }

  res.status(201).json(newPersona);
});

app.put('/api/personas/:id', (req, res) => {
  const updated = db.update('personas', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  res.json(updated);
});

app.delete('/api/personas/:id', (req, res) => {
  const persona = db.get('personas').find((p) => p.id === req.params.id);
  if (!persona) {
    return res.status(404).json({ error: 'Persona not found' });
  }
  if (persona.id === 'ADM-01') {
    return res.status(403).json({ error: 'Security constraint: The primary root administrator cannot be deleted.' });
  }
  db.delete('personas', req.params.id);

  // Cross-module cleanup: also remove synced doctor or patient
  const doctors = db.get('doctors') || [];
  const matchingDoc = doctors.find((d) => d.personaId === req.params.id || d.id === `DOC-${req.params.id}`);
  if (matchingDoc) {
    db.delete('doctors', matchingDoc.id);
  }

  const patients = db.get('patients') || [];
  const matchingPat = patients.find((p) => p.personaId === req.params.id || p.id === `PAT-${req.params.id}`);
  if (matchingPat) {
    db.delete('patients', matchingPat.id);
  }

  res.json({ success: true, message: `Persona ${persona.name} deleted successfully.` });
});

// -------------------------------------------------------------
// 2. PATIENTS API (FULL ADMIN EDIT / ADMIT / VITALS)
// -------------------------------------------------------------
app.get('/api/patients', (req, res) => {
  res.json(db.get('patients'));
});

app.post('/api/patients', (req, res) => {
  const pData = req.body;
  const newPatient = {
    ...pData,
    id: `PAT-${Date.now().toString().slice(-4)}`,
    uhid: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    vitalsHistory: pData.vitalsHistory || [
      {
        id: `VIT-${Date.now()}`,
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
        id: `TL-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: 'Patient Intake & Registration',
        type: 'admission',
        notes: 'Admitted via PulseCare Enterprise Registration Portal.',
        doctorName: pData.doctorName || 'Dr. Sarah Lin',
      }
    ],
  };

  db.insert('patients', newPatient);
  res.status(201).json(newPatient);
});

// Admin / Doctor Edit Any Patient Field
app.put('/api/patients/:id', (req, res) => {
  const updated = db.update('patients', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json(updated);
});

app.delete('/api/patients/:id', (req, res) => {
  db.delete('patients', req.params.id);
  res.json({ success: true });
});

app.post('/api/patients/:id/vitals', (req, res) => {
  const patient = db.get('patients').find((p) => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const newVitalRecord = {
    id: `VIT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body,
  };

  patient.vitalsHistory.unshift(newVitalRecord);
  db.update('patients', patient.id, { vitalsHistory: patient.vitalsHistory });
  res.status(201).json(newVitalRecord);
});

// -------------------------------------------------------------
// 3. DOCTORS & STAFF API
// -------------------------------------------------------------
app.get('/api/doctors', (req, res) => {
  res.json(db.get('doctors'));
});

app.post('/api/doctors', (req, res) => {
  const dData = req.body;
  const newDoctor = {
    ...dData,
    id: dData.id || `DOC-${Date.now().toString().slice(-4)}`,
    experienceYears: dData.experienceYears || 8,
    rating: dData.rating || 4.9,
    availableDays: dData.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    shiftTiming: dData.shiftTiming || '09:00 AM - 05:00 PM',
    isOnDuty: dData.isOnDuty !== undefined ? dData.isOnDuty : true,
    avatar: dData.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
  };
  db.insert('doctors', newDoctor);
  res.status(201).json(newDoctor);
});

app.put('/api/doctors/:id', (req, res) => {
  const updated = db.update('doctors', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Doctor not found' });
  res.json(updated);
});

app.delete('/api/doctors/:id', (req, res) => {
  const success = db.delete('doctors', req.params.id);
  if (!success) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ success: true, message: 'Doctor deleted successfully.' });
});

// -------------------------------------------------------------
// 4. BEDS & WARDS API (ALLOCATION / DISCHARGE / EDIT RATES)
// -------------------------------------------------------------
app.get('/api/beds', (req, res) => {
  res.json(db.get('beds'));
});

app.put('/api/beds/:id', (req, res) => {
  const updated = db.update('beds', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Bed not found' });
  res.json(updated);
});

// -------------------------------------------------------------
// 5. PHARMACY & FORMULARY API
// -------------------------------------------------------------
app.get('/api/medicines', (req, res) => {
  res.json(db.get('medicines'));
});

app.post('/api/medicines', (req, res) => {
  const newMed = {
    ...req.body,
    id: `MED-${Date.now().toString().slice(-4)}`,
  };
  db.insert('medicines', newMed);
  res.status(201).json(newMed);
});

app.put('/api/medicines/:id', (req, res) => {
  const updated = db.update('medicines', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Medicine not found' });
  res.json(updated);
});

// -------------------------------------------------------------
// 6. INVOICES & BILLING API
// -------------------------------------------------------------
app.get('/api/invoices', (req, res) => {
  res.json(db.get('invoices'));
});

app.post('/api/invoices', (req, res) => {
  const newInv = {
    ...req.body,
    id: `INV-${Date.now().toString().slice(-4)}`,
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    billingDate: new Date().toISOString(),
  };
  db.insert('invoices', newInv);
  res.status(201).json(newInv);
});

app.put('/api/invoices/:id', (req, res) => {
  const updated = db.update('invoices', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Invoice not found' });
  res.json(updated);
});

// -------------------------------------------------------------
// 7. APPOINTMENTS API
// -------------------------------------------------------------
app.get('/api/appointments', (req, res) => {
  res.json(db.get('appointments'));
});

app.post('/api/appointments', (req, res) => {
  const apps = db.get('appointments');
  const newApp = {
    ...req.body,
    id: `APP-${Date.now().toString().slice(-4)}`,
    tokenNumber: apps.length + 1,
    createdDate: new Date().toISOString().split('T')[0],
  };
  db.insert('appointments', newApp);
  res.status(201).json(newApp);
});

app.put('/api/appointments/:id', (req, res) => {
  const updated = db.update('appointments', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Appointment not found' });
  res.json(updated);
});

// -------------------------------------------------------------
// 8. EMERGENCY BROADCASTS & CODES API
// -------------------------------------------------------------
app.get('/api/emergency-broadcasts', (req, res) => {
  res.json(db.get('emergencyBroadcasts'));
});

app.post('/api/emergency-broadcasts', (req, res) => {
  const { type, location, reportedBy } = req.body;
  const newBroadcast = {
    id: `EM-BC-${Date.now().toString().slice(-4)}`,
    type,
    location,
    reportedBy: reportedBy || 'Chief Medical Officer',
    timestamp: new Date().toISOString(),
    active: true,
    urgency: 'MAXIMUM_CRITICAL',
    teamPagingStatus: [
      { teamName: 'Anesthesiology Crash Team', status: 'En Route', respondersCount: 2 },
      { teamName: 'Emergency Medical Registrar', status: 'En Route', respondersCount: 1 },
      { teamName: 'ICU Charge Nurse & Defibrillator Team', status: 'On Scene', respondersCount: 2 }
    ],
  };
  db.insert('emergencyBroadcasts', newBroadcast);
  res.status(201).json(newBroadcast);
});

app.put('/api/emergency-broadcasts/:id/resolve', (req, res) => {
  const updated = db.update('emergencyBroadcasts', req.params.id, {
    active: false,
    resolutionNotes: req.body.resolutionNotes || 'Incident cleared and verified by Attending.',
  });
  if (!updated) return res.status(404).json({ error: 'Broadcast not found' });
  res.json(updated);
});

// -------------------------------------------------------------
// 9. BLOOD BANK API
// -------------------------------------------------------------
app.get('/api/blood-bank', (req, res) => {
  res.json(db.get('bloodBank'));
});

app.put('/api/blood-bank/:group', (req, res) => {
  const bloodBank = db.get('bloodBank');
  const item = bloodBank.find((b) => b.bloodGroup === req.params.group);
  if (!item) return res.status(404).json({ error: 'Blood group not found' });

  const delta = req.body.deltaUnits || 0;
  item.unitsAvailable = Math.max(0, item.unitsAvailable + delta);
  item.tempStatus = item.unitsAvailable < item.minSafeUnits ? 'Warning' : 'Optimal';
  db.set('bloodBank', bloodBank);
  res.json(item);
});

// -------------------------------------------------------------
// 10. REAL-TIME CONTINUOUS SYNC & LIVE TELEMETRY SIMULATION
// -------------------------------------------------------------
// Generates live ICU telemetry jitter so monitors reflect live patients
let telemetryTick = 0;

app.get('/api/sync/live-state', (req, res) => {
  telemetryTick++;

  // Periodically jitter active inpatient vitals to simulate live hospital patient monitors
  const patients = db.get('patients');
  if (telemetryTick % 2 === 0 && patients.length > 0) {
    const p = patients[0]; // Eleanor Harrison in ICU
    if (p.vitalsHistory && p.vitalsHistory[0]) {
      const v = p.vitalsHistory[0];
      // Random realistic fluctuation +/- 2 bpm, +/- 1 SpO2
      const hrJitter = Math.floor(Math.random() * 5) - 2;
      const spo2Jitter = Math.floor(Math.random() * 3) - 1;
      v.heartRate = Math.min(140, Math.max(70, v.heartRate + hrJitter));
      v.spO2 = Math.min(100, Math.max(90, v.spO2 + spo2Jitter));
      v.timestamp = new Date().toISOString();
      db.update('patients', p.id, { vitalsHistory: p.vitalsHistory });
    }
  }

  res.json({
    timestamp: new Date().toISOString(),
    personas: db.get('personas'),
    patients: db.get('patients'),
    doctors: db.get('doctors'),
    beds: db.get('beds'),
    medicines: db.get('medicines'),
    invoices: db.get('invoices'),
    appointments: db.get('appointments'),
    bloodBank: db.get('bloodBank'),
    emergencyBroadcasts: db.get('emergencyBroadcasts'),
  });
});

// -------------------------------------------------------------
// 10. REAL-TIME AI CHATBOT API (FREE PUBLIC LLM + GEMINI/OPENAI KEY)
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, provider, apiKey, hospitalContext } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Construct comprehensive clinical and hospital context
  const systemPrompt = `You are PulseAI, an advanced real-time Clinical & Operational AI for PulseCare Enterprise Hospital Management System.
Current Real-Time Hospital Knowledge:
- Active Patients: ${hospitalContext?.patientsCount || '6'} registered inpatients & outpatients (e.g. Eleanor Harrison in ICU Bed 101, etc.).
- Bed Fleet: ${hospitalContext?.bedsCount || '12'} beds total across ICU, CCU, Emergency, General Ward.
- Doctors: ${hospitalContext?.doctorsCount || '6'} on-duty specialists across Cardiology, Trauma ER, Nephrology, Surgery.
- Blood Bank: ${hospitalContext?.bloodUnits || '96'} units across 8 blood groups (O- is critically low at 4 units).
- Pharmacy Formularies: ${hospitalContext?.medicinesCount || '12'} pharmaceuticals.
- Emergency Codes: Active Code Blue crash team paging operations.

INSTRUCTIONS:
1. Provide accurate, helpful, and empathetic answers to BOTH hospital-specific questions and ANY general medical, scientific, operational, or everyday questions the user asks.
2. If the user asks about patients, beds, doctors, appointments, or blood bank, reference the live hospital context with specific numbers and actionable steps.
3. If the user asks medical or diagnostic questions, provide evidence-based clinical guidance, differential diagnoses, or pharmacological cautions.
4. Format responses cleanly with markdown bullet points, bold key terms, and emojis where appropriate.`;

  // 1. Google Gemini API (If user provided Gemini Key)
  if (provider === 'gemini' && apiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
        }
      ];

      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (resp.ok) {
        const data = await resp.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return res.json({ text: replyText, source: 'gemini' });
        }
      }
    } catch (err) {
      console.error('Gemini API call failed:', err.message);
    }
  }

  // 2. OpenAI API (If user provided OpenAI Key)
  if (provider === 'openai' && apiKey) {
    try {
      const openaiUrl = 'https://api.openai.com/v1/chat/completions';
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).slice(-6),
        { role: 'user', content: message }
      ];

      const resp = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 800
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const replyText = data.choices?.[0]?.message?.content;
        if (replyText) {
          return res.json({ text: replyText, source: 'openai' });
        }
      }
    } catch (err) {
      console.error('OpenAI API call failed:', err.message);
    }
  }

  // 3. Free Public Cloud LLM (Pollinations.ai / Free AI - No API key needed)
  try {
    const pollinationsUrl = 'https://text.pollinations.ai/';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-4),
      { role: 'user', content: message }
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
        return res.json({ text: replyText.trim(), source: 'free-cloud-ai' });
      }
    }
  } catch (err) {
    // Timeout or network error; gracefully falls back to local clinical engine
  }

  // 4. Local Clinical Engine Signal
  return res.json({
    text: null,
    source: 'local-fallback',
    message: 'Using local intelligent clinical rules engine'
  });
});

// System Reset Endpoint
app.post('/api/system/reset', (req, res) => {
  const fresh = db.createDefaultDatabase();
  res.json({ success: true, message: 'All hospital database records restored to default seed.', data: fresh });
});

// Serve frontend static build if dist folder exists (Single-port production deployment)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`\n🏥 PulseCare Enterprise HMS Backend API running on http://localhost:${PORT}`);
  console.log(`📁 Persistent Database: server/data/hospital_db.json`);
  console.log(`📡 Real-Time Telemetry & Sync: http://localhost:${PORT}/api/sync/live-state\n`);
});
