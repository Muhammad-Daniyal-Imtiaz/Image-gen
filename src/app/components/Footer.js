'use client'
import React, { useState } from 'react';
import { Github, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const [theme, setTheme] = useState('bg-gray-800 text-gray-300'); // Default theme

  const themes = [
    { name: 'Dark Gray', value: 'bg-gray-800 text-gray-300' },
    { name: 'Light Gray', value: 'bg-gray-200 text-gray-800' },
    { name: 'Blue', value: 'bg-blue-500 text-white' },
    { name: 'Green', value: 'bg-green-500 text-white' },
    { name: 'Red', value: 'bg-red-500 text-white' },
    { name: 'Yellow', value: 'bg-yellow-500 text-gray-800' },
    { name: 'Purple', value: 'bg-purple-500 text-white' },
    { name: 'Orange', value: 'bg-orange-500 text-white' },
    { name: 'Teal', value: 'bg-teal-500 text-white' },
    { name: 'Pink', value: 'bg-pink-500 text-white' },
  ];

  return (
    <div>
      {/* Theme Selector */}
      <div className="py-4 bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4">
          <label htmlFor="theme" className="block mb-2">Select Footer Theme:</label>
          <select
            id="theme"
            className="p-2 border border-gray-700 rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map((t) => (
              <option key={t.name} value={t.value}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${theme} py-8`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2023 AI Image Generator. All rights reserved.</p>
              <p>Version 1.0.0</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
