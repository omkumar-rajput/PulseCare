import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  AlertOctagon,
  Search,
  UserCheck,
  RotateCcw,
  Activity,
  HeartPulse,
  Users,
  Radio
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenRoleModal: () => void;
  onOpenPersonaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRoleModal, onOpenPersonaModal }) => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    darkMode,
    setDarkMode,
    liveSyncActive,
    notifications,
    emergencyBroadcasts,
    broadcastEmergencyCode,
    resetAllDataToDefaults,
    setActiveTab,
  } = useHospital();

  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<'Code Blue (Cardiac)' | 'Code Red (Fire)' | 'Code Black (Threat)' | 'Mass Casualty Incident'>('Code Blue (Cardiac)');
  const [emergencyLocation, setEmergencyLocation] = useState('ICU Floor 2, Bed 102');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const activeEmergencies = emergencyBroadcasts.filter((b) => b.active);

  const handleTriggerEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastEmergencyCode(selectedCode, emergencyLocation);
    setShowEmergencyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
        {/* Left: Brand & Active Emergency Banner */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab(currentRole === 'patient' ? 'patient-portal' : 'dashboard')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">PulseCare</span>
                <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">OS 2.0</span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Enterprise Full-Stack HMS</p>
            </div>
          </div>

          {/* Continuous Live Sync Pulse */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE SYNC ACTIVE (3s Telemetry)</span>
          </div>

          {activeEmergencies.length > 0 && (
            <div 
              onClick={() => setActiveTab('adv-code-dispatcher')}
              className="hidden lg:flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 cursor-pointer animate-pulse hover:bg-red-500/20"
            >
              <AlertOctagon className="h-4 w-4" />
              <span>ACTIVE: {activeEmergencies[0].type} @ {activeEmergencies[0].location}</span>
            </div>
          )}
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search UHID, patient name, doctor, medicine, or diagnostic..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-teal-400"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Emergency Code Trigger Button */}
          {currentRole !== 'patient' && (
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all"
              title="Dispatch Hospital Emergency Code"
            >
              <AlertOctagon className="h-4 w-4" />
              <span className="hidden sm:inline">Dispatch Code</span>
            </button>
          )}

          {/* Manage Personas Button */}
          <button
            onClick={onOpenPersonaModal}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-2.5 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
            title="Add, edit or delete hospital personas"
          >
            <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Manage Personas</span>
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={onOpenRoleModal}
            className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/60 px-2.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60 transition-colors"
          >
            <UserCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span className="capitalize">{currentRole.replace('_', ' ')}</span>
            <span className="text-[10px] bg-teal-200/80 dark:bg-teal-800/80 px-1 py-0.2 rounded font-mono">Switch</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600"></span>
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">System Notifications</span>
                  <span className="text-[10px] text-slate-400">{notifications.length} alerts</span>
                </div>
                <div className="mt-2 max-h-60 space-y-2 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400">No new alerts.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-lg p-2.5 text-xs ${
                          n.type === 'critical'
                            ? 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300'
                            : n.type === 'warning'
                            ? 'bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300'
                            : 'bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-semibold">{n.title}</div>
                        <div className="text-[11px] opacity-90">{n.message}</div>
                        <div className="mt-1 text-[9px] text-slate-400">{n.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetAllDataToDefaults}
            className="hidden sm:flex rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Reset to clean benchmark seed"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser?.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-teal-500/20"
            />
          </div>
        </div>
      </header>

      {/* Emergency Code Broadcast Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-white p-6 shadow-2xl dark:border-red-900/50 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="rounded-xl bg-red-100 p-2.5 dark:bg-red-950/60">
                <AlertOctagon className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold">Emergency Protocol Broadcast</h3>
                <p className="text-xs text-slate-500">Hospital-wide automated page to all crash teams</p>
              </div>
            </div>

            <form onSubmit={handleTriggerEmergency} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Emergency Code Type</label>
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Code Blue (Cardiac)">Code Blue (Cardiac / Respiratory Arrest)</option>
                  <option value="Code Red (Fire)">Code Red (Fire / Smoke Hazard)</option>
                  <option value="Code Black (Threat)">Code Black (Security / Active Threat)</option>
                  <option value="Mass Casualty Incident">Mass Casualty Incident (MCI Protocol)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exact Hospital Location</label>
                <input
                  type="text"
                  required
                  value={emergencyLocation}
                  onChange={(e) => setEmergencyLocation(e.target.value)}
                  placeholder="e.g. ICU Floor 2, Room 201"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-300">
                ⚠️ Triggering will notify the Anesthesiology Crash Team, ICU Registrars, and log an immutable entry into the cryptographic audit ledger.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 active:scale-95 transition-all"
                >
                  TRANSMIT BROADCAST NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
