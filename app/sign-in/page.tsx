'use client';

import { login } from '@/api/auth/auth.api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      toast.error('Email and password are required', { duration: 2000 });
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({
        payload: {
          email,
          password,
        },
        successCallbackFunction: () => {
          toast.success('Login successful! Redirecting...', { duration: 2000 });
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        },
      });

      // Check for API errors
      if (response?.data?.status !== 'success') {
        const errorMsg =
          response?.data?.message ||
          'Login failed. Please check your credentials.';
        toast.error(errorMsg, { duration: 2000 });
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred. Please try again.';
      toast.error(errorMessage, { duration: 2000 });
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-[55%_45%]'>
      {/* Left Side - Background Image */}
      <div className='hidden md:block relative '>
        <Image
          src='/login_bg.svg'
          alt='Signup background'
          fill
          className='contain'
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className='flex flex-col items-center justify-center bg-white h-screen md:h-auto'>
        <div className='w-full max-w-md overflow-y-auto max-h-[80vh] md:max-h-none px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12'>
          {/* Logo/Brand */}
          <div className='mb-8 text-center'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
              Point Of Sale
            </h1>
            <p className='text-gray-500 text-sm md:text-base'>
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form
            className='space-y-5 md:space-y-6'
            onSubmit={handleSubmit}
          >
            {/* Email Field */}
            <div className='space-y-2'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-gray-700 block'
              >
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-10 bg-yellow-50 border-yellow-200 text-sm md:text-base'
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-gray-700 block'
              >
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200 text-sm md:text-base'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 md:h-5 md:w-5' />
                  ) : (
                    <Eye className='h-4 w-4 md:h-5 md:w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Show Password & Forgot Password */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
              <Link
                href='#'
                className='text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium transition'
              >
                Forgot password?
              </Link>
            </div>

            {/* reCAPTCHA Notice */}
            <div className='flex items-center space-x-2'>
              <Checkbox id='recaptcha' />
              <span className='text-xs text-gray-600'>
                I&apos;m not a robot
              </span>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-blue-200 text-gray-700 hover:bg-blue-300 text-base py-2 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Divider */}
            {/* <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>or</span>
              </div>
            </div> */}

            {/* Alternative Login */}

            {/* Sign Up Link */}
            {/* <p className='text-center text-xs md:text-sm text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link
                href='/sign-up'
                className='font-semibold text-blue-600 hover:text-blue-700 transition'
              >
                Sign Up
              </Link>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
}
