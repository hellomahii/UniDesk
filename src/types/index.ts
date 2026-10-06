export type UserRole = 'student' | 'it_admin' | 'finance_admin' | 'academic_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNo?: string;
  employeeId?: string;
  department: string;
  subDepartment?: string;
  specialization?: string;
  year?: string;
  semester?: string;
  batch?: string;
  phone?: string;
  parentName?: string;
  parentContact?: string;
  accommodation?: string;
  avatar?: string;
  adminTitle?: string;
}

export type TicketStatus = 'Pending' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Department = 'IT' | 'Finance' | 'Academic' | 'General';

export interface TicketActivity {
  id: string;
  author: string;
  role: string;
  action: string;
  note?: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNo: string;
  studentId: string;
  raisedBy: string;
  studentEmail: string;
  studentEnrollment: string;
  subject: string;
  category: string;
  department: Department;
  assignedTo: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdDate: string;
  updatedDate: string;
  description: string;
  activities: TicketActivity[];
}

export type RoutingDecision = 'auto' | 'clarification' | 'human_support';

export interface IntentRoutingRecord {
  id: string;
  request: string;
  detectedIntent: string;
  department: Department;
  confidence: number; // 0 - 100
  routing: RoutingDecision;
  routingLabel: string;
  responseSource: string;
  timestamp: string;
  explanation?: string;
  clarificationQuestion?: string;
  multiTopics?: {
    intent: string;
    department: Department;
    detail: string;
  }[];
}

export interface TimetableClass {
  id: string;
  subject: string;
  courseCode: string;
  faculty: string;
  room: string;
  date?: string; // e.g. "14 October 2026"
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // "09:00" or "09:00 AM"
  endTime: string;   // "10:00" or "10:00 AM"
  year?: string;     // e.g. "2nd Year"
  batch: string;     // e.g. "2025–2029"
  department: string;// e.g. "Computer Science"
  subDepartment?: string; // e.g. "CSE"
  section: string;   // e.g. "A"
  color?: string;
}

export interface ExamRecord {
  id: string;
  subject: string;
  courseCode: string;
  examDate: string; // "2026-10-14"
  formattedDate: string; // "14 October 2026"
  day: string; // "Wednesday"
  startTime?: string; // "10:00 AM"
  endTime?: string;   // "12:00 PM"
  time: string; // "10:00 AM – 12:00 PM"
  room: string;
  year?: string; // "2nd Year"
  batch: string; // "2025–2029"
  department: string; // "Computer Science"
  subDepartment?: string; // "CSE"
  section?: string; // "A"
  semester: string; // "Semester 3" or "3rd Semester"
  invigilator?: string;
  status: 'Scheduled' | 'Completed' | 'Postponed';
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Maintenance' | 'Administration' | 'Finance' | 'Examinations';
  description: string;
  content: string;
  audience: 'All Students' | 'Engineering' | 'Final Year' | 'Faculty' | 'Undergraduate';
  department: Department;
  publishDate: string;
  expiryDate: string;
  status: 'Published' | 'Draft' | 'Scheduled' | 'Archived';
  author: string;
}

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  department: string;
  semester: string;
  batch: string;
  totalFee: number;
  paid: number;
  pending: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Pending';
  dueDate: string;
  lastPaymentDate?: string;
  transactionRef?: string;
}

export interface StudentInfoRecord {
  id: string;
  enrollmentNo: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subDepartment: string;
  specialization: string;
  year: string;
  semester: string;
  batch: string;
  accommodation: string;
  parentName: string;
  parentContact: string;
  admissionDate: string;
  status: 'Active' | 'On Leave' | 'Graduated';
}

export interface DepartmentContact {
  department: Department;
  title: string;
  email: string;
  phone: string;
  office: string;
  supportHours: string;
}

export interface AskUniDeskResponse {
  query: string;
  intent: string;
  department: Department;
  confidence: number;
  routing: RoutingDecision;
  routingLabel: string;
  directAnswer?: string;
  structuredCard?: {
    type: 'exam' | 'timetable' | 'fee' | 'it' | 'multi' | 'issue';
    title: string;
    primaryDetails: { label: string; value: string }[];
    departmentBadge: string;
    actionLabel?: string;
    actionRoute?: string;
  };
  clarification?: {
    question: string;
    options: { label: string; query: string }[];
  };
  humanSupport?: {
    message: string;
    suggestedDepartment: Department;
    actionPrompt: string;
  };
  multiTopicCards?: {
    topic: string;
    department: Department;
    content: string;
    detail: { label: string; value: string };
  }[];
  offersSupportOptions?: boolean;
  supportDepartment?: Department;
  suggestedTicket?: {
    category: string;
    subject: string;
    description: string;
    department: Department;
  };
  departmentContact?: DepartmentContact;
}
