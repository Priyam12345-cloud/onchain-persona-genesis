
import { useState } from 'react';
import { Persona } from '@/types/persona';
import { PersonaAnalysisService } from '@/services/personaAnalysisService';
import { AlchemyProvider } from '@/services/blockchainService';
import { useToast } from '@/hooks/use-toast';

export const useWalletAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const analyzeWallet = async (address: string) => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address or ENS name",
        variant: "destructive"
      });
      return;
    }

    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address) || address.endsWith('.eth');
    if (!isValidAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address or ENS name",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // For demo purposes, we'll use a fallback API key or demo mode
      // In production, this would come from environment variables
      const apiKey = 'demo-key'; // This would be replaced with actual API key
      const provider = new AlchemyProvider(apiKey);
      const analysisService = new PersonaAnalysisService(provider);
      
      const result = await analysisService.analyzeWallet(address);
      setPersona(result);
      
      toast({
        title: "Analysis Complete!",
        description: "Your wallet persona has been generated successfully",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze wallet. Using demo data for now.",
        variant: "destructive"
      });
      
      // Fallback to mock data if real analysis fails
      const { generateMockPersona } = await import('@/utils/mockData');
      const mockPersona = generateMockPersona(address);
      setPersona(mockPersona);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeWallet,
    isAnalyzing,
    persona,
    setPersona
  };
};
