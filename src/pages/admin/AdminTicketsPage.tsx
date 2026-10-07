import React, { useState } from 'react';
import {
  Ticket as TicketIcon,
  Search,
  CheckCircle2,
  User,
  ChevronRight,
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

  const {
    tickets,
    students,
    updateTicketStatus,
    assignTicket,
    deleteTicket,
    setToastMessage,
  } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [noteText, setNoteText] = useState('');

  // STRICT DEPARTMENT ROUTING
  // Admins only see tickets belonging to their department.
  const departmentCode =
    activeRole === 'it_admin'
      ? 'it'
      : activeRole === 'finance_admin'
      ? 'finance'
      : activeRole === 'academic_admin'
      ? 'academic'
      : null;

  const deptTickets = departmentCode
    ? tickets.filter(
        (ticket) =>
          String(ticket.department || '').toLowerCase() ===
          departmentCode
      )
    : tickets;

  const departmentName =
    activeRole === 'it_admin'
      ? 'IT Infrastructure'
      : activeRole === 'finance_admin'
      ? 'Finance & Bursar'
      : activeRole === 'academic_admin'
      ? 'Academic Affairs'
      : 'Department';

  // Find student's enrollment number from their email.
  const getStudentEnrollment = (raisedBy: string) => {
    const student = students.find(
      (student: any) =>
        String(student.email || '').trim().toLowerCase() ===
        String(raisedBy || '').trim().toLowerCase()
    );

    return student?.enrollmentNo || '';
  };

  const filteredTickets = deptTickets.filter((ticket) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(ticket.ticketNo || '')
        .toLowerCase()
        .includes(searchText) ||
      String(ticket.raisedBy || '')
        .toLowerCase()
        .includes(searchText) ||
      String(ticket.subject || '')
        .toLowerCase()
        .includes(searchText) ||
      String(getStudentEnrollment(ticket.raisedBy) || '')
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === 'All' || ticket.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) {
      return;
    }

    const note = noteText.trim();

    updateTicketStatus(
      selectedTicket.id,
      newStatus,
      note || undefined,
      currentUser?.name || 'Admin',
      currentUser?.adminTitle || 'Department Staff'
    );

    setSelectedTicket((previousTicket) => {
      if (!previousTicket) {
        return null;
      }

      return {
        ...previousTicket,
        status: newStatus,
        activities: [
          ...previousTicket.activities,
          {
            id: `act-${Date.now()}`,
            author: currentUser?.name || 'Admin',
            role: currentUser?.adminTitle || 'Staff',
            action: `Status updated to ${newStatus}`,
            note: note || undefined,
            timestamp: 'Just now',
          },
        ],
      };
    });

    setNoteText('');
  };

  const handleAssignToMe = () => {
    if (!selectedTicket || !currentUser) {
      return;
    }

    assignTicket(selectedTicket.id, currentUser.name);

    setSelectedTicket((previousTicket) => {
      if (!previousTicket) {
        return null;
      }

      return {
        ...previousTicket,
        assignedTo: currentUser.name,
      };
    });
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
            Manage and track student-raised requests routed to{' '}
            {departmentName}. Only approved student tickets appear here.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />

          <input
            type="text"
            placeholder={`Search ${departmentName} tickets by ticket no., student name, subject, enrollment...`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Categories</option>

            {activeRole === 'finance_admin' && (
              <>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Payment Reconciliation">
                  Payment Reconciliation
                </option>
                <option value="Fee Concession">Fee Concession</option>
                <option value="Fee Receipt Request">
                  Fee Receipt Request
                </option>
              </>
            )}

            {activeRole === 'it_admin' && (
              <>
                <option value="Network Connectivity">
                  Network Connectivity
                </option>
                <option value="Account & Authentication">
                  Account & Authentication
                </option>
                <option value="Hardware & Port">Hardware & Port</option>
                <option value="Software Licensing">
                  Software Licensing
                </option>
              </>
            )}

            {activeRole === 'academic_admin' && (
              <>
                <option value="Exam Clash">Exam Clash</option>
                <option value="Transcript & Records">
                  Transcript & Records
                </option>
                <option value="Timetable Conflict">
                  Timetable Conflict
                </option>
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
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                    {ticket.ticketNo}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {ticket.raisedBy}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      {getStudentEnrollment(ticket.raisedBy)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {ticket.subject}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {ticket.description}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    {ticket.category}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        ticket.assignedTo === 'Unassigned'
                          ? 'text-amber-700'
                          : 'text-slate-800'
                      }`}
                    >
                      <User className="w-3 h-3 text-slate-400" />
                      {ticket.assignedTo}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {ticket.updatedDate}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-[#0D5C46] hover:text-[#093E2F] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setTicketToDelete(ticket)}
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
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No tickets found for {departmentName}. New student-approved
                    tickets will automatically arrive here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Details · ${selectedTicket.ticketNo}`}
          subtitle={`Updated ${selectedTicket.updatedDate}`}
          width="xl"
        >
          <div className="space-y-6 text-xs">
            {/* Subject and Status */}
            <div className="p-4 rounded-xl bg-[#FAFBFB] border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">
                  {selectedTicket.department} Department ·{' '}
                  {selectedTicket.category}
                </span>

                <StatusBadge status={selectedTicket.status} />
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {selectedTicket.subject}
              </h3>
            </div>

            {/* Student & Assignment Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  Raised By
                </span>

                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedTicket.raisedBy}
                </span>

                <span className="text-[10px] text-slate-500 font-mono">
                  {getStudentEnrollment(selectedTicket.raisedBy)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  Assigned Specialist
                </span>

                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedTicket.assignedTo}
                </span>

                {selectedTicket.assignedTo === 'Unassigned' && (
                  <button
                    type="button"
                    onClick={handleAssignToMe}
                    className="text-[10px] font-semibold text-[#0D5C46] hover:underline mt-0.5 cursor-pointer block"
                  >
                    + Assign to me
                  </button>
                )}
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  Priority
                </span>

                <span className="font-semibold text-slate-900 block mt-0.5">
                  {selectedTicket.priority} Priority
                </span>

                <span className="text-[10px] text-slate-400 font-mono">
                  Logged: {selectedTicket.createdDate}
                </span>
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

            {/* Administrative Actions */}
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

              {/* Add Note */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal work log note..."
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!noteText.trim()) {
                        return;
                      }

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
                {selectedTicket.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="relative flex items-start gap-3.5 pl-1"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-800 text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </div>

                    <div className="flex-1 bg-[#FAFBFB] p-3 rounded-lg border border-slate-200/80">
                      <div className="flex items-center justify-between text-slate-800 font-semibold">
                        <span>{activity.action}</span>

                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          {activity.timestamp}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5">
                        By {activity.author} ({activity.role})
                      </div>

                      {activity.note && (
                        <p className="mt-1.5 text-xs text-slate-700 font-medium">
                          {activity.note}
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

      {/* Delete Ticket Confirmation */}
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