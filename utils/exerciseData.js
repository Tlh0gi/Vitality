// utils/exerciseData.js

export const EXERCISE_CATEGORIES = [
  {
    id: 1,
    name: 'Upper Body',
    description: 'Strengthen your arms, chest, shoulders, and back'
  },
  {
    id: 2,
    name: 'Lower Body',
    description: 'Build strength in your legs, glutes, and hips'
  },
  {
    id: 3,
    name: 'Core',
    description: 'Develop core strength and stability'
  },
  {
    id: 4,
    name: 'Cardio',
    description: 'Heart-pumping exercises to boost endurance'
  }
];

export const EXERCISES = [
  // Upper Body
  {
    id: 1,
    name: 'Push-ups',
    categoryId: 1,
    description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps.',
    instructions: 'Start in plank position. Lower body until chest nearly touches floor. Push back up. Keep body straight throughout. Do 3 sets of 10-15 reps.'
  },
  {
    id: 2,
    name: 'Pull-ups',
    categoryId: 1,
    description: 'Upper body exercise targeting back, biceps, and shoulders.',
    instructions: 'Hang from bar with palms facing away. Pull body up until chin clears bar. Lower with control. Do 3 sets of 5-10 reps. Use assistance if needed.'
  },
  {
    id: 3,
    name: 'Dumbbell Shoulder Press',
    categoryId: 1,
    description: 'Shoulder exercise that builds strength and stability.',
    instructions: 'Sit or stand with dumbbells at shoulder height. Press weights overhead until arms are fully extended. Lower with control. Do 3 sets of 10-12 reps.'
  },
  {
    id: 4,
    name: 'Tricep Dips',
    categoryId: 1,
    description: 'Bodyweight exercise targeting the triceps.',
    instructions: 'Use parallel bars or bench. Lower body by bending elbows to 90 degrees. Push back up to starting position. Do 3 sets of 10-15 reps.'
  },
  {
    id: 5,
    name: 'Bicep Curls',
    categoryId: 1,
    description: 'Isolation exercise for building bicep strength.',
    instructions: 'Hold dumbbells at sides with palms forward. Curl weights up to shoulders. Lower slowly and repeat. Do 3 sets of 12-15 reps.'
  },
  
  // Lower Body
  {
    id: 6,
    name: 'Squats',
    categoryId: 2,
    description: 'Fundamental lower body exercise working quads, glutes, and core.',
    instructions: 'Stand feet shoulder-width apart. Lower as if sitting back. Keep chest up, knees behind toes. Return to standing. Do 3 sets of 15-20 reps.'
  },
  {
    id: 7,
    name: 'Lunges',
    categoryId: 2,
    description: 'Single-leg exercise improving balance and strength.',
    instructions: 'Step forward, lower hips until both knees at 90 degrees. Push back to starting position. Alternate legs. Do 3 sets of 12-15 reps per leg.'
  },
  {
    id: 8,
    name: 'Deadlifts',
    categoryId: 2,
    description: 'Compound exercise working posterior chain muscles.',
    instructions: 'Stand with feet hip-width apart. Hinge at hips, keep back straight. Lower weight to floor. Drive through heels to stand. Do 3 sets of 8-10 reps.'
  },
  {
    id: 9,
    name: 'Leg Press',
    categoryId: 2,
    description: 'Machine exercise targeting quads, glutes, and hamstrings.',
    instructions: 'Sit on machine with feet on platform. Lower weight by bending knees. Push through feet to extend legs fully. Do 3 sets of 10-12 reps.'
  },
  {
    id: 10,
    name: 'Calf Raises',
    categoryId: 2,
    description: 'Isolation exercise for calf development.',
    instructions: 'Stand on edge of step. Lower heels below step level. Push up onto toes as high as possible. Lower and repeat. Do 3 sets of 15-20 reps.'
  },
  
  // Core
  {
    id: 11,
    name: 'Plank',
    categoryId: 3,
    description: 'Isometric exercise strengthening the entire core.',
    instructions: 'Hold push-up position on forearms. Keep body straight from head to heels. Hold for 30-60 seconds. Do 3 sets, resting 30 seconds between sets.'
  },
  {
    id: 12,
    name: 'Crunches',
    categoryId: 3,
    description: 'Abdominal exercise targeting the rectus abdominis.',
    instructions: 'Lie on back, knees bent. Lift shoulders off ground by contracting abs. Lower with control. Do 3 sets of 15-20 reps. Avoid pulling on neck with hands.'
  },
  {
    id: 13,
    name: 'Russian Twists',
    categoryId: 3,
    description: 'Rotational core exercise targeting obliques.',
    instructions: 'Sit with knees bent, lean back slightly. Hold weight at chest. Rotate torso side to side, touching weight to floor.Do 3 sets of 20 twists (10 per side). Keep core engaged throughout.'
  },
  {
    id: 14,
    name: 'Bicycle Crunches',
    categoryId: 3,
    description: 'Dynamic ab exercise engaging entire core.',
    instructions: 'Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. Alternate in cycling motion.Do 3 sets of 20 reps (10 per side). Focus on controlled movement and engaging abs.'
  },
  {
    id: 15,
    name: 'Mountain Climbers',
    categoryId: 3,
    description: 'Full-body exercise with strong core emphasis.',
    instructions: 'Start in plank position. Alternate bringing knees to chest rapidly. Keep core tight and hips level. Do 3 sets of 30-60 seconds. Maintain steady breathing and controlled movement.'
  },
  
  // Cardio
  {
    id: 16,
    name: 'Jumping Jacks',
    categoryId: 4,
    description: 'High-energy cardio exercise that gets your heart rate up.',
    instructions: 'Jump while spreading feet apart and raising arms overhead. Jump back to starting position. Repeat rapidly. Do 3 sets of 30-60 seconds. Focus on maintaining a steady rhythm and landing softly on your feet.'
  },
  {
    id: 17,
    name: 'Burpees',
    categoryId: 4,
    description: 'Full-body cardio exercise combining multiple movements.',
    instructions: 'Squat down, jump back to plank, do push-up, jump feet back to squat, jump up with arms overhead. Do 3 sets of 10-15 reps. Focus on smooth transitions between movements and maintaining a steady pace.'
  },
  {
    id: 18,
    name: 'High Knees',
    categoryId: 4,
    description: 'Running in place with emphasis on knee drive.',
    instructions: 'Run in place bringing knees up to waist height. Pump arms vigorously. Maintain quick tempo. Do 3 sets of 30-60 seconds. Focus on keeping core engaged and landing softly on the balls of your feet.'
  },
  {
    id: 19,
    name: 'Jump Rope',
    categoryId: 4,
    description: 'Classic cardio exercise great for coordination.',
    instructions: 'Hold rope handles. Swing rope overhead and jump as it passes under feet. Land softly on balls of feet. Do 3 sets of 1-2 minutes. Focus on maintaining a steady rhythm and keeping jumps low to the ground for better endurance.'
  },
  {
    id: 20,
    name: 'Running',
    categoryId: 4,
    description: 'The most accessible form of cardiovascular exercise.',
    instructions: 'Maintain steady pace. Land midfoot with slight forward lean. Swing arms naturally. Focus on rhythmic breathing. Do 3 sets of 20-30 minutes. Start with a comfortable pace and gradually increase intensity as endurance improves.'
  }
];

// Helper functions
export function getExercisesByCategory(categoryId) {
  return EXERCISES.filter(exercise => exercise.categoryId === categoryId);
}

export function getExerciseById(exerciseId) {
  return EXERCISES.find(exercise => exercise.id === parseInt(exerciseId));
}

export function getCategoryById(categoryId) {
  return EXERCISE_CATEGORIES.find(category => category.id === categoryId);
}

export function truncateWords(text, maxWords = 20) {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}