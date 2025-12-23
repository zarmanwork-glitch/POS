'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, LogOut, Settings, User } from 'lucide-react';
import Image from 'next/image';

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className='sticky top-0 z-50 h-18 w-full border-b flex items-center justify-between px-6 shadow-md bg-white'>
      {/* Left */}
      <div className='flex items-center gap-3'>
        {/* Mobile hamburger */}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
            >
              Language
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center gap-3 cursor-pointer'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-800'>
                  example@gmail
                </p>
                <p className='text-xs text-gray-500'>Admin</p>
              </div>
              <div className='h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold'>
                A
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
