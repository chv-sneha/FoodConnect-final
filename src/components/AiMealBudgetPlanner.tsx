import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Calendar, TrendingDown, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";

interface MealPlan {
  day: string;
  breakfast: { name: string; cost: number };
  lunch: { name: string; cost: number };
  dinner: { name: string; cost: number };
  total: number;
}

const mealOptions = {
  budget: {
    low: {
      breakfast: ["Poha", "Upma", "Daliya", "Paratha"],
      lunch: ["Dal Rice", "Khichdi", "Chole Rice", "Sabzi Roti"],
      dinner: ["Roti Dal", "Rice Sabzi", "Khichdi", "Paratha Curd"]
    },
    medium: {
      breakfast: ["Oats Fruits", "Egg Paratha", "Idli Sambar", "Aloo Paratha"],
      lunch: ["Rajma Rice", "Paneer Roti", "Fish Curry Rice", "Chicken Dal"],
      dinner: ["Roti Paneer", "Biryani", "Fish Fry Rice", "Egg Curry"]
    },
    high: {
      breakfast: ["Smoothie Bowl", "Avocado Toast", "Protein Pancakes", "Quinoa Bowl"],
      lunch: ["Grilled Chicken", "Salmon Rice", "Quinoa Salad", "Paneer Tikka"],
      dinner: ["Mutton Curry", "Prawn Biryani", "Grilled Fish", "Chicken Tikka"]
    }
  },
  costs: {
    low: { breakfast: [15, 20, 18, 25], lunch: [35, 30, 40, 32], dinner: [25, 28, 30, 35] },
    medium: { breakfast: [25, 30, 28, 32], lunch: [45, 50, 55, 48], dinner: [35, 40, 45, 38] },
    high: { breakfast: [40, 45, 42, 48], lunch: [70, 80, 75, 85], dinner: [60, 70, 65, 75] }
  }
};

const generateMealPlan = (dailyBudget: number, familySize: number): MealPlan[] => {
  const perPersonBudget = dailyBudget / familySize;
  const budgetTier = perPersonBudget < 50 ? 'low' : perPersonBudget < 100 ? 'medium' : 'high';
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  return days.map(day => {
    const bIdx = Math.floor(Math.random() * 4);
    const lIdx = Math.floor(Math.random() * 4);
    const dIdx = Math.floor(Math.random() * 4);
    
    const breakfast = { 
      name: mealOptions.budget[budgetTier].breakfast[bIdx], 
      cost: mealOptions.costs[budgetTier].breakfast[bIdx] 
    };
    const lunch = { 
      name: mealOptions.budget[budgetTier].lunch[lIdx], 
      cost: mealOptions.costs[budgetTier].lunch[lIdx] 
    };
    const dinner = { 
      name: mealOptions.budget[budgetTier].dinner[dIdx], 
      cost: mealOptions.costs[budgetTier].dinner[dIdx] 
    };
    
    return {
      day,
      breakfast,
      lunch,
      dinner,
      total: breakfast.cost + lunch.cost + dinner.cost
    };
  });
};

const AiMealBudgetPlanner = () => {
  const [weeklyBudget, setWeeklyBudget] = useState<number | "">(700);
  const [familySize, setFamilySize] = useState<number | "">(4);
  const [showPlan, setShowPlan] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const { toast } = useToast();

  const generatePlan = () => {
    const dailyBudget = budgetValue / 7;
    const newPlan = generateMealPlan(dailyBudget, familySizeValue);
    setMealPlan(newPlan);
    setShowPlan(true);
    toast({
      title: "Meal plan generated!",
      description: `Budget-friendly plan for ₹${budgetValue}/week for ${familySizeValue} people`
    });
  };

  const budgetValue = typeof weeklyBudget === "number" ? weeklyBudget : 0;
  const familySizeValue = typeof familySize === "number" ? familySize : 0;
  const dailyBudget = budgetValue / 7;
  const weeklyTotal = mealPlan.reduce((sum, day) => sum + day.total, 0) * familySizeValue;
  const savings = Math.max(0, budgetValue - weeklyTotal);
  const overBudget = weeklyTotal > budgetValue;

  const exportPlan = () => {
    const lines = mealPlan.map(d => `${d.day}: ${d.breakfast.name}, ${d.lunch.name}, ${d.dinner.name} (₹${d.total})`).join("\n");
    const blob = new Blob([`Budget Plan (Family: ${familySizeValue})\n\n${lines}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'meal-budget-plan.txt'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "Meal plan downloaded as TXT." });
  };

  const sharePlan = async () => {
    const text = `Budget Meal Plan (Family: ${familySizeValue})\nWeekly Total: ₹${weeklyTotal}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Meal Plan', text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Plan copied to clipboard." });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="text-center mb-12 text-gray-900">
          <DollarSign className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">AI Meal Budget Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Eat healthy without breaking the bank with smart budget meal planning
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 hover:border-primary">
            <CardHeader>
              <CardTitle>Set Your Budget & Family Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weekly Budget (₹)</label>
                  <Input
                    type="number"
                    value={weeklyBudget}
                    onChange={(e) => setWeeklyBudget(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Enter weekly budget"
                  />
                  <p className="text-sm text-muted-foreground">
                    Daily budget: ₹{dailyBudget.toFixed(0)} per person
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Family Size</label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Input
                      type="number"
                      value={familySize}
                      onChange={(e) => setFamilySize(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Number of people"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={generatePlan} 
                className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:from-green-600 hover:to-blue-600"
                size="lg"
              >
                Generate Smart Meal Plan
              </Button>
            </CardContent>
          </Card>

          {showPlan && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">₹{weeklyTotal}</div>
                    <div className="text-sm text-muted-foreground">Weekly Total</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <TrendingDown className={`h-8 w-8 mx-auto mb-2 ${overBudget ? 'text-red-600' : 'text-green-600'}`} />
                    <div className={`text-2xl font-bold ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {overBudget ? '-' : ''}₹{Math.abs(savings)}
                    </div>
                    <div className="text-sm text-muted-foreground">{overBudget ? 'Over Budget' : 'Savings'}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">₹{(weeklyTotal / 7).toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">Daily Average</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 hover:border-primary">
                <CardHeader>
                  <CardTitle>Your 5-Day Budget Meal Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mealPlan.map((day, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg">{day.day}</h3>
                           <Badge variant="secondary">
                             ₹{(day.total * familySizeValue).toFixed(0)}
                           </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Breakfast:</strong> {day.breakfast.name}
                          </div>
                          <div>
                            <strong>Lunch:</strong> {day.lunch.name}
                          </div>
                          <div>
                            <strong>Dinner:</strong> {day.dinner.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 justify-end mt-6">
                    <Button variant="outline" size="sm" onClick={sharePlan}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportPlan}>
                      <Download className="h-4 w-4 mr-2" />
                      Export TXT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMealBudgetPlanner;