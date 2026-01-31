import React from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface NutritionAnalysisProps {
  product: any;
  score: number;
}

export default function NutritionAnalysisResults({ product, score }: NutritionAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScaleBg = (position: number, max: number) => {
    const percentage = (position / max) * 100;
    if (percentage <= 33) return 'bg-green-500';
    if (percentage <= 66) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderScale = (position: number, max: number, segments: number[]) => (
    <div className="relative mt-2">
      <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
      <div 
        className="absolute top-0 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-green-400"
        style={{ left: `${(position / max) * 100}%`, transform: 'translateX(-50%)' }}
      ></div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        {segments.map((seg, idx) => (
          <span key={idx}>{seg}</span>
        ))}
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="bg-white text-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-xl font-bold">NutriScan</h1>
        </div>
      </div>

      {/* Product Image and Basic Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
        <div className="flex items-start space-x-4">
          <img 
            src="/api/placeholder/80/100" 
            alt={product.name}
            className="w-20 h-25 object-cover rounded border"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-600 text-lg">{product.brand}</p>
            <p className="text-gray-700 text-sm mt-2">
              {product.ingredients.join(', ')}.
            </p>
            <div className="flex items-center mt-3">
              <div className={`w-3 h-3 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
              <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                Good ({score}/100)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Positives Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-orange-600 mb-4">Positives <span className="text-gray-500">Per 100g</span></h3>
        
        {product.analysis.positives.map((item, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{item.icon}</span>
                <div className="flex items-center">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-bold mr-2 text-gray-900">{item.value}</span>
                <div className={`w-4 h-4 rounded-full ${item.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'} mr-1`}></div>
                <ChevronUp className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            
            {item.scale_position && (
              renderScale(item.scale_position, item.scale_max, [
                '0', 
                Math.round(item.scale_max * 0.33).toString(), 
                Math.round(item.scale_max * 0.66).toString(), 
                item.scale_max.toString()
              ])
            )}
          </div>
        ))}

        {/* Special items without scales */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🍯</span>
              <div>
                <h4 className="font-bold">Sugar</h4>
                <p className="text-gray-400 text-sm">Sweet, not sugary.</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">3 g</span>
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚗️</span>
              <div>
                <h4 className="font-bold">No additives</h4>
                <p className="text-gray-400 text-sm">No hazardous substances</p>
              </div>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🌾</span>
              <div>
                <h4 className="font-bold">Fiber</h4>
                <p className="text-gray-400 text-sm">Some fiber</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">0.43 g</span>
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Negatives Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">Negatives <span className="text-gray-400">Per 100g</span></h3>
        
        {product.analysis.negatives.map((item, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{item.icon}</span>
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-bold mr-2">{item.value}</span>
                <div className="w-4 h-4 rounded-full bg-red-500 mr-1"></div>
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {item.scale_position && (
              <div className="relative mt-2">
                <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                <div 
                  className="absolute top-0 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-400"
                  style={{ left: `${(item.scale_position / item.scale_max) * 100}%`, transform: 'translateX(-50%)' }}
                ></div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>2</span>
                  <span>4</span>
                  <span>7</span>
                  <span>10</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}