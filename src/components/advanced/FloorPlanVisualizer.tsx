import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed } from '../../types';
import {
  MapPin,
  Layers,
  Wind,
  Activity,
  Bed as BedIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

export const FloorPlanVisualizer: React.FC = () => {
  const { beds, patients, assignBedToPatient, dischargeBed, broadcastEmergencyCode } = useHospital();
  const [selectedFloor, setSelectedFloor] = useState<number>(2);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const floorBeds = beds.filter((b) => b.floor === selectedFloor);

  const floors = [
    { floor: 0, name: 'Ground Floor (Level 0)', subtitle: 'Trauma ER, Diagnostics & Outpatient Atrium' },
    { floor: 1, name: 'First Floor (Level 1)', subtitle: 'General Inpatient Wards, Pediatric & Pharmacy' },
    { floor: 2, name: 'Second Floor (Level 2)', subtitle: 'Intensive Care Unit (ICU), CCU & Operating Suites' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-100 p-2 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">Interactive 2D Spatial Floor Plan & Bed Fleet</h1>
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                  Advanced Feature #4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spatial architectural ward mapping with live telemetry indicators, life-support piped oxygen monitoring, and direct room bed control.
              </p>
            </div>
          </div>
        </div>

        {/* Floor Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {floors.map((f) => (
            <button
              key={f.floor}
              onClick={() => setSelectedFloor(f.floor)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedFloor === f.floor
                  ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Floor {f.floor}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 font-black">
            L{selectedFloor}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{floors.find((f) => f.floor === selectedFloor)?.name}</h3>
            <p className="text-xs text-slate-400">{floors.find((f) => f.floor === selectedFloor)?.subtitle}</p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Available
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Occupied
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Sanitizing
          </span>
        </div>
      </div>

      {/* Architectural Spatial 2D Layout Map */}
      <div className="relative rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-950/60 min-h-[460px]">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-3xl"></div>

        {/* Floor Plan Header Label */}
        <div className="relative z-10 mb-6 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            BLUEPRINT ARCHITECTURE MAP // LEVEL {selectedFloor}
          </span>
          <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
            Active Units: {floorBeds.length}
          </span>
        </div>

        {/* Spatial Room Zones */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floorBeds.map((bed) => {
            const isOccupied = bed.status === 'Occupied';
            const isAvailable = bed.status === 'Available';
            const isSanitizing = bed.status === 'Sanitizing';

            return (
              <div
                key={bed.id}
                onClick={() => setSelectedBed(bed)}
                className={`group relative cursor-pointer rounded-2xl border-2 p-5 transition-all hover:scale-[1.02] hover:shadow-xl ${
                  isOccupied
                    ? 'border-rose-400/80 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30'
                    : isAvailable
                    ? 'border-emerald-400/80 bg-white dark:border-emerald-900 dark:bg-slate-900'
                    : isSanitizing
                    ? 'border-amber-400/80 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30'
                    : 'border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {/* Room / Bed Number */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`rounded-xl p-2.5 ${
                        isOccupied
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200'
                          : isAvailable
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200'
                      }`}
                    >
                      <BedIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-900 dark:text-white">{bed.bedNumber}</div>
                      <div className="text-[11px] font-semibold text-slate-400">{bed.roomNumber}</div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isOccupied
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isAvailable
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                {/* Spatial Bed Attributes */}
                <div className="mt-4 space-y-2">
                  {isOccupied ? (
                    <div className="rounded-xl bg-white/90 p-2.5 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs">
                      <div className="text-[10px] text-slate-400">Admitted Patient</div>
                      <div className="font-bold text-slate-900 dark:text-white truncate">{bed.patientName}</div>
                      <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400">{bed.uhid}</div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-100/60 p-2.5 dark:bg-slate-800/40 text-xs text-slate-500">
                      Sanitized & Ready for Inpatient Intake
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    {bed.hasOxygenSupport && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-teal-700 dark:text-teal-300">
                        <Wind className="h-3.5 w-3.5" /> Piped O₂ Connected
                      </span>
                    )}
                    {bed.hasVentilator && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                        <Activity className="h-3.5 w-3.5" /> Ventilator Ready
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center text-[10px] font-bold text-teal-600 dark:text-teal-400 group-hover:underline">
                  Click to manage room &rarr;
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spatial Bed Quick Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedBed.bedNumber} Management</h3>
                <p className="text-xs text-slate-400">{selectedBed.ward} • {selectedBed.roomNumber}</p>
              </div>
              <button onClick={() => setSelectedBed(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Current Status:</span>
                <strong className="text-slate-900 dark:text-white">{selectedBed.status}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Daily Ward Rate:</span>
                <strong className="text-slate-900 dark:text-white">${selectedBed.dailyRate} / day</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Life Support Facilities:</span>
                <span className="text-teal-600 font-semibold">
                  {selectedBed.hasOxygenSupport ? 'Oxygen Line' : 'No O2'} • {selectedBed.hasVentilator ? 'Ventilator' : 'No Vent'}
                </span>
              </div>
              {selectedBed.patientName && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Admitted Patient:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedBed.patientName} ({selectedBed.uhid})</strong>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2">
              {selectedBed.status === 'Occupied' && (
                <>
                  <button
                    onClick={() => {
                      dischargeBed(selectedBed.id);
                      setSelectedBed(null);
                    }}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    Discharge & Trigger Sanitization Cycle
                  </button>
                  <button
                    onClick={() => {
                      broadcastEmergencyCode('Code Blue (Cardiac)', `${selectedBed.bedNumber} - ${selectedBed.patientName}`);
                      setSelectedBed(null);
                    }}
                    className="w-full rounded-xl bg-red-600 py-2 text-xs font-bold text-white shadow hover:bg-red-700"
                  >
                    🚨 Dispatch Code Blue to this Room
                  </button>
                </>
              )}

              {selectedBed.status === 'Available' && (
                <div className="text-xs text-slate-500 text-center py-2">
                  Bed is ready for new inpatient intake via Patient EHR registry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
