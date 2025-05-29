
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, TrendingUp, Activity, Calendar } from 'lucide-react';
import { Persona } from '@/types/persona';

interface PersonaDisplayProps {
  persona: Persona | null;
  isLoading: boolean;
}

const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-20 w-full bg-white/10" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 bg-white/10" />
            <Skeleton className="h-12 bg-white/10" />
          </div>
        </div>
      </Card>
    );
  }

  if (!persona) return null;

  const getPersonaIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'DeFi Whale': '🐋',
      'NFT Collector': '🎨',
      'DAO Participant': '🏛️',
      'Gaming Enthusiast': '🎮',
      'DeFi Farmer': '🌱',
      'Institutional Investor': '🏦',
      'Retail Trader': '💱',
      'HODLer': '💎'
    };
    return icons[category] || '👤';
  };

  return (
    <Card className="glassmorphism border-white/20 glow-purple">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500">
              <AvatarFallback className="text-2xl bg-transparent">
                {getPersonaIcon(persona.category.primary)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {persona.suggestedHandle}
              </h2>
              <p className="text-gray-300 text-sm">
                {persona.address.slice(0, 6)}...{persona.address.slice(-4)}
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
            {persona.category.primary}
          </Badge>
        </div>

        {/* AI Generated Bio */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            AI-Generated Bio
          </h3>
          <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-lg">
            {persona.aiGeneratedBio}
          </p>
        </div>

        {/* Persona Confidence & Secondary Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Persona Confidence</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{persona.category.primary}</span>
                <span className="text-white">{persona.category.confidence}%</span>
              </div>
              <Progress 
                value={persona.category.confidence} 
                className="h-2 bg-white/10"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Secondary Traits</h4>
            <div className="flex flex-wrap gap-2">
              {persona.category.secondary.map((trait, index) => (
                <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Total Transactions"
            value={persona.stats.totalTransactions.toLocaleString()}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Volume"
            value={`$${(persona.stats.totalVolume / 1000000).toFixed(1)}M`}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Active Since"
            value={persona.stats.firstTransaction.getFullYear().toString()}
          />
          <StatCard
            icon={<User className="w-5 h-5" />}
            label="Protocols Used"
            value={persona.stats.uniqueProtocols.toString()}
          />
        </div>

        {/* Traits */}
        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Behavioral Traits</h4>
          <div className="flex flex-wrap gap-2">
            {persona.traits.map((trait, index) => (
              <Badge key={index} className="bg-white/10 text-white border-white/20">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
    <div className="text-purple-400 mb-2 flex justify-center">{icon}</div>
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default PersonaDisplay;
