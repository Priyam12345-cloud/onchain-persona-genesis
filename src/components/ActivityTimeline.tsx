
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Activity, Calendar } from 'lucide-react';
import { Persona } from '@/types/persona';

interface ActivityTimelineProps {
  persona: Persona | null;
  isLoading: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-48 mb-4 bg-white/10" />
        <Skeleton className="h-64 bg-white/10" />
      </Card>
    );
  }

  if (!persona) return null;

  // Generate mock activity data based on persona stats
  const generateActivityData = () => {
    const data = [];
    const now = new Date();
    const daysSinceFirst = Math.floor((now.getTime() - persona.stats.firstTransaction.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.min(12, Math.floor(daysSinceFirst / 7));
    
    for (let i = weeks; i >= 0; i--) {
      const weekDate = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const baseActivity = Math.floor(persona.stats.totalTransactions / weeks);
      const variance = Math.random() * 0.5 + 0.75; // 75% to 125% of base
      
      data.push({
        date: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        transactions: Math.floor(baseActivity * variance),
        defi: Math.floor((persona.stats.defiInteractions / weeks) * variance),
        nft: Math.floor((persona.stats.nftCollections / weeks) * variance)
      });
    }
    
    return data;
  };

  const activityData = generateActivityData();

  const config = {
    transactions: { label: 'Transactions', color: '#8b5cf6' },
    defi: { label: 'DeFi Activity', color: '#10b981' },
    nft: { label: 'NFT Activity', color: '#ec4899' }
  };

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Activity Timeline
        </h3>

        <ChartContainer config={config} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="defi" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="nft" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-300">Transactions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-300">DeFi</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-sm text-gray-300">NFT</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTimeline;
