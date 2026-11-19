import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { verifyAuditLedgerIntegrity } from '../../utils/cryptoAudit';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Search,
  KeyRound,
  FileCheck2,
  Flame
} from 'lucide-react';

export const CryptographicAuditLedger: React.FC = () => {
  const { auditLedger, addNotification } = useHospital();
  const [localLedger, setLocalLedger] = useState(auditLedger);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    tamperedBlockIndex: number | null;
    message: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    const result = await verifyAuditLedgerIntegrity(localLedger);
    setVerificationResult(result);
    setIsVerifying(false);

    if (result.isValid) {
      addNotification('success', 'HIPAA Audit Validated', result.message);
    } else {
      addNotification('critical', '🚨 Cryptographic Tampering Detected!', result.message);
    }
  };

  const handleSimulateTamper = () => {
    if (localLedger.length < 2) return;
    const tampered = [...localLedger];
    // Tamper with Block 1 details without re-hashing
    tampered[1] = {
      ...tampered[1],
      details: 'TAMPERED ILLEGAL MODIFICATION: Stole confidential patient medical record.',
    };
    setLocalLedger(tampered);
    addNotification('warning', 'Tamper Simulated', 'Block #1 payload modified without updating cryptographic hash.');
  };

  const handleRestoreLedger = () => {
    setLocalLedger(auditLedger);
    setVerificationResult(null);
    addNotification('info', 'Ledger Restored', 'Restored verified authentic blockchain node logs.');
  };

  const filteredBlocks = localLedger.filter((b) => {
    return (
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.currentHash.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-slate-900 p-2 text-white dark:bg-slate-800">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">Cryptographic PHI Access Audit Ledger</h1>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  Advanced Feature #7
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable, tamper-evident SHA-256 hash chaining of all electronic Protected Health Information (PHI) events satisfying HIPAA § 164.312(b).
              </p>
            </div>
          </div>
        </div>

        {/* Audit Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTamper}
            className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            title="Inject an unauthorized change to test cryptographic verification"
          >
            Simulate Tamper Attack
          </button>

          <button
            onClick={handleRestoreLedger}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Reset Ledger
          </button>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isVerifying ? 'Verifying Math...' : 'Verify Cryptographic Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 text-xs transition-all animate-fade-in ${
            verificationResult.isValid
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
          }`}
        >
          {verificationResult.isValid ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertOctagon className="h-5 w-5 text-rose-600 flex-shrink-0 animate-pulse" />
          )}
          <div className="flex-1">
            <strong className="text-sm">
              {verificationResult.isValid ? 'Ledger Chain Mathematically Intact' : 'TAMPERING & CORRUPTION DETECTED!'}
            </strong>
            <p className="mt-0.5">{verificationResult.message}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search user, action, details, or hash..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Blocks Timeline / Chain List */}
      <div className="space-y-4">
        {filteredBlocks.map((block) => {
          const isTamperedTarget =
            verificationResult &&
            !verificationResult.isValid &&
            verificationResult.tamperedBlockIndex === block.blockIndex;

          return (
            <div
              key={block.blockIndex}
              className={`rounded-2xl border p-5 transition-all shadow-sm ${
                isTamperedTarget
                  ? 'border-rose-500 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40 ring-2 ring-rose-500'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white dark:bg-slate-800">
                    #{block.blockIndex}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{block.userName}</span>
                  <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 uppercase">
                    {block.userRole}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {block.ipAddress}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    {block.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(block.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Event Description */}
              <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {block.details}
              </div>

              {/* Cryptographic Hash Chaining */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 truncate">
                  <span className="text-slate-400">Previous Hash (Parent Block):</span>
                  <div className="font-semibold text-slate-600 dark:text-slate-300 truncate">{block.previousHash}</div>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 truncate">
                  <span className="text-slate-400">Current Block Hash (SHA-256):</span>
                  <div className="font-bold text-teal-600 dark:text-teal-400 truncate">{block.currentHash}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
