'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import {
  getFeaturedExercises,
  searchExercises,
  getCategories,
  getDataSource,
  getExercisesByAppCategory
} from '../../utils/exerciseProvider';
import {
  getCompletedExercises,
  toggleExerciseCompletion
} from '../../utils/exerciseStorage';
import './exercise.css';

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredExercises, setFeaturedExercises] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryExercises, setCategoryExercises] = useState([]);
  const [dataSource, setDataSource] = useState('api');
  const [isLoading, setIsLoading] = useState(true);

  const categories = getCategories();

  // Load featured exercises on mount
  useEffect(() => {
    loadFeaturedExercises();
    loadCompletedExercises();
  }, []);

  // Check data source
  useEffect(() => {
    setDataSource(getDataSource());
  }, [featuredExercises]);

  async function loadFeaturedExercises() {
    setIsLoading(true);
    const response = await getFeaturedExercises();
    
    if (response.success) {
      setFeaturedExercises(response.data);
    }
    
    setIsLoading(false);
  }

  function loadCompletedExercises() {
    const completed = getCompletedExercises();
    setCompletedExercises(completed);
  }

  // Handle search
  async function handleSearch(query) {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setSelectedCategory(null);
      return;
    }

    setIsSearching(true);
    setSelectedCategory(null);
    
    const response = await searchExercises(query);
    
    if (response.success) {
      setSearchResults(response.data);
    }
  }

  // Handle category selection
  async function handleCategoryClick(categoryId) {
    if (selectedCategory === categoryId) {
      // Deselect category
      setSelectedCategory(null);
      setCategoryExercises([]);
      return;
    }

    setSelectedCategory(categoryId);
    setSearchQuery('');
    setIsSearching(false);
    
    const response = await getExercisesByAppCategory(categoryId);
    
    if (response.success) {
      setCategoryExercises(response.data);
    }
  }

  // Handle exercise completion toggle
  function handleToggle(exerciseId) {
    const result = toggleExerciseCompletion(exerciseId);
    
    if (result.success) {
      loadCompletedExercises();
    }
  }

  // Determine what to display
  function getDisplayContent() {
    if (isSearching && searchQuery.trim()) {
      return { type: 'search', data: searchResults };
    }
    
    if (selectedCategory) {
      return { type: 'category', data: categoryExercises };
    }
    
    return { type: 'featured', data: featuredExercises };
  }

  const displayContent = getDisplayContent();

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>💪 Exercises</h1>
          <p>Track your daily workouts and build healthy habits</p>
        </div>

        {/* Data Source Indicator */}
        {dataSource === 'local' && (
          <div className="data-source-notice">
            ℹ️ Using offline exercises. API quota may be exceeded.
          </div>
        )}

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <svg 
              className="search-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
            >
              <path 
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search exercises by name, target muscle, equipment..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => handleSearch('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {isSearching && (
          <div className="results-info">
            Found {searchResults.length} exercise{searchResults.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {selectedCategory && (
          <div className="results-info">
            {categoryExercises.length} exercise{categoryExercises.length !== 1 ? 's' : ''} in{' '}
            {categories.find(c => c.id === selectedCategory)?.name}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading exercises...</p>
          </div>
        )}

        {/* Exercise Display */}
        {!isLoading && (
          <>
            {/* Search Results */}
            {displayContent.type === 'search' && (
              <div className="search-results">
                {displayContent.data.length > 0 ? (
                  <div className="exercises-grid">
                    {displayContent.data.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        isCompleted={completedExercises.includes(exercise.id)}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>🔍 No exercises found for "{searchQuery}"</p>
                    <p>Try a different search term or browse by category</p>
                  </div>
                )}
              </div>
            )}

            {/* Category View */}
            {displayContent.type === 'category' && (
              <div className="category-results">
                {displayContent.data.length > 0 ? (
                  <div className="exercises-grid">
                    {displayContent.data.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        isCompleted={completedExercises.includes(exercise.id)}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No exercises found in this category</p>
                  </div>
                )}
              </div>
            )}

            {/* Featured Exercises by Category */}
            {displayContent.type === 'featured' && (
              <div className="featured-exercises">
                {categories.map((category) => {
                  const exercises = displayContent.data[category.id] || [];
                  
                  if (exercises.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="exercise-category">
                      <div className="category-header">
                        <div>
                          <h2>{category.name}</h2>
                          <p>{category.description}</p>
                        </div>
                        <button
                          className="view-all-btn"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          View All →
                        </button>
                      </div>
                      
                      <div className="exercises-grid">
                        {exercises.map((exercise) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            isCompleted={completedExercises.includes(exercise.id)}
                            onToggle={handleToggle}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// Exercise Card Component
function ExerciseCard({ exercise, isCompleted, onToggle }) {
  const [gifError, setGifError] = useState(false);
  const [gifLoading, setGifLoading] = useState(true);

  return (
    <div className={`exercise-card ${isCompleted ? 'completed' : ''}`}>
      {/* GIF Preview */}
      {exercise.gifUrl && !gifError ? (
        <div className="exercise-gif">
          {gifLoading && (
            <div className="gif-loading">
              <div className="gif-spinner"></div>
            </div>
          )}
          <img 
            src={exercise.gifUrl} 
            alt={exercise.name}
            onLoad={() => setGifLoading(false)}
            onError={() => {
              setGifError(true);
              setGifLoading(false);
            }}
            style={{ display: gifLoading ? 'none' : 'block' }}
          />
        </div>
      ) : (
        exercise.source === 'api' && (
          <div className="exercise-gif exercise-gif-placeholder">
            <div className="gif-placeholder-content">
              <span className="gif-placeholder-icon">🏋️</span>
              <span className="gif-placeholder-text">Exercise Demo</span>
            </div>
          </div>
        )
      )}
      
      {/* Completion Badge */}
      <div className="completion-status">
        ✓ Completed
      </div>
      
      {/* Completion Checkbox */}
      <input
        type="checkbox"
        className="exercise-checkbox"
        checked={isCompleted}
        onChange={() => onToggle(exercise.id)}
      />
      
      {/* Exercise Info */}
      <div className="exercise-info">
        <h3 className="exercise-name">{exercise.name}</h3>
        
        {/* Metadata Tags */}
        <div className="exercise-meta">
          {exercise.target && (
            <span className="meta-tag target-tag">
               {exercise.target}
            </span>
          )}
          {exercise.equipment && (
            <span className="meta-tag equipment-tag">
               {exercise.equipment}
            </span>
          )}
        </div>
        
        <p className="exercise-description">{exercise.description}</p>
        
        <Link 
          href={`/exercise_detail?id=${exercise.id}`}
          className="exercise-link"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}