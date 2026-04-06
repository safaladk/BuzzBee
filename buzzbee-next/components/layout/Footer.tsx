"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export const Footer = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);

  const handleCreateEventClick = (e: React.MouseEvent) => {
    if (user?.role !== "organizer") {
      e.preventDefault();
      setShowOrganizerModal(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={showOrganizerModal}
        onClose={() => setShowOrganizerModal(false)}
        title="Organizer Access Required"
        size="md"
      >
        <div className="text-center py-4">
          <p className="text-gray-700 text-lg mb-6">
            Become an organizer and get verified to create an event
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowOrganizerModal(false)}
              icon={null}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowOrganizerModal(false);
                router.push("/signup");
              }}
              icon={null}
            >
              Sign Up as Organizer
            </Button>
          </div>
        </div>
      </Modal>

      <footer className="bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-brand-coral font-bold text-xl">B</span>
                </div>
                <span className="font-bold text-xl text-white">BuzzBee</span>
              </div>
              <p className="text-sm text-white opac ity-80 leading-relaxed">
                Your trusted platform for discovering and booking amazing events
                across Nepal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">For Organizers</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/organizer/create-event"
                    className="hover:text-accent transition-colors"
                    onClick={handleCreateEventClick}
                  >
                    Create Event
                  </Link>
                </li>
                <li>
                  {user?.role === "organizer" ? (
                    <Link
                      href="/organizer/dashboard"
                      className="hover:text-accent transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <span className="text-white/40 cursor-not-allowed">
                      Dashboard
                    </span>
                  )}
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Safety
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white opacity-80">
            <p>© 2025 BuzzBee. All rights reserved. Made by Safal</p>
          </div>
        </div>
      </footer>
    </>
  );
};
