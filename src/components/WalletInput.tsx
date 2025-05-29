
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMockPersona } from '@/utils/mockData';
import { Persona } from '@/types/persona';

interface WalletInputProps {
  onPersonaGenerated: (persona: Persona) => void;
  onLoadingChange: (loading: boolean) => void;
}

const WalletInput: React.FC<WalletInputProps> = ({ onPersonaGenerated, onLoadingChange }) => {
  const [address, setAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr) || addr.endsWith('.eth');
  };

  const handleAnalyze = async () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address or ENS name",
        variant: "destructive"
      });
      return;
    }

    if (!isValidAddress(address)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address or ENS name",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    onLoadingChange(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const persona = generateMockPersona(address);
      onPersonaGenerated(persona);
      
      toast({
        title: "Analysis Complete!",
        description: "Your wallet persona has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      onLoadingChange(false);
    }
  };

  const demoAddresses = [
    { label: "DeFi Whale", address: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503" },
    { label: "NFT Collector", address: "0x8ba1f109551bD432803012645Hac136c22C6bF6e" },
    { label: "DAO Participant", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }
  ];

  return (
    <Card className="max-w-4xl mx-auto glassmorphism border-white/20">
      <div className="p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter wallet address or ENS name (e.g., 0x... or vitalik.eth)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder-gray-300"
                disabled={isAnalyzing}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 glow-purple"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Generate Persona
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-300 mr-2">Try demo:</span>
            {demoAddresses.map((demo, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setAddress(demo.address)}
                className="text-xs bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                disabled={isAnalyzing}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {demo.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WalletInput;
