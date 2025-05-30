
import { Persona, WalletStats, JourneyEvent, Recommendation, PersonaCategory } from '@/types/persona';

export class PythonDataService {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/wallet-analysis') {
    this.apiEndpoint = apiEndpoint;
  }

  async analyzeWallet(walletAddress: string): Promise<Persona> {
    console.log('Analyzing wallet with Python script:', walletAddress);

    try {
      // Call your backend API that runs test(3).py
      const response = await fetch(`${this.apiEndpoint}/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pythonData = await response.json();
      console.log('Received Python data:', pythonData);

      // Transform Python data to frontend format
      return this.transformPythonDataToPersona(walletAddress, pythonData);
    } catch (error) {
      console.error('Error calling Python analysis:', error);
      throw error;
    }
  }

  private transformPythonDataToPersona(address: string, pythonData: any): Persona {
    // Transform the Python script output to match our Persona interface
    const stats: WalletStats = {
      totalTransactions: pythonData.activity_score || 0,
      totalVolume: pythonData.total_networth || 0,
      firstTransaction: new Date(), // You might need to add this to your Python data
      lastTransaction: new Date(),
      uniqueProtocols: pythonData.defi_protocols || 0,
      nftCollections: pythonData.unique_nft_collections || 0,
      defiInteractions: pythonData.defi_protocols || 0,
      averageGasSpent: 30 // You might need to calculate this in Python
    };

    // Determine persona category based on Python classifications
    const category: PersonaCategory = this.determinePersonaFromClassifications(
      pythonData.classifications || [],
      pythonData
    );

    // Generate journey events from Python data
    const journey: JourneyEvent[] = this.generateJourneyFromPythonData(pythonData);

    // Generate recommendations based on Python analysis
    const recommendations: Recommendation[] = this.generateRecommendationsFromPythonData(pythonData);

    // Extract traits from Python classifications and data
    const traits = this.extractTraitsFromPythonData(pythonData);

    return {
      address,
      category,
      riskScore: pythonData.risk_score || 50,
      healthScore: pythonData.wallet_health_score || 50,
      aiGeneratedBio: this.generateBioFromPythonData(pythonData),
      suggestedHandle: pythonData.social_handle || this.generateHandleFromData(pythonData),
      traits,
      stats,
      journey,
      recommendations
    };
  }

  private determinePersonaFromClassifications(classifications: string[], data: any): PersonaCategory {
    let primary = 'Retail Trader';
    let confidence = 70;
    const secondary: string[] = [];

    // Map Python classifications to persona categories
    const classificationMap: { [key: string]: string } = {
      'whale': 'DeFi Whale',
      'defi_user': 'DeFi Farmer',
      'nft_collector': 'NFT Collector',
      'dao_participant': 'DAO Participant',
      'trader': 'Retail Trader',
      'hodler': 'HODLer',
      'institutional': 'Institutional Investor'
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

    // Add secondary traits based on data
    if (data.total_networth > 1000000) secondary.push('High Net Worth');
    if (data.unique_nft_collections > 5) secondary.push('NFT Enthusiast');
    if (data.defi_protocols > 3) secondary.push('DeFi User');
    if (data.token_count > 20) secondary.push('Token Diversifier');

    return { primary, secondary, confidence };
  }

  private generateJourneyFromPythonData(data: any): JourneyEvent[] {
    const events: JourneyEvent[] = [];

    // Create journey events based on Python data
    if (data.total_networth > 0) {
      events.push({
        date: new Date(),
        type: 'social',
        description: `Portfolio worth $${data.total_networth.toLocaleString()}`,
        significance: data.total_networth > 100000 ? 'high' : 'medium',
        amount: data.total_networth
      });
    }

    if (data.defi_protocols > 0) {
      events.push({
        date: new Date(),
        type: 'defi',
        description: `Active in ${data.defi_protocols} DeFi protocols with $${data.total_defi_usd?.toLocaleString() || '0'}`,
        significance: 'high',
        amount: data.total_defi_usd
      });
    }

    if (data.unique_nft_collections > 0) {
      events.push({
        date: new Date(),
        type: 'nft',
        description: `Owns ${data.unique_nft_collections} unique NFT collections`,
        significance: 'medium'
      });
    }

    if (data.top_tokens && data.top_tokens.length > 0) {
      events.push({
        date: new Date(),
        type: 'social',
        description: `Top holdings: ${data.top_tokens.slice(0, 3).join(', ')}`,
        significance: 'medium'
      });
    }

    return events.slice(0, 10); // Limit to 10 events
  }

  private generateRecommendationsFromPythonData(data: any): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Generate recommendations based on Python analysis
    if (data.risk_score > 70) {
      recommendations.push({
        type: 'defi',
        title: 'Risk Management Tools',
        description: 'Consider using portfolio hedging strategies to reduce risk exposure',
        confidence: 80,
        reasoning: 'Your risk score indicates high exposure that could benefit from risk management'
      });
    }

    if (data.defi_protocols > 0 && data.total_defi_usd > 10000) {
      recommendations.push({
        type: 'defi',
        title: 'Yield Optimization',
        description: 'Explore advanced yield farming strategies for your DeFi portfolio',
        confidence: 85,
        reasoning: `Your $${data.total_defi_usd?.toLocaleString()} in DeFi shows active engagement`
      });
    }

    if (data.unique_nft_collections > 3) {
      recommendations.push({
        type: 'nft',
        title: 'NFT Portfolio Management',
        description: 'Use NFT analytics tools to track floor prices and market trends',
        confidence: 75,
        reasoning: `Your ${data.unique_nft_collections} NFT collections could benefit from better tracking`
      });
    }

    if (data.token_count > 15) {
      recommendations.push({
        type: 'dapp',
        title: 'Portfolio Rebalancing',
        description: 'Consider consolidating your token holdings for better management',
        confidence: 70,
        reasoning: `With ${data.token_count} tokens, portfolio simplification might improve returns`
      });
    }

    return recommendations;
  }

  private extractTraitsFromPythonData(data: any): string[] {
    const traits: string[] = [];

    if (data.total_networth > 1000000) traits.push('High Net Worth');
    if (data.total_networth > 100000) traits.push('Whale');
    if (data.risk_score < 30) traits.push('Conservative');
    if (data.risk_score > 70) traits.push('High Risk');
    if (data.wallet_health_score > 80) traits.push('Healthy Portfolio');
    if (data.defi_protocols > 5) traits.push('DeFi Native');
    if (data.unique_nft_collections > 10) traits.push('NFT Collector');
    if (data.token_count > 50) traits.push('Token Hoarder');
    if (data.activity_score > 1000) traits.push('High Activity');
    if (data.chain === 'ethereum') traits.push('Ethereum Native');

    // Add classification-based traits
    if (data.classifications) {
      traits.push(...data.classifications.map((c: string) => 
        c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')
      ));
    }

    return [...new Set(traits)]; // Remove duplicates
  }

  private generateBioFromPythonData(data: any): string {
    const networth = data.total_networth || 0;
    const chain = data.chain || 'blockchain';
    const defiProtocols = data.defi_protocols || 0;
    const nftCollections = data.unique_nft_collections || 0;
    const tokenCount = data.token_count || 0;

    return `A ${chain} native with $${networth.toLocaleString()} in total portfolio value. ` +
           `This wallet demonstrates ${defiProtocols > 0 ? 'active DeFi engagement across ' + defiProtocols + ' protocols' : 'conservative trading patterns'} ` +
           `and ${nftCollections > 0 ? 'collects NFTs across ' + nftCollections + ' collections' : 'focuses on token trading'}. ` +
           `With ${tokenCount} different tokens, this user shows ${tokenCount > 20 ? 'diverse' : 'focused'} investment strategy ` +
           `and maintains a ${data.wallet_health_score > 70 ? 'healthy' : 'moderate'} portfolio health score.`;
  }

  private generateHandleFromData(data: any): string {
    const prefixes = ['Crypto', 'DeFi', 'NFT', 'Web3', 'Block'];
    const suffixes = ['Whale', 'Master', 'Pro', 'Sage', 'Trader'];
    
    let prefix = 'Crypto';
    if (data.total_networth > 1000000) prefix = 'Whale';
    else if (data.defi_protocols > 3) prefix = 'DeFi';
    else if (data.unique_nft_collections > 5) prefix = 'NFT';
    
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 999);
    
    return `${prefix}${suffix}${number}`;
  }

  // Method to get available wallets from CSV files
  async getAvailableWallets(): Promise<string[]> {
    try {
      const response = await fetch('/api/available-wallets');
      if (!response.ok) {
        throw new Error('Failed to fetch available wallets');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching available wallets:', error);
      return [];
    }
  }
}
