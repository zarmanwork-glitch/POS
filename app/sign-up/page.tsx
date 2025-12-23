'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation logic here
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
      <div className='grid place-items-center px-6 sm:px-8 py-8'>
        <div className='w-full max-w-md'>
          {/* Logo */}
          <div className='mb-6 text-center'>
            <Image
              src='/logo.png'
              alt='Company Logo'
              width={120}
              height={40}
            />
          </div>

          {/* Title */}
          <h1 className='text-3xl font-bold text-center mb-2 text-gray-900'>
            Create Account
          </h1>
          <p className='text-center text-gray-600 mb-6'>
            Join us today and get started
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className='space-y-4'
          >
            {/* Full Name */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <Input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='John Doe'
                  className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='your@email.com'
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Phone */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <div className='relative'>
                <Phone className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <Input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='+966 50 0000000'
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
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
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='agreeTerms'
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className='rounded'
              />
              <label
                htmlFor='agreeTerms'
                className='text-sm text-gray-700'
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='text-blue-600 hover:text-blue-700'
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* Submit */}
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-auto'
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className='mt-6 relative'>
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
            <span className='text-lg mr-2'>🔵</span> Sign up with Xero
          </Button>

          {/* Sign in */}
          <p className='text-center mt-6 text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/sign-in'
              className='font-semibold text-blue-600 hover:text-blue-700'
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
