import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Droplets, Activity, Zap, Scale, HeartHandshake } from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface Condition {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const conditions: Condition[] = [
  {
    id: "diabetes",
    name: "Diabetes",
    icon: <Droplets className="h-8 w-8" />,
    description: "Blood sugar management recipes",
    color: "bg-secondary"
  },
  {
    id: "pcos",
    name: "PCOS",
    icon: <Activity className="h-8 w-8" />,
    description: "Hormone balancing meals",
    color: "bg-primary"
  },
  {
    id: "thyroid",
    name: "Thyroid",
    icon: <Zap className="h-8 w-8" />,
    description: "Metabolism supporting foods",
    color: "bg-secondary"
  },
  {
    id: "anemia",
    name: "Anemia",
    icon: <Heart className="h-8 w-8" />,
    description: "Iron-rich healing recipes",
    color: "bg-primary"
  },
  {
    id: "weight_loss",
    name: "Weight Loss",
    icon: <Scale className="h-8 w-8" />,
    description: "Healthy weight management",
    color: "bg-primary"
  },
  {
    id: "heart_health",
    name: "Heart Health",
    icon: <HeartHandshake className="h-8 w-8" />,
    description: "Cardiovascular wellness",
    color: "bg-secondary"
  }
];

interface HealingConditionSelectProps {
  onConditionSelect: (condition: string) => void;
}

const HealingConditionSelect = ({ onConditionSelect }: HealingConditionSelectProps) => {
  const [selectedCondition, setSelectedCondition] = useState<string>("");

  const handleGeneratePlan = () => {
    if (selectedCondition) {
      onConditionSelect(selectedCondition);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Healing Recipes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your personalized food guide for natural healing. Together, we'll create meals that nourish your body and support your health journey.
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                Select your condition:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {conditions.map((condition) => (
                  <Card
                    key={condition.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCondition === condition.id
                        ? 'ring-2 ring-primary shadow-lg scale-105'
                        : 'hover:scale-102'
                    }`}
                    onClick={() => setSelectedCondition(condition.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto ${condition.color} rounded-full flex items-center justify-center mb-4 text-white`}>
                        {condition.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{condition.name}</h3>
                      <p className="text-sm text-gray-600">{condition.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!selectedCondition}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate My Meal Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealingConditionSelect;