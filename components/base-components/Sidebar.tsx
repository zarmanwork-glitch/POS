'use client';

import { Button } from '@/components/ui/button';
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
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, JSX.Element> = {
  LayoutGrid: <LayoutGrid size={18} />,
  User: <User size={18} />,
  FileText: <FileText size={18} />,
  Users: <Users size={18} />,
  Mail: <Mail size={18} />,
  UserPlus: <UserPlus size={18} />,
  BarChart2: <BarChart2 size={18} />,
};

const translationKeys: Record<string, string> = {
  Dashboard: 'sidebar.dashboard',
  Profile: 'sidebar.profile',
  'Business Details': 'sidebar.businessDetails',
  'Bank Details': 'sidebar.bankDetails',
  Items: 'sidebar.items',
  Branches: 'sidebar.branches',
  Documents: 'sidebar.documents',
  Invoice: 'sidebar.invoice',
  'Credit Note': 'sidebar.creditNote',
  'Debit Note': 'sidebar.debitNote',
  Customers: 'sidebar.customers',
  Invites: 'sidebar.invites',
  Teams: 'sidebar.teams',
  'Team Members': 'sidebar.teamMembers',
  Roles: 'sidebar.roles',
  Reports: 'sidebar.reports',
  Compliance: 'sidebar.compliance',
  Analytics: 'sidebar.analytics',
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
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const activeParent = sidebarItems.find((item) =>
      item.children?.some((child) => pathname === child.href)
    );
    return activeParent?.label || null;
  });

  const { t } = useTranslation();

  const getTranslatedLabel = (label: string) => {
    const key = translationKeys[label];
    return key ? t(key) : label;
  };

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
          fixed lg:static inset-y-0 left-0 z-70
          h-full bg-linear-to-b from-slate-900 to-slate-800 text-white
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Collapse mini toggle button (desktop only) */}
        <Button
          onClick={onToggle}
          variant='ghost'
          size='icon'
          className='
            hidden lg:flex
            absolute -right-6 top-7 h-8 w-8
            bg-blue-600 
            rounded-full
            hover:bg-blue-700 hover:text-white
            transition-all duration-200
            shadow-lg
          '
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {/* Sidebar content */}
        <div className='px-3 py-6 space-y-1 overflow-y-auto h-full'>
          {sidebarItems.map((item) => {
            const icon = item.icon ? iconMap[item.icon] : null;
            const translatedLabel = getTranslatedLabel(item.label);

            let isActive = false;
            let activeChildHref = '';

            if (item.href) {
              // Top-level item (e.g., Customers, Invites)
              isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
            } else if (item.children) {
              // For dropdown items: find the best matching child
              let bestMatchLength = 0;

              item.children.forEach((child) => {
                if (child.href && pathname.startsWith(child.href)) {
                  const matchLength = child.href.length;
                  if (matchLength > bestMatchLength) {
                    bestMatchLength = matchLength;
                    activeChildHref = child.href;
                    isActive = true;
                  }
                }
                // Also match if the form is a sibling (e.g., items-list → items-form)
                // Extract the parent segment: /profile/items/
                else if (child.href) {
                  const childDir = child.href.substring(
                    0,
                    child.href.lastIndexOf('/')
                  );
                  const formPath = childDir + '/items-form'; // adjust if needed per section
                  // Better: generalize by checking if pathname shares the same directory
                  if (pathname.startsWith(childDir + '/')) {
                    isActive = true;
                  }
                }
              });
            }

            // Auto-open if active
            const isOpen =
              openMenu === item.label || (isActive && openMenu !== null);

            const handleClick = () => {
              if (item.children) {
                setOpenMenu(openMenu === item.label ? null : item.label);
              }
            };
            return (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <SidebarDropdown
                      icon={icon}
                      label={translatedLabel}
                      open={isOpen}
                      active={isActive}
                      collapsed={collapsed}
                      onClick={handleClick}
                    />

                    {/* Nested items */}
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
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.label}
                              href={child.href ?? '#'}
                              onClick={onClose}
                              className={`block px-3 py-2 rounded-md text-xs transition-colors duration-150 ${
                                childActive
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {getTranslatedLabel(child.label)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <SidebarLink
                    icon={icon}
                    label={translatedLabel}
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

/*Sidebar Link */

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

/* Sidebar Dropdown */

function SidebarDropdown({
  icon,
  label,
  open,
  active, // New
  onClick,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active?: boolean; // New
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      variant='ghost'
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium
        transition-all duration-200 ease-in-out
        ${collapsed ? 'justify-center' : ''}
        ${
          active
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray hover:text-white'
        }
      `}
      title={collapsed ? label : undefined}
    >
      <span className={`flex items-center gap-3 ${collapsed ? '' : 'flex-1'}`}>
        <span className='shrink-0'>{icon}</span>
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
