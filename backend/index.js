import express from 'express';
import cors from 'cors';
import { generateMockPersona } from './personaGenerator.js';
// import { fetchWalletData } from './walletDataFetcher.js'; // <-- To be implemented
// import { generatePersonaFromData } from './personaGenerator.js'; // <-- For real persona logic
// import { generateAISummary } from './aiSummary.js'; // <-- To be implemented

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

// 2. Persona Analysis Endpoint
app.get('/api/persona/:address', async (req, res) => {
  const { address } = req.params;
  // TODO: Use real raw data instead of mock
  // const rawData = await fetchWalletData(address);
  // const persona = generatePersonaFromData(rawData);
  const persona = generateMockPersona(address); // <-- Replace with real logic
  res.json(persona);
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
