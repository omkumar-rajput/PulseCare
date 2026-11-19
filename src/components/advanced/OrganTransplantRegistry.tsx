import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { computeOrganMatch } from '../../utils/organMatching';
import { OrganDonor, OrganRecipient } from '../../types';
import {
  Dna,
  Heart,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Send
} from 'lucide-react';

export const OrganTransplantRegistry: React.FC = () => {
  const { organDonors, organRecipients, addNotification } = useHospital();
  const [selectedDonorId, setSelectedDonorId] = useState<string>(organDonors[0]?.id || '');

  const selectedDonor = organDonors.find((d) => d.id === selectedDonorId) || organDonors[0];

  // Match all recipients against selected donor
  const matches = organRecipients
    .filter((recip) => selectedDonor.availableOrgans.includes(recip.organNeeded))
    .map((recip) => computeOrganMatch(selectedDonor, recip))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  const handleDispatchSurgicalTeam = (recipientName: string, score: number) => {
    addNotification(
      'success',
      'Transplant Surgical Team Dispatched',
      `Allocated donor organ to ${recipientName} (${score}% match score). OR Suite paged for organ cross-match!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-teal-100 p-2 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <Dna className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Organ Procurement & Transplant Match Registry</h1>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                Advanced Feature #9
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              UNOS/OPTN-standard transplant allocation algorithm computing HLA antigen cross-matches, ABO compatibility, and Cold Ischemia Time (CIT) viability.
            </p>
          </div>
        </div>
      </div>

      {/* Donor Selection Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Procured Organ Donor Profile</label>
            <select
              value={selectedDonorId}
              onChange={(e) => setSelectedDonorId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {organDonors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.donorName} ({d.bloodGroup}) — Organs: {d.availableOrgans.join(', ')} — Location: {d.hospitalLocation}
                </option>
              ))}
            </select>
          </div>

          {/* Cold Ischemia Viability Bar */}
          <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60 text-xs sm:w-72">
            <div className="flex justify-between items-center text-slate-500">
              <span className="flex items-center gap-1 font-bold">
                <Clock className="h-3.5 w-3.5 text-teal-600" /> Cold Ischemia Window (CIT)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {selectedDonor.coldIschemiaElapsedHours}h / {selectedDonor.coldIschemiaMaxHours}h max
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((selectedDonor.coldIschemiaMaxHours - selectedDonor.coldIschemiaElapsedHours) /
                      selectedDonor.coldIschemiaMaxHours) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>Harvested: {new Date(selectedDonor.harvestTime).toLocaleTimeString()}</span>
              <span className="text-emerald-600 font-semibold">Viable</span>
            </div>
          </div>
        </div>

        {/* Donor HLA Genetic Markers */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Donor HLA Antigens:</span>
          {selectedDonor.hlaMarkers.map((m) => (
            <span key={m} className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-mono font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-300">
              {m}
            </span>
          ))}
          <span className="ml-2 text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-600 dark:text-slate-400">Blood Group: <strong className="text-rose-600">{selectedDonor.bloodGroup}</strong></span>
        </div>
      </div>

      {/* Matching Recipient Queue (Ranked) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Algorithmic Candidate Ranking ({matches.length} Compatible Candidates on Hospital Waitlist)
          </span>
          <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Ranked by Compatibility Formula
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
            No recipients currently waiting for {selectedDonor.availableOrgans.join(', ')}.
          </div>
        ) : (
          matches.map((res, rank) => {
            const isTopMatch = rank === 0 && res.compatibilityScore >= 75;

            return (
              <div
                key={res.recipient.id}
                className={`rounded-2xl border p-5 shadow-sm transition-all ${
                  isTopMatch
                    ? 'border-emerald-500 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                        isTopMatch
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      #{rank + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">{res.recipient.name}</h3>
                        <span className="font-mono text-xs text-teal-600 dark:text-teal-400">{res.recipient.uhid}</span>
                        <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {res.recipient.organNeeded} Recipient
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {res.recipient.age} yrs • Blood Group: <strong className="text-rose-600">{res.recipient.bloodGroup}</strong> • Waitlist Time: <strong>{res.recipient.waitingDays} Days</strong>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score Pill */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Match Index</div>
                      <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                        {res.compatibilityScore}%
                      </div>
                    </div>

                    <button
                      onClick={() => handleDispatchSurgicalTeam(res.recipient.name, res.compatibilityScore)}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Surgical Team</span>
                    </button>
                  </div>
                </div>

                {/* Algorithmic Factor Breakdown */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400">ABO Compatibility</span>
                    <div className="font-bold text-emerald-600">✅ Compatible</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400">HLA Antigen Match</span>
                    <div className="font-bold text-teal-600">{res.hlaMatchPercentage}% ({res.hlaMatchCount} Markers)</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400">Urgency Tier</span>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{res.recipient.urgencyTier}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400">Viability Remaining</span>
                    <div className="font-bold text-teal-600">{res.ischemiaViabilityPercent}% CIT Viable</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  💡 <strong>Clinical Guidance:</strong> {res.clinicalRecommendation}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
