import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  deleteTicket: (id: string) => void;
  
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
  deleteStudent: (id: string) => void;

  // In-app data refresh action
  refreshData: () => void;
  isRefreshing: boolean;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  tickets: 'unidesk_shared_tickets',
  routing: 'unidesk_shared_routing',
  timetable: 'unidesk_shared_timetable',
  exams: 'unidesk_shared_exams',
  notices: 'unidesk_shared_notices',
  fees: 'unidesk_shared_fees',
  students: 'unidesk_shared_students',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => loadFromStorage(STORAGE_KEYS.tickets, INITIAL_TICKETS));
  const [routingRecords, setRoutingRecords] = useState<IntentRoutingRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.routing, INITIAL_ROUTING_RECORDS)
  );
  const [timetable, setTimetable] = useState<TimetableClass[]>(() =>
    loadFromStorage(STORAGE_KEYS.timetable, INITIAL_TIMETABLE)
  );
  const [exams, setExams] = useState<ExamRecord[]>(() => loadFromStorage(STORAGE_KEYS.exams, INITIAL_EXAMS));
  const [notices, setNotices] = useState<Notice[]>(() => loadFromStorage(STORAGE_KEYS.notices, INITIAL_NOTICES));
  const [fees, setFees] = useState<StudentFeeRecord[]>(() => loadFromStorage(STORAGE_KEYS.fees, INITIAL_FEES));
  const [students, setStudents] = useState<StudentInfoRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.students, INITIAL_STUDENTS)
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.tickets, tickets);
  }, [tickets]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.routing, routingRecords);
  }, [routingRecords]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.timetable, timetable);
  }, [timetable]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.exams, exams);
  }, [exams]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.notices, notices);
  }, [notices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.fees, fees);
  }, [fees]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.students, students);
  }, [students]);

  // 4 & 22. In-app refresh button action
  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    // Reload state from storage
    setTickets(loadFromStorage(STORAGE_KEYS.tickets, INITIAL_TICKETS));
    setRoutingRecords(loadFromStorage(STORAGE_KEYS.routing, INITIAL_ROUTING_RECORDS));
    setTimetable(loadFromStorage(STORAGE_KEYS.timetable, INITIAL_TIMETABLE));
    setExams(loadFromStorage(STORAGE_KEYS.exams, INITIAL_EXAMS));
    setNotices(loadFromStorage(STORAGE_KEYS.notices, INITIAL_NOTICES));
    setFees(loadFromStorage(STORAGE_KEYS.fees, INITIAL_FEES));
    setStudents(loadFromStorage(STORAGE_KEYS.students, INITIAL_STUDENTS));

    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage('Data updated');
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }, 600);
  }, []);

  // Student update action (shared across admin and student views)
  const updateStudent = (id: string, updates: Partial<StudentInfoRecord>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          // If name or department changed, also keep fee record in sync
          if (updates.name || updates.department || updates.enrollmentNo) {
            setFees((prevFees) =>
              prevFees.map((f) =>
                f.enrollmentNo === s.enrollmentNo || f.studentId === s.id
                  ? {
                      ...f,
                      studentName: updates.name || f.studentName,
                      department: updates.department || f.department,
                      enrollmentNo: updates.enrollmentNo || f.enrollmentNo,
                    }
                  : f
              )
            );
          }
          return updated;
        }
        return s;
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Ticket actions
  const addTicket = (data: Omit<Ticket, 'id' | 'ticketNo' | 'createdDate' | 'updatedDate' | 'activities'>): Ticket => {
    const nextNum = 1000 + tickets.length + 1;
    const ticketNo = `UD-${nextNum}`;
    const newTicket: Ticket = {
      ...data,
      id: `t-${nextNum}`,
      ticketNo,
      createdDate: '06 Oct 2026',
      updatedDate: '06 Oct 2026',
      activities: [
        {
          id: `act-${Date.now()}`,
          author: data.raisedBy,
          role: 'Student',
          action: 'Ticket Created',
          note: data.description,
          timestamp: '06 Oct 2026, 12:00',
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
            timestamp: '06 Oct 2026, 12:30',
          };
          return {
            ...t,
            status,
            updatedDate: '06 Oct 2026',
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
            updatedDate: '06 Oct 2026',
            activities: [
              ...t.activities,
              {
                id: `act-${Date.now()}`,
                author: 'System',
                role: 'Assignment Engine',
                action: `Assigned to ${assignee}`,
                timestamp: '06 Oct 2026, 12:35',
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  // Routing record actions
  const addRoutingRecord = (record: Omit<IntentRoutingRecord, 'id' | 'timestamp'>) => {
    const newRecord: IntentRoutingRecord = {
      ...record,
      id: `rt-${Date.now()}`,
      timestamp: '06 Oct 2026, Just now',
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
      publishDate: '06 Oct 2026',
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
            lastPaymentDate: '06 Oct 2026',
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
        deleteTicket,
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

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
