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
      <section className="quote-section">
        <div className="container">
          <div className="quote-card">
            <h3>Daily Motivation</h3>
            <blockquote className="daily-quote">
              <p>Loading...</p>
            </blockquote>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="quote-section">
      <div className="container">
        <div className="quote-card">
          <h3>Daily Motivation</h3>
          <blockquote className="daily-quote">
            <p id="quote-text">{quote.text}</p>
            <cite id="quote-author">- {quote.author}</cite>
          </blockquote>
          <button 
            className="refresh-quote-btn" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <span className="loading-spinner"></span> Loading...
              </>
            ) : (
              '🔄 New Quote'
            )}
          </button>
          <div className="quote-last-updated">
            Updated daily at midnight
          </div>
        </div>
      </div>
    </section>
  );
}