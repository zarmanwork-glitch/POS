'use client';

import Navbar from '@/components/base-components/Navbar';
import Sidebar from '@/components/base-components/Sidebar';
import { SIDEBAR } from '@/components/layout.constants';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR.DEFAULT);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const resizing = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSidebarWidth(parsed.width);
      setCollapsed(parsed.collapsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'sidebar',
      JSON.stringify({
        width: sidebarWidth,
        collapsed,
      })
    );
  }, [sidebarWidth, collapsed]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizing.current) return;

      const max = window.innerWidth >= 1536 ? SIDEBAR.XXL_MAX : SIDEBAR.MAX;

      setSidebarWidth(Math.min(Math.max(e.clientX, SIDEBAR.MIN), max));
    };

    const onUp = () => (resizing.current = false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className='h-screen flex flex-col'>
      {/* Navbar - Fixed at top - Hide on auth pages */}
      {!isAuthPage && (
        <div className='sticky top-0 z-50'>
          <Navbar onMenuClick={() => setMobileOpen(true)} />
        </div>
      )}

      {/* Sidebar + Main Content */}
      <div className={`flex ${isAuthPage ? '' : 'flex-1 overflow-hidden'}`}>
        {/* Sidebar - Fixed on the left - Hide on auth pages */}
        {!isAuthPage && (
          <div
            className='sticky hidden lg:block top-0 h-[calc(100vh-4rem)] overflow-y-auto'
            style={{
              width: collapsed ? `${SIDEBAR.MIN}px` : `${sidebarWidth}px`,
            }}
          >
            <Sidebar
              width={collapsed ? SIDEBAR.MIN : sidebarWidth}
              collapsed={collapsed}
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
              onToggle={() => setCollapsed((v) => !v)}
            >
              {/* Resize handle */}
              <div
                onMouseDown={() => (resizing.current = true)}
                className='absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500/30'
              />
            </Sidebar>
          </div>
        )}

        {/* Main Content - Only this scrolls */}
        <main
          className={`${
            isAuthPage ? 'w-full' : 'flex-1 overflow-y-auto'
          } p-4 md:p-6 2xl:p-10`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
