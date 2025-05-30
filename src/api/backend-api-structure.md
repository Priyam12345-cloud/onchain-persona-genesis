
# Backend API Structure for Python Integration

To integrate your `test(3).py` script with the frontend, you'll need to create these API endpoints:

## Required API Endpoints

### 1. Wallet Analysis Endpoint
```
GET /api/wallet-analysis/{wallet_address}
```

**Description**: Executes your `test(3).py` script for the given wallet address and returns the analysis data.

**Implementation Example** (Node.js/Express):
```javascript
app.get('/api/wallet-analysis/:address', async (req, res) => {
  const { address } = req.params;
  
  try {
    // Execute your Python script
    const { spawn } = require('child_process');
    const python = spawn('python', [
      'test(3).py',
      '--wallet', address,
      '--data-dir', 'web3_kgenX_new',
      '--json-output',
      '--html-output'
    ]);
    
    // Wait for script completion and read the generated JSON file
    python.on('close', (code) => {
      if (code === 0) {
        const fs = require('fs');
        const jsonData = JSON.parse(fs.readFileSync(`persona_${address.substring(0,8)}.json`));
        res.json(jsonData);
      } else {
        res.status(500).json({ error: 'Python script failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Available Wallets Endpoint
```
GET /api/available-wallets
```

**Description**: Returns a list of available wallet addresses from your CSV files.

**Implementation Example**:
```javascript
app.get('/api/available-wallets', async (req, res) => {
  try {
    const fs = require('fs');
    const csv = require('csv-parser');
    const wallets = [];
    
    // Read wallets from your CSV file
    fs.createReadStream('web3_kgenX_new/wallets.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.wallet_address) {
          wallets.push(row.wallet_address);
        }
      })
      .on('end', () => {
        res.json(wallets.slice(0, 1000)); // Limit to first 1000
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Files Your Backend Needs Access To

Based on your file structure, ensure these files are accessible:
- `web3_kgenX_new/` directory with all CSV files
- `test(3).py` script
- `dataLoading.py` dependency
- `visualization.py` dependency
- Any other Python dependencies

## Environment Setup

Your backend server needs:
1. Python 3.x installed
2. Required Python packages (pandas, transformers, etc.)
3. Access to your CSV data files
4. Node.js/Express server (or your preferred backend framework)

## CORS Configuration

Make sure to enable CORS for your frontend domain:
```javascript
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend URL
}));
```

## Error Handling

The backend should handle:
- Invalid wallet addresses
- Missing CSV data
- Python script failures
- File system errors
- API rate limiting if needed
