'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExerciseById, getCategoryById } from '../../utils/exerciseData';
import { getCompletedExercises, toggleExerciseCompletion } from '../../utils/exerciseStorage';

export default function ExerciseDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = parseInt(searchParams.get('id'));
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [exercise, setExercise] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!exerciseId) {
      router.push('/exercises');
      return;
    }

    // Get exercise data
    const exerciseData = getExerciseById(exerciseId);
    
    if (!exerciseData) {
      // Exercise not found, redirect to exercises page
      router.push('/exercises');
      return;
    }
    
    setExercise(exerciseData);
    
    // Get category data
    const categoryData = getCategoryById(exerciseData.categoryId);
    setCategory(categoryData);
    
    // Check if completed
    const completed = getCompletedExercises();
    setIsCompleted(completed.includes(exerciseId));
  }, [exerciseId, router]);

  const handleToggle = () => {
    const result = toggleExerciseCompletion(exerciseId);
    
    if (result.success) {
      setIsCompleted(result.completed);
    } else {
      console.error('Failed to toggle exercise:', result.error);
    }
  };

  if (!exercise) {
    return (
      <div className="detail-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <Link href="/exercises" className="back-link">
        ← Back to Exercises
      </Link>

      <div className="exercise-detail-card">
        <div className="exercise-header">
          <h1>{exercise.name}</h1>
          {category && (
            <span className="category-badge">{category.name}</span>
          )}
          
          <div className="completion-toggle" onClick={handleToggle}>
            <input 
              type="checkbox" 
              checked={isCompleted}
              onChange={handleToggle}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{isCompleted ? 'Completed Today' : 'Mark as Complete'}</span>
          </div>
        </div>

        <div className="exercise-content">
          {isCompleted ? (
            <div className="completion-status-banner">
              <span>✓</span>
              <span>Great job! You&apos;ve completed this exercise today.</span>
            </div>
          ) : (
            <div className="completion-status-banner not-completed">
              <span>💪</span>
              <span>Ready to crush this exercise?</span>
            </div>
          )}

          <div className="section">
            <h2>📋 Description</h2>
            <p>{exercise.description}</p>
          </div>

          <div className="section">
            <h2>📝 Instructions</h2>
            <div className="instructions-box">
              {exercise.instructions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}