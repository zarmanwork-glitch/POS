'use client';

import Navbar from '@/components/base-components/Navbar';
import Sidebar from '@/components/base-components/Sidebar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
      <div className='min-h-screen bg-background'>
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
    <div className='min-h-screen bg-background'>
      {/* Navbar */}
      <header className='fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
        <Navbar onMenuClick={() => setMobileOpen(true)} />
      </header>

      {/* Main Grid: Sidebar + Content */}
      <div className='flex pt-16'>
        {/* Sidebar - Fixed */}
        <div
          className={`fixed ${
            isRTL ? 'right-0' : 'left-0'
          } top-18 bottom-0 z-100`}
        >
          <Sidebar
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
            onToggle={() => setCollapsed((v) => !v)}
            isRTL={isRTL}
          />
        </div>

        {/* Spacer for sidebar */}
        <div
          className={`shrink-0 transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          } hidden lg:block`}
        />

        {/* Main Content - Scrollable */}
        <main className='flex-1 overflow-y-auto'>
          <div className='min-h-[calc(100vh-4rem)] px-[clamp(1rem,5vw,2.5rem)] py-[clamp(1rem,4vw,2.5rem)]'>
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
