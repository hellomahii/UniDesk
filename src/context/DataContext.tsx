import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Ticket,
  TimetableClass,
  ExamRecord,
  Notice,
  IntentRoutingRecord,
  StudentFeeRecord,
  StudentInfoRecord,
  TicketStatus,
} from '../types';

const API = 'http://127.0.0.1:8000';

interface DataContextType {
  // =========================================================
  // USERS
  // =========================================================

  users: any[];

  addUser: (user: any) => Promise<void>;
  updateUser: (id: string, user: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // =========================================================
  // TICKETS
  // =========================================================

  tickets: Ticket[];

  addTicket: (
    newTicket: Omit<
      Ticket,
      'id' | 'ticketNo' | 'createdDate' | 'updatedDate' | 'activities'
    >
  ) => Ticket;

  updateTicketStatus: (
    ticketId: string,
    status: TicketStatus,
    note?: string,
    authorName?: string,
    authorRole?: string
  ) => void;

  assignTicket: (
    ticketId: string,
    assignee: string
  ) => void;

  deleteTicket: (id: string) => void;

  // =========================================================
  // ROUTING
  // =========================================================

  routingRecords: IntentRoutingRecord[];

  addRoutingRecord: (
    record: Omit<IntentRoutingRecord, 'id' | 'timestamp'>
  ) => void;

  updateRoutingRecord: (
    id: string,
    updates: Partial<IntentRoutingRecord>
  ) => void;

  deleteRoutingRecord: (id: string) => void;

  // =========================================================
  // TIMETABLE
  // =========================================================

  timetable: TimetableClass[];

  addClass: (
    cls: Omit<TimetableClass, 'id'>
  ) => void;

  updateClass: (
    id: string,
    updates: Partial<TimetableClass>
  ) => void;

  deleteClass: (id: string) => void;

  // =========================================================
  // EXAMS
  // =========================================================

  exams: ExamRecord[];

  addExam: (
    exam: Omit<ExamRecord, 'id'>
  ) => void;

  updateExam: (
    id: string,
    updates: Partial<ExamRecord>
  ) => void;

  deleteExam: (id: string) => void;

  // =========================================================
  // NOTICES
  // =========================================================

  notices: Notice[];

  addNotice: (
    notice: Omit<Notice, 'id' | 'publishDate'>
  ) => void;

  updateNotice: (
    id: string,
    updates: Partial<Notice>
  ) => void;

  deleteNotice: (id: string) => void;

  // =========================================================
  // FEES
  // =========================================================

  fees: StudentFeeRecord[];

  updateFeeStatus: (
    id: string,
    paidAmount: number,
    status: 'Paid' | 'Partially Paid' | 'Pending'
  ) => void;

  addFee: (fee: any) => Promise<void>;
  updateFee: (id: string, fee: any) => Promise<void>;
  deleteFee: (id: string) => Promise<void>;

  // =========================================================
  // STUDENTS
  // =========================================================

  students: StudentInfoRecord[];

  updateStudent: (
    id: string,
    updates: Partial<StudentInfoRecord>
  ) => void;

  addStudent: (student: any) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // =========================================================
  // GLOBAL REFRESH / TOAST
  // =========================================================

  refreshData: () => void;
  isRefreshing: boolean;

  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // =========================================================
  // USERS
  // =========================================================

  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API}/users`);

      if (!response.ok) {
        throw new Error(
          `Users request failed: ${response.status}`
        );
      }

      const data = await response.json();

      setUsers(data);

      console.log('USERS FROM BACKEND:', data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const addUser = async (user: any) => {
    try {
      const response = await fetch(`${API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: user.user_email ?? user.email,
          password_hash:
            user.password_hash ?? user.password ?? '',
          department: user.department ?? 'general',
          role: user.role ?? 'student',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Failed to add user: ${response.status} ${errorText}`
        );
      }

      await loadUsers();

      console.log('User saved successfully');
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const updateUser = async (
    id: string,
    user: any
  ) => {
    try {
      const response = await fetch(
        `${API}/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email:
              user.user_email ?? user.email,

            password_hash:
              user.password_hash ??
              user.password ??
              '',

            department:
              user.department ?? 'general',

            role:
              user.role ?? 'student',
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Failed to update user: ${response.status} ${errorText}`
        );
      }

      await loadUsers();

      console.log('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `${API}/users/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Failed to delete user: ${response.status} ${errorText}`
        );
      }

      await loadUsers();

      console.log('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // =========================================================
  // TICKETS
  // =========================================================

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadTickets = async () => {
    try {
      const response = await fetch(`${API}/tickets`);

      if (!response.ok) {
        throw new Error(
          `Tickets request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log('TICKETS FROM BACKEND:', data);

      const formattedTickets: Ticket[] =
        data.map((ticket: any) => ({
          id: String(ticket.id),

          ticketNo: ticket.ticket_no,

          studentId: String(
            ticket.student_id ?? ticket.id
          ),

          raisedBy: ticket.raised_by,

          studentEmail: ticket.raised_by,

          studentEnrollment:
            ticket.student_enrollment ??
            ticket.enrollment_number ??
            '',

          subject: ticket.subject,

          category:
            ticket.category === 'network'
              ? 'Network Connectivity'
              : ticket.category ===
                'account_authentication'
              ? 'Account & Authentication'
              : ticket.category ===
                'hardware_port'
              ? 'Hardware & Port'
              : ticket.category ===
                'software_licensing'
              ? 'Software Licensing'
              : ticket.category || 'General',

          department:
            ticket.department === 'it'
              ? 'IT'
              : ticket.department === 'finance'
              ? 'Finance'
              : ticket.department === 'academic'
              ? 'Academic'
              : ticket.department || 'General',

          assignedTo:
            ticket.assigned_to || 'Unassigned',

          status:
            ticket.status === 'open'
              ? 'Pending'
              : ticket.status === 'in_progress'
              ? 'In Progress'
              : ticket.status === 'resolved'
              ? 'Resolved'
              : ticket.status === 'closed'
              ? 'Closed'
              : ticket.status || 'Pending',

          priority:
            ticket.priority || 'Medium',

          createdDate: ticket.created
            ? new Date(
                ticket.created
              ).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : ticket.updated
            ? new Date(
                ticket.updated
              ).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '',

          updatedDate: ticket.updated
            ? new Date(
                ticket.updated
              ).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '',

          description: ticket.note || '',

          activities: [],
        }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error(
        'Failed to load tickets:',
        error
      );
    }
  };

  const addTicket = (
    data: Omit<
      Ticket,
      'id' |
        'ticketNo' |
        'createdDate' |
        'updatedDate' |
        'activities'
    >
  ): Ticket => {
    const newTicket: Ticket = {
      ...data,
      id: '',
      ticketNo: '',
      createdDate: '',
      updatedDate: '',
      activities: [],
    };

    const backendCategory =
      data.category === 'Network Connectivity'
        ? 'network'
        : data.category ===
          'Account & Authentication'
        ? 'account_authentication'
        : data.category ===
          'Hardware & Port'
        ? 'hardware_port'
        : data.category ===
          'Software Licensing'
        ? 'software_licensing'
        : String(
            data.category || 'general'
          ).toLowerCase();

    const backendStatus =
      data.status === 'Pending'
        ? 'open'
        : data.status === 'In Progress'
        ? 'in_progress'
        : data.status === 'Resolved'
        ? 'resolved'
        : data.status === 'Closed'
        ? 'closed'
        : 'open';

    const backendDepartment =
      data.department === 'IT'
        ? 'it'
        : data.department === 'Finance'
        ? 'finance'
        : data.department === 'Academic'
        ? 'academic'
        : 'general';

    fetch(`${API}/tickets`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        ticket_no: `UD-${Date.now()}`,

        raised_by: data.raisedBy,

        subject: data.subject,

        category: backendCategory,

        assigned_to:
          data.assignedTo &&
          data.assignedTo !== 'Unassigned'
            ? data.assignedTo
            : null,

        status: backendStatus,

        note:
          data.description || '',

        department:
          backendDepartment,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to add ticket: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        console.log(
          'Ticket saved successfully'
        );

        loadTickets();
      })
      .catch((error) => {
        console.error(
          'Failed to add ticket:',
          error
        );
      });

    return newTicket;
  };

