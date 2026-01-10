import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp, Shield, Brain, Activity, Apple } from 'lucide-react';
import { ModernNavbar } from '@/components/ModernNavbar';

export default function HealthInsights() {
  const insights = [
    {
      title: 'Nutrition Trends',
      description: 'Track your daily nutritional intake patterns',
      icon: <TrendingUp className="text-blue-600" size={32} />,
      stats: '85% users improved their diet'
    },
    {
      title: 'Health Monitoring',
      description: 'Monitor your health metrics and food safety scores',
      icon: <Heart className="text-red-600" size={32} />,
      stats: '92% reduction in health risks'
    },
    {
      title: 'Smart Recommendations',
      description: 'AI-powered personalized food suggestions',
      icon: <Brain className="text-purple-600" size={32} />,
      stats: '10,000+ recommendations daily'
    },
    {
      title: 'Safety Alerts',
      description: 'Real-time alerts for allergens and harmful ingredients',
      icon: <Shield className="text-green-600" size={32} />,
      stats: '99.9% accuracy in detection'
    }
  ];

  const healthTips = [
    'Read ingredient labels carefully before purchasing',
    'Check for allergens that match your health profile',
    'Limit processed foods with high sodium content',
    'Choose foods with natural ingredients over artificial ones',
    'Monitor your daily caloric intake based on activity level',
    'Stay hydrated and maintain balanced nutrition'
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Health Insights & Analytics
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover personalized health insights, nutrition trends, and smart recommendations 
              to make better food choices for your wellbeing.
            </p>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {insights.map((insight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {insight.icon}
                  </div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  <div className="text-sm font-semibold text-blue-600">{insight.stats}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Health Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Apple className="text-green-600 mr-3" size={24} />
                  Daily Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {healthTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="text-blue-600 mr-3" size={24} />
                  Your Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-600 mb-2">85</div>
                  <div className="text-gray-600">Overall Health Score</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Nutrition Quality</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">83%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Safety Awareness</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="w-22 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Goal Achievement</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="w-18 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}