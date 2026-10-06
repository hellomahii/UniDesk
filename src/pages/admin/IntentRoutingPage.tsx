import React, { useState } from 'react';
import {
  GitFork,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Layers,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { IntentRoutingRecord, Department, RoutingDecision } from '../../types';
import { Drawer } from '../../components/common/Drawer';

export const IntentRoutingPage: React.FC = () => {
  const { routingRecords } = useData();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRouting, setSelectedRouting] = useState<string>('All');
  const [activeRecord, setActiveRecord] = useState<IntentRoutingRecord | null>(null);

  const filteredRecords = routingRecords.filter((rec) => {
    const matchesSearch =
      rec.request.toLowerCase().includes(search.toLowerCase()) ||
      rec.detectedIntent.toLowerCase().includes(search.toLowerCase()) ||
      rec.department.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'All' || rec.department === selectedDept;
    const matchesRouting = selectedRouting === 'All' || rec.routing === selectedRouting;

    return matchesSearch && matchesDept && matchesRouting;
  });

  const getRoutingBadgeStyle = (routing: RoutingDecision) => {
    switch (routing) {
      case 'auto':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'clarification':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'human_support':
        return 'bg-rose-50 text-rose-800 border-rose-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
          <GitFork className="w-6 h-6 text-[#0D5C46]" />
          <span>Intent Routing</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Monitor how UniDesk interprets and routes student requests across university registers. (Chatbot queries ≠ Service Tickets)
        </p>
      </div>

      {/* Intelligence Metric summary strip (Admin view: focus on operational decisions, NO raw confidence numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Direct Auto Routing
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-800">Automated Resolution</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Student inquiries directly resolved from authoritative department registers.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Disambiguation Matrix
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-slate-800">Clarification Prompted</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Disambiguation questions asked before student request routing is finalized.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Staff Escalation Gate
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs font-semibold text-slate-800">Human Support Path</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Department contact information or ticket creation options provided to student.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Multi-Topic Resolution
          </span>
          <div className="mt-2 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-xs font-semibold text-slate-800">Compound Intent Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Decomposes multi-intent student requests into synchronized department responses.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search routing requests, detected intents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Departments</option>
            <option value="Academic">Academic Affairs</option>
            <option value="Finance">Finance & Bursar</option>
            <option value="IT">IT Infrastructure</option>
            <option value="General">General Support</option>
          </select>

          <select
            value={selectedRouting}
            onChange={(e) => setSelectedRouting(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Routing Decisions</option>
            <option value="auto">Auto Routed</option>
            <option value="clarification">Clarification Required</option>
            <option value="human_support">Human Support</option>
          </select>
        </div>
      </div>

      {/* 18. ADMIN INTENT ROUTING TABLE:
          Request | Detected Intent | Department | Routing Decision | Timestamp (NO Confidence column) */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Student Request</th>
                <th className="px-5 py-3.5">Detected Intent</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Routing Decision</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => setActiveRecord(rec)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 font-medium text-slate-900 max-w-xs">
                    <div className="line-clamp-1 italic">"{rec.request}"</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{rec.detectedIntent}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {rec.department}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border ${getRoutingBadgeStyle(
                        rec.routing
                      )}`}
                    >
                      {rec.routingLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <span className="text-[#0D5C46] font-semibold text-xs inline-flex items-center gap-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No intent routing records match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INTENT DETAIL PANEL (Drawer - No raw confidence scores) */}
      {activeRecord && (
        <Drawer
          isOpen={!!activeRecord}
          onClose={() => setActiveRecord(null)}
          title="Intent Routing Inspection"
          subtitle={`Processed at ${activeRecord.timestamp}`}
          width="lg"
        >
          <div className="space-y-6 text-xs">
            {/* User Request */}
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px] mb-1">
                Student Request
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 leading-relaxed italic">
                "{activeRecord.request}"
              </div>
            </div>

            {/* Core Classification Breakdown */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Detected Intent</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {activeRecord.detectedIntent}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Target Department</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {activeRecord.department} Department
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-200 col-span-2">
                <span className="text-slate-400 text-[11px] block">Routing Decision</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border mt-1.5 ${getRoutingBadgeStyle(
                    activeRecord.routing
                  )}`}
                >
                  {activeRecord.routingLabel}
                </span>
              </div>
            </div>

            {/* Response Source */}
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px] mb-1">
                Resolution Authority
              </span>
              <p className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-950 font-medium">
                {activeRecord.responseSource}
              </p>
            </div>

            {/* Clarification prompt if medium confidence */}
            {activeRecord.clarificationQuestion && (
              <div>
                <span className="text-amber-800 font-semibold uppercase tracking-wider block text-[11px] mb-1">
                  Disambiguation Question Asked to Student
                </span>
                <p className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-amber-950 font-medium">
                  {activeRecord.clarificationQuestion}
                </p>
              </div>
            )}

            {/* Multi-topic breakdown if compound */}
            {activeRecord.multiTopics && (
              <div>
                <span className="text-teal-800 font-semibold uppercase tracking-wider block text-[11px] mb-2">
                  Decomposed Atomic Sub-Intents
                </span>
                <div className="space-y-2">
                  {activeRecord.multiTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#F8FAF9] border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{item.intent}</span>
                        <span className="text-emerald-700 text-[11px]">{item.department}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {activeRecord.explanation && (
              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px] mb-1">
                  Routing Rationale
                </span>
                <p className="text-slate-600 leading-relaxed bg-[#FAFBFB] p-3 rounded-lg border border-slate-200">
                  {activeRecord.explanation}
                </p>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
};
