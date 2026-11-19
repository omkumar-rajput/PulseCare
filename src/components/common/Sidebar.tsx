import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Bed,
  Pill,
  FlaskConical,
  Receipt,
  Ambulance,
  FileSignature,
  ShieldCheck,
  Activity,
  HeartPulse,
  BrainCircuit,
  MapPin,
  Droplet,
  Mic,
  Lock,
  Radio,
  Dna,
  Video,
  BarChart3,
  User
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeTab, setActiveTab } = useHospital();

  const coreNavItems = [
    { id: 'core-patients', label: '1. Patient EHR Registry', icon: Users, badge: 'Core' },
    { id: 'core-doctors', label: '2. Doctors & Medical Roster', icon: UserCheck, badge: 'Core' },
    { id: 'core-appointments', label: '3. OPD Appointments & Queue', icon: Calendar, badge: 'Core' },
    { id: 'core-beds', label: '4. Bed & Ward Management', icon: Bed, badge: 'Core' },
    { id: 'core-pharmacy', label: '5. Pharmacy & Drug Inventory', icon: Pill, badge: 'Core' },
    { id: 'core-lab', label: '6. Laboratory & Diagnostics', icon: FlaskConical, badge: 'Core' },
    { id: 'core-billing', label: '7. Medical Billing & Insurance', icon: Receipt, badge: 'Core' },
    { id: 'core-emergency', label: '8. ER Rapid Intake Desk', icon: Ambulance, badge: 'Core' },
    { id: 'core-role-portal', label: '9. Multi-Role RBAC Portals', icon: ShieldCheck, badge: 'Core' },
    { id: 'core-prescription', label: '10. Digital E-Prescription Pad', icon: FileSignature, badge: 'Core' },
  ];

  const advancedNavItems = [
    { id: 'adv-cdss', label: '1. AI CDSS & Drug Interaction', icon: BrainCircuit, badge: 'AI' },
    { id: 'adv-mews', label: '2. MEWS Early Warning Score', icon: Activity, badge: 'Clinical' },
    { id: 'adv-triage', label: '3. Smart AI Triage Assistant', icon: HeartPulse, badge: 'AI' },
    { id: 'adv-floorplan', label: '4. Spatial Ward Floor Plan', icon: MapPin, badge: 'Visual' },
    { id: 'adv-bloodbank', label: '5. Blood Bank & Plasma Match', icon: Droplet, badge: 'Critical' },
    { id: 'adv-scribe', label: '6. Ambient AI Clinical Scribe', icon: Mic, badge: 'AI' },
    { id: 'adv-audit', label: '7. Cryptographic PHI Ledger', icon: Lock, badge: 'Security' },
    { id: 'adv-code-dispatcher', label: '8. Code Blue & Disaster Dispatch', icon: Radio, badge: 'Protocol' },
    { id: 'adv-organ-match', label: '9. Organ Transplant Registry', icon: Dna, badge: 'Algorithmic' },
    { id: 'adv-telemedicine', label: '10. Telemedicine Exam Suite', icon: Video, badge: 'Virtual' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white/80 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 hidden md:flex md:flex-col justify-between h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        {/* Dashboards Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Clinical Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('patient-portal')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === 'patient-portal'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Patient Self-Service</span>
            </button>
          </div>
        </div>

        {/* 10 Unique & Advanced Features Section */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              10 Advanced & AI Features
            </span>
            <span className="rounded bg-teal-100 px-1 py-0.5 text-[9px] font-bold text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
              10/10
            </span>
          </div>
          <div className="space-y-1">
            {advancedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-700 font-bold border border-teal-500/30 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    item.badge === 'AI' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : item.badge === 'Critical'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 10 Core Features Section */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              10 Core Features
            </span>
            <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              10/10
            </span>
          </div>
          <div className="space-y-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-300 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PulseCare Engine
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">v2.0.4 Online</span>
          </div>
          <p className="mt-1 text-[9px] text-slate-400">HIPAA & HL7/FHIR Ready</p>
        </div>
      </div>
    </aside>
  );
};
