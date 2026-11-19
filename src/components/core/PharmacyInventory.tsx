import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Medicine } from '../../types';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  PackageCheck,
  ShieldAlert,
  Clock,
  X
} from 'lucide-react';

export const PharmacyInventory: React.FC = () => {
  const { medicines, dispenseMedicine, addMedicine } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dispenseTarget, setDispenseTarget] = useState<Medicine | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Drug Form
  const [newMed, setNewMed] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotic' as const,
    dosageForm: 'Tablet' as const,
    strength: '500 mg',
    stockQuantity: 100,
    reorderLevel: 25,
    batchNumber: 'BATCH-2026-X',
    expiryDate: '2027-12-31',
    unitPrice: 10.0,
    manufacturer: 'PharmaCorp',
    contraindications: '',
  });

  const categories = ['All', 'Antibiotic', 'Analgesic', 'Cardiovascular', 'Antidiabetic', 'Emergency IV'];

  const filteredMeds = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.reorderLevel).length;

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispenseTarget) return;
    dispenseMedicine(dispenseTarget.id, dispenseQty);
    setDispenseTarget(null);
    setDispenseQty(1);
  };

  const handleCreateMed = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicine({
      ...newMed,
      contraindications: newMed.contraindications ? newMed.contraindications.split(',').map((s) => s.trim()) : [],
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Pharmacy & Medication Inventory</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              Core Feature #5
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formulary catalog, batch tracking, automatic minimum inventory replenishment alerts, and outpatient dispensing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Banner: Low Stock Warning if any */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <strong>{lowStockCount} medication(s) currently below critical reorder threshold!</strong>
            <span className="ml-1 opacity-90">Please replenish supplies before depletion to prevent treatment interruptions.</span>
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand name, generic name, batch code..."
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

      {/* Drugs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Medication & Strength</th>
                <th className="py-3 px-4">Category / Form</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Batch & Expiry</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMeds.map((med) => {
                const isLow = med.stockQuantity <= med.reorderLevel;
                return (
                  <tr key={med.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{med.name}</div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400">
                        {med.genericName} • <span className="font-semibold text-slate-500">{med.strength}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {med.category}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{med.dosageForm}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                          {med.stockQuantity}
                        </span>
                        {isLow ? (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                            Low Stock (Min: {med.reorderLevel})
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">units</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{med.batchNumber}</div>
                      <div className="text-[10px] text-slate-400">Expires: {med.expiryDate}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ${med.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setDispenseTarget(med);
                          setDispenseQty(1);
                        }}
                        disabled={med.stockQuantity === 0}
                        className="rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-600 hover:text-white disabled:opacity-40 disabled:hover:bg-teal-50 disabled:hover:text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-600 transition-colors"
                      >
                        Dispense &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Dispense Drug */}
      {dispenseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Dispense Medication</h3>
              <button onClick={() => setDispenseTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDispense} className="mt-4 space-y-4">
              <div>
                <div className="font-bold text-sm text-teal-700 dark:text-teal-300">{dispenseTarget.name}</div>
                <div className="text-xs text-slate-500">Available In Inventory: {dispenseTarget.stockQuantity} units</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dispensing Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={dispenseTarget.stockQuantity}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(parseInt(e.target.value) || 1)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 flex justify-between">
                <span>Total Charge:</span>
                <strong className="text-slate-900 dark:text-white">${(dispenseQty * dispenseTarget.unitPrice).toFixed(2)}</strong>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDispenseTarget(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Confirm Dispensation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Medication Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Medication to Formulary</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMed} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="e.g. Lipitor"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Generic Name</label>
                  <input
                    type="text"
                    required
                    value={newMed.genericName}
                    onChange={(e) => setNewMed({ ...newMed, genericName: e.target.value })}
                    placeholder="e.g. Atorvastatin"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Emergency IV">Emergency IV</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dosage Form</label>
                  <select
                    value={newMed.dosageForm}
                    onChange={(e) => setNewMed({ ...newMed, dosageForm: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Syrup">Syrup</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Strength</label>
                  <input
                    type="text"
                    value={newMed.strength}
                    onChange={(e) => setNewMed({ ...newMed, strength: e.target.value })}
                    placeholder="20 mg"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Initial Stock</label>
                  <input
                    type="number"
                    value={newMed.stockQuantity}
                    onChange={(e) => setNewMed({ ...newMed, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reorder Level</label>
                  <input
                    type="number"
                    value={newMed.reorderLevel}
                    onChange={(e) => setNewMed({ ...newMed, reorderLevel: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMed.unitPrice}
                    onChange={(e) => setNewMed({ ...newMed, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-teal-700"
                >
                  Add to Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
