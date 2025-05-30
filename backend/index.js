import express from 'express';
import cors from 'cors';
import { generateMockPersona } from './personaGenerator.js';
import { spawn } from 'child_process';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Raw Wallet Data Endpoint (to be implemented)
app.get('/api/wallet/:address/raw', async (req, res) => {
  const { address } = req.params;
  // TODO: Fetch data from Covalent/Moralis/etc.
  // const rawData = await fetchWalletData(address);
  // res.json(rawData);
  res.status(501).json({ error: 'Not implemented. Integrate Covalent/Moralis API here.' });
});

// API endpoint to get persona data by address (hardcoded for testing)
app.get('/api/persona/:address', async (req, res) => {
  // Hardcoded test response using the provided JSON
  const testPersona = {
    "address": "0x00000000219ab540356cbb839cbe05303d7705fa",
    "total_networth": 162787000000.0,
    "native_balance": 62077115.25,
    "token_balance_usd": 411575.92,
    "chain": "eth",
    "token_ratio": 2.5283095087445557e-06,
    "transactions_total": 675544,
    "nft_transfers_total": 23493,
    "token_transfers_total": 115310,
    "nft_count": 20,
    "nft_collections": 19,
    "token_count": 98,
    "top_tokens": ["ETH", "ETH2POS", "PIKA"],
    "defi_protocols": 1,
    "total_defi_usd": 448.73653176032855,
    "unique_nft_collections": 19,
    "activity_score": 814347,
    "wallet_health_score": 81.8,
    "risk_score": 18.2,
    "social_handle": "CryptoWolf_0x0000_05fa",
    "recommendations": [
      "Explore DeFi yield farming protocols",
      "Consider long-term staking opportunities",
      "Diversify portfolio with Layer 2 tokens"
    ],
    "persona_profile": "# Persona Profile: CryptoWolf_0x0000_05fa\n\n## 1. Crypto Identity\nThis persona is identified as a **whale, token explorer, NFT collector**, with a net worth of approximately **$162,787,000,000.00**. They hold **98** tokens and are involved in **19** unique NFT collections.\n\n## 2. Trading Style\nCryptoWolf_0x0000_05fa is an active trader with frequent transactions and portfolio adjustments, showing consistent engagement in the crypto markets.\n\n## 3. Risk Profile\nTheir risk profile indicates a **low risk tolerance, preferring stable and secure investments**, with a risk score of 18.2 out of 100.\n\n## 4. Blockchain Preferences\nPrimarily active on the eth blockchain, leveraging its ecosystem for opportunities.\n\n## 5. Personalized Recommendations\nBased on their profile, the following recommendations may suit their interests and investment style:\n\n- Explore DeFi yield farming protocols\n- Consider long-term staking opportunities\n- Diversify portfolio with Layer 2 tokens",
    "classifications": [
      "whale",
      "token_explorer",
      "nft_collector",
      "nft_trader",
      "power_user",
      "high_volume_trader"
    ]
  };
  res.json(testPersona);
});

// 3. AI Summary Endpoint (to be implemented)
app.get('/api/summary/:address', async (req, res) => {
  const { address } = req.params;
  // TODO: Fetch persona, then call OpenAI API for summary
  // const persona = await generatePersonaFromData(await fetchWalletData(address));
  // const summary = await generateAISummary(persona.tags, persona.scores);
  res.status(501).json({ error: 'Not implemented. Integrate OpenAI API here.' });
});

app.get('/', (req, res) => {
  res.send('Onchain Persona Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
