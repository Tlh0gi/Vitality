'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import QuoteCard from '../components/QuoteCard';
import './home.css';

export default function Home() {
  const [username, setUsername] = useState('Guest');
  const [todayCompletions, setTodayCompletions] = useState(0);
  const [userStreak, setUserStreak] = useState(0);

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }

      // Load exercise stats
      const stats = localStorage.getItem('exerciseStats');
      if (stats) {
        try {
          const { completions, streak } = JSON.parse(stats);
          setTodayCompletions(completions || 0);
          setUserStreak(streak || 0);
        } catch (error) {
          console.error('Error parsing exercise stats:', error);
        }
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="container">
            <h1>Welcome</h1>
            <p className="subtitle">Ready to crush your fitness goals today?</p>
          </div>
        </section>

        {/* Daily Quote Section */}
        <QuoteCard />

        {/* Dashboard Cards */}
        <section className="dashboard-section">
          <div className="container">
            <div className="dashboard-grid">
              {/* Exercises Card */}
              <div className="dashboard-card exercises-card">
                <div className="card-icon">💪</div>
                <h3>Exercises</h3>
                <p>Browse and track your workouts</p>
                 <Link href="/exercises" className="btn-primary">
                  View Exercises
                </Link>
              </div>

              {/* Progress Card */}
              <div className="dashboard-card progress-card">
                <div className="card-icon">📊</div>
                <h3>My Progress</h3>
                <p>Track your fitness journey</p>
                 <Link href="/exercises" className="btn-primary">
                  View Progress
                </Link>
              </div>

              {/* Health Card */}
              <div className="dashboard-card health-card">
                <div className="card-icon">🥗</div>
                <h3>Health & Nutrition</h3>
                <p>Learn about healthy eating</p>
                 <Link href="/exercises" className="btn-primary">
                  View Health Tips
                </Link>
              </div>

              {/* Today's Summary Card */}
              <div className="dashboard-card summary-card">
                <div className="card-icon">✅</div>
                <h3>Today&apos;s Summary</h3>
                <p className="summary-stats">
                  <span className="stat-item">
                    Exercises completed: <strong id="exercises-completed">{todayCompletions}</strong>
                  </span>
                  <span className="stat-item">
                    Streak: <strong id="current-streak">{userStreak} day{userStreak !== 1 ? 's' : ''}</strong>
                  </span>
                </p>
                <Link href="/exercises" className="btn-primary">
                  Quick Workout
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}