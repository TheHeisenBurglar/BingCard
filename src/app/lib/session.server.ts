import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './definitions';

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string | Object, username: string) {
  const token = await new SignJWT({
    userId: typeof userId === 'object' && 'toString' in userId
      ? userId.toString()
      : String(userId),
    username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  (await cookies()).set('session', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
}


export async function deleteSession() {
  (await cookies()).delete('session');
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    const { userId, username } = payload as SessionPayload;

    return {
      userId:
        typeof userId === 'string'
          ? userId
          : userId && typeof (userId as any).toString === 'function'
          ? (userId as any).toString()
          : String(userId),
      username: String(username),
    };

  } catch (err) {
    return null;
  }
}

