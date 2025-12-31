'use client';

import Cookies from 'js-cookie';
import { LogOut, Menu, Settings, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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

function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
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
    <nav className='sticky top-0 z-50 h-18 w-full border-b flex items-center justify-between px-6 shadow-md bg-white'>
      {/* Left */}
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onMenuClick}
          className='lg:hidden'
        >
          <Menu className='h-5 w-5' />
        </Button>

        <Image
          src='/logo.png'
          alt='logo'
          width={100}
          height={40}
        />
      </div>

      {/* Right */}
      <div className='flex items-center gap-6'>
        <LanguageSwitch />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center gap-3 cursor-pointer'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-800'>
                  {email ?? ''}
                </p>
                <p className='text-xs text-gray-500'>Admin</p>
              </div>
              <div className='h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold'>
                {initial}
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className='mr-2 h-4 w-4' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
