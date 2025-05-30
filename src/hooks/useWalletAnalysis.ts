
import { useState } from 'react';
import { Persona } from '@/types/persona';
import { PythonDataService } from '@/services/pythonDataService';
import { useToast } from '@/hooks/use-toast';

export const useWalletAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
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
    setAnalysisProgress('Initializing analysis...');
    
    try {
      toast({
        title: "Starting Analysis",
        description: "Executing Python analysis script with Flask backend...",
      });

      setAnalysisProgress('Loading wallet data from CSV files...');
      
      // Use Flask backend to get real analysis
      const result = await pythonService.analyzeWallet(address);
      setPersona(result);
      
      setAnalysisProgress('Analysis complete!');
      
      toast({
        title: "Analysis Complete!",
        description: "Wallet persona generated using Flask backend with real CSV data",
      });
    } catch (error) {
      console.error('Flask analysis failed:', error);
      
      setAnalysisProgress('Analysis failed - using fallback data');
      
      toast({
        title: "Backend Connection Failed",
        description: "Could not connect to Flask backend. Please ensure your Python server is running on localhost:5000",
        variant: "destructive"
      });

      // Fallback to mock data if Flask service fails
      try {
        const { generateMockPersona } = await import('@/utils/mockData');
        const mockPersona = generateMockPersona(address);
        setPersona(mockPersona);
        
        toast({
          title: "Using Demo Data",
          description: "Showing demo persona while Flask backend is unavailable",
          variant: "destructive"
        });
      } catch (mockError) {
        console.error('Even mock data failed:', mockError);
        setAnalysisProgress('Analysis failed completely');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadAvailableWallets = async () => {
    try {
      setAnalysisProgress('Loading available wallets from CSV...');
      const wallets = await pythonService.getAvailableWallets();
      setAvailableWallets(wallets);
      setAnalysisProgress('');
    } catch (error) {
      console.error('Failed to load available wallets:', error);
      setAnalysisProgress('Failed to load wallets');
    }
  };

  const checkAnalysisStatus = async (address: string) => {
    try {
      const status = await pythonService.getAnalysisStatus(address);
      return status;
    } catch (error) {
      console.error('Failed to check analysis status:', error);
      return { status: 'unknown' };
    }
  };

  return {
    analyzeWallet,
    isAnalyzing,
    persona,
    setPersona,
    availableWallets,
    loadAvailableWallets,
    analysisProgress,
    checkAnalysisStatus
  };
};
