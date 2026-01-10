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

  // Determine initial language: prefer saved language, then i18n.language
  useEffect(() => {
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

  if (isAuthPage) {
    return (
      <div className='grid min-h-screen bg-background'>
        {children}
        <Toaster
          position='top-right'
          theme='light'
          richColors
        />
      </div>
    );
  }

  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr] bg-background'>
      {/* Navbar */}
      <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 row-start-1 row-end-2'>
        <Navbar onMenuClick={() => setMobileOpen(true)} />
      </header>

      {/* Main Grid: Sidebar + Content */}
      <div className='grid grid-cols-[auto_1fr] overflow-hidden row-start-2 row-end-3 '>
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((v) => !v)}
        />

        {/* Main Content */}
        <main className='overflow-y-auto col-start-2 col-end-3'>
          <div className='h-full px-[clamp(1rem,5vw,2.5rem)] py-[clamp(1rem,4vw,2.5rem)]'>
            {children}
          </div>
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
