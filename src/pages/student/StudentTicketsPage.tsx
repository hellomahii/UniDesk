import React, { useState } from 'react';
import {
  Ticket as TicketIcon,
  Plus,
  Search,
  Filter,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Ticket, Department, TicketPriority } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';

export const StudentTicketsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, addTicket } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New ticket form state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Network Connectivity');
  const [newDepartment, setNewDepartment] = useState<Department>('IT');
  const [newPriority, setNewPriority] = useState<TicketPriority>('Medium');
  const [newDescription, setNewDescription] = useState('');

  const myTickets = tickets.filter(
    (t) =>
      t.studentEmail === currentUser?.email ||
      t.raisedBy.toLowerCase().includes(currentUser?.name.toLowerCase() || 'mahi')
  );

  const filteredTickets = myTickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const created = addTicket({
      studentId: currentUser?.id || 'usr-std-01',
      raisedBy: currentUser?.name || 'Mahi Patel',
      studentEmail: currentUser?.email || 'mahi.patel@college.edu',
      studentEnrollment: currentUser?.enrollmentNo || '2024-CS-042',
      subject: newSubject.trim(),
      category: newCategory,
      department: newDepartment,
      assignedTo: 'Unassigned',
      status: 'Pending',
      priority: newPriority,
      description: newDescription.trim(),
    });

    setIsCreateModalOpen(false);
    setNewSubject('');
    setNewDescription('');
    setSelectedTicket(created);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-[#0D5C46]" />
            <span>My Service Tickets</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track inquiries, IT network requests, and academic appeals.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Ticket</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0D5C46] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Ticket ID</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Last Updated</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                    {t.ticketNo}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 line-clamp-1">{t.subject}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{t.description}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">{t.category}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-medium text-emerald-800 text-[11px]">
                      {t.department}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {t.updatedDate}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <span className="text-[#0D5C46] font-semibold text-xs inline-flex items-center gap-1">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No tickets found. Need assistance? Click "+ Raise New Ticket".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.ticketNo}`}
          subtitle={`Submitted by ${selectedTicket.raisedBy} · ${selectedTicket.createdDate}`}
          width="lg"
        >
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {selectedTicket.department} Support
                </span>
                <StatusBadge status={selectedTicket.status} />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {selectedTicket.subject}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-900">{selectedTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Specialist:</span>
                <span className="font-semibold text-slate-900">{selectedTicket.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="font-semibold text-slate-900">{selectedTicket.priority}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Issue Description
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                {selectedTicket.description}
              </p>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Activity Timeline
              </h4>
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedTicket.activities.map((act) => (
                  <div key={act.id} className="relative flex items-start gap-3.5 pl-1 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-800 text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1 bg-[#FAFBFB] p-3 rounded-lg border border-slate-200/70">
                      <div className="flex items-center justify-between text-slate-800 font-semibold">
                        <span>{act.action}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          {act.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        By {act.author} ({act.role})
                      </div>
                      {act.note && (
                        <p className="mt-1.5 text-xs text-slate-700 font-medium">
                          {act.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Raise Ticket Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Raise a University Service Ticket"
          subtitle="Directly dispatch a request to IT, Finance, or Academic services."
        >
          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Department
              </label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value as Department)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              >
                <option value="IT">IT Infrastructure & Digital Services</option>
                <option value="Finance">Finance & Bursar Office</option>
                <option value="Academic">Academic Affairs & Registrar</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="Network Connectivity">Network Connectivity</option>
                  <option value="Account & Authentication">Account & Authentication</option>
                  <option value="Fee Reconciliation">Fee Reconciliation</option>
                  <option value="Course Registration">Course Registration</option>
                  <option value="Exam Schedule Clash">Exam Schedule Clash</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief summary of your request"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description & Details
              </label>
              <textarea
                required
                rows={4}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Provide specific details such as room number, transaction reference, course code, or error message..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
