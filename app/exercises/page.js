'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { EXERCISE_CATEGORIES, getExercisesByCategory, truncateWords } from '../../utils/exerciseData';
import { getCompletedExercises, toggleExerciseCompletion } from '../../utils/exerciseStorage';
import './exercise.css';

export default function Exercises() {
  const [completedExercises, setCompletedExercises] = useState([]);

  // Load completed exercises on mount
  useEffect(() => {
    const completed = getCompletedExercises();
    setCompletedExercises(completed);
  }, []);

  // Handle checkbox toggle
  const handleToggle = (exerciseId) => {
    const result = toggleExerciseCompletion(exerciseId);
    
    if (result.success) {
      // Update local state
      const completed = getCompletedExercises();
      setCompletedExercises(completed);
    } else {
      console.error('Failed to toggle exercise:', result.error);
    }
  };

  return (
    <>
     <Navbar />
      
      <div className="container">
        <div className="page-header">
          <h1>💪 Exercises</h1>
          <p>Track your daily workouts and build healthy habits</p>
        </div>

        {EXERCISE_CATEGORIES.map(category => {
          const exercises = getExercisesByCategory(category.id);
          
          return (
            <div key={category.id} className="exercise-category">
              <div className="category-header">
                <h2>{category.name}</h2>
                {category.description && <p>{category.description}</p>}
              </div>
              
              <div className="exercises-grid">
                {exercises.map(exercise => {
                  const isCompleted = completedExercises.includes(exercise.id);
                  
                  return (
                    <div 
                      key={exercise.id}
                      className={`exercise-card ${isCompleted ? 'completed' : ''}`}
                      data-exercise-id={exercise.id}
                    >
                      <div className="completion-status">✓ Completed</div>
                      
                      <input 
                        type="checkbox" 
                        className="exercise-checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggle(exercise.id)}
                      />

                      <h3 className="exercise-name">{exercise.name}</h3>
                      <p className="exercise-description">
                        {truncateWords(exercise.description, 20)}
                      </p>
                      <Link href={`/exercise_detail?id=${exercise.id}`} className="exercise-link">
                        View Details →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}