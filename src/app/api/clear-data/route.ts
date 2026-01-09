import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Clearing data for user:', userId);
    
    // Find the user
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete related data (reverse order of creation due to foreign keys)
    await db.analytics.deleteMany({
      where: { userId: user.id }
    });
    
    await db.post.deleteMany({
      where: { userId: user.id }
    });
    
    await db.campaign.deleteMany({
      where: { userId: user.id }
    });
    
    console.log('Data cleared successfully');
    
    return NextResponse.json({ 
      message: 'All your data has been cleared. Refresh the dashboard to see the empty state.' 
    });
    
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' }, 
      { status: 500 }
    );
  }
}