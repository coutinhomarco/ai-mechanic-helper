import express from 'express';
import axios from 'axios';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { configDotenv } from 'dotenv';
configDotenv();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const sessions = {};
export async function get_token() {
    const tokenPath = path.join(os.homedir(), ".config", "openai.token");
    try {
      const token = (await fs.readFile(tokenPath, "utf8")).trim();
      return token;
    } catch (err) {
      if (err.code === "ENOENT") {
        console.error("Error: openai.token file not found in `~/.config/openai.token`.");
        console.error("Please make sure the file exists and contains your OpenAI API token.");
      } else {
        console.error("Error reading openai.token file:", err.message);
      }
      process.exit(1);
    }
  }
const API_KEY = await get_token();

app.post('/chat', async (req, res) => {
    const { sessionId, message } = req.body;
    
    if (!sessions[sessionId]) {
        sessions[sessionId] = [];
    }
    
    sessions[sessionId].push({ role: 'user', content: message });

    try {
        const response = await axios.post(
            API_URL,
            {
                model: "gpt-4-turbo",
                messages: sessions[sessionId]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        const aiMessage = response.data.choices[0].message.content;
        sessions[sessionId].push({ role: 'assistant', content: aiMessage });

        res.json({ response: aiMessage });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to fetch response from AI' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
