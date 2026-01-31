import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, Loader2, AlertTriangle, X } from 'lucide-react';
import NutritionAnalysisResults from './NutritionAnalysisResults';

interface BarcodeResult {
  success: boolean;
  barcode: string;
  product: any;
  personalizedScore: number;
  scoreColor: string;
  scoreLabel: string;
  alerts: Array<{
    type: 'allergen' | 'health_risk' | 'goal_boost';
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

interface BarcodeScannerProps {
  onScanResult?: (result: any) => void;
}

export default function BarcodeScanner({ onScanResult }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<BarcodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setIsScanning(true);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateBarcodeScanning = () => {
    // Simulate scanning the Budhani Wafers barcode
    setTimeout(() => {
      scanBarcode('8906199000014');
    }, 2000);
  };

  const scanBarcode = async (barcodeData: string) => {
    try {
      const response = await fetch('http://localhost:5002/api/barcode/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: barcodeData })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        if (onScanResult) {
          onScanResult(data);
        } else {
          setShowResults(true);
        }
        stopScanning();
        
        // Play alert sound for high-severity alerts
        const hasHighAlert = data.alerts?.some(alert => alert.severity === 'high');
        if (hasHighAlert) {
          new Audio('/alert.mp3').play().catch(() => {});
        }
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (err) {
      setError('Failed to scan barcode');
    }
  };

  // Auto-start scanning simulation when component mounts
  useEffect(() => {
    if (isScanning) {
      simulateBarcodeScanning();
    }
  }, [isScanning]);

  if (showResults && result) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            setShowResults(false);
            setResult(null);
          }}
          className="absolute top-4 right-4 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <NutritionAnalysisResults 
          product={result.product} 
          score={result.personalizedScore} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Scan className="w-6 h-6 mr-2" />
          Barcode Scanner
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {!isScanning ? (
          <div className="text-center space-y-4">
            <div className="bg-gray-50 p-8 rounded-lg">
              <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Scan Product Barcode
              </h3>
              <p className="text-gray-600 mb-4">
                Point your camera at the barcode to get personalized nutrition analysis
              </p>
            </div>
            
            <button
              onClick={startScanning}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Scanning
            </button>
            
            <div className="text-sm text-gray-500">
              <p>📱 Demo: Will automatically scan Budhani Wafers</p>
              <p>🔍 Barcode: 8906199000014</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="w-full rounded-lg" 
                style={{ maxHeight: '400px' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-red-500 rounded-lg" style={{ width: '250px', height: '100px' }}>
                  <div className="w-full h-full border-2 border-dashed border-red-300 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">🔍 Scanning for barcode...</p>
              <button
                onClick={stopScanning}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}