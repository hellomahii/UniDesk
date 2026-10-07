import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AskUniDeskPage } from './pages/student/AskUniDeskPage';
import { StudentTimetablePage } from './pages/student/StudentTimetablePage';
import { ExamSchedulePage } from './pages/student/ExamSchedulePage';
import { StudentNoticesPage } from './pages/student/StudentNoticesPage';
import { StudentTicketsPage } from './pages/student/StudentTicketsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { IntentRoutingPage } from './pages/admin/IntentRoutingPage';
import { AdminTicketsPage } from './pages/admin/AdminTicketsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { NoticePlusPage } from './pages/admin/NoticePlusPage';
import { FeeManagementPage } from './pages/admin/FeeManagementPage';
import { AcademicTimetablePage } from './pages/admin/AcademicTimetablePage';
import { AcademicExamsPage } from './pages/admin/AcademicExamsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

const AppContent: React.FC = () => {
  const { currentUser, currentPath, activeRole } = useAuth();

  // If user is not authenticated or explicitly at login route
  if (!currentUser || currentPath === '/login') {
    return <LoginPage />;
  }

  // Routing renderer
  const renderCurrentPage = () => {
    // 1. Student routes
    if (activeRole === 'student') {
      switch (currentPath) {
        case '/dashboard':
          return <StudentDashboard />;
        case '/ask':
          return <AskUniDeskPage />;
        case '/timetable':
          return <StudentTimetablePage />;
        case '/exams':
          return <ExamSchedulePage />;
        case '/notices':
          return <StudentNoticesPage />;
        case '/tickets':
          return <StudentTicketsPage />;
        case '/profile':
          return <StudentProfilePage />;
        default:
          return <StudentDashboard />;
      }
    }

    // 2. Admin routes
    switch (currentPath) {
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/tickets':
        return <AdminTicketsPage />;
      case '/admin/routing':
        return <IntentRoutingPage />;
      case '/admin/students':
        return <AdminStudentsPage />;
      case '/admin/notices':
        return <NoticePlusPage />;
// Finance Admin specific
case '/admin/fees':
  return <FeeManagementPage />;
      // Academic Admin specific
      case '/admin/timetable':
        return <AcademicTimetablePage />;
      case '/admin/exams':
        return <AcademicExamsPage />;
      case '/admin/profile':
        return <AdminProfilePage />;
      default:
        return <AdminDashboard />;
    }
  };

  return <AppShell>{renderCurrentPage()}</AppShell>;
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
