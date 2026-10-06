import { AskUniDeskResponse, Department, DepartmentContact } from '../types';

export const DEPARTMENT_CONTACTS: Record<Department, DepartmentContact> = {
  Finance: {
    department: 'Finance',
    title: 'Finance & Accounts Office',
    email: 'finance.support@university.edu',
    phone: '+91 98765 77665',
    office: 'Finance Office — Administration Block, Ground Floor',
    supportHours: 'Monday–Friday, 9:00 AM–5:00 PM',
  },
  IT: {
    department: 'IT',
    title: 'IT Help Desk & Digital Infrastructure',
    email: 'it.support@university.edu',
    phone: '+91 98765 88990',
    office: 'IT Help Desk — Academic Block 3, Room 102',
    supportHours: 'Monday–Friday, 9:00 AM–5:00 PM',
  },
  Academic: {
    department: 'Academic',
    title: 'Office of Academic Affairs & Registrar',
    email: 'academic.support@university.edu',
    phone: '+91 98765 33441',
    office: 'Office of the Registrar — Administrative Block A, Room 201',
    supportHours: 'Monday–Friday, 9:00 AM–5:00 PM',
  },
  General: {
    department: 'General',
    title: 'Central Student Helpdesk & Support Desk',
    email: 'student.helpdesk@university.edu',
    phone: '+91 98765 00000',
    office: 'Student Central Desk — Student Activity Center, Ground Floor',
    supportHours: 'Monday–Friday, 9:00 AM–5:00 PM',
  },
};

/**
 * Intelligent UniDesk Query Processing Service
 * Provides direct informational answers for catalog queries.
 * When an issue/discrepancy is detected where departmental assistance may be useful,
 * offers two distinct choices:
 * 1) Human Support (official direct department contacts - does NOT create ticket)
 * 2) Raise a Ticket (opens prefilled ticket modal for explicit student approval)
 */
