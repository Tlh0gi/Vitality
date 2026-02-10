// utils/nutritionData.js

export const NUTRITION_DATA = {
  general: {
    title: 'General Fitness Nutrition',
    icon: '🏋️',
    description: 'Essential nutrition guidelines for overall fitness and health',
    tips: [
      {
        title: 'Stay Hydrated',
        content: 'Drink at least 8-10 glasses of water daily. Increase intake during workouts.',
        icon: '💧'
      },
      {
        title: 'Balanced Macronutrients',
        content: 'Aim for 40% carbs, 30% protein, 30% healthy fats in your daily intake.',
        icon: '⚖️'
      },
      {
        title: 'Pre-Workout Fuel',
        content: 'Eat a light snack with carbs and protein 30-60 minutes before exercising.',
        icon: '🍌'
      },
      {
        title: 'Post-Workout Recovery',
        content: 'Consume protein within 30 minutes after workout to aid muscle recovery.',
        icon: '🥤'
      },
      {
        title: 'Meal Timing',
        content: 'Eat smaller, frequent meals throughout the day to maintain energy levels.',
        icon: '⏰'
      }
    ],
    foods: [
      'Lean proteins (chicken, fish, tofu)',
      'Complex carbs (quinoa, sweet potato, oats)',
      'Healthy fats (avocado, nuts, olive oil)',
      'Fresh fruits and vegetables',
      'Whole grains'
    ]
  },
  upper_body: {
    title: 'Upper Body Nutrition',
    icon: '💪',
    description: 'Nutrition to support arm, chest, shoulder, and back development',
    tips: [
      {
        title: 'Protein Priority',
        content: 'Focus on 1.6-2.2g protein per kg of body weight to build upper body muscle.',
        icon: '🥩'
      },
      {
        title: 'Amino Acid Support',
        content: 'Include complete proteins with all essential amino acids for muscle repair.',
        icon: '🧬'
      },
      {
        title: 'Anti-Inflammatory Foods',
        content: 'Eat foods rich in omega-3s to reduce muscle inflammation after training.',
        icon: '🐟'
      },
      {
        title: 'Magnesium Intake',
        content: 'Include magnesium-rich foods to prevent muscle cramps and aid recovery.',
        icon: '🥬'
      },
      {
        title: 'Creatine Sources',
        content: 'Natural creatine from red meat and fish can help with power and strength.',
        icon: '🥩'
      }
    ],
    foods: [
      'Chicken breast and turkey',
      'Salmon and tuna',
      'Greek yogurt',
      'Almonds and walnuts',
      'Spinach and dark leafy greens',
      'Cottage cheese',
      'Eggs and egg whites',
      'Lean beef'
    ]
  },
  lower_body: {
    title: 'Lower Body Nutrition',
    icon: '🦵',
    description: 'Fuel for building strong legs, glutes, and hips',
    tips: [
      {
        title: 'Complex Carbohydrates',
        content: 'Power your leg workouts with slow-releasing carbs for sustained energy.',
        icon: '🍠'
      },
      {
        title: 'Potassium Power',
        content: 'Prevent cramping and support muscle function with potassium-rich foods.',
        icon: '🍌'
      },
      {
        title: 'Vitamin D & Calcium',
        content: 'Support bone health and muscle contraction with adequate calcium and vitamin D.',
        icon: '🥛'
      },
      {
        title: 'Iron for Endurance',
        content: 'Maintain iron levels to support oxygen delivery during intense leg workouts.',
        icon: '🥩'
      },
      {
        title: 'B-Vitamins for Energy',
        content: 'B-complex vitamins help convert food into energy for demanding lower body exercises.',
        icon: '🌾'
      }
    ],
    foods: [
      'Sweet potatoes and quinoa',
      'Bananas and oranges',
      'Lean beef and lentils',
      'Dairy products (milk, cheese)',
      'Broccoli and kale',
      'Black beans and chickpeas',
      'Brown rice and oats',
      'Fortified cereals'
    ]
  },
  core: {
    title: 'Core Nutrition',
    icon: '🔥',
    description: 'Nutrition strategies for a strong, defined core',
    tips: [
      {
        title: 'Reduce Belly Fat',
        content: 'Create a moderate caloric deficit to reduce fat covering your abs.',
        icon: '📉'
      },
      {
        title: 'Fiber Focus',
        content: 'High-fiber foods improve digestion and reduce bloating for a flatter stomach.',
        icon: '🥦'
      },
      {
        title: 'Limit Processed Foods',
        content: 'Avoid foods that cause inflammation and water retention around the midsection.',
        icon: '🚫'
      },
      {
        title: 'Probiotic Support',
        content: 'Support gut health with probiotics to reduce bloating and improve digestion.',
        icon: '🦠'
      },
      {
        title: 'Anti-Bloating Foods',
        content: 'Include foods that naturally reduce water retention and inflammation.',
        icon: '🥒'
      }
    ],
    foods: [
      'Berries and apples',
      'Oats and brown rice',
      'Yogurt with live cultures',
      'Green tea',
      'Cucumber and celery',
      'Lean fish (cod, tilapia)',
      'Ginger and turmeric',
      'Asparagus and artichokes'
    ]
  },
  cardio: {
    title: 'Cardio Nutrition',
    icon: '❤️',
    description: 'Fuel your cardiovascular workouts and improve endurance',
    tips: [
      {
        title: 'Carb Loading',
        content: 'Consume easily digestible carbs before longer cardio sessions for energy.',
        icon: '🍝'
      },
      {
        title: 'Electrolyte Balance',
        content: 'Replace sodium, potassium, and magnesium lost through sweat during cardio.',
        icon: '⚡'
      },
      {
        title: 'Heart-Healthy Fats',
        content: 'Include omega-3 fatty acids to support cardiovascular health and reduce inflammation.',
        icon: '🫀'
      },
      {
        title: 'Nitrate-Rich Foods',
        content: 'Improve blood flow and oxygen delivery with nitrate-rich vegetables.',
        icon: '🥬'
      },
      {
        title: 'Caffeine Boost',
        content: 'Moderate caffeine intake can enhance endurance and fat burning during cardio.',
        icon: '☕'
      }
    ],
    foods: [
      'Dates and dried fruits',
      'Coconut water',
      'Beetroot and pomegranate',
      'Chia seeds and flaxseeds',
      'Dark chocolate (85% cacao)',
      'Watermelon and berries',
      'Coffee and green tea',
      'Sports drinks (for long sessions)'
    ]
  }
};

// Utility functions
export function getNutritionSection(sectionKey) {
  return NUTRITION_DATA[sectionKey] || null;
}

export function getAllFoods() {
  const allFoods = new Set();
  Object.values(NUTRITION_DATA).forEach(section => {
    section.foods.forEach(food => allFoods.add(food));
  });
  return Array.from(allFoods).sort();
}

export function getTipsByCategory(category = null) {
  const tips = [];
  
  Object.entries(NUTRITION_DATA).forEach(([sectionKey, section]) => {
    if (category === null || sectionKey === category) {
      section.tips.forEach(tip => {
        tips.push({
          ...tip,
          category: sectionKey,
          categoryTitle: section.title
        });
      });
    }
  });
  
  return tips;
}

export function getSectionKeys() {
  return Object.keys(NUTRITION_DATA);
}