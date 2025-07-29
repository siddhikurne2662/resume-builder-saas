// src/app/auth/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Toaster, toast } from 'react-hot-toast';
import FloatingLabelInput from '@/app/components/FloatingLabelInput'; // Assuming this path

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const auth = getAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email!');
      // Redirect to a confirmation page
      window.location.href = '/auth/password-reset-confirmation';
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(`Failed to send reset link: ${error.message}`);
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
          <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Forgot your password?</h2>
          <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 px-4 py-3">
            <FloatingLabelInput
              id="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#1473cc] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Send Reset Link</span>
            </button>
          </form>
          <Link href="/auth/login" passHref>
            <p className="text-[#92aec8] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center hover:underline cursor-pointer">Remember your password? Sign in</p>
          </Link>
        </div>
      </div>
    </div>
  );
}