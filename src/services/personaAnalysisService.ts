import { Persona, WalletStats, JourneyEvent, Recommendation, PersonaCategory } from '@/types/persona';
import { BlockchainProvider } from './blockchainService';

export class PersonaAnalysisService {
  private blockchainProvider: BlockchainProvider;

  constructor(blockchainProvider: BlockchainProvider) {
    this.blockchainProvider = blockchainProvider;
  }

  async analyzeWallet(address: string): Promise<Persona> {
    console.log('Starting wallet analysis for:', address);

    // Fetch real blockchain data
    const [transactions, nfts, defiInteractions, balance] = await Promise.all([
      this.blockchainProvider.getWalletTransactions(address),
      this.blockchainProvider.getWalletNFTs(address),
      this.blockchainProvider.getWalletDeFiInteractions(address),
      this.blockchainProvider.getWalletBalance(address)
    ]);

    // Calculate wallet stats from real data
    const stats = this.calculateWalletStats(transactions, nfts, defiInteractions);
    
    // Determine persona category based on real activity
    const category = this.determinePersonaCategory(stats, nfts, defiInteractions);
    
    // Generate journey events from transaction history
    const journey = this.generateJourneyEvents(transactions, nfts, defiInteractions);
    
    // Calculate risk and health scores
    const riskScore = this.calculateRiskScore(stats, transactions);
    const healthScore = this.calculateHealthScore(stats, transactions);
    
    // Generate AI bio and recommendations
    const aiGeneratedBio = this.generateAIBio(category, stats);
    const suggestedHandle = this.generateSuggestedHandle(category);
    const traits = this.extractTraits(stats, nfts, defiInteractions);
    const recommendations = this.generateRecommendations(category, stats, nfts);

    console.log('Analysis complete for:', address, {
      transactions: transactions.length,
      nfts: nfts.length,
      defiInteractions: defiInteractions.length,
      riskScore,
      healthScore
    });

    return {
      address,
      category,
      riskScore,
      healthScore,
      aiGeneratedBio,
      suggestedHandle,
      traits,
      stats,
      journey,
      recommendations
    };
  }

