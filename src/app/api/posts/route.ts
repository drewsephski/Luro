import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const postSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  content: z.string().min(1, 'Content is required'),
  scheduledAt: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'published']).optional()
});

export async function GET(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        posts: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.posts);
  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        platform: validatedData.platform,
        content: validatedData.content,
        status: validatedData.status || 'draft',
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      );
    }
    
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}