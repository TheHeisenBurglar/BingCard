import dbConnect from '@/app/lib/mongodb';
import bingocard from '@/app/models/bingocard';
import User from '@/app/models/user';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session.server';

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');
    const updatedCard = await bingocard.findByIdAndUpdate(id, body)
    return NextResponse.json({ success: true, data: updatedCard })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message })
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const newCard = await bingocard.create({
      ...body,
      createdBy: session.userId,
    });

    return NextResponse.json({ success: true, data: newCard }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getSession();
  const type = req.nextUrl.searchParams.get('type'); // e.g., 'user', 'friends', etc.
  const id = req.nextUrl.searchParams.get('id');

  if (!type && !id) {
    return NextResponse.json({ success: false, message: 'Type query param required' }, { status: 400 });
  }

  try {
    /*if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }*/


    const currentUser = await User.findById(session?.userId);
    console.log("CURRENT USER", currentUser)
    const friends = currentUser?.friends || [];

    let query = {};

    if (type && session) {
      switch (type) {
        case 'user':
          query = { createdBy: session.userId };
          break;

        case 'friends':
          query = {
            createdBy: { $in: friends },
            friendsCanView: true,
          };
          break;

        case 'public':
          query = { public: true };
          break;

        case 'all':
          query = {
            $or: [
              { createdBy: session.userId },
              { public: true },
              { createdBy: { $in: friends }, friendsCanView: true },
            ],
          };
          break;

        default:
          return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
      }
    } else if (id) {
      query = { _id: id }
    }

    const cards = await bingocard.find(query)
      .populate({ path: 'createdBy', select: 'username' })
      .lean();

    const cardsWithAuthor = cards.map(card => ({
      ...card,
      author: card.createdBy?.username || 'Unknown',
    }));
    return NextResponse.json({ success: true, data: cardsWithAuthor }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
