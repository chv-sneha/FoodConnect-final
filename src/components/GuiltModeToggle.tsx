import React, { useState, useEffect } from 'react';
import { Shield, Heart, ToggleLeft, ToggleRight } from 'lucide-react';

interface GuiltModeProps {
  onModeChange: (isGuiltMode: boolean) => void;
}

export default function GuiltModeToggle({ onModeChange }: GuiltModeProps) {
  const [isGuiltMode, setIsGuiltMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('guiltMode');
    if (saved) {
      const mode = JSON.parse(saved);
      setIsGuiltMode(mode);
      onModeChange(mode);
    }
  }, [onModeChange]);

  const toggleMode = () => {
    const newMode = !isGuiltMode;
    setIsGuiltMode(newMode);
    localStorage.setItem('guiltMode', JSON.stringify(newMode));
    onModeChange(newMode);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isGuiltMode ? (
            <Heart className="w-6 h-6 text-pink-600" />
          ) : (
            <Shield className="w-6 h-6 text-green-600" />
          )}
          <div>
            <h3 className="font-bold text-lg">
              {isGuiltMode ? 'Guilt Mode: ON' : 'Strict Mode: ON'}
            </h3>
            <p className="text-sm text-gray-600">
              {isGuiltMode 
                ? 'Balanced recommendations - "Okay occasionally" products included'
                : 'Only the healthiest options - Score 75+ products only'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={toggleMode}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          {isGuiltMode ? (
            <ToggleRight className="w-8 h-8 text-pink-600" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-gray-400" />
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className={`p-3 rounded-lg border ${!isGuiltMode ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="font-medium text-green-800">Strict Mode</h4>
          <ul className="text-green-700 mt-1 space-y-1">
            <li>• Score 75+ only</li>
            <li>• Healthiest options</li>
            <li>• No compromises</li>
          </ul>
        </div>
        
        <div className={`p-3 rounded-lg border ${isGuiltMode ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="font-medium text-pink-800">Guilt Mode</h4>
          <ul className="text-pink-700 mt-1 space-y-1">
            <li>• Score 45-65 allowed</li>
            <li>• "Once a week" treats</li>
            <li>• Balanced approach</li>
          </ul>
        </div>
      </div>
    </div>
  );
}