  private calculateWalletStats(transactions: any[], nfts: any[], defiInteractions: any[]): WalletStats {
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.value || '0'), 0);
    
    const timestamps = transactions.map(tx => new Date(tx.timestamp)).filter(date => !isNaN(date.getTime()));
    const firstTransaction = timestamps.length > 0 ? new Date(Math.min(...timestamps.map(d => d.getTime()))) : new Date();
    const lastTransaction = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(d => d.getTime()))) : new Date();
    
    const uniqueProtocols = new Set(transactions.map(tx => tx.contractAddress).filter(Boolean)).size;
    const nftCollections = new Set(nfts.map(nft => nft.contractAddress)).size;
    const defiInteractionCount = defiInteractions.length;
    const averageGasSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.gasUsed || '0'), 0) / Math.max(totalTransactions, 1);

    return {
      totalTransactions,
      totalVolume,
      firstTransaction,
      lastTransaction,
      uniqueProtocols,
      nftCollections,
      defiInteractions: defiInteractionCount,
      averageGasSpent
    };
  }

  private determinePersonaCategory(stats: WalletStats, nfts: any[], defiInteractions: any[]): PersonaCategory {
    let primary = 'Retail Trader';
    let confidence = 70;
    const secondary: string[] = [];

    // Enhanced analysis based on real data patterns
    if (stats.totalVolume > 1000000) {
      primary = 'DeFi Whale';
      confidence = 85;
    } else if (stats.nftCollections > 10) {
      primary = 'NFT Collector';
      confidence = 80;
    } else if (stats.defiInteractions > 50) {
      primary = 'DeFi Farmer';
      confidence = 75;
    } else if (stats.uniqueProtocols > 20) {
      primary = 'DAO Participant';
      confidence = 70;
    }

    // Add secondary traits with enhanced logic
    if (stats.nftCollections > 5) secondary.push('NFT Enthusiast');
    if (stats.defiInteractions > 10) secondary.push('DeFi User');
    if (stats.uniqueProtocols > 15) secondary.push('Protocol Explorer');
    if (stats.totalTransactions > 500) secondary.push('Power User');
    if (stats.averageGasSpent < 30) secondary.push('Gas Optimizer');

    console.log('Persona determined:', { primary, secondary, confidence });

    return { primary, secondary, confidence };
  }

  private generateJourneyEvents(transactions: any[], nfts: any[], defiInteractions: any[]): JourneyEvent[] {
    const events: JourneyEvent[] = [];

    console.log('Generating journey events from:', {
      transactions: transactions.length,
      nfts: nfts.length,
      defiInteractions: defiInteractions.length
    });

    // Add significant transaction events with better categorization
    transactions.slice(0, 10).forEach(tx => {
      const value = parseFloat(tx.value || '0');
      if (value > 1) { // Only significant transactions
        events.push({
          date: new Date(tx.timestamp),
          type: tx.contractAddress ? 'defi' : 'social',
          description: `${value > 10 ? 'Large' : 'Significant'} transaction of ${value.toFixed(2)} ETH`,
          significance: value > 10 ? 'high' : 'medium',
          amount: value
        });
      }
    });

    // Add NFT acquisition events with better data
    nfts.slice(0, 5).forEach(nft => {
      events.push({
        date: new Date(), // Would need to get actual acquisition date from blockchain
        type: 'nft',
        description: `Acquired ${nft.name || 'NFT'} from ${nft.collection || 'collection'}`,
        significance: 'medium',
        protocol: nft.collection
      });
    });

    // Add DeFi interaction events
    defiInteractions.slice(0, 3).forEach(interaction => {
      events.push({
        date: new Date(interaction.timestamp || Date.now()),
        type: 'defi',
        description: `DeFi interaction on ${interaction.protocol || 'protocol'}`,
        significance: 'high',
        protocol: interaction.protocol
      });
    });

    const sortedEvents = events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
    console.log('Generated', sortedEvents.length, 'journey events');
    
    return sortedEvents;
  }

  private calculateRiskScore(stats: WalletStats, transactions: any[]): number {
    let score = 50; // Base score

    // Increase score for positive indicators
    if (stats.totalTransactions > 100) score += 20;
    if (stats.uniqueProtocols > 10) score += 15;
    if (stats.averageGasSpent < 50) score += 10;

    // Decrease score for risk factors
    const recentActivity = transactions.filter(tx => 
      new Date(tx.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    if (recentActivity < 5) score -= 15;

    // Additional risk factors for enhanced scoring
    if (stats.defiInteractions > stats.totalTransactions * 0.8) score -= 10; // Too much DeFi exposure
    if (stats.totalVolume > 100000 && stats.totalTransactions < 50) score -= 15; // Large volume, few transactions

    const finalScore = Math.min(Math.max(score, 0), 100);
    console.log('Risk score calculated:', finalScore);
    
    return finalScore;
  }

  private calculateHealthScore(stats: WalletStats, transactions: any[]): number {
    let score = 60; // Base score

    // Positive health indicators
    if (stats.totalTransactions > 50) score += 20;
    if (stats.uniqueProtocols > 5) score += 15;
    
    const daysSinceFirst = (Date.now() - stats.firstTransaction.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceFirst > 365) score += 15; // Wallet age bonus

    // Additional health factors
    if (stats.defiInteractions > 0 && stats.nftCollections > 0) score += 10; // Diversified activity
    const activityConsistency = this.calculateActivityConsistency(transactions);
    score += activityConsistency * 10;

    const finalScore = Math.min(Math.max(score, 0), 100);
    console.log('Health score calculated:', finalScore);
    
    return finalScore;
  }

  private calculateActivityConsistency(transactions: any[]): number {
    if (transactions.length < 10) return 0.5;
    
    // Simple consistency metric based on transaction timing
    const intervals = [];
    for (let i = 1; i < Math.min(transactions.length, 20); i++) {
      const interval = new Date(transactions[i-1].timestamp).getTime() - new Date(transactions[i].timestamp).getTime();
      intervals.push(interval);
    }
    
    if (intervals.length === 0) return 0.5;
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation means more consistent activity
    const consistencyScore = Math.max(0, 1 - (stdDev / avgInterval));
    return Math.min(consistencyScore, 1);
  }

  private generateAIBio(category: PersonaCategory, stats: WalletStats): string {
    const templates = {
      'DeFi Whale': `A sophisticated DeFi investor with ${stats.totalVolume.toFixed(0)} ETH in transaction volume. This wallet demonstrates deep protocol knowledge and strategic position management across ${stats.uniqueProtocols} different platforms.`,
      'NFT Collector': `An active NFT enthusiast with ${stats.nftCollections} unique collections. Shows discerning taste in digital art and collectibles, with a transaction history spanning ${stats.totalTransactions} moves.`,
      'DeFi Farmer': `A yield farming specialist actively managing positions across ${stats.uniqueProtocols} protocols. Demonstrates consistent engagement with ${stats.defiInteractions} DeFi interactions and strategic gas optimization.`,
      'DAO Participant': `A committed governance participant engaged with ${stats.uniqueProtocols} different protocols. Shows long-term commitment to decentralized governance and community building.`,
      'Retail Trader': `An active retail participant in the Ethereum ecosystem with ${stats.totalTransactions} transactions. Demonstrates growing engagement with Web3 technologies and steady learning curve.`
    };

    return templates[category.primary as keyof typeof templates] || templates['Retail Trader'];
  }

  private generateSuggestedHandle(category: PersonaCategory): string {
    const prefixes = {
      'DeFi Whale': ['Whale', 'Deep', 'Alpha'],
      'NFT Collector': ['Curator', 'Gallery', 'Collector'],
      'DeFi Farmer': ['Farmer', 'Yield', 'Harvest'],
      'DAO Participant': ['Gov', 'Council', 'Vote'],
      'Retail Trader': ['Trader', 'Crypto', 'Web3']
    };

    const suffixes = ['Master', 'Pro', 'Sage', 'Elite', 'Prime'];
    const categoryPrefixes = prefixes[category.primary as keyof typeof prefixes] || prefixes['Retail Trader'];
    
    const prefix = categoryPrefixes[Math.floor(Math.random() * categoryPrefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 999);

    return `${prefix}${suffix}${number}`;
  }

  private extractTraits(stats: WalletStats, nfts: any[], defiInteractions: any[]): string[] {
    const traits: string[] = [];

    if (stats.totalTransactions > 100) traits.push('High Activity');
    if (stats.uniqueProtocols > 10) traits.push('Protocol Explorer');
    if (stats.nftCollections > 5) traits.push('Art Collector');
    if (stats.defiInteractions > 20) traits.push('DeFi Native');
    if (stats.averageGasSpent < 30) traits.push('Gas Optimizer');
    
    const walletAge = (Date.now() - stats.firstTransaction.getTime()) / (1000 * 60 * 60 * 24);
    if (walletAge > 365) traits.push('Veteran');
    if (walletAge > 1095) traits.push('OG');

    // Enhanced trait detection
    if (stats.totalVolume > 10000) traits.push('High Volume');
    if (stats.defiInteractions / Math.max(stats.totalTransactions, 1) > 0.5) traits.push('DeFi Heavy');
    if (stats.nftCollections / Math.max(stats.totalTransactions, 1) > 0.3) traits.push('NFT Focused');
    if (this.calculateActivityConsistency([]) > 0.7) traits.push('Consistent Trader');

    console.log('Extracted traits:', traits);
    return traits;
  }

  private generateRecommendations(category: PersonaCategory, stats: WalletStats, nfts: any[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    console.log('Generating recommendations for category:', category.primary);

    // Enhanced recommendations based on category
    switch (category.primary) {
      case 'DeFi Whale':
        recommendations.push({
          type: 'defi',
          title: 'Advanced Yield Strategies',
          description: 'Explore institutional-grade yield farming protocols with optimized returns',
          confidence: 85,
          reasoning: 'Your high volume activity suggests readiness for advanced DeFi strategies',
          url: 'https://yearn.finance'
        });
        recommendations.push({
          type: 'defi',
          title: 'Portfolio Management Tools',
          description: 'Professional-grade portfolio tracking and rebalancing tools',
          confidence: 80,
          reasoning: 'Large portfolio requires sophisticated management tools'
        });
        break;
      
      case 'NFT Collector':
        recommendations.push({
          type: 'nft',
          title: 'Emerging Art Collections',
          description: 'Discover upcoming NFT artists and collections before they trend',
          confidence: 80,
          reasoning: 'Your diverse collection history shows good curation skills',
          url: 'https://opensea.io'
        });
        recommendations.push({
          type: 'nft',
          title: 'NFT Analytics Platform',
          description: 'Track floor prices, rarity scores, and market trends',
          confidence: 75,
          reasoning: 'Optimize your collection strategy with data-driven insights'
        });
        break;

      case 'DeFi Farmer':
        recommendations.push({
          type: 'defi',
          title: 'Yield Optimization Tools',
          description: 'Automated yield farming strategies with minimal gas costs',
          confidence: 85,
          reasoning: 'Your active DeFi usage indicates strong understanding of yield farming',
        });
        break;

      default:
        recommendations.push({
          type: 'dapp',
          title: 'Portfolio Tracker',
          description: 'Monitor your crypto investments and DeFi positions in real-time',
          confidence: 75,
          reasoning: 'Track your growing Web3 portfolio efficiently'
        });
        recommendations.push({
          type: 'defi',
          title: 'DeFi Education Platform',
          description: 'Learn about decentralized finance and start earning yield',
          confidence: 70,
          reasoning: 'Expand your Web3 knowledge and earning potential'
        });
    }

    // Add universal recommendations based on stats
    if (stats.averageGasSpent > 50) {
      recommendations.push({
        type: 'dapp',
        title: 'Gas Optimization Tool',
        description: 'Reduce transaction costs with gas price prediction and optimization',
        confidence: 70,
        reasoning: 'Your high gas usage suggests potential for cost optimization'
      });
    }

    if (stats.uniqueProtocols < 5) {
      recommendations.push({
        type: 'dapp',
        title: 'Protocol Discovery',
        description: 'Explore new DeFi protocols and expand your Web3 footprint',
        confidence: 65,
        reasoning: 'Diversifying across more protocols can improve your risk profile'
      });
    }

    console.log('Generated', recommendations.length, 'recommendations');
    return recommendations;
  }
}

// Replace mockData usage with real API call to backend for hardcoded persona
export async function fetchPersona(address: string) {
  // For now, always fetch the hardcoded persona from the backend
  const res = await fetch(`https://kgen-backend.onrender.com/api/persona/0x00000000219ab540356cbb839cbe05303d7705fa`);
  const data = await res.json();
  // Map backend data to a simplified Persona object for the frontend
  return {
    address: data.address,
    totalNetworth: data.total_networth,
    nativeBalance: data.native_balance,
    tokenBalanceUsd: data.token_balance_usd,
    chain: data.chain,
    tokenRatio: data.token_ratio,
    transactionsTotal: data.transactions_total,
    nftTransfersTotal: data.nft_transfers_total,
    tokenTransfersTotal: data.token_transfers_total,
    nftCount: data.nft_count,
    nftCollections: data.nft_collections,
    tokenCount: data.token_count,
    topTokens: data.top_tokens,
    defiProtocols: data.defi_protocols,
    totalDefiUsd: data.total_defi_usd,
    uniqueNftCollections: data.unique_nft_collections,
    activityScore: data.activity_score,
    walletHealthScore: data.wallet_health_score,
    riskScore: data.risk_score,
    socialHandle: data.social_handle,
    recommendations: data.recommendations,
    personaProfile: data.persona_profile,
    classifications: data.classifications
  };
}

export async function fetchSummary(address: string) {
  // Not implemented yet
  return { error: 'Summary not implemented' };
}
