// utils/progressStats.js

import { getTodayDateString } from './quoteService';
import { getExerciseHistory } from './exerciseStorage';
import { getExerciseById } from './exerciseData';

// Get date string for X days ago
function getDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// Calculate current streak
export function calculateStreak() {
  const history = getExerciseHistory();
  
  if (!history || history.length === 0) return 0;
  
  // Get unique dates sorted in descending order
  const uniqueDates = [...new Set(history.map(c => c.date))].sort().reverse();
  
  if (uniqueDates.length === 0) return 0;
  
  const today = getTodayDateString();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check each consecutive day
  for (let i = 0; i < 365; i++) { // Max 365 day streak
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Get completions for this week
export function getWeeklyCompletions() {
  const history = getExerciseHistory();
  const weekAgo = getDateDaysAgo(7);
  
  return history.filter(c => c.date >= weekAgo).length;
}

// Get completions for this month
export function getMonthlyCompletions() {
  const history = getExerciseHistory();
  const monthAgo = getDateDaysAgo(30);
  
  return history.filter(c => c.date >= monthAgo).length;
}

// Get total all-time completions
export function getTotalCompletions() {
  const history = getExerciseHistory();
  return history.length;
}

// Get category breakdown with percentages
export function getCategoryBreakdown(daysBack = 30) {
  const history = getExerciseHistory();
  const cutoffDate = getDateDaysAgo(daysBack);
  
  // Filter to recent completions
  const recentCompletions = history.filter(c => c.date >= cutoffDate);
  
  if (recentCompletions.length === 0) return [];
  
  // Count completions by category
  const categoryCounts = {};
  
  recentCompletions.forEach(completion => {
    const exercise = getExerciseById(completion.exerciseId);
    if (!exercise) return;
    
    // Map categoryId to name
    const categoryNames = {
      1: 'Upper Body',
      2: 'Lower Body',
      3: 'Core',
      4: 'Cardio'
    };
    
    const categoryName = categoryNames[exercise.categoryId] || 'Other';
    
    if (!categoryCounts[categoryName]) {
      categoryCounts[categoryName] = 0;
    }
    categoryCounts[categoryName]++;
  });
  
  // Convert to array with percentages
  const categoryStats = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / recentCompletions.length) * 100)
  }));
  
  // Sort by count (highest first)
  categoryStats.sort((a, b) => b.count - a.count);
  
  return categoryStats;
}

// Get recent activity (last N completions)
export function getRecentActivity(limit = 10) {
  const history = getExerciseHistory();
  
  // Sort by timestamp (most recent first)
  const sorted = [...history].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Get exercise details for each completion
  const activities = sorted.slice(0, limit).map(completion => {
    const exercise = getExerciseById(completion.exerciseId);
    if (!exercise) return null;
    
    // Map categoryId to name
    const categoryNames = {
      1: 'Upper Body',
      2: 'Lower Body',
      3: 'Core',
      4: 'Cardio'
    };
    
    return {
      exercise: {
        name: exercise.name,
        category: {
          name: categoryNames[exercise.categoryId] || 'Other'
        }
      },
      date: completion.date,
      timestamp: completion.timestamp
    };
  }).filter(a => a !== null);
  
  return activities;
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateStr = date.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

// Get all progress stats in one call
export function getAllProgressStats() {
  return {
    currentStreak: calculateStreak(),
    weeklyCompletions: getWeeklyCompletions(),
    monthlyCompletions: getMonthlyCompletions(),
    totalExercises: getTotalCompletions(),
    categoryStats: getCategoryBreakdown(),
    recentActivities: getRecentActivity(10)
  };
}