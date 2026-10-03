import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAuth } from '../../context/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // If unauthenticated, show child directly (Login page)
  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col antialiased text-[#1E2E28]">
      {/* Sidebar */}
      <Sidebar isOpenMobile={isOpenMobile} onCloseMobile={() => setIsOpenMobile(false)} />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen flex-1">
        <TopBar onOpenMobile={() => setIsOpenMobile(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>
    </div>
  );
};
