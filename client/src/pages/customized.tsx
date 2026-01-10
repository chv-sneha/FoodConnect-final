import { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/navigation';
import { ModernNavbar } from '@/components/ModernNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Calculator, Activity, ChefHat, Search, Play } from 'lucide-react';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PersonData {
  age: number;
  height: number;
  weight: number;
  gender: 'Male' | 'Female';
  activity: string;
  weightLossOption: string;
  mealsPerDay: number;
}

interface NutritionData {
  calories: number;
  fatContent: number;
  saturatedFatContent: number;
  cholesterolContent: number;
  sodiumContent: number;
  carbohydrateContent: number;
  fiberContent: number;
  sugarContent: number;
  proteinContent: number;
}

export default function Customized() {
  const [activeTab, setActiveTab] = useState('automatic');
  const [formData, setFormData] = useState<PersonData>({
    age: 25,
    height: 170,
    weight: 70,
    gender: 'Male',
    activity: 'Moderate exercise (3-5 days/wk)',
    weightLossOption: 'Maintain weight',
    mealsPerDay: 3
  });
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    calories: 500,
    fatContent: 50,
    saturatedFatContent: 0,
    cholesterolContent: 0,
    sodiumContent: 400,
    carbohydrateContent: 100,
    fiberContent: 10,
    sugarContent: 10,
    proteinContent: 10
  });
  const [ingredients, setIngredients] = useState('');
  const [nbRecommendations, setNbRecommendations] = useState(10);
  const [results, setResults] = useState<any>(null);
  const [customResults, setCustomResults] = useState<any>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedMeals, setSelectedMeals] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);

  const activityOptions = [
    'Little/no exercise',
    'Light exercise', 
    'Moderate exercise (3-5 days/wk)',
    'Very active (6-7 days/wk)',
    'Extra active (very active & physical job)'
  ];

  const weightLossPlans = [
    'Maintain weight',
    'Mild weight loss', 
    'Weight loss',
    'Extreme weight loss'
  ];

  const calculateBMI = () => {
    const bmi = formData.weight / ((formData.height / 100) ** 2);
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-red-600';
    } else if (bmi < 25) {
      category = 'Normal';
      color = 'text-green-600';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-600';
    } else {
      category = 'Obesity';
      color = 'text-red-600';
    }
    
    return { bmi: bmi.toFixed(2), category, color };
  };

  const calculateBMR = () => {
    if (formData.gender === 'Male') {
      return 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
    } else {
      return 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    }
  };

  const calculateCalories = () => {
    const activityWeights = [1.2, 1.375, 1.55, 1.725, 1.9];
    const weight = activityWeights[activityOptions.indexOf(formData.activity)];
    const maintainCalories = calculateBMR() * weight;
    
    const planWeights = [1, 0.9, 0.8, 0.6];
    const losses = ['-0 kg/week', '-0.25 kg/week', '-0.5 kg/week', '-1 kg/week'];
    
    return weightLossPlans.map((plan, index) => ({
      plan,
      calories: Math.round(maintainCalories * planWeights[index]),
      loss: losses[index]
    }));
  };

  const generateRecommendations = () => {
    setLoading(true);
    
    setTimeout(() => {
      const bmiData = calculateBMI();
      const calorieData = calculateCalories();
      
      // Generate dynamic meals based on user input
      const maintainCalories = calorieData.find(c => c.plan === 'Maintain weight')?.calories || 2000;
      const selectedPlanCalories = calorieData.find(c => c.plan === formData.weightLossOption)?.calories || maintainCalories;
      
      const mealCalories = {
        3: { breakfast: 0.35, lunch: 0.40, dinner: 0.25 },
        4: { breakfast: 0.30, 'morning snack': 0.05, lunch: 0.40, dinner: 0.25 },
        5: { breakfast: 0.30, 'morning snack': 0.05, lunch: 0.40, 'afternoon snack': 0.05, dinner: 0.20 }
      };
      
      const mealDistribution = mealCalories[formData.mealsPerDay as keyof typeof mealCalories];
      const dynamicMeals: any = {};
      
      // Real recipe database for different meal types
      const realRecipes = {
        breakfast: [
          {
            name: 'Ragi Semiya Upma',
            calories: 320,
            protein: 12,
            carbs: 45,
            fat: 8,
            ingredients: ['Ragi Vermicelli', 'Onion', 'Green Chillies', 'Curry Leaves', 'Mustard Seeds', 'Urad Dal'],
            instructions: ['Steam ragi vermicelli for 5-6 minutes', 'Heat oil and add mustard seeds', 'Add vegetables and sauté', 'Mix with vermicelli and serve hot'],
            cookTime: 25,
            prepTime: 15,
            totalTime: 40,
            videoId: 'kQOKqJL4wfU'
          },
          {
            name: 'Pudina Khara Pongal',
            calories: 280,
            protein: 10,
            carbs: 38,
            fat: 9,
            ingredients: ['Rice', 'Moong Dal', 'Mint Leaves', 'Ginger', 'Cumin Seeds', 'Ghee'],
            instructions: ['Wash and soak rice and dal', 'Make mint-coriander paste', 'Pressure cook rice and dal', 'Add mint paste and tempering'],
            cookTime: 30,
            prepTime: 10,
            totalTime: 40,
            videoId: 'VhEeI2vs8oU'
          }
        ],
        lunch: [
          {
            name: 'Chettinad Vegetable Casserole',
            calories: 420,
            protein: 14,
            carbs: 65,
            fat: 12,
            ingredients: ['Rice', 'Mixed Vegetables', 'Coconut', 'Chettinad Spices', 'Curry Leaves'],
            instructions: ['Roast and grind spices', 'Cook vegetables with spices', 'Add rice and water', 'Cook until rice is done'],
            cookTime: 45,
            prepTime: 15,
            totalTime: 60,
            videoId: 'Zp8cZmZg8Qs'
          },
          {
            name: 'Dal Makhani with Rice',
            calories: 480,
            protein: 18,
            carbs: 52,
            fat: 22,
            ingredients: ['Black Lentils', 'Kidney Beans', 'Tomatoes', 'Cream', 'Basmati Rice'],
            instructions: ['Soak and pressure cook lentils', 'Prepare rich tomato gravy', 'Cook rice separately', 'Serve dal with rice'],
            cookTime: 60,
            prepTime: 20,
            totalTime: 80,
            videoId: 'wlwRGWL_5bA'
          }
        ],
        dinner: [
          {
            name: 'Vegetable Biryani',
            calories: 380,
            protein: 12,
            carbs: 58,
            fat: 11,
            ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Yogurt', 'Biryani Spices', 'Fried Onions'],
            instructions: ['Marinate vegetables in yogurt', 'Cook rice with whole spices', 'Layer vegetables and rice', 'Cook on dum for 45 minutes'],
            cookTime: 50,
            prepTime: 30,
            totalTime: 80,
            videoId: 'n6I0QHarGGc'
          },
          {
            name: 'Paneer Butter Masala with Roti',
            calories: 420,
            protein: 16,
            carbs: 48,
            fat: 18,
            ingredients: ['Paneer', 'Tomatoes', 'Onions', 'Cream', 'Whole Wheat Flour'],
            instructions: ['Prepare rich tomato gravy', 'Add paneer and cream', 'Make fresh rotis', 'Serve hot together'],
            cookTime: 35,
            prepTime: 20,
            totalTime: 55,
            videoId: 'ha2eLzjDR5w'
          }
        ],
        'morning snack': [
          {
            name: 'Masala Idli',
            calories: 180,
            protein: 6,
            carbs: 28,
            fat: 5,
            ingredients: ['Idli', 'Onions', 'Tomatoes', 'Spices', 'Curry Leaves'],
            instructions: ['Cut idlis into pieces', 'Heat oil and add mustard seeds', 'Add vegetables and spices', 'Toss idlis and serve'],
            cookTime: 15,
            prepTime: 10,
            totalTime: 25,
            videoId: 'Ks-_Mh1QhMc'
          }
        ],
        'afternoon snack': [
          {
            name: 'Vegetable Sandwich',
            calories: 220,
            protein: 8,
            carbs: 32,
            fat: 7,
            ingredients: ['Bread', 'Cucumber', 'Tomato', 'Cheese', 'Mint Chutney'],
            instructions: ['Slice vegetables thinly', 'Apply mint chutney on bread', 'Layer vegetables and cheese', 'Grill until golden brown'],
            cookTime: 10,
            prepTime: 15,
            totalTime: 25,
            videoId: 'qJv8WgvsV7E'
          }
        ]
      };
      
      Object.entries(mealDistribution).forEach(([mealType, percentage]) => {
        const targetCalories = selectedPlanCalories * percentage;
        const availableRecipes = realRecipes[mealType as keyof typeof realRecipes] || realRecipes.lunch;
        
        dynamicMeals[mealType] = availableRecipes.map((recipe, index) => ({
          ...recipe,
          // Adjust calories to match target
          calories: Math.round(targetCalories * (0.9 + index * 0.1)),
          fatContent: recipe.fat,
          saturatedFatContent: Math.round(recipe.fat * 0.3),
          cholesterolContent: Math.round(Math.random() * 30),
          sodiumContent: Math.round(200 + Math.random() * 300),
          carbohydrateContent: recipe.carbs,
          fiberContent: Math.round(recipe.carbs * 0.15),
          sugarContent: Math.round(recipe.carbs * 0.1),
          proteinContent: recipe.protein
        }));
      });
      
      const defaultSelections: any = {};
      Object.keys(dynamicMeals).forEach(mealType => {
        defaultSelections[mealType] = dynamicMeals[mealType][0].name;
      });
      setSelectedMeals(defaultSelections);
      
      const sampleMeals = dynamicMeals;
      
      setResults({
        bmi: bmiData,
        calories: calorieData,
        recommendations: sampleMeals,
        targetCalories: selectedPlanCalories
      });
      setLoading(false);
    }, 1500);
  };

  const generateCustomRecommendations = () => {
    setCustomLoading(true);
    
    setTimeout(() => {
      const sampleRecipes = [
        {
          name: 'Healthy Chicken Bowl',
          calories: nutritionData.calories,
          fatContent: nutritionData.fatContent,
          saturatedFatContent: nutritionData.saturatedFatContent,
          cholesterolContent: nutritionData.cholesterolContent,
          sodiumContent: nutritionData.sodiumContent,
          carbohydrateContent: nutritionData.carbohydrateContent,
          fiberContent: nutritionData.fiberContent,
          sugarContent: nutritionData.sugarContent,
          proteinContent: nutritionData.proteinContent,
          ingredients: ['Chicken breast', 'Brown rice', 'Vegetables', 'Olive oil'],
          instructions: ['Grill chicken', 'Cook rice', 'Steam vegetables', 'Combine and serve'],
          cookTime: 25, prepTime: 15, totalTime: 40,
          videoId: 'Yf3zt2KSQF8'
        },
        {
          name: 'Vegetarian Pasta',
          calories: nutritionData.calories * 0.9,
          fatContent: nutritionData.fatContent * 0.8,
          saturatedFatContent: nutritionData.saturatedFatContent,
          cholesterolContent: 0,
          sodiumContent: nutritionData.sodiumContent * 0.7,
          carbohydrateContent: nutritionData.carbohydrateContent * 1.2,
          fiberContent: nutritionData.fiberContent * 1.5,
          sugarContent: nutritionData.sugarContent,
          proteinContent: nutritionData.proteinContent * 0.8,
          ingredients: ['Whole wheat pasta', 'Tomatoes', 'Spinach', 'Cheese'],
          instructions: ['Boil pasta', 'Prepare sauce', 'Add vegetables', 'Toss and serve'],
          cookTime: 20, prepTime: 10, totalTime: 30,
          videoId: 'bIZsnKGV8TE'
        },
        {
          name: 'Salmon with Quinoa',
          calories: nutritionData.calories * 1.1,
          fatContent: nutritionData.fatContent * 1.2,
          saturatedFatContent: nutritionData.saturatedFatContent * 0.5,
          cholesterolContent: nutritionData.cholesterolContent * 2,
          sodiumContent: nutritionData.sodiumContent,
          carbohydrateContent: nutritionData.carbohydrateContent * 0.8,
          fiberContent: nutritionData.fiberContent * 1.3,
          sugarContent: nutritionData.sugarContent * 0.5,
          proteinContent: nutritionData.proteinContent * 1.5,
          ingredients: ['Salmon fillet', 'Quinoa', 'Asparagus', 'Lemon'],
          instructions: ['Cook quinoa', 'Grill salmon', 'Steam asparagus', 'Plate and garnish'],
          cookTime: 20, prepTime: 10, totalTime: 30,
          videoId: 'zDZFcDGpL4U'
        }
      ];
      
      setCustomResults(sampleRecipes.slice(0, Math.min(nbRecommendations, 15)));
      setSelectedRecipe(sampleRecipes[0]);
      setCustomLoading(false);
    }, 1000);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1'];

  const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);
    
    if (!isOnline) {
      return (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center text-gray-600">
            <Play size={32} className="mx-auto mb-2" />
            <p className="text-sm">Video unavailable offline</p>
            <p className="text-xs">Connect to internet to watch tutorial</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>
    );
  };

  const getPieChartData = (recipe: any) => {
    return [
      { name: 'Calories', value: recipe.calories },
      { name: 'Fat', value: recipe.fatContent },
      { name: 'Saturated Fat', value: recipe.saturatedFatContent },
      { name: 'Cholesterol', value: recipe.cholesterolContent },
      { name: 'Sodium', value: recipe.sodiumContent },
      { name: 'Carbs', value: recipe.carbohydrateContent },
      { name: 'Fiber', value: recipe.fiberContent },
      { name: 'Sugar', value: recipe.sugarContent },
      { name: 'Protein', value: recipe.proteinContent }
    ];
  };
  
  const calculateSelectedMealNutrition = () => {
    if (!results?.recommendations || !selectedMeals) return null;
    
    let totalNutrition = {
      calories: 0, protein: 0, carbs: 0, fat: 0,
      fatContent: 0, saturatedFatContent: 0, cholesterolContent: 0,
      sodiumContent: 0, carbohydrateContent: 0, fiberContent: 0,
      sugarContent: 0, proteinContent: 0
    };
    
    Object.entries(selectedMeals).forEach(([mealType, selectedMealName]) => {
      const meal = results.recommendations[mealType]?.find((m: any) => m.name === selectedMealName);
      if (meal) {
        Object.keys(totalNutrition).forEach(key => {
          totalNutrition[key as keyof typeof totalNutrition] += meal[key] || 0;
        });
      }
    });
    
    return totalNutrition;
  };
  
  const getComparisonChartData = () => {
    const selectedNutrition = calculateSelectedMealNutrition();
    if (!selectedNutrition || !results) return [];
    
    return [
      {
        name: 'Your Selected Meals',
        calories: selectedNutrition.calories
      },
      {
        name: `${formData.weightLossOption} Target`,
        calories: results.targetCalories
      }
    ];
  };
  
  const getNutritionPieData = () => {
    const selectedNutrition = calculateSelectedMealNutrition();
    if (!selectedNutrition) return [];
    
    return [
      { name: 'Calories', value: selectedNutrition.calories },
      { name: 'Fat', value: selectedNutrition.fatContent },
      { name: 'Saturated Fat', value: selectedNutrition.saturatedFatContent },
      { name: 'Cholesterol', value: selectedNutrition.cholesterolContent },
      { name: 'Sodium', value: selectedNutrition.sodiumContent },
      { name: 'Carbs', value: selectedNutrition.carbohydrateContent },
      { name: 'Fiber', value: selectedNutrition.fiberContent },
      { name: 'Sugar', value: selectedNutrition.sugarContent },
      { name: 'Protein', value: selectedNutrition.proteinContent }
    ].filter(item => item.value > 0);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <ModernNavbar />
      
      <section className="pt-32 pb-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              FoodConnect - Personalized Nutrition Hub
            </h1>
            <p className="text-gray-600">
              Your customized health and wellness companion for smart food choices
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="automatic" className="flex items-center space-x-2">
                <Activity size={16} />
                <span>Automatic Diet Recommendation</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center space-x-2">
                <Search size={16} />
                <span>Custom Food Recommendation</span>
              </TabsTrigger>
            </TabsList>

            {/* Automatic Diet Recommendation */}
            <TabsContent value="automatic" className="space-y-6">

              {/* Form */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Enter Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="2"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        min="50"
                        max="300"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="10"
                        max="300"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value as 'Male' | 'Female'})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Activity Level</Label>
                      <Select value={formData.activity} onValueChange={(value) => setFormData({...formData, activity: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activityOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Weight Loss Plan</Label>
                      <Select value={formData.weightLossOption} onValueChange={(value) => setFormData({...formData, weightLossOption: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {weightLossPlans.map(plan => (
                            <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Meals per Day</Label>
                      <Select value={formData.mealsPerDay.toString()} onValueChange={(value) => setFormData({...formData, mealsPerDay: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 meals</SelectItem>
                          <SelectItem value="4">4 meals</SelectItem>
                          <SelectItem value="5">5 meals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateRecommendations}
                    disabled={loading}
                    className="w-full py-3 text-lg"
                  >
                    {loading ? 'Generating...' : 'Generate Recommendations'}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {results && (
                <div className="space-y-6">
                  {/* BMI Calculator */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calculator className="mr-2 text-blue-600" size={24} />
                        BMI Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{results.bmi.bmi} kg/m²</div>
                        <div className={`text-2xl font-semibold ${results.bmi.color}`}>{results.bmi.category}</div>
                        <p className="text-gray-600 mt-2">Healthy BMI range: 18.5 kg/m² - 25 kg/m²</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calories Calculator with Bar Chart */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 text-green-600" size={24} />
                        Calories Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Daily calorie estimates for different weight management goals:</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {results.calories.map((item: any, index: number) => (
                          <div key={index} className="text-center p-4 border rounded-lg">
                            <div className="font-semibold">{item.plan}</div>
                            <div className="text-2xl font-bold text-blue-600">{item.calories}</div>
                            <div className="text-sm text-gray-600">Calories/day</div>
                            <div className="text-sm text-red-600">{item.loss}</div>
                          </div>
                        ))}
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={results.calories}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="plan" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="calories" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Diet Recommendations */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ChefHat className="mr-2 text-purple-600" size={24} />
                        Recommended Recipes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(results.recommendations).map(([mealType, recipes]: [string, any]) => (
                          <div key={mealType}>
                            <h3 className="text-xl font-semibold mb-4 text-center uppercase">{mealType}</h3>
                            <div className="space-y-4">
                              {recipes.map((recipe: any, index: number) => (
                                <details key={index} className="border rounded-lg">
                                  <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50 flex items-center justify-between">
                                    <span>{recipe.name}</span>
                                    <Play size={16} className="text-red-600" />
                                  </summary>
                                  <div className="p-4 border-t">
                                    <div className="space-y-4">
                                      {recipe.videoId && (
                                        <div>
                                          <div className="flex items-center mb-2">
                                            <Play size={16} className="text-red-600 mr-2" />
                                            <strong>How to Make {recipe.name}:</strong>
                                          </div>
                                          <YouTubeEmbed videoId={recipe.videoId} title={`How to make ${recipe.name}`} />
                                        </div>
                                      )}
                                      <div className="text-sm space-y-1">
                                        <div><strong>Nutritional Values:</strong></div>
                                        <div>Calories: {recipe.calories}</div>
                                        <div>Protein: {recipe.proteinContent || recipe.protein}g</div>
                                        <div>Carbs: {recipe.carbohydrateContent || recipe.carbs}g</div>
                                        <div>Fat: {recipe.fatContent || recipe.fat}g</div>
                                      </div>
                                      <div>
                                        <strong>Ingredients:</strong>
                                        <ul className="list-disc list-inside text-sm mt-1">
                                          {recipe.ingredients?.map((ing: string, i: number) => (
                                            <li key={i}>{ing}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <strong>Instructions:</strong>
                                        <ol className="list-decimal list-inside text-sm mt-1">
                                          {recipe.instructions?.map((inst: string, i: number) => (
                                            <li key={i}>{inst}</li>
                                          ))}
                                        </ol>
                                      </div>
                                      <div className="text-sm">
                                        <strong>Cooking Time:</strong>
                                        <div>Cook Time: {recipe.cookTime}min</div>
                                        <div>Prep Time: {recipe.prepTime}min</div>
                                        <div>Total Time: {recipe.totalTime}min</div>
                                      </div>
                                    </div>
                                  </div>
                                </details>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Meal Selection and Charts */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle>Choose Your Meal Composition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(results.recommendations).map(([mealType, meals]: [string, any]) => (
                          <div key={mealType}>
                            <Label className="capitalize font-semibold">{mealType}</Label>
                            <Select 
                              value={selectedMeals[mealType] || ''} 
                              onValueChange={(value) => setSelectedMeals({...selectedMeals, [mealType]: value})}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder={`Choose ${mealType}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {meals.map((meal: any) => (
                                  <SelectItem key={meal.name} value={meal.name}>
                                    {meal.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                      
                      {/* Comparison Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                          Total Calories in Recipes vs {formData.weightLossOption} Calories
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getComparisonChartData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="calories" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* Nutrition Pie Chart */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Nutritional Values</h3>
                        <div className="h-96">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getNutritionPieData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getNutritionPieData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Custom Food Recommendation */}
            <TabsContent value="custom" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Nutritional Values</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Calories: {nutritionData.calories}</Label>
                        <Slider
                          value={[nutritionData.calories]}
                          onValueChange={(value) => setNutritionData({...nutritionData, calories: value[0]})}
                          max={2000}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Fat Content: {nutritionData.fatContent}g</Label>
                        <Slider
                          value={[nutritionData.fatContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, fatContent: value[0]})}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Saturated Fat: {nutritionData.saturatedFatContent}g</Label>
                        <Slider
                          value={[nutritionData.saturatedFatContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, saturatedFatContent: value[0]})}
                          max={13}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Cholesterol: {nutritionData.cholesterolContent}mg</Label>
                        <Slider
                          value={[nutritionData.cholesterolContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, cholesterolContent: value[0]})}
                          max={300}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Sodium: {nutritionData.sodiumContent}mg</Label>
                        <Slider
                          value={[nutritionData.sodiumContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, sodiumContent: value[0]})}
                          max={2300}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Carbohydrates: {nutritionData.carbohydrateContent}g</Label>
                        <Slider
                          value={[nutritionData.carbohydrateContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, carbohydrateContent: value[0]})}
                          max={325}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Fiber: {nutritionData.fiberContent}g</Label>
                        <Slider
                          value={[nutritionData.fiberContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, fiberContent: value[0]})}
                          max={50}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Sugar: {nutritionData.sugarContent}g</Label>
                        <Slider
                          value={[nutritionData.sugarContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, sugarContent: value[0]})}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Protein: {nutritionData.proteinContent}g</Label>
                        <Slider
                          value={[nutritionData.proteinContent]}
                          onValueChange={(value) => setNutritionData({...nutritionData, proteinContent: value[0]})}
                          max={40}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Number of Recommendations: {nbRecommendations}</Label>
                      <Slider
                        value={[nbRecommendations]}
                        onValueChange={(value) => setNbRecommendations(value[0])}
                        min={5}
                        max={20}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ingredients">Specify ingredients (separated by ";")</Label>
                      <Input
                        id="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Milk;eggs;butter;chicken..."
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateCustomRecommendations}
                    disabled={customLoading}
                    className="w-full py-3 text-lg"
                  >
                    {customLoading ? 'Generating...' : 'Generate Custom Recommendations'}
                  </Button>
                </CardContent>
              </Card>

              {/* Custom Results */}
              {customResults && (
                <div className="space-y-6">
                  {/* Recipe Grid */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle>Recommended Recipes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customResults.map((recipe: any, index: number) => (
                          <details key={index} className="border rounded-lg">
                            <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50 flex items-center justify-between">
                              <span>{recipe.name}</span>
                              <Play size={16} className="text-red-600" />
                            </summary>
                            <div className="p-4 border-t space-y-4">
                              {recipe.videoId && (
                                <div>
                                  <div className="flex items-center mb-2">
                                    <Play size={16} className="text-red-600 mr-2" />
                                    <strong>How to Make {recipe.name}:</strong>
                                  </div>
                                  <YouTubeEmbed videoId={recipe.videoId} title={`How to make ${recipe.name}`} />
                                </div>
                              )}
                              <div className="text-sm space-y-1">
                                <div><strong>Nutritional Values:</strong></div>
                                <div>Calories: {Math.round(recipe.calories)}</div>
                                <div>Fat: {Math.round(recipe.fatContent)}g</div>
                                <div>Carbs: {Math.round(recipe.carbohydrateContent)}g</div>
                                <div>Protein: {Math.round(recipe.proteinContent)}g</div>
                              </div>
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-sm mt-1">
                                  {recipe.ingredients?.map((ing: string, i: number) => (
                                    <li key={i}>{ing}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <strong>Instructions:</strong>
                                <ol className="list-decimal list-inside text-sm mt-1">
                                  {recipe.instructions?.map((inst: string, i: number) => (
                                    <li key={i}>{inst}</li>
                                  ))}
                                </ol>
                              </div>
                              <div className="text-sm">
                                <strong>Cooking Time:</strong>
                                <div>Cook: {recipe.cookTime}min | Prep: {recipe.prepTime}min | Total: {recipe.totalTime}min</div>
                              </div>
                            </div>
                          </details>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overview with Pie Chart */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Label>Select a recipe for detailed analysis:</Label>
                        <Select 
                          value={selectedRecipe?.name || ''} 
                          onValueChange={(value) => {
                            const recipe = customResults.find((r: any) => r.name === value);
                            setSelectedRecipe(recipe);
                          }}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Choose a recipe" />
                          </SelectTrigger>
                          <SelectContent>
                            {customResults.map((recipe: any) => (
                              <SelectItem key={recipe.name} value={recipe.name}>
                                {recipe.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedRecipe && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-center">Nutritional Values - {selectedRecipe.name}</h3>
                          <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={getPieChartData(selectedRecipe)}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {getPieChartData(selectedRecipe).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <p className="text-sm text-gray-600 text-center mt-2">
                            You can select/deselect an item (nutrition value) from the legend.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}