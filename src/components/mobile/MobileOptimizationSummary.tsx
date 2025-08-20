import React from 'react';
import { Smartphone, Zap, Eye, Shield, BarChart3, CheckCircle } from 'lucide-react';

const MobileOptimizationSummary: React.FC = () => {
  const optimizations = [
    {
      category: 'Viewport & Meta Tags',
      icon: Smartphone,
      color: 'bg-blue-100 text-blue-600',
      features: [
        'Enhanced viewport meta tag with viewport-fit=cover',
        'PWA-ready meta tags for mobile web app capability',
        'Dynamic viewport height (dvh) support',
        'Safe area insets for modern devices'
      ]
    },
    {
      category: 'Touch & Interaction',
      icon: Eye,
      color: 'bg-green-100 text-green-600',
      features: [
        'Touch-friendly button sizes (44px minimum)',
        'Touch action manipulation for better responsiveness',
        'Swipe gesture detection and tracking',
        'Tap highlight removal for native feel'
      ]
    },
    {
      category: 'Performance Monitoring',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      features: [
        'Lighthouse API integration for mobile testing',
        'Core Web Vitals tracking (LCP, FID, CLS)',
        'Mobile-specific performance metrics',
        'Real-time performance recommendations'
      ]
    },
    {
      category: 'Analytics & Tracking',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
      features: [
        'Supabase integration for usage tracking',
        'Device capability detection and tracking',
        'Mobile-specific interaction analytics',
        'Offline/online state monitoring'
      ]
    },
    {
      category: 'Responsive Design',
      icon: Shield,
      color: 'bg-orange-100 text-orange-600',
      features: [
        'Mobile-first CSS architecture',
        'Responsive typography scaling',
        'Adaptive grid layouts',
        'Mobile-optimized navigation patterns'
      ]
    }
  ];

  return (
    <div className="mobile-card">
      <div className="border-b border-neutral-100 pb-4 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-sage rounded-xl flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-responsive-xl font-bold text-neutral-900">Mobile-First Optimizations</h2>
            <p className="text-responsive-sm text-neutral-600">Comprehensive mobile experience enhancements</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {optimizations.map((optimization, index) => {
          const Icon = optimization.icon;
          return (
            <div key={index} className="border border-neutral-100 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${optimization.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-responsive-base font-semibold text-neutral-900">
                  {optimization.category}
                </h3>
              </div>
              
              <div className="space-y-2">
                {optimization.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-responsive-sm text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-sage/5 rounded-xl border border-sage/20">
        <h3 className="text-responsive-base font-semibold text-sage mb-2">Implementation Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Viewport optimization complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Touch interactions enhanced</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Performance monitoring active</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Analytics tracking enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizationSummary;
