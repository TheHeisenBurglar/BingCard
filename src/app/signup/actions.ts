// /app/signup/actions.ts
'use server';

import { SignupFormSchema, type FormState } from '@/app/lib/definitions';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function signup(_: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const plainData = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plainData),
    });

    if (!response.ok) {
      return { message: 'Failed to create account' };
    }

    const result = await response.json();
    const user = result.data;

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

    return { success: true };
  } catch (err) {
    console.error(err);
    return { message: 'Server error. Try again later.' };
  }
}
