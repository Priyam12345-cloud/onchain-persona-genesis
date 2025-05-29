
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Activity, Coins, Palette, Users, Clock, Zap } from 'lucide-react';
import { Persona } from '@/types/persona';

interface InteractiveStatsProps {
  persona: Persona | null;
  isLoading: boolean;
}

const InteractiveStats: React.FC<InteractiveStatsProps> = ({ persona, isLoading }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-32 mb-4 bg-white/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 bg-white/10" />
          ))}
        </div>
      </Card>
    );
  }

  if (!persona) return null;

  const timeframes = [
    { id: 'week', label: '7D' },
    { id: 'month', label: '30D' },
    { id: 'year', label: '1Y' },
    { id: 'all', label: 'All' }
  ];

  const getStatByTimeframe = (baseStat: number, timeframe: string) => {
    const multipliers = {
      week: 0.1,
      month: 0.3,
      year: 0.8,
      all: 1
    };
    return Math.floor(baseStat * (multipliers[timeframe as keyof typeof multipliers] || 1));
  };

  const stats = [
    {
      id: 'transactions',
      icon: <Activity className="w-6 h-6" />,
      label: 'Transactions',
      value: getStatByTimeframe(persona.stats.totalTransactions, selectedTimeframe),
      change: '+12%',
      positive: true,
      color: 'text-purple-400'
    },
    {
      id: 'volume',
      icon: <Coins className="w-6 h-6" />,
      label: 'Volume (ETH)',
      value: getStatByTimeframe(persona.stats.totalVolume, selectedTimeframe).toFixed(2),
      change: '+8%',
      positive: true,
      color: 'text-green-400'
    },
    {
      id: 'protocols',
      icon: <Users className="w-6 h-6" />,
      label: 'Protocols',
      value: getStatByTimeframe(persona.stats.uniqueProtocols, selectedTimeframe),
      change: '+5%',
      positive: true,
      color: 'text-blue-400'
    },
    {
      id: 'nfts',
      icon: <Palette className="w-6 h-6" />,
      label: 'NFT Collections',
      value: getStatByTimeframe(persona.stats.nftCollections, selectedTimeframe),
      change: '+15%',
      positive: true,
      color: 'text-pink-400'
    },
    {
      id: 'defi',
      icon: <Zap className="w-6 h-6" />,
      label: 'DeFi Interactions',
      value: getStatByTimeframe(persona.stats.defiInteractions, selectedTimeframe),
      change: '+20%',
      positive: true,
      color: 'text-yellow-400'
    },
    {
      id: 'gas',
      icon: <Clock className="w-6 h-6" />,
      label: 'Avg Gas',
      value: persona.stats.averageGasSpent.toFixed(0),
      change: '-3%',
      positive: false,
      color: 'text-orange-400'
    }
  ];

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Interactive Analytics
          </h3>
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.id}
                variant={selectedTimeframe === timeframe.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`text-xs ${
                  selectedTimeframe === timeframe.id 
                    ? 'bg-purple-600 text-white' 
                    : 'border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="activity" className="text-white">Activity</TabsTrigger>
            <TabsTrigger value="performance" className="text-white">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.slice(0, 6).map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {stats.filter(s => ['transactions', 'protocols', 'defi'].includes(s.id)).map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Activity Insights</h4>
              <p className="text-xs text-gray-300">
                Your activity level is {persona.stats.totalTransactions > 100 ? 'high' : 'moderate'} 
                compared to the average Web3 user. You've interacted with {persona.stats.uniqueProtocols} different protocols.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Risk Score</h4>
                <div className="text-2xl font-bold text-purple-400">{persona.riskScore}/100</div>
                <p className="text-xs text-gray-400">Lower is better</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Health Score</h4>
                <div className="text-2xl font-bold text-green-400">{persona.healthScore}/100</div>
                <p className="text-xs text-gray-400">Higher is better</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Performance Summary</h4>
              <div className="flex flex-wrap gap-2">
                {persona.traits.map((trait, index) => (
                  <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

const StatCard = ({ stat }: { stat: any }) => (
  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group">
    <div className="flex items-center justify-between mb-2">
      <div className={`${stat.color}`}>
        {stat.icon}
      </div>
      <Badge 
        className={`text-xs ${
          stat.positive 
            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
            : 'bg-red-500/20 text-red-300 border-red-500/30'
        }`}
      >
        {stat.change}
      </Badge>
    </div>
    <div className="text-xl font-bold text-white group-hover:scale-105 transition-transform">
      {stat.value}
    </div>
    <div className="text-xs text-gray-400">{stat.label}</div>
  </div>
);

export default InteractiveStats;
