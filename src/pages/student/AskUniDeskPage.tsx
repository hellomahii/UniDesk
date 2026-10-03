import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Headphones,
  Ticket as TicketIcon,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Paperclip,
  X,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Send,
  MessageSquare,
  Building2,
  Calendar,
} from 'lucide-react';
import { askUniDesk, DEPARTMENT_CONTACTS } from '../../services/uniDeskAi';
import { AskUniDeskResponse, Department, DepartmentContact } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';

interface ChatTurn {
  id: string;
  query: string;
  timestamp: string;
  response: AskUniDeskResponse;
  selectedContact?: DepartmentContact | null;
  approvedTicket?: {
    ticketNo: string;
    department: Department;
  } | null;
}

export const AskUniDeskPage: React.FC = () => {
  const { currentUser, setCurrentPath } = useAuth();
  const { addRoutingRecord, addTicket } = useData();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ChatTurn[]>([]);

  // Ticket creation review modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [ticketDepartment, setTicketDepartment] = useState<Department>('IT');
  const [ticketCategory, setTicketCategory] = useState('General Support');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketAttachment, setTicketAttachment] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, loading]);

  // Check if initial query was passed from Dashboard
  useEffect(() => {
    const initial = sessionStorage.getItem('unidesk_initial_query');
    if (initial) {
      sessionStorage.removeItem('unidesk_initial_query');
      setInputQuery(initial);
      executeSearch(initial);
    }
  }, []);

  const executeSearch = async (queryString: string) => {
    if (!queryString.trim()) return;
    setLoading(true);

    try {
      const res = await askUniDesk(queryString.trim());

      // Record NLP intent classification in Intent Routing monitoring (does NOT create a ticket)
      addRoutingRecord({
        request: queryString.trim(),
        detectedIntent: res.intent,
        department: res.department,
        confidence: res.confidence,
        routing: res.routing,
        routingLabel: res.routingLabel,
        responseSource: `${res.department} Registry / Verified Service Desk`,
        explanation: `UniDesk classified intent '${res.intent}' for ${res.department} department.`,
        clarificationQuestion: res.clarification?.question,
      });

      const newTurn: ChatTurn = {
        id: `turn-${Date.now()}`,
        query: queryString.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        response: res,
        selectedContact: null,
        approvedTicket: null,
      };

      setConversation((prev) => [...prev, newTurn]);
      setInputQuery('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(inputQuery);
  };

  const handleClarificationClick = (clarifiedQuery: string) => {
    executeSearch(clarifiedQuery);
  };

  // Open Human Support in specific turn (does NOT create a ticket)
  const handleOpenHumanSupport = (turnId: string, dept?: Department) => {
    const targetDept = dept || 'IT';
    const contact = DEPARTMENT_CONTACTS[targetDept] || DEPARTMENT_CONTACTS.General;

    setConversation((prev) =>
      prev.map((t) => (t.id === turnId ? { ...t, selectedContact: contact } : t))
    );
  };

  const handleCloseHumanSupport = (turnId: string) => {
    setConversation((prev) =>
      prev.map((t) => (t.id === turnId ? { ...t, selectedContact: null } : t))
    );
  };

  // Open Raise a Ticket Review modal for a turn
  const handleOpenRaiseTicketModal = (turn: ChatTurn) => {
    const res = turn.response;
    const dept = res.suggestedTicket?.department || res.department || 'IT';
    const cat = res.suggestedTicket?.category || 'General Support';
    const subj = res.suggestedTicket?.subject || turn.query || 'Student Service Request';
    const desc = res.suggestedTicket?.description || turn.query || 'Inquiry regarding student services';

    setActiveTurnId(turn.id);
    setTicketDepartment(dept);
    setTicketCategory(cat);
    setTicketSubject(subj);
    setTicketDescription(desc);
    setTicketAttachment('');
    setIsTicketModalOpen(true);
  };

  // Student explicitly approves and raises the ticket
  const handleApproveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    const created = addTicket({
      studentId: currentUser?.id || 'usr-std-01',
      raisedBy: currentUser?.name || 'Mahi Patel',
      studentEmail: currentUser?.email || 'mahi.patel@college.edu',
      studentEnrollment: currentUser?.enrollmentNo || '2024-CS-042',
      subject: ticketSubject.trim(),
      category: ticketCategory,
      department: ticketDepartment,
      assignedTo: 'Unassigned',
      status: 'Pending',
      priority: 'Medium',
      description: ticketAttachment
        ? `${ticketDescription.trim()}\n\n[Attachment: ${ticketAttachment}]`
        : ticketDescription.trim(),
    });

    if (activeTurnId) {
      setConversation((prev) =>
        prev.map((t) =>
          t.id === activeTurnId
            ? {
                ...t,
                approvedTicket: {
                  ticketNo: created.ticketNo,
                  department: created.department,
                },
              }
            : t
        )
      );
    }

    setIsTicketModalOpen(false);
  };

  // Confidence visualization helpers
  const getConfidenceDetails = (confidence: number, dept: Department) => {
    if (confidence >= 75) {
      return {
        level: 'high',
        label: 'High confidence',
        containerStyle: 'bg-emerald-50/50 border-emerald-200/90',
        barColor: 'bg-[#0D5C46]',
        badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        explanation: `UniDesk is highly confident that your request is related to the ${dept} department.`,
      };
    } else if (confidence >= 40) {
      return {
        level: 'medium',
        label: 'Needs clarification',
        containerStyle: 'bg-amber-50/50 border-amber-200/90',
        barColor: 'bg-amber-500',
        badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
        explanation: 'UniDesk identified multiple potential matches. Clarification is required before finalizing routing.',
      };
    } else {
      return {
        level: 'low',
        label: 'Human support recommended',
        containerStyle: 'bg-rose-50/50 border-rose-200/90',
        barColor: 'bg-rose-500',
        badgeStyle: 'bg-rose-100 text-rose-900 border-rose-300',
        explanation: 'UniDesk is not completely certain of the required campus service. Direct department contact or support ticket recommended.',
      };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] min-h-[550px] bg-white rounded-2xl border border-[#E2ECE7] shadow-soft overflow-hidden">
      {/* 11. ASK UNIDESK FULL-WINDOW HEADER */}
      <div className="px-6 py-4 border-b border-[#E2ECE7] bg-[#FAFCFA] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0D5C46] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#0D3B2E] leading-none">
                Ask UniDesk
              </h1>
              <span className="text-xs text-slate-500 font-medium">
                Your campus assistant · One Front Door for Everything
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Campus Service Desk Active</span>
          </span>
          {conversation.length > 0 && (
            <button
              onClick={() => setConversation([])}
              className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* 11. CONVERSATION AREA (Expanded full height) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gradient-to-b from-white via-[#FCFDFC] to-[#F8FAF9]">
        {conversation.length === 0 && (
          <div className="max-w-2xl mx-auto py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center mx-auto text-[#0D5C46] shadow-2xs">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#0D3B2E]">
              How can UniDesk help you today?
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Ask about your exam schedule, class timetable, fee installment records, university notices, or campus facilities.
              UniDesk provides direct verified answers or routes requests to the proper department.
            </p>

            <div className="pt-2 text-xs">
              <span className="text-slate-400 font-medium block mb-2">Frequently Asked Inquiries:</span>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                <button
                  onClick={() => executeSearch('When is my Database Systems exam?')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 text-slate-700 hover:text-[#0D5C46] hover:border-emerald-300 shadow-2xs transition-all cursor-pointer text-left"
                >
                  When is my Database Systems exam?
                </button>
                <button
                  onClick={() => executeSearch('My student portal login isn\'t working')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 text-slate-700 hover:text-[#0D5C46] hover:border-emerald-300 shadow-2xs transition-all cursor-pointer text-left"
                >
                  My student portal login isn't working
                </button>
                <button
                  onClick={() => executeSearch('I paid my fee but the payment is still showing as pending')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 text-slate-700 hover:text-[#0D5C46] hover:border-emerald-300 shadow-2xs transition-all cursor-pointer text-left"
                >
                  Fee paid but still showing pending
                </button>
                <button
                  onClick={() => executeSearch('What is my schedule?')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 text-slate-700 hover:text-[#0D5C46] hover:border-emerald-300 shadow-2xs transition-all cursor-pointer text-left"
                >
                  What is my schedule?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        {conversation.map((turn) => {
          const res = turn.response;
          const conf = getConfidenceDetails(res.confidence, res.department);

          return (
            <div key={turn.id} className="space-y-4 max-w-3xl mx-auto">
              {/* Student Query Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#0D5C46] text-white p-3.5 px-4.5 shadow-xs">
                  <p className="text-xs md:text-sm font-medium leading-relaxed">{turn.query}</p>
                  <span className="text-[10px] text-emerald-200/80 mt-1 block text-right">
                    {turn.timestamp}
                  </span>
                </div>
              </div>

              {/* UniDesk Response Container */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#EBF5F0] border border-[#CDE5DB] text-[#0D5C46] flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-3">
                  {/* 1. Confidence & Understanding Header */}
                  <div className={`p-4 rounded-xl border ${conf.containerStyle} bg-white shadow-2xs`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          UniDesk Understanding
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <h4 className="text-sm font-bold text-[#0D3B2E]">{res.intent}</h4>
                          <span className="text-slate-300">·</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {res.department} Department
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-bold font-mono rounded-lg border ${conf.badgeStyle}`}>
                          {res.confidence}% · {conf.label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${conf.barColor}`}
                          style={{ width: `${res.confidence}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 font-medium">
                      {conf.explanation}
                    </p>
                  </div>

                  {/* 2. Structured Response Card (Section 12 of requirements) */}
                  <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft">
                    {/* Header */}
                    <div className="px-5 py-3 bg-[#F5FAF7] border-b border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                          {res.structuredCard?.departmentBadge || `${res.department} Department`}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Verified Registry Lookup
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      {res.structuredCard?.title && (
                        <h3 className="text-base font-bold text-[#0D3B2E]">
                          {res.structuredCard.title}
                        </h3>
                      )}

                      {res.directAnswer && (
                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                          {res.directAnswer}
                        </p>
                      )}

                      {/* Primary details grid for structured cards (e.g. Exam Date, Time, Room) */}
                      {res.structuredCard?.primaryDetails && !res.multiTopicCards && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {res.structuredCard.primaryDetails.map((detail, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#FAFBFB] border border-slate-150 flex items-center justify-between text-xs"
                            >
                              <span className="text-slate-500 font-medium">{detail.label}</span>
                              <span className="font-semibold text-slate-900 font-mono text-right">
                                {detail.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Multi-topic breakdown if applicable */}
                      {res.multiTopicCards && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {res.multiTopicCards.map((topic, i) => (
                            <div
                              key={i}
                              className="p-3.5 rounded-xl border border-slate-200 bg-[#FAFBFB] flex flex-col justify-between"
                            >
                              <div>
                                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                  {topic.department} · {topic.topic}
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed">
                                  {topic.content}
                                </p>
                              </div>
                              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-baseline justify-between text-xs">
                                <span className="text-slate-500">{topic.detail.label}:</span>
                                <span className="font-semibold text-slate-900 font-mono">
                                  {topic.detail.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Medium-confidence Clarification Flow (40% - 75%) */}
                      {res.confidence >= 40 && res.confidence < 75 && res.clarification && (
                        <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2">
                            <AlertCircle className="w-4 h-4 text-amber-700" />
                            <span>Clarification Required</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            {res.clarification.question}
                          </p>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {res.clarification.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleClarificationClick(opt.query)}
                                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#0D5C46] hover:bg-[#F2F8F5] text-left flex items-center justify-between group transition-colors cursor-pointer"
                              >
                                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0D5C46]">
                                  {opt.label}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D5C46]" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Link (e.g. View Exam Schedule ->) */}
                      {res.structuredCard?.actionRoute && !res.offersSupportOptions && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                          <button
                            onClick={() => setCurrentPath(res.structuredCard!.actionRoute!)}
                            className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>{res.structuredCard.actionLabel || 'View Details'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. TWO CLEAR SUPPORT OPTIONS (Human Support | Raise a Ticket) */}
                  {res.offersSupportOptions && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#F0F8F4] to-[#F5FAF8] border border-[#CDE5DB] shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-bold text-[#0D3B2E]">
                            Need Further Departmental Assistance?
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            You can directly reach out to the {res.supportDepartment || res.department} Department or raise an official request.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenHumanSupport(turn.id, res.supportDepartment || res.department)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Headphones className="w-3.5 h-3.5 text-slate-500" />
                            <span>Human Support</span>
                          </button>

                          <button
                            onClick={() => handleOpenRaiseTicketModal(turn)}
                            className="px-3.5 py-1.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <TicketIcon className="w-3.5 h-3.5" />
                            <span>Raise a Ticket</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. HUMAN SUPPORT CONTACT CARD (In thread) */}
                  {turn.selectedContact && (
                    <div className="p-4 rounded-xl bg-white border border-emerald-300 shadow-sm relative animate-in fade-in duration-150">
                      <button
                        onClick={() => handleCloseHumanSupport(turn.id)}
                        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <Headphones className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {turn.selectedContact.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Direct Department Support · No Ticket Generated
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <div className="truncate">
                            <span className="text-slate-400 block text-[9px]">Email</span>
                            <a href={`mailto:${turn.selectedContact.email}`} className="font-semibold text-slate-800 hover:underline truncate">
                              {turn.selectedContact.email}
                            </a>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-slate-400 block text-[9px]">Helpline</span>
                            <span className="font-semibold font-mono text-slate-800">
                              {turn.selectedContact.phone}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-slate-400 block text-[9px]">Office Location</span>
                            <span className="font-semibold text-slate-800">
                              {turn.selectedContact.office}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-slate-400 block text-[9px]">Hours</span>
                            <span className="font-semibold text-slate-800">
                              {turn.selectedContact.supportHours}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. TICKET SUCCESS CARD (In thread) */}
                  {turn.approvedTicket && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                      <div className="flex items-center gap-2.5 text-emerald-950 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <h5 className="font-bold text-xs text-[#0D3B2E]">Ticket Approved & Raised</h5>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Routed to <strong>{turn.approvedTicket.department} Department</strong>.
                            Ticket ID: <strong className="font-mono text-slate-900">{turn.approvedTicket.ticketNo}</strong> · Status: <strong className="text-emerald-800">Pending</strong>.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentPath('/tickets')}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-800 font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        View in My Tickets →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center max-w-3xl mx-auto py-2 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-lg bg-[#EBF5F0] border border-[#CDE5DB] text-[#0D5C46] flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-[#0D5C46] border-t-transparent rounded-full animate-spin" />
            </div>
            <span>UniDesk is searching university registries...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 11. BOTTOM DOCKED BAR */}
      <div className="p-4 md:px-6 md:py-4 border-t border-[#E2ECE7] bg-white shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-[#0D5C46]" />
            </div>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about exams, fees, timetable, IT or campus services..."
              className="w-full pl-11 pr-28 py-3.5 bg-[#FAFBFB] border border-[#CBDDD4] rounded-xl text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] shadow-2xs transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Searching...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* RAISE A TICKET REVIEW & APPROVAL MODAL */}
      {isTicketModalOpen && (
        <Modal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          title="Review Your Ticket"
          subtitle={`Please review the information before submitting this request to the ${ticketDepartment} department.`}
          maxWidth="lg"
        >
          <form onSubmit={handleApproveTicket} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F0F8F4] border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[11px] block">Target Department:</span>
                <span className="text-sm font-bold text-[#0D3B2E]">
                  {ticketDepartment === 'Finance' && 'Finance & Accounts Office'}
                  {ticketDepartment === 'IT' && 'IT Infrastructure & Digital Support'}
                  {ticketDepartment === 'Academic' && 'Academic Affairs & Registrar Office'}
                  {ticketDepartment === 'General' && 'Central Student Help Desk'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs">
                {ticketDepartment} Only
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Student</span>
                <span className="font-semibold text-slate-800">{currentUser?.name || 'Mahi Patel'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Enrollment Number</span>
                <span className="font-semibold font-mono text-slate-800">{currentUser?.enrollmentNo || '2024-CS-042'}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              >
                {ticketDepartment === 'Finance' && (
                  <>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Fee Reconciliation">Fee Reconciliation</option>
                    <option value="Fee Receipt Request">Fee Receipt Request</option>
                    <option value="Scholarship Adjustment">Scholarship Adjustment</option>
                  </>
                )}
                {ticketDepartment === 'IT' && (
                  <>
                    <option value="Account & Authentication">Account & Authentication</option>
                    <option value="Network Connectivity">Network Connectivity</option>
                    <option value="Hardware / Port Issue">Hardware / Port Issue</option>
                    <option value="Software License">Software License</option>
                  </>
                )}
                {ticketDepartment === 'Academic' && (
                  <>
                    <option value="Exam Clash">Exam Clash</option>
                    <option value="Timetable Conflict">Timetable Conflict</option>
                    <option value="Transcript Request">Transcript Request</option>
                    <option value="Course Registration">Course Registration</option>
                  </>
                )}
                {ticketDepartment === 'General' && (
                  <>
                    <option value="General Support Helpdesk">General Support Helpdesk</option>
                    <option value="Campus Facility">Campus Facility</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of issue"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Detailed description of the issue..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Attachments (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ticketAttachment}
                  onChange={(e) => setTicketAttachment(e.target.value)}
                  placeholder="e.g. Bank UTR screenshot.png or ErrorLog.txt"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
                <Paperclip className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Your ticket will enter the <strong className="text-slate-800">Pending</strong> queue of the {ticketDepartment} Department upon approval.
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Raise Ticket</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
