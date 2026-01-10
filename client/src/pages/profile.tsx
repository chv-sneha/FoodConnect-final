import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { TopNavigation, BottomNavigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User, 
  Shield, 
  AlertTriangle, 
  Heart, 
  Save,
  History,
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

export default function Profile() {
  const { toast } = useToast();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [allergies, setAllergies] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, setLocation]);

  // Load user data
  useEffect(() => {
    if (user) {
      setAllergies(user.allergies || []);
      setHealthConditions(user.healthConditions || []);
    }
  }, [user]);

  const [isUpdating, setIsUpdating] = useState(false);

  const allergyOptions = [
    'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'
  ];

  const healthConditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Celiac Disease', 'Lactose Intolerance'
  ];

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        allergies,
        healthConditions,
        updatedAt: new Date().toISOString()
      });
      
      await refreshUser();
      
      toast({
        title: "Profile Updated",
        description: "Your health profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Auth redirect will handle this
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavigation />
      
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                <div className="flex items-center">
                  <User className="text-primary mr-3" />
                  Profile
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {user.email}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center">
                  <Shield className="text-primary mr-3" />
                  Health Profile
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </CardTitle>
              <p className="text-gray-600">
                Configure your allergies and health conditions for personalized analysis
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Allergies Section */}
              <div>
                <Label className="text-base font-semibold flex items-center mb-4">
                  <AlertTriangle className="text-orange-500 mr-2" size={20} />
                  Allergies & Intolerances
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {allergyOptions.map((allergy) => (
                    <label 
                      key={allergy}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer"
                    >
                      <Checkbox 
                        checked={allergies.includes(allergy)}
                        onCheckedChange={() => toggleAllergy(allergy)}
                      />
                      <span className="text-sm font-medium">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Health Conditions Section */}
              <div>
                <Label className="text-base font-semibold flex items-center mb-4">
                  <Heart className="text-red-500 mr-2" size={20} />
                  Health Conditions
                </Label>
                <div className="space-y-3">
                  {healthConditionOptions.map((condition) => (
                    <label 
                      key={condition}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer"
                    >
                      <Checkbox 
                        checked={healthConditions.includes(condition)}
                        onCheckedChange={() => toggleHealthCondition(condition)}
                      />
                      <span className="text-sm font-medium">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-primary text-white hover:bg-green-600 py-3 text-lg"
                onClick={handleSaveProfile}
                disabled={isUpdating}
              >
                <Save className="mr-2" size={20} />
                {isUpdating ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Scan History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <History className="text-secondary mr-3" />
                Scan History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
                <p className="text-gray-600">Start scanning products to see your history here</p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Settings className="text-gray-600 mr-3" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2" size={20} />
                App Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2" size={20} />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <AlertTriangle className="mr-2" size={20} />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}
