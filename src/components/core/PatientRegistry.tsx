import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, VitalRecord } from '../../types';
import {
  Users,
  Search,
  Plus,
  Heart,
  Activity,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  FileText,
  Calendar,
  X,
  ShieldAlert,
  ChevronRight,
  Droplet
} from 'lucide-react';

export const PatientRegistry: React.FC = () => {
  const { patients, addPatient, updatePatientVitals, doctors, beds } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  // Add Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 35,
    gender: 'Male' as const,
    bloodGroup: 'O+' as const,
    phone: '',
    email: '',
    address: '',
    emergencyContact: { name: '', relationship: '', phone: '' },
    allergies: '',
    chronicConditions: '',
    admissionStatus: 'Outpatient' as const,
  });

  // Vitals Update State
  const [newVitals, setNewVitals] = useState({
    heartRate: 75,
    systolicBp: 120,
    diastolicBp: 80,
    respiratoryRate: 16,
    spO2: 98,
    temperature: 37.0,
    avpu: 'Alert' as const,
  });

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.admissionStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addPatient({
      ...newPatient,
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map((s) => s.trim()) : [],
      chronicConditions: newPatient.chronicConditions ? newPatient.chronicConditions.split(',').map((s) => s.trim()) : [],
    });
    setSelectedPatient(created);
    setShowAddModal(false);
  };

  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    updatePatientVitals(selectedPatient.id, newVitals);
    // Refresh local selected
    const updated = patients.find((p) => p.id === selectedPatient.id);
    if (updated) setSelectedPatient(updated);
    setShowVitalsModal(false);
  };

  const latestVitals = selectedPatient?.vitalsHistory?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Patient Electronic Health Records (EHR)</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive longitudinal patient medical records, vitals telemetry, allergy tracking, and clinical history.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Patient Intake</span>
        </button>
      </div>

      {/* Main Grid: Patient List & Detailed EHR View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Directory & Search */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search UHID, name, blood group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              const hasAllergies = patient.allergies && patient.allergies.length > 0;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 shadow-md dark:border-teal-500/80 dark:bg-teal-950/30 ring-1 ring-teal-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{patient.name}</span>
                        <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{patient.uhid}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{patient.age} yrs • {patient.gender}</span>
                        <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                          <Droplet className="h-3 w-3" /> {patient.bloodGroup}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        patient.admissionStatus === 'Inpatient'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : patient.admissionStatus === 'Emergency'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 animate-pulse'
                          : patient.admissionStatus === 'Discharged'
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {patient.admissionStatus}
                    </span>
                  </div>

                  {hasAllergies && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-lg">
                      <ShieldAlert className="h-3 w-3 flex-shrink-0" />
                      <span>Allergies: {patient.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Selected Patient EHR */}
        {selectedPatient ? (
          <div className="lg:col-span-7 space-y-4">
            {/* Patient Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedPatient.name}</h2>
                    <span className="rounded-lg bg-teal-100 px-2 py-0.5 text-xs font-mono font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                      {selectedPatient.uhid}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {selectedPatient.age} years old • {selectedPatient.gender} • Blood Group: <strong className="text-rose-600">{selectedPatient.bloodGroup}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setShowVitalsModal(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-300"
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>Record Telemetry Vitals</span>
                </button>
              </div>

              {/* Patient Quick Info Pills */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Emergency Contact</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.emergencyContact.name || 'Not provided'}</div>
                  <div className="text-[10px] text-slate-500">{selectedPatient.emergencyContact.phone}</div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Assigned Bed</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPatient.assignedBedId || 'None (Ambulatory)'}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Phone & Contact</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.phone}</div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Admission Status</span>
                  <div className="font-bold text-teal-600 dark:text-teal-400">{selectedPatient.admissionStatus}</div>
                </div>
              </div>

              {/* Allergies and Chronic Illnesses */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-900/50 dark:bg-rose-950/20">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Documented Allergies</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map((all) => (
                        <span key={all} className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                          {all}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">NKDA (No Known Drug Allergies)</span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Chronic Medical History</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {selectedPatient.chronicConditions.length > 0 ? (
                      selectedPatient.chronicConditions.map((cond) => (
                        <span key={cond} className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          {cond}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">None reported</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Telemetry Vitals Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Current Vital Signs & Telemetry</span>
                </div>
                {latestVitals && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Last Logged: {new Date(latestVitals.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {latestVitals ? (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-[10px] font-semibold text-slate-400">Heart Rate</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-xl font-black ${latestVitals.heartRate > 100 || latestVitals.heartRate < 55 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                        {latestVitals.heartRate}
                      </span>
                      <span className="text-[10px] text-slate-400">bpm</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-[10px] font-semibold text-slate-400">Blood Pressure</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-xl font-black ${latestVitals.systolicBp > 140 || latestVitals.systolicBp < 90 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                        {latestVitals.systolicBp}/{latestVitals.diastolicBp}
                      </span>
                      <span className="text-[10px] text-slate-400">mmHg</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-[10px] font-semibold text-slate-400">Oxygen Saturation (SpO2)</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-xl font-black ${latestVitals.spO2 < 94 ? 'text-rose-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {latestVitals.spO2}%
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-[10px] font-semibold text-slate-400">Respiratory Rate</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900 dark:text-white">{latestVitals.respiratoryRate}</span>
                      <span className="text-[10px] text-slate-400">/min</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-[10px] font-semibold text-slate-400">Temperature</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-xl font-black ${latestVitals.temperature > 38.0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                        {latestVitals.temperature}°C
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-[10px] font-semibold text-slate-400">Consciousness (AVPU)</div>
                    <div className="mt-1 font-bold text-sm text-slate-900 dark:text-white">{latestVitals.avpu}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No telemetry recorded yet.</p>
              )}
            </div>

            {/* Medical Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Clinical Encounters Timeline</span>
              </div>

              <div className="mt-4 space-y-4">
                {selectedPatient.medicalTimeline.map((item, idx) => (
                  <div key={item.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-teal-500 bg-white dark:bg-slate-900"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.notes}</p>
                    <div className="mt-1 text-[10px] text-slate-400 font-semibold">Attending: {item.doctorName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 flex h-96 items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
            Select a patient from the directory to review Electronic Health Records.
          </div>
        )}
      </div>

      {/* Modal: New Patient Intake */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">New Patient Registration</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="e.g. Liam Montgomery"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Age</label>
                  <input
                    type="number"
                    required
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="patient@email.com"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Known Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, NSAID, Sulfa"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chronic Conditions (Comma separated)</label>
                <input
                  type="text"
                  value={newPatient.chronicConditions}
                  onChange={(e) => setNewPatient({ ...newPatient, chronicConditions: e.target.value })}
                  placeholder="e.g. Type 2 Diabetes, Hypertension"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Save & Generate UHID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Telemetry Vitals */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Vital Signs Telemetry</h3>
              <button onClick={() => setShowVitalsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateVitals} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={newVitals.heartRate}
                    onChange={(e) => setNewVitals({ ...newVitals, heartRate: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">SpO2 (%)</label>
                  <input
                    type="number"
                    value={newVitals.spO2}
                    onChange={(e) => setNewVitals({ ...newVitals, spO2: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newVitals.systolicBp}
                    onChange={(e) => setNewVitals({ ...newVitals, systolicBp: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newVitals.diastolicBp}
                    onChange={(e) => setNewVitals({ ...newVitals, diastolicBp: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Respiratory Rate (/min)</label>
                  <input
                    type="number"
                    value={newVitals.respiratoryRate}
                    onChange={(e) => setNewVitals({ ...newVitals, respiratoryRate: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newVitals.temperature}
                    onChange={(e) => setNewVitals({ ...newVitals, temperature: parseFloat(e.target.value) || 37.0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">AVPU Consciousness</label>
                <select
                  value={newVitals.avpu}
                  onChange={(e) => setNewVitals({ ...newVitals, avpu: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Alert">Alert (Spontaneous eye opening & orient)</option>
                  <option value="Voice">Voice (Responds to verbal stimulus)</option>
                  <option value="Pain">Pain (Responds to pain stimulus)</option>
                  <option value="Unresponsive">Unresponsive (No motor/eye response)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Save Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
