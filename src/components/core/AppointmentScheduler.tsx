import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Plus,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Video,
  Search,
  X
} from 'lucide-react';

export const AppointmentScheduler: React.FC = () => {
  const { appointments, bookAppointment, updateAppointmentStatus, doctors, patients, setActiveTab } = useHospital();
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New Appointment Form
  const [formData, setFormData] = useState<{
    patientId: string;
    patientName: string;
    patientPhone: string;
    doctorId: string;
    doctorName: string;
    department: string;
    appointmentDate: string;
    timeSlot: string;
    type: Appointment['type'];
    status: Appointment['status'];
    symptoms: string;
  }>({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    patientPhone: patients[0]?.phone || '',
    doctorId: doctors[0]?.id || '',
    doctorName: doctors[0]?.name || '',
    department: doctors[0]?.department || '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    type: 'OPD',
    status: 'Scheduled',
    symptoms: '',
  });

  const handlePatientSelect = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId);
    if (p) {
      setFormData((prev) => ({
        ...prev,
        patientId: p.id,
        patientName: p.name,
        patientPhone: p.phone,
      }));
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const d = doctors.find((doc) => doc.id === doctorId);
    if (d) {
      setFormData((prev) => ({
        ...prev,
        doctorId: d.id,
        doctorName: d.name,
        department: d.department,
      }));
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment(formData);
    setShowModal(false);
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">OPD Appointments & Queue Management</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #3
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated token generation, OPD outpatient queue control, follow-up scheduling, and telemedicine dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointment Tokens Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 font-mono text-xs font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                      #{app.tokenNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{app.patientName}</div>
                    <div className="text-[11px] text-slate-400">{app.patientPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{app.doctorName}</div>
                    <div className="text-[10px] text-teal-600 dark:text-teal-400">{app.department}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{app.appointmentDate}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{app.timeSlot}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        app.type === 'Telemedicine'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : app.type === 'Emergency'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {app.type === 'Telemedicine' && <Video className="h-3 w-3" />}
                      {app.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        app.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : app.status === 'In-Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 animate-pulse'
                          : app.status === 'Cancelled'
                          ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 line-through'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.type === 'Telemedicine' && (
                        <button
                          onClick={() => setActiveTab('adv-telemedicine')}
                          className="rounded-lg bg-purple-50 p-1.5 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300"
                          title="Launch Virtual Room"
                        >
                          <Video className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {app.status === 'Scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'In-Progress')}
                          className="rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300"
                        >
                          Start Call
                        </button>
                      )}

                      {app.status === 'In-Progress' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                          className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                          Finish
                        </button>
                      )}

                      {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Cancelled')}
                          className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                          title="Cancel Appointment"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Book New Appointment Slot</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.uhid}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Consulting Specialist</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} (${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Consultation Type</label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(['OPD', 'Follow-up', 'Telemedicine'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                        formData.type === t
                          ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                          : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chief Symptoms / Reason</label>
                <textarea
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="e.g. Mild shortness of breath upon exertion, fatigue..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Generate Token & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
