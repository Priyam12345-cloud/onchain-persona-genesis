
import { Persona, PersonaCategory, WalletStats, JourneyEvent, Recommendation } from '@/types/persona';

export const generateMockPersona = (address: string): Persona => {
  // Determine persona type based on address (for demo purposes)
  const personaTypes = [
    'DeFi Whale',
    'NFT Collector',
    'DAO Participant',
    'Gaming Enthusiast',
    'DeFi Farmer',
    'Institutional Investor',
    'Retail Trader',
    'HODLer'
  ];
  
  const primaryPersona = personaTypes[Math.floor(Math.random() * personaTypes.length)];
  
  const generateStats = (): WalletStats => ({
    totalTransactions: Math.floor(Math.random() * 10000) + 500,
    totalVolume: Math.floor(Math.random() * 50000000) + 100000,
    firstTransaction: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    lastTransaction: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    uniqueProtocols: Math.floor(Math.random() * 25) + 5,
    nftCollections: Math.floor(Math.random() * 15) + 1,
    defiInteractions: Math.floor(Math.random() * 100) + 10,
    averageGasSpent: Math.floor(Math.random() * 100) + 20
  });

  const generateJourney = (): JourneyEvent[] => {
    const events: JourneyEvent[] = [];
    const eventTypes = ['defi', 'nft', 'dao', 'gaming', 'social'] as const;
    const protocols = ['Uniswap', 'OpenSea', 'Compound', 'Aave', 'MakerDAO', 'Polygon', 'Arbitrum'];
    
    for (let i = 0; i < 8; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      events.push({
        date: new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        type: eventType,
        description: generateEventDescription(eventType),
        significance: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        amount: eventType === 'defi' ? Math.floor(Math.random() * 100000) + 1000 : undefined
      });
    }
    
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const generateEventDescription = (type: string): string => {
    const descriptions = {
      defi: [
        'Provided liquidity to ETH/USDC pool',
        'Staked tokens in yield farming protocol',
        'Executed large swap transaction',
        'Participated in governance vote'
      ],
      nft: [
        'Acquired rare NFT collection piece',
        'Minted new NFT project',
        'Traded high-value digital art',
        'Joined exclusive NFT community'
      ],
      dao: [
        'Joined new DAO governance',
        'Voted on protocol proposal',
        'Contributed to DAO treasury',
        'Participated in community decision'
      ],
      gaming: [
        'Purchased in-game assets',
        'Staked gaming tokens',
        'Joined gaming guild',
        'Earned play-to-earn rewards'
      ],
      social: [
        'Connected social identity',
        'Joined Web3 social platform',
        'Shared on-chain reputation',
        'Built social graph connections'
      ]
    };
    
    const typeDescriptions = descriptions[type as keyof typeof descriptions] || descriptions.defi;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  };

  const generateRecommendations = (personaType: string): Recommendation[] => {
    const recommendations: { [key: string]: Recommendation[] } = {
      'DeFi Whale': [
        {
          type: 'defi',
          title: 'Advanced Yield Strategies',
          description: 'Explore sophisticated yield farming opportunities with optimal risk-adjusted returns.',
          confidence: 92,
          reasoning: 'Your large transaction volumes and DeFi expertise make you suitable for advanced strategies.',
          url: '#'
        },
        {
          type: 'dao',
          title: 'DeFi Protocol Governance',
          description: 'Participate in major DeFi protocol governance with significant voting power.',
          confidence: 88,
          reasoning: 'Your stake size qualifies you for meaningful governance participation.',
          url: '#'
        }
      ],
      'NFT Collector': [
        {
          type: 'nft',
          title: 'Curated Art Collections',
          description: 'Discover emerging artists and exclusive NFT drops aligned with your collection style.',
          confidence: 95,
          reasoning: 'Your NFT acquisition patterns show preference for high-quality, artistic pieces.',
          url: '#'
        },
        {
          type: 'dapp',
          title: 'NFT Analytics Tools',
          description: 'Advanced portfolio tracking and market analysis tools for serious collectors.',
          confidence: 85,
          reasoning: 'Your collection size benefits from professional-grade analytics.',
          url: '#'
        }
      ]
    };

    return recommendations[personaType] || [
      {
        type: 'defi',
        title: 'Beginner DeFi Protocols',
        description: 'Safe and user-friendly DeFi protocols perfect for getting started.',
        confidence: 78,
        reasoning: 'Based on your current activity level and risk profile.',
        url: '#'
      }
    ];
  };

  const generateBio = (personaType: string, stats: WalletStats): string => {
    const bios = {
      'DeFi Whale': `A sophisticated DeFi power user with ${stats.totalTransactions.toLocaleString()} transactions and $${(stats.totalVolume / 1000000).toFixed(1)}M in total volume. This wallet demonstrates deep understanding of decentralized finance, consistently engaging with yield farming, liquidity provision, and governance across ${stats.uniqueProtocols} protocols. Shows pattern of strategic, large-scale movements with excellent timing.`,
      'NFT Collector': `Passionate digital art enthusiast with a keen eye for valuable NFTs across ${stats.nftCollections} collections. Has executed ${stats.totalTransactions.toLocaleString()} transactions worth $${(stats.totalVolume / 1000000).toFixed(1)}M, showing strong preference for high-quality artistic pieces and emerging creators. Demonstrates excellent market timing and curation skills.`,
      'DAO Participant': `Active community member and governance participant across ${stats.uniqueProtocols} DAOs and protocols. With ${stats.totalTransactions.toLocaleString()} transactions, this wallet shows consistent engagement in decentralized governance, proposal voting, and community building. Values long-term protocol development over short-term gains.`
    };

    return bios[personaType as keyof typeof bios] || `Web3 enthusiast with ${stats.totalTransactions.toLocaleString()} transactions across ${stats.uniqueProtocols} protocols. Shows balanced approach to DeFi, NFTs, and governance participation with $${(stats.totalVolume / 1000000).toFixed(1)}M in total volume.`;
  };

  const generateTraits = (personaType: string): string[] => {
    const traits = {
      'DeFi Whale': ['Strategic Thinker', 'Risk Manager', 'Yield Optimizer', 'Protocol Expert', 'Market Timer'],
      'NFT Collector': ['Art Connoisseur', 'Trend Spotter', 'Community Builder', 'Digital Native', 'Cultural Curator'],
      'DAO Participant': ['Governance Expert', 'Community Leader', 'Long-term Thinker', 'Consensus Builder', 'Protocol Advocate']
    };

    return traits[personaType as keyof typeof traits] || ['Web3 Explorer', 'Early Adopter', 'Multi-chain User', 'Community Member'];
  };

  const generateSuggestedHandle = (personaType: string, address: string): string => {
    const handles = {
      'DeFi Whale': ['DefiMaestro', 'YieldKing', 'LiquidityLord', 'ProtocolPro'],
      'NFT Collector': ['DigitalCurator', 'ArtVault', 'NFTConnoisseur', 'CryptoCollector'],
      'DAO Participant': ['GovernanceGuru', 'CommunityChief', 'DAODelegate', 'ProtocolPioneer']
    };

    const typeHandles = handles[personaType as keyof typeof handles] || ['Web3User', 'CryptoExplorer'];
    const baseHandle = typeHandles[Math.floor(Math.random() * typeHandles.length)];
    const suffix = address.slice(-4);
    
    return `${baseHandle}_${suffix}`;
  };

  const stats = generateStats();

  return {
    address,
    category: {
      primary: primaryPersona,
      secondary: ['Early Adopter', 'Multi-chain User', 'Protocol Explorer'].slice(0, Math.floor(Math.random() * 3) + 1),
      confidence: Math.floor(Math.random() * 30) + 70
    },
    riskScore: Math.floor(Math.random() * 40) + 60,
    healthScore: Math.floor(Math.random() * 30) + 70,
    aiGeneratedBio: generateBio(primaryPersona, stats),
    suggestedHandle: generateSuggestedHandle(primaryPersona, address),
    traits: generateTraits(primaryPersona),
    stats,
    journey: generateJourney(),
    recommendations: generateRecommendations(primaryPersona)
  };
};
