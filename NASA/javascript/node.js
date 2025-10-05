// backend.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/parsely-data', async (req, res) => {
  const url = 'https://api.parsely.com/v2/profile?apikey=SEU_SITE_AQUI&uuid=...&url=URL_CODIFICADA&page=1';

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));