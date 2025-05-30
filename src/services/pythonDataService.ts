
import { Persona, WalletStats, JourneyEvent, Recommendation, PersonaCategory } from '@/types/persona';

export class PythonDataService {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = 'http://localhost:5000') {
    this.apiEndpoint = apiEndpoint;
  }

  async analyzeWallet(walletAddress: string): Promise<Persona> {
    console.log('Analyzing wallet with Flask backend:', walletAddress);

    try {
      // Call your Flask backend API
      const response = await fetch(`${this.apiEndpoint}/analyze/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const flaskData = await response.json();
      console.log('Received Flask data:', flaskData);

      // Transform Flask data to frontend format
      return this.transformFlaskDataToPersona(walletAddress, flaskData);
    } catch (error) {
      console.error('Error calling Flask analysis:', error);
      throw error;
    }
  }

  private transformFlaskDataToPersona(address: string, flaskData: any): Persona {
    // Extract features from Flask response
    const features = flaskData.features || {};
    const analysis = flaskData.analysis || {};
    const classifications = flaskData.classifications || [];

    const stats: WalletStats = {
      totalTransactions: features.activity_score || 0,
      totalVolume: features.total_networth || 0,
      firstTransaction: new Date(), // You might want to add this to your Python script
      lastTransaction: new Date(),
      uniqueProtocols: features.defi_protocols || 0,
      nftCollections: features.unique_nft_collections || 0,
      defiInteractions: features.defi_protocols || 0,
      averageGasSpent: 30 // You might want to calculate this in Python
    };

    // Determine persona category based on Flask classifications
    const category: PersonaCategory = this.determinePersonaFromFlaskData(
      classifications,
      features
    );

    // Generate journey events from Flask data
    const journey: JourneyEvent[] = this.generateJourneyFromFlaskData(features, analysis);

    // Generate recommendations based on Flask analysis
    const recommendations: Recommendation[] = this.generateRecommendationsFromFlaskData(features, analysis);

    // Extract traits from Flask classifications and data
    const traits = this.extractTraitsFromFlaskData(features, classifications);

    return {
      address,
      category,
      riskScore: features.risk_score || 50,
      healthScore: features.wallet_health_score || 50,
      aiGeneratedBio: analysis.persona_text || this.generateBioFromFlaskData(features),
      suggestedHandle: features.social_handle || this.generateHandleFromFlaskData(features),
      traits,
      stats,
      journey,
      recommendations
    };
  }

  private determinePersonaFromFlaskData(classifications: string[], features: any): PersonaCategory {
    let primary = 'Retail Trader';
    let confidence = 70;
    const secondary: string[] = [];

    // Map Flask classifications to persona categories
    const classificationMap: { [key: string]: string } = {
      'whale': 'DeFi Whale',
      'defi_user': 'DeFi Farmer',
      'nft_collector': 'NFT Collector',
      'dao_participant': 'DAO Participant',
      'trader': 'Retail Trader',
      'hodler': 'HODLer',
      'institutional': 'Institutional Investor',
      'high_value': 'DeFi Whale',
      'active_trader': 'Retail Trader'
    };

    // Find primary classification
    for (const classification of classifications) {
      const mappedCategory = classificationMap[classification.toLowerCase()];
      if (mappedCategory) {
        primary = mappedCategory;
        confidence = 85;
        break;
      }
    }

    // Add secondary traits based on Flask data
    if (features.total_networth > 1000000) secondary.push('High Net Worth');
    if (features.unique_nft_collections > 5) secondary.push('NFT Enthusiast');
    if (features.defi_protocols > 3) secondary.push('DeFi User');
    if (features.token_count > 20) secondary.push('Token Diversifier');
    if (features.activity_score > 1000) secondary.push('High Activity');

    return { primary, secondary, confidence };
  }

  private generateJourneyFromFlaskData(features: any, analysis: any): JourneyEvent[] {
    const events: JourneyEvent[] = [];

    // Create journey events based on Flask data
    if (features.total_networth > 0) {
      events.push({
        date: new Date(),
        type: 'social',
        description: `Portfolio worth $${features.total_networth.toLocaleString()}`,
        significance: features.total_networth > 100000 ? 'high' : 'medium',
        amount: features.total_networth
      });
    }

    if (features.defi_protocols > 0) {
      events.push({
        date: new Date(),
        type: 'defi',
        description: `Active in ${features.defi_protocols} DeFi protocols with $${features.total_defi_usd?.toLocaleString() || '0'}`,
        significance: 'high',
        amount: features.total_defi_usd,
        protocol: 'DeFi Ecosystem'
      });
    }

    if (features.unique_nft_collections > 0) {
      events.push({
        date: new Date(),
        type: 'nft',
        description: `Owns ${features.unique_nft_collections} unique NFT collections`,
        significance: 'medium'
      });
    }

    if (features.top_tokens && features.top_tokens.length > 0) {
      events.push({
        date: new Date(),
        type: 'social',
        description: `Top holdings: ${features.top_tokens.slice(0, 3).join(', ')}`,
        significance: 'medium'
      });
    }

    if (features.native_balance > 1) {
      events.push({
        date: new Date(),
        type: 'social',
        description: `Holds ${features.native_balance.toFixed(2)} ${features.chain?.toUpperCase() || 'ETH'}`,
        significance: 'medium',
        amount: features.native_balance
      });
    }

    return events.slice(0, 10); // Limit to 10 events
  }

  private generateRecommendationsFromFlaskData(features: any, analysis: any): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Generate recommendations based on Flask analysis
    if (features.risk_score > 70) {
      recommendations.push({
        type: 'defi',
        title: 'Risk Management Tools',
        description: 'Consider using portfolio hedging strategies to reduce risk exposure',
        confidence: 80,
        reasoning: `Your risk score of ${features.risk_score} indicates high exposure that could benefit from risk management`
      });
    }

    if (features.defi_protocols > 0 && features.total_defi_usd > 10000) {
      recommendations.push({
        type: 'defi',
        title: 'Yield Optimization',
        description: 'Explore advanced yield farming strategies for your DeFi portfolio',
        confidence: 85,
        reasoning: `Your $${features.total_defi_usd?.toLocaleString()} in DeFi shows active engagement across ${features.defi_protocols} protocols`
      });
    }

    if (features.unique_nft_collections > 3) {
      recommendations.push({
        type: 'nft',
        title: 'NFT Portfolio Management',
        description: 'Use NFT analytics tools to track floor prices and market trends',
        confidence: 75,
        reasoning: `Your ${features.unique_nft_collections} NFT collections could benefit from better tracking`
      });
    }

    if (features.token_count > 15) {
      recommendations.push({
        type: 'dapp',
        title: 'Portfolio Rebalancing',
        description: 'Consider consolidating your token holdings for better management',
        confidence: 70,
        reasoning: `With ${features.token_count} tokens, portfolio simplification might improve returns`
      });
    }

    if (features.wallet_health_score < 50) {
      recommendations.push({
        type: 'dapp',
        title: 'Wallet Health Improvement',
        description: 'Focus on more consistent transaction patterns and diversification',
        confidence: 75,
        reasoning: `Your wallet health score of ${features.wallet_health_score} suggests room for improvement`
      });
    }

    return recommendations;
  }

  private extractTraitsFromFlaskData(features: any, classifications: string[]): string[] {
    const traits: string[] = [];

    if (features.total_networth > 1000000) traits.push('High Net Worth');
    if (features.total_networth > 100000) traits.push('Whale');
    if (features.risk_score < 30) traits.push('Conservative');
    if (features.risk_score > 70) traits.push('High Risk');
    if (features.wallet_health_score > 80) traits.push('Healthy Portfolio');
    if (features.defi_protocols > 5) traits.push('DeFi Native');
    if (features.unique_nft_collections > 10) traits.push('NFT Collector');
    if (features.token_count > 50) traits.push('Token Hoarder');
    if (features.activity_score > 1000) traits.push('High Activity');
    if (features.chain === 'ethereum') traits.push('Ethereum Native');
    if (features.native_balance > 10) traits.push('ETH Holder');

    // Add classification-based traits
    if (classifications) {
      traits.push(...classifications.map((c: string) => 
        c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')
      ));
    }

    return [...new Set(traits)]; // Remove duplicates
  }

  private generateBioFromFlaskData(features: any): string {
    const networth = features.total_networth || 0;
    const chain = features.chain || 'blockchain';
    const defiProtocols = features.defi_protocols || 0;
    const nftCollections = features.unique_nft_collections || 0;
    const tokenCount = features.token_count || 0;

    return `A ${chain} native with $${networth.toLocaleString()} in total portfolio value. ` +
           `This wallet demonstrates ${defiProtocols > 0 ? 'active DeFi engagement across ' + defiProtocols + ' protocols' : 'conservative trading patterns'} ` +
           `and ${nftCollections > 0 ? 'collects NFTs across ' + nftCollections + ' collections' : 'focuses on token trading'}. ` +
           `With ${tokenCount} different tokens, this user shows ${tokenCount > 20 ? 'diverse' : 'focused'} investment strategy ` +
           `and maintains a ${features.wallet_health_score > 70 ? 'healthy' : 'moderate'} portfolio health score.`;
  }

  private generateHandleFromFlaskData(features: any): string {
    const prefixes = ['Crypto', 'DeFi', 'NFT', 'Web3', 'Block'];
    const suffixes = ['Whale', 'Master', 'Pro', 'Sage', 'Trader'];
    
    let prefix = 'Crypto';
    if (features.total_networth > 1000000) prefix = 'Whale';
    else if (features.defi_protocols > 3) prefix = 'DeFi';
    else if (features.unique_nft_collections > 5) prefix = 'NFT';
    
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 999);
    
    return `${prefix}${suffix}${number}`;
  }

  // Method to get available wallets from Flask backend
  async getAvailableWallets(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/wallets`);
      if (!response.ok) {
        throw new Error('Failed to fetch available wallets');
      }
      const data = await response.json();
      return data.wallets || [];
    } catch (error) {
      console.error('Error fetching available wallets:', error);
      return [];
    }
  }

  // Method to get wallet analysis status
  async getAnalysisStatus(walletAddress: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiEndpoint}/status/${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching analysis status:', error);
      return { status: 'unknown' };
    }
  }
}
