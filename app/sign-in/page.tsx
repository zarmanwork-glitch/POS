'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%] bg-gray-50'>
      {/* Left Side – Illustration */}
      <div className='hidden lg:grid place-items-center bg-linear-to-br from-blue-50 to-purple-50'>
        <div className='relative w-full h-full'>
          <Image
            src='/login-bg.svg'
            alt='Team collaboration'
            fill
            className='object-contain'
          />
        </div>
      </div>

      {/* Right Side – Form */}
      <div className='grid place-items-center px-6 sm:px-8'>
        <div className='w-full max-w-md'>
          {/* Logo */}
          <div className='mb-8 text-center'>
            <Image
              src='/logo.png'
              alt='Company Logo'
              width={120}
              height={40}
            />
          </div>

          {/* Title */}
          <h1 className='text-3xl font-bold text-center mb-8 text-gray-900'>
            Sign In
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            {/* Email */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className={`pl-10 pr-10 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Show password */}
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='showPassword'
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className='rounded'
              />
              <label
                htmlFor='showPassword'
                className='text-sm text-gray-700'
              >
                Show password
              </label>
            </div>

            {/* Forgot */}
            <div className='text-right'>
              <Link
                href='/forgot-password'
                className='text-sm font-medium text-blue-600 hover:text-blue-700'
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-auto'
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className='mt-8 relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-gray-50 text-gray-500'>or</span>
            </div>
          </div>

          {/* Xero */}
          <Button
            variant='outline'
            className='w-full mt-6 bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100'
          >
            <span className='text-lg mr-2'>🔵</span> Login with Xero
          </Button>

          {/* Sign up */}
          <p className='text-center mt-6 text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link
              href='/sign-up'
              className='font-semibold text-blue-600 hover:text-blue-700'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
