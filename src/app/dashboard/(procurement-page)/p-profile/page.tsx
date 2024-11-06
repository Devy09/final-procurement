"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

interface ProfileData {
  department: string;
  section: string;
  alobsNo: string;
  saiNo: string;
  role: string;
}

export default function ProfilePage() {
  const { user } = useUser(); // Clerk user
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    department: "",
    section: "",
    alobsNo: "",
    saiNo: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        department: prev.department || "",
        section: prev.section || "",
        alobsNo: prev.alobsNo || "",
        saiNo: prev.saiNo || "",
        role: prev.role || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const result = await response.json();
      console.log('Profile updated:', result);
    } catch (error) {
      console.error(error);
    }
  };
  

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={user.fullName || ""}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={user.emailAddresses[0]?.emailAddress || ""}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={profile.department}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Section</label>
          <input
            type="text"
            name="section"
            value={profile.section}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">ALOBS No.</label>
          <input
            type="text"
            name="alobsNo"
            value={profile.alobsNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">SAI No.</label>
          <input
            type="text"
            name="saiNo"
            value={profile.saiNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <input
            type="text"
            name="role"
            value={profile.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
