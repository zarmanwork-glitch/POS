'use client';

import Cookies from 'js-cookie';
import { LogOut, Menu, Settings, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import LanguageSwitch from '@/components/base-components/LanguageSwitch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/token';
import { useTranslation } from 'react-i18next';

function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setEmail(Cookies.get('userEmail') ?? null);
  }, []);

  if (!mounted) return null;

  const initial = email?.charAt(0).toUpperCase() ?? '';

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <nav
      aria-label='Top navigation'
      className='sticky top-0 z-30 h-14 sm:h-16 lg:h-18 w-full border-b border-border/50 flex items-center justify-between px-3 sm:px-4 lg:px-6 glass'
    >
      {/* Left */}
      <div className='flex items-center gap-2 sm:gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onMenuClick}
          className='lg:hidden hover:bg-blue-50'
          aria-label='Open navigation menu'
        >
          <Menu className='h-5 w-5' />
        </Button>
        <div className='flex items-center gap-2'>
          <span className='text-xl sm:text-2xl lg:text-3xl font-extrabold text-gradient-brand tracking-tight'>
            POS
          </span>
        </div>
      </div>

      {/* Right */}
      <div className='flex items-center gap-2 sm:gap-4 lg:gap-6'>
        <LanguageSwitch />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center gap-2 sm:gap-3 cursor-pointer rounded-full p-1 transition-colors hover:bg-accent'
              aria-label='User menu'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]'>
                  {email ?? ''}
                </p>
                <p className='text-[10px] sm:text-xs text-gray-500'>Admin</p>
              </div>
              <div className='h-8 w-8 sm:h-9 sm:w-9 rounded-full gradient-brand flex items-center justify-center text-white font-semibold shrink-0 text-sm sm:text-base ring-2 ring-white shadow-sm'>
                {initial}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              {t('navbar.profile', { defaultValue: 'Profile' })}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className='mr-2 h-4 w-4' />
              {t('navbar.settings', { defaultValue: 'Settings' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className='mr-2 h-4 w-4' />
              {t('navbar.signOut', { defaultValue: 'Sign out' })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
