'use client';

import { useActionState, useEffect } from 'react';
import { signup } from './actions';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
    const router = useRouter();
    useEffect(()=> {
        if (state?.success) {
            router.push('/')
        }
    }, [state, router]);
  return (
    <form action={formAction} method="post" className='fieldset mt-10 bg-base-200 border-base-300 rounded-box w-xs border m-auto p-4'>
      <div>
        <label htmlFor="username" className='label'>Username</label>
        <input 
            id="username" 
            name="username" 
            placeholder="Username" 
            type="text" 
        className='input validator'/>
        {state?.errors?.username && <p>{state.errors.username}</p>}
      </div>

      <div>
        <label htmlFor="password" className='label'>Password</label>
        <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className='input validator' 
            minLength={8} 
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" 
        />
        <p className="validator-hint">
            Must be more than 8 characters, including
            <br/>At least one number
            <br/>At least one lowercase letter
            <br/>At least one uppercase letter
        </p>
      </div>

      {state?.message && <p>{state.message}</p>}

      <button className='btn btn-primary' type="submit" disabled={pending}>Sign Up</button>
      <h1 className='m-auto'>OR</h1>
      <a className='btn btn-primary' href='/login'>login</a> 
    </form>
  );
}
