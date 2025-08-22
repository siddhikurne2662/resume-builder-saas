// src/app/auth/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import Header from '../../components/Header';
import { CheckCircle, AlertCircle } from 'lucide-react';

import { Toaster, toast } from 'react-hot-toast';
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- PasswordStrengthIndicator component ---
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (pass : string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex space-x-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? strengthColors[strength - 1] : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strengthColors[strength - 1]?.replace('bg-', 'text-')}`}>
        {strengthLabels[strength - 1]}
      </p>
    </div>
  );
};
// --- End PasswordStrengthIndicator component ---


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        toast.error("Please correct the errors in the form.");
        return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: formData.name });
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            notifications: true,
            autoSave: true,
          }
        }, { merge: true });
      }

      toast.success('Registration successful! Redirecting...');
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Registration error:', error);
      let errorMessage = "Registration failed. Please try again.";
      if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
        if ((error as { code: string }).code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use.";
        } else if ((error as { code: string }).code === 'auth/invalid-email') {
          errorMessage = "The email address is not valid.";
        } else if ((error as { code: string }).code === 'auth/weak-password') {
          errorMessage = "Password is too weak. Please use a stronger password.";
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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
        }, { merge: true });
      }

      toast.success('Registered and logged in with Google successfully! Redirecting...');
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Google registration error:', error);
      let errorMessage = "Google registration failed. Please try again.";
      if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
        if ((error as { code: string }).code === 'auth/popup-closed-by-user') {
          errorMessage = "Google sign-in popup was closed.";
        } else if ((error as { code: string }).code === 'auth/cancelled-popup-request') {
          errorMessage = "Another popup was opened, please try again.";
        } else if ((error as { code: string }).code === 'auth/auth-domain-config-error' || (error as { code: string }).code === 'auth/configuration-not-found') {
          errorMessage = "Firebase Auth domain not configured. Check Firebase Console settings.";
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main background orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Additional floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-bounce delay-1000" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-bounce delay-2000" style={{animationDuration: '5s'}}></div>

        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400/30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-400/30 rotate-12 animate-pulse delay-700"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-purple-400/30 rotate-45 animate-pulse delay-1400"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(56,189,248,0.05),transparent)]"></div>
      </div>

      {/* Main Header */}
      <Header userName="" userProfileImageUrl="" /> {/* Pass empty strings as no user is logged in yet */}

      {/* Main Content (centered) */}
      <div className="flex-grow flex items-center justify-center p-4"> {/* Reduced padding */}
        <div className="w-full max-w-sm"> {/* Reduced from max-w-md to max-w-sm */}
          {/* Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl"> {/* Reduced padding from p-8 to p-6 */}
            {/* Header */}
            <div className="text-center mb-6"> {/* Reduced margin from mb-8 to mb-6 */}
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2> {/* Reduced from text-3xl to text-2xl */}
              <p className="text-slate-400 text-sm">Join ResumeCraft and build your perfect resume</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4"> {/* Reduced space from space-y-6 to space-y-4 */}
              <div>
                <FloatingLabelInput
                  id="name"
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1"> {/* Reduced margin */}
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <FloatingLabelInput
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1"> {/* Reduced margin */}
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <FloatingLabelInput
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                />
                <PasswordStrengthIndicator password={formData.password} />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1"> {/* Reduced margin */}
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <FloatingLabelInput
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1"> {/* Reduced margin */}
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                  <p className="mt-1 text-sm text-green-400 flex items-center gap-1"> {/* Reduced margin */}
                    <CheckCircle className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" // Reduced padding from py-4 to py-3
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4"> {/* Reduced margin from my-6 to my-4 */}
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="px-4 text-slate-400 text-sm">or</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" // Reduced padding from py-4 to py-3
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Footer */}
            <p className="text-center text-slate-400 mt-4 text-sm"> {/* Reduced margin and font size */}
              Already have an account?{' '}
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-6 text-slate-500 text-xs"> {/* Reduced gaps, margins, and font size */}
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {/* Reduced icon size */}
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Fast Setup</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}