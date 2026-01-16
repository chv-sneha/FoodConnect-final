import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Heart, Activity } from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface HealthMetric {
  name: string;
  current: number;
  trend: "up" | "down" | "stable";
  risk: "low" | "medium" | "high";
  prediction: string;
  recommendation: string;
}

const healthData: HealthMetric[] = [
  {
    name: "Blood Sugar Risk",
    current: 65,
    trend: "up",
    risk: "medium",
    prediction: "15% increase in diabetes risk if current pattern continues",
    recommendation: "Reduce sugar intake by 40%, add more fiber-rich foods"
  },
  {
    name: "Heart Health Score",
    current: 78,
    trend: "stable",
    risk: "low",
    prediction: "Good cardiovascular health maintenance",
    recommendation: "Continue current healthy eating pattern"
  },
  {
    name: "Nutrient Balance", 
    current: 85,
    trend: "up",
    risk: "low",
    prediction: "Excellent nutritional profile trending positively",
    recommendation: "Maintain diverse food choices"
  },
  {
    name: "Inflammation Markers",
    current: 45,
    trend: "down",
    risk: "medium", 
    prediction: "Reducing inflammation levels - good progress",
    recommendation: "Add more anti-inflammatory foods like turmeric, ginger"
  }
];

const AiHealthForecast = () => {
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600"; 
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="text-center mb-12 text-gray-900">
          <TrendingUp className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">AI Health Forecast</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Predict future health risks from your eating patterns and prevent them early
          </p>
          
          {/* How it works explanation */}
          <Card className="bg-blue-50 border-blue-200 mt-8 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">🤖 How AI Health Forecast Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">📊</span>
                  </div>
                  <h4 className="font-medium mb-1">1. Analyze Your Data</h4>
                  <p className="text-gray-600">We analyze your food scans, eating patterns, and health inputs</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">🧠</span>
                  </div>
                  <h4 className="font-medium mb-1">2. AI Prediction</h4>
                  <p className="text-gray-600">Machine learning models predict future health risks</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">💡</span>
                  </div>
                  <h4 className="font-medium mb-1">3. Get Recommendations</h4>
                  <p className="text-gray-600">Receive personalized advice to prevent health issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Health Status */}
          <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Your Current Health Forecast
                <Badge className="ml-2 bg-green-100 text-green-800">Based on 30 days of data</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {healthData.map((metric, index) => (
                  <Card 
                    key={index} 
                    className="bg-white shadow-md border hover:border-primary cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">{metric.name}</h3>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold">{metric.current}%</span>
                          <Badge 
                            variant="outline" 
                            className={getRiskColor(metric.risk)}
                          >
                            {metric.risk} risk
                          </Badge>
                        </div>
                        <Progress value={metric.current} className="h-2" />
                        <p className="text-xs text-gray-500">Click for details</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedMetric && (
            <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  {selectedMetric.name} - Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      AI Prediction
                    </h4>
                    <p className="text-muted-foreground bg-yellow-50 p-4 rounded-lg">
                      {selectedMetric.prediction}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Recommended Actions
                    </h4>
                    <p className="text-muted-foreground bg-green-50 p-4 rounded-lg">
                      {selectedMetric.recommendation}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Weekly Progress Tracking</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">{day}</div>
                        <div className={`h-8 rounded ${i < 5 ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Insights */}
          <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Key Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Immediate Attention</h4>
                  <p className="text-sm text-red-700 mb-3">Your sugar intake is 40% above recommended levels</p>
                  <Badge className="bg-red-100 text-red-800">Action needed in 2 weeks</Badge>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Good Progress</h4>
                  <p className="text-sm text-green-700 mb-3">Your fiber intake improved by 25% this month</p>
                  <Badge className="bg-green-100 text-green-800">Keep it up!</Badge>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📈 30-Day Prediction</h4>
                <p className="text-sm text-blue-700">
                  If you continue current eating patterns: <strong>15% increased diabetes risk</strong>. 
                  But if you follow our recommendations: <strong>20% improvement in overall health score</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Tracking */}
          <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg border-2">
            <CardHeader>
              <CardTitle>Your Health Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">7</div>
                  <div className="text-sm text-muted-foreground">Healthy Days Streak</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">Great Progress!</Badge>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">23</div>
                  <div className="text-sm text-muted-foreground">Food Items Scanned</div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Active User</Badge>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                  <Badge className="mt-2 bg-purple-100 text-purple-800">Excellent</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white hover:from-green-600 hover:to-blue-600">
              📊 Generate Detailed Health Report
            </Button>
            <p className="text-sm text-gray-500">
              Get a comprehensive 10-page PDF report with personalized recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiHealthForecast;