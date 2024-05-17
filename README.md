# GPT-4 Mechanic Chatbot

This project is a Node.js Express server that uses the OpenAI API to create a chatbot simulating an expert mechanic with over 30 years of experience. The chatbot compresses conversation history to reduce token usage while maintaining context.

## Features
- Compresses conversation history to save tokens
- Uses GPT-4 for generating expert mechanic responses
- Persists conversation context across user sessions

## Technologies Used
- Node.js
- Express
- Axios
- OpenAI API
- dotenv

## Installation

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn
- OpenAI API key

### Clone the Repository
```bash
git clone https://github.com/your-username/gpt4-mechanic-chatbot.git
cd gpt4-mechanic-chatbot
