require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://vase-domena.cz'], // Upravte dle vaší konfigurace
}));
app.use(express.json());
app.use(helmet());

// Konfigurace logování
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// Route pro testování
app.get('/test', async (req, res) => {
  res.send('API funguje! Zkuste odeslat POST požadavek na /api/chat/send');
});

// Route pro chat s OpenAI API
app.post('/api/chat/send', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o', // Specificky model GPT-4o
        messages: [
          ...messages,
          {
            role: 'system',
            content: 'Jsi vysoce sofistikovaný a precizní asistent specializovaný na prodej šperkařských produktů. Poskytuj profesionální, stručné odpovědi. Pracuješ pro Firmu s názvem Klenotka'
          }
        ],
        temperature: 0.2,   // Minimalizace náhodnosti
        top_p: 0.5,         // Přesnější výběr slov
        frequency_penalty: 0.7, // Omezení opakování
        presence_penalty: 0.6,  // Podpora diversity
        max_tokens: 500     // Omezení délky
      
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ 
      message: response.data.choices[0].message.content 
    });
  } catch (error) {
    logger.error("Chyba při volání OpenAI API:", error.response?.data || error.message);
    res.status(500).json({ error: 'Chyba při komunikaci s AI.' });
  }
});

// Route pro trénování modelu
app.post('/api/train', async (req, res) => {
  try {
    const trainingFilePath = path.join(__dirname, 'data', 'trainingDataForOpenAI.jsonl');

    // Kontrola existence trénovacího souboru
    if (!fs.existsSync(trainingFilePath)) {
      return res.status(400).json({ error: 'Trénovací soubor nebyl nalezen.' });
    }

    // Vytvoření FormData pro upload souboru
    const formData = new FormData();
    formData.append('file', fs.createReadStream(trainingFilePath), {
      filename: 'trainingDataForOpenAI.jsonl',
      contentType: 'application/jsonl'
    });
    formData.append('purpose', 'fine-tune');

    // Upload trénovacího souboru
    const fileUploadResponse = await axios.post(
      'https://api.openai.com/v1/files',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Vytvoření fine-tuning úlohy
    const fineTuneResponse = await axios.post(
      'https://api.openai.com/v1/fine_tunes',
      {
        training_file: fileUploadResponse.data.id,
        model: 'gpt-4o' // Fine-tuning pro GPT-4o
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info('Fine-tuning úloha vytvořena:', fineTuneResponse.data.id);
    res.json(fineTuneResponse.data);
  } catch (error) {
    logger.error("Chyba při trénování modelu:", error.response?.data || error.message);
    res.status(500).json({ error: 'Chyba při trénování modelu.' });
  }
});

// Route pro kontrolu stavu fine-tuningu
app.get('/api/train/status/:jobId', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openai.com/v1/fine_tunes/${req.params.jobId}`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    logger.error("Chyba při zjišťování stavu fine-tuningu:", error.response?.data || error.message);
    res.status(500).json({ error: 'Nepodařilo se získat stav fine-tuningu.' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signál přijat. Ukončování serveru...');
  server.close(() => {
    logger.info('HTTP server uzavřen.');
    process.exit(0);
  });
});

// Server start
const server = app.listen(PORT, () => {
  logger.info(`Server běží na http://localhost:${PORT}`);
});

module.exports = app;