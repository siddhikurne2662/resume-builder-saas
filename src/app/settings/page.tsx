// src/app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { Toaster, toast } from 'react-hot-toast';
import { UserCheck, Lock, Palette } from 'lucide-react'; // Icons for preferences
import { getAuth, updateProfile, updatePassword, signOut } from 'firebase/auth'; // Import Firebase Auth
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore
import { db } from '@/lib/firebase'; // Import initialized Firestore

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const auth = getAuth();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
  });

  // Load user profile and preferences from Firestore on component mount
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfile(prev => ({
            ...prev,
            name: userData.name || user.displayName || '',
            email: userData.email || user.email || '',
          }));
          setPreferences(prev => ({
            ...prev,
            theme: userData.preferences?.theme || 'dark',
            notifications: userData.preferences?.notifications !== undefined ? userData.preferences.notifications : true,
            autoSave: userData.preferences?.autoSave !== undefined ? userData.preferences.autoSave : true,
          }));
        }
      };
      fetchUserData();
    }
  }, [user]);


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    try {
      // Update display name in Firebase Auth
      if (profile.name !== user.displayName) {
        await updateProfile(user, { displayName: profile.name });
      }

      // Update password if new password fields are filled
      if (profile.newPassword && profile.newPassword === profile.confirmNewPassword) {
        // In a real app, you'd re-authenticate the user before updating password
        // to prevent recent login requirement errors.
        await updatePassword(user, profile.newPassword);
        toast.success("Password updated successfully!");
      } else if (profile.newPassword || profile.confirmNewPassword) {
        toast.error("New passwords do not match or are incomplete.");
        return;
      }

      // Save additional profile data to Firestore (like address, if added to profile state)
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: profile.name,
        email: profile.email, // Email change requires re-authentication and specific Firebase methods
        // Add other profile fields here if you expand the profile state
      }, { merge: true }); // Use merge to not overwrite other fields

      toast.success("Profile updated successfully!");
      setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));

    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(`Error updating profile: ${error.message}`);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!user) {
      toast.error("You must be logged in to save preferences.");
      return;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        preferences: preferences,
      }, { merge: true });
      toast.success("Preferences saved!");
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      toast.error(`Error saving preferences: ${error.message}`);
    }
  };

  const sampleUserName = user?.displayName || "Guest";
  const sampleUserProfileImage = user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Fallback image

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main font-inter">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header userName={sampleUserName} userProfileImageUrl={sampleUserProfileImage} />

      <div className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 bg-dark-bg-main p-4 rounded-xl shadow-lg border border-dark-border-medium">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white text-4xl font-bold leading-tight min-w-72 font-outfit">Settings</p>
          </div>

          {/* Tabs Navigation */}
          <div className="pb-3">
            <div className="flex border-b border-dark-border-light px-4 gap-8">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors font-inter ${
                  activeTab === 'account' ? 'border-blue-call-to-action text-white' : 'border-transparent text-dark-text-blue hover:text-dark-text-light'
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Account</p>
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors font-inter ${
                  activeTab === 'preferences' ? 'border-blue-call-to-action text-white' : 'border-transparent text-dark-text-blue hover:text-dark-text-light'
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Preferences</p>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'account' && (
            <>
              <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-outfit">Profile</h2>
              <div className="flex flex-col gap-4 px-4 py-3">
                <FloatingLabelInput id="name" name="name" label="Full Name" type="text" value={profile.name} onChange={handleProfileChange} />
                <FloatingLabelInput id="email" name="email" label="Email" type="email" value={profile.email} onChange={handleProfileChange} disabled /> {/* Email often disabled as it requires re-authentication and specific Firebase methods */}
                <FloatingLabelInput id="current-password" label="Current Password" type="password" name="currentPassword" value={profile.currentPassword} onChange={handleProfileChange} />
                <FloatingLabelInput id="new-password" label="New Password" type="password" name="newPassword" placeholder="Enter new password" value={profile.newPassword} onChange={handleProfileChange} />
                <FloatingLabelInput id="confirm-new-password" label="Confirm New Password" type="password" name="confirmNewPassword" placeholder="Confirm new password" value={profile.confirmNewPassword} onChange={handleProfileChange} />
              </div>
              <div className="flex px-4 py-3 justify-start">
                <button onClick={handleUpdateProfile} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue-call-to-action text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-button-hover transition-colors font-inter">
                  <span className="truncate">Update Profile</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'preferences' && (
            <>
              <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-outfit">Preferences</h2>
              <div className="flex flex-col gap-4 px-4 py-3">
                {/* Theme Selection */}
                <div className="flex items-center gap-4 bg-dark-bg-card px-4 min-h-[72px] py-2 justify-between rounded-lg border border-dark-border-light">
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1 font-inter flex items-center gap-2">
                      {/* Renamed Settings icon to UserCheck for consistency, or import Bell for notifications */}
                      <Palette className="h-5 w-5" /> Theme
                    </p>
                    <p className="text-dark-text-blue text-sm font-normal leading-normal line-clamp-2 font-inter">Choose your preferred application theme.</p>
                  </div>
                  <select
                    name="theme"
                    value={preferences.theme}
                    onChange={handlePreferencesChange}
                    className="form-select flex min-w-[120px] max-w-[480px] flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border border-dark-border-light bg-dark-bg-medium focus:border-dark-border-light h-10 placeholder:text-dark-text-blue p-2 text-base font-normal leading-normal"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(146,173,200)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")' }}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center gap-4 bg-dark-bg-card px-4 min-h-[72px] py-2 justify-between rounded-lg border border-dark-border-light">
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1 font-inter flex items-center gap-2">
                      <UserCheck className="h-5 w-5" /> Enable Notifications
                    </p>
                    <p className="text-dark-text-blue text-sm font-normal leading-normal line-clamp-2 font-inter">Receive updates about your resumes and account.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={preferences.notifications}
                    onChange={handlePreferencesChange}
                    className="form-checkbox h-6 w-6 text-blue-call-to-action rounded-full border-gray-400 focus:ring-blue-call-to-action bg-dark-bg-medium"
                  />
                </div>

                {/* Auto-Save Toggle */}
                <div className="flex items-center gap-4 bg-dark-bg-card px-4 min-h-[72px] py-2 justify-between rounded-lg border border-dark-border-light">
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-base font-medium leading-normal line-clamp-1 font-inter flex items-center gap-2">
                      <Lock className="h-5 w-5" /> Auto-Save Resumes
                    </p>
                    <p className="text-dark-text-blue text-sm font-normal leading-normal line-clamp-2 font-inter">Automatically save changes while you edit.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="autoSave"
                    checked={preferences.autoSave}
                    onChange={handlePreferencesChange}
                    className="form-checkbox h-6 w-6 text-blue-call-to-action rounded-full border-gray-400 focus:ring-blue-call-to-action bg-dark-bg-medium"
                  />
                </div>

              </div>
              <div className="flex px-4 py-3 justify-start">
                <button onClick={handleUpdatePreferences} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue-call-to-action text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-button-hover transition-colors font-inter">
                  <span className="truncate">Save Preferences</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}