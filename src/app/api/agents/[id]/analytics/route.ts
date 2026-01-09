// app/api/agents/[id]/analytics/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface DailyUsage {
  date: string;
  conversations: number;
  messages: number;
}

interface MessagesByHour {
  [key: number]: number;
}

/**
 * GET /api/agents/[id]/analytics - Get agent analytics and usage stats
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
      } as Prisma.AgentWhereInput
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
      (sum: number, conv: any) => sum + conv.messages.length,
      0
    );

    // Calculate daily usage over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = conversations
      .filter((conv: any) => conv.createdAt >= thirtyDaysAgo)
      .reduce((acc: Record<string, DailyUsage>, conv: any) => {
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
      }, {} as Record<string, DailyUsage>);

    const usageData = Object.values(dailyUsage)
      .sort((a: DailyUsage, b: DailyUsage) => a.date.localeCompare(b.date));

    // Calculate average response time and other metrics
    const avgMessagesPerConversation = totalConversations > 0
      ? (totalMessages / totalConversations).toFixed(1)
      : '0';

    // Get most active hours
    const messagesByHour = conversations.flatMap((conv: any) => conv.messages)
      .reduce((acc: MessagesByHour, msg: any) => {
        const hour = msg.createdAt.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as MessagesByHour);

    const mostActiveHour = Object.entries(messagesByHour)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 0;

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