
import { BlockchainProvider, Transaction, NFTCollection, DeFiInteraction, WalletBalance } from '@/types/api';

class AlchemyProvider implements BlockchainProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, network: string = 'eth-mainnet') {
    this.apiKey = apiKey;
    this.baseUrl = `https://${network}.g.alchemy.com/v2/${apiKey}`;
  }

  async getWalletTransactions(address: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromAddress: address,
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
            maxCount: 100,
            order: 'desc'
          }],
          id: 1
        })
      });

      const data = await response.json();
      
      return data.result?.transfers?.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value?.toString() || '0',
        gasUsed: '0', // Will need additional call for gas data
        gasPrice: '0',
        timestamp: new Date(tx.metadata?.blockTimestamp || Date.now()),
        blockNumber: parseInt(tx.blockNum, 16),
        contractAddress: tx.rawContract?.address
      })) || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getWalletNFTs(address: string): Promise<NFTCollection[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getNFTs?owner=${address}`);
      const data = await response.json();
      
      return data.ownedNfts?.map((nft: any) => ({
        contractAddress: nft.contract.address,
        tokenId: nft.id.tokenId,
        name: nft.title || 'Unnamed NFT',
        description: nft.description,
        image: nft.media?.[0]?.gateway,
        collection: nft.contractMetadata?.name || 'Unknown Collection',
        traits: nft.metadata?.attributes
      })) || [];
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }

  async getWalletDeFiInteractions(address: string): Promise<DeFiInteraction[]> {
    // This would require more complex analysis of transaction data
    // For now, return empty array - will be enhanced in Phase 3
    console.log('DeFi analysis for:', address);
    return [];
  }

  async getWalletBalance(address: string): Promise<WalletBalance> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });

      const data = await response.json();
      const balance = parseInt(data.result, 16) / Math.pow(10, 18);

      return {
        address,
        balance: balance.toString(),
        tokens: [] // Will be enhanced to fetch token balances
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return { address, balance: '0', tokens: [] };
    }
  }
}

export { AlchemyProvider };
export type { BlockchainProvider };
