'use client';

import sidebarItems from '@/json/sidebar-items.json';
import {
  BarChart2,
  ChevronDown,
  ChevronLeft,
  FileText,
  LayoutGrid,
  Mail,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, JSX.Element> = {
  LayoutGrid: <LayoutGrid size={18} />,
  User: <User size={18} />,
  FileText: <FileText size={18} />,
  Users: <Users size={18} />,
  Mail: <Mail size={18} />,
  UserPlus: <UserPlus size={18} />,
  BarChart2: <BarChart2 size={18} />,
};

export default function Sidebar({
  mobileOpen,
  onClose,
  collapsed,
  onToggle,
}: {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      {/* Mobile overlay with fade animation */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar with slide animation */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          h-full bg-linear-to-b from-slate-900 to-slate-800 text-white
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Collapse toggle button (desktop only) */}
        <Button
          onClick={onToggle}
          variant='ghost'
          size='icon'
          className='
            hidden lg:flex
            absolute -right-3 top-6 h-6 w-6
            bg-slate-900 border border-white/10
            rounded-full
            hover:bg-slate-700 hover:border-white/20
            transition-all duration-200
            shadow-lg
          '
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={14}
            className={`transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {/* Sidebar content */}
        <div className='px-3 py-6 space-y-1 overflow-y-auto h-full'>
          {sidebarItems.map((item) => {
            const icon = item.icon ? iconMap[item.icon] : null;
            const isOpen = openMenu === item.label;

            return (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <SidebarDropdown
                      icon={icon}
                      label={item.label}
                      open={isOpen}
                      collapsed={collapsed}
                      onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    />
                    {/* Nested items with slide-down animation */}
                    <div
                      className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${
                          isOpen && !collapsed
                            ? 'max-h-96 opacity-100 mt-1'
                            : 'max-h-0 opacity-0'
                        }
                      `}
                    >
                      <div className='ml-9 space-y-1'>
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href ?? '#'}
                            onClick={onClose}
                            className={`block px-3 py-2 rounded-md text-xs transition-colors duration-150 ${
                              pathname === child.href
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <SidebarLink
                    icon={icon}
                    label={item.label}
                    href={item.href}
                    active={pathname === item.href}
                    collapsed={collapsed}
                    onClick={onClose}
                  />
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

/* ---------------- Sidebar Link ---------------- */

function SidebarLink({
  icon,
  label,
  href = '#',
  active,
  onClick,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
        transition-all duration-200 ease-in-out
        ${collapsed ? 'justify-center' : ''}
        ${
          active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }
      `}
      title={collapsed ? label : undefined}
    >
      <span className='shrink-0'>{icon}</span>

      {/* Label with fade animation */}
      <span
        className={`
          whitespace-nowrap transition-all duration-200 ease-in-out
          ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
        `}
      >
        {label}
      </span>
    </Link>
  );
}

/* ---------------- Sidebar Dropdown ---------------- */

function SidebarDropdown({
  icon,
  label,
  open,
  onClick,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      variant='ghost'
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium
        text-gray-300 hover:bg-white/10 hover:text-white h-auto
        transition-all duration-200 ease-in-out
        ${collapsed ? 'justify-center' : ''}
      `}
      title={collapsed ? label : undefined}
    >
      <span className={`flex items-center gap-3 ${collapsed ? '' : 'flex-1'}`}>
        <span className='shrink-0'>{icon}</span>

        {/* Label with fade animation */}
        <span
          className={`
            whitespace-nowrap transition-all duration-200 ease-in-out
            ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }
          `}
        >
          {label}
        </span>
      </span>

      {/* Chevron with rotation animation */}
      {!collapsed && (
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ease-in-out shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      )}
    </Button>
  );
}
