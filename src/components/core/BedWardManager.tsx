import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed, WardType } from '../../types';
import {
  Bed as BedIcon,
  Activity,
  Wind,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserPlus,
  LogOut,
  MapPin,
  X,
  Layers
} from 'lucide-react';

export const BedWardManager: React.FC = () => {
  const { beds, patients, assignBedToPatient, dischargeBed, setActiveTab } = useHospital();
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [allocatingBed, setAllocatingBed] = useState<Bed | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const wards = ['All', 'ICU', 'Emergency', 'General Ward A', 'General Ward B', 'Pediatric'];

  const filteredBeds = beds.filter((b) => selectedWard === 'All' || b.ward === selectedWard);

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const sanitizingBeds = beds.filter((b) => b.status === 'Sanitizing').length;
  const ventilatorBeds = beds.filter((b) => b.hasVentilator).length;
  const occupancyPercentage = Math.round((occupiedBeds / totalBeds) * 100);

  const handleConfirmAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingBed || !selectedPatientId) return;
    assignBedToPatient(allocatingBed.id, selectedPatientId);
    setAllocatingBed(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Bed & Ward Allocation Management</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #4
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time inpatient bed tracking, oxygen/ventilator life-support allocation, sanitization cycles, and spatial room transfers.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('adv-floorplan')}
          className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 transition-colors"
        >
          <Layers className="h-4 w-4" />
          <span>Switch to 2D Spatial Floor Plan &rarr;</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Capacity</span>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalBeds} Beds</div>
          <span className="text-[10px] text-slate-400">Hospital Fleet</span>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
          <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">Occupied</span>
          <div className="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300">{occupiedBeds}</div>
          <span className="text-[10px] font-bold text-rose-600">{occupancyPercentage}% Occupancy</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Available</span>
          <div className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">{availableBeds}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Admission</span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Sanitizing</span>
          <div className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">{sanitizingBeds}</div>
          <span className="text-[10px] text-amber-600 font-semibold">UV Disinfection</span>
        </div>

        <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm dark:border-teal-900/40 dark:bg-teal-950/20">
          <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">Ventilator Beds</span>
          <div className="mt-1 text-2xl font-black text-teal-700 dark:text-teal-300">{ventilatorBeds}</div>
          <span className="text-[10px] text-teal-600 font-semibold">Life Support Ready</span>
        </div>
      </div>

      {/* Ward Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {wards.map((ward) => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedWard === ward
                ? 'bg-teal-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {ward}
          </button>
        ))}
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isSanitizing = bed.status === 'Sanitizing';

          return (
            <div
              key={bed.id}
              className={`flex flex-col justify-between rounded-2xl border p-4.5 transition-all shadow-sm ${
                isOccupied
                  ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/10'
                  : isAvailable
                  ? 'border-emerald-200 bg-white dark:border-emerald-900/40 dark:bg-slate-900'
                  : isSanitizing
                  ? 'border-amber-200 bg-amber-50/30 dark:border-amber-900/40 dark:bg-slate-900'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Bed Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-xl p-2 ${
                        isOccupied
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : isAvailable
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      <BedIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">{bed.bedNumber}</div>
                      <div className="text-[10px] font-semibold text-slate-400">{bed.ward} • Floor {bed.floor}</div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isOccupied
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : isAvailable
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                {/* Patient or Bed Features */}
                <div className="mt-4 space-y-2">
                  {isOccupied ? (
                    <div className="rounded-xl bg-white/80 p-2.5 border border-rose-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400">Occupied Patient</div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{bed.patientName}</div>
                      <div className="font-mono text-[9px] text-teal-600 dark:text-teal-400">{bed.uhid}</div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40 text-[11px] text-slate-500">
                      Rate: <strong className="text-slate-800 dark:text-slate-200">${bed.dailyRate}</strong> / day
                    </div>
                  )}

                  {/* Capabilities badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bed.hasOxygenSupport && (
                      <span className="flex items-center gap-1 rounded-md bg-teal-100 px-1.5 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                        <Wind className="h-3 w-3" /> O₂ Line
                      </span>
                    )}
                    {bed.hasVentilator && (
                      <span className="flex items-center gap-1 rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                        <Activity className="h-3 w-3" /> Ventilator
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {isAvailable && (
                  <button
                    onClick={() => setAllocatingBed(bed)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-1.5 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Assign Patient</span>
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => dischargeBed(bed.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-800 dark:text-rose-300 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Discharge & Clean</span>
                  </button>
                )}

                {isSanitizing && (
                  <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-amber-600 font-semibold animate-pulse">
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Sanitization Active</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocation Modal */}
      {allocatingBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Allocate Bed {allocatingBed.bedNumber}</h3>
                <p className="text-xs text-slate-500">{allocatingBed.ward} • Floor {allocatingBed.floor}</p>
              </div>
              <button onClick={() => setAllocatingBed(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAllocation} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Patient for Inpatient Admission</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {patients
                    .filter((p) => p.admissionStatus !== 'Inpatient')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.uhid}) - Status: {p.admissionStatus}
                      </option>
                    ))}
                </select>
              </div>

              <div className="rounded-xl bg-teal-50 p-3 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-300">
                Bed Features: {allocatingBed.hasOxygenSupport ? '✅ Piped Oxygen Support' : '❌ No Oxygen'} | {allocatingBed.hasVentilator ? '✅ Ventilator Enabled' : '❌ No Ventilator'}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAllocatingBed(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
