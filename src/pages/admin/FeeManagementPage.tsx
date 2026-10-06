import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Receipt,
  DollarSign,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StudentFeeRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const FeeManagementPage: React.FC = () => {
  const { fees, updateFeeStatus } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [selectedFee, setSelectedFee] = useState<StudentFeeRecord | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');

  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      (f.transactionRef && f.transactionRef.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || f.paymentStatus === statusFilter;
    const matchesSem = semesterFilter === 'All' || f.semester === semesterFilter;
    const matchesBatch = batchFilter === 'All' || f.batch === batchFilter;

    return matchesSearch && matchesStatus && matchesSem && matchesBatch;
  });

  const totalCollected = fees.reduce((acc, curr) => acc + curr.paid, 0);
  const totalOutstanding = fees.reduce((acc, curr) => acc + curr.pending, 0);

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;
    const additional = Number(paymentAmountInput);
    if (isNaN(additional) || additional <= 0) return;

    const newPaid = selectedFee.paid + additional;
    const newStatus =
      newPaid >= selectedFee.totalFee
        ? 'Paid'
        : newPaid > 0
        ? 'Partially Paid'
        : 'Pending';

    updateFeeStatus(selectedFee.id, newPaid, newStatus);
    setSelectedFee(null);
    setPaymentAmountInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-[#0D5C46]" />
          <span>Fee Management</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Tuition ledger reconciliation, semester installments, and bursar payment records.
        </p>
      </div>

      {/* Finance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Reconciled Tuition
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-[#0D3B2E] tabular-nums">
            ₹{totalCollected.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Semester 5 Intake</span>
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Outstanding Tuition Dues
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700 tabular-nums">
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Due by 15 October 2026</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Reconciliation Health
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-800 tabular-nums">
            {Math.round((totalCollected / (totalCollected + totalOutstanding)) * 100)}%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">NEFT / RTGS clearance active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, enrollment ID, or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Semesters</option>
            <option value="Semester 5">Semester 5</option>
          </select>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Batches</option>
            <option value="2023-2027">Batch 2023-2027</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Enrollment</th>
                <th className="px-5 py-3.5">Total Fee</th>
                <th className="px-5 py-3.5">Paid Amount</th>
                <th className="px-5 py-3.5">Pending Dues</th>
                <th className="px-5 py-3.5">Payment Status</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => setSelectedFee(f)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{f.studentName}</div>
                    <div className="text-[11px] text-slate-400">{f.department}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                    {f.enrollmentNo}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-800 tabular-nums">
                    ₹{f.totalFee.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-emerald-800 tabular-nums">
                    ₹{f.paid.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-amber-700 tabular-nums font-semibold">
                    ₹{f.pending.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={f.paymentStatus} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    {f.dueDate}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFee(f);
                      }}
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFees.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No fee records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Fee Payment Record Modal */}
      {selectedFee && (
        <Modal
          isOpen={!!selectedFee}
          onClose={() => setSelectedFee(null)}
          title={`Reconcile Fee · ${selectedFee.studentName}`}
          subtitle={`Enrollment: ${selectedFee.enrollmentNo} · Semester 5`}
        >
          <form onSubmit={handleUpdatePayment} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Course Fee:</span>
                <span className="font-mono font-bold text-slate-900">₹{selectedFee.totalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Already Settled:</span>
                <span className="font-mono font-bold text-emerald-800">₹{selectedFee.paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Outstanding Balance:</span>
                <span className="font-mono font-bold text-amber-700">₹{selectedFee.pending.toLocaleString()}</span>
              </div>
              {selectedFee.transactionRef && (
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-400">Last Ref / UTR:</span>
                  <span className="font-mono text-slate-600">{selectedFee.transactionRef}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Record Inward Payment Amount (₹)
              </label>
              <input
                type="number"
                required
                min={1}
                max={selectedFee.pending}
                value={paymentAmountInput}
                onChange={(e) => setPaymentAmountInput(e.target.value)}
                placeholder={`Enter amount up to ₹${selectedFee.pending}`}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedFee(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-lg cursor-pointer"
              >
                Post Settlement
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
