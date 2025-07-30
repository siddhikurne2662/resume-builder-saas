// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc as firebaseDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '../components/Header';
import { Home, FileText, ListOrdered, Settings, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ResumeCardProps {
  title: string;
  lastEdited: string;
  imageUrl: string;
  id: string;
  onDelete: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ title, lastEdited, imageUrl, id, onDelete }) => (
  <div className="flex items-stretch justify-between gap-4 rounded-xl border border-dark-border-medium bg-dark-bg-medium p-4 hover:shadow-lg hover:border-dark-border-light transition-all duration-300 relative group">
    <div className="flex flex-[2_2_0px] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-white text-base font-bold leading-tight font-outfit">{title}</p>
        <p className="text-dark-text-blue text-sm font-normal leading-normal font-inter">Last edited: {lastEdited}</p>
      </div>
      <Link href={`/builder?resumeId=${id}`} passHref>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 flex-row-reverse bg-dark-bg-card text-white text-sm font-medium leading-normal hover:bg-dark-border-light transition-colors font-inter">
          <span className="truncate">Edit</span>
        </button>
      </Link>
    </div>
    <div
      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    ></div>
    <button
      onClick={() => onDelete(id)}
      className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
      title="Delete Resume"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // 1. Authenticate User
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login');
      } else {
        setUser(currentUser);
        setLoadingAuth(false);
      }
    });
    return () => unsubscribeAuth();
  }, [auth, router]);

  // 2. Fetch User Resumes
  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!user) {
        setLoadingResumes(false);
        return;
      }

      setLoadingResumes(true);
      try {
        const resumesCollectionRef = collection(db, 'users', user.uid, 'resumes');
        const q = query(resumesCollectionRef, orderBy('lastUpdated', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedResumes: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedResumes.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUserResumes(fetchedResumes);
      } catch (error) {
        console.error("Error fetching user resumes:", error);
        toast.error("Failed to load your resumes.");
      } finally {
        setLoadingResumes(false);
      }
    };

    if (!loadingAuth && user) {
      fetchUserResumes();
    }
  }, [loadingAuth, user]);

  const handleDeleteResume = async (resumeId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a resume.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      try {
        await deleteDoc(firebaseDoc(db, 'users', user.uid, 'resumes', resumeId));
        setUserResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeId));
        toast.success("Resume deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting resume:", error);
        toast.error(`Error deleting resume: ${error.message}`);
      }
    }
  };


  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg-main text-white text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentUserName = user.displayName || user.email?.split('@')[0] || "User";
  const currentUserProfileImage = user.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main font-inter">
      <Header userName={currentUserName} userProfileImageUrl={currentUserProfileImage} />
      <div className="gap-1 px-4 sm:px-6 lg:px-6 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-80 lg:w-[280px] xl:w-[320px] bg-dark-bg-main p-4">
          <div className="flex h-full min-h-[700px] flex-col justify-between bg-dark-bg-main p-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ backgroundImage: `url("${currentUserProfileImage}")` }}
                ></div>
                {/* REMOVED: This h1 tag that displayed the user's name in the sidebar */}
                {/* <h1 className="text-white text-base font-medium leading-normal font-inter">{currentUserName}</h1> */}
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <Home className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Dashboard</p>
                </Link>
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg-card hover:bg-dark-bg-card transition-colors">
                  <FileText className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">My Resumes</p>
                </Link>
                <Link href="/templates" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <ListOrdered className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Templates</p>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <Settings className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Settings</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white text-4xl font-bold leading-tight min-w-72 font-outfit">My Resumes</p>
            <Link href="/templates" passHref>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-dark-bg-card text-white text-sm font-medium leading-normal hover:bg-dark-border-light transition-colors font-inter"
              >
                <span className="truncate">Create New Resume</span>
              </button>
            </Link>
          </div>

          <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 font-outfit">Your Current Resumes</h3>
          {loadingResumes ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-stretch justify-between gap-4 rounded-xl border border-dark-border-medium bg-dark-bg-medium p-4 animate-pulse">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-8 bg-slate-700 rounded-full w-24"></div>
                  </div>
                  <div className="w-full h-24 bg-slate-700 rounded-xl flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResumes.length === 0 ? (
                <p className="text-dark-text-blue px-4">You don't have any resumes yet. Click "Create New Resume" to get started!</p>
              ) : (
                userResumes.map(resume => (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    title={resume.title || resume.personalInfo?.name || 'Untitled Resume'}
                    lastEdited={resume.lastUpdated ? new Date(resume.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    imageUrl={resume.imageUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                    onDelete={handleDeleteResume}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}