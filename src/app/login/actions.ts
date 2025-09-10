'use server';

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import { redirect } from 'next/navigation';
import { SignupFormSchema, type FormState } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

export async function login(_: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  await dbConnect();

  const user = await User.findOne({ username });

  if (!user) {
    // console.log("username does not exist in database")
    return { message: 'Password or Username is incorrect.' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // console.log("Passwords do not match")
    return { message: 'Password or Username is incorrect.' };
  }

  const token = await new SignJWT({
    userId: user._id.toString(),
    username: user.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.SESSION_SECRET!));

  (await cookies()).set('session', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  });

  // Returning success flag so the client can redirect
  return { success: true };
}
