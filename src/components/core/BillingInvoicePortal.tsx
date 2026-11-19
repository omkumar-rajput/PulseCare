import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Invoice, InvoiceItem } from '../../types';
import {
  Receipt,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  DollarSign,
  X
} from 'lucide-react';

export const BillingInvoicePortal: React.FC = () => {
  const { invoices, createInvoice, patients } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice State
  const [newInvoiceData, setNewInvoiceData] = useState<{
    patientId: string;
    patientName: string;
    uhid: string;
    items: InvoiceItem[];
    discount: number;
    hasInsurance: boolean;
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    paymentMethod: Invoice['paymentMethod'];
  }>({
    patientId: patients[0]?.id || '',
    patientName: patients[0]?.name || '',
    uhid: patients[0]?.uhid || '',
    items: [
      { id: '1', description: 'Specialist Physician Consultation Fee', category: 'Consultation', quantity: 1, unitPrice: 250, total: 250 },
      { id: '2', description: 'Diagnostic Biochemistry Assays', category: 'Lab', quantity: 1, unitPrice: 320, total: 320 },
    ],
    discount: 50,
    hasInsurance: true,
    provider: 'BlueCross Shield Enterprise Health',
    policyNumber: 'BCS-2026-99',
    coverageAmount: 500,
    paymentMethod: 'Insurance Direct',
  });

  const handlePatientSelect = (pId: string) => {
    const p = patients.find((pat) => pat.id === pId);
    if (p) {
      setNewInvoiceData((prev) => ({
        ...prev,
        patientId: p.id,
        patientName: p.name,
        uhid: p.uhid,
      }));
    }
  };

  const handleAddLineItem = () => {
    setNewInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          description: 'Prescribed Pharmaceuticals',
          category: 'Pharmacy',
          quantity: 1,
          unitPrice: 120,
          total: 120,
        },
      ],
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const subTotal = newInvoiceData.items.reduce((acc, it) => acc + it.total, 0);
    const tax = Math.round((subTotal - newInvoiceData.discount) * 0.05 * 100) / 100;
    const totalAmount = Math.max(0, subTotal - newInvoiceData.discount + tax);
    const copayAmount = Math.max(0, totalAmount - (newInvoiceData.hasInsurance ? newInvoiceData.coverageAmount : 0));

    const created = createInvoice({
      patientId: newInvoiceData.patientId,
      patientName: newInvoiceData.patientName,
      uhid: newInvoiceData.uhid,
      items: newInvoiceData.items,
      subTotal,
      discount: newInvoiceData.discount,
      tax,
      totalAmount,
      insuranceClaim: {
        hasInsurance: newInvoiceData.hasInsurance,
        provider: newInvoiceData.hasInsurance ? newInvoiceData.provider : undefined,
        policyNumber: newInvoiceData.hasInsurance ? newInvoiceData.policyNumber : undefined,
        coverageAmount: newInvoiceData.hasInsurance ? newInvoiceData.coverageAmount : undefined,
        claimStatus: newInvoiceData.hasInsurance ? 'Approved' : undefined,
        copayAmount,
      },
      paymentStatus: copayAmount === 0 ? 'Paid' : 'Claim Processing',
      paymentMethod: newInvoiceData.paymentMethod,
    });

    setSelectedInvoice(created);
    setShowCreateModal(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    return (
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.uhid.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Medical Billing, Invoicing & Insurance (TPA)</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #7
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Itemized clinical charges, automated insurance pre-authorization, patient co-pay calculations, and printable receipts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search invoice number, patient UHID, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Patient Name & UHID</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Insurance Coverage</th>
                <th className="py-3 px-4">Patient Co-Pay</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</div>
                    <div className="text-[10px] text-slate-400">{new Date(inv.billingDate).toLocaleDateString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{inv.patientName}</div>
                    <div className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">{inv.uhid}</div>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {inv.insuranceClaim.hasInsurance ? (
                      <div>
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${inv.insuranceClaim.coverageAmount?.toFixed(2)} Covered
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{inv.insuranceClaim.provider}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Self-Pay (No Insurance)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                    ${inv.insuranceClaim.copayAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : inv.paymentStatus === 'Claim Processing'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300"
                    >
                      View Invoice &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Official Medical Invoice & Payment Receipt
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Invoice #{selectedInvoice.invoiceNumber}</h3>
                <p className="text-xs text-slate-500">Date: {new Date(selectedInvoice.billingDate).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Patient & Insurance Breakdown */}
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-400">Billed To (Patient)</span>
                <div className="font-bold text-slate-900 dark:text-white">{selectedInvoice.patientName}</div>
                <div className="text-[10px] font-mono text-teal-600">{selectedInvoice.uhid}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Third-Party Insurance (TPA)</span>
                {selectedInvoice.insuranceClaim.hasInsurance ? (
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedInvoice.insuranceClaim.provider}</div>
                    <div className="text-[10px] text-slate-400">Policy: {selectedInvoice.insuranceClaim.policyNumber}</div>
                    <div className="text-[10px] font-bold text-emerald-600">Status: {selectedInvoice.insuranceClaim.claimStatus}</div>
                  </div>
                ) : (
                  <div className="italic text-slate-400">None (Patient Out-of-Pocket)</div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedInvoice.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{it.description}</td>
                      <td className="py-2.5 px-3 text-[10px] text-slate-400">{it.category}</td>
                      <td className="py-2.5 px-3 text-center">{it.quantity}</td>
                      <td className="py-2.5 px-3">${it.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-bold">${it.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>${selectedInvoice.subTotal.toFixed(2)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Hospital Discount:</span>
                    <span>-${selectedInvoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Tax (5%):</span>
                  <span>${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
                </div>
                {selectedInvoice.insuranceClaim.hasInsurance && (
                  <>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Insurance Approved:</span>
                      <span>-${selectedInvoice.insuranceClaim.coverageAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-rose-600 text-sm border-t border-dashed pt-1">
                      <span>Patient Due (Co-pay):</span>
                      <span>${selectedInvoice.insuranceClaim.copayAmount?.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Payment Status: <strong className="text-emerald-600">{selectedInvoice.paymentStatus}</strong></span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generate New Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Generate Itemized Medical Bill</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Inpatient / Outpatient</label>
                <select
                  value={newInvoiceData.patientId}
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
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Billable Services & Procedures</label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[11px] font-bold text-teal-600 hover:underline"
                  >
                    + Add Charge Item
                  </button>
                </div>

                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                  {newInvoiceData.items.map((it, idx) => (
                    <div key={it.id} className="flex gap-2 items-center text-xs">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => {
                          const updated = [...newInvoiceData.items];
                          updated[idx].description = e.target.value;
                          setNewInvoiceData({ ...newInvoiceData, items: updated });
                        }}
                        className="flex-1 rounded-xl border border-slate-300 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800 text-xs"
                      />
                      <input
                        type="number"
                        value={it.total}
                        onChange={(e) => {
                          const updated = [...newInvoiceData.items];
                          updated[idx].total = parseFloat(e.target.value) || 0;
                          updated[idx].unitPrice = updated[idx].total;
                          setNewInvoiceData({ ...newInvoiceData, items: updated });
                        }}
                        className="w-20 rounded-xl border border-slate-300 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800 text-xs text-right"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Discount ($)</label>
                  <input
                    type="number"
                    value={newInvoiceData.discount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, discount: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Insurance Pre-Auth Amount ($)</label>
                  <input
                    type="number"
                    value={newInvoiceData.coverageAmount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, coverageAmount: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
