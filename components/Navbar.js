'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className=" text-white bg-gradient-to-r from-green-600 to-teal-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center min-h-[70px] py-4 md:py-0">
        {/* Brand */}
        <div className="nav-brand">
          <Link href="/" className="text-white no-underline">
            <h2 className="text-2xl font-bold text-white">Vitality</h2>
          </Link>
        </div>

        {/* Navigation Menu */}
        <ul className="flex list-none gap-8 mt-4 md:mt-0 flex-wrap justify-center">
          <li>
            <Link 
              href="/" 
              className="text-white no-underline font-medium transition-all duration-300 px-4 py-2 rounded hover:bg-white/10 hover:-translate-y-0.5"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/exercises" 
              className="text-white no-underline font-medium transition-all duration-300 px-4 py-2 rounded hover:bg-white/10 hover:-translate-y-0.5"
            >
              Exercises
            </Link>
          </li>
          <li>
            <Link 
              href="/progress" 
              className="text-white no-underline font-medium transition-all duration-300 px-4 py-2 rounded hover:bg-white/10 hover:-translate-y-0.5"
            >
              My Progress
            </Link>
          </li>
          <li>
            <Link 
              href="/health" 
              className="text-white no-underline font-medium transition-all duration-300 px-4 py-2 rounded hover:bg-white/10 hover:-translate-y-0.5"
            >
              Health & Nutrition
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}