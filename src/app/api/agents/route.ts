// app/api/agents/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Enhanced validation schema with detailed constraints
const agentCreateSchema = z.object({
  name: z.string()
    .min(1, 'Agent name is required')
    .max(100, 'Agent name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  personality: z.enum(['friendly', 'professional', 'enthusiastic', 'calm', 'witty']),
  voiceStyle: z.enum(['professional', 'conversational', 'authoritative', 'warm', 'energetic']),
  expertise: z.enum(['general', 'customer_support', 'sales', 'technical', 'healthcare']),
  greeting: z.string()
    .min(1, 'Greeting is required')
    .max(500, 'Greeting must be less than 500 characters')
    .trim(),
  tone: z.enum(['helpful', 'direct', 'empathetic', 'confident']),
  systemPrompt: z.string()
    .max(2000, 'System prompt must be less than 2000 characters')
    .optional()
    .nullable(),
  temperature: z.number()
    .min(0)
    .max(2)
    .default(0.7)
    .optional(),
  maxTokens: z.number()
    .min(100)
    .max(4000)
    .default(1000)
    .optional(),
  tags: z.array(z.string()).default([]).optional(),
});

// Query parameters schema for GET requests
const agentQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1).default(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100).default(10)).optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'training', 'archived']).optional(),
  expertise: z.enum(['general', 'customer_support', 'sales', 'technical', 'healthcare']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

/**
 * Helper function to get or create user
 */
async function getOrCreateUser(userId: string) {
  let user = await db.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@example.com`,
        name: 'User'
      }
    });
  }

  return user;
}

/**
 * POST /api/agents - Create a new agent
 */
export async function POST(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = agentCreateSchema.parse(body);

    const user = await getOrCreateUser(userId);

    // Generate default system prompt if not provided
    const systemPrompt = validatedData.systemPrompt || 
      `You are a ${validatedData.personality} assistant with ${validatedData.expertise} expertise. ` +
      `Your voice style is ${validatedData.voiceStyle} and your tone is ${validatedData.tone}. ` +
      `Greeting: ${validatedData.greeting}`;

    const agent = await db.agent.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        description: validatedData.description,
        personality: validatedData.personality,
        voiceStyle: validatedData.voiceStyle,
        expertise: validatedData.expertise,
        greeting: validatedData.greeting,
        tone: validatedData.tone,
        systemPrompt,
        temperature: validatedData.temperature || 0.7,
        maxTokens: validatedData.maxTokens || 1000,
        status: 'active',
        tags: validatedData.tags || [],
        metadata: {
          createdBy: userId,
          version: 1
        }
      }
    });

    // Log agent creation for audit trail
    await db.agentAuditLog.create({
      data: {
        agentId: agent.id,
        userId: user.id,
        action: 'created',
        changes: validatedData,
        timestamp: new Date()
      }
    }).catch(err => console.error('Failed to create audit log:', err));

    return NextResponse.json({
      success: true,
      data: agent,
      message: 'Agent created successfully'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }, 
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'An agent with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    console.error('Agent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents - Get all agents with filtering, search, and pagination
 */
export async function GET(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);
    
    const {
      page = 1,
      limit = 10,
      search,
      status,
      expertise,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = agentQuerySchema.parse(queryParams);

    const user = await getOrCreateUser(userId);

    // Build where clause for filtering
    const where: Prisma.AgentWhereInput = {
      userId: user.id,
      deletedAt: null, // Exclude soft-deleted agents
      ...(status && { status }),
      ...(expertise && { expertise }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { tags: { has: search } }
        ]
      })
    };

    // Get total count for pagination
    const totalCount = await db.agent.count({ where });

    // Get agents with pagination
    const agents = await db.agent.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            conversations: true,
            messages: true
          }
        }
      }
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: agents,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Agents fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}