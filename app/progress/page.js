'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { getAllProgressStats, formatDate } from '../../utils/stats';
import './progress.css';

export default function Progress() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    weeklyCompletions: 0,
    monthlyCompletions: 0,
    totalExercises: 0,
    categoryStats: [],
    recentActivities: []
  });

  useEffect(() => {
    // Load all stats
    const progressStats = getAllProgressStats();
    setStats(progressStats);
  }, []);

  // Animate progress bars on mount
  useEffect(() => {
    const progressBars = document.querySelectorAll('.progress-fill');

    // Small delay to ensure CSS is loaded
    const timeoutId = setTimeout(() => {
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';

        // Animate to target width
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [stats.categoryStats]);

  return (
    <>
      <Navbar />
      
      <div className="progress-container">
        <h1 className="section-title">
          📈 Your Fitness Progress
        </h1>

        {/* Motivational Message */}
        {stats.currentStreak > 0 && (
          <div className="motivational-message">
            <h3>🔥 You&apos;re on fire!</h3>
            <p>Keep up the amazing work! You&apos;re building healthy habits one day at a time.</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card streak-card">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">
              Day{stats.currentStreak !== 1 ? 's' : ''} Streak
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{stats.weeklyCompletions}</div>
            <div className="stat-label">This Week</div>
          </div>

          <div className="stat-card total-card">
            <div className="stat-number">{stats.totalExercises}</div>
            <div className="stat-label">Total Completed</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{stats.monthlyCompletions}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="category-section">
          <h2 className="section-title">
            🎯 Exercise Categories
          </h2>

          {stats.categoryStats.length > 0 ? (
            stats.categoryStats.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-name">{category.name}</div>
                <div className="category-stats">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="category-percentage">{category.percentage}%</span>
                  <span className="category-count">{category.count}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏃‍♂️</div>
              <h3>No exercises completed yet</h3>
              <p>Start your fitness journey today!</p>
              <br />
              <Link href="/exercises" className="btn-primary">
                Browse Exercises
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {stats.recentActivities.length > 0 && (
          <div className="category-section">
            <h2 className="section-title">
              📅 Recent Activity
            </h2>

            {stats.recentActivities.map((activity, index) => (
              <div key={index} className="category-item">
                <div>
                  <div className="category-name">{activity.exercise.name}</div>
                  <small className="activity-date">
                    {activity.exercise.category.name} • {formatDate(activity.date)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          <Link href="/exercises" className="btn-primary">
            Continue Workout
          </Link>
          <Link href="/" className="btn-primary btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}