// src/app/components/AuthLayout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { initializeFirebase, db, auth } from '@/lib/firebase';
import LoadingSkeleton from './LoadingSkeleton';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase on the client side
    initializeFirebase();

    // Ensure auth is available before setting up the listener
    if (!auth) {
      console.error("Firebase Auth not initialized.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not authenticated, redirect to login page
        router.push('/auth/login');
      } else {
        // User is authenticated, stop loading
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg-main p-8">
        <div className="w-96 p-4 bg-dark-bg-card rounded-xl">
          <LoadingSkeleton lines={5} />
        </div>
      </div>
    );
  }

  // Render the children if the user is authenticated
  return <>{children}</>;
}
