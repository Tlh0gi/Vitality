'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { getAllProgressStats, formatDate } from '../../utils/stats';

export default function Progress() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    weeklyCompletions: 0,
    monthlyCompletions: 0,
    totalExercises: 0,
    categoryStats: [],
    recentActivities: []
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination logic
  const totalPages = Math.ceil(stats.recentActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = stats.recentActivities.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-5 py-5">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Your Fitness Progress
        </h1>

        {/* Motivational Message */}
        {stats.currentStreak > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl text-center mb-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-2xl font-semibold mb-2"> You&apos;re on fire!</h3>
            <p className="text-base opacity-90">
              Keep up the amazing work! You&apos;re building healthy habits one day at a time.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Streak Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl font-bold text-amber-500 mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-lg text-gray-600 font-medium">
              Day{stats.currentStreak !== 1 ? 's' : ''} Streak
            </div>
          </div>

          {/* This Week Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl font-bold text-indigo-600 mb-1">
              {stats.weeklyCompletions}
            </div>
            <div className="text-lg text-gray-600 font-medium">
              This Week
            </div>
          </div>

          {/* Total Completed Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl font-bold text-green-500 mb-1">
              {stats.totalExercises}
            </div>
            <div className="text-lg text-gray-600 font-medium">
              Total Completed
            </div>
          </div>

          {/* This Month Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-5xl font-bold text-indigo-600 mb-1">
              {stats.monthlyCompletions}
            </div>
            <div className="text-lg text-gray-600 font-medium">
              This Month
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
             Exercise Categories
          </h2>

          {stats.categoryStats.length > 0 ? (
            <div>
              {stats.categoryStats.map((category, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="font-medium text-gray-700">
                    {category.name}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="progress-fill h-full bg-gradient-to-r from-green-400 to-green-800 transition-all duration-500 ease-out"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 font-medium w-12 text-right">
                      {category.percentage}%
                    </span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full font-medium text-sm">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-indigo-600">
              <h3 className="text-xl font-semibold mb-2">No exercises completed yet</h3>
              <p className="text-gray-600 mb-6">Start your fitness journey today!</p>
              <Link 
                href="/exercises" 
                className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Browse Exercises
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity with Pagination */}
        {stats.recentActivities.length > 0 && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
               Recent Activity
            </h2>

            {/* Activity List */}
            <div>
              {currentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="font-medium text-gray-700">
                    {activity.exercise.name}
                  </div>
                  <small className="text-gray-500 text-sm">
                    {activity.exercise.category.name} • {formatDate(activity.date)}
                  </small>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === pageNumber
                          ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, stats.recentActivities.length)} of {stats.recentActivities.length} activities
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center text-white mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/exercises" 
            className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Continue Workout
          </Link>
          <Link 
            href="/" 
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}