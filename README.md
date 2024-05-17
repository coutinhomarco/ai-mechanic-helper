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
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Setup Environment Variables
1. Create a `.env` file in the root directory with the following content:
    ```env
    PORT=3000
    ```

2. Save your OpenAI API key in a file named `openai.token` inside the `~/.config` directory. If the directory does not exist, create it:
    ```bash
    mkdir -p ~/.config
    echo "your-openai-api-key" > ~/.config/openai.token
    ```

## Running the Application

### Start the Server
To start the server, run the following command:
```bash
npm run dev
# or
yarn dev
```

This command will use `nodemon` to run the server with the `--experimental-modules` flag for handling ES modules.

### Access the Application
Open your browser and go to `http://localhost:3000`.

## API Endpoints

### `POST /chat`
Initiates a conversation or continues an existing session with the chatbot.

#### Request Body
```json
{
  "sessionId": "unique-session-id",
  "message": "User's message"
}
```

#### Response Body
```json
{
  "response": "AI's response"
}
```

### `GET /`
Simple health check endpoint.

## Future Enhancements
- Add authentication and authorization
- Improve error handling and validation
- Implement more sophisticated session management
