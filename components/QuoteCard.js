'use client';

import { useState, useEffect } from 'react';
import { 
  getDailyQuote, 
  fetchQuoteFromAPIs, 
  saveQuoteToLocalStorage, 
  getTodayDateString 
} from '../utils/quoteService';

export default function QuoteCard() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to load quote
  const loadQuote = async () => {
    try {
      const dailyQuote = await getDailyQuote();
      setQuote(dailyQuote);
    } catch (error) {
      console.error('Error loading quote:', error);
      // Set a fallback quote if there's an error
      setQuote({
        text: "The only bad workout is the one that didn't happen.",
        author: "Fitness Wisdom"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadQuote();
  }, []);

  // Automatic midnight update checker
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Next midnight
      
      const timeUntilMidnight = midnight.getTime() - now.getTime();
      
      // Set timeout to refresh at midnight
      const timeoutId = setTimeout(async () => {
        console.log('Midnight reached - fetching new quote');
        await loadQuote();
        
        // Set up the next midnight check
        checkMidnight();
      }, timeUntilMidnight);

      return timeoutId;
    };

    // Start midnight checker
    const timeoutId = checkMidnight();

    // Cleanup
    return () => clearTimeout(timeoutId);
  }, []);

  // Check every minute if the date has changed (backup to timeout)
  useEffect(() => {
    const interval = setInterval(async () => {
      const stored = localStorage.getItem('dailyQuote');
      if (stored) {
        const { date } = JSON.parse(stored);
        const today = getTodayDateString();
        
        if (date !== today) {
          console.log('Date changed - fetching new quote');
          await loadQuote();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      const newQuote = await fetchQuoteFromAPIs();
      const today = getTodayDateString();
      
      saveQuoteToLocalStorage(newQuote, today);
      setQuote(newQuote);
      
      // Show success feedback briefly
      setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error('Error refreshing quote:', error);
      setIsRefreshing(false);
    }
  };

  if (isLoading || !quote) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-2xl text-center shadow-xl">
            <h3 className="mb-5 text-xl font-semibold">💪 Daily Motivation</h3>
            <blockquote className="mb-5">
              <p className="text-lg italic leading-relaxed transition-opacity duration-300">
                Loading...
              </p>
            </blockquote>
          </div>
        </div>
      </section>
    );
  }
 
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-2xl text-center shadow-xl">
          <h3 className="mb-5 text-xl font-semibold">💪 Daily Motivation</h3>
          <blockquote className="mb-5">
            <p 
              id="quote-text" 
              className="text-lg italic leading-relaxed transition-opacity duration-300 mb-4"
            >
              {quote.text}
            </p>
            <cite 
              id="quote-author" 
              className="text-sm opacity-90 transition-opacity duration-300 not-italic"
            >
              - {quote.author}
            </cite>
          </blockquote>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/20 border-2 border-white/30 text-white px-4 py-2 rounded-full cursor-pointer text-sm transition-all duration-300 mt-4 relative z-10 hover:bg-white/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isRefreshing ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 rounded-full border-t-white animate-spin mr-2" />
                Loading...
              </>
            ) : (
              '🔄 New Quote'
            )}
          </button>
          
          <div className="text-xs opacity-70 mt-2">
            Updated daily at midnight
          </div>
        </div>
      </div>
    </section>
  );
}