'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginBackground from '@/public/login_bg.svg';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '@/components/base-components/LanguageSwitch';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

export default function SignUpPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SignUpValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.signUp.emailLabel') + ' is invalid')
      .required(t('auth.signUp.emailLabel') + ' is required'),
    password: Yup.string()
      .min(6, t('auth.signUp.passwordLabel') + ' must be at least 6 characters')
      .required(t('auth.signUp.passwordLabel') + ' is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignUpValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Replace with real sign-up API call
        await new Promise((r) => setTimeout(r, 500));
        toast.success('Account created successfully');
      } catch {
        toast.error('Failed to create account');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[55%_45%] bg-white'>
      {/* Left: Image (55%) */}
      <div className='relative hidden lg:block bg-gray-50 overflow-hidden'>
        <Image
          src={loginBackground}
          alt='Sign up background illustration'
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
          <div className='text-center space-y-4'>
            <div className='flex justify-center'>
              <span className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gradient-brand tracking-tight'>
                POS
              </span>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>
                {t('auth.signUp.subtitle')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className='space-y-[clamp(1rem,2vw,1.5rem)]'
            onSubmit={formik.handleSubmit}
          >
            {/* Email */}
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-sm font-medium text-gray-700'
              >
                {t('auth.signUp.emailLabel')}
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder={t('auth.signUp.emailPlaceholder')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 bg-yellow-50 border-yellow-200'
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className='text-red-500 text-xs' role='alert'>
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                {t('auth.signUp.passwordLabel')}
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  placeholder={
                    t('auth.signUp.passwordPlaceholder') ?? '••••••••'
                  }
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </Button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className='text-red-500 text-xs' role='alert'>
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className='space-y-2'>
              <Label
                htmlFor='confirmPassword'
                className='text-sm font-medium text-gray-700'
              >
                {t('auth.signUp.confirmPasswordLabel')}
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  placeholder={
                    t('auth.signUp.passwordPlaceholder') ?? '••••••••'
                  }
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors'
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </Button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className='text-red-500 text-xs' role='alert'>
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Sign Up Button */}
            <Button
              type='submit'
              disabled={isLoading || !formik.isValid}
              className='w-full gradient-brand text-white hover:opacity-90 py-2.5 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed'
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

            {/* Divider */}
            <div className='flex items-center gap-3'>
              <Separator className='flex-1' />
              <span className='text-sm text-gray-500 px-2'>
                {t('auth.signIn.or')}
              </span>
              <Separator className='flex-1' />
            </div>

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
