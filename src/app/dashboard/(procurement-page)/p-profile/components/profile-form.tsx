'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface ProfileFormProps {
  user?: {
    department: string;
    section: string;
    alobsNo: string;
    saiNo: string;
    role: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [form, setForm] = useState({
    department: user?.department || '',
    section: user?.section || '',
    alobsNo: user?.alobsNo || '',
    saiNo: user?.saiNo || '',
    role: user?.role || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['department', 'section', 'alobsNo', 'saiNo', 'role'].map((field) => (
            <div key={field} className="flex flex-col space-y-1">
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
              />
            </div>
          ))}
        </form>
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
