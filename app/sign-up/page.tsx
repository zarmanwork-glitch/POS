'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, confirmPassword });
  };

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-[55%_45%]'>
      {/* Left: Image (55%) */}
      <div className='hidden md:block relative '>
        <Image
          src='/login-bg.svg'
          alt='Signup background'
          fill
          className='contain'
          priority
        />
      </div>

      {/* Right: Form (45%) */}
      <div className='flex items-center justify-center bg-white'>
        <div className='w-full max-w-md px-6 py-10'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900'>Point Of Sale</h1>
            <p className='text-gray-500 text-sm mt-1'>Create your account</p>
          </div>

          {/* Form */}
          <form
            className='space-y-5'
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-10 bg-yellow-50 border-yellow-200'
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className='flex items-center space-x-2'>
              <Checkbox id='show-password' />
              <label
                htmlFor='show-password'
                className='text-sm text-gray-600'
              >
                Show password
              </label>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox id='robot' />
              <span className='text-sm text-gray-600'>
                I&apos;m not a robot
              </span>
            </div>

            {/* Submit */}
            <Button
              type='submit'
              className='w-full bg-blue-200 text-gray-700 hover:bg-blue-300'
            >
              Sign Up
            </Button>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t' />
              </div>
              <div className='relative flex justify-center'>
                <span className='bg-white px-2 text-sm text-gray-500'>or</span>
              </div>
            </div>

            {/* OAuth */}
            <Button
              type='button'
              variant='outline'
              className='w-full'
            >
              Login with Xero
            </Button>

            {/* Link */}
            <p className='text-center text-sm text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/sign-in'
                className='font-semibold text-blue-600'
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
