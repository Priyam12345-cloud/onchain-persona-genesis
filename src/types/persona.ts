
export interface Persona {
  address: string;
  category: PersonaCategory;
  riskScore: number;
  healthScore: number;
  aiGeneratedBio: string;
  suggestedHandle: string;
  traits: string[];
  stats: WalletStats;
  journey: JourneyEvent[];
  recommendations: Recommendation[];
}

export interface PersonaCategory {
  primary: string;
  secondary: string[];
  confidence: number;
}

export interface WalletStats {
  totalTransactions: number;
  totalVolume: number;
  firstTransaction: Date;
  lastTransaction: Date;
  uniqueProtocols: number;
  nftCollections: number;
  defiInteractions: number;
  averageGasSpent: number;
}

export interface JourneyEvent {
  date: Date;
  type: 'defi' | 'nft' | 'dao' | 'gaming' | 'social';
  description: string;
  significance: 'low' | 'medium' | 'high';
  protocol?: string;
  amount?: number;
}

export interface Recommendation {
  type: 'dapp' | 'nft' | 'defi' | 'dao';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  url?: string;
}