export async function askUniDesk(query: string): Promise<AskUniDeskResponse> {
  // Simulate natural brief latency (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const normalized = query.toLowerCase().trim();

  // 1. Fee Issue Queries (Strictly Finance): Payment not updated, payment deducted, failed payment
  if (
    normalized.includes('not updated') ||
    normalized.includes('still showing as pending') ||
    normalized.includes('deducted') ||
    normalized.includes('payment failed') ||
    normalized.includes('failed payment') ||
    (normalized.includes('fee') && (normalized.includes('issue') || normalized.includes('problem') || normalized.includes('error') || normalized.includes('receipt')))
  ) {
    return {
      query,
      intent: 'Payment Issue & Reconciliation',
      department: 'Finance',
      confidence: 91,
      routing: 'auto',
      routingLabel: 'Auto Routed (Finance)',
      directAnswer:
        'We checked your fee record for Semester 5. If your bank account or card was debited, automated NEFT and payment gateway batch reconciliations normally take 24–48 hours to update on the student ledger. If your payment still does not reflect, you may contact the Finance Office directly or raise a ticket.',
      structuredCard: {
        type: 'fee',
        title: 'Fee Payment Reconciliation Status',
        departmentBadge: 'Finance • Accounts Office',
        primaryDetails: [
          { label: 'Student Balance', value: '₹12,000 Pending' },
          { label: 'Gateway Settlement Window', value: '24–48 Hours' },
          { label: 'Reconciliation Policy', value: 'UTR Verification Required' },
          { label: 'Bursar Office', value: 'Finance Wing, Ground Floor' },
        ],
      },
      offersSupportOptions: true,
      supportDepartment: 'Finance',
      suggestedTicket: {
        department: 'Finance',
        category: 'Payment Issue',
        subject: 'Fee payment status not updated',
        description: query,
      },
      departmentContact: DEPARTMENT_CONTACTS.Finance,
    };
  }

  // 2. IT Issues: Portal login error, authentication loop, Wi-Fi connectivity problems
  if (
    normalized.includes('login') ||
    normalized.includes('portal') ||
    normalized.includes('wifi') ||
    normalized.includes('wi-fi') ||
    normalized.includes('internet') ||
    normalized.includes('network') ||
    normalized.includes('password') ||
    (normalized.includes('it') && (normalized.includes('issue') || normalized.includes('problem')))
  ) {
    const isLogin = normalized.includes('login') || normalized.includes('portal') || normalized.includes('password');

    return {
      query,
      intent: isLogin ? 'Account & Authentication Support' : 'Network Infrastructure Support',
      department: 'IT',
      confidence: 93,
      routing: 'auto',
      routingLabel: 'Auto Routed (IT)',
      directAnswer: isLogin
        ? 'University Single Sign-On (SSO) is operational. If you are encountering HTTP 403 or Session Mismatch errors, please clear your browser cache or try an incognito window. If the authentication issue persists, IT Support can assist you directly or you can raise a ticket.'
        : 'Central IT infrastructure advisory: Core distribution switches are operational with routine maintenance windows. If your device cannot connect or keeps dropping connection, you can consult IT Support directly or submit a support ticket.',
      structuredCard: {
        type: 'it',
        title: isLogin ? 'Portal SSO Authentication' : 'Campus Wi-Fi & Network',
        departmentBadge: 'IT Infrastructure • Digital Services',
        primaryDetails: [
          { label: 'Service Health', value: 'SSO & LDAP Operational' },
          { label: 'Recommended Action', value: 'Clear Cache / Verify SSO Token' },
          { label: 'Support Desk', value: 'Academic Block 3, Room 102' },
        ],
      },
      offersSupportOptions: true,
      supportDepartment: 'IT',
      suggestedTicket: {
        department: 'IT',
        category: isLogin ? 'Account & Authentication' : 'Network Connectivity',
        subject: isLogin ? 'Student portal login error' : 'Campus Wi-Fi connectivity issue',
        description: query,
      },
      departmentContact: DEPARTMENT_CONTACTS.IT,
    };
  }

  // 3. Academic Clash or Exam Appeals
  if (
    normalized.includes('clash') ||
    normalized.includes('overlap') ||
    (normalized.includes('exam') && (normalized.includes('issue') || normalized.includes('appeal') || normalized.includes('change')))
  ) {
    return {
      query,
      intent: 'Exam Schedule Clash / Academic Appeal',
      department: 'Academic',
      confidence: 89,
      routing: 'auto',
      routingLabel: 'Auto Routed (Academic)',
      directAnswer:
        'The Academic Affairs Office manages examination schedules and resolves course clashes. If two of your enrolled courses have overlapping assessment slots, please contact the Office of Academic Affairs directly or submit an appeal ticket for slot reallocation.',
      structuredCard: {
        type: 'exam',
        title: 'Academic Clash Resolution',
        departmentBadge: 'Academic Affairs • Registrar',
        primaryDetails: [
          { label: 'Policy Clause', value: 'Regulation 4.2: Clash Reallocation' },
          { label: 'Office Venue', value: 'Block A, Room 201' },
          { label: 'Resolution Timeline', value: 'Within 2 Working Days' },
        ],
      },
      offersSupportOptions: true,
      supportDepartment: 'Academic',
      suggestedTicket: {
        department: 'Academic',
        category: 'Exam Clash',
        subject: 'Examination schedule clash appeal',
        description: query,
      },
      departmentContact: DEPARTMENT_CONTACTS.Academic,
    };
  }

  // 4. Multi-topic check: Fees + Exam / Schedule (Informational)
  if (
    (normalized.includes('fee') || normalized.includes('dues') || normalized.includes('balance')) &&
    (normalized.includes('exam') || normalized.includes('test') || normalized.includes('schedule'))
  ) {
    return {
      query,
      intent: 'Compound Intent (Finance + Academic)',
      department: 'Finance',
      confidence: 88,
      routing: 'auto',
      routingLabel: 'Auto Routed (Multi-Topic)',
      directAnswer: 'UniDesk processed your request across both University Finance and Academic Affairs registers.',
      multiTopicCards: [
        {
          topic: 'Tuition & Fee Status',
          department: 'Finance',
          content: 'Outstanding tuition balance of ₹12,000 for Semester 5. Due on 15 October 2026.',
          detail: { label: 'Pending Balance', value: '₹12,000' },
        },
        {
          topic: 'Next Upcoming Examination',
          department: 'Academic',
          content: 'Database Systems (CS301) on 14 October 2026, 10:00 AM – 12:00 PM.',
          detail: { label: 'Exam Venue', value: 'Room A-204' },
        },
      ],
      structuredCard: {
        type: 'multi',
        title: 'Multi-Department Resolution',
        departmentBadge: 'Finance & Academic Affairs',
        primaryDetails: [
          { label: 'Pending Fee Balance', value: '₹12,000' },
          { label: 'Next Exam', value: 'Database Systems (14 Oct, 10:00 AM)' },
          { label: 'Exam Hall', value: 'Room A-204' },
        ],
        actionLabel: 'View Exam Schedule',
        actionRoute: '/exams',
      },
      offersSupportOptions: false,
    };
  }

  // 5. Specific Exam inquiry (Informational)
  if (
    normalized.includes('dbms') ||
    normalized.includes('database') ||
    (normalized.includes('exam') && (normalized.includes('when') || normalized.includes('date') || normalized.includes('next') || normalized.includes('time')))
  ) {
    return {
      query,
      intent: 'Exam Schedule',
      department: 'Academic',
      confidence: 92,
      routing: 'auto',
      routingLabel: 'Auto Routed (Academic)',
      directAnswer: 'Your Database Systems (CS301) exam is scheduled on 14 October 2026 at 10:00 AM in Room A-204.',
      structuredCard: {
        type: 'exam',
        title: 'Database Systems (CS301)',
        departmentBadge: 'Academic • Exam Schedule',
        primaryDetails: [
          { label: 'Date', value: '14 October 2026 (Wednesday)' },
          { label: 'Time', value: '10:00 AM – 12:00 PM' },
          { label: 'Room', value: 'Room A-204' },
          { label: 'Course Code', value: 'CS301 · Semester 5' },
          { label: 'Invigilator', value: 'Prof. R. Sundaram' },
        ],
        actionLabel: 'View Exam Schedule →',
        actionRoute: '/exams',
      },
      offersSupportOptions: false,
    };
  }

  // 6. Ambiguous schedule inquiry (Clarification)
  if (
    normalized === 'what is my schedule?' ||
    normalized === 'what about my schedule?' ||
    normalized === 'schedule' ||
    normalized === 'my schedule' ||
    normalized === 'show schedule' ||
    (normalized.includes('schedule') && !normalized.includes('exam') && !normalized.includes('class') && !normalized.includes('today'))
  ) {
    return {
      query,
      intent: 'Academic Schedule Ambiguity',
      department: 'Academic',
      confidence: 61,
      routing: 'clarification',
      routingLabel: 'Clarification Required',
      directAnswer: 'Are you asking about your exam schedule or your regular class timetable?',
      clarification: {
        question: 'Are you asking about your regular weekly class timetable or your upcoming exam schedule?',
        options: [
          {
            label: 'Weekly Class Timetable',
            query: 'Show my weekly class timetable',
          },
          {
            label: 'Mid-term Exam Schedule',
            query: 'When is my next exam?',
          },
        ],
      },
      offersSupportOptions: false,
    };
  }

  // 7. Timetable inquiry (Informational)
  if (
    normalized.includes('timetable') ||
    normalized.includes('class') ||
    normalized.includes('lecture') ||
    normalized.includes('today')
  ) {
    return {
      query,
      intent: 'Timetable Retrieval',
      department: 'Academic',
      confidence: 89,
      routing: 'auto',
      routingLabel: 'Auto Routed (Academic)',
      directAnswer: 'Here is your academic schedule for today:',
      structuredCard: {
        type: 'timetable',
        title: 'Today’s Academic Sessions',
        departmentBadge: 'Academic • Timetable',
        primaryDetails: [
          { label: '09:00 – 10:00', value: 'Database Systems · Room A-204' },
          { label: '11:00 – 12:00', value: 'Operating Systems · Room B-103' },
          { label: '14:00 – 15:00', value: 'Computer Networks · Room A-301' },
        ],
        actionLabel: 'Open Weekly Calendar →',
        actionRoute: '/timetable',
      },
      offersSupportOptions: false,
    };
  }

  // 8. Fee Inquiry (Informational)
  if (
    normalized.includes('how much') ||
    normalized.includes('what is my pending fee') ||
    normalized.includes('pending fee amount') ||
    normalized.includes('my fee') ||
    normalized.includes('fee balance') ||
    normalized === 'fees'
  ) {
    return {
      query,
      intent: 'Fee Information',
      department: 'Finance',
      confidence: 86,
      routing: 'auto',
      routingLabel: 'Auto Routed (Finance)',
      directAnswer: 'Your current pending fee is ₹12,000 for Semester 5, due by 15 October 2026.',
      structuredCard: {
        type: 'fee',
        title: 'Semester 5 Fee Ledger',
        departmentBadge: 'Finance • Accounts Office',
        primaryDetails: [
          { label: 'Total Tuition & Lab', value: '₹85,000' },
          { label: 'Amount Settled', value: '₹73,000' },
          { label: 'Pending Dues', value: '₹12,000' },
          { label: 'Due Date', value: '15 October 2026' },
          { label: 'Status', value: 'Partially Paid' },
        ],
        actionLabel: 'View Notices & Payment Options →',
        actionRoute: '/notices',
      },
      offersSupportOptions: false,
    };
  }

  // 9. Low confidence (<40%): Human Support / Ticket option
  return {
    query,
    intent: 'Uncataloged Student Query',
    department: 'General',
    confidence: 27,
    routing: 'human_support',
    routingLabel: 'Human Support Required',
    directAnswer:
      "I'm not completely sure which service you need. If your issue requires university staff attention, you can contact student support directly or raise a ticket.",
    offersSupportOptions: true,
    supportDepartment: 'General',
    suggestedTicket: {
      department: 'General',
      category: 'General Support Helpdesk',
      subject: 'Inquiry: ' + (query.length > 40 ? query.substring(0, 40) + '...' : query),
      description: query,
    },
    departmentContact: DEPARTMENT_CONTACTS.General,
  };
}
