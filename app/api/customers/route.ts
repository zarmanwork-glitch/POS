import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      data: {
        results: customers,
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'server_error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = await prisma.customer.create({ data: body });
    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'server_error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}