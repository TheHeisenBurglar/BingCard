'use client';

import { useEffect } from 'react';
import { logout } from './actions';

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return <p>Logging out...</p>;
}
