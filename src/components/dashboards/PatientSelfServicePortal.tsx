import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  User,
  Heart,
  Activity,
  Calendar,
  FlaskConical,
  Pill,
  Receipt,
  Video,
  ShieldCheck,
  Droplet,
  Clock,
  Printer
} from 'lucide-react';

export const PatientSelfServicePortal: React.FC = () => {
  const { patients, appointments, labOrders, invoices, setActiveTab } = useHospital();
  const patient = patients[0]; // Eleanor Harrison

  const patientAppointments = appointments.filter((a) => a.patientId === patient.id || a.patientName === patient.name);
  const patientLabOrders = labOrders.filter((l) => l.patientId === patient.id || l.patientName === patient.name);
  const patientInvoices = invoices.filter((i) => i.patientId === patient.id || i.patientName === patient.name);
  const latestVitals = patient.vitalsHistory[0];

  return (
    <div className="space-y-6">
      {/* Patient Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 to-slate-900 p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white font-black text-2xl backdrop-blur-md">
            EH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{patient.name}</h1>
              <span className="rounded-full bg-teal-400/20 px-2.5 py-0.5 text-xs font-mono font-bold text-teal-200">
                {patient.uhid}
              </span>
            </div>
            <p className="mt-1 text-xs text-teal-100 opacity-90">
              {patient.age} yrs • {patient.gender} • Blood Group: <strong className="text-white">{patient.bloodGroup}</strong> • Status: {patient.admissionStatus}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('core-appointments')}
          className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-teal-900 shadow hover:bg-teal-50 transition-colors"
        >
          + Book Consultation Slot
        </button>
      </div>

      {/* Grid: Health Summary, Vitals & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Health Profile & Vitals */}
        <div className="lg:col-span-5 space-y-4">
          {/* Key Vitals */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-teal-600" />
              Recent Telemetry Vital Signs
            </span>

            {latestVitals ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Heart Rate</span>
                  <div className="text-base font-black text-slate-900 dark:text-white">{latestVitals.heartRate} bpm</div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Blood Pressure</span>
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {latestVitals.systolicBp}/{latestVitals.diastolicBp}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Oxygen (SpO2)</span>
                  <div className="text-base font-black text-emerald-600">{latestVitals.spO2}%</div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400">Temperature</span>
                  <div className="text-base font-black text-slate-900 dark:text-white">{latestVitals.temperature}°C</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No vitals logged.</p>
            )}
          </div>

          {/* Allergies & Conditions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Documented Drug Allergies:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {patient.allergies.map((a) => (
                  <span key={a} className="rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Chronic Diagnoses:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {patient.chronicConditions.map((c) => (
                  <span key={c} className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appointments & Diagnostic Reports */}
        <div className="lg:col-span-7 space-y-4">
          {/* Upcoming Appointments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-teal-600" />
              Scheduled Appointments & Virtual Care
            </span>

            <div className="space-y-2.5">
              {patientAppointments.length === 0 ? (
                <p className="text-xs text-slate-400">No appointments scheduled.</p>
              ) : (
                patientAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{app.doctorName} ({app.department})</div>
                      <div className="text-[11px] text-slate-500">
                        Date: {app.appointmentDate} at {app.timeSlot} • Type: <strong>{app.type}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.type === 'Telemedicine' && (
                        <button
                          onClick={() => setActiveTab('adv-telemedicine')}
                          className="flex items-center gap-1 rounded-lg bg-purple-600 px-2.5 py-1 text-white font-bold"
                        >
                          <Video className="h-3 w-3" />
                          <span>Join Video</span>
                        </button>
                      )}
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Diagnostic Lab Reports */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FlaskConical className="h-4 w-4 text-teal-600" />
              Verified Laboratory Results & Reports
            </span>

            <div className="space-y-2.5">
              {patientLabOrders.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{l.testName}</div>
                    <div className="text-[11px] text-slate-400">Order: {l.orderNumber} • {l.category}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        l.status === 'Critical Alert'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {l.status}
                    </span>
                    <button
                      onClick={() => setActiveTab('core-lab')}
                      className="text-teal-600 font-bold hover:underline"
                    >
                      View &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Receipt className="h-4 w-4 text-teal-600" />
              Billing Invoices & Insurance Pre-Authorization
            </span>

            <div className="space-y-2.5">
              {patientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Invoice #{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-400">
                      Total: ${inv.totalAmount.toFixed(2)} • Co-Pay Due: <strong className="text-rose-600">${inv.insuranceClaim.copayAmount?.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {inv.paymentStatus}
                    </span>
                    <button
                      onClick={() => setActiveTab('core-billing')}
                      className="text-teal-600 font-bold hover:underline"
                    >
                      Receipt &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
