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

// API endpoint to get persona data by address (dynamic, runs Python script)
app.get('/api/persona/:address', async (req, res) => {
  const { address } = req.params;
  const wallet = address.toLowerCase();
  const hfToken = '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'; // <-- your fixed token
  const pyScript = 'test (3).py'; // Python script filename
  const personaJson = `persona_${wallet.slice(0, 8)}.json`;

  // Run the Python script
  const pyArgs = [pyScript, '--wallet', wallet, '--hf-token', hfToken, '--json-output'];
  const pythonProcess = spawn('python', pyArgs, { cwd: __dirname });

  let stderr = '';
  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Python script failed: ${stderr}` });
    }
    try {
      const jsonPath = `${__dirname}/${personaJson}`;
      const fileData = await fs.readFile(jsonPath, 'utf-8');
      const persona = JSON.parse(fileData);
      res.json(persona);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read persona JSON', details: err.message });
    }
  });
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
