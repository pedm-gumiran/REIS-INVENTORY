import React, { useEffect, useState } from 'react';
import axios from './api/axios.js';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users');
        console.log('Fetched users:', res.data);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading users...</div>;

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-5">Users List</h1>
      <table className="mx-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">User ID</th>
            <th className="px-4 py-2 border">Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td className="px-4 py-2 border">{user.user_id}</td>
              <td className="px-4 py-2 border">{user.user_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
