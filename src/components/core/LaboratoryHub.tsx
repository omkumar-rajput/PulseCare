import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { LabTestOrder } from '../../types';
import {
  FlaskConical,
  Search,
  Plus,
  AlertOctagon,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  X
} from 'lucide-react';

export const LaboratoryHub: React.FC = () => {
  const { labOrders, createLabOrder, updateLabStatus, patients, doctors } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState<LabTestOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New Lab Order Form
  const [newOrder, setNewOrder] = useState({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    uhid: patients[0]?.uhid || '',
    doctorId: doctors[0]?.id || '',
    doctorName: doctors[0]?.name || '',
    testName: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology' as const,
    sampleType: 'Blood' as const,
    status: 'Order Placed' as const,
  });

  const categories = ['All', 'Hematology', 'Biochemistry', 'Microbiology', 'Radiology', 'Pathology'];

  const filteredOrders = labOrders.filter((ord) => {
    const matchesSearch =
      ord.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || ord.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePatientSelect = (pId: string) => {
    const p = patients.find((pat) => pat.id === pId);
    if (p) {
      setNewOrder((prev) => ({
        ...prev,
        patientId: p.id,
        patientName: p.name,
        uhid: p.uhid,
      }));
    }
  };

  const handleDoctorSelect = (dId: string) => {
    const d = doctors.find((doc) => doc.id === dId);
    if (d) {
      setNewOrder((prev) => ({
        ...prev,
        doctorId: d.id,
        doctorName: d.name,
      }));
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    createLabOrder(newOrder);
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Laboratory & Diagnostics Hub</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #6
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pathology, radiology, biochemistry specimen tracking, panic critical alert flags, and digital verified report generation.
          </p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Order Laboratory Test</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, test name, order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Orders List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Order # & Date</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Test & Discipline</th>
                <th className="py-3 px-4">Specimen Type</th>
                <th className="py-3 px-4">Diagnostic Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((ord) => {
                const isCritical = ord.status === 'Critical Alert';
                const hasAbnormalResults = ord.results?.some((r) => r.isAbnormal);

                return (
                  <tr key={ord.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{ord.orderNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(ord.orderDate).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.patientName}</div>
                      <div className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">{ord.uhid}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{ord.testName}</div>
                      <div className="text-[10px] text-slate-400">Ordered by {ord.doctorName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {ord.sampleType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse ring-1 ring-rose-400'
                            : ord.status === 'Report Ready'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : ord.status === 'Analyzing'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {isCritical && <AlertOctagon className="h-3 w-3 text-rose-600" />}
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ord.status === 'Order Placed' && (
                          <button
                            onClick={() => updateLabStatus(ord.id, 'Sample Collected')}
                            className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          >
                            Collect Sample
                          </button>
                        )}

                        {ord.status === 'Sample Collected' && (
                          <button
                            onClick={() => updateLabStatus(ord.id, 'Analyzing')}
                            className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                          >
                            Run Assay
                          </button>
                        )}

                        {ord.results && (
                          <button
                            onClick={() => setSelectedReport(ord)}
                            className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300"
                          >
                            <FileText className="h-3 w-3" />
                            <span>View Report</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  PulseCare Clinical Laboratory Report
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedReport.testName}</h3>
                <p className="text-xs text-slate-500">Order Ref: {selectedReport.orderNumber} • Date: {new Date(selectedReport.orderDate).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Patient Header Box */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-400">Patient Name</span>
                <div className="font-bold text-slate-900 dark:text-white">{selectedReport.patientName}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">UHID</span>
                <div className="font-mono font-semibold text-teal-600 dark:text-teal-400">{selectedReport.uhid}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Referring Physician</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedReport.doctorName}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Specimen</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedReport.sampleType}</div>
              </div>
            </div>

            {/* Test Results Table */}
            {selectedReport.results && selectedReport.results.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Analyte / Parameter</th>
                      <th className="py-2.5 px-3">Observed Value</th>
                      <th className="py-2.5 px-3">Reference Range</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedReport.results.map((res, i) => (
                      <tr key={i} className={res.isAbnormal ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{res.parameter}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">
                          <span className={res.isAbnormal ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}>
                            {res.value} {res.unit}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{res.referenceRange} {res.unit}</td>
                        <td className="py-2.5 px-3">
                          {res.isAbnormal ? (
                            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              ABNORMAL HIGH
                            </span>
                          ) : (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              NORMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Findings & Notes */}
            {selectedReport.findingsNotes && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-slate-800 dark:text-slate-200">Clinical Findings & Remarks:</span>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{selectedReport.findingsNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 italic">Electronically verified by Certified Medical Laboratory Technologist</span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Diagnostic Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Order New Lab Test */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Laboratory Diagnostics</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Patient</label>
                <select
                  value={newOrder.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.uhid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ordering Doctor</label>
                <select
                  value={newOrder.doctorId}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Diagnostic Investigation</label>
                <input
                  type="text"
                  required
                  value={newOrder.testName}
                  onChange={(e) => setNewOrder({ ...newOrder, testName: e.target.value })}
                  placeholder="e.g. High-Sensitivity Troponin I, Arterial Blood Gas, Lipid Panel"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newOrder.category}
                    onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Pathology">Pathology</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Specimen</label>
                  <select
                    value={newOrder.sampleType}
                    onChange={(e) => setNewOrder({ ...newOrder, sampleType: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Blood">Blood</option>
                    <option value="Serum">Serum</option>
                    <option value="Urine">Urine</option>
                    <option value="Imaging">Imaging</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Transmit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
