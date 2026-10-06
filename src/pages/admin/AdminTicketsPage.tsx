import React, { useState } from 'react';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Send,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Ticket, TicketStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';

export const AdminTicketsPage: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const { tickets, updateTicketStatus, assignTicket, deleteTicket, setToastMessage } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  // Quick action note in drawer
  const [noteText, setNoteText] = useState('');

  // STRICT DEPARTMENT ROUTING:
  // Admins must ONLY see tickets belonging to their own department!
  // IT Admin -> IT only
  // Finance Admin -> Finance only
  // Academic Admin -> Academic only
  const deptTickets =
    activeRole === 'it_admin'
      ? tickets.filter((t) => t.department === 'IT')
      : activeRole === 'finance_admin'
      ? tickets.filter((t) => t.department === 'Finance')
      : activeRole === 'academic_admin'
      ? tickets.filter((t) => t.department === 'Academic')
      : tickets;

  const departmentName =
    activeRole === 'it_admin'
      ? 'IT Infrastructure'
      : activeRole === 'finance_admin'
      ? 'Finance & Bursar'
      : activeRole === 'academic_admin'
      ? 'Academic Affairs'
      : 'Department';

  const filteredTickets = deptTickets.filter((t) => {
    const matchesSearch =
      t.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      t.raisedBy.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    updateTicketStatus(
      selectedTicket.id,
      newStatus,
      noteText.trim() ? noteText.trim() : undefined,
      currentUser?.name || 'Admin',
      currentUser?.adminTitle || 'Department Staff'
    );
    // Refresh local selected state
    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            activities: [
              ...prev.activities,
              {
                id: `act-${Date.now()}`,
                author: currentUser?.name || 'Admin',
                role: currentUser?.adminTitle || 'Staff',
                action: `Status updated to ${newStatus}`,
                note: noteText.trim() || undefined,
                timestamp: '30 Sep 2026, Just now',
              },
            ],
          }
        : null
    );
    setNoteText('');
  };

  const handleAssignToMe = () => {
    if (!selectedTicket || !currentUser) return;
    assignTicket(selectedTicket.id, currentUser.name);
    setSelectedTicket((prev) => (prev ? { ...prev, assignedTo: currentUser.name } : null));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
              <TicketIcon className="w-6 h-6 text-[#0D5C46]" />
              <span>{departmentName} Tickets</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Department Isolated
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Manage and track student-raised requests routed to {departmentName}. Only approved student tickets appear here.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${departmentName} tickets by ticket no., student name, subject...`}
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
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Categories</option>
            {activeRole === 'finance_admin' && (
              <>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Payment Reconciliation">Payment Reconciliation</option>
                <option value="Fee Concession">Fee Concession</option>
                <option value="Fee Receipt Request">Fee Receipt Request</option>
              </>
            )}
            {activeRole === 'it_admin' && (
              <>
                <option value="Network Connectivity">Network Connectivity</option>
                <option value="Account & Authentication">Account & Authentication</option>
                <option value="Hardware & Port">Hardware & Port</option>
                <option value="Software Licensing">Software Licensing</option>
              </>
            )}
            {activeRole === 'academic_admin' && (
              <>
                <option value="Exam Clash">Exam Clash</option>
                <option value="Transcript & Records">Transcript & Records</option>
                <option value="Timetable Conflict">Timetable Conflict</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Ticket No.</th>
                <th className="px-5 py-3.5">Raised By</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Assigned To</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Updated</th>
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
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{t.raisedBy}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{t.studentEnrollment}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 line-clamp-1">{t.subject}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{t.description}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">{t.category}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        t.assignedTo === 'Unassigned' ? 'text-amber-700' : 'text-slate-800'
                      }`}
                    >
                      <User className="w-3 h-3 text-slate-400" />
                      {t.assignedTo}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {t.updatedDate}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="text-[#0D5C46] hover:text-[#093E2F] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setTicketToDelete(t)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No tickets found for {departmentName}. New student-approved tickets will automatically arrive here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 46. TICKET DETAIL DRAWER */}
      {selectedTicket && (
        <Drawer
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Details · ${selectedTicket.ticketNo}`}
          subtitle={`Updated ${selectedTicket.updatedDate}`}
          width="xl"
        >
          <div className="space-y-6 text-xs">
            {/* Subject and Status Bar */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">
                  {selectedTicket.department} Department · {selectedTicket.category}
                </span>
                <StatusBadge status={selectedTicket.status} />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {selectedTicket.subject}
              </h3>
            </div>

            {/* Student & Assignment Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Raised By</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedTicket.raisedBy}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{selectedTicket.studentEnrollment}</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Assigned Specialist</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedTicket.assignedTo}
                </span>
                {selectedTicket.assignedTo === 'Unassigned' && (
                  <button
                    onClick={handleAssignToMe}
                    className="text-[10px] font-semibold text-[#0D5C46] hover:underline mt-0.5 cursor-pointer block"
                  >
                    + Assign to me
                  </button>
                )}
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Priority</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedTicket.priority} Priority
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Logged: {selectedTicket.createdDate}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-1.5">
                Issue Description
              </span>
              <p className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {selectedTicket.description}
              </p>
            </div>

            {/* Action Bar: Assign, Change Status, Resolve */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-3">
              <span className="font-semibold uppercase tracking-wider text-emerald-950 block text-[11px]">
                Administrative Resolution Actions
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Resolved')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve & Close Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Pending')}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Set to Pending
                </button>
              </div>

              {/* Add Note Input */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal work log note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!noteText.trim()) return;
                      handleStatusChange(selectedTicket.status);
                    }}
                    className="px-3 py-1.5 bg-[#0D5C46] text-white font-semibold rounded-lg hover:bg-[#0B4A38] transition-colors cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-3">
                Ticket Activity Timeline
              </span>
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedTicket.activities.map((act) => (
                  <div key={act.id} className="relative flex items-start gap-3.5 pl-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-800 text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1 bg-[#FAFBFB] p-3 rounded-lg border border-slate-200/80">
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

      {/* 11 & 12. CONTEXTUAL DELETE TICKET MODAL */}
      {ticketToDelete && (
        <DeleteConfirmModal
          isOpen={!!ticketToDelete}
          onClose={() => setTicketToDelete(null)}
          onConfirm={() => {
            if (ticketToDelete) {
              deleteTicket(ticketToDelete.id);
              if (selectedTicket?.id === ticketToDelete.id) {
                setSelectedTicket(null);
              }
              setTicketToDelete(null);
              setToastMessage('Record deleted successfully.');
            }
          }}
          title="Delete Ticket?"
          recordName={`ticket ${ticketToDelete.ticketNo}`}
          recordType="support ticket"
        />
      )}
    </div>
  );
};
