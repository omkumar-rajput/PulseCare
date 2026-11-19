import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  UserCheck,
  Search,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  CalendarCheck,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const DoctorDirectory: React.FC = () => {
  const { doctors, setActiveTab } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', ...new Set(doctors.map((d) => d.department))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Doctor & Medical Staff Directory</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #2
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Specialist roster, credential verification, shift schedules, on-duty presence, and clinical appointment booking.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctor by name, sub-specialty, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-bold text-slate-900 dark:text-white">{doc.name}</span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        doc.isOnDuty
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {doc.isOnDuty ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          On Duty
                        </>
                      ) : (
                        'Off Duty'
                      )}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">{doc.specialty}</div>
                  <div className="text-[11px] text-slate-400 truncate">{doc.department}</div>
                </div>
              </div>

              {/* Badges / Rating */}
              <div className="mt-4 flex items-center gap-3 border-y border-slate-100 py-2.5 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{doc.rating}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Award className="h-3.5 w-3.5 text-teal-600" />
                  <span>{doc.experienceYears} Years Exp</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">${doc.consultationFee} / consult</span>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-[11px]">{doc.shiftTiming}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-[11px]">Days: {doc.availableDays.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-[11px] truncate">{doc.email}</span>
                </div>
              </div>
            </div>

            {/* Book button */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('core-appointments')}
                className="w-full rounded-xl bg-slate-50 py-2 text-xs font-bold text-teal-700 hover:bg-teal-600 hover:text-white dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-600 dark:hover:text-white transition-colors text-center"
              >
                Schedule Appointment Slot &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
