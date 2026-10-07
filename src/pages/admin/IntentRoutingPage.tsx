import React, { useEffect, useState } from 'react';
import {
  GitFork,
  Search,
  ChevronRight,
  Layers,
  Clock,
  Send,
  X,
} from 'lucide-react';

type RoutingDecision = 'auto' | 'clarification' | 'human_support';

type RoutingRecord = {
  id: string;
  request: string;
  detectedIntent: string;
  department: string;
  routing: RoutingDecision;
  routingLabel: string;
  timestamp: string;
  responseSource: string;
  clarificationQuestion?: string;
  explanation?: string;
};

const STORAGE_KEY = 'unidesk_intent_routing_records';

const initialRecords: RoutingRecord[] = [
  {
    id: 'routing-1',
    request: 'My Wi-Fi is not working in the hostel',
    detectedIntent: 'Network Issue',
    department: 'IT',
    routing: 'auto',
    routingLabel: 'Auto Routed',
    timestamp: '08 Oct 2026, 00:15',
    responseSource: 'IT Infrastructure Support',
    explanation:
      'The request contains network-related keywords, so it was automatically routed to IT Infrastructure.',
  },
  {
    id: 'routing-2',
    request: 'I cannot login to my student account',
    detectedIntent: 'Authentication Issue',
    department: 'IT',
    routing: 'auto',
    routingLabel: 'Auto Routed',
    timestamp: '08 Oct 2026, 00:18',
    responseSource: 'IT Support',
    explanation:
      'The request contains login and account-related terms, so it was routed to IT Support.',
  },
  {
    id: 'routing-3',
    request: 'I need clarification about my exam timetable',
    detectedIntent: 'Exam Schedule',
    department: 'Academic',
    routing: 'auto',
    routingLabel: 'Auto Routed',
    timestamp: '08 Oct 2026, 00:22',
    responseSource: 'Academic Affairs',
    explanation:
      'The request mentions an exam timetable, so it was automatically routed to Academic Affairs.',
  },
  {
    id: 'routing-4',
    request: 'My fee payment is not showing',
    detectedIntent: 'Fee Payment',
    department: 'Finance',
    routing: 'auto',
    routingLabel: 'Auto Routed',
    timestamp: '08 Oct 2026, 00:25',
    responseSource: 'Finance & Bursar',
    explanation:
      'The request contains fee and payment-related terms, so it was automatically routed to Finance.',
  },
];

function detectIntent(
  request: string
): Omit<RoutingRecord, 'id' | 'request' | 'timestamp'> {
  const text = request.toLowerCase();

  if (
    text.includes('wifi') ||
    text.includes('wi-fi') ||
    text.includes('internet') ||
    text.includes('network') ||
    text.includes('router') ||
    text.includes('connection')
  ) {
    return {
      detectedIntent: 'Network Issue',
      department: 'IT',
      routing: 'auto',
      routingLabel: 'Auto Routed',
      responseSource: 'IT Infrastructure Support',
      explanation:
        'The request contains network-related keywords, so it was automatically routed to IT Infrastructure.',
    };
  }

  if (
    text.includes('login') ||
    text.includes('log in') ||
    text.includes('password') ||
    text.includes('account') ||
    text.includes('signin') ||
    text.includes('sign in')
  ) {
    return {
      detectedIntent: 'Authentication Issue',
      department: 'IT',
      routing: 'auto',
      routingLabel: 'Auto Routed',
      responseSource: 'IT Support',
      explanation:
        'The request contains authentication or account-related terms, so it was automatically routed to IT Support.',
    };
  }

  if (
    text.includes('fee') ||
    text.includes('fees') ||
    text.includes('payment') ||
    text.includes('dues') ||
    text.includes('tuition')
  ) {
    return {
      detectedIntent: 'Fee Payment',
      department: 'Finance',
      routing: 'auto',
      routingLabel: 'Auto Routed',
      responseSource: 'Finance & Bursar',
      explanation:
        'The request contains fee or payment-related terms, so it was automatically routed to Finance.',
    };
  }

  if (
    text.includes('exam') ||
    text.includes('timetable') ||
    text.includes('time table') ||
    text.includes('schedule') ||
    text.includes('marks') ||
    text.includes('result') ||
    text.includes('attendance') ||
    text.includes('course') ||
    text.includes('subject')
  ) {
    return {
      detectedIntent: 'Academic Query',
      department: 'Academic',
      routing: 'auto',
      routingLabel: 'Auto Routed',
      responseSource: 'Academic Affairs',
      explanation:
        'The request contains academic-related terms, so it was automatically routed to Academic Affairs.',
    };
  }

  if (
    text.includes('hostel') ||
    text.includes('room') ||
    text.includes('maintenance') ||
    text.includes('facility') ||
    text.includes('electricity') ||
    text.includes('water') ||
    text.includes('cleaning')
  ) {
    return {
      detectedIntent: 'Facility Issue',
      department: 'General',
      routing: 'human_support',
      routingLabel: 'Human Support',
      responseSource: 'Campus Facilities',
      explanation:
        'The request appears to concern a campus facility or maintenance issue, so it was sent to human support.',
    };
  }

  return {
    detectedIntent: 'General Query',
    department: 'General',
    routing: 'clarification',
    routingLabel: 'Clarification Required',
    responseSource: 'General Support',
    clarificationQuestion:
      'Could you provide a little more information so we can route your request to the correct department?',
    explanation:
      'The request did not contain enough information to confidently identify a specific department, so clarification is required.',
  };
}

