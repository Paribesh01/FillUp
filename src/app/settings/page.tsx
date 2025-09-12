// src/app/settings/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/Sidebar";
import { toast } from "sonner"; // 1. Import toast

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Sync state with user when loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>You must be signed in to view this page.</div>;

  // Helper for initials fallback
  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await user.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      toast.success("Profile updated!");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error("Error updating profile.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Profile Information
              </h3>
              <div className="flex justify-center mb-8">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-2xl">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Update Profile
                  </Button>
                  <Button
                    type="button"
                    className="bg-gray-200 px-4 py-2 rounded"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
