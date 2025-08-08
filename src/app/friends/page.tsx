'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const router = useRouter();

  useEffect(() => {
  async function fetchFriends() {
    const res = await fetch(`/api/user/friends?type=friends`);
    const data = await res.json();
    if (data.success) setFriends(data.data);
  }
  fetchFriends();
}, []);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
      {friends?.length === 0 ? (
        <h2>No friends found</h2>
      ) : (
        <ul className="space-y-2">
          {friends?.map((f: any) => (
            <li key={f._id} className="border p-2 rounded">{f.username}</li>
          ))}
        </ul>
      )}
      <button className="btn mt-4" onClick={() => router.push('/friends/addfriends')}>
        Add Friends
      </button>
    </div>
  );
}
