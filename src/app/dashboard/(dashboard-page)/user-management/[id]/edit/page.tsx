import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState({ name: '', role: 'user' });

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data);
    }
    if (id) fetchUser();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    router.push('/user-management');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit User</h1>
      <label>
        Name:
        <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
      </label>
      <label>
        Role:
        <select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
}
