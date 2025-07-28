// src/app/settings/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { Toaster, toast } from 'react-hot-toast';
import { UserCheck, Lock, Palette } from 'lucide-react'; // Icons for preferences

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  const [profile, setProfile] = useState({
    name: 'Sophia Carter',
    email: 'sophia.carter@example.com',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdateProfile = () => {
    console.log("Updating profile:", profile);
    toast.success("Profile updated successfully!");
    setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
  };

  const handleUpdatePreferences = () => {
    console.log("Updating preferences:", preferences);
    toast.success("Preferences saved!");
  };

  const sampleUserName = "Sophia";
  const sampleUserProfileImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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
                <FloatingLabelInput id="name" label="Name" type="text" name="name" value={profile.name} onChange={handleProfileChange} />
                <FloatingLabelInput id="email" label="Email" type="email" name="email" value={profile.email} onChange={handleProfileChange} />
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
                      <Settings className="h-5 w-5" /> Enable Notifications
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