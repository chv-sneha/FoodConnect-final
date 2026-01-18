import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Brain, Target, Users, Award } from 'lucide-react';
import { ModernNavbar } from '@/components/ModernNavbar';

export default function About() {
  const features = [
    {
      icon: <Zap className="text-yellow-600" size={32} />,
      title: 'Instant Analysis',
      description: 'Real-time food safety analysis using advanced OCR and ML algorithms'
    },
    {
      icon: <Shield className="text-green-600" size={32} />,
      title: 'FSSAI Verification',
      description: 'Automated verification of food safety licenses and compliance'
    },
    {
      icon: <Brain className="text-purple-600" size={32} />,
      title: 'AI-Powered Insights',
      description: 'Machine learning models for personalized health recommendations'
    },
    {
      icon: <Target className="text-red-600" size={32} />,
      title: 'Personalized Analysis',
      description: 'Custom health profiles with allergen detection and dietary preferences'
    }
  ];

  const workflow = [
    {
      step: '1',
      title: 'Image Capture',
      description: 'Users scan food packaging using their device camera'
    },
    {
      step: '2',
      title: 'OCR Processing',
      description: 'Advanced OCR extracts text from ingredient labels and nutrition facts'
    },
    {
      step: '3',
      title: 'ML Analysis',
      description: 'Multiple machine learning models analyze ingredients for safety and nutrition'
    },
    {
      step: '4',
      title: 'FSSAI Verification',
      description: 'Automated verification of food safety licenses and compliance standards'
    },
    {
      step: '5',
      title: 'Personalized Results',
      description: 'Customized health insights based on user profile and dietary requirements'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About FoodConnect
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              FoodConnect is an intelligent food safety analysis platform that combines computer vision, 
              natural language processing, and machine learning to provide personalized health insights 
              and safety ratings for food products.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                To empower consumers with intelligent food analysis tools that promote healthier eating habits, 
                ensure food safety compliance, and provide personalized nutrition guidance through cutting-edge AI technology.
              </p>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="space-y-8">
              {workflow.map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• React 18 with TypeScript</li>
                    <li>• Tailwind CSS + shadcn/ui</li>
                    <li>• Wouter for routing</li>
                    <li>• TanStack Query</li>
                    <li>• Framer Motion</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Node.js + Express.js</li>
                    <li>• Firebase (Auth + Firestore)</li>
                    <li>• Tesseract.js for OCR</li>
                    <li>• Sharp for image processing</li>
                    <li>• WebSocket for real-time updates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Learning</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Python 3.8+</li>
                    <li>• TensorFlow/Keras</li>
                    <li>• Scikit-learn</li>
                    <li>• XGBoost</li>
                    <li>• OpenCV for image processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Impact */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Impact</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  This project serves as a comprehensive machine learning research study on intelligent food safety assessment, 
                  contributing to the advancement of AI applications in public health and consumer safety.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="flex justify-center mb-4">
                    <Users className="text-blue-600" size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Consumer Empowerment</h3>
                  <p className="text-gray-600">Helping consumers make informed food choices</p>
                </div>
                <div>
                  <div className="flex justify-center mb-4">
                    <Shield className="text-green-600" size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Food Safety</h3>
                  <p className="text-gray-600">Promoting food safety compliance and awareness</p>
                </div>
                <div>
                  <div className="flex justify-center mb-4">
                    <Award className="text-purple-600" size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Innovation</h3>
                  <p className="text-gray-600">Advancing AI applications in healthcare and nutrition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}