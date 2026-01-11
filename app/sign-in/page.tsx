'use client';

import { login } from '@/api/auth/auth.api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginBackground from '@/public/login_bg.svg';
import { useFormik } from 'formik';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '@/components/base-components/LanguageSwitch';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

// Error code mapping to i18n keys
const ERROR_CODE_MAP: Record<string, string> = {
  invalid_email_or_password: 'auth.signIn.errors.invalidEmailOrPassword',
  user_not_found: 'auth.signIn.errors.userNotFound',
  account_disabled: 'auth.signIn.errors.accountDisabled',
  invalid_credentials: 'auth.signIn.errors.invalidCredentials',
};

export default function SignInPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Validation Schema (uses i18n messages)
  const SignInValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.signIn.emailLabel') + ' is invalid')
      .required(t('auth.signIn.emailLabel') + ' is required'),
    password: Yup.string()
      .min(6, t('auth.signIn.passwordLabel') + ' must be at least 6 characters')
      .required(t('auth.signIn.passwordLabel') + ' is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SignInValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        await login({
          payload: {
            email: values.email,
            password: values.password,
          },
          successCallbackFunction: () => {
            router.push('/dashboard');
          },
        });
      } catch (err: unknown) {
        const error = err as Record<string, unknown>;

        // Get error code from response
        const errorCode =
          (
            (error?.response as Record<string, unknown>)?.data as Record<
              string,
              unknown
            >
          )?.code ||
          (
            (error?.response as Record<string, unknown>)?.data as Record<
              string,
              unknown
            >
          )?.error;
        const backendMessage = (
          (error?.response as Record<string, unknown>)?.data as Record<
            string,
            unknown
          >
        )?.message;

        // Map error code to i18n key
        const i18nKey = errorCode ? ERROR_CODE_MAP[errorCode as string] : null;

        // Get appropriate error message
        let errorMessage: string;
        if (i18nKey) {
          errorMessage = t(i18nKey);
        } else if (backendMessage) {
          errorMessage = backendMessage as string;
        } else {
          errorMessage = t('auth.signIn.errors.unexpectedError');
        }

        toast.error(errorMessage, { duration: 2000 });
        console.error('Sign in error:', err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[55%_45%] bg-white'>
      {/* Left Side - Background Image */}
      <div className='relative hidden lg:block bg-gray-50 overflow-hidden'>
        <Image
          src={loginBackground}
          alt='Login background illustration'
          fill
          className='contain'
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className='flex items-center justify-center py-8 px-6 lg:py-0 lg:px-8'>
        <div className='w-full max-w-sm space-y-8'>
          {/* Language Switch */}
          <div className='flex justify-end'>
            <LanguageSwitch />
          </div>

          {/* Logo/Brand */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900'>
              {t('auth.signIn.brand')}
            </h1>
            <p className='text-sm text-gray-600'>{t('auth.signIn.subtitle')}</p>
          </div>

          {/* Form */}
          <form
            className='space-y-[clamp(1rem,2vw,1.5rem)]'
            onSubmit={formik.handleSubmit}
          >
            {/* Email Field */}
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-sm font-medium text-gray-700'
              >
                {t('auth.signIn.emailLabel')}
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder={t('auth.signIn.emailPlaceholder')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 bg-yellow-50 border-yellow-200'
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className='text-red-500 text-xs'>{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                {t('auth.signIn.passwordLabel')}
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder={t('auth.signIn.passwordPlaceholder')}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200'
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
              {formik.touched.password && formik.errors.password && (
                <p className='text-red-500 text-xs'>{formik.errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='flex justify-end'>
              <Link
                href='#'
                className='text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
              >
                {t('auth.signIn.forgotPassword')}
              </Link>
            </div>

            {/* reCAPTCHA Notice */}
            <div className='flex items-center space-x-2'>
              <Checkbox id='recaptcha' />
              <span className='text-sm text-gray-600'>
                {t('auth.signIn.robot')}
              </span>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isLoading || !formik.isValid}
              className='w-full bg-blue-700 text-white hover:bg-blue-800 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <Spinner className='mr-2 h-5 w-5 text-white' />
                  {t('auth.signIn.signIn')}
                </>
              ) : (
                t('auth.signIn.signIn')
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

            {/* Sign Up Link */}
            <p className='text-center text-sm text-gray-600'>
              {t('auth.signIn.noAccount')}{' '}
              <Link
                href='/sign-up'
                className='font-semibold text-blue-600 hover:text-blue-700 transition-colors'
              >
                {t('auth.signUp.signUp')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
