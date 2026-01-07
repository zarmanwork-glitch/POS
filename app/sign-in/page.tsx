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
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-[55%_45%]'>
      {/* Left Side - Background Image */}
      <div className='hidden md:block relative '>
        <Image
          src={loginBackground}
          alt='Login background illustration'
          fill
          className='contain'
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className='flex flex-col items-center justify-center bg-white h-screen md:h-auto'>
        <div className='w-full max-w-md overflow-y-auto max-h-[80vh] md:max-h-none px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12'>
          <div className='flex justify-end mb-4'>
            <LanguageSwitch />
          </div>
          {/* Logo/Brand */}
          <div className='mb-8 text-center'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
              {t('auth.signIn.brand')}
            </h1>
            <p className='text-gray-500 text-sm md:text-base'>
              {t('auth.signIn.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form
            className='space-y-5 md:space-y-6'
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
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder={t('auth.signIn.emailPlaceholder')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 bg-yellow-50 border-yellow-200 text-sm md:text-base'
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
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder={t('auth.signIn.passwordPlaceholder')}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='pl-10 pr-10 bg-yellow-50 border-yellow-200 text-sm md:text-base'
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
              {formik.touched.password && formik.errors.password && (
                <p className='text-red-500 text-xs'>{formik.errors.password}</p>
              )}
            </div>

            {/* Show Password & Forgot Password */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
              <Link
                href='#'
                className='text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium transition'
              >
                {t('auth.signIn.forgotPassword')}
              </Link>
            </div>

            {/* reCAPTCHA Notice */}
            <div className='flex items-center space-x-2'>
              <Checkbox id='recaptcha' />
              <span className='text-xs text-gray-600'>
                {t('auth.signIn.robot')}
              </span>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isLoading || !formik.isValid}
              className='w-full bg-blue-700 text-white hover:bg-blue-800 text-base py-2 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <Spinner className='h-5 w-5 text-white mx-auto' />
              ) : (
                t('auth.signIn.signIn')
              )}
            </Button>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  {t('auth.signIn.or')}
                </span>
              </div>
            </div>

            {/* Alternative Login */}

            {/* Sign Up Link */}
            <p className='text-center text-xs md:text-sm text-gray-600'>
              {t('auth.signIn.noAccount')}{' '}
              <Link
                href='/sign-up'
                className='font-semibold text-blue-600 hover:text-blue-700 transition'
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
