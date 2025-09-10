'use client';

import { useActionState, useEffect } from 'react';
import { login } from './actions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    console.log("State: ", state)
    if (state?.success) {
      router.push('/');
    }
  }, [state, router]);



  return (
    <form action={formAction} method="post" className="fieldset mt-10 bg-base-200 border-base-300 mx-auto rounded-box w-sm border p-10">
      <div>
        <label htmlFor="username" className="label">Username</label>
        <input
          id="username"
          name="username"
          placeholder="Username"
          type="text"
          className="input validator"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input validator"
          required
        />
      </div>
      {state?.message && <p className="text-error">{state.message}</p>}
      <button className='btn btn-primary btn-soft btn-circle py-5 btn-wide mx-auto mt-5' type="submit" disabled={pending}>Log In</button>
      <h1 className='m-auto'>OR</h1>
      <a className='btn btn-primary btn-soft btn-circle py-5 btn-wide mx-auto' href='/signup'>Sign Up</a>
    </form>
  );
}
