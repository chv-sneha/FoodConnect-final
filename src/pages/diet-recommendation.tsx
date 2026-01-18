import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TopNavigation, BottomNavigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Calculator, Utensils, Clock, ChefHat, Target } from 'lucide-react';
import { Link } from 'wouter';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activity_level: string;
  meals_per_day: number;
}

interface CaloriePlan {
  type: string;
  calories: number;
  description: string;
}

interface Recipe {
  Name: string;
  CookTime: string;
  PrepTime: string;
  TotalTime: string;
  RecipeIngredientParts: string[];
  Calories: number;
  FatContent: number;
  SaturatedFatContent: number;
  CholesterolContent: number;
  SodiumContent: number;
  CarbohydrateContent: number;
  FiberContent: number;
  SugarContent: number;
  ProteinContent: number;
  RecipeInstructions: string[];
}

export default function DietRecommendation() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'male',
    activity_level: 'moderate',
    meals_per_day: 3
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [bmi, setBmi] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  const dietMutation = useMutation({
    mutationFn: async (data: { profile: UserProfile; selectedPlan: string }) => {
      const response = await apiRequest('POST', '/api/diet/recommend', { ...data.profile, weight_goal: data.selectedPlan });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setRecommendations(data.data);
        toast({
          title: "Diet Plan Generated!",
          description: "Your personalized meal recommendations are ready.",
        });
      } else {
        throw new Error(data.error);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate diet recommendations.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const calculateBMI = () => {
    const heightInM = profile.height / 100;
    const calculatedBmi = profile.weight / (heightInM * heightInM);
    setBmi(Math.round(calculatedBmi * 10) / 10);
    setCurrentStep(2);
  };

  const proceedToCalorieSelection = () => {
    setCurrentStep(3);
  };

  const selectCaloriePlan = (planType: string) => {
    setSelectedPlan(planType);
    setCurrentStep(4);
  };

  const generateRecommendations = () => {
    if (selectedPlan) {
      dietMutation.mutate({ profile, selectedPlan });
    }
  };

  const getCalorieOptions = () => {
    // Base metabolic rate calculation (simplified)
    const bmr = profile.gender === 'male' 
      ? 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
      : 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }[profile.activity_level] || 1.55;
    
    const maintenanceCalories = Math.round(bmr * activityMultiplier);
    
    return [
      {
        type: 'maintain',
        calories: maintenanceCalories,
        description: 'Maintain current weight'
      },
      {
        type: 'mild_loss',
        calories: maintenanceCalories - 250,
        description: 'Mild weight loss (0.25 kg/week)'
      },
      {
        type: 'weight_loss',
        calories: maintenanceCalories - 500,
        description: 'Weight loss (0.5 kg/week)'
      },
      {
        type: 'extreme_loss',
        calories: maintenanceCalories - 750,
        description: 'Extreme weight loss (0.75 kg/week)'
      }
    ];
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavigation />
      
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/profile">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back to Profile</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Diet Recommendation
            </h1>
            <p className="text-gray-600">
              Get personalized meal plans based on your health profile
            </p>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="text-primary mr-3" />
                  Step 1: Enter Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                      min="1"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height}
                      onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                      min="50"
                      max="250"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={profile.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="activity">Activity Level</Label>
                    <Select value={profile.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                        <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very_active">Very Active (very hard exercise & physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="meals">Meals per day</Label>
                    <Select value={profile.meals_per_day.toString()} onValueChange={(value) => handleInputChange('meals_per_day', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 meals</SelectItem>
                        <SelectItem value="3">3 meals</SelectItem>
                        <SelectItem value="4">4 meals</SelectItem>
                        <SelectItem value="5">5 meals</SelectItem>
                        <SelectItem value="6">6 meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary text-white hover:bg-green-600 py-3 text-lg"
                  onClick={calculateBMI}
                >
                  <Calculator className="mr-2" size={20} />
                  Calculate BMI
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: BMI Calculation */}
          {currentStep === 2 && bmi && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="text-primary mr-3" />
                  Step 2: BMI Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Your BMI</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-2">{bmi}</p>
                  <p className={`text-lg font-semibold ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).category}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    This gives health context for your meal planning
                  </p>
                </div>

                <Button 
                  className="w-full bg-primary text-white hover:bg-green-600 py-3 text-lg"
                  onClick={proceedToCalorieSelection}
                >
                  <Target className="mr-2" size={20} />
                  Choose Your Goal
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Calorie Plan Selection */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="text-primary mr-3" />
                  Step 3: Choose Your Calorie Plan
                </CardTitle>
                <p className="text-gray-600 mt-2">Select your goal to get personalized meal recommendations</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCalorieOptions().map((option) => (
                    <div
                      key={option.type}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedPlan === option.type 
                          ? 'border-primary bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectCaloriePlan(option.type)}
                    >
                      <h3 className="text-lg font-semibold mb-2 capitalize">
                        {option.type.replace('_', ' ')}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {option.calories} kcal/day
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                {selectedPlan && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Selected plan: {selectedPlan.replace('_', ' ').charAt(0).toUpperCase() + selectedPlan.replace('_', ' ').slice(1)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Generate Meal Plan */}
          {currentStep === 4 && selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="text-primary mr-3" />
                  Step 4: Generate Your Meal Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Ready to generate your personalized meal plan!
                  </h3>
                  <p className="text-green-700">
                    Plan: {selectedPlan.replace('_', ' ').charAt(0).toUpperCase() + selectedPlan.replace('_', ' ').slice(1)}
                  </p>
                  <p className="text-green-700">
                    Target: {getCalorieOptions().find(opt => opt.type === selectedPlan)?.calories} kcal/day
                  </p>
                </div>

                <Button 
                  className="w-full bg-primary text-white hover:bg-green-600 py-3 text-lg"
                  onClick={generateRecommendations}
                  disabled={dietMutation.isPending}
                >
                  <ChefHat className="mr-2" size={20} />
                  {dietMutation.isPending ? 'Generating...' : 'Generate Meal Plan'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {recommendations && (
            <>
              {/* Health Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900">BMI</h3>
                      <p className="text-2xl font-bold text-blue-600">{recommendations.bmi}</p>
                      <p className={`text-sm ${getBMICategory(recommendations.bmi).color}`}>
                        {getBMICategory(recommendations.bmi).category}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900">Daily Calories</h3>
                      <p className="text-2xl font-bold text-green-600">{recommendations.daily_calories}</p>
                      <p className="text-sm text-green-700">kcal/day</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-900">Goal</h3>
                      <p className="text-lg font-bold text-purple-600 capitalize">
                        {recommendations.user_profile.weight_goal} Weight
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Meal Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="text-primary mr-3" />
                    Recommended Meals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(recommendations.meal_recommendations).map(([mealType, recipes]: [string, any]) => (
                      <div key={mealType} className="space-y-4">
                        <h3 className="text-lg font-semibold capitalize text-gray-900 border-b pb-2">
                          {mealType}
                        </h3>
                        {recipes && recipes.length > 0 ? (
                          recipes.slice(0, 2).map((recipe: Recipe, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                {recipe.Name}
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  <span>{recipe.TotalTime || 'N/A'} min</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Calories:</span>
                                  <span className="font-medium">{Math.round(recipe.Calories)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Protein:</span>
                                  <span className="font-medium">{Math.round(recipe.ProteinContent)}g</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <details className="text-xs">
                                  <summary className="cursor-pointer text-primary hover:text-green-600">
                                    View Details
                                  </summary>
                                  <div className="mt-2 space-y-2">
                                    <div>
                                      <strong>Ingredients:</strong>
                                      <ul className="list-disc list-inside mt-1">
                                        {recipe.RecipeIngredientParts?.slice(0, 3).map((ingredient, i) => (
                                          <li key={i} className="text-gray-600">{ingredient}</li>
                                        ))}
                                        {recipe.RecipeIngredientParts?.length > 3 && (
                                          <li className="text-gray-500">...and {recipe.RecipeIngredientParts.length - 3} more</li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </details>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Utensils size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No recipes found</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}