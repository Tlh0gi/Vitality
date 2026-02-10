// utils/quoteService.js

const FALLBACK_QUOTES = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Fitness Wisdom"
  },
  {
    text: "Your body can do it. It's your mind you have to convince.",
    author: "Unknown"
  },
  {
    text: "A healthy outside starts from the inside.",
    author: "Robert Urich"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Exercise is king. Nutrition is queen. Put them together and you've got a kingdom.",
    author: "Jack LaLanne"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers"
  },
  {
    text: "Push yourself because no one else is going to do it for you.",
    author: "Unknown"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    text: "Don't wish for a good body, work for it.",
    author: "Unknown"
  }
];

// Get a random fallback quote
export function getRandomFallbackQuote() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[randomIndex];
}

// Get today's date string (YYYY-MM-DD)
export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Save quote to localStorage
export function saveQuoteToLocalStorage(quote, date) {
  if (typeof window !== 'undefined') {
    const quoteData = {
      quote,
      date
    };
    localStorage.setItem('dailyQuote', JSON.stringify(quoteData));
  }
}

// Get quote from localStorage
export function getQuoteFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dailyQuote');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored quote:', error);
        return null;
      }
    }
  }
  return null;
}

// Check if we need to fetch a new quote
export function shouldFetchNewQuote() {
  const stored = getQuoteFromLocalStorage();
  const today = getTodayDateString();
  
  // Fetch if no quote stored or if stored quote is from a different day
  return !stored || stored.date !== today;
}

// Main function to get daily quote (now uses only hardcoded quotes)
export async function getDailyQuote() {
  const today = getTodayDateString();
  
  // Check if we have a valid quote for today
  if (!shouldFetchNewQuote()) {
    const stored = getQuoteFromLocalStorage();
    return stored.quote;
  }

  // Get random quote from hardcoded list
  const newQuote = getRandomFallbackQuote();
  saveQuoteToLocalStorage(newQuote, today);
  
  return newQuote;
}

// Function for manual refresh - gets a new random quote
export async function fetchQuoteFromAPIs() {
  // Returns a random hardcoded quote instead of calling APIs
  return getRandomFallbackQuote();
}