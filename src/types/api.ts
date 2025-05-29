
export interface BlockchainProvider {
  getWalletTransactions(address: string): Promise<Transaction[]>;
  getWalletNFTs(address: string): Promise<NFTCollection[]>;
  getWalletDeFiInteractions(address: string): Promise<DeFiInteraction[]>;
  getWalletBalance(address: string): Promise<WalletBalance>;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: Date;
  blockNumber: number;
  methodId?: string;
  contractAddress?: string;
}

export interface NFTCollection {
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  image?: string;
  collection: string;
  traits?: { trait_type: string; value: string }[];
}

export interface DeFiInteraction {
  protocol: string;
  type: 'swap' | 'liquidity' | 'lending' | 'staking';
  amount: string;
  timestamp: Date;
  transactionHash: string;
  tokenIn?: string;
  tokenOut?: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price?: number;
}

export interface PersonaAnalysisRequest {
  walletAddress: string;
  userId?: string;
}

export interface PersonaAnalysisResponse {
  persona: import('./persona').Persona;
  analysisId: string;
  timestamp: Date;
}
