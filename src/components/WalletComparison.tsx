
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GitCompare, Plus, X } from 'lucide-react';
import { Persona } from '@/types/persona';

interface WalletComparisonProps {
  persona: Persona | null;
  isLoading: boolean;
}

const WalletComparison: React.FC<WalletComparisonProps> = ({ persona, isLoading }) => {
  const [compareAddress, setCompareAddress] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
        <Skeleton className="h-64 bg-white/10" />
      </Card>
    );
  }

  if (!persona) return null;

  const generateComparisonData = () => {
    if (!showComparison) return [];

    const normalizeScore = (value: number, max: number) => Math.min((value / max) * 100, 100);

    return [
      {
        metric: 'Activity',
        current: normalizeScore(persona.stats.totalTransactions, 1000),
        comparison: Math.random() * 100
      },
      {
        metric: 'DeFi Usage',
        current: normalizeScore(persona.stats.defiInteractions, 100),
        comparison: Math.random() * 100
      },
      {
        metric: 'NFT Holdings',
        current: normalizeScore(persona.stats.nftCollections, 50),
        comparison: Math.random() * 100
      },
      {
        metric: 'Protocol Diversity',
        current: normalizeScore(persona.stats.uniqueProtocols, 30),
        comparison: Math.random() * 100
      },
      {
        metric: 'Risk Score',
        current: persona.riskScore,
        comparison: Math.random() * 100
      },
      {
        metric: 'Health Score',
        current: persona.healthScore,
        comparison: Math.random() * 100
      }
    ];
  };

  const comparisonData = generateComparisonData();

  const config = {
    current: { label: 'Your Wallet', color: '#8b5cf6' },
    comparison: { label: 'Comparison Wallet', color: '#06b6d4' }
  };

  const handleAddComparison = () => {
    if (compareAddress.trim()) {
      setShowComparison(true);
    }
  };

  const handleRemoveComparison = () => {
    setShowComparison(false);
    setCompareAddress('');
  };

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <GitCompare className="w-5 h-5 mr-2" />
          Wallet Comparison
        </h3>

        {!showComparison ? (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Compare your wallet with another to see how you stack up
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter wallet address to compare..."
                value={compareAddress}
                onChange={(e) => setCompareAddress(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleAddComparison}
                disabled={!compareAddress.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Your Wallet
                </Badge>
                <span className="text-gray-400">vs</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {compareAddress.slice(0, 6)}...{compareAddress.slice(-4)}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveComparison}
                className="border-white/20 text-gray-300 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ChartContainer config={config} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={comparisonData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <Radar
                    name="Your Wallet"
                    dataKey="current"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Comparison"
                    dataKey="comparison"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-300">Your Strengths</h4>
                <div className="space-y-1">
                  {comparisonData
                    .filter(item => item.current > item.comparison)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={index} className="text-xs text-gray-300">
                        • {item.metric}
                      </div>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-300">Areas to Improve</h4>
                <div className="space-y-1">
                  {comparisonData
                    .filter(item => item.current < item.comparison)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={index} className="text-xs text-gray-300">
                        • {item.metric}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WalletComparison;
