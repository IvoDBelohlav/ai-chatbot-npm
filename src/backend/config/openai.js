const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(messages) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Chyba při generování odpovědi:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIService();
