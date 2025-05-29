
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ExternalLink, TrendingUp, Star } from 'lucide-react';
import { Persona, Recommendation } from '@/types/persona';

interface RecommendationsPanelProps {
  persona: Persona | null;
  isLoading: boolean;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-white/10" />
              <Skeleton className="h-3 w-full bg-white/10" />
              <Skeleton className="h-8 w-20 bg-white/10" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!persona) return null;

  const getTypeIcon = (type: string) => {
    const icons = {
      dapp: '🔗',
      nft: '🎨',
      defi: '💰',
      dao: '🏛️'
    };
    return icons[type as keyof typeof icons] || '📱';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      dapp: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      nft: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      defi: 'bg-green-500/20 text-green-300 border-green-500/30',
      dao: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <Card className="glassmorphism border-white/20">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Personalized Recommendations
        </h3>

        <div className="space-y-6">
          {persona.recommendations.map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </div>

        {/* AI Insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            AI Insight
          </h4>
          <p className="text-xs text-gray-300">
            Based on your {persona.category.primary.toLowerCase()} profile and transaction history, 
            these recommendations align with your on-chain behavior patterns and could enhance your Web3 experience.
          </p>
        </div>
      </div>
    </Card>
  );
};

const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      dapp: '🔗',
      nft: '🎨',
      defi: '💰',
      dao: '🏛️'
    };
    return icons[type as keyof typeof icons] || '📱';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      dapp: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      nft: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      defi: 'bg-green-500/20 text-green-300 border-green-500/30',
      dao: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
          <h4 className="font-medium text-white">{recommendation.title}</h4>
        </div>
        <Badge className={getTypeColor(recommendation.type)}>
          {recommendation.type.toUpperCase()}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">{recommendation.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">
            {recommendation.confidence}% match
          </span>
        </div>
        
        {recommendation.url && (
          <Button variant="outline" size="sm" className="text-xs border-white/20 text-gray-300 hover:bg-white/10">
            <ExternalLink className="w-3 h-3 mr-1" />
            Explore
          </Button>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-400">
          <strong>Why:</strong> {recommendation.reasoning}
        </p>
      </div>
    </div>
  );
};

export default RecommendationsPanel;
