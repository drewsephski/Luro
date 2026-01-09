// app/api/agents/templates/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

const agentTemplates = [
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'Helpful agent for customer service and support',
    personality: 'friendly',
    voiceStyle: 'warm',
    expertise: 'customer_support',
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
    greeting: 'Welcome! I am here to help with your technical questions.',
    tone: 'direct',
    systemPrompt: 'You are a technical support specialist. Provide clear, step-by-step solutions.',
    tags: ['technical', 'troubleshooting']
  }
];

/**
 * GET /api/agents/templates - Get agent templates
 */
export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: agentTemplates
  });
}

/**
 * POST /api/agents/templates/[templateId] - Create agent from template
 */
export async function POST(
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

  } catch (error: any) {
    console.error('Template agent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}