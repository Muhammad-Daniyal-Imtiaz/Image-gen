'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [theme, setTheme] = useState('bg-gradient-to-r from-red-500 to-yellow-500');

  // Available gradient themes
  const gradients = [
    'bg-gradient-to-r from-red-500 to-yellow-500',
    'bg-gradient-to-r from-blue-500 to-purple-500',
    'bg-gradient-to-r from-green-500 to-teal-500',
    'bg-gradient-to-r from-orange-500 to-pink-500',
    'bg-gradient-to-r from-gray-800 to-gray-200',
    'bg-gradient-to-r from-indigo-500 to-pink-500',
    'bg-gradient-to-r from-purple-400 to-blue-500',
    'bg-gradient-to-r from-red-400 to-yellow-400',
    'bg-gradient-to-r from-green-400 to-blue-400',
    'bg-gradient-to-r from-teal-400 to-purple-400',
  ];

  // Automatically change gradient every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTheme((prevTheme) => {
        const currentIndex = gradients.findIndex(g => g === prevTheme);
        const nextIndex = (currentIndex + 1) % gradients.length;
        return gradients[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [gradients]);

  return (
    <header className={`${theme} transition-all duration-1000 h-24 flex items-center justify-center`}>
      {/* Navigation */}
      <nav className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 flex animate-text">
          <span className="text-white">AI </span>
          <span className="text-white">Image </span>
          <span className="text-white">Generator</span>
        </h1>
      </nav>

      <style jsx>{`
        @keyframes colorChange {
          0% {
            color: rgba(255, 255, 255, 0.8);
          }
          50% {
            color: rgba(255, 255, 255, 1);
          }
          100% {
            color: rgba(255, 255, 255, 0.8);
          }
        }

        .animate-text {
          animation: colorChange 2s infinite alternate;
        }
      `}</style>
    </header>
  );
}