// utils/exerciseAdapter.js
/**
 * ExerciseDB API Data Adapter
 * Converts ExerciseDB API format to Vitality app format
 * Ensures compatibility with existing completion tracking
 */

/**
 * Map ExerciseDB body parts to Vitality categories
 */
const BODY_PART_TO_CATEGORY = {
  // Upper Body
  'back': 1,
  'chest': 1,
  'shoulders': 1,
  'upper arms': 1,
  'upper legs': 1,
  
  // Lower Body
  'lower arms': 2,
  'lower legs': 2,
  
  // Core
  'waist': 3,
  
  // Cardio (exercises marked as cardio)
  'cardio': 4,
  
  // Default mapping for neck (can go to upper body)
  'neck': 1
};

/**
 * Convert ExerciseDB exercise to Vitality format
 * @param {Object} apiExercise - Exercise from ExerciseDB API
 * @returns {Object} Exercise in Vitality format
 */
export function adaptExercise(apiExercise) {
  if (!apiExercise) return null;

  // Determine category based on body part
  const categoryId = BODY_PART_TO_CATEGORY[apiExercise.bodyPart] || 1;

  // Import the getExerciseGifUrl function
  const { getExerciseGifUrl } = require('./exerciseDBapi');
  const rawUrl = getExerciseGifUrl(apiExercise.id);

  return {
    // Use the API ID for tracking
    id: apiExercise.id,
    
    // Exercise name - capitalize properly
    name: capitalizeExerciseName(apiExercise.name),
    
    // Map to one of our 4 categories
    categoryId: categoryId,
    
    // Use target as description (more specific than body part)
    description: `Targets ${apiExercise.target}. Equipment: ${apiExercise.equipment}.`,
    
    // Instructions (API doesn't provide this, so generate from data)
    instructions: generateInstructions(apiExercise),
    
    // Additional data from API
    bodyPart: apiExercise.bodyPart,
    target: apiExercise.target,
    equipment: apiExercise.equipment,
    
    // Construct GIF URL (180 resolution for BASIC plan)
  gifUrl: `/api/exercise?url=${encodeURIComponent(rawUrl)}`,
    
    // Flag to indicate this is from API
    source: 'api'
  };
}

/**
 * Convert array of ExerciseDB exercises
 * @param {Array} apiExercises - Array of exercises from API
 * @returns {Array} Array of adapted exercises
 */
export function adaptExercises(apiExercises) {
  if (!Array.isArray(apiExercises)) return [];
  return apiExercises.map(adaptExercise).filter(Boolean);
}

/**
 * Capitalize exercise name properly
 * "push-up" → "Push-up"
 * "3/4 sit-up" → "3/4 Sit-up"
 */
function capitalizeExerciseName(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => {
      // Keep numbers and special chars as-is
      if (/^\d/.test(word)) return word;
      
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Generate basic instructions from exercise data
 * This is a placeholder - ideally instructions would come from the API
 */
function generateInstructions(exercise) {
  const equipment = exercise.equipment === 'body weight' 
    ? 'no equipment' 
    : `a ${exercise.equipment}`;
  
  return `This exercise targets your ${exercise.target} and works your ${exercise.bodyPart}. ` +
    `You'll need ${equipment}. ` +
    `Focus on proper form and controlled movements. ` +
    `Start with 3 sets of 10-12 repetitions.`;
}

/**
 * Convert Vitality category ID to ExerciseDB body parts
 * Used for filtering
 */
export function getCategoryBodyParts(categoryId) {
  const categoryMap = {
    1: ['back', 'chest', 'shoulders', 'upper arms'], // Upper Body
    2: ['lower legs', 'lower arms'], // Lower Body
    3: ['waist'], // Core
    4: ['cardio'] // Cardio
  };
  
  return categoryMap[categoryId] || [];
}

/**
 * Get category name from ID
 */
export function getCategoryName(categoryId) {
  const categories = {
    1: 'Upper Body',
    2: 'Lower Body',
    3: 'Core',
    4: 'Cardio'
  };
  
  return categories[categoryId] || 'General';
}

/**
 * Group exercises by Vitality categories
 * @param {Array} exercises - Array of adapted exercises
 * @returns {Object} Exercises grouped by categoryId
 */
export function groupByCategory(exercises) {
  const grouped = {
    1: [], // Upper Body
    2: [], // Lower Body
    3: [], // Core
    4: []  // Cardio
  };
  
  exercises.forEach(exercise => {
    const catId = exercise.categoryId;
    if (grouped[catId]) {
      grouped[catId].push(exercise);
    }
  });
  
  return grouped;
}

/**
 * Filter exercises by search query
 * Searches across name, target, body part, equipment
 */
export function filterExercises(exercises, query) {
  if (!query || !query.trim()) return exercises;
  
  const searchTerm = query.toLowerCase().trim();
  
  return exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm) ||
    exercise.target.toLowerCase().includes(searchTerm) ||
    exercise.bodyPart.toLowerCase().includes(searchTerm) ||
    exercise.equipment.toLowerCase().includes(searchTerm)
  );
}

/**
 * Sort exercises by name
 */
export function sortExercisesByName(exercises, ascending = true) {
  return [...exercises].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return ascending ? comparison : -comparison;
  });
}

/**
 * Get unique equipment types from exercises
 */
export function getUniqueEquipment(exercises) {
  const equipment = new Set();
  exercises.forEach(ex => equipment.add(ex.equipment));
  return Array.from(equipment).sort();
}

/**
 * Get unique target muscles from exercises
 */
export function getUniqueTargets(exercises) {
  const targets = new Set();
  exercises.forEach(ex => targets.add(ex.target));
  return Array.from(targets).sort();
}

/**
 * Convert local exercise to API-compatible format
 * Used when falling back to local data
 */
export function adaptLocalExercise(localExercise) {
  return {
    ...localExercise,
    bodyPart: getBodyPartFromCategory(localExercise.categoryId),
    target: extractTargetFromDescription(localExercise.description),
    equipment: 'body weight', // Default for local exercises
    gifUrl: null, // No GIF for local exercises
    source: 'local'
  };
}

/**
 * Helper to get body part from category ID
 */
function getBodyPartFromCategory(categoryId) {
  const map = {
    1: 'upper body',
    2: 'lower body',
    3: 'core',
    4: 'cardio'
  };
  return map[categoryId] || 'general';
}

/**
 * Extract target muscle from description
 * Simple heuristic - can be improved
 */
function extractTargetFromDescription(description) {
  const lowerDesc = description.toLowerCase();
  
  const targets = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps',
    'abs', 'core', 'quads', 'hamstrings', 'glutes', 'calves'
  ];
  
  for (const target of targets) {
    if (lowerDesc.includes(target)) {
      return target;
    }
  }
  
  return 'general';
}