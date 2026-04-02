// utils/exerciseProvider.js
/**
 * Smart Exercise Provider
 * Tries ExerciseDB API first, falls back to local data on failure
 * Provides a unified interface for the entire app
 */

import {
  isAPIAvailable,
  getAllExercises,
  getExerciseById as getAPIExerciseById,
  getExercisesByBodyPart,
  getFeaturedExercisesByCategories,
  universalSearch,
  getBodyPartList,
  getTargetList,
  getEquipmentList
} from './exerciseDBapi';

import {
  adaptExercise,
  adaptExercises,
  getCategoryBodyParts,
  groupByCategory,
  filterExercises as filterAdaptedExercises,
  adaptLocalExercise
} from './exerciseAdapter';

import {
  EXERCISE_CATEGORIES,
  EXERCISES,
  getExercisesByCategory,
  getExerciseById as getLocalExerciseById,
  getCategoryById
} from './exerciseData';

// Cache for the current session (not localStorage - in-memory only)
let sessionCache = {
  usingAPI: true,
  lastAPICheck: null,
  bodyParts: null,
  targets: null,
  equipment: null
};

/**
 * Check if we should use API or fallback
 */
function shouldUseAPI() {
  // Check if we've explicitly disabled API in this session
  if (sessionCache.usingAPI === false) {
    return false;
  }
  
  // Check if API is available
  return isAPIAvailable();
}

/**
 * Mark API as unavailable for this session
 */
function disableAPIForSession() {
  sessionCache.usingAPI = false;
  console.warn('ExerciseDB API disabled for this session - using local data');
}

/**
 * Get all exercises (paginated from API or all from local)
 */
export async function getAllExercisesForApp(limit = 100) {
  if (shouldUseAPI()) {
    const response = await getAllExercises(limit, 0);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: adaptExercises(response.data),
        source: 'api'
      };
    }
    
    // API failed - disable and fallback
    disableAPIForSession();
  }
  
  // Fallback to local data
  const localExercises = EXERCISES.map(adaptLocalExercise);
  return {
    success: true,
    data: localExercises,
    source: 'local'
  };
}

/**
 * Get featured exercises by categories
 * Returns 4 exercises per category for the main page
 */
export async function getFeaturedExercises() {
  if (shouldUseAPI()) {
    // Get exercises for each of our 4 main categories
    const bodyParts = ['back', 'lower legs', 'waist', 'cardio'];
    const response = await getFeaturedExercisesByCategories(bodyParts);
    
    if (response.success && response.data) {
      // Adapt and organize by our category system
      const organized = {
        1: adaptExercises(response.data['back'] || []).slice(0, 4),
        2: adaptExercises(response.data['lower legs'] || []).slice(0, 4),
        3: adaptExercises(response.data['waist'] || []).slice(0, 4),
        4: adaptExercises(response.data['cardio'] || []).slice(0, 4)
      };
      
      return {
        success: true,
        data: organized,
        source: 'api'
      };
    }
    
    disableAPIForSession();
  }
  
  // Fallback: organize local exercises by category
  const organized = {};
  EXERCISE_CATEGORIES.forEach(category => {
    const exercises = getExercisesByCategory(category.id)
      .map(adaptLocalExercise)
      .slice(0, 4);
    organized[category.id] = exercises;
  });
  
  return {
    success: true,
    data: organized,
    source: 'local'
  };
}

/**
 * Get single exercise by ID
 */
export async function getExercise(exerciseId) {
  if (shouldUseAPI()) {
    const response = await getAPIExerciseById(exerciseId);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: adaptExercise(response.data),
        source: 'api'
      };
    }
    
    // Try local as fallback even if API was supposed to work
    // (Maybe the ID is from local data)
  }
  
  // Fallback to local
  const localExercise = getLocalExerciseById(exerciseId);
  if (localExercise) {
    return {
      success: true,
      data: adaptLocalExercise(localExercise),
      source: 'local'
    };
  }
  
  return {
    success: false,
    error: 'EXERCISE_NOT_FOUND'
  };
}

