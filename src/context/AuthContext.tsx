import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { User, UserRole } from '../types';

const API = 'http://127.0.0.1:8000';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  activeRole: UserRole;
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [currentPath, setCurrentPath] =
    useState<string>('/login');

  const activeRole: UserRole =
    currentUser?.role || 'student';

  const createUserFromDatabase = async (
    dbUser: any
  ): Promise<User> => {
    let student: any = null;

    if (dbUser.role === 'student') {
      try {
        const response = await fetch(`${API}/students`);

        if (response.ok) {
          const students = await response.json();

          student = students.find(
            (s: any) =>
              String(s.email || '')
                .trim()
                .toLowerCase() ===
              String(dbUser.user_email || '')
                .trim()
                .toLowerCase()
          );
        }
      } catch (error) {
        console.error(
          'Failed to load student information:',
          error
        );
      }
    }

    let role: UserRole = 'student';

    if (dbUser.role === 'admin') {
      if (dbUser.department === 'it') {
        role = 'it_admin';
      } else if (dbUser.department === 'finance') {
        role = 'finance_admin';
      } else if (dbUser.department === 'academic') {
        role = 'academic_admin';
      }
    }

    const user = {
      id: String(dbUser.id),

      name:
        student?.name ||
        dbUser.user_email?.split('@')[0] ||
        'User',

      email: dbUser.user_email,

      role: role,

      department:
        student?.department ||
        dbUser.department,

      enrollmentNo:
        student?.enrollment_number,

      year:
        student?.year_sem,

      semester:
        student?.year_sem,

      batch:
        student?.batch,

      accommodation:
        student?.accommodation,

      phone:
        student?.phone,
    } as User;

    return user;
  };

  const login = async (
    email: string,
    password?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API}/users`);

      if (!response.ok) {
        console.error(
          'Failed to load users from backend'
        );

        return false;
      }

      const users = await response.json();

      const cleanEmail = email
        .trim()
        .toLowerCase();

      const dbUser = users.find(
        (user: any) =>
          String(user.user_email || '')
            .trim()
            .toLowerCase() === cleanEmail
      );

      if (!dbUser) {
        console.error('User not found');

        return false;
      }

      if (
        String(dbUser.password_hash) !==
        String(password || '')
      ) {
        console.error('Incorrect password');

        return false;
      }

      const user =
        await createUserFromDatabase(dbUser);

      setCurrentUser(user);

      if (user.role === 'student') {
        setCurrentPath('/dashboard');
      } else {
        setCurrentPath('/admin/dashboard');
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);

      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPath('/login');
  };

  const switchRole = async (
    role: UserRole
  ) => {
    let email = '';

    if (role === 'student') {
      email = 'mahi@unidesk.com';
    } else if (role === 'it_admin') {
      email = 'IT@unidesk.com';
    } else if (role === 'finance_admin') {
      email = 'finance@unidesk.com';
    } else if (role === 'academic_admin') {
      email = 'academic@unidesk.com';
    }

    if (!email) {
      return;
    }

    try {
      const response = await fetch(`${API}/users`);

      if (!response.ok) {
        return;
      }

      const users = await response.json();

      const dbUser = users.find(
        (user: any) =>
          String(user.user_email || '')
            .trim()
            .toLowerCase() ===
          email.toLowerCase()
      );

      if (!dbUser) {
        return;
      }

      const user =
        await createUserFromDatabase(dbUser);

      setCurrentUser(user);

      if (user.role === 'student') {
        setCurrentPath('/dashboard');
      } else {
        setCurrentPath('/admin/dashboard');
      }
    } catch (error) {
      console.error(
        'Switch role error:',
        error
      );
    }
  };

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
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};