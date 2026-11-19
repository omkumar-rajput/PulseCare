import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Droplet,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Send,
  ShieldAlert,
  Flame,
  Radio
} from 'lucide-react';

export const BloodBankMatrix: React.FC = () => {
  const { bloodBank, updateBloodStock, addNotification } = useHospital();
  const [selectedGroup, setSelectedGroup] = useState<string>('O-');

  // Transfusion Cross-Match Compatibility Table
  const compatibilityRules: Record<string, { canReceiveFrom: string[]; canDonateTo: string[] }> = {
    'O-': {
      canReceiveFrom: ['O-'],
      canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+ (Universal Red Cell Donor)'],
    },
    'O+': {
      canReceiveFrom: ['O+', 'O-'],
      canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    },
    'A-': {
      canReceiveFrom: ['A-', 'O-'],
      canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    },
    'A+': {
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      canDonateTo: ['A+', 'AB+'],
    },
    'B-': {
      canReceiveFrom: ['B-', 'O-'],
      canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    },
    'B+': {
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      canDonateTo: ['B+', 'AB+'],
    },
    'AB-': {
      canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
      canDonateTo: ['AB-', 'AB+'],
    },
    'AB+': {
      canReceiveFrom: ['Universal Recipient (All Blood Types)'],
      canDonateTo: ['AB+'],
    },
  };

  const handleSosBroadcast = (bloodGroup: string) => {
    addNotification(
      'critical',
      `🚨 URGENT SOS: ${bloodGroup} SHORTAGE!`,
      `Emergency broadcast sent to regional donor registry and Red Cross partner hospitals.`
    );
  };

  const currentRules = compatibilityRules[selectedGroup] || compatibilityRules['O-'];
  const totalWholeBloodUnits = bloodBank.reduce((acc, b) => acc + b.unitsAvailable, 0);
  const totalPlasmaUnits = bloodBank.reduce((acc, b) => acc + b.plasmaUnits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            <Droplet className="h-5 w-5 fill-rose-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Smart Blood Bank & Cold-Chain Plasma Matrix</h1>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                Advanced Feature #5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live reserve inventory across 8 ABO/Rh blood groups, cold-chain refrigeration telemetry, and transfusion compatibility calculation.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Total Whole Blood</span>
          <div className="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300">{totalWholeBloodUnits} Units</div>
          <span className="text-[10px] text-slate-400">Stored at 3.8°C</span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Fresh Frozen Plasma (FFP)</span>
          <div className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">{totalPlasmaUnits} Units</div>
          <span className="text-[10px] text-slate-400">Stored at -20°C</span>
        </div>

        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-900/50 dark:bg-teal-950/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Cold-Chain Sensors</span>
          <div className="mt-1 text-2xl font-black text-teal-700 dark:text-teal-300">All Optimal</div>
          <span className="text-[10px] text-teal-600 font-semibold">2.0°C - 6.0°C Baseline</span>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Universal O- Negative</span>
          <div className="mt-1 text-2xl font-black text-indigo-700 dark:text-indigo-300">
            {bloodBank.find((b) => b.bloodGroup === 'O-')?.unitsAvailable} Units
          </div>
          <span className="text-[10px] text-rose-600 font-bold">Priority Restock</span>
        </div>
      </div>

      {/* Blood Groups Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {bloodBank.map((b) => {
          const isCritical = b.unitsAvailable < b.minSafeUnits;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedGroup(b.bloodGroup)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
                selectedGroup === b.bloodGroup
                  ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/30 dark:bg-rose-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 font-black text-white text-sm shadow">
                    {b.bloodGroup}
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 dark:text-white">{b.unitsAvailable} Units</div>
                    <div className="text-[10px] text-slate-400">Min safe: {b.minSafeUnits}</div>
                  </div>
                </div>

                {isCritical && (
                  <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white animate-pulse">
                    SOS LOW
                  </span>
                )}
              </div>

              {/* Temperature Reading */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800 text-[11px]">
                <span className="flex items-center gap-1 text-slate-500">
                  <Thermometer className="h-3.5 w-3.5 text-teal-600" />
                  {b.temperatureCelsius}°C
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">{b.tempStatus}</span>
              </div>

              {/* Adjustment buttons */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateBloodStock(b.bloodGroup, -1);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  title="Dispense 1 Unit"
                >
                  - 1
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateBloodStock(b.bloodGroup, 1);
                  }}
                  className="flex-1 rounded-lg bg-teal-600 py-1 text-xs font-bold text-white hover:bg-teal-700"
                  title="Restock 1 Unit"
                >
                  + 1
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Group Transfusion Compatibility & SOS Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              Transfusion Compatibility Matrix for Blood Type: <strong className="text-rose-600 text-sm">{selectedGroup}</strong>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Can receive from */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Patient Can Safely Receive Blood From:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentRules.canReceiveFrom.map((grp) => (
                  <span key={grp} className="rounded-lg bg-emerald-600 px-2.5 py-1 font-bold text-white text-xs">
                    {grp}
                  </span>
                ))}
              </div>
            </div>

            {/* Can donate to */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Donor Can Safely Donate Red Cells To:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentRules.canDonateTo.map((grp) => (
                  <span key={grp} className="rounded-lg bg-blue-600 px-2.5 py-1 font-bold text-white text-xs">
                    {grp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SOS Emergency Donor Dispatch */}
        <div className="lg:col-span-4 rounded-2xl border border-rose-300 bg-rose-50/60 p-5 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
              <Radio className="h-4 w-4 text-rose-600 animate-pulse" />
              <span>Emergency Donor Dispatch</span>
            </div>
            <p className="mt-2 text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
              Facing an acute surge in surgical or trauma demand? Broadcast an emergency SMS & regional notification for <strong>{selectedGroup}</strong> blood donors.
            </p>
          </div>

          <button
            onClick={() => handleSosBroadcast(selectedGroup)}
            className="mt-4 w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/30 hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="h-3.5 w-3.5" />
            <span>TRANSMIT {selectedGroup} SOS BROADCAST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
