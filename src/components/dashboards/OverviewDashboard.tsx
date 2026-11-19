import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../common/StatCard';
import {
  Users,
  Bed,
  Activity,
  DollarSign,
  AlertOctagon,
  Calendar,
  Pill,
  Droplet,
  ShieldCheck,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    patients,
    beds,
    medicines,
    appointments,
    emergencyCases,
    bloodBank,
    emergencyBroadcasts,
    setActiveTab,
  } = useHospital();

  const activeInpatients = patients.filter((p) => p.admissionStatus === 'Inpatient').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const bedOccupancyRate = Math.round((occupiedBeds / beds.length) * 100);
  const activeEmergencies = emergencyBroadcasts.filter((b) => b.active);
  const lowStockMeds = medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length;

  return (
    <div className="space-y-6">
      {/* Banner / Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            PulseCare Enterprise Operations Control
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
            Next-Gen Hospital Management & Clinical AI Platform
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-teal-100 leading-relaxed opacity-90">
            Featuring 10 Core Hospital Administration Modules and 10 Advanced Clinical Artificial Intelligence, Sepsis Prediction, and Critical Care Systems.
          </p>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* High-Level Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Inpatient Census"
          value={`${activeInpatients} Patients`}
          subtitle="Currently admitted to wards"
          icon={Users}
          trend={{ value: '+4.2% today', isPositive: true }}
          colorScheme="teal"
        />

        <StatCard
          title="Bed Fleet Occupancy"
          value={`${bedOccupancyRate}%`}
          subtitle={`${occupiedBeds} of ${beds.length} beds allocated`}
          icon={Bed}
          trend={{ value: 'Fleet Stable', isPositive: true }}
          colorScheme={bedOccupancyRate > 85 ? 'rose' : 'teal'}
        />

        <StatCard
          title="Emergency Department"
          value={`${emergencyCases.length} Active`}
          subtitle="Trauma & emergent arrivals"
          icon={Activity}
          trend={{ value: 'Trauma Bay 1 Docked', isPositive: false }}
          colorScheme="rose"
        />

        <StatCard
          title="Formulary Alerts"
          value={`${lowStockMeds} Items Low`}
          subtitle="Stock below reorder safety level"
          icon={Pill}
          colorScheme={lowStockMeds > 0 ? 'amber' : 'teal'}
        />
      </div>

      {/* Feature Showcase Navigation Grid: 10 Core & 10 Advanced Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 10 Advanced Feature Cards */}
        <div className="rounded-2xl border border-teal-200/80 bg-white p-5 shadow-sm dark:border-teal-900/50 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              10 Cutting-Edge & Unique Features
            </span>
            <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
              Live Interactive
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'adv-cdss', name: '1. AI CDSS & Drug Interaction', desc: 'Lethal DDI & allergy conflict safety checker' },
              { id: 'adv-mews', name: '2. Early Warning Score (MEWS)', desc: 'Predictive sepsis & deterioration algorithm' },
              { id: 'adv-triage', name: '3. Smart AI Triage Assistant', desc: 'NLP Emergency Severity Index (ESI) mapping' },
              { id: 'adv-floorplan', name: '4. Spatial Ward Floor Plan', desc: 'Interactive 2D architectural bed visualizer' },
              { id: 'adv-bloodbank', name: '5. Blood Bank & Plasma Match', desc: 'Cold-chain storage & transfusion cross-match' },
              { id: 'adv-scribe', name: '6. Ambient AI Clinical Scribe', desc: 'Natural voice to SOAP note & ICD-10 codes' },
              { id: 'adv-audit', name: '7. Cryptographic PHI Ledger', desc: 'SHA-256 blockchain HIPAA compliance trail' },
              { id: 'adv-code-dispatcher', name: '8. Code Blue & Disaster Dispatch', desc: 'Crash team paging & disaster management' },
              { id: 'adv-organ-match', name: '9. Organ Transplant Registry', desc: 'HLA match formula & cold ischemia timer' },
              { id: 'adv-telemedicine', name: '10. Telemedicine Suite', desc: 'WebRTC room with live vitals telemetry' },
            ].map((f) => (
              <div
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:border-teal-500 hover:bg-teal-50/40 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-teal-600 transition-all"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{f.name}</span>
                  <ArrowRight className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Core Common Features */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              10 Core Enterprise Hospital Features
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              HIPAA Ready
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'core-patients', name: '1. Patient EHR Registry', desc: 'Longitudinal EHR, demographics & vitals' },
              { id: 'core-doctors', name: '2. Doctor Directory & Roster', desc: 'Specialties, shifts & on-duty availability' },
              { id: 'core-appointments', name: '3. OPD Queue & Tokens', desc: 'Automated token queue & slot booking' },
              { id: 'core-beds', name: '4. Bed & Ward Management', desc: 'ICU, CCU, Ward beds & O2 allocation' },
              { id: 'core-pharmacy', name: '5. Pharmacy Inventory', desc: 'Formulary stock, batch codes & reorders' },
              { id: 'core-lab', name: '6. Laboratory & Diagnostics', desc: 'Pathology/radiology test orders & reports' },
              { id: 'core-billing', name: '7. Medical Billing & Insurance', desc: 'Itemized invoices & TPA claims' },
              { id: 'core-emergency', name: '8. ER Rapid Intake Desk', desc: 'Ambulance triage dock & trauma bays' },
              { id: 'core-role-portal', name: '9. Multi-Role RBAC Portals', desc: '7 role dashboards with least privilege' },
              { id: 'core-prescription', name: '10. Digital Prescription Pad', desc: 'Doctor E-Rx with digital signature stamp' },
            ].map((f) => (
              <div
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:border-teal-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-teal-600 transition-all"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{f.name}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
