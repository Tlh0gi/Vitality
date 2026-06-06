'use client';

import { useState, useEffect } from 'react';
import {
  getDailyQuote,
  fetchQuoteFromAPIs,
  saveQuoteToLocalStorage,
  getTodayDateString,
} from '../utils/quoteService';

import {
  BoltIcon,
  ArrowPathIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

function QuoteContent({ quote, isRefreshing, onRefresh }) {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-green-600 text-white px-8 py-10 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <BoltIcon className="w-5 h-5 opacity-90" />
        <h3 className="text-base font-semibold tracking-wide uppercase opacity-90">
          Daily Motivation
        </h3>
      </div>

      {/* Quote */}
      <div className="max-w-2xl mx-auto text-center mb-7">
        <ChatBubbleLeftRightIcon className="w-7 h-7 mx-auto mb-4 opacity-50" />
        <blockquote>
          <p className="text-xl italic leading-relaxed font-light mb-4">
            {quote?.text ?? 'Loading...'}
          </p>
          {quote?.author && (
            <cite className="text-sm opacity-80 not-italic tracking-wide">
              — {quote.author}
            </cite>
          )}
        </blockquote>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-medium px-5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Loading...' : 'New Quote'}
        </button>

        <span className="flex items-center gap-1.5 text-xs opacity-60 mt-1">
          <ClockIcon className="w-3.5 h-3.5" />
          Updated daily at midnight
        </span>
      </div>
    </div>
  );
}

export default function QuoteCard() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadQuote = async () => {
    try {
      const dailyQuote = await getDailyQuote();
      setQuote(dailyQuote);
    } catch (error) {
      console.error('Error loading quote:', error);
      setQuote({
        text: "The only bad workout is the one that didn't happen.",
        author: 'Fitness Wisdom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, []);

  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const timeUntilMidnight = midnight.getTime() - now.getTime();
      const timeoutId = setTimeout(async () => {
        await loadQuote();
        checkMidnight();
      }, timeUntilMidnight);
      return timeoutId;
    };
    const timeoutId = checkMidnight();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const stored = localStorage.getItem('dailyQuote');
      if (stored) {
        const { date } = JSON.parse(stored);
        if (date !== getTodayDateString()) await loadQuote();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newQuote = await fetchQuoteFromAPIs();
      saveQuoteToLocalStorage(newQuote, getTodayDateString());
      setQuote(newQuote);
      setTimeout(() => setIsRefreshing(false), 2000);
    } catch (error) {
      console.error('Error refreshing quote:', error);
      setIsRefreshing(false);
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-5xl mx-auto px-5">
        <QuoteContent
          quote={isLoading ? null : quote}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </div>
    </section>
  );
}