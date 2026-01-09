import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request) {
  // Create a fresh Prisma client instance to avoid cached plan issues
  const prisma = new PrismaClient();
  
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Dashboard API called for user:', userId);

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        campaigns: true,
        posts: true,
        analytics: {
          orderBy: {
            date: 'desc'
          },
          take: 30 // Last 30 days of analytics
        }
      }
    });

    // Create user if doesn't exist
    if (!user) {
      console.log('Creating new user');
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@example.com`,
          name: 'User'
        },
        include: {
          campaigns: true,
          posts: true,
          analytics: true
        }
      });
      console.log('Created user:', user.id);
    }

    console.log('Processing dashboard data for user:', user.id);
    console.log('Campaigns count:', user.campaigns?.length || 0);
    console.log('Posts count:', user.posts?.length || 0);
    console.log('Analytics count:', user.analytics?.length || 0);

    // Calculate dashboard metrics
    const totalReach = user.analytics
      ?.filter(a => a.metric === 'reach')
      .reduce((sum, a) => sum + a.value, 0) || 0;
    
    const totalEngagement = user.analytics
      ?.filter(a => a.metric === 'engagement')
      .reduce((sum, a) => sum + a.value, 0) || 0;
    
    const activeCampaigns = user.campaigns?.filter(c => c.status === 'active').length || 0;
    const totalPosts = user.posts?.length || 0;

    console.log('Calculated metrics:', { totalReach, totalEngagement, activeCampaigns, totalPosts });

    // Get recent analytics data for chart
    const analyticsData = user.analytics
      ?.filter(a => ['reach', 'engagement'].includes(a.metric))
      .reduce((acc, curr) => {
        const dateKey = curr.date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = { name: dateKey, reach: 0, engagement: 0 };
        }
        if (curr.metric === 'reach') {
          acc[dateKey].reach += curr.value;
        } else if (curr.metric === 'engagement') {
          acc[dateKey].engagement += curr.value;
        }
        return acc;
      }, {} as Record<string, any>) || {};

    const chartData = Object.values(analyticsData)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-12); // Last 12 data points

    // Get recent posts for activity feed
    const recentPosts = user.posts
      ?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        platform: post.platform,
        content: post.content.substring(0, 50) + '...',
        status: post.status,
        likes: post.likes,
        shares: post.shares,
        createdAt: post.createdAt
      })) || [];

    const dashboardData = {
      metrics: {
        totalReach: Math.round(totalReach),
        engagementRate: totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(1) : '0.0',
        activeCampaigns,
        totalPosts
      },
      chartData,
      recentActivity: recentPosts
    };

    console.log('Returning dashboard data');
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message }, 
      { status: 500 }
    );
  } finally {
    // Disconnect the Prisma client to free up connections
    await prisma.$disconnect();
  }
}