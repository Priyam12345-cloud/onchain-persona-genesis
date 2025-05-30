import React, { useState } from 'react';
import WalletInput from '@/components/WalletInput';
import PersonaDisplay from '@/components/PersonaDisplay';
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
      <div className="container mx-auto px-4 py-12">
        <WalletInput 
          onPersonaGenerated={handlePersonaGenerated}
          onLoadingChange={handleLoadingChange}
        />
      </div>
      {/* Results Section */}
      {(currentPersona || isLoading) && (
        <div className="container mx-auto px-4 py-12">
          {/* Main Persona Display */}
          <div className="mb-8">
            <PersonaDisplay persona={currentPersona} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
