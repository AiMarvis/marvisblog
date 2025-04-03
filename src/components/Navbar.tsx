import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-space-dark/90 border-b border-space-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-space-light hover:text-space-glow transition-colors">
            MARVIS
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === '/'
                  ? 'text-space-glow'
                  : 'text-space-light/70 hover:text-space-light'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium ${
                location.pathname === '/gallery'
                  ? 'text-space-glow'
                  : 'text-space-light/70 hover:text-space-light'
              } transition-colors`}
            >
              Gallery
            </Link>
            <Link
              to="/blog"
              className={`text-sm font-medium ${
                location.pathname === '/blog'
                  ? 'text-space-glow'
                  : 'text-space-light/70 hover:text-space-light'
              } transition-colors`}
            >
              Blog
            </Link>
            <Link
              to="/ai-tools"
              className={`text-sm font-medium ${
                location.pathname === '/ai-tools'
                  ? 'text-space-glow'
                  : 'text-space-light/70 hover:text-space-light'
              } transition-colors`}
            >
              AI Tools
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 