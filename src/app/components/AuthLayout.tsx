// src/app/components/AuthLayout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [auth, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg-main text-white text-lg">
        Loading...
      </div>
    );
  }

  // Render the children if the user is authenticated
  return <>{children}</>;
}