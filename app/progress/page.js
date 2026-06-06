'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { getAllProgressStats, formatDate } from '../../utils/stats';

import {
  FireIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TagIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

export default function Progress() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    weeklyCompletions: 0,
    monthlyCompletions: 0,
    totalExercises: 0,
    categoryStats: [],
    recentActivities: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const progressStats = getAllProgressStats();
    setStats(progressStats);
  }, []);

  const totalPages = Math.ceil(stats.recentActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = stats.recentActivities.slice(startIndex, endIndex);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const statCards = [
    {
      value: stats.currentStreak,
      label: `Day${stats.currentStreak !== 1 ? 's' : ''} Streak`,
      icon: FireIcon,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      value: stats.weeklyCompletions,
      label: 'This Week',
      icon: CalendarDaysIcon,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
    },
    {
      value: stats.totalExercises,
      label: 'Total Completed',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      value: stats.monthlyCompletions,
      label: 'This Month',
      icon: ChartBarIcon,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
    },
  ];

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Your Fitness Progress
        </h1>

        {/* Motivational Banner */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 py-5 rounded-2xl mb-8 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
            <BoltIcon className="w-8 h-8 shrink-0 opacity-90" />
            <div>
              <p className="font-semibold text-lg leading-tight">You&apos;re on fire!</p>
              <p className="text-sm opacity-85 mt-0.5">
                Keep it up — you&apos;re building healthy habits one day at a time.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ value, label, icon: Icon, color, bg, border }) => (
            <div
              key={label}
              className={`bg-white border ${border} rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`}
            >
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <span className={`text-4xl font-bold ${color}`}>{value}</span>
              <span className="text-sm text-gray-500 font-medium text-center">{label}</span>
            </div>
          ))}
        </div>

        {/* Exercise Categories */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-teal-500" />
            Exercise Categories
          </h2>

          {stats.categoryStats.length > 0 ? (
            <div className="space-y-1">
              {stats.categoryStats.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-medium text-gray-700 text-sm">{category.name}</span>

                  <div className="flex items-center gap-4">
                    {/* Progress bar */}
                    <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-green-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>

                    <span className="text-gray-400 text-sm w-10 text-right tabular-nums">
                      {category.percentage}%
                    </span>

                    <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full min-w-[2rem] text-center">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-14">
              <CheckCircleIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-600 mb-1">No exercises completed yet</h3>
              <p className="text-sm text-gray-400 mb-6">Start your fitness journey today!</p>
              <Link
                href="/exercises"
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors duration-200"
              >
                Browse Exercises
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {stats.recentActivities.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-teal-500" />
              Recent Activity
            </h2>

            <div>
              {currentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-700 text-sm">{activity.exercise.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activity.exercise.category.name} &bull; {formatDate(activity.date)}
                    </p>
                  </div>
                  <span className="text-teal-400">
                    <CheckCircleIcon className="w-5 h-5" />
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-teal-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Showing {startIndex + 1}–{Math.min(endIndex, stats.recentActivities.length)} of{' '}
                  {stats.recentActivities.length} activities
                </p>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            href="/exercises"
            className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-7 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <BoltIcon className="w-4 h-4" />
            Continue Workout
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium px-7 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}