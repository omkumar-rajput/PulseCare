import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { patients, beds, medicines, invoices } = useHospital();

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  const departmentVolumes = [
    { name: 'Cardiovascular Sciences', patients: 38, percentage: 34, color: 'bg-rose-500' },
    { name: 'Emergency & Trauma Care', patients: 31, percentage: 28, color: 'bg-amber-500' },
    { name: 'Renal Sciences & Transplant', patients: 18, percentage: 16, color: 'bg-teal-500' },
    { name: 'Neurocritical Sciences', patients: 14, percentage: 12, color: 'bg-purple-500' },
    { name: 'General Pediatrics', patients: 11, percentage: 10, color: 'bg-blue-500' },
  ];

  const qualityMetrics = [
    { title: '30-Day Unplanned Readmission Rate', value: '4.8%', target: '< 6.0%', status: 'Optimal' },
    { title: 'Average Length of Stay (ALOS)', value: '3.4 Days', target: '< 4.2 Days', status: 'Optimal' },
    { title: 'Door-to-Balloon Time (STEMI PCI)', value: '52 Mins', target: '< 90 Mins (ACC/AHA)', status: 'Exceptional' },
    { title: 'Antibiotic Stewardship Adherence', value: '94.2%', target: '> 90.0%', status: 'Optimal' },
    { title: 'Bed Sanitization Turnaround Time', value: '38 Mins', target: '< 45 Mins', status: 'Optimal' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-teal-100 p-2 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Clinical Performance & Quality Analytics</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Joint Commission & CMS-benchmarked healthcare performance indicators, throughput times, and department census.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Billed Revenue</span>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+8.4% vs last cycle</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">Door-to-Doctor Time</span>
          <div className="mt-1 text-2xl font-black text-teal-600 dark:text-teal-400">14 Mins</div>
          <span className="text-[10px] text-slate-400">Emergency Triage Median</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">Patient Satisfaction (HCAHPS)</span>
          <div className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">96.8%</div>
          <span className="text-[10px] text-slate-400">95th Percentile Nationally</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase text-slate-400">ICU Bed Occupancy</span>
          <div className="mt-1 text-2xl font-black text-rose-600">75%</div>
          <span className="text-[10px] text-slate-400">3 of 4 CICU Beds in Use</span>
        </div>
      </div>

      {/* Department Volume Distribution & Quality Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Census Distribution */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Department Inpatient Census Distribution
          </h3>

          <div className="space-y-4">
            {departmentVolumes.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{d.name}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {d.patients} cases ({d.percentage}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Benchmark Indicators */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Joint Commission Accreditation Indicators
          </h3>

          <div className="space-y-3">
            {qualityMetrics.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {m.status}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-base font-black text-teal-600 dark:text-teal-400">{m.value}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Benchmark: {m.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
