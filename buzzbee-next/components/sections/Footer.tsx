'use client';

export const Footer = () => {
  return (
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
              Your trusted platform for discovering and booking amazing events across Nepal.
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
                <a href="#" className="hover:text-accent transition-colors">
                  Create Event
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Verification
                </a>
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
  );
};
