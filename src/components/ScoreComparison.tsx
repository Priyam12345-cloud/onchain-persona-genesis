
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Shield, TrendingUp, Target } from 'lucide-react';
import { Persona } from '@/types/persona';

interface ScoreComparisonProps {
  persona: Persona | null;
  isLoading: boolean;
}

const ScoreComparison: React.FC<ScoreComparisonProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
        <Skeleton className="h-64 bg-white/10" />
      </Card>
    );
  }

  if (!persona) return null;

  const scoreData = [
    {
      category: 'Risk Score',
      score: persona.riskScore,
      benchmark: 75,
      color: '#8b5cf6'
    },
    {
      category: 'Health Score',
      score: persona.healthScore,
      benchmark: 80,
      color: '#10b981'
    },
    {
      category: 'Activity Level',
      score: Math.min((persona.stats.totalTransactions / 10), 100),
      benchmark: 70,
      color: '#06b6d4'
    },
    {
      category: 'Diversification',
      score: Math.min((persona.stats.uniqueProtocols * 5), 100),
      benchmark: 60,
      color: '#f59e0b'
    }
  ];

  const config = {
    score: { label: 'Your Score', color: '#8b5cf6' },
    benchmark: { label: 'Benchmark', color: '#6b7280' }
  };

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Performance Metrics
        </h3>

        <ChartContainer config={config} className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="category" 
                stroke="#9ca3af" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                domain={[0, 100]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" fill="#6b7280" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="space-y-4">
          {scoreData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white font-medium">{item.score.toFixed(0)}</span>
                  {item.score > item.benchmark ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  )}
                </div>
              </div>
              <Progress value={item.score} className="h-2 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ScoreComparison;
