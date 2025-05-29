
import React, { useState } from 'react';
import WalletInput from '@/components/WalletInput';
import PersonaDisplay from '@/components/PersonaDisplay';
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
                Wallet Persona Engine
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the story behind any Web3 wallet. Our AI analyzes on-chain behavior 
              to generate unique personas, risk assessments, and personalized recommendations.
            </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Persona Display */}
            <div className="lg:col-span-2 space-y-8">
              <PersonaDisplay persona={currentPersona} isLoading={isLoading} />
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

      {/* Features Section */}
      {!currentPersona && !isLoading && (
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🧠"
              title="AI-Powered Analysis"
              description="Advanced machine learning algorithms analyze transaction patterns, DeFi interactions, and NFT collections to create detailed profiles."
            />
            <FeatureCard
              icon="📊"
              title="Risk Assessment"
              description="Comprehensive risk scoring based on wallet behavior, transaction history, and interaction with protocols."
            />
            <FeatureCard
              icon="🎯"
              title="Smart Recommendations"
              description="Personalized dApp and investment recommendations based on your unique on-chain persona and behavior patterns."
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
