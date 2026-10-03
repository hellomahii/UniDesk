import React, { createContext, useContext, useState } from 'react';
import {
  Ticket,
  TimetableClass,
  ExamRecord,
  Notice,
  IntentRoutingRecord,
  StudentFeeRecord,
  StudentInfoRecord,
  TicketStatus,
  Department,
} from '../types';
import {
  INITIAL_TICKETS,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS,
  INITIAL_NOTICES,
  INITIAL_ROUTING_RECORDS,
  INITIAL_FEES,
  INITIAL_STUDENTS,
} from '../data/mockData';

interface DataContextType {
  tickets: Ticket[];
  addTicket: (newTicket: Omit<Ticket, 'id' | 'ticketNo' | 'createdDate' | 'updatedDate' | 'activities'>) => Ticket;
  updateTicketStatus: (ticketId: string, status: TicketStatus, note?: string, authorName?: string, authorRole?: string) => void;
  assignTicket: (ticketId: string, assignee: string) => void;
  
  routingRecords: IntentRoutingRecord[];
  addRoutingRecord: (record: Omit<IntentRoutingRecord, 'id' | 'timestamp'>) => void;

  timetable: TimetableClass[];
  addClass: (cls: Omit<TimetableClass, 'id'>) => void;
  updateClass: (id: string, updates: Partial<TimetableClass>) => void;
  deleteClass: (id: string) => void;

  exams: ExamRecord[];
  addExam: (exam: Omit<ExamRecord, 'id'>) => void;
  updateExam: (id: string, updates: Partial<ExamRecord>) => void;
  deleteExam: (id: string) => void;

  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'publishDate'>) => void;
  updateNotice: (id: string, updates: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  fees: StudentFeeRecord[];
  updateFeeStatus: (id: string, paidAmount: number, status: 'Paid' | 'Partially Paid' | 'Pending') => void;

  students: StudentInfoRecord[];
  updateStudent: (id: string, updates: Partial<StudentInfoRecord>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [routingRecords, setRoutingRecords] = useState<IntentRoutingRecord[]>(INITIAL_ROUTING_RECORDS);
  const [timetable, setTimetable] = useState<TimetableClass[]>(INITIAL_TIMETABLE);
  const [exams, setExams] = useState<ExamRecord[]>(INITIAL_EXAMS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [fees, setFees] = useState<StudentFeeRecord[]>(INITIAL_FEES);
  const [students, setStudents] = useState<StudentInfoRecord[]>(INITIAL_STUDENTS);

  // Student update action
  const updateStudent = (id: string, updates: Partial<StudentInfoRecord>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Ticket actions
  const addTicket = (data: Omit<Ticket, 'id' | 'ticketNo' | 'createdDate' | 'updatedDate' | 'activities'>): Ticket => {
    const nextNum = 1000 + tickets.length + 1;
    const ticketNo = `UD-${nextNum}`;
    const newTicket: Ticket = {
      ...data,
      id: `t-${nextNum}`,
      ticketNo,
      createdDate: '30 Sep 2026',
      updatedDate: '30 Sep 2026',
      activities: [
        {
          id: `act-${Date.now()}`,
          author: data.raisedBy,
          role: 'Student',
          action: 'Ticket Created',
          note: data.description,
          timestamp: '30 Sep 2026, 12:00',
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (
    ticketId: string,
    status: TicketStatus,
    note?: string,
    authorName = 'Admin',
    authorRole = 'Staff'
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newActivity = {
            id: `act-${Date.now()}`,
            author: authorName,
            role: authorRole,
            action: `Status changed to ${status}`,
            note: note || undefined,
            timestamp: '30 Sep 2026, 12:30',
          };
          return {
            ...t,
            status,
            updatedDate: '30 Sep 2026',
            activities: [...t.activities, newActivity],
          };
        }
        return t;
      })
    );
  };

  const assignTicket = (ticketId: string, assignee: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            assignedTo: assignee,
            updatedDate: '30 Sep 2026',
            activities: [
              ...t.activities,
              {
                id: `act-${Date.now()}`,
                author: 'System',
                role: 'Assignment Engine',
                action: `Assigned to ${assignee}`,
                timestamp: '30 Sep 2026, 12:35',
              },
            ],
          };
        }
        return t;
      })
    );
  };

  // Routing record actions
  const addRoutingRecord = (record: Omit<IntentRoutingRecord, 'id' | 'timestamp'>) => {
    const newRecord: IntentRoutingRecord = {
      ...record,
      id: `rt-${Date.now()}`,
      timestamp: '30 Sep 2026, Just now',
    };
    setRoutingRecords((prev) => [newRecord, ...prev]);
  };

  // Timetable actions
  const addClass = (cls: Omit<TimetableClass, 'id'>) => {
    const newClass: TimetableClass = {
      ...cls,
      id: `cls-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<TimetableClass>) => {
    setTimetable((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteClass = (id: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== id));
  };

  // Exam actions
  const addExam = (exam: Omit<ExamRecord, 'id'>) => {
    const newExam: ExamRecord = {
      ...exam,
      id: `ex-${Date.now()}`,
    };
    setExams((prev) => [...prev, newExam]);
  };

  const updateExam = (id: string, updates: Partial<ExamRecord>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  // Notice actions
  const addNotice = (notice: Omit<Notice, 'id' | 'publishDate'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      publishDate: '30 Sep 2026',
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const updateNotice = (id: string, updates: Partial<Notice>) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Fee actions
  const updateFeeStatus = (id: string, paidAmount: number, status: 'Paid' | 'Partially Paid' | 'Pending') => {
    setFees((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const newPending = Math.max(0, f.totalFee - paidAmount);
          return {
            ...f,
            paid: paidAmount,
            pending: newPending,
            paymentStatus: status,
            lastPaymentDate: '30 Sep 2026',
            transactionRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-UNI`,
          };
        }
        return f;
      })
    );
  };

  return (
    <DataContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        assignTicket,
        routingRecords,
        addRoutingRecord,
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
        students,
        updateStudent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
