'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import loginBackground from '@/public/login_bg.svg';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '@/components/base-components/LanguageSwitch';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

export default function SignUpPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setIsLoading(true);
    try {
      // Replace with real sign-up API call
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[55%_45%] bg-white'>
      {/* Left: Image (55%) */}
      <div className='relative hidden lg:block bg-gray-50 overflow-hidden'>
        <Image
          src={loginBackground}
          alt='Login background illustration'
          fill
          className='contain'
          priority
        />
      </div>

      {/* Right: Form (45%) */}
      <div className='flex items-center justify-center py-8 px-6 lg:py-0 lg:px-8'>
        <div className='w-full max-w-sm space-y-8'>
          {/* Language Switch */}
          <div className='flex justify-end'>
            <LanguageSwitch />
          </div>

          {/* Header */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900'>
              {t('auth.signUp.brand')}
            </h1>
            <p className='text-sm text-gray-600'>{t('auth.signUp.subtitle')}</p>
          </div>

          {/* Form */}
          <form
            className='space-y-[clamp(1rem,2vw,1.5rem)]'
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                {t('auth.signUp.emailLabel')}
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  type='email'
                  placeholder={t('auth.signUp.emailPlaceholder')}
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
                {t('auth.signUp.passwordLabel')}
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={
                    t('auth.signUp.passwordPlaceholder') ?? '••••••••'
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
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
              <label className='text-sm font-medium text-gray-700'>
                {t('auth.signUp.confirmPasswordLabel')}
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={
                    t('auth.signUp.passwordPlaceholder') ?? '••••••••'
                  }
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='show-password' />
                <label
                  htmlFor='show-password'
                  className='text-sm text-gray-600'
                >
                  {t('auth.signUp.showPassword')}
                </label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox id='robot' />
                <span className='text-sm text-gray-600'>
                  {t('auth.signUp.robot')}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className='flex items-center gap-3'>
              <Separator className='flex-1' />
              <span className='text-sm text-gray-500 px-2'>
                {t('auth.signIn.or')}
              </span>
              <Separator className='flex-1' />
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-blue-700 text-white hover:bg-blue-800 py-2'
            >
              {isLoading ? (
                <>
                  <Spinner className='mr-2 h-5 w-5 text-white' />
                  {t('auth.signUp.signUp')}
                </>
              ) : (
                t('auth.signUp.signUp')
              )}
            </Button>

            {/* Sign In Link */}
            <p className='text-center text-sm text-gray-600'>
              {t('auth.signUp.haveAccount')}{' '}
              <Link
                href='/sign-in'
                className='font-semibold text-blue-600 hover:text-blue-700 transition-colors'
              >
                {t('auth.signIn.signIn')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
