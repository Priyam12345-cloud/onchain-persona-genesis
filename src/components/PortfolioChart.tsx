
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { Persona } from '@/types/persona';

interface PortfolioChartProps {
  persona: Persona | null;
  isLoading: boolean;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
        <Skeleton className="h-64 bg-white/10" />
      </Card>
    );
  }

  if (!persona) return null;

  const portfolioData = [
    {
      name: 'DeFi Protocols',
      value: persona.stats.defiInteractions,
      color: '#8b5cf6'
    },
    {
      name: 'NFT Collections',
      value: persona.stats.nftCollections,
      color: '#ec4899'
    },
    {
      name: 'Regular Transactions',
      value: Math.max(persona.stats.totalTransactions - persona.stats.defiInteractions - persona.stats.nftCollections, 0),
      color: '#06b6d4'
    },
    {
      name: 'Unique Protocols',
      value: persona.stats.uniqueProtocols,
      color: '#10b981'
    }
  ];

  const config = {
    defi: { label: 'DeFi Protocols', color: '#8b5cf6' },
    nft: { label: 'NFT Collections', color: '#ec4899' },
    transactions: { label: 'Regular Transactions', color: '#06b6d4' },
    protocols: { label: 'Unique Protocols', color: '#10b981' }
  };

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <PieChartIcon className="w-5 h-5 mr-2" />
          Portfolio Composition
        </h3>

        <ChartContainer config={config} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {portfolioData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-300">{item.name}</span>
              <span className="text-sm font-medium text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PortfolioChart;
