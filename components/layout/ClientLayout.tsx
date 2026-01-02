'use client';

import Navbar from '@/components/base-components/Navbar';
import Sidebar from '@/components/base-components/Sidebar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { Toaster } from 'sonner';

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Determine initial language: prefer saved language, then i18n.language
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    const lang = saved || i18n?.language || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Ensure i18n uses the saved language on page load (so translations persist on refresh)
    if (i18n && i18n.language !== lang) {
      i18n.changeLanguage(lang).catch(() => {});
    }
  }, []);

  return (
    <div className='h-screen flex flex-col'>
      {/* Navbar - Fixed at top - Hide on auth pages */}
      {!isAuthPage && (
        <div className='sticky top-0 z-10 lg:z-50'>
          <Navbar onMenuClick={() => setMobileOpen(true)} />
        </div>
      )}

      {/* Sidebar + Main Content */}
      <div className={`flex ${isAuthPage ? '' : 'flex-1 overflow-hidden'}`}>
        {/* Sidebar - Fixed on the left - Hide on auth pages */}
        {!isAuthPage && (
          <>
            <Sidebar
              collapsed={collapsed}
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
              onToggle={() => setCollapsed((v) => !v)}
            />
            {/* Resize handle - desktop only */}
            <div className='resize-handle hidden lg:block absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500/30' />
          </>
        )}

        {/* Main Content - Only this scrolls */}
        <main
          className={`${
            isAuthPage ? 'w-full' : 'flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10'
          } `}
        >
          {children}
        </main>
      </div>
      <Toaster
        position='top-right'
        theme='light'
        richColors
      />
    </div>
  );
}
