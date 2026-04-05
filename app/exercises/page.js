'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function ExercisesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredExercises, setFeaturedExercises] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryExercises, setCategoryExercises] = useState([]);
  const [dataSource, setDataSource] = useState('api');
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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
    setShowCategoryModal(false);
    
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
  function handleToggle(e, exerciseId) {
    e.stopPropagation(); // Prevent card click
    const result = toggleExerciseCompletion(exerciseId);
    
    if (result.success) {
      loadCompletedExercises();
    }
  }

  // Handle card click - navigate to detail page
  function handleCardClick(exerciseId) {
    router.push(`/exercise_detail?id=${exerciseId}`);
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

  // Get selected category name for heading
  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : null;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
             Exercises
          </h1>
          <p className="text-lg text-gray-600">
            Track your daily workouts and build healthy habits
          </p>
        </div>

        {/* Data Source Indicator */}
        {dataSource === 'local' && (
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-3 rounded-xl text-center mb-6 font-medium">
             Using offline exercises. API quota may be exceeded.
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
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
              className="w-full pl-12 pr-12 py-4 text-base border-2 border-gray-200 rounded-full bg-white transition-all duration-300 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              placeholder="Search exercises by name, target muscle, equipment..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-gray-600 text-sm transition-all duration-200"
                onClick={() => handleSearch('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Select Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-white border-2 border-gray-200 hover:border-green-500 text-gray-700 px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <span></span>
            <span>{selectedCategoryName || 'All Exercises'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Category</h3>
              <div className="space-y-2">
                {/* All Exercises Option */}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCategoryExercises([]);
                    setShowCategoryModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    !selectedCategory 
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                   All Exercises
                </button>
                
                {/* Category Options */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {isSearching && (
          <div className="text-center text-gray-600 mb-6 text-sm">
            Found {searchResults.length} exercise{searchResults.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {selectedCategory && (
          <div className="text-center text-gray-600 mb-6 text-sm">
            {categoryExercises.length} exercise{categoryExercises.length !== 1 ? 's' : ''} in{' '}
            {selectedCategoryName}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading exercises...</p>
          </div>
        )}

        {/* Exercise Display */}
        {!isLoading && (
          <>
            {/* Search Results */}
            {displayContent.type === 'search' && (
              <div>
                {displayContent.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayContent.data.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        isCompleted={completedExercises.includes(exercise.id)}
                        onToggle={handleToggle}
                        onClick={handleCardClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <p className="text-xl mb-2">&#128542; No exercises found for "{searchQuery}"</p>
                    <p>Try a different search term or browse by category</p>
                  </div>
                )}
              </div>
            )}

            {/* Category View */}
            {displayContent.type === 'category' && (
              <div>
                {/* Category Heading */}
                {selectedCategoryName && (
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                      {selectedCategoryName}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {categories.find(c => c.id === selectedCategory)?.description}
                    </p>
                  </div>
                )}
                
                {displayContent.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayContent.data.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        isCompleted={completedExercises.includes(exercise.id)}
                        onToggle={handleToggle}
                        onClick={handleCardClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <p>No exercises found in this category</p>
                  </div>
                )}
              </div>
            )}

            {/* Featured Exercises by Category */}
            {displayContent.type === 'featured' && (
              <div className="space-y-12">
                {categories.map((category) => {
                  const exercises = displayContent.data[category.id] || [];
                  
                  if (exercises.length === 0) return null;
                  
                  return (
                    <div key={category.id}>
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl mb-6 flex justify-between items-center shadow-lg">
                        <div>
                          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'serif' }}>
                            {category.name}
                          </h2>
                          <p className="text-sm opacity-90">{category.description}</p>
                        </div>
                        <button
                          className="bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          View All →
                        </button>
                      </div>
                      
                      {/* Exercise Grid with Horizontal Scroll on Mobile */}
                      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.slice(0, 6).map((exercise) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            isCompleted={completedExercises.includes(exercise.id)}
                            onToggle={handleToggle}
                            onClick={handleCardClick}
                          />
                        ))}
                      </div>
                      
                      {/* Mobile: Horizontal Scroll */}
                      <div className="md:hidden overflow-x-auto pb-4 -mx-5 px-5">
                        <div className="flex gap-4" style={{ width: 'max-content' }}>
                          {exercises.slice(0, 6).map((exercise) => (
                            <div key={exercise.id} className="w-72">
                              <ExerciseCard
                                exercise={exercise}
                                isCompleted={completedExercises.includes(exercise.id)}
                                onToggle={handleToggle}
                                onClick={handleCardClick}
                              />
                            </div>
                          ))}
                        </div>
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
function ExerciseCard({ exercise, isCompleted, onToggle, onClick }) {
  const [gifError, setGifError] = useState(false);
  const [gifLoading, setGifLoading] = useState(true);

  return (
    <div 
      className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer relative flex flex-col hover:-translate-y-1 hover:shadow-xl ${
        isCompleted 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 hover:border-green-500'
      }`}
      onClick={() => onClick(exercise.id)}
    >
      {/* GIF Preview */}
      {exercise.gifUrl && !gifError ? (
        <div className="w-full h-44 bg-gray-100 relative flex items-center justify-center">
          {gifLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={exercise.gifUrl} 
            alt={exercise.name}
            className="w-11/12 h-11/12 object-cover"
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
          <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
            <span className="text-5xl opacity-50">🏋️</span>
            <span className="text-sm text-gray-500 font-semibold mt-2">Exercise Demo</span>
          </div>
        )
      )}
      
      {/* Completion Badge */}
      <div className={`absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-opacity duration-300 z-10 ${
        isCompleted ? 'opacity-100' : 'opacity-0'
      }`}>
        ✓ Completed
      </div>
      
      {/* Completion Checkbox */}
      <input
        type="checkbox"
        className="absolute top-3 right-3 w-6 h-6 cursor-pointer accent-green-500 z-10"
        checked={isCompleted}
        onChange={(e) => onToggle(e, exercise.id)}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Exercise Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
          {exercise.name}
        </h3>
        
        {/* Metadata Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.target && (
            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
              {exercise.target}
            </span>
          )}
          {exercise.equipment && (
            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
              {exercise.equipment}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
          {exercise.description}
        </p>
        
        <button 
          className="text-green-600 hover:text-green-700 font-semibold text-sm self-start hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onClick(exercise.id);
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
}