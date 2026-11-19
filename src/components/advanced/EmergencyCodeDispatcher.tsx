import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyCodeType, EmergencyBroadcast } from '../../types';
import {
  Radio,
  AlertOctagon,
  Flame,
  ShieldAlert,
  HeartPulse,
  Users,
  CheckCircle2,
  Clock,
  Send,
  X
} from 'lucide-react';

export const EmergencyCodeDispatcher: React.FC = () => {
  const { emergencyBroadcasts, broadcastEmergencyCode, resolveEmergencyBroadcast } = useHospital();
  const [selectedType, setSelectedType] = useState<EmergencyCodeType>('Code Blue (Cardiac)');
  const [location, setLocation] = useState('ICU Floor 2 - Room 202');
  const [resolutionModalId, setResolutionModalId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Return of spontaneous circulation (ROSC) achieved. Patient transferred to CCU.');

  const activeCodes = emergencyBroadcasts.filter((b) => b.active);
  const resolvedCodes = emergencyBroadcasts.filter((b) => !b.active);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastEmergencyCode(selectedType, location);
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionModalId) return;
    resolveEmergencyBroadcast(resolutionModalId, resolutionNotes);
    setResolutionModalId(null);
  };

  const codeConfig = {
    'Code Blue (Cardiac)': {
      bg: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      icon: HeartPulse,
      badge: 'bg-red-600 text-white',
    },
    'Code Red (Fire)': {
      bg: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      icon: Flame,
      badge: 'bg-orange-600 text-white',
    },
    'Code Black (Threat)': {
      bg: 'border-slate-800 bg-slate-900/10 text-slate-800 dark:text-slate-200',
      icon: ShieldAlert,
      badge: 'bg-slate-900 text-white',
    },
    'Code Pink (Infant)': {
      bg: 'border-pink-400 bg-pink-500/10 text-pink-700 dark:text-pink-300',
      icon: Users,
      badge: 'bg-pink-600 text-white',
    },
    'Mass Casualty Incident': {
      bg: 'border-rose-500 bg-rose-600/10 text-rose-800 dark:text-rose-200',
      icon: AlertOctagon,
      badge: 'bg-rose-700 text-white',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-red-100 p-2 text-red-700 dark:bg-red-950 dark:text-red-300">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Emergency Code & Disaster Protocol Dispatcher</h1>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800 dark:bg-red-900/60 dark:text-red-300">
                Advanced Feature #8
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Institutional crisis broadcast matrix for Code Blue (Cardiac), Code Red (Fire), Code Black (Threat) and Mass Casualty triage influx.
            </p>
          </div>
        </div>
      </div>

      {/* Broadcast Launch Console */}
      <div className="rounded-2xl border border-red-200 bg-red-50/30 p-5 dark:border-red-900/40 dark:bg-red-950/10 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-red-600" />
          Transmit Instant Hospital-Wide Emergency Page
        </h3>

        <form onSubmit={handleBroadcast} className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Emergency Protocol Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Code Blue (Cardiac)">Code Blue (Cardiac / Respiratory Arrest)</option>
              <option value="Code Red (Fire)">Code Red (Fire / Smoke / Hazardous Fumes)</option>
              <option value="Code Black (Threat)">Code Black (Security Incident / Threat)</option>
              <option value="Code Pink (Infant)">Code Pink (Infant Abduction / Pediatric Alert)</option>
              <option value="Mass Casualty Incident">Mass Casualty Incident (MCI Protocol)</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Exact Hospital Coordinates / Bed</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ward 3 North, Room 304"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>DISPATCH CODE NOW</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Broadcasts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Emergency Broadcasts ({activeCodes.length})
          </span>
          {activeCodes.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-red-600"></span> Live Crash Teams En Route
            </span>
          )}
        </div>

        {activeCodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
            ✅ No active hospital emergency codes at this moment. All wards operational.
          </div>
        ) : (
          activeCodes.map((bc) => {
            const config = codeConfig[bc.type] || codeConfig['Code Blue (Cardiac)'];
            const Icon = config.icon;

            return (
              <div
                key={bc.id}
                className="rounded-2xl border-2 border-red-500 bg-red-50/70 p-5 shadow-lg dark:border-red-700 dark:bg-red-950/30 animate-pulse-fast"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200 pb-3 dark:border-red-900">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-600 p-2.5 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-red-900 dark:text-red-200">{bc.type}</h3>
                        <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                          ACTIVE CRISIS
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-red-800 dark:text-red-300 mt-0.5">
                        Location: <strong>{bc.location}</strong> • Dispatched by {bc.reportedBy}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setResolutionModalId(bc.id)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  >
                    Stand Down & Resolve
                  </button>
                </div>

                {/* Team Paging Live Status */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bc.teamPagingStatus.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-white/90 p-3 text-xs dark:bg-slate-900/80 border border-red-200/60 dark:border-red-900"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{t.teamName}</div>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{t.respondersCount} Responders Assigned</span>
                        <span className="rounded bg-teal-100 px-2 py-0.5 font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Historical Resolved Incident Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Resolved Incidents</span>
        <div className="mt-3 space-y-3">
          {resolvedCodes.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{r.type} @ {r.location}</span>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(r.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{r.resolutionNotes || 'Cleared without complications.'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Modal */}
      {resolutionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency Code Stand-Down</h3>
              <button onClick={() => setResolutionModalId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResolve} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clinical Resolution Notes / Post-Incident Summary</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResolutionModalId(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Confirm Stand-Down
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
