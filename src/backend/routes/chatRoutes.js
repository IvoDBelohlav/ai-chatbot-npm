const express = require('express');
const router = express.Router();
const OpenAIService = require('../config/openai');

router.post('/send', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await OpenAIService.generateResponse(messages);
    
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ message: 'Chyba při generování odpovědi' });
  }
});

module.exports = router;