
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
    const defiInteractions = defiInteractions.length;
    const averageGasSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.gasUsed || '0'), 0) / Math.max(totalTransactions, 1);

    return {
      totalTransactions,
      totalVolume,
      firstTransaction,
      lastTransaction,
      uniqueProtocols,
      nftCollections,
      defiInteractions,
      averageGasSpent
    };
  }

  private determinePersonaCategory(stats: WalletStats, nfts: any[], defiInteractions: any[]): PersonaCategory {
    let primary = 'Retail Trader';
    let confidence = 70;
    const secondary: string[] = [];

    // Analyze based on real data patterns
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

    // Add secondary traits
    if (stats.nftCollections > 5) secondary.push('NFT Enthusiast');
    if (stats.defiInteractions > 10) secondary.push('DeFi User');
    if (stats.uniqueProtocols > 15) secondary.push('Protocol Explorer');

    return { primary, secondary, confidence };
  }

  private generateJourneyEvents(transactions: any[], nfts: any[], defiInteractions: any[]): JourneyEvent[] {
    const events: JourneyEvent[] = [];

    // Add significant transaction events
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

    // Add NFT acquisition events
    nfts.slice(0, 5).forEach(nft => {
      events.push({
        date: new Date(), // Would need to get actual acquisition date
        type: 'nft',
        description: `Acquired ${nft.name} from ${nft.collection}`,
        significance: 'medium',
        protocol: nft.collection
      });
    });

    return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
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

    return Math.min(Math.max(score, 0), 100);
  }

  private calculateHealthScore(stats: WalletStats, transactions: any[]): number {
    let score = 60; // Base score

    // Positive health indicators
    if (stats.totalTransactions > 50) score += 20;
    if (stats.uniqueProtocols > 5) score += 15;
    
    const daysSinceFirst = (Date.now() - stats.firstTransaction.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceFirst > 365) score += 15; // Wallet age bonus

    return Math.min(Math.max(score, 0), 100);
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

    return traits;
  }

  private generateRecommendations(category: PersonaCategory, stats: WalletStats, nfts: any[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Base recommendations based on category
    switch (category.primary) {
      case 'DeFi Whale':
        recommendations.push({
          type: 'defi',
          title: 'Advanced Yield Strategies',
          description: 'Explore institutional-grade yield farming protocols',
          confidence: 85,
          reasoning: 'Your high volume activity suggests readiness for advanced DeFi strategies',
          url: 'https://yearn.finance'
        });
        break;
      
      case 'NFT Collector':
        recommendations.push({
          type: 'nft',
          title: 'Emerging Art Collections',
          description: 'Discover upcoming NFT artists and collections',
          confidence: 80,
          reasoning: 'Your diverse collection history shows good curation skills',
          url: 'https://opensea.io'
        });
        break;

      default:
        recommendations.push({
          type: 'dapp',
          title: 'Portfolio Tracker',
          description: 'Monitor your crypto investments in real-time',
          confidence: 75,
          reasoning: 'Track your growing Web3 portfolio efficiently'
        });
    }

    return recommendations;
  }
}
