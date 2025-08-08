import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await User.create({
      username: body.username,
      password: hashedPassword,
    });
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
