import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (emailOrId: string, password?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  activeRole: UserRole;
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'unidesk_auth_user';
const PATH_STORAGE_KEY = 'unidesk_current_path';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1 & 2. Persistent authentication without hardcoded default user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser) as User;
      }
    } catch (e) {
      console.error('Failed to parse saved user from localStorage', e);
    }
    // No hardcoded default: login page appears first
    return null;
  });

  const [currentPath, setCurrentPathState] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const savedPath = localStorage.getItem(PATH_STORAGE_KEY);
        if (savedPath && savedPath !== '/login') {
          return savedPath;
        }
        const parsed = JSON.parse(savedUser) as User;
        return parsed.role === 'student' ? '/dashboard' : '/admin/dashboard';
      }
    } catch (e) {
      console.error('Failed to parse saved route', e);
    }
    return '/login';
  });

  const setCurrentPath = (path: string) => {
    setCurrentPathState(path);
    try {
      localStorage.setItem(PATH_STORAGE_KEY, path);
    } catch (e) {
      console.error('Failed to save route to localStorage', e);
    }
  };

  const activeRole: UserRole = currentUser?.role || 'student';

  const login = (emailOrId: string): boolean => {
    const cleanInput = emailOrId.trim().toLowerCase();
    let matchedUser: User | null = null;

    // 1. Check known users by exact email
    if (INITIAL_USERS[cleanInput]) {
      matchedUser = INITIAL_USERS[cleanInput];
    }

    // 2. Check by enrollment number, employee ID, or prefix
    if (!matchedUser) {
      const found = Object.values(INITIAL_USERS).find((u) => {
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
      if (found) {
        matchedUser = found;
      }
    }

    // 3. Fallback inference by keywords for real production email input
    if (!matchedUser) {
      if (cleanInput.includes('admin') || cleanInput.includes('it.') || cleanInput.startsWith('it')) {
        matchedUser = {
          id: 'usr-custom-it',
          name: 'Kabir Sharma',
          email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
          role: 'it_admin',
          employeeId: 'ADM-IT-001',
          department: 'IT Infrastructure',
          adminTitle: 'IT Administrator',
          phone: '+91 98765 88990',
        };
      } else if (cleanInput.includes('finance') || cleanInput.includes('accounts') || cleanInput.startsWith('fin')) {
        matchedUser = {
          id: 'usr-custom-fin',
          name: 'Priyanjali S.',
          email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
          role: 'finance_admin',
          employeeId: 'ADM-FIN-002',
          department: 'Finance',
          adminTitle: 'Finance Administrator',
          phone: '+91 98765 77665',
        };
      } else if (cleanInput.includes('academic') || cleanInput.includes('faculty') || cleanInput.includes('dean') || cleanInput.startsWith('acad')) {
        matchedUser = {
          id: 'usr-custom-acad',
          name: 'Dr. Aris V.',
          email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
          role: 'academic_admin',
          employeeId: 'ADM-ACAD-003',
          department: 'Academic',
          adminTitle: 'Academic Administrator',
          phone: '+91 98765 33441',
        };
      } else {
        // Registered student user
        matchedUser = {
          id: 'std-rec-1',
          name: cleanInput.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Mahi Patel',
          email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@college.edu`,
          role: 'student',
          enrollmentNo: '2024-CS-042',
          department: 'Computer Science & Engineering',
          subDepartment: 'Software Systems',
          specialization: 'Artificial Intelligence & Data',
          year: '3rd Year',
          semester: 'Semester 5',
          batch: '2023-2027',
          accommodation: 'Campus Residency · Block B · Room 314',
          phone: '+91 98765 43210',
          parentName: 'Ramesh Patel',
          parentContact: '+91 98765 01234',
        };
      }
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      const targetPath = matchedUser.role === 'student' ? '/dashboard' : '/admin/dashboard';
      setCurrentPath(targetPath);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
        localStorage.setItem(PATH_STORAGE_KEY, targetPath);
      } catch (e) {
        console.error('Failed to save user session', e);
      }
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPathState('/login');
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(PATH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  };

  const switchRole = (role: UserRole) => {
    let targetUser: User;
    switch (role) {
      case 'student':
        targetUser = INITIAL_USERS['mahi.patel@college.edu'];
        break;
      case 'it_admin':
        targetUser = INITIAL_USERS['kabir.it@college.edu'];
        break;
      case 'finance_admin':
        targetUser = INITIAL_USERS['finance.dept@college.edu'];
        break;
      case 'academic_admin':
        targetUser = INITIAL_USERS['academic.office@college.edu'];
        break;
      default:
        targetUser = INITIAL_USERS['mahi.patel@college.edu'];
    }

    setCurrentUser(targetUser);
    const targetPath = targetUser.role === 'student' ? '/dashboard' : '/admin/dashboard';
    setCurrentPath(targetPath);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetUser));
      localStorage.setItem(PATH_STORAGE_KEY, targetPath);
    } catch (e) {
      console.error('Failed to save role switch session', e);
    }
  };

  // If user is logged out, ensure path is /login
  useEffect(() => {
    if (!currentUser && currentPath !== '/login') {
      setCurrentPathState('/login');
    }
  }, [currentUser, currentPath]);

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
