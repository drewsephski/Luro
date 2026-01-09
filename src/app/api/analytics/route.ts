import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { z } from 'zod';

const analyticsSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  metric: z.enum(['reach', 'engagement', 'impressions', 'clicks']),
  value: z.number().positive()
});

export async function POST(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = analyticsSchema.parse(body);

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create analytics record
    const analytics = await db.analytics.create({
      data: {
        userId: user.id,
        date: validatedData.date,
        metric: validatedData.metric,
        value: validatedData.value
      }
    });

    return NextResponse.json(analytics, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      );
    }
    
    console.error('Analytics creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        analytics: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}