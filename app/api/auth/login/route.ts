import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'invalid_credentials', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: 'Login successful',
      data: {
        token: 'demo-token-123',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });

    response.cookies.set('authToken', 'demo-token-123', {
      httpOnly: false,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'server_error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}