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

const AUTH_STORAGE_KEY = 'unidesk_auth_user';
const PATH_STORAGE_KEY = 'unidesk_current_path';

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // Restore logged-in user after page refresh
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);

      if (savedUser) {
        return JSON.parse(savedUser) as User;
      }
    } catch (error) {
      console.error(
        'Failed to restore saved user:',
        error
      );
    }

    return null;
  });

  // Restore previous route
  const [currentPath, setCurrentPathState] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const savedPath = localStorage.getItem(PATH_STORAGE_KEY);

      if (savedUser) {
        if (savedPath && savedPath !== '/login') {
          return savedPath;
        }

        const user = JSON.parse(savedUser) as User;

        return user.role === 'student'
          ? '/dashboard'
          : '/admin/dashboard';
      }
    } catch (error) {
      console.error(
        'Failed to restore saved route:',
        error
      );
    }

    return '/login';
  });

  const setCurrentPath = (path: string) => {
    setCurrentPathState(path);

    try {
      localStorage.setItem(
        PATH_STORAGE_KEY,
        path
      );
    } catch (error) {
      console.error(
        'Failed to save route:',
        error
      );
    }
  };

  const activeRole: UserRole =
    currentUser?.role || 'student';

  // Create frontend User object from backend user
  const createUserFromDatabase = async (
    dbUser: any
  ): Promise<User> => {

    let student: any = null;

    // Load additional student information
    if (dbUser.role === 'student') {
      try {
        const response = await fetch(
          `${API}/students`
        );

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

    // Convert backend role into frontend role
    let role: UserRole = 'student';

    if (dbUser.role === 'admin') {
      if (dbUser.department === 'it') {
        role = 'it_admin';
      } else if (
        dbUser.department === 'finance'
      ) {
        role = 'finance_admin';
      } else if (
        dbUser.department === 'academic'
      ) {
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

      role,

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

  // Backend login
  const login = async (
    email: string,
    password?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API}/users`
      );

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

      // Backend currently stores password_hash
      // and compares it directly here.
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

      const targetPath =
        user.role === 'student'
          ? '/dashboard'
          : '/admin/dashboard';

      setCurrentPath(targetPath);

      // Persist login session
      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(user)
        );

        localStorage.setItem(
          PATH_STORAGE_KEY,
          targetPath
        );
      } catch (error) {
        console.error(
          'Failed to save login session:',
          error
        );
      }

      return true;

    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      return false;
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setCurrentPathState('/login');

    try {
      localStorage.removeItem(
        AUTH_STORAGE_KEY
      );

      localStorage.removeItem(
        PATH_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        'Failed to clear session:',
        error
      );
    }
  };

  // Switch role for admin/testing purposes
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
      const response = await fetch(
        `${API}/users`
      );

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
        console.error(
          `No backend user found for ${email}`
        );

        return;
      }

      const user =
        await createUserFromDatabase(dbUser);

      setCurrentUser(user);

      const targetPath =
        user.role === 'student'
          ? '/dashboard'
          : '/admin/dashboard';

      setCurrentPath(targetPath);

      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(user)
        );

        localStorage.setItem(
          PATH_STORAGE_KEY,
          targetPath
        );
      } catch (error) {
        console.error(
          'Failed to save role switch session:',
          error
        );
      }

    } catch (error) {
      console.error(
        'Switch role error:',
        error
      );
    }
  };

  // If logged out, always return to login
  useEffect(() => {
    if (
      !currentUser &&
      currentPath !== '/login'
    ) {
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
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};