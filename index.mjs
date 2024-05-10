import express from 'express';
import axios from 'axios';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { config } from 'dotenv';
import { log } from 'console';

config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_URL_COMPRESSION = 'https://api.openai.com/v1/completions';
const API_URL= 'https://api.openai.com/v1/chat/completions';


let API_KEY;

async function get_token() {
    const tokenPath = path.join(os.homedir(), ".config", "openai.token");
    try {
        const token = (await fs.readFile(tokenPath, "utf8")).trim();
        return token;
    } catch (err) {
        console.error("Error reading openai.token file:", err);
        process.exit(1);
    }
}

async function compressConversation(history) {
    const prompt = `Compress the following text in a way such that you (GPT-4) can reconstruct it as close as possible to the original. Do not make it human readable. Aggressively compress it, while still keeping ALL the information to fully reconstruct it. Use the fewest tokens possible:\n\n${history}`;
    try {
        const response = await axios.post(
          API_URL_COMPRESSION,
            {
                model: "gpt-3.5-turbo-instruct",
                prompt: prompt,
                max_tokens: 100,
                temperature: 0.5
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling OpenAI for compression:', error.response.data);
        return null;
    }
}

async function setup() {
    API_KEY = await get_token();

    app.post('/chat', async (req, res) => {
      const { sessionId, message } = req.body;
      const sessions = req.app.locals.sessions || {};
      
      if (!sessions[sessionId]) {
          sessions[sessionId] = "You are an expert mechanic with over 30 years of experience. I will send you information about what I am facing and you will ask for more information until you have the necessary knowledge to diagnose.";
      }
  
      let currentSession = `${sessions[sessionId]}\nUser: ${message}`;
      let compressedSession = await compressConversation(currentSession);
      if (!compressedSession) {
          return res.status(500).json({ error: 'Compression failed' });
      }
  
      const decompressionPrompt = `I asked you to compress a long text using your own abbreviations, and you replied with: ${compressedSession}. Based on the information you've reconstructed, continue the conversation and help diagnose the car issue. Remember, you are an expert mechanic with over 30 years of experience. Here's what the user just added: "${message}". Please provide your expert analysis.`;
  
      try {
          const response = await axios.post(
              API_URL,
              {
                  model: "gpt-4-turbo",
                  messages: [{ role: "system", content: decompressionPrompt }],
                  max_tokens: 150
              },
              {
                  headers: {
                      'Authorization': `Bearer ${API_KEY}`,
                      'Content-Type': 'application/json'
                  }
              }
          );
          const aiMessage = response.data.choices[0].message.content;
          sessions[sessionId] = compressedSession;
  
          res.json({ response: aiMessage });
      } catch (error) {
          console.error('Error calling OpenAI API for response generation:', error.response.data);
          res.status(500).json({ error: 'Failed to fetch response from AI' });
      }
  });
  

    app.get('/', (req, res) => {
        res.send('Server is running...');
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

setup();
