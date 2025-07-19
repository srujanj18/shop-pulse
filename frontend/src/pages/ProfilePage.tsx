import { useEffect, useState } from "react";
import { auth, provider } from "@/firebase";

import { useAuth } from "@/hooks/useAuth";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateEmail,
} from "firebase/auth";

const ProfilePage = () => {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 border max-w-md">
          <p className="mb-4">
            <span className="font-semibold text-gray-600">Name:</span>{" "}
            {user.name || "No name"}

          </p>
          <p className="mb-4">
            <span className="font-semibold text-gray-600">Email:</span>{" "}
            {user.email}
          </p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="max-w-md">
          <p className="text-muted-foreground mb-4">
            You're not logged in. Sign in to view your profile.
          </p>
          <button
            onClick={loginWithGoogle}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;