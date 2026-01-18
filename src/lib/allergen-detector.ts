import { PersonalizedAlert } from '@/types/analysis';

// Common allergen keywords and their variations
const ALLERGEN_KEYWORDS: Record<string, string[]> = {
  'Nuts': ['nuts', 'peanut', 'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'brazil nut', 'macadamia'],
  'Dairy': ['milk', 'dairy', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein', 'lactose', 'ghee'],
  'Gluten': ['wheat', 'gluten', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta'],
  'Soy': ['soy', 'soya', 'soybean', 'tofu', 'tempeh', 'miso', 'edamame'],
  'Eggs': ['egg', 'eggs', 'albumin', 'lecithin', 'mayonnaise'],
  'Fish': ['fish', 'salmon', 'tuna', 'cod', 'sardine', 'anchovy', 'mackerel'],
  'Shellfish': ['shellfish', 'shrimp', 'crab', 'lobster', 'oyster', 'mussel', 'clam', 'scallop'],
  'Sesame': ['sesame', 'tahini', 'sesame oil', 'sesame seed']
};

export function detectAllergens(
  ingredients: string[], 
  userAllergies: string[]
): PersonalizedAlert[] {
  const alerts: PersonalizedAlert[] = [];
  
  if (!userAllergies || userAllergies.length === 0) {
    return alerts;
  }

  // Convert ingredients to lowercase for matching
  const ingredientText = ingredients.join(' ').toLowerCase();
  
  userAllergies.forEach(allergy => {
    const allergyLower = allergy.toLowerCase();
    let found = false;
    let matchedIngredients: string[] = [];

    // Check if the allergy is in our keyword mapping
    const keywords = ALLERGEN_KEYWORDS[allergy] || [allergyLower];
    
    keywords.forEach(keyword => {
      if (ingredientText.includes(keyword.toLowerCase())) {
        found = true;
        // Find which specific ingredients contain this allergen
        ingredients.forEach(ingredient => {
          if (ingredient.toLowerCase().includes(keyword.toLowerCase())) {
            matchedIngredients.push(ingredient);
          }
        });
      }
    });

    // Also check for direct matches with custom allergies
    if (ingredientText.includes(allergyLower)) {
      found = true;
      ingredients.forEach(ingredient => {
        if (ingredient.toLowerCase().includes(allergyLower)) {
          matchedIngredients.push(ingredient);
        }
      });
    }

    if (found) {
      alerts.push({
        type: 'allergen',
        severity: 'high',
        title: `⚠️ ${allergy} Allergen Detected`,
        message: `This product contains ${allergy.toLowerCase()} which you are allergic to. Found in: ${[...new Set(matchedIngredients)].join(', ')}`
      });
    }
  });

  return alerts;
}

export function checkHealthConditionConflicts(
  ingredients: string[],
  userHealthConditions: string[]
): PersonalizedAlert[] {
  const alerts: PersonalizedAlert[] = [];
  
  if (!userHealthConditions || userHealthConditions.length === 0) {
    return alerts;
  }

  const ingredientText = ingredients.join(' ').toLowerCase();

  userHealthConditions.forEach(condition => {
    const conditionLower = condition.toLowerCase();
    
    switch (conditionLower) {
      case 'diabetes':
        if (ingredientText.includes('sugar') || 
            ingredientText.includes('glucose') || 
            ingredientText.includes('fructose') ||
            ingredientText.includes('corn syrup') ||
            ingredientText.includes('high fructose')) {
          alerts.push({
            type: 'health_condition',
            severity: 'medium',
            title: '🩺 Diabetes Alert',
            message: 'This product contains high sugar content which may affect your blood glucose levels.'
          });
        }
        break;
        
      case 'hypertension':
        if (ingredientText.includes('salt') || 
            ingredientText.includes('sodium') ||
            ingredientText.includes('monosodium glutamate') ||
            ingredientText.includes('msg')) {
          alerts.push({
            type: 'health_condition',
            severity: 'medium',
            title: '🩺 Hypertension Alert',
            message: 'This product contains high sodium content which may increase blood pressure.'
          });
        }
        break;
        
      case 'heart disease':
        if (ingredientText.includes('trans fat') || 
            ingredientText.includes('hydrogenated') ||
            ingredientText.includes('palm oil') ||
            ingredientText.includes('saturated fat')) {
          alerts.push({
            type: 'health_condition',
            severity: 'high',
            title: '❤️ Heart Health Alert',
            message: 'This product contains ingredients that may not be suitable for heart health.'
          });
        }
        break;
        
      case 'celiac disease':
        if (ingredientText.includes('wheat') || 
            ingredientText.includes('gluten') ||
            ingredientText.includes('barley') ||
            ingredientText.includes('rye')) {
          alerts.push({
            type: 'health_condition',
            severity: 'high',
            title: '🌾 Celiac Disease Alert',
            message: 'This product contains gluten which can trigger celiac disease symptoms.'
          });
        }
        break;
        
      case 'lactose intolerance':
        if (ingredientText.includes('milk') || 
            ingredientText.includes('lactose') ||
            ingredientText.includes('dairy') ||
            ingredientText.includes('whey') ||
            ingredientText.includes('casein')) {
          alerts.push({
            type: 'health_condition',
            severity: 'medium',
            title: '🥛 Lactose Intolerance Alert',
            message: 'This product contains lactose which may cause digestive discomfort.'
          });
        }
        break;
    }
  });

  return alerts;
}

export function generatePersonalizedAlerts(
  ingredients: string[],
  userAllergies: string[] = [],
  userHealthConditions: string[] = []
): PersonalizedAlert[] {
  const allergenAlerts = detectAllergens(ingredients, userAllergies);
  const healthAlerts = checkHealthConditionConflicts(ingredients, userHealthConditions);
  
  return [...allergenAlerts, ...healthAlerts];
}