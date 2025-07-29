// src/app/auth/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { Toaster, toast } from 'react-hot-toast';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import GoogleAuthProvider and signInWithPopup
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import doc and setDoc
import { db } from '@/lib/firebase'; // Import db

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      // Redirect to dashboard or builder page
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;

      // Check if user already exists in Firestore, if not, create a basic entry
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            notifications: true,
            autoSave: true,
          }
        }, { merge: true }); // Use merge to avoid overwriting existing data if any
      }

      toast.success('Logged in with Google successfully!');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Google login error:', error);
      // Handle specific errors, e.g., 'auth/popup-closed-by-user'
      toast.error(`Google login failed: ${error.message}`);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main dark group/design-root overflow-x-hidden justify-center items-center" style={{ fontFamily: 'var(--font-inter), "Noto Sans", sans-serif' }}>
      <Toaster position="bottom-right" reverseOrder={false} />
      {/* Header taken from Stitch HTML for Auth pages */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#243647] px-10 py-3 w-full absolute top-0">
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            {/* SVG Logo for ResumeCraft */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_535)">
                <path fillRule="evenodd" clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_535"><rect width="48" height="48" fill="white"></rect></clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">ResumeCraft</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link href="#" className="text-white text-sm font-medium leading-normal">Templates</Link>
            <Link href="#" className="text-white text-sm font-medium leading-normal">Examples</Link>
            <Link href="#" className="text-white text-sm font-medium leading-normal">Pricing</Link>
          </div>
          <Link href="/auth/login" passHref>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#243647] text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Log In</span>
            </button>
          </Link>
        </div>
      </header>

      <div className="px-40 flex flex-1 justify-center py-5 w-full items-center"> {/* Centering container */}
        <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1 bg-dark-bg-card p-8 rounded-xl shadow-lg border border-dark-border-medium mx-auto"> {/* Added mx-auto */}
          <h2 className="text-white text-3xl font-bold text-center mb-6 font-outfit">Login to ResumeCraft</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <FloatingLabelInput
              id="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue-call-to-action text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-button-hover transition-colors font-inter"
            >
              <span className="truncate">Login</span>
            </button>
          </form>

          <div className="my-6 text-center text-dark-text-light">Or</div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal hover:bg-red-700 transition-colors font-inter"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-5 w-5 mr-2" />
            <span className="truncate">Sign in with Google</span>
          </button>

          <p className="text-center text-dark-text-light mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-call-to-action hover:underline">
              Register here
            </Link>
          </p>
          <Link href="/auth/forgot-password" passHref>
             <p className="text-center text-dark-text-light mt-2 text-sm font-normal leading-normal hover:underline cursor-pointer">Forgot password?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}