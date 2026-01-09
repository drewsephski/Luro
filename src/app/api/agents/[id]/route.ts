// app/api/agents/[id]/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const agentUpdateSchema = z.object({
  name: z.string()
    .min(1, 'Agent name is required')
    .max(100, 'Agent name must be less than 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  personality: z.enum(['friendly', 'professional', 'enthusiastic', 'calm', 'witty']).optional(),
  voiceStyle: z.enum(['professional', 'conversational', 'authoritative', 'warm', 'energetic']).optional(),
  expertise: z.enum(['general', 'customer_support', 'sales', 'technical', 'healthcare']).optional(),
  greeting: z.string()
    .min(1, 'Greeting is required')
    .max(500, 'Greeting must be less than 500 characters')
    .trim()
    .optional(),
  tone: z.enum(['helpful', 'direct', 'empathetic', 'confident']).optional(),
  status: z.enum(['active', 'inactive', 'training', 'archived']).optional(),
  systemPrompt: z.string()
    .max(2000, 'System prompt must be less than 2000 characters')
    .optional()
    .nullable(),
  temperature: z.number()
    .min(0)
    .max(2)
    .optional(),
  maxTokens: z.number()
    .min(100)
    .max(4000)
    .optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Helper to verify agent ownership
 */
async function verifyAgentOwnership(agentId: string, userId: string) {
  const user = await db.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) {
    return { error: 'User not found', status: 404, user: null, agent: null };
  }

  const agent = await db.agent.findFirst({
    where: { 
      id: agentId,
      userId: user.id,
      deletedAt: null // Exclude soft-deleted agents
    },
    include: {
      _count: {
        select: {
          conversations: true,
          messages: true
        }
      }
    }
  });

  if (!agent) {
    return { error: 'Agent not found or access denied', status: 404, user, agent: null };
  }

  return { error: null, status: 200, user, agent };
}

/**
 * GET /api/agents/[id] - Get a single agent by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error, status, agent } = await verifyAgentOwnership(params.id, userId);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // Get agent statistics
    const stats = await db.agent.findUnique({
      where: { id: params.id },
      select: {
        _count: {
          select: {
            conversations: true,
            messages: true
          }
        },
        conversations: {
          select: {
            createdAt: true,
            messages: {
              select: {
                createdAt: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    const lastUsed = stats?.conversations[0]?.createdAt || agent.createdAt;

    return NextResponse.json({
      success: true,
      data: {
        ...agent,
        stats: {
          totalConversations: stats?._count.conversations || 0,
          totalMessages: stats?._count.messages || 0,
          lastUsed
        }
      }
    });

  } catch (error) {
    console.error('Agent fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/[id] - Update an agent
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = agentUpdateSchema.parse(body);

    const { error, status, user, agent } = await verifyAgentOwnership(params.id, userId);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // Store original data for audit log
    const originalData = { ...agent };

    // Increment version in metadata
    const currentVersion = (agent.metadata as any)?.version || 1;
    const updatedMetadata = {
      ...(agent.metadata as object || {}),
      version: currentVersion + 1,
      lastModifiedBy: userId,
      lastModifiedAt: new Date().toISOString()
    };

    const updatedAgent = await db.agent.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        metadata: updatedMetadata,
        updatedAt: new Date()
      }
    });

    // Create audit log
    await db.agentAuditLog.create({
      data: {
        agentId: updatedAgent.id,
        userId: user.id,
        action: 'updated',
        changes: {
          before: originalData,
          after: validatedData
        },
        timestamp: new Date()
      }
    }).catch(err => console.error('Failed to create audit log:', err));

    return NextResponse.json({
      success: true,
      data: updatedAgent,
      message: 'Agent updated successfully'
    });

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
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }
    }
    
    console.error('Agent update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/[id] - Soft delete an agent
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    const { error, status, user, agent } = await verifyAgentOwnership(params.id, userId);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    if (hardDelete) {
      // Hard delete - permanently remove from database
      // Check if agent has conversations
      const hasConversations = agent._count.conversations > 0;
      
      if (hasConversations) {
        return NextResponse.json(
          { 
            error: 'Cannot permanently delete agent with existing conversations',
            suggestion: 'Archive the agent instead or delete conversations first'
          },
          { status: 409 }
        );
      }

      await db.agent.delete({
        where: { id: params.id }
      });

      return NextResponse.json({
        success: true,
        message: 'Agent permanently deleted',
        deletionType: 'hard'
      });

    } else {
      // Soft delete - mark as deleted but keep in database
      const deletedAgent = await db.agent.update({
        where: { id: params.id },
        data: {
          deletedAt: new Date(),
          status: 'archived'
        }
      });

      // Create audit log
      await db.agentAuditLog.create({
        data: {
          agentId: deletedAgent.id,
          userId: user.id,
          action: 'deleted',
          changes: { deletedAt: new Date() },
          timestamp: new Date()
        }
      }).catch(err => console.error('Failed to create audit log:', err));

      return NextResponse.json({
        success: true,
        message: 'Agent archived successfully',
        deletionType: 'soft',
        data: deletedAgent
      });
    }

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }
    }

    console.error('Agent delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agents/[id] - Restore a soft-deleted agent
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find agent including soft-deleted ones
    const agent = await db.agent.findFirst({
      where: { 
        id: params.id,
        userId: user.id
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      );
    }

    if (!agent.deletedAt) {
      return NextResponse.json(
        { error: 'Agent is not deleted' },
        { status: 400 }
      );
    }

    // Restore the agent
    const restoredAgent = await db.agent.update({
      where: { id: params.id },
      data: {
        deletedAt: null,
        status: 'active'
      }
    });

    // Create audit log
    await db.agentAuditLog.create({
      data: {
        agentId: restoredAgent.id,
        userId: user.id,
        action: 'restored',
        changes: { restoredAt: new Date() },
        timestamp: new Date()
      }
    }).catch(err => console.error('Failed to create audit log:', err));

    return NextResponse.json({
      success: true,
      message: 'Agent restored successfully',
      data: restoredAgent
    });

  } catch (error) {
    console.error('Agent restore error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}