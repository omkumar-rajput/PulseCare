import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useHospital();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />,
          critical: <AlertOctagon className="h-5 w-5 text-rose-500 flex-shrink-0 animate-pulse" />,
          info: <Info className="h-5 w-5 text-teal-500 flex-shrink-0" />,
        };

        const bgStyles = {
          success: 'border-emerald-200 bg-white/95 dark:bg-slate-900/95 dark:border-emerald-900/50 shadow-emerald-500/10',
          warning: 'border-amber-200 bg-white/95 dark:bg-slate-900/95 dark:border-amber-900/50 shadow-amber-500/10',
          critical: 'border-rose-400 bg-rose-50/95 dark:bg-slate-900/95 dark:border-rose-900 shadow-rose-500/20 ring-1 ring-rose-500/30',
          info: 'border-teal-200 bg-white/95 dark:bg-slate-900/95 dark:border-teal-900/50 shadow-teal-500/10',
        };

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-3.5 shadow-xl backdrop-blur-md transition-all animate-fade-in ${bgStyles[n.type]}`}
          >
            {icons[n.type]}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{n.title}</span>
                <span className="text-[10px] font-normal text-slate-400">{n.timestamp}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
