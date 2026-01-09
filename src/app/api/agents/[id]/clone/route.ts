// app/api/agents/[id]/clone/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

/**
 * POST /api/agents/[id]/clone - Clone/duplicate an agent
 */
export async function POST(
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

    const originalAgent = await db.agent.findFirst({
      where: {
        id: params.id,
        userId: user.id,
        deletedAt: null
      }
    });

    if (!originalAgent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const newName = body.name || `${originalAgent.name} (Copy)`;

    // Clone the agent
    const clonedAgent = await db.agent.create({
      data: {
        userId: user.id,
        name: newName,
        description: originalAgent.description,
        personality: originalAgent.personality,
        voiceStyle: originalAgent.voiceStyle,
        expertise: originalAgent.expertise,
        greeting: originalAgent.greeting,
        tone: originalAgent.tone,
        systemPrompt: originalAgent.systemPrompt,
        temperature: originalAgent.temperature,
        maxTokens: originalAgent.maxTokens,
        status: 'inactive', // New clones start as inactive
        tags: originalAgent.tags,
        metadata: {
          clonedFrom: originalAgent.id,
          clonedAt: new Date().toISOString(),
          version: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: clonedAgent,
      message: 'Agent cloned successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Agent clone error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// app/api/agents/[id]/analytics/route.ts
// ============================================

/**
 * GET /api/agents/[id]/analytics - Get agent analytics and usage stats
 */
export async function GET_Analytics(
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

    const agent = await db.agent.findFirst({
      where: {
        id: params.id,
        userId: user.id,
        deletedAt: null
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      );
    }

    // Get conversation statistics
    const conversations = await db.conversation.findMany({
      where: { agentId: params.id },
      include: {
        messages: {
          select: {
            createdAt: true,
            role: true
          }
        }
      }
    });

    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce(
      (sum, conv) => sum + conv.messages.length,
      0
    );

    // Calculate daily usage over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = conversations
      .filter(conv => conv.createdAt >= thirtyDaysAgo)
      .reduce((acc, conv) => {
        const dateKey = conv.createdAt.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            conversations: 0,
            messages: 0
          };
        }
        acc[dateKey].conversations += 1;
        acc[dateKey].messages += conv.messages.length;
        return acc;
      }, {} as Record<string, any>);

    const usageData = Object.values(dailyUsage)
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate average response time and other metrics
    const avgMessagesPerConversation = totalConversations > 0
      ? (totalMessages / totalConversations).toFixed(1)
      : '0';

    // Get most active hours
    const messagesByHour = conversations.flatMap(conv => conv.messages)
      .reduce((acc, msg) => {
        const hour = msg.createdAt.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    const mostActiveHour = Object.entries(messagesByHour)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalConversations,
          totalMessages,
          avgMessagesPerConversation: parseFloat(avgMessagesPerConversation),
          mostActiveHour: parseInt(mostActiveHour as string)
        },
        usageData,
        createdAt: agent.createdAt,
        lastUsed: conversations[conversations.length - 1]?.createdAt || agent.createdAt
      }
    });

  } catch (error) {
    console.error('Agent analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// app/api/agents/templates/route.ts
// ============================================

const agentTemplates = [
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'Helpful agent for customer service and support',
    personality: 'friendly',
    voiceStyle: 'warm',
    expertise: 'customer-support',
    greeting: 'Hello! How can I assist you today?',
    tone: 'empathetic',
    systemPrompt: 'You are a helpful customer support agent. Be friendly, patient, and solution-oriented.',
    tags: ['support', 'customer-service']
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Confident agent for sales and lead qualification',
    personality: 'enthusiastic',
    voiceStyle: 'energetic',
    expertise: 'sales',
    greeting: 'Hi there! Let me help you find the perfect solution.',
    tone: 'confident',
    systemPrompt: 'You are a sales assistant. Be enthusiastic, highlight benefits, and guide towards conversion.',
    tags: ['sales', 'conversion']
  },
  {
    id: 'technical-support',
    name: 'Technical Support Specialist',
    description: 'Expert technical troubleshooting agent',
    personality: 'professional',
    voiceStyle: 'authoritative',
    expertise: 'technical',
    greeting: 'Welcome! I\'m here to help with your technical questions.',
    tone: 'direct',
    systemPrompt: 'You are a technical support specialist. Provide clear, step-by-step solutions.',
    tags: ['technical', 'troubleshooting']
  }
];

/**
 * GET /api/agents/templates - Get agent templates
 */
export async function GET_Templates(request: Request) {
  return NextResponse.json({
    success: true,
    data: agentTemplates
  });
}

/**
 * POST /api/agents/templates/[templateId] - Create agent from template
 */
export async function POST_FromTemplate(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = agentTemplates.find(t => t.id === params.templateId);
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      const newUser = await db.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@example.com`,
          name: 'User'
        }
      });
    }

    const body = await request.json().catch(() => ({}));
    const customName = body.name || template.name;

    const agent = await db.agent.create({
      data: {
        userId: user.id,
        name: customName,
        description: template.description,
        personality: template.personality as any,
        voiceStyle: template.voiceStyle as any,
        expertise: template.expertise as any,
        greeting: template.greeting,
        tone: template.tone as any,
        systemPrompt: template.systemPrompt,
        status: 'active',
        tags: template.tags,
        metadata: {
          createdFromTemplate: template.id,
          version: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: agent,
      message: `Agent created from ${template.name} template`
    }, { status: 201 });

  } catch (error) {
    console.error('Template agent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}