
import { useState } from 'react';
import { Persona } from '@/types/persona';
import { PythonDataService } from '@/services/pythonDataService';
import { useToast } from '@/hooks/use-toast';

export const useWalletAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const { toast } = useToast();

  const pythonService = new PythonDataService();

  const analyzeWallet = async (address: string) => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analyzing Wallet",
        description: "Running Python analysis on real blockchain data...",
      });

      // Use Python data service to get real analysis
      const result = await pythonService.analyzeWallet(address);
      setPersona(result);
      
      toast({
        title: "Analysis Complete!",
        description: "Wallet persona generated using real blockchain data",
      });
    } catch (error) {
      console.error('Python analysis failed:', error);
      
      toast({
        title: "Analysis Failed",
        description: "Could not connect to Python analysis service. Please ensure your backend is running.",
        variant: "destructive"
      });

      // Fallback to mock data if Python service fails
      try {
        const { generateMockPersona } = await import('@/utils/mockData');
        const mockPersona = generateMockPersona(address);
        setPersona(mockPersona);
        
        toast({
          title: "Using Demo Data",
          description: "Showing demo persona while Python service is unavailable",
          variant: "destructive"
        });
      } catch (mockError) {
        console.error('Even mock data failed:', mockError);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadAvailableWallets = async () => {
    try {
      const wallets = await pythonService.getAvailableWallets();
      setAvailableWallets(wallets);
    } catch (error) {
      console.error('Failed to load available wallets:', error);
    }
  };

  return {
    analyzeWallet,
    isAnalyzing,
    persona,
    setPersona,
    availableWallets,
    loadAvailableWallets
  };
};