function getBadgeClass(routing: RoutingDecision): string {
  if (routing === 'auto') {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }

  if (routing === 'clarification') {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }

  if (routing === 'human_support') {
    return 'bg-rose-50 text-rose-800 border-rose-200';
  }

  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export const IntentRoutingPage: React.FC = () => {
  const [records, setRecords] = useState<RoutingRecord[]>([]);
  const [request, setRequest] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [department, setDepartment] = useState<string>('All');
  const [routing, setRouting] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] =
    useState<RoutingRecord | null>(null);

  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY);

    if (!savedRecords) {
      setRecords(initialRecords);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialRecords)
      );
      return;
    }

    try {
      const parsedRecords: unknown = JSON.parse(savedRecords);

      if (Array.isArray(parsedRecords)) {
        setRecords(parsedRecords as RoutingRecord[]);
      } else {
        setRecords(initialRecords);
      }
    } catch {
      setRecords(initialRecords);
    }
  }, []);

  const handleRoute = (): void => {
    const cleanRequest = request.trim();

    if (!cleanRequest) {
      return;
    }

    const result = detectIntent(cleanRequest);

    const newRecord: RoutingRecord = {
      id: `routing-${Date.now()}`,
      request: cleanRequest,
      detectedIntent: result.detectedIntent,
      department: result.department,
      routing: result.routing,
      routingLabel: result.routingLabel,
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      responseSource: result.responseSource,
      clarificationQuestion: result.clarificationQuestion,
      explanation: result.explanation,
    };

    const updatedRecords: RoutingRecord[] = [
      newRecord,
      ...records,
    ];

    setRecords(updatedRecords);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedRecords)
    );

    setRequest('');
    setSelectedRecord(newRecord);
  };

  const handleClearRecords = (): void => {
    setRecords([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setSelectedRecord(null);
  };

  const filteredRecords = records.filter(
    (record: RoutingRecord): boolean => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        record.request.toLowerCase().includes(searchValue) ||
        record.detectedIntent
          .toLowerCase()
          .includes(searchValue) ||
        record.department
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        department === 'All' ||
        record.department === department;

      const matchesRouting =
        routing === 'All' ||
        record.routing === routing;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRouting
      );
    }
  );

  const autoCount = records.filter(
    (record: RoutingRecord) => record.routing === 'auto'
  ).length;

  const clarificationCount = records.filter(
    (record: RoutingRecord) =>
      record.routing === 'clarification'
  ).length;

  const humanCount = records.filter(
    (record: RoutingRecord) =>
      record.routing === 'human_support'
  ).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
          <GitFork className="w-6 h-6 text-[#0D5C46]" />
          Intent Routing
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Monitor how UniDesk interprets and routes student
          requests across university departments.
        </p>
      </div>

      {/* TEST ROUTING */}
      <div className="rounded-2xl border border-[#E2ECE7] bg-white p-5">

        <div className="flex items-center gap-2 mb-3">
          <GitFork className="w-4 h-4 text-[#0D5C46]" />

          <h2 className="text-sm font-bold text-slate-800">
            Test Intent Routing
          </h2>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Enter a student request and UniDesk will detect
          the intent and department locally.
        </p>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="text"
            value={request}
            onChange={(event) =>
              setRequest(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleRoute();
              }
            }}
            placeholder="Example: My Wi-Fi is not working"
            className="flex-1 px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-[#0D5C46]"
          />

          <button
            type="button"
            onClick={handleRoute}
            disabled={!request.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0D5C46] text-white text-sm font-semibold hover:bg-[#094936] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Analyze &amp; Route
          </button>

        </div>

        <div className="flex flex-wrap gap-2 mt-3">

          <button
            type="button"
            onClick={() =>
              setRequest('My Wi-Fi is not working')
            }
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200"
          >
            Wi-Fi issue
          </button>

          <button
            type="button"
            onClick={() =>
              setRequest('I cannot login to my account')
            }
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200"
          >
            Login issue
          </button>

          <button
            type="button"
            onClick={() =>
              setRequest('My fee payment is not showing')
            }
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200"
          >
            Fee issue
          </button>

          <button
            type="button"
            onClick={() =>
              setRequest('I need my exam timetable')
            }
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200"
          >
            Exam issue
          </button>

        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase text-slate-400">
            Auto Routing
          </span>

          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold text-slate-800">
              {autoCount} Automated
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase text-slate-400">
            Clarification
          </span>

          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />

            <span className="text-xs font-semibold text-slate-800">
              {clarificationCount} Required
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase text-slate-400">
            Human Support
          </span>

          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />

            <span className="text-xs font-semibold text-slate-800">
              {humanCount} Requests
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-[11px] font-semibold uppercase text-slate-400">
            Total Requests
          </span>

          <div className="mt-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />

            <span className="text-xs font-semibold text-slate-800">
              {records.length} Requests
            </span>
          </div>
        </div>

      </div>

      {/* SEARCH / FILTERS */}
      <div className="rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">

        <div className="relative flex-1 min-w-[220px]">

          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />

          <input
            type="text"
            placeholder="Search routing requests..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none"
          />

        </div>

        <div className="flex items-center gap-2">

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
          >
            <option value="All">All Departments</option>
            <option value="Academic">Academic Affairs</option>
            <option value="Finance">Finance &amp; Bursar</option>
            <option value="IT">IT Infrastructure</option>
            <option value="General">General Support</option>
          </select>

          <select
            value={routing}
            onChange={(event) =>
              setRouting(event.target.value)
            }
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
          >
            <option value="All">All Routing Decisions</option>
            <option value="auto">Auto Routed</option>
            <option value="clarification">
              Clarification Required
            </option>
            <option value="human_support">
              Human Support
            </option>
          </select>

        </div>
      </div>

      {/* CLEAR */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClearRecords}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Clear Routing Records
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">

              <tr>
                <th className="px-5 py-3.5">
                  Student Request
                </th>

                <th className="px-5 py-3.5">
                  Detected Intent
                </th>

                <th className="px-5 py-3.5">
                  Department
                </th>

                <th className="px-5 py-3.5">
                  Routing Decision
                </th>

                <th className="px-5 py-3.5">
                  Timestamp
                </th>

                <th className="px-5 py-3.5 text-right">
                  Details
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredRecords.map((record: RoutingRecord) => (
                <tr
                  key={record.id}
                  onClick={() =>
                    setSelectedRecord(record)
                  }
                  className="hover:bg-[#F9FAF9] cursor-pointer"
                >

                  <td className="px-5 py-4 font-medium text-slate-900">
                    "{record.request}"
                  </td>

                  <td className="px-5 py-4">
                    {record.detectedIntent}
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold">
                      {record.department}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        'inline-flex px-2.5 py-1 rounded-md border text-xs font-semibold ' +
                        getBadgeClass(record.routing)
                      }
                    >
                      {record.routingLabel}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {record.timestamp}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="text-[#0D5C46] font-semibold inline-flex items-center gap-1">
                      Inspect
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>

                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No routing records found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL */}
      {selectedRecord !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedRecord(null)}
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="text-lg font-bold text-[#0D3B2E]">
                  Intent Routing Inspection
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Processed at {selectedRecord.timestamp}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            {/* MODAL CONTENT */}
            <div className="p-5 space-y-5">

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Student Request
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900">
                  "{selectedRecord.request}"
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-400">
                    Detected Intent
                  </p>

                  <p className="font-bold text-slate-900 mt-1">
                    {selectedRecord.detectedIntent}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-400">
                    Department
                  </p>

                  <p className="font-bold text-slate-900 mt-1">
                    {selectedRecord.department}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Routing Decision
                </p>

                <span
                  className={
                    'inline-flex px-3 py-1.5 rounded-md border text-xs font-semibold ' +
                    getBadgeClass(selectedRecord.routing)
                  }
                >
                  {selectedRecord.routingLabel}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Resolution Authority
                </p>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
                  {selectedRecord.responseSource}
                </div>
              </div>

              {selectedRecord.clarificationQuestion && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-2">
                    Disambiguation Question
                  </p>

                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
                    {selectedRecord.clarificationQuestion}
                  </div>
                </div>
              )}

              {selectedRecord.explanation && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Routing Rationale
                  </p>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                    {selectedRecord.explanation}
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="border-t border-slate-200 p-4 flex justify-end">

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-[#0D5C46] text-white text-sm font-semibold hover:bg-[#094936]"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default IntentRoutingPage;