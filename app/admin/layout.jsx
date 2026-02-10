'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { useAppContext } from '@/context/AppContext';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated: contextAuth, authLoading, logout } = useAppContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const admin = localStorage.getItem('admin');
      
      if ((!accessToken || !admin) && pathname !== '/admin/login') {
        router.replace('/'); 
        return;
      }
      
      if (accessToken && admin) {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkAuth();
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router, pathname]);

  
  useEffect(() => {
    if (!authLoading && contextAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [contextAuth, authLoading]);

  const handleLogout = () => {
    
    logout();
    router.replace('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader 
        onSidebarToggle={toggleSidebar}
        onLogout={handleLogout}
        isMobile={isMobile}
      />
      
      <AdminSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      <main 
        className={`
          pt-16 transition-all duration-300
          ${isSidebarOpen && !isMobile ? 'md:ml-64' : ''}
        `}
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}