'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

export async function isAuthenticated() {
  const token = await getAuthToken();
  return !!token;
}

export async function logout() {
  await clearAuthCookie();
  redirect('/sign-in');
}
