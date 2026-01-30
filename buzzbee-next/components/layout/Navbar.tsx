'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogIn, Menu, Plus, User, X } from 'lucide-react';
import type { User as UserType } from '@/lib/types';
import { Button } from '../ui/Button';
import { useAuth } from '../providers/AuthContext';

interface NavbarProps {
  user: UserType | null;
  onAuthClick: () => void;
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">

            <Link href="/">
              <span className="font-bold text-2xl text-brand-coral cursor-pointer">
                BuzzBee
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="group relative text-gray-700 hover:text-brand-coral font-medium transition-colors">
              <span className="relative">
                Discover
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link href="#" className="group relative text-gray-700 hover:text-brand-coral font-medium transition-colors">
              <span className="relative">
                Categories
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link href="#" className="group relative text-gray-700 hover:text-brand-coral font-medium transition-colors">
              <span className="relative">
                About
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            {user?.role === 'organizer' && (
              <Button variant="outline" size="sm" icon={<Plus size={16} />} onClick={() => router.push('/organizer/create-event')}>
                Create Event
              </Button>
            )}
            <button className="relative p-2 text-gray-600 hover:text-brand-coral transition-colors">
              <Bell size={22} />
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User size={18} className="text-brand-coral" />
                  <span className="font-medium text-sm text-gray-700">{user.fullName || user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-red-500">
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => router.push('/login')} icon={<LogIn size={16} />}>
                Sign In
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link href="/events" className="group block text-gray-700 hover:text-brand-coral font-medium py-2">
              <span className="relative inline-block">
                Discover
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link href="#" className="group block text-gray-700 hover:text-brand-coral font-medium py-2">
              <span className="relative inline-block">
                Categories
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link href="#" className="group block text-gray-700 hover:text-brand-coral font-medium py-2">
              <span className="relative inline-block">
                About
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg mb-2">
                  <span className="font-medium text-sm text-gray-700">{user.fullName || user.email}</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-red-500 justify-start" onClick={logout} icon={null}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" className="w-full" onClick={handleAuthClick} icon={null}>
                Sign In
              </Button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};
