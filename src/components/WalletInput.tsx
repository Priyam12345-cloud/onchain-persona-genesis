
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Database, FileText, Cpu } from 'lucide-react';
import { useWalletAnalysis } from '@/hooks/useWalletAnalysis';
import { Persona } from '@/types/persona';

interface WalletInputProps {
  onPersonaGenerated: (persona: Persona) => void;
  onLoadingChange: (loading: boolean) => void;
}

const WalletInput: React.FC<WalletInputProps> = ({ onPersonaGenerated, onLoadingChange }) => {
  const [address, setAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const { analyzeWallet, isAnalyzing, persona, availableWallets, loadAvailableWallets } = useWalletAnalysis();

  // Load available wallets on component mount
  useEffect(() => {
    loadAvailableWallets();
  }, []);

  // Update parent component when analysis completes
  React.useEffect(() => {
    onLoadingChange(isAnalyzing);
  }, [isAnalyzing, onLoadingChange]);

  React.useEffect(() => {
    if (persona) {
      onPersonaGenerated(persona);
    }
  }, [persona, onPersonaGenerated]);

  const handleAnalyze = () => {
    const walletToAnalyze = selectedWallet || address;
    if (walletToAnalyze) {
      analyzeWallet(walletToAnalyze);
    }
  };

  const handleWalletSelect = (value: string) => {
    setSelectedWallet(value);
    setAddress(value);
  };

  // Sample wallets for demonstration (these would come from your CSV)
  const sampleWallets = [
    { label: "Whale Trader", address: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503" },
    { label: "DeFi Farmer", address: "0x8ba1f109551bD432803012645Hac136c22C6bF6e" },
    { label: "NFT Collector", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }
  ];

  return (
    <Card className="max-w-4xl mx-auto glassmorphism border-white/20">
      <div className="p-8">
        <div className="flex flex-col space-y-6">
          {/* Wallet Selection from CSV */}
          {availableWallets.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select from Available Wallets (CSV Data)
              </label>
              <Select value={selectedWallet} onValueChange={handleWalletSelect}>
                <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choose a wallet from your CSV files..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  {availableWallets.slice(0, 50).map((wallet, index) => (
                    <SelectItem key={index} value={wallet} className="text-white hover:bg-white/10">
                      {wallet.slice(0, 6)}...{wallet.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Manual Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Enter Wallet Address Manually
            </label>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter wallet address (e.g., 0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder-gray-300"
                  disabled={isAnalyzing}
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!address && !selectedWallet)}
                className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 glow-purple"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Running Python Analysis...
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5 mr-2" />
                    Analyze with Python
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Demo Addresses */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-300 mr-2">Try sample:</span>
            {sampleWallets.map((demo, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setAddress(demo.address)}
                className="text-xs bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                disabled={isAnalyzing}
              >
                <FileText className="w-3 h-3 mr-1" />
                {demo.label}
              </Button>
            ))}
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">Python Analysis in Progress</h4>
                  <p className="text-xs text-gray-300">
                    Executing test(3).py script with real CSV data and generating persona report...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data Source Info */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
            <h4 className="text-sm font-medium text-white mb-2 flex items-center">
              <Database className="w-4 h-4 mr-2 text-green-400" />
              Real Data Source
            </h4>
            <p className="text-xs text-gray-300">
              This analysis uses your Python script (test(3).py) with real CSV data including:
              wallet stats, token balances, DeFi positions, NFT collections, and blockchain activity.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WalletInput;
