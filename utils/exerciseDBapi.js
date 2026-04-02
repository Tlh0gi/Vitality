// utils/exerciseDbApi.js
/**
 * ExerciseDB API Service
 * Handles all API calls to ExerciseDB via RapidAPI
 * No caching - fresh requests per API terms
 */

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// API call quota tracking
let apiCallsRemaining = true;

/**
 * Generic fetch wrapper for ExerciseDB API
 */
async function fetchFromAPI(endpoint) {
  if (!RAPIDAPI_KEY) {
    console.error('ExerciseDB API key not found');
    return { success: false, error: 'API_KEY_MISSING' };
  }

  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    
    // Check for quota exceeded (429) or other errors
    if (response.status === 429) {
      console.warn('ExerciseDB API quota exceeded');
      apiCallsRemaining = false;
      return { success: false, error: 'QUOTA_EXCEEDED' };
    }

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return { success: false, error: 'API_ERROR', status: response.status };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error('ExerciseDB API fetch error:', error);
    return { success: false, error: 'FETCH_ERROR', message: error.message };
  }
}

/**
 * Check if API is available
 */
export function isAPIAvailable() {
  return apiCallsRemaining && !!RAPIDAPI_KEY;
}

/**
 * Reset API availability flag (for retry logic)
 */
export function resetAPIAvailability() {
  apiCallsRemaining = true;
}

// ============================================================================
// EXERCISE ENDPOINTS
// ============================================================================

/**
 * Get all exercises (paginated)
 * @param {number} limit - Number of exercises to return (default: 0 = all)
 * @param {number} offset - Offset for pagination (default: 0)
 */
export async function getAllExercises(limit = 0, offset = 0) {
  let endpoint = '/exercises';
  
  if (limit > 0) {
    endpoint += `?limit=${limit}&offset=${offset}`;
  }
  
  return await fetchFromAPI(endpoint);
}

/**
 * Get exercise by ID
 * @param {string} exerciseId - Exercise ID
 */
export async function getExerciseById(exerciseId) {
  return await fetchFromAPI(`/exercises/exercise/${exerciseId}`);
}

/**
 * Get exercises by body part
 * @param {string} bodyPart - Body part name (e.g., 'back', 'chest', 'legs')
 */
export async function getExercisesByBodyPart(bodyPart) {
  return await fetchFromAPI(`/exercises/bodyPart/${bodyPart}`);
}

/**
 * Get exercises by target muscle
 * @param {string} target - Target muscle (e.g., 'biceps', 'triceps')
 */
export async function getExercisesByTarget(target) {
  return await fetchFromAPI(`/exercises/target/${target}`);
}

/**
 * Get exercises by equipment
 * @param {string} equipment - Equipment name (e.g., 'dumbbell', 'barbell')
 */
export async function getExercisesByEquipment(equipment) {
  return await fetchFromAPI(`/exercises/equipment/${equipment}`);
}

/**
 * Search exercises by name
 * @param {string} name - Exercise name to search for
 */
export async function searchExercisesByName(name) {
  return await fetchFromAPI(`/exercises/name/${name}`);
}

// ============================================================================
// LIST ENDPOINTS (for filters/categories)
// ============================================================================

/**
 * Get list of all body parts
 */
export async function getBodyPartList() {
  return await fetchFromAPI('/exercises/bodyPartList');
}

/**
 * Get list of all target muscles
 */
export async function getTargetList() {
  return await fetchFromAPI('/exercises/targetList');
}

/**
 * Get list of all equipment types
 */
export async function getEquipmentList() {
  return await fetchFromAPI('/exercises/equipmentList');
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get exercise GIF URL using the image endpoint
 * Fixed at 180 resolution (BASIC plan)
 * @param {string} exerciseId - Exercise ID
 * @returns {string} Complete image URL with API key
 */
export function getExerciseGifUrl(exerciseId) {
  return `https://${RAPIDAPI_HOST}/image?exerciseId=${exerciseId}&resolution=180&rapidapi-key=${RAPIDAPI_KEY}`;
}

/**
 * Batch fetch exercises from multiple categories
 * Returns 4 exercises per category for the main page
 * @param {Array<string>} bodyParts - Array of body part names
 */
export async function getFeaturedExercisesByCategories(bodyParts) {
  const results = {};
  
  for (const bodyPart of bodyParts) {
    const response = await getExercisesByBodyPart(bodyPart);
    
    if (response.success && response.data) {
      // Take only first 4 exercises per category
      results[bodyPart] = response.data.slice(0, 4);
    } else {
      results[bodyPart] = [];
    }
  }
  
  return { success: true, data: results };
}

/**
 * Search across all exercise attributes
 * @param {string} query - Search query
 */
export async function universalSearch(query) {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return { success: true, data: [] };
  }

  // Try name search first (most specific)
  const nameResults = await searchExercisesByName(searchTerm);
  
  if (nameResults.success && nameResults.data && nameResults.data.length > 0) {
    return nameResults;
  }

  // If no name matches, try getting all exercises and filter locally
  // (This is a fallback - in production you might want to search by target/equipment)
  const allExercises = await getAllExercises(100, 0); // Limit to 100 for performance
  
  if (allExercises.success && allExercises.data) {
    const filtered = allExercises.data.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.target.toLowerCase().includes(searchTerm) ||
      exercise.bodyPart.toLowerCase().includes(searchTerm) ||
      exercise.equipment.toLowerCase().includes(searchTerm)
    );
    
    return { success: true, data: filtered };
  }

  return { success: false, error: 'SEARCH_FAILED' };
}

/**
 * Get exercise recommendations based on body part
 * Returns a curated list for beginners
 */
export async function getRecommendedExercises(bodyPart) {
  const response = await getExercisesByBodyPart(bodyPart);
  
  if (response.success && response.data) {
    // Filter for bodyweight or basic equipment
    const recommended = response.data.filter(exercise => 
      exercise.equipment === 'body weight' || 
      exercise.equipment === 'dumbbell' ||
      exercise.equipment === 'barbell'
    ).slice(0, 8); // Return top 8
    
    return { success: true, data: recommended };
  }
  
  return response;
}