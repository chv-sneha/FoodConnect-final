import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, Star, TrendingUp } from 'lucide-react';

interface BlinkitProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  score: number;
  deliveryTime: string;
  blinkitUrl: string;
}

interface BlinkitIntegrationProps {
  currentProduct: any;
  userScore: number;
}

export default function BlinkitIntegration({ currentProduct, userScore }: BlinkitIntegrationProps) {
  const [alternatives, setAlternatives] = useState<BlinkitProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlternatives = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/blinkit/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product: currentProduct,
          userScore: userScore 
        })
      });
      const data = await response.json();
      setAlternatives(data.alternatives || []);
    } catch (error) {
      console.error('Failed to fetch alternatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlinkitRedirect = (product: BlinkitProduct) => {
    // Track affiliate click
    fetch('http://localhost:5002/api/analytics/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        originalProduct: currentProduct.name,
        userScore: userScore
      })
    });

    // Redirect to Blinkit
    window.open(product.blinkitUrl, '_blank');
  };

  React.useEffect(() => {
    if (userScore < 70) {
      fetchAlternatives();
    }
  }, [userScore]);

  if (userScore >= 70) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">
            Great choice! This product aligns well with your health profile.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Better Alternatives on Blinkit
        </h3>
        <div className="text-sm text-gray-500">
          Delivered in 10-15 mins
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Finding healthier options...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternatives.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-600">{product.brand}</p>
                  
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-bold px-2 py-1 rounded ${
                      product.score >= 80 ? 'bg-green-100 text-green-800' :
                      product.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.score}/100
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      vs {userScore}/100 current
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-green-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleBlinkitRedirect(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs flex items-center"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Buy Now
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        🤝 Powered by Blinkit • Earn rewards on healthy choices
      </div>
    </div>
  );
}