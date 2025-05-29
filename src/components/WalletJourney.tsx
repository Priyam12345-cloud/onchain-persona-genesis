
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, TrendingUp, Coins, Palette, Users, Gamepad2 } from 'lucide-react';
import { Persona, JourneyEvent } from '@/types/persona';

interface WalletJourneyProps {
  persona: Persona | null;
  isLoading: boolean;
}

const WalletJourney: React.FC<WalletJourneyProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-8">
        <Skeleton className="h-6 w-48 mb-6 bg-white/10" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-3 w-1/2 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!persona) return null;

  const getEventIcon = (type: string) => {
    const icons = {
      defi: <Coins className="w-6 h-6" />,
      nft: <Palette className="w-6 h-6" />,
      dao: <Users className="w-6 h-6" />,
      gaming: <Gamepad2 className="w-6 h-6" />,
      social: <TrendingUp className="w-6 h-6" />
    };
    return icons[type as keyof typeof icons] || <Calendar className="w-6 h-6" />;
  };

  const getEventColor = (significance: string) => {
    const colors = {
      low: 'text-gray-400',
      medium: 'text-yellow-400',
      high: 'text-purple-400'
    };
    return colors[significance as keyof typeof colors] || 'text-gray-400';
  };

  const getBadgeColor = (type: string) => {
    const colors = {
      defi: 'bg-green-500/20 text-green-300 border-green-500/30',
      nft: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      dao: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      gaming: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      social: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Wallet Journey Timeline
        </h3>

        <div className="space-y-6">
          {persona.journey.map((event, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < persona.journey.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ${getEventColor(event.significance)}`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Badge className={getBadgeColor(event.type)}>
                        {event.type.toUpperCase()}
                      </Badge>
                      {event.protocol && (
                        <span className="text-sm text-gray-400">{event.protocol}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
                      {event.date.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-white font-medium mb-1">{event.description}</p>
                  
                  {event.amount && (
                    <p className="text-sm text-gray-300">
                      Amount: ${event.amount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Journey Stats */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <JourneyStat
              label="First Activity"
              value={persona.stats.firstTransaction.toLocaleDateString()}
            />
            <JourneyStat
              label="Last Activity"
              value={persona.stats.lastTransaction.toLocaleDateString()}
            />
            <JourneyStat
              label="DeFi Interactions"
              value={persona.stats.defiInteractions.toString()}
            />
            <JourneyStat
              label="NFT Collections"
              value={persona.stats.nftCollections.toString()}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const JourneyStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default WalletJourney;
