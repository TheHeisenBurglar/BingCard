import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session.server';

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await User.findById(session.userId);
  if (!currentUser) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  const type = req.nextUrl.searchParams.get('type') || 'friends';

  try {
    if (type === 'all') {
      // Return users excluding current user and friends
      const excludedIds = [session.userId, ...(currentUser.friends || [])];
      const otherUsers = await User.find({ _id: { $nin: excludedIds } });
      return NextResponse.json({ success: true, data: otherUsers }, { status: 200 });
    } else {
      // Return current user's friends only
      const friends = await User.find({ _id: { $in: currentUser.friends || [] } });
      return NextResponse.json({ success: true, data: friends }, { status: 200 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { friendId } = await req.json();

  try {
    const currentUser = await User.findById(session.userId);

    if (!currentUser.friends.includes(friendId)) {
      currentUser.friends.push(friendId);
      await currentUser.save();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error adding friend:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