  const updateTicketStatus = (
    ticketId: string,
    status: TicketStatus,
    note?: string,
    _authorName = 'Admin',
    _authorRole = 'Staff'
  ) => {
    const ticket = tickets.find(
      (t) => t.id === ticketId
    );

    if (!ticket) {
      return;
    }

    const backendStatus =
      status === 'Pending'
        ? 'open'
        : status === 'In Progress'
        ? 'in_progress'
        : status === 'Resolved'
        ? 'resolved'
        : status === 'Closed'
        ? 'closed'
        : 'open';

    const backendCategory =
      ticket.category ===
      'Network Connectivity'
        ? 'network'
        : ticket.category ===
          'Account & Authentication'
        ? 'account_authentication'
        : ticket.category ===
          'Hardware & Port'
        ? 'hardware_port'
        : ticket.category ===
          'Software Licensing'
        ? 'software_licensing'
        : String(
            ticket.category || 'general'
          ).toLowerCase();

    const backendDepartment =
      ticket.department === 'IT'
        ? 'it'
        : ticket.department === 'Finance'
        ? 'finance'
        : ticket.department === 'Academic'
        ? 'academic'
        : 'general';

    fetch(`${API}/tickets/${ticketId}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        ticket_no: ticket.ticketNo,

        raised_by: ticket.raisedBy,

        subject: ticket.subject,

        category: backendCategory,

        assigned_to:
          ticket.assignedTo &&
          ticket.assignedTo !== 'Unassigned'
            ? ticket.assignedTo
            : null,

        status: backendStatus,

        note:
          note ||
          ticket.description ||
          '',

        department:
          backendDepartment,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to update ticket: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        console.log(
          'Ticket status updated successfully'
        );

        loadTickets();
      })
      .catch((error) => {
        console.error(
          'Failed to update ticket:',
          error
        );
      });
  };

  const assignTicket = (
    ticketId: string,
    assignee: string
  ) => {
    const ticket = tickets.find(
      (t) => t.id === ticketId
    );

    if (!ticket) {
      return;
    }

    const backendStatus =
      ticket.status === 'Pending'
        ? 'open'
        : ticket.status === 'In Progress'
        ? 'in_progress'
        : ticket.status === 'Resolved'
        ? 'resolved'
        : ticket.status === 'Closed'
        ? 'closed'
        : 'open';

    const backendCategory =
      ticket.category ===
      'Network Connectivity'
        ? 'network'
        : ticket.category ===
          'Account & Authentication'
        ? 'account_authentication'
        : ticket.category ===
          'Hardware & Port'
        ? 'hardware_port'
        : ticket.category ===
          'Software Licensing'
        ? 'software_licensing'
        : String(
            ticket.category || 'general'
          ).toLowerCase();

    const backendDepartment =
      ticket.department === 'IT'
        ? 'it'
        : ticket.department === 'Finance'
        ? 'finance'
        : ticket.department === 'Academic'
        ? 'academic'
        : 'general';

    fetch(`${API}/tickets/${ticketId}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        ticket_no: ticket.ticketNo,

        raised_by: ticket.raisedBy,

        subject: ticket.subject,

        category: backendCategory,

        assigned_to: assignee,

        status: backendStatus,

        note:
          ticket.description || '',

        department:
          backendDepartment,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to assign ticket: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        console.log(
          'Ticket assigned successfully'
        );

        loadTickets();
      })
      .catch((error) => {
        console.error(
          'Failed to assign ticket:',
          error
        );
      });
  };

  const deleteTicket = (
    id: string
  ) => {
    fetch(`${API}/tickets/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to delete ticket: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        console.log(
          'Ticket deleted successfully'
        );

        loadTickets();
      })
      .catch((error) => {
        console.error(
          'Failed to delete ticket:',
          error
        );
      });
  };

  // =========================================================
  // ROUTING
  // =========================================================

  const [
    routingRecords,
    setRoutingRecords,
  ] = useState<IntentRoutingRecord[]>([]);

  const loadRouting = async () => {
    try {
      const response = await fetch(
        `${API}/routing`
      );

      if (!response.ok) {
        throw new Error(
          `Routing request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const formatted =
        data.map((item: any) => ({
          id: String(item.id),

          studentRequest:
            item.student_request,

          detectedIntent:
            item.detected_intent,

          department:
            item.department,

          routingDecision:
            item.routing_decision,

          timestamp:
            item.timestamp
              ? new Date(
                  item.timestamp
                ).toLocaleString('en-GB')
              : '',
        }));

      setRoutingRecords(formatted);

      console.log(
        'ROUTING FROM BACKEND:',
        formatted
      );
    } catch (error) {
      console.error(
        'Failed to load routing:',
        error
      );
    }
  };

  const addRoutingRecord = (
    record: Omit<
      IntentRoutingRecord,
      'id' | 'timestamp'
    >
  ) => {
    fetch(`${API}/routing`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        student_request:
          (record as any).studentRequest,

        detected_intent:
          (record as any).detectedIntent,

        department:
          (record as any).department,

        routing_decision:
          (record as any).routingDecision,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to add routing record: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        console.log(
          'Routing record saved successfully'
        );

        loadRouting();
      })
      .catch((error) => {
        console.error(
          'Failed to add routing:',
          error
        );
      });
  };

  const updateRoutingRecord = (
    id: string,
    updates: Partial<IntentRoutingRecord>
  ) => {
    const current =
      routingRecords.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const merged = {
      ...current,
      ...updates,
    } as any;

    fetch(`${API}/routing/${id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        student_request:
          merged.studentRequest,

        detected_intent:
          merged.detectedIntent,

        department:
          merged.department,

        routing_decision:
          merged.routingDecision,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to update routing: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadRouting();
      })
      .catch((error) => {
        console.error(
          'Failed to update routing:',
          error
        );
      });
  };

  const deleteRoutingRecord = (
    id: string
  ) => {
    fetch(`${API}/routing/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to delete routing: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadRouting();
      })
      .catch((error) => {
        console.error(
          'Failed to delete routing:',
          error
        );
      });
  };

  // =========================================================
  // TIMETABLE
  // =========================================================

  const [
    timetable,
    setTimetable,
  ] = useState<TimetableClass[]>([]);

  const loadTimetable = async () => {
    try {
      const response = await fetch(
        `${API}/timetables`
      );

      if (!response.ok) {
        throw new Error(
          `Timetable request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const formatted =
        data.map((item: any) => ({
          id: String(item.id),

          year: item.year,

          batch: item.batch,

          department: item.department,

          subDepartment:
            item.sub_department,

          section: item.section,

          day: item.day,

          time: item.time,

          subject: item.subject,

          faculty: item.faculty,

          room: item.room,
        }));

      setTimetable(formatted);
    } catch (error) {
      console.error(
        'Failed to load timetable:',
        error
      );
    }
  };

  const addClass = (
    cls: Omit<TimetableClass, 'id'>
  ) => {
    fetch(`${API}/timetables`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        year: (cls as any).year,
        batch: (cls as any).batch,
        department:
          (cls as any).department,
        sub_department:
          (cls as any).subDepartment,
        section: (cls as any).section,
        day: (cls as any).day,
        time: (cls as any).time,
        subject: (cls as any).subject,
        faculty: (cls as any).faculty,
        room: (cls as any).room,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to add timetable: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadTimetable();
      })
      .catch((error) => {
        console.error(
          'Failed to add timetable:',
          error
        );
      });
  };

  const updateClass = (
    id: string,
    updates: Partial<TimetableClass>
  ) => {
    const current =
      timetable.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const merged = {
      ...current,
      ...updates,
    } as any;

    fetch(`${API}/timetables/${id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        year: merged.year,
        batch: merged.batch,
        department:
          merged.department,
        sub_department:
          merged.subDepartment,
        section: merged.section,
        day: merged.day,
        time: merged.time,
        subject: merged.subject,
        faculty: merged.faculty,
        room: merged.room,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to update timetable: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadTimetable();
      })
      .catch((error) => {
        console.error(
          'Failed to update timetable:',
          error
        );
      });
  };

  const deleteClass = (
    id: string
  ) => {
    fetch(`${API}/timetables/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to delete timetable: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadTimetable();
      })
      .catch((error) => {
        console.error(
          'Failed to delete timetable:',
          error
        );
      });
  };

  // =========================================================
  // EXAMS
  // =========================================================

  const [exams, setExams] =
    useState<ExamRecord[]>([]);

  const loadExams = async () => {
    try {
      const response = await fetch(
        `${API}/exam-schedules`
      );

      if (!response.ok) {
        throw new Error(
          `Exams request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const formatted =
        data.map((item: any) => ({
          id: String(item.id),

          year: item.year,

          batch: item.batch,

          department: item.department,

          subDepartment:
            item.sub_department,

          section: item.section,

          subject: item.subject,

          subjectCode:
            item.subject_code,

          examDate:
            item.exam_date,

          day: item.day,

          timeWindow:
            item.time_window,

          assignedHall:
            item.assigned_hall,

          targetCohort:
            item.target_cohort,

          invigilator:
            item.invigilator,
        }));

      setExams(formatted);
    } catch (error) {
      console.error(
        'Failed to load exams:',
        error
      );
    }
  };

  const addExam = (
    exam: Omit<ExamRecord, 'id'>
  ) => {
    fetch(`${API}/exam-schedules`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        year: (exam as any).year,
        batch: (exam as any).batch,
        department:
          (exam as any).department,
        sub_department:
          (exam as any).subDepartment,
        section: (exam as any).section,
        subject: (exam as any).subject,
        subject_code:
          (exam as any).subjectCode,
        exam_date:
          (exam as any).examDate,
        day: (exam as any).day,
        time_window:
          (exam as any).timeWindow,
        assigned_hall:
          (exam as any).assignedHall,
        target_cohort:
          (exam as any).targetCohort,
        invigilator:
          (exam as any).invigilator,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to add exam: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadExams();
      })
      .catch((error) => {
        console.error(
          'Failed to add exam:',
          error
        );
      });
  };

  const updateExam = (
    id: string,
    updates: Partial<ExamRecord>
  ) => {
    const current =
      exams.find(
        (exam) => exam.id === id
      );

    if (!current) {
      return;
    }

    const merged = {
      ...current,
      ...updates,
    } as any;

    fetch(`${API}/exam-schedules/${id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        year: merged.year,
        batch: merged.batch,
        department:
          merged.department,
        sub_department:
          merged.subDepartment,
        section: merged.section,
        subject: merged.subject,
        subject_code:
          merged.subjectCode,
        exam_date:
          merged.examDate,
        day: merged.day,
        time_window:
          merged.timeWindow,
        assigned_hall:
          merged.assignedHall,
        target_cohort:
          merged.targetCohort,
        invigilator:
          merged.invigilator,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to update exam: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadExams();
      })
      .catch((error) => {
        console.error(
          'Failed to update exam:',
          error
        );
      });
  };

  const deleteExam = (
    id: string
  ) => {
    fetch(`${API}/exam-schedules/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to delete exam: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadExams();
      })
      .catch((error) => {
        console.error(
          'Failed to delete exam:',
          error
        );
      });
  };

  // =========================================================
  // NOTICES
  // =========================================================

  const [notices, setNotices] =
    useState<Notice[]>([]);

  const loadNotices = async () => {
    try {
      const response = await fetch(
        `${API}/notices`
      );

      if (!response.ok) {
        throw new Error(
          `Notices request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const formatted =
        data.map((item: any) => ({
          id: String(item.id),

          title: item.title,

          description:
            item.description,

          category:
            item.category,

          audience:
            item.audience,

          publishDate:
            item.published_date,

          expiryDate:
            item.expiry_date,

          status:
            item.status,

          department:
            item.department,
        }));

      setNotices(formatted);
    } catch (error) {
      console.error(
        'Failed to load notices:',
        error
      );
    }
  };

  const addNotice = (
    notice: Omit<
      Notice,
      'id' | 'publishDate'
    >
  ) => {
    const data = notice as any;

    fetch(`${API}/notices`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title: data.title,

        description:
          data.description,

        category:
          data.category,

        audience:
          data.audience,

        published_date:
          data.publishDate ||
          new Date()
            .toISOString()
            .slice(0, 10),

        expiry_date:
          data.expiryDate,

        status:
          data.status || 'active',

        department:
          data.department || 'general',
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to add notice: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadNotices();
      })
      .catch((error) => {
        console.error(
          'Failed to add notice:',
          error
        );
      });
  };

  const updateNotice = (
    id: string,
    updates: Partial<Notice>
  ) => {
    const current =
      notices.find(
        (notice) => notice.id === id
      );

    if (!current) {
      return;
    }

    const merged = {
      ...current,
      ...updates,
    } as any;

    fetch(`${API}/notices/${id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title:
          merged.title,

        description:
          merged.description,

        category:
          merged.category,

        audience:
          merged.audience,

        published_date:
          merged.publishDate,

        expiry_date:
          merged.expiryDate,

        status:
          merged.status,

        department:
          merged.department,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to update notice: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadNotices();
      })
      .catch((error) => {
        console.error(
          'Failed to update notice:',
          error
        );
      });
  };

  const deleteNotice = (
    id: string
  ) => {
    fetch(`${API}/notices/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to delete notice: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        loadNotices();
      })
      .catch((error) => {
        console.error(
          'Failed to delete notice:',
          error
        );
      });
  };

  // =========================================================
  // FEES
  // =========================================================

  const [fees, setFees] =
    useState<StudentFeeRecord[]>([]);

  const loadFees = async () => {
    try {
      const response = await fetch(
        `${API}/fees`
      );

      if (!response.ok) {
        throw new Error(
          `Fees request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const formatted =
        data.map((item: any) => ({
          id: String(item.id),

          enrollmentNumber:
            item.enrollment_number,

          name: item.name,

          email: item.email,

          phone: item.phone,

          department:
            item.department,

          yearSem:
            item.year_sem,

          batch:
            item.batch,

          accommodation:
            item.accommodation,

          totalFee:
            Number(item.total_fee),

          paid:
            Number(item.paid_amount),

          pending:
            Number(item.pending_dues),

          paymentStatus:
            item.payment_status,

          dueDate:
            item.due_date,

          lastPaymentDate:
            item.last_payment_date || '',

          transactionRef:
            item.transaction_ref || '',
        }));

      setFees(formatted);
    } catch (error) {
      console.error(
        'Failed to load fees:',
        error
      );
    }
  };

  const addFee = async (
    fee: any
  ) => {
    try {
      const response = await fetch(
        `${API}/fees`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            enrollment_number:
              fee.enrollmentNumber,

            name:
              fee.name,

            email:
              fee.email,

            phone:
              fee.phone,

            department:
              fee.department,

            year_sem:
              fee.yearSem,

            batch:
              fee.batch,

            accommodation:
              fee.accommodation,

            total_fee:
              fee.totalFee,

            paid_amount:
              fee.paid ??
              fee.paidAmount ??
              0,

            pending_dues:
              fee.pending ??
              fee.pendingDues ??
              0,

            payment_status:
              fee.paymentStatus,

            due_date:
              fee.dueDate,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Failed to add fee: ${response.status} ${errorText}`
        );
      }

      await loadFees();

      console.log(
        'Fee record saved successfully'
      );
    } catch (error) {
      console.error(
        'Failed to add fee:',
        error
      );
    }
  };

  const updateFee = async (
    id: string,
    fee: any
  ) => {
    try {
      const response = await fetch(
        `${API}/fees/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            enrollment_number:
              fee.enrollmentNumber,

            name:
              fee.name,

            email:
              fee.email,

            phone:
              fee.phone,

            department:
              fee.department,

            year_sem:
              fee.yearSem,

            batch:
              fee.batch,

            accommodation:
              fee.accommodation,

            total_fee:
              fee.totalFee,

            paid_amount:
              fee.paid ??
              fee.paidAmount ??
              0,

            pending_dues:
              fee.pending ??
              fee.pendingDues ??
              0,

            payment_status:
              fee.paymentStatus,

            due_date:
              fee.dueDate,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Failed to update fee: ${response.status} ${errorText}`
        );
      }

      await loadFees();

      console.log(
        'Fee record updated successfully'
      );
    } catch (error) {
      console.error(
        'Failed to update fee:',
        error
      );
    }
  };

  const deleteFee = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `${API}/fees/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Failed to delete fee: ${response.status} ${errorText}`
        );
      }

      await loadFees();
    } catch (error) {
      console.error(
        'Failed to delete fee:',
        error
      );
    }
  };

  const updateFeeStatus = (
    id: string,
    paidAmount: number,
    status:
      | 'Paid'
      | 'Partially Paid'
      | 'Pending'
  ) => {
    const current =
      fees.find(
        (fee) => fee.id === id
      );

    if (!current) {
      return;
    }

    const backendStatus =
      status === 'Paid'
        ? 'paid'
        : status ===
          'Partially Paid'
        ? 'partial'
        : 'pending';

    const updatedFee = {
      ...current,

      paid:
        paidAmount,

      pending: Math.max(
        0,
        Number(
          (current as any).totalFee
        ) - paidAmount
      ),

      paymentStatus:
        backendStatus,
    } as any;

    updateFee(
      id,
      updatedFee
    );
  };

  // =========================================================
  // STUDENTS
  // =========================================================

  const [
    students,
    setStudents,
  ] = useState<StudentInfoRecord[]>([]);

  const loadStudents = async () => {
    try {
      const response = await fetch(
        `${API}/students`
      );

      if (!response.ok) {
        throw new Error(
          `Students request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        'RAW STUDENTS FROM BACKEND:',
        data
      );

      const formatted =
        data.map((item: any) => {
          const enrollment =
            item.enrollment_number ||
            item.enrollmentNumber ||
            item.enrollmentNo ||
            '';

          const yearSem =
            item.year_sem ||
            item.yearSem ||
            '';

          return {
            id: String(item.id),

            enrollmentNumber:
              enrollment,

            enrollmentNo:
              enrollment,

            enrollment_number:
              enrollment,

            name:
              item.name || '',

            email:
              item.email || '',

            phone:
              item.phone || '',

            department:
              item.department || '',

            yearSem:
              yearSem,

            year:
              item.year ||
              yearSem,

            semester:
              item.semester ||
              '',

            batch:
              item.batch || '',

            accommodation:
              item.accommodation || '',
          };
        });

      setStudents(
        formatted as StudentInfoRecord[]
      );

      console.log(
        'FORMATTED STUDENTS:',
        formatted
      );
    } catch (error) {
      console.error(
        'Failed to load students:',
        error
      );
    }
  };

  const addStudent = async (
    student: any
  ) => {
    try {
      const enrollment =
        student.enrollmentNumber ||
        student.enrollmentNo ||
        student.enrollment_number ||
        '';

      const yearSem =
        student.yearSem ||
        student.year ||
        '';

      const response =
        await fetch(
          `${API}/students`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              enrollment_number:
                enrollment,

              name:
                student.name,

              email:
                student.email,

              phone:
                student.phone,

              department:
                student.department,

              year_sem:
                yearSem,

              batch:
                student.batch,

              accommodation:
                student.accommodation,
            }),
          }
        );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          `Failed to add student: ${response.status} ${errorText}`
        );
      }

      await loadStudents();

      console.log(
        'Student saved successfully'
      );
    } catch (error) {
      console.error(
        'Failed to add student:',
        error
      );
    }
  };

  const updateStudent = (
    id: string,
    updates: Partial<StudentInfoRecord>
  ) => {
    const current =
      students.find(
        (student) =>
          String(student.id) ===
          String(id)
      );

    if (!current) {
      console.error(
        'Student not found:',
        id
      );

      return;
    }

    const merged = {
      ...(current as any),
      ...(updates as any),
    } as any;

    const enrollment =
      merged.enrollmentNumber ||
      merged.enrollmentNo ||
      merged.enrollment_number ||
      '';

    const yearSem =
      merged.yearSem ||
      merged.year ||
      '';

    fetch(`${API}/students/${id}`, {
      method: 'PUT',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        enrollment_number:
          enrollment,

        name:
          merged.name,

        email:
          merged.email,

        phone:
          merged.phone,

        department:
          merged.department,

        year_sem:
          yearSem,

        batch:
          merged.batch,

        accommodation:
          merged.accommodation,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to update student: ${response.status} ${errorText}`
          );
        }

        return response.json();
      })
      .then(() => {
        console.log(
          'Student updated successfully'
        );

        loadStudents();
      })
      .catch((error) => {
        console.error(
          'Failed to update student:',
          error
        );
      });
  };

  const deleteStudent =
    async (
      id: string
    ) => {
      try {
        const response =
          await fetch(
            `${API}/students/${id}`,
            {
              method: 'DELETE',
            }
          );

        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Failed to delete student: ${response.status} ${errorText}`
          );
        }

        await loadStudents();
      } catch (error) {
        console.error(
          'Failed to delete student:',
          error
        );
      }
    };

  // =========================================================
  // LOAD EVERYTHING
  // =========================================================

  useEffect(() => {
    loadUsers();
    loadTickets();
    loadRouting();
    loadStudents();
    loadNotices();
    loadFees();
    loadTimetable();
    loadExams();
  }, []);

  // =========================================================
  // REFRESH ALL DATA
  // =========================================================

  const refreshData = () => {
    setIsRefreshing(true);

    Promise.all([
      loadUsers(),
      loadTickets(),
      loadRouting(),
      loadStudents(),
      loadNotices(),
      loadFees(),
      loadTimetable(),
      loadExams(),
    ])
      .then(() => {
        setToastMessage('Data updated');

        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <DataContext.Provider
      value={{
        users,

        addUser,

        updateUser,

        deleteUser,

        tickets,

        addTicket,

        updateTicketStatus,

        assignTicket,

        deleteTicket,

        routingRecords,

        addRoutingRecord,

        updateRoutingRecord,

        deleteRoutingRecord,

        timetable,

        addClass,

        updateClass,

        deleteClass,

        exams,

        addExam,

        updateExam,

        deleteExam,

        notices,

        addNotice,

        updateNotice,

        deleteNotice,

        fees,

        updateFeeStatus,

        addFee,

        updateFee,

        deleteFee,

        students,

        updateStudent,

        addStudent,

        deleteStudent,

        refreshData,

        isRefreshing,

        toastMessage,

        setToastMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// =========================================================
// USE DATA
// =========================================================

export const useData = () => {
  const context =
    useContext(DataContext);

  if (!context) {
    throw new Error(
      'useData must be used within a DataProvider'
    );
  }

  return context;
};