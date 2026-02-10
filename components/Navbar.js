'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>
            <Link href="/">Vitality</Link>
          </h2>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link href="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link href="/exercises" className="nav-link">Exercises</Link>
          </li>
          <li className="nav-item">
            <Link href="/progress" className="nav-link">My Progress</Link>
          </li>
          <li className="nav-item">
            <Link href="/health" className="nav-link">Health & Nutrition</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}