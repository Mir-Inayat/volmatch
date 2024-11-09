import React from 'react';
import { Instagram, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/volunmatch/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://github.com/Mir-Inayat/volmatch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            {/* LinkedIn without URL */}
            <span className="text-gray-400 dark:text-gray-600 cursor-not-allowed">
              <Linkedin size={24} />
            </span>
            {/* Email without URL */}
            <span className="text-gray-400 dark:text-gray-600 cursor-not-allowed">
              <Mail size={24} />
            </span>
          </div>

          {/* Credits */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Made with ❤️ by QuadQuonCorers
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {currentYear} VolunMatch. All rights reserved.</p>
            <p>Copyright by QuadQuonCorers</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 