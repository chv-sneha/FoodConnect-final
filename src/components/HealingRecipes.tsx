import { useState } from "react";
import HealingConditionSelect from "./HealingConditionSelect";
import HealingMealPlan from "./HealingMealPlan";

const HealingRecipes = () => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  const handleConditionSelect = (condition: string) => {
    setSelectedCondition(condition);
  };

  const handleBack = () => {
    setSelectedCondition(null);
  };

  if (selectedCondition) {
    return (
      <HealingMealPlan 
        condition={selectedCondition} 
        onBack={handleBack}
      />
    );
  }

  return (
    <HealingConditionSelect 
      onConditionSelect={handleConditionSelect}
    />
  );
};

export default HealingRecipes;