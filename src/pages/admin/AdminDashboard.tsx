import React from 'react';
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  GitFork,
  ArrowRight,
  Plus,
  Users,
  CreditCard,
  Calendar,
  ClipboardList,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { currentUser, activeRole, setCurrentPath } = useAuth();
  const { tickets, notices, routingRecords } = useData();

  const getGreetingName = () => currentUser?.name || 'Administrator';

  // Strict department ticket scoping:
  // Admin dashboard statistics count ONLY actual student-approved tickets for their department!
  const deptTickets =
    activeRole === 'it_admin'
      ? tickets.filter((t) => t.department === 'IT')
      : activeRole === 'finance_admin'
      ? tickets.filter((t) => t.department === 'Finance')
      : tickets.filter((t) => t.department === 'Academic');

  const totalDeptTickets = deptTickets.length;
  const pendingCount = deptTickets.filter((t) => t.status === 'Pending').length;
  const inProgressCount = deptTickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = deptTickets.filter((t) => t.status === 'Resolved').length;

  const displayTickets = deptTickets.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Department Subtitle */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-[#E2ECE7] bg-gradient-to-r from-white via-[#FCFDFC] to-[#F3F8F5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-2">
            {activeRole === 'it_admin' && 'IT Infrastructure & Digital Services'}
            {activeRole === 'finance_admin' && 'University Finance & Accounts Office'}
            {activeRole === 'academic_admin' && 'Academic Affairs & Registrar Office'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0D3B2E]">
            Good morning, {getGreetingName()}
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-500 font-medium">
            Here's an overview of your department activity, approved student requests, and routing operations.
          </p>
        </div>

        {/* Quick Department Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeRole === 'finance_admin' && (
            <button
              onClick={() => setCurrentPath('/admin/students')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Students Info
            </button>
          )}
          {activeRole === 'academic_admin' && (
            <button
              onClick={() => setCurrentPath('/admin/timetable')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Manage Timetable
            </button>
          )}
          <button
            onClick={() => setCurrentPath('/admin/tickets')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            Manage Tickets
          </button>
          <button
            onClick={() => setCurrentPath('/admin/notices')}
            className="px-3.5 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Notice</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 4 Statistics Cards:
          Strictly actual approved tickets for that department.
          NO "Fees Collected", NO "Pending Fee", NO "Open Inquiries", NO "Registered Students" on Finance! */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={
            activeRole === 'finance_admin'
              ? 'Total Finance Tickets'
              : activeRole === 'academic_admin'
              ? 'Academic Tickets'
              : 'Total IT Tickets'
          }
          value={totalDeptTickets}
          subtext="Approved departmental requests"
          icon={<TicketIcon className="w-5 h-5" />}
          variant="sage"
          onClick={() => setCurrentPath('/admin/tickets')}
        />
        <StatCard
          label="Pending Review"
          value={pendingCount}
          subtext="Awaiting departmental action"
          icon={<Clock className="w-5 h-5" />}
          variant="amber"
          onClick={() => setCurrentPath('/admin/tickets')}
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          subtext="Currently under resolution"
          icon={<AlertCircle className="w-5 h-5" />}
          variant="teal"
          onClick={() => setCurrentPath('/admin/tickets')}
        />
        <StatCard
          label="Resolved"
          value={resolvedCount}
          subtext="Successfully closed cases"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="mint"
          onClick={() => setCurrentPath('/admin/tickets')}
        />
      </div>

      {/* 3. Middle Section: Recent Department Tickets + Ticket Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#132A22]">Recent Department Tickets</h3>
                <p className="text-xs text-slate-500">
                  Approved student-raised tickets in your queue
                </p>
              </div>
              <button
                onClick={() => setCurrentPath('/admin/tickets')}
                className="text-xs font-semibold text-[#0D5C46] hover:text-[#093E2F] flex items-center gap-1 cursor-pointer"
              >
                <span>View all tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAF9] text-slate-500 font-semibold border-b border-slate-200/80">
                  <tr>
                    <th className="px-3.5 py-2.5">Ticket</th>
                    <th className="px-3.5 py-2.5">Subject</th>
                    <th className="px-3.5 py-2.5">Raised By</th>
                    <th className="px-3.5 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setCurrentPath('/admin/tickets')}
                      className="table-row-hover transition-colors cursor-pointer"
                    >
                      <td className="px-3.5 py-3 font-mono font-semibold text-slate-700 whitespace-nowrap">
                        {t.ticketNo}
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {t.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {t.category}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap text-slate-600">
                        {t.raisedBy}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                  {displayTickets.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        No approved tickets currently logged in your department queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Only student-approved tickets appear here</span>
            <span className="font-mono">Live Sync</span>
          </div>
        </div>

        {/* Ticket Activity Progress Visualization (1 col) */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#132A22]">Ticket Activity</h3>
            <p className="text-xs text-slate-500 mb-4">
              Resolution ratio for approved tickets
            </p>

            <div className="space-y-4">
              {/* Resolved bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Resolved Cases</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    {Math.round((resolvedCount / Math.max(1, totalDeptTickets)) * 100)}% ({resolvedCount})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${(resolvedCount / Math.max(1, totalDeptTickets)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pending bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Pending Assignment</span>
                  <span className="font-mono font-semibold text-amber-700">
                    {Math.round((pendingCount / Math.max(1, totalDeptTickets)) * 100)}% ({pendingCount})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(pendingCount / Math.max(1, totalDeptTickets)) * 100}%` }}
                  />
                </div>
              </div>

              {/* In Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Under Active Work</span>
                  <span className="font-mono font-semibold text-teal-700">
                    {Math.round((inProgressCount / Math.max(1, totalDeptTickets)) * 100)}% ({inProgressCount})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${(inProgressCount / Math.max(1, totalDeptTickets)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Average resolution velocity:</span>{' '}
            <span className="font-mono text-emerald-800 font-semibold">4.2 hours</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Notices + UniDesk Intent Routing Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#132A22]">Recent Notices</h3>
                <p className="text-xs text-slate-500">Official broadcast communications</p>
              </div>
              <button
                onClick={() => setCurrentPath('/admin/notices')}
                className="text-xs font-semibold text-[#0D5C46] hover:text-[#093E2F] flex items-center gap-1 cursor-pointer"
              >
                <span>Notice+ Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setCurrentPath('/admin/notices')}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-[#FAFBFB] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                      {n.category}
                    </span>
                    <span className="font-mono">{n.publishDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Manage publishing schedules via Notice+</span>
            <button
              onClick={() => setCurrentPath('/admin/notices')}
              className="text-[#0D5C46] font-semibold hover:underline cursor-pointer"
            >
              + New Announcement
            </button>
          </div>
        </div>

        {/* UniDesk Intent Routing Monitor (Admin view: NO raw confidence percentages) */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-[#0D5C46]" />
                <h3 className="text-base font-bold text-[#132A22]">UniDesk Intent Stream</h3>
              </div>
              <button
                onClick={() => setCurrentPath('/admin/routing')}
                className="text-xs font-semibold text-[#0D5C46] hover:text-[#093E2F] flex items-center gap-1 cursor-pointer"
              >
                <span>View Stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metric distribution row without raw confidence figures */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <span className="text-[11px] font-semibold text-emerald-900 block">Auto Routed</span>
                <span className="text-xs text-slate-500 mt-1 block">Direct Resolution</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span className="text-[11px] font-semibold text-amber-900 block">Clarification</span>
                <span className="text-xs text-slate-500 mt-1 block">Disambiguated</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60">
                <span className="text-[11px] font-semibold text-rose-900 block">Human Support</span>
                <span className="text-xs text-slate-500 mt-1 block">Direct Contact/Ticket</span>
              </div>
            </div>

            {/* Recent routing stream sample (No confidence badge) */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Recent Student Inquiries (NLP Interpretation Only)
              </span>
              {routingRecords.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setCurrentPath('/admin/routing')}
                  className="p-2.5 rounded-lg border border-slate-100 bg-[#FAFBFB] flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold text-slate-800 truncate">"{rec.request}"</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {rec.detectedIntent} · {rec.department}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 shrink-0">
                    {rec.routingLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800 font-mono tabular-nums">
              127 student inquiries interpreted today
            </span>
            <span className="text-emerald-700 font-medium">Chatbot queries ≠ Tickets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
