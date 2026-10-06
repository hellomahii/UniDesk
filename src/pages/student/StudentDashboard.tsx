import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Ticket as TicketIcon,
  Bell,
  Sparkles,
  ClipboardList,
  BookOpen,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setCurrentPath } = useAuth();
  const { tickets, notices } = useData();
  const [quickQuery, setQuickQuery] = useState('');

  const firstName = currentUser?.name.split(' ')[0] || 'Mahi';

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      sessionStorage.setItem('unidesk_initial_query', quickQuery.trim());
      setCurrentPath('/ask');
    } else {
      setCurrentPath('/ask');
    }
  };

  const handleChipClick = (queryText: string) => {
    sessionStorage.setItem('unidesk_initial_query', queryText);
    setCurrentPath('/ask');
  };

  // Student's tickets
  const myTickets = tickets
    .filter((t) => t.studentEmail === currentUser?.email || t.raisedBy.includes(firstName))
    .slice(0, 3);

  // Recent published notices
  const recentNotices = notices.filter((n) => n.status === 'Published').slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 5. DASHBOARD HERO / WELCOME SECTION */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#073628] via-[#0D5C46] to-[#0A4E3B] text-white shadow-soft-lg relative overflow-hidden">
        {/* Subtle decorative layered translucent shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-100 mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Autumn Term 2026 · Semester 3</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Hi, {firstName}! 👋
            </h1>
            <p className="mt-1.5 text-sm md:text-base text-emerald-100/90 font-medium leading-relaxed">
              How can UniDesk help you today? Ask any campus inquiry or track your academic schedule below.
            </p>
          </div>

          {/* Quick Profile Summary Badge */}
          <div className="self-start md:self-auto bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-xs space-y-1.5 shrink-0 min-w-[200px]">
            <div className="text-emerald-200/80 uppercase tracking-wider font-semibold text-[10px]">
              Enrolled Program
            </div>
            <div className="font-bold text-white text-sm">B.Tech Computer Science</div>
            <div className="font-mono text-emerald-100 text-[11px]">
              {currentUser?.enrollmentNo || '2024-CS-042'} · Sec A
            </div>
          </div>
        </div>
      </div>

      {/* 12. ASK UNIDESK CARD ON DASHBOARD (Featured High-Impact Element) */}
      <div className="card-3d shadow-mint rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#F2FAF6] via-white to-[#EBF6F1] border-2 border-[#C8E4D7] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="icon-box w-11 h-11 rounded-2xl bg-[#0D5C46] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#0D3B2E]">
                Ask UniDesk
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Your campus front door · Ask about exams, timetable, fees, IT or campus services.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPath('/ask')}
            className="self-start md:self-auto text-xs font-bold text-[#0D5C46] hover:text-[#073628] flex items-center gap-1.5 cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-[#CBDDD4] shadow-2xs hover:shadow transition-all"
          >
            <span>Open Full Service Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Bar inside Card */}
        <form onSubmit={handleAskSubmit} className="mt-2">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0D5C46]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="e.g. When is my Database Systems exam? or Fee status pending..."
              className="w-full pl-11 pr-32 py-4 bg-white border border-[#BBD9CB] rounded-2xl text-sm md:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] shadow-sm transition-all"
            />
            <button
              type="submit"
              className="interactive-btn absolute right-2.5 top-2.5 bottom-2.5 px-5 bg-[#0D5C46] hover:bg-[#094232] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Ask Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Try asking:</span>
          <button
            onClick={() => handleChipClick('When is my Database Systems exam?')}
            className="px-3 py-1 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-[#0D5C46] hover:border-emerald-300 shadow-2xs transition-all cursor-pointer font-medium"
          >
            When is my Database Systems exam?
          </button>
          <button
            onClick={() => handleChipClick('I paid my fee but the payment is still showing as pending')}
            className="px-3 py-1 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 shadow-2xs transition-all cursor-pointer font-medium"
          >
            Fee payment pending issue
          </button>
          <button
            onClick={() => handleChipClick("My student portal login isn't working")}
            className="px-3 py-1 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-[#0D5C46] hover:border-emerald-300 shadow-2xs transition-all cursor-pointer font-medium"
          >
            Student portal login troubleshooting
          </button>
          <button
            onClick={() => handleChipClick('What is my schedule?')}
            className="px-3 py-1 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-800 hover:border-amber-300 shadow-2xs transition-all cursor-pointer font-medium"
          >
            What is my schedule?
          </button>
        </div>
      </div>

      {/* 4. TINTED QUICK GLANCE STAT CARDS (Sections 4, 6, 7, 8: Mint, Teal, Sage, Amber) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Classes"
          value="3 Lectures"
          subtext="Next: Database Systems (11:00 AM)"
          icon={<Calendar className="w-5 h-5" />}
          variant="mint"
          onClick={() => setCurrentPath('/timetable')}
        />
        <StatCard
          label="Next Assessment"
          value="14 Oct 2026"
          subtext="Database Systems · Room A-204"
          icon={<ClipboardList className="w-5 h-5" />}
          variant="teal"
          onClick={() => setCurrentPath('/exams')}
        />
        <StatCard
          label="My Support Tickets"
          value={myTickets.length}
          subtext={myTickets.length > 0 ? '1 In Progress · 1 Resolved' : 'No active inquiries'}
          icon={<TicketIcon className="w-5 h-5" />}
          variant="sage"
          onClick={() => setCurrentPath('/tickets')}
        />
        <StatCard
          label="Campus Bulletins"
          value={recentNotices.length}
          subtext="Verified university circulars"
          icon={<Bell className="w-5 h-5" />}
          variant="amber"
          onClick={() => setCurrentPath('/notices')}
        />
      </div>

      {/* 11. TODAY'S TIMETABLE (Visual Variety with 3D Event Cards) */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-[#E2ECE7] shadow-soft bg-white">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBF5F0] text-[#0D5C46] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#0D3B2E]">Today's Timetable</h2>
              <span className="text-xs text-slate-500 font-medium">Wednesday Sessions · Week 5</span>
            </div>
          </div>
          <button
            onClick={() => setCurrentPath('/timetable')}
            className="interactive-btn text-xs font-bold text-[#0D5C46] hover:text-[#093E2F] flex items-center gap-1.5 bg-[#EBF5F0] px-3 py-1.5 rounded-xl border border-[#CDE5DB] cursor-pointer"
          >
            <span>View Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lecture 1 */}
          <div
            onClick={() => setCurrentPath('/timetable')}
            className="card-3d shadow-mint p-4.5 rounded-2xl border border-emerald-200/90 bg-[#F4FAF7] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-emerald-300 text-xs font-mono font-bold text-emerald-800">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>09:00 – 10:00</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-400 uppercase">CSET205</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#0D3B2E]">
              Database Systems
            </h4>
            <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Room A-204
              </span>
              <span className="text-slate-500">Dr. Sharma</span>
            </div>
          </div>

          {/* Lecture 2 */}
          <div
            onClick={() => setCurrentPath('/timetable')}
            className="card-3d shadow-teal p-4.5 rounded-2xl border border-teal-200/90 bg-[#F0FDF8] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-teal-300 text-xs font-mono font-bold text-teal-800">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>11:00 – 12:00</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-400 uppercase">MA301</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#0D3B2E]">
              Discrete Mathematics
            </h4>
            <div className="mt-3 pt-2.5 border-t border-teal-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                Room B-201
              </span>
              <span className="text-slate-500">Dr. Harish Joshi</span>
            </div>
          </div>

          {/* Lecture 3 */}
          <div
            onClick={() => setCurrentPath('/timetable')}
            className="card-3d shadow-sage p-4.5 rounded-2xl border border-[#CFE2D8] bg-[#F3F7F5] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-300 text-xs font-mono font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>14:00 – 15:00</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-400 uppercase">CS303</span>
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#0D3B2E]">
              Operating Systems
            </h4>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-700" />
                Room B-103
              </span>
              <span className="text-slate-500">Dr. Neha Kulkarni</span>
            </div>
          </div>
        </div>
      </div>

      {/* 11. BOTTOM GRID: My Tickets + Recent Notices with Polished Row Hover */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tickets */}
        <div className="glass-panel rounded-3xl p-6 border border-[#E2ECE7] shadow-soft bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-[#0D5C46]" />
                <h3 className="text-base font-bold text-[#0D3B2E]">My Service Tickets</h3>
              </div>
              <button
                onClick={() => setCurrentPath('/tickets')}
                className="text-xs font-bold text-[#0D5C46] hover:text-[#083E30] flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {myTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setCurrentPath('/tickets')}
                  className="table-row-hover p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {ticket.ticketNo}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-medium">{ticket.category}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                      {ticket.subject}
                    </h5>
                  </div>
                  <div className="shrink-0 ml-3">
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Departmental issue?</span>
            <button
              onClick={() => setCurrentPath('/tickets')}
              className="interactive-btn font-bold text-[#0D5C46] hover:underline cursor-pointer"
            >
              + Raise New Ticket
            </button>
          </div>
        </div>

        {/* Notices */}
        <div className="glass-panel rounded-3xl p-6 border border-[#E2ECE7] shadow-soft bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0D5C46]" />
                <h3 className="text-base font-bold text-[#0D3B2E]">Campus Notices</h3>
              </div>
              <button
                onClick={() => setCurrentPath('/notices')}
                className="text-xs font-bold text-[#0D5C46] hover:text-[#083E30] flex items-center gap-1 cursor-pointer"
              >
                <span>All notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setCurrentPath('/notices')}
                  className="table-row-hover p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {notice.category}
                    </span>
                    <span className="font-mono">{notice.publishDate}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {notice.title}
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Verified University Communications</span>
            <span className="font-mono">Office of Registrar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
