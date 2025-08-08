'use client';

import { useEffect, useState } from 'react';

type User = {
  _id: string;
  username: string;
};

export default function AddFriendsPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const handleAddFriend = async (userId: string) => {
    try {
      const res = await fetch('/api/user/friends?type=all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: userId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Remove the user from the list so it disappears from UI
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        console.error('Failed to add friend:', data.message);
      }
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/friends');
        const data = await res.json();
        console.log('Fetched users:', data);

        if (data.success) {
          setUsers(data.data || []); // fallback to empty array
        } else {
          console.error('Failed to fetch users:', data.message);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const filtered = Array.isArray(users)
    ? users.filter((u) =>
        u.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Friends</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-4"
      />
      {filtered.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center"
            >
              <span>{user.username}</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleAddFriend(user._id)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
