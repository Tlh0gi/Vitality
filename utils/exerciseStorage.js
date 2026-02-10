// utils/exerciseStorage.js

import { getTodayDateString } from './quoteService';

// Get completed exercises for today
export function getCompletedExercises() {
  if (typeof window === 'undefined') return [];
  
  const today = getTodayDateString();
  const stored = localStorage.getItem('exerciseCompletions');
  
  if (!stored) return [];
  
  try {
    const completions = JSON.parse(stored);
    
    // Filter to only today's completions
    const todayCompletions = completions.filter(
      completion => completion.date === today
    );
    
    return todayCompletions.map(c => c.exerciseId);
  } catch (error) {
    console.error('Error parsing exercise completions:', error);
    return [];
  }
}

// Toggle exercise completion
export function toggleExerciseCompletion(exerciseId) {
  if (typeof window === 'undefined') return { completed: false };
  
  const today = getTodayDateString();
  const stored = localStorage.getItem('exerciseCompletions') || '[]';
  
  try {
    let completions = JSON.parse(stored);
    
    // Find if this exercise was completed today
    const existingIndex = completions.findIndex(
      c => c.exerciseId === exerciseId && c.date === today
    );
    
    let completed = false;
    
    if (existingIndex !== -1) {
      // Remove completion (toggle off)
      completions.splice(existingIndex, 1);
      completed = false;
    } else {
      // Add completion (toggle on)
      completions.push({
        exerciseId,
        date: today,
        timestamp: new Date().toISOString()
      });
      completed = true;
    }
    
    // Save back to localStorage
    localStorage.setItem('exerciseCompletions', JSON.stringify(completions));
    
    // Update stats
    updateExerciseStats();
    
    return { completed, success: true };
  } catch (error) {
    console.error('Error toggling exercise:', error);
    return { completed: false, success: false, error: error.message };
  }
}

// Update exercise stats (completions count and streak)
export function updateExerciseStats() {
  if (typeof window === 'undefined') return;
  
  const today = getTodayDateString();
  const stored = localStorage.getItem('exerciseCompletions') || '[]';
  
  try {
    const completions = JSON.parse(stored);
    
    // Count today's completions
    const todayCompletions = completions.filter(c => c.date === today).length;
    
    // Calculate streak
    const streak = calculateStreak(completions);
    
    // Save stats
    const stats = {
      completions: todayCompletions,
      streak: streak
    };
    
    localStorage.setItem('exerciseStats', JSON.stringify(stats));
    
    return stats;
  } catch (error) {
    console.error('Error updating exercise stats:', error);
    return { completions: 0, streak: 0 };
  }
}

// Calculate consecutive days of exercise
function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  // Get unique dates sorted in descending order
  const uniqueDates = [...new Set(completions.map(c => c.date))].sort().reverse();
  
  if (uniqueDates.length === 0) return 0;
  
  const today = getTodayDateString();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check each consecutive day
  for (let i = 0; i < uniqueDates.length; i++) {
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

// Get all exercise history
export function getExerciseHistory() {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('exerciseCompletions') || '[]';
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting exercise history:', error);
    return [];
  }
}

// Clear old completions (older than 90 days)
export function cleanupOldCompletions() {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('exerciseCompletions') || '[]';
  
  try {
    const completions = JSON.parse(stored);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];
    
    // Keep only completions from last 90 days
    const recent = completions.filter(c => c.date >= cutoffDate);
    
    localStorage.setItem('exerciseCompletions', JSON.stringify(recent));
  } catch (error) {
    console.error('Error cleaning up completions:', error);
  }
}