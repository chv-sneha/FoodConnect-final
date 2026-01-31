import React, { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import GuiltModeToggle from '@/components/GuiltModeToggle';
import BlinkitIntegration from '@/components/BlinkitIntegration';
import NutritionAnalysisResults from '@/components/NutritionAnalysisResults';
import { Zap, Shield, ShoppingCart } from 'lucide-react';

export default function PersonalizedScanner() {
  const [isGuiltMode, setIsGuiltMode] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [personalizedScore, setPersonalizedScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleModeChange = (guiltMode: boolean) => {
    setIsGuiltMode(guiltMode);
  };

  const handleScanResult = (result: any) => {
    setScannedProduct(result.product);
    setPersonalizedScore(result.personalizedScore);
    setShowResults(true);
  };

  if (showResults && scannedProduct) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            setShowResults(false);
            setScannedProduct(null);
          }}
          className="absolute top-4 right-4 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          ←
        </button>
        <NutritionAnalysisResults 
          product={scannedProduct} 
          score={personalizedScore} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Barcode Scanner
        </h1>
        <p className="text-gray-600 text-lg">
          Scan product barcodes for personalized nutrition analysis
        </p>
      </div>

      {/* Feature Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
          <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-blue-900">Personalized Health Profile</h3>
          <p className="text-sm text-blue-700 mt-2">
            Barcode scanner with allergy alerts & health condition analysis
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-bold text-green-900">Guilt Mode System</h3>
          <p className="text-sm text-green-700 mt-2">
            Strict vs balanced recommendations for realistic choices
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg text-center">
          <ShoppingCart className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <h3 className="font-bold text-yellow-900">Blinkit Integration</h3>
          <p className="text-sm text-yellow-700 mt-2">
            Instant purchase of healthier alternatives with revenue sharing
          </p>
        </div>
      </div>

      {/* Guilt Mode Toggle */}
      <GuiltModeToggle onModeChange={handleModeChange} />

      {/* Barcode Scanner */}
      <BarcodeScanner onScanResult={handleScanResult} />

      {/* Blinkit Integration - Show when product is scanned */}
      {scannedProduct && personalizedScore < 70 && (
        <BlinkitIntegration 
          currentProduct={scannedProduct}
          userScore={personalizedScore}
        />
      )}
    </div>
  );
}