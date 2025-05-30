
import React, { useState } from 'react';
import WalletInput from '@/components/WalletInput';
import PersonaDisplay from '@/components/PersonaDisplay';
import InteractiveAnalyticsDashboard from '@/components/InteractiveAnalyticsDashboard';
import WalletJourney from '@/components/WalletJourney';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import RiskAssessment from '@/components/RiskAssessment';
import { Persona } from '@/types/persona';

const Index = () => {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonaGenerated = (persona: Persona) => {
    setCurrentPersona(persona);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-6">
              <span className="web3-gradient bg-clip-text text-transparent">
                AI Wallet Persona Engine
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time blockchain analysis powered by AI. Discover the story behind any Web3 wallet 
              through actual on-chain data, transaction patterns, and behavioral insights.
            </p>
            <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Live Python Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Interactive Visualizations</span>
              </div>
            </div>
          </div>

          <WalletInput 
            onPersonaGenerated={handlePersonaGenerated}
            onLoadingChange={handleLoadingChange}
          />
        </div>
      </div>

      {/* Results Section */}
      {(currentPersona || isLoading) && (
        <div className="container mx-auto px-4 py-12">
          {/* Main Persona Display */}
          <div className="mb-8">
            <PersonaDisplay persona={currentPersona} isLoading={isLoading} />
          </div>

          {/* Interactive Analytics Dashboard */}
          {currentPersona && (
            <div className="mb-8">
              <InteractiveAnalyticsDashboard persona={currentPersona} isLoading={isLoading} />
            </div>
          )}

          {/* Detailed Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <WalletJourney persona={currentPersona} isLoading={isLoading} />
            </div>

            {/* Side Panel */}
            <div className="space-y-8">
              <RiskAssessment persona={currentPersona} isLoading={isLoading} />
              <RecommendationsPanel persona={currentPersona} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Features Section */}
      {!currentPersona && !isLoading && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Advanced Blockchain Intelligence
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our Flask backend executes sophisticated Python analysis on your CSV datasets to provide authentic insights into wallet behavior and Web3 activity patterns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🐍"
              title="Python-Powered Analysis"
              description="Advanced machine learning algorithms analyze wallet patterns using your comprehensive CSV datasets with real transaction history."
            />
            <FeatureCard
              icon="📊"
              title="Interactive Visualizations"
              description="Rich, interactive charts and graphs showing portfolio composition, risk metrics, and performance analysis with real-time updates."
            />
            <FeatureCard
              icon="🎯"
              title="AI-Generated Personas"
              description="Sophisticated persona generation using machine learning models that understand complex Web3 behavioral patterns."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <FeatureCard
              icon="🔄"
              title="Real-Time Processing"
              description="Flask backend processes your Python scripts in real-time, providing instant analysis results from your comprehensive wallet datasets."
            />
            <FeatureCard
              icon="📈"
              title="Advanced Analytics"
              description="Deep insights including risk assessment, health scoring, portfolio optimization, and behavioral classification using ML algorithms."
            />
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="glassmorphism rounded-2xl p-8 text-center hover:glow-purple transition-all duration-300 group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default Index;
