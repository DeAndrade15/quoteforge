require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', require('./routes/gerar'));

// Serve frontend build
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ erro: 'Rota não encontrada' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`QuoteForge rodando em http://localhost:${PORT}`));
