import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TopNavigation, BottomNavigation } from '@/components/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'wouter';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfileEdit() {
  const { user, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    allergies: user?.allergies || [],
    healthConditions: user?.healthConditions || [],
    age: user?.age || '',
    activityLevel: user?.activityLevel || '',
    healthGoal: user?.healthGoal || ''
  });
  
  const [customAllergy, setCustomAllergy] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const { toast } = useToast();

  const allergies = [
    'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'
  ];

  const healthConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Celiac Disease', 'Lactose Intolerance'
  ];

  const handleSave = async () => {
    try {
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: formData.name,
          allergies: formData.allergies,
          healthConditions: formData.healthConditions,
          age: formData.age,
          activityLevel: formData.activityLevel,
          healthGoal: formData.healthGoal,
          updatedAt: new Date().toISOString()
        });
        
        // Force refresh user data to reflect changes immediately
        await refreshUser();
        
        toast({
          title: "Profile Updated!",
          description: "Your health profile has been saved successfully. Changes will be reflected in your next scan."
        });
        
        // Small delay to ensure data is updated before navigation
        setTimeout(() => {
          setLocation('/profile');
        }, 500);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const toggleCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };
  
  const addCustomAllergy = () => {
    if (customAllergy.trim() && !formData.allergies.includes(customAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy('');
    }
  };
  
  const addCustomCondition = () => {
    if (customCondition.trim() && !formData.healthConditions.includes(customCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        healthConditions: [...prev.healthConditions, customCondition.trim()]
      }));
      setCustomCondition('');
    }
  };
  
  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };
  
  const removeCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.filter(c => c !== condition)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/profile">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back to Profile</span>
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <User className="mr-3" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Allergies */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Allergies & Intolerances</Label>
                
                {/* None option */}
                <label className="flex items-center space-x-2 cursor-pointer mb-4 p-3 border border-gray-200 rounded-xl">
                  <Checkbox
                    checked={formData.allergies.length === 0}
                    onCheckedChange={(checked) => {
                      if (checked) setFormData(prev => ({ ...prev, allergies: [] }));
                    }}
                  />
                  <span className="text-sm font-medium">None - I have no allergies</span>
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {allergies.map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={() => toggleAllergy(allergy)}
                      />
                      <span className="text-sm">{allergy}</span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Allergy Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add custom allergy..."
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                  />
                  <Button onClick={addCustomAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Selected Allergies */}
                {formData.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy) => (
                      <Badge key={allergy} variant="secondary" className="flex items-center gap-1">
                        {allergy}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergy(allergy)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Health Conditions */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Health Conditions</Label>
                
                {/* None option */}
                <label className="flex items-center space-x-2 cursor-pointer mb-4 p-3 border border-gray-200 rounded-xl">
                  <Checkbox
                    checked={formData.healthConditions.length === 0}
                    onCheckedChange={(checked) => {
                      if (checked) setFormData(prev => ({ ...prev, healthConditions: [] }));
                    }}
                  />
                  <span className="text-sm font-medium">None - I have no health conditions</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {healthConditions.map((condition) => (
                    <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={formData.healthConditions.includes(condition)}
                        onCheckedChange={() => toggleCondition(condition)}
                      />
                      <span className="text-sm">{condition}</span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Condition Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add custom health condition..."
                    value={customCondition}
                    onChange={(e) => setCustomCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomCondition()}
                  />
                  <Button onClick={addCustomCondition} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Selected Conditions */}
                {formData.healthConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.healthConditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                        {condition}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeCondition(condition)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}