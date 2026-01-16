import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { TopNavigation, BottomNavigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Shield, 
  AlertTriangle, 
  Heart, 
  History,
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, setLocation]);



  const allergyOptions = [
    'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'
  ];

  const healthConditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Celiac Disease', 'Lactose Intolerance'
  ];



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
                <div className="text-base font-semibold flex items-center mb-4">
                  <AlertTriangle className="text-orange-500 mr-2" size={20} />
                  Allergies & Intolerances
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {allergyOptions.map((allergy) => (
                    <div 
                      key={allergy}
                      className={`flex items-center space-x-3 p-3 border rounded-xl transition-colors ${
                        (user?.allergies || []).includes(allergy) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <Checkbox 
                        checked={(user?.allergies || []).includes(allergy)}
                        disabled
                      />
                      <span className={`text-sm font-medium ${
                        (user?.allergies || []).includes(allergy) ? 'text-red-700' : ''
                      }`}>
                        {allergy}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Display custom allergies */}
                {user?.allergies && user.allergies.filter(a => !allergyOptions.includes(a)).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Custom Allergies:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.allergies.filter(a => !allergyOptions.includes(a)).map((allergy) => (
                        <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No allergies message */}
                {(!user?.allergies || user.allergies.length === 0) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">✅ No allergies</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Health Conditions Section */}
              <div>
                <div className="text-base font-semibold flex items-center mb-4">
                  <Heart className="text-red-500 mr-2" size={20} />
                  Health Conditions
                </div>
                <div className="space-y-3">
                  {healthConditionOptions.map((condition) => (
                    <div 
                      key={condition}
                      className={`flex items-center space-x-3 p-3 border rounded-xl transition-colors ${
                        (user?.healthConditions || []).includes(condition) 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <Checkbox 
                        checked={(user?.healthConditions || []).includes(condition)}
                        disabled
                      />
                      <span className={`text-sm font-medium ${
                        (user?.healthConditions || []).includes(condition) ? 'text-orange-700' : ''
                      }`}>
                        {condition}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Display custom health conditions */}
                {user?.healthConditions && user.healthConditions.filter(c => !healthConditionOptions.includes(c)).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Custom Health Conditions:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.healthConditions.filter(c => !healthConditionOptions.includes(c)).map((condition) => (
                        <span key={condition} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No health conditions message */}
                {(!user?.healthConditions || user.healthConditions.length === 0) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">✅ No health conditions</p>
                  </div>
                )}
              </div>


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
