import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  activeRole: UserRole;
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to student Mahi Patel for immediate demonstration, but login view is accessible
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS['mahi.patel@college.edu']);
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');

  const activeRole: UserRole = currentUser?.role || 'student';

  const login = (email: string): boolean => {
    const cleanInput = email.trim().toLowerCase();
    
    // Check known users first by exact email
    if (INITIAL_USERS[cleanInput]) {
      const user = INITIAL_USERS[cleanInput];
      setCurrentUser(user);
      if (user.role === 'student') {
        setCurrentPath('/dashboard');
      } else {
        setCurrentPath('/admin/dashboard');
      }
      return true;
    }

    // Check by enrollment number, employee ID, or email prefix
    const matchedUser = Object.values(INITIAL_USERS).find((u) => {
      const uEmail = u.email.toLowerCase();
      const uEnroll = u.enrollmentNo?.toLowerCase();
      const uEmpId = u.employeeId?.toLowerCase();
      const uPrefix = uEmail.split('@')[0];
      return (
        uEmail === cleanInput ||
        uEnroll === cleanInput ||
        uEmpId === cleanInput ||
        uPrefix === cleanInput
      );
    });

    if (matchedUser) {
      setCurrentUser(matchedUser);
      if (matchedUser.role === 'student') {
        setCurrentPath('/dashboard');
      } else {
        setCurrentPath('/admin/dashboard');
      }
      return true;
    }

    // Role inference by email keywords if custom email entered
    if (cleanInput.includes('admin') || cleanInput.includes('it.') || cleanInput.startsWith('it')) {
      const itUser: User = {
        id: 'usr-custom-it',
        name: 'Kabir Sharma',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
        role: 'it_admin',
        employeeId: 'ADM-IT-001',
        department: 'IT Infrastructure & Digital Services',
        adminTitle: 'IT Administrator',
      };
      setCurrentUser(itUser);
      setCurrentPath('/admin/dashboard');
      return true;
    } else if (cleanInput.includes('finance') || cleanInput.includes('accounts') || cleanInput.startsWith('fin')) {
      const finUser: User = {
        id: 'usr-custom-fin',
        name: 'Priyanjali S.',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
        role: 'finance_admin',
        employeeId: 'ADM-FIN-002',
        department: 'University Finance & Accounts Office',
        adminTitle: 'Finance Administrator',
      };
      setCurrentUser(finUser);
      setCurrentPath('/admin/dashboard');
      return true;
    } else if (cleanInput.includes('academic') || cleanInput.includes('faculty') || cleanInput.includes('dean') || cleanInput.startsWith('acad')) {
      const acadUser: User = {
        id: 'usr-custom-acad',
        name: 'Dr. Aris V.',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
        role: 'academic_admin',
        employeeId: 'ADM-ACAD-003',
        department: 'Office of Academic Affairs & Registrar',
        adminTitle: 'Academic Administrator',
      };
      setCurrentUser(acadUser);
      setCurrentPath('/admin/dashboard');
      return true;
    } else {
      // Default to student
      const studentUser: User = {
        id: 'usr-custom-std',
        name: cleanInput.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Student',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
        role: 'student',
        enrollmentNo: '2024-CS-' + Math.floor(100 + Math.random() * 900),
        department: 'Computer Science & Engineering',
        year: '2nd Year',
        semester: 'Semester 3',
        batch: '2025–2029',
        accommodation: 'Campus Residency · Block B',
      };
      setCurrentUser(studentUser);
      setCurrentPath('/dashboard');
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPath('/login');
  };

  const switchRole = (role: UserRole) => {
    switch (role) {
      case 'student':
        setCurrentUser(INITIAL_USERS['mahi.patel@college.edu']);
        setCurrentPath('/dashboard');
        break;
      case 'it_admin':
        setCurrentUser(INITIAL_USERS['kabir.it@college.edu']);
        setCurrentPath('/admin/dashboard');
        break;
      case 'finance_admin':
        setCurrentUser(INITIAL_USERS['finance.dept@college.edu']);
        setCurrentPath('/admin/dashboard');
        break;
      case 'academic_admin':
        setCurrentUser(INITIAL_USERS['academic.office@college.edu']);
        setCurrentPath('/admin/dashboard');
        break;
    }
  };

  // Sync route if user changes
  useEffect(() => {
    if (!currentUser) {
      setCurrentPath('/login');
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        activeRole,
        currentPath,
        setCurrentPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
