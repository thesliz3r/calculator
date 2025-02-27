import React from 'react';
import { Heart, Github, Linkedin, Mail, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary">
          <div className="flex items-center space-x-1">
            <span>© {currentYear} Abdulhuseyn Hasanov.</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> in Azerbaijan
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/thesliz3r"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/abdulhasanov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://www.instagram.com/abdul.hasanov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors flex items-center gap-1"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a 
              href="mailto:h.abdulhuseyn@gmail.com"
              className="hover:text-accent-primary transition-colors flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
            <a 
              href="/privacy"
              className="hover:text-accent-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 