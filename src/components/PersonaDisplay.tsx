import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PersonaDisplayProps {
  persona: any | null;
  isLoading: boolean;
}

const safe = (val: any, method: string = 'toString', fallback: string = '-') => {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number' && method === 'toLocaleString') return val.toLocaleString();
  if (typeof val === 'string' && method === 'toUpperCase') return val.toUpperCase();
  if (typeof val === 'string' && method === 'toString') return val;
  if (typeof val === 'number' && method === 'toString') return val.toString();
  return fallback;
};

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
        </div>
      </Card>
    );
  }

  if (!persona) return null;

  return (
    <Card className="glassmorphism border-white/20 glow-purple">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl">
              🦄
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {safe(persona.socialHandle)}
              </h2>
              <p className="text-gray-300 text-sm">
                {safe(persona.address?.slice(0, 6))}...{safe(persona.address?.slice(-4))}
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
            {persona.classifications && persona.classifications[0]}
          </Badge>
        </div>

        {/* Persona Profile Markdown (render as plain text for now) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Persona Profile</h3>
          <pre className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-lg whitespace-pre-wrap">
            {safe(persona.personaProfile)}
          </pre>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Net Worth" value={`$${safe(persona.totalNetworth, 'toLocaleString')}`} />
          <StatCard label="Native Balance" value={safe(persona.nativeBalance, 'toLocaleString')} />
          <StatCard label="Token Balance (USD)" value={`$${safe(persona.tokenBalanceUsd, 'toLocaleString')}`} />
          <StatCard label="Chain" value={safe(persona.chain, 'toUpperCase')} />
          <StatCard label="Total Transactions" value={safe(persona.transactionsTotal, 'toLocaleString')} />
          <StatCard label="NFT Transfers" value={safe(persona.nftTransfersTotal, 'toLocaleString')} />
          <StatCard label="Token Transfers" value={safe(persona.tokenTransfersTotal, 'toLocaleString')} />
          <StatCard label="NFT Count" value={safe(persona.nftCount, 'toString')} />
          <StatCard label="NFT Collections" value={safe(persona.nftCollections, 'toString')} />
          <StatCard label="Token Count" value={safe(persona.tokenCount, 'toString')} />
          <StatCard label="DeFi Protocols" value={safe(persona.defiProtocols, 'toString')} />
          <StatCard label="DeFi USD" value={`$${safe(persona.totalDefiUsd, 'toLocaleString')}`} />
          <StatCard label="Activity Score" value={safe(persona.activityScore, 'toString')} />
          <StatCard label="Wallet Health Score" value={safe(persona.walletHealthScore, 'toString')} />
          <StatCard label="Risk Score" value={safe(persona.riskScore, 'toString')} />
        </div>

        {/* Top Tokens */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Top Tokens</h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(persona.topTokens) && persona.topTokens.map((token: string, idx: number) => (
              <Badge key={idx} className="bg-white/10 text-white border-white/20">
                {token}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recommendations</h4>
          <ul className="list-disc pl-6 text-gray-200">
            {Array.isArray(persona.recommendations) && persona.recommendations.map((rec: any, idx: number) => (
              <li key={idx}>{typeof rec === 'string' ? rec : rec.title || '-'}</li>
            ))}
          </ul>
        </div>

        {/* Classifications */}
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Classifications</h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(persona.classifications) && persona.classifications.map((c: string, idx: number) => (
              <Badge key={idx} className="bg-purple-700/30 text-purple-200 border-purple-500/20">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default PersonaDisplay;
