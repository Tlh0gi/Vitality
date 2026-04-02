'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExercise, getCategory } from '../../utils/exerciseProvider';
import {
  getCompletedExercises,
  toggleExerciseCompletion
} from '../../utils/exerciseStorage';

export default function ExerciseDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = searchParams.get('id');

  const [exercise, setExercise] = useState(null);
  const [category, setCategory] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dataSource, setDataSource] = useState('loading');

  useEffect(() => {
    loadExercise();
  }, [exerciseId, router]);

  async function loadExercise() {
    if (!exerciseId) {
      router.push('/exercises');
      return;
    }

    // Use the new provider system
    const response = await getExercise(exerciseId);

    if (!response.success || !response.data) {
      router.push('/exercises');
      return;
    }

    setExercise(response.data);
    setDataSource(response.source);

    // Get category information
    const cat = getCategory(response.data.categoryId);
    setCategory(cat);

    // Check if completed today
    const completedExercises = getCompletedExercises();
    setIsCompleted(completedExercises.includes(exerciseId));
  }

  function handleToggle() {
    const result = toggleExerciseCompletion(exerciseId);
    
    if (result.success) {
      setIsCompleted(result.completed);
    } else {
      console.error('Failed to toggle completion');
    }
  }

  // Loading state
  if (!exercise) {
    return (
      <div className="detail-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="detail-container">
      {/* Back Link */}
      <Link href="/exercises" className="back-link">
        ← Back to Exercises
      </Link>

      {/* Data Source Notice */}
      {dataSource === 'local' && (
        <div className="data-source-notice">
          ℹ️ This exercise is from offline data. API quota may be exceeded.
        </div>
      )}

      {/* Exercise Detail Card */}
      <div className="exercise-detail-card">
        {/* Header with category badge */}
        <div className="exercise-header">
          <div className="header-content">
            <h1>{exercise.name}</h1>
            {category && (
              <span className="category-badge">{category.name}</span>
            )}
          </div>

          {/* Completion Toggle */}
          <div className="completion-toggle" onClick={handleToggle}>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              onClick={(e) => e.stopPropagation()}
            />
            <span>
              {isCompleted ? 'Completed Today' : 'Mark as Complete'}
            </span>
          </div>
        </div>

        {/* Exercise GIF */}
        {exercise.gifUrl && (
          <div className="exercise-detail-gif">
            <img src={exercise.gifUrl} alt={exercise.name} />
          </div>
        )}

        {/* Exercise Content */}
        <div className="exercise-content">
          {/* Completion Status Banner */}
          <div className={`completion-status-banner ${isCompleted ? '' : 'not-completed'}`}>
            <span className="status-icon">{isCompleted ? '✓' : '💪'}</span>
            <span className="status-text">
              {isCompleted 
                ? 'Great job! You completed this exercise today.' 
                : 'Ready to crush this workout?'}
            </span>
          </div>

          {/* Exercise Metadata */}
          {(exercise.target || exercise.equipment || exercise.bodyPart) && (
            <div className="exercise-metadata">
              {exercise.target && (
                <div className="metadata-item">
                  <span className="metadata-label"> Target Muscle:</span>
                  <span className="metadata-value">{exercise.target}</span>
                </div>
              )}
              {exercise.equipment && (
                <div className="metadata-item">
                  <span className="metadata-label">Equipment:</span>
                  <span className="metadata-value">{exercise.equipment}</span>
                </div>
              )}
              {exercise.bodyPart && (
                <div className="metadata-item">
                  <span className="metadata-label">Body Part:</span>
                  <span className="metadata-value">{exercise.bodyPart}</span>
                </div>
              )}
            </div>
          )}

          {/* Description Section */}
          <div className="section">
            <h2>Description</h2>
            <p>{exercise.description}</p>
          </div>

          {/* Instructions Section */}
          <div className="section">
            <h2>Instructions</h2>
            <div className="instructions-box">
              {exercise.instructions}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className={`action-btn ${isCompleted ? 'btn-completed' : 'btn-primary'}`}
              onClick={handleToggle}
            >
              {isCompleted ? '✓ Completed' : 'Mark as Complete'}
            </button>
            <Link href="/exercises" className="action-btn btn-secondary">
              Back to Exercises
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}