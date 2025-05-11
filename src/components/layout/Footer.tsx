import React from 'react';
import { BookOpen, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-purple-700" />
            <span className="ml-2 text-lg font-bold text-gray-800">QuizBuilder</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-purple-700 transition">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-700 transition">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} QuizBuilder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;