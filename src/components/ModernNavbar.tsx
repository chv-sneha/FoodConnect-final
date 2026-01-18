import { useState } from 'react';
import { User, ChevronDown, Leaf, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function ModernNavbar() {
  const [location] = useLocation();
  const [showAnalysisDropdown, setShowAnalysisDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ANALYSIS', path: '/analysis', hasDropdown: true },
    { label: 'FOOD DATABASE', path: '/food-database' },
    { label: 'HEALTH INSIGHTS', path: '/health-insights' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT US', path: '/contact' }
  ];

  const getActivePath = () => {
    if (location === '/') return '/';
    if (location === '/generic' || location === '/customized') return '/analysis';
    return location;
  };

  const activePath = getActivePath();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <Leaf className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FoodConnect</h1>
              <p className="text-xs text-gray-500">Know What You Eat</p>
            </div>
          </Link>

          {/* Desktop Navigation Pill */}
          <div className="hidden lg:flex relative items-center bg-transparent border border-gray-300 rounded-full px-2 py-2">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                {/* Active Background Pill */}
                {activePath === item.path && (
                  <div className="absolute inset-0 bg-primary rounded-full" />
                )}
                
                {/* Navigation Item */}
                {item.hasDropdown ? (
                  <button
                    onClick={() => setShowAnalysisDropdown(!showAnalysisDropdown)}
                    className={`relative z-10 px-6 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center space-x-1 ${
                      activePath === item.path ? 'text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} className={`transition-transform ${showAnalysisDropdown ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link href={item.path}>
                    <button className={`relative z-10 px-6 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 ${
                      activePath === item.path ? 'text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}>
                      {item.label}
                    </button>
                  </Link>
                )}

                {/* Analysis Dropdown */}
                {item.hasDropdown && showAnalysisDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <Link href="/generic">
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        Generic Analysis
                      </button>
                    </Link>
                    <Link href="/customized">
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        Customized Analysis
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Profile/Login */}
          <Link href="/profile" className="hidden lg:block">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">PROFILE</span>
            </button>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <div key={item.path}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setShowAnalysisDropdown(!showAnalysisDropdown)}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center justify-between ${
                          activePath === item.path ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        } transition-colors rounded-lg`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown size={14} className={`transition-transform ${showAnalysisDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showAnalysisDropdown && (
                        <div className="ml-4 mt-2 space-y-1">
                          <Link href="/generic">
                            <button 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              Generic Analysis
                            </button>
                          </Link>
                          <Link href="/customized">
                            <button 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              Customized Analysis
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.path}>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold ${
                          activePath === item.path ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        } transition-colors rounded-lg`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Profile Link */}
              <Link href="/profile">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg flex items-center space-x-2"
                >
                  <User size={16} />
                  <span>PROFILE</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}