/**
 * Search exercises
 */
export async function searchExercises(query) {
  if (!query || !query.trim()) {
    return getAllExercisesForApp();
  }
  
  if (shouldUseAPI()) {
    const response = await universalSearch(query);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: adaptExercises(response.data),
        source: 'api'
      };
    }
    
    disableAPIForSession();
  }
  
  // Fallback: search local exercises
  const localExercises = EXERCISES.map(adaptLocalExercise);
  const filtered = filterAdaptedExercises(localExercises, query);
  
  return {
    success: true,
    data: filtered,
    source: 'local'
  };
}

/**
 * Get exercises by category (Vitality category ID)
 */
export async function getExercisesByAppCategory(categoryId) {
  if (shouldUseAPI()) {
    const bodyParts = getCategoryBodyParts(categoryId);
    const allExercises = [];
    
    // Fetch from each body part in this category
    for (const bodyPart of bodyParts) {
      const response = await getExercisesByBodyPart(bodyPart);
      if (response.success && response.data) {
        allExercises.push(...response.data);
      }
    }
    
    if (allExercises.length > 0) {
      return {
        success: true,
        data: adaptExercises(allExercises),
        source: 'api'
      };
    }
    
    disableAPIForSession();
  }
  
  // Fallback to local
  const localExercises = getExercisesByCategory(categoryId)
    .map(adaptLocalExercise);
  
  return {
    success: true,
    data: localExercises,
    source: 'local'
  };
}

/**
 * Get filter options (body parts, targets, equipment)
 */
export async function getFilterOptions() {
  // Try to get from session cache first
  if (sessionCache.bodyParts && sessionCache.targets && sessionCache.equipment) {
    return {
      success: true,
      data: {
        bodyParts: sessionCache.bodyParts,
        targets: sessionCache.targets,
        equipment: sessionCache.equipment
      },
      source: 'cache'
    };
  }
  
  if (shouldUseAPI()) {
    try {
      const [bodyPartsRes, targetsRes, equipmentRes] = await Promise.all([
        getBodyPartList(),
        getTargetList(),
        getEquipmentList()
      ]);
      
      if (bodyPartsRes.success && targetsRes.success && equipmentRes.success) {
        // Cache for session
        sessionCache.bodyParts = bodyPartsRes.data;
        sessionCache.targets = targetsRes.data;
        sessionCache.equipment = equipmentRes.data;
        
        return {
          success: true,
          data: {
            bodyParts: bodyPartsRes.data,
            targets: targetsRes.data,
            equipment: equipmentRes.data
          },
          source: 'api'
        };
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
    
    disableAPIForSession();
  }
  
  // Fallback: extract from local data
  const localExercises = EXERCISES.map(adaptLocalExercise);
  const bodyParts = [...new Set(localExercises.map(ex => ex.bodyPart))].sort();
  const targets = [...new Set(localExercises.map(ex => ex.target))].sort();
  const equipment = [...new Set(localExercises.map(ex => ex.equipment))].sort();
  
  return {
    success: true,
    data: { bodyParts, targets, equipment },
    source: 'local'
  };
}

/**
 * Get categories (always returns the 4 main Vitality categories)
 */
export function getCategories() {
  return EXERCISE_CATEGORIES;
}

/**
 * Get category by ID
 */
export function getCategory(categoryId) {
  return getCategoryById(categoryId);
}

/**
 * Check current data source
 */
export function getDataSource() {
  return sessionCache.usingAPI ? 'api' : 'local';
}

/**
 * Reset session (for testing or retry)
 */
export function resetSession() {
  sessionCache = {
    usingAPI: true,
    lastAPICheck: null,
    bodyParts: null,
    targets: null,
    equipment: null
  };
}