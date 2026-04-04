'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import QuoteCard from '../components/QuoteCard';

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
      
      <main className="min-h-screen">
        {/* Welcome Section */}
        <section className="bg-white py-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-5 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Welcome
            </h1>
            <p className="text-lg text-gray-600">
              Ready to crush your fitness goals today?
            </p>
          </div>
        </section>

        {/* Daily Quote Section */}
        <QuoteCard />

        {/* Dashboard Cards */}
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Exercises Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center flex flex-col">
                <div className="text-5xl mb-5">💪</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Exercises
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Browse and track your workouts
                </p>
                <Link 
                  href="/exercises" 
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Exercises
                </Link>
              </div>
 
              {/* Progress Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center flex flex-col">
                <div className="text-5xl mb-5">📊</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  My Progress
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Track your fitness journey
                </p>
                <Link 
                  href="/progress" 
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Progress
                </Link>
              </div>
 
              {/* Health Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center flex flex-col">
                <div className="text-5xl mb-5">🥗</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Health & Nutrition
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Learn about healthy eating
                </p>
                <Link 
                  href="/health" 
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Health Tips
                </Link>
              </div>
 
              {/* Today's Summary Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center flex flex-col">
                <div className="text-5xl mb-5">✅</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Today&apos;s Summary
                </h3>
                <div className="text-left mb-6 space-y-2 flex-grow">
                  <p className="text-gray-600">
                    Exercises completed:{' '}
                    <strong className="text-green-600">{todayCompletions}</strong>
                  </p>
                  <p className="text-gray-600">
                    Streak:{' '}
                    <strong className="text-green-600">
                      {userStreak} day{userStreak !== 1 ? 's' : ''}
                    </strong>
                  </p>
                </div>
                <Link 
                  href="/exercises" 
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
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