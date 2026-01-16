import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { generatePersonalizedAlerts } from '@/lib/allergen-detector';
import { AlertTriangle, Heart, TestTube } from 'lucide-react';

export function AllergenTestComponent() {
  const [testIngredients, setTestIngredients] = useState('wheat flour, milk powder, eggs, peanuts, sugar, salt');
  const [testAllergies, setTestAllergies] = useState('Nuts, Dairy, Gluten');
  const [testConditions, setTestConditions] = useState('Diabetes, Hypertension');
  const [alerts, setAlerts] = useState<any[]>([]);

  const runTest = () => {
    const ingredients = testIngredients.split(',').map(i => i.trim());
    const allergies = testAllergies.split(',').map(a => a.trim()).filter(a => a);
    const conditions = testConditions.split(',').map(c => c.trim()).filter(c => c);
    
    const generatedAlerts = generatePersonalizedAlerts(ingredients, allergies, conditions);
    setAlerts(generatedAlerts);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-6 h-6 text-blue-600" />
          Allergen Detection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Ingredients (comma-separated):</label>
          <Input
            value={testIngredients}
            onChange={(e) => setTestIngredients(e.target.value)}
            placeholder="wheat flour, milk powder, eggs..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">User Allergies (comma-separated):</label>
          <Input
            value={testAllergies}
            onChange={(e) => setTestAllergies(e.target.value)}
            placeholder="Nuts, Dairy, Gluten..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Health Conditions (comma-separated):</label>
          <Input
            value={testConditions}
            onChange={(e) => setTestConditions(e.target.value)}
            placeholder="Diabetes, Hypertension..."
          />
        </div>
        
        <Button onClick={runTest} className="w-full">
          Test Allergen Detection
        </Button>
        
        {alerts.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-lg">Detection Results:</h3>
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'medium' ? 'bg-orange-50 border-orange-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {alert.type === 'allergen' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Heart className="w-5 h-5 text-orange-600" />
                  )}
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="font-semibold">{alert.title}</h4>
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}
          </div>
        )}
        
        {alerts.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No alerts detected. Click "Test Allergen Detection" to run the test.
          </div>
        )}
      </CardContent>
    </Card>
  );
}