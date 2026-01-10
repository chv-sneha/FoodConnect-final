import React, { useEffect, useState } from 'react';
import { Zap, Shield, Brain, Sparkles, X } from 'lucide-react';

interface IntroSplashProps {
  onComplete: () => void;
  /** milliseconds to show the splash (default 5000ms) */
  duration?: number;
  /** show a Skip button in the top-right */
  showSkip?: boolean;
}

export function IntroSplash({ onComplete, duration = 4000, showSkip = true }: IntroSplashProps) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start timer to fade out then complete
    const timeout = setTimeout(() => {
      setFadingOut(true);
      // give fade animation a little time before completing
      const finish = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(finish);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      aria-hidden={false}
      className={`fixed inset-0 bg-gradient-to-br from-primary via-green-600 to-secondary z-50 flex items-center justify-center transition-opacity duration-400 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative w-full max-w-3xl px-6">
        {showSkip && (
          <button
            aria-label="Skip intro"
            onClick={handleSkip}
            className="absolute right-2 top-2 z-50 rounded-md bg-white/10 hover:bg-white/20 text-white p-2 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X size={16} />
          </button>
        )}

        <div className="text-center text-white space-y-8 py-12">
          {/* Logo Animation */}
          <div className="opacity-100 scale-100 transition-all duration-1000">
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="text-primary" size={48} />
            </div>
            <h1 className="text-5xl font-bold mb-2">FoodConnect</h1>
            <p className="text-xl opacity-90">Intelligent Food Safety Analysis</p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center space-x-12 opacity-100 translate-y-0 transition-all duration-1000 delay-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                <Zap className="text-white" size={32} />
              </div>
              <p className="text-sm">Instant Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 animate-bounce delay-100">
                <Shield className="text-white" size={32} />
              </div>
              <p className="text-sm">Safety First</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 animate-bounce delay-200">
                <Brain className="text-white" size={32} />
              </div>
              <p className="text-sm">AI Powered</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="opacity-100 translate-y-0 transition-all duration-1000 delay-1000">
            <p className="text-2xl font-light">Scan. Analyze. Stay Healthy.</p>
          </div>

          {/* Loading Bar */}
          <div className="w-64 mx-auto opacity-100 transition-all duration-1000 delay-1500">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
            <p className="text-sm mt-2 opacity-75">Initializing AI Systems...</p>
          </div>
        </div>
      </div>

      {/* Